from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from bedrock_service import BedrockService
from werkzeug.utils import secure_filename
import tempfile
import time
from botocore.exceptions import ClientError

app = Flask(__name__)
CORS(app)

# BedrockService 초기화
bedrock_service = BedrockService()

# 허용된 파일 확장자
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return jsonify({
        "message": "AI 서버가 정상적으로 실행 중입니다.",
        "endpoints": [
            "POST /api/v1/analyze-food",
            "POST /api/v1/generate-health-report",
            "POST /api/v1/recommend-meal"
        ]
    })

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "service": "AI API Server"})

@app.route('/api/v1/analyze-food', methods=['POST'])
def analyze_food():
    tmp_file_path = None
    try:
        # 파일 검증
        if 'image' not in request.files:
            return jsonify({
                "status": "error",
                "message": "Invalid image format or missing required fields",
                "code": "INVALID_REQUEST"
            }), 400
        
        file = request.files['image']
        time_param = request.form.get('time')
        portion_size = request.form.get('portion_size')
        
        if not file or not time_param or not portion_size:
            return jsonify({
                "status": "error",
                "message": "Invalid image format or missing required fields",
                "code": "INVALID_REQUEST"
            }), 400
        
        if not allowed_file(file.filename):
            return jsonify({
                "status": "error",
                "message": "Invalid image format or missing required fields",
                "code": "INVALID_REQUEST"
            }), 400
        
        # 임시 파일로 저장
        tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
        tmp_file_path = tmp_file.name
        file.save(tmp_file_path)
        tmp_file.close()
        
        # AI 분석 프롬프트
        prompt = f"""
        이 이미지에 있는 모든 음식을 정확히 식별하고 분석해주세요.
        
        각 음식에 대해 다음 정보를 제공해주세요:
        1. 음식명 (정확한 한국어 명칭)
        2. 예상 제공량 (일반적인 1인분 기준)
        3. 가공식품 여부 (공장에서 제조된 식품인지 판단)
        4. 간식 여부 (주식이 아닌 간식류인지 판단)
        
        가공식품 판단 기준:
        - 라면, 과자, 음료수, 햄, 소시지 등 = true
        - 밥, 김치, 나물, 구이류, 찌개 등 = false
        
        간식 판단 기준:
        - 과자, 사탕, 음료수, 아이스크림 등 = true
        - 밥, 반찬, 국물류 등 주식 = false
        
        응답은 반드시 다음 JSON 배열 형식으로만 답변해주세요:
        [
            {{
                "food_name": "음식명",
                "portion_size": "예상 제공량",
                "is_processed": true 또는 false,
                "is_snack": true 또는 false
            }}
        ]
        """
        
        # AI 분석 실행
        result = bedrock_service.analyze_image(tmp_file_path, prompt)
        
        # JSON 파싱 시도
        start_idx = result.find('[')
        end_idx = result.rfind(']') + 1
        if start_idx != -1 and end_idx != 0:
            json_str = result[start_idx:end_idx]
            parsed_result = json.loads(json_str)
            
            return jsonify({
                "status": "success",
                "data": parsed_result
            })
        else:
            raise ValueError("JSON not found in response")
            
    except (json.JSONDecodeError, ValueError):
        return jsonify({
            "status": "error",
            "message": "음식이 감지되지 않았습니다. 음식이 명확히 보이는 사진을 다시 업로드해주세요.",
            "code": "FOOD_NOT_DETECTED"
        }), 422
        
    except Exception as e:
        print(f"Error in analyze_food: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": "AI 분석 중 서버 오류가 발생했습니다.",
            "code": "ANALYSIS_SERVER_ERROR"
        }), 500
        
    finally:
        # 임시 파일 안전하게 삭제
        if tmp_file_path and os.path.exists(tmp_file_path):
            try:
                os.unlink(tmp_file_path)
            except PermissionError:
                pass

@app.route('/api/v1/generate-health-report', methods=['POST'])
def generate_health_report():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "status": "error",
                "message": "Invalid data format or missing required fields",
                "code": "INVALID_DATA"
            }), 400
        
        # 필수 필드 검증
        required_fields = ['times', 'meal_snack', 'processed', 'reco_cal', 'cal_log']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "status": "error",
                    "message": "Invalid data format or missing required fields",
                    "code": "INVALID_DATA"
                }), 400
        
        # 데이터 테이블 생성
        table_rows = []
        for i in range(len(data['times'])):
            day = i + 1
            time_str = data['times'][i]
            cal = data['cal_log'][i] if i < len(data['cal_log']) else 0
            carbo = data.get('carbo_log', [0]*len(data['times']))[i] if i < len(data.get('carbo_log', [])) else 0
            protein = data.get('protein_log', [0]*len(data['times']))[i] if i < len(data.get('protein_log', [])) else 0
            fat = data.get('fat_log', [0]*len(data['times']))[i] if i < len(data.get('fat_log', [])) else 0
            sugar = data.get('sugar_log', [0]*len(data['times']))[i] if i < len(data.get('sugar_log', [])) else 0
            sodium = data.get('sodium_log', [0]*len(data['times']))[i] if i < len(data.get('sodium_log', [])) else 0
            
            table_rows.append(f"{day}일차 | {time_str} | {cal}kcal | {carbo}g | {protein}g | {fat}g | {sugar}g | {sodium}mg")
        
        nutrition_table = "\\n".join(table_rows)
        
        # AI 분석 프롬프트 개선
        prompt = f"""
        다음은 사용자의 식사 데이터입니다. 이를 분석하여 건강 리포트를 생성해주세요.
        
        **일일 권장 영양소 섭취량:**
        - 칼로리: {data['reco_cal']}kcal
        - 탄수화물: {data.get('reco_carbo', 300)}g
        - 단백질: {data.get('reco_protein', 65)}g
        - 지방: {data.get('reco_fat', 50)}g
        - 당류: {data.get('reco_sugar', 25)}g
        - 나트륨: {data.get('reco_sodium', 2000)}mg
        
        **식사 기록:**
        일차 | 시간 | 칼로리 | 탄수화물 | 단백질 | 지방 | 당류 | 나트륨
        {nutrition_table}
        
        **추가 정보:**
        - 식사/간식 칼로리 비율: 식사 {data['meal_snack'][0]}kcal, 간식 {data['meal_snack'][1]}kcal
        - 가공식품/자연식 횟수: 가공식품 {data['processed'][0]}회, 자연식 {data['processed'][1]}회
        
        위 데이터를 바탕으로 다음을 분석해주세요:
        1. 식사 패턴 (시간대, 규칙성 등)
        2. 가공식품과 간식 비율 분석
        3. 권장량 대비 실제 섭취량 비교
        4. 개선 방안 및 추천사항
        
        다음 JSON 형식으로 응답해주세요:
        {{
            "meal_pattern": "식사 패턴 분석 결과 (시간대, 규칙성 등)",
            "processed_snack_ratio": "가공식품과 간식 비율 분석 결과",
            "reco": "권장량 대비 실제 섭취량 비교 및 개선 방안"
        }}
        """
        
        # ThrottlingException 처리를 위한 재시도 로직
        max_retries = 3
        result = None
        for attempt in range(max_retries):
            try:
                result = bedrock_service.chat(prompt)
                break
            except ClientError as e:
                if e.response['Error']['Code'] == 'ThrottlingException' and attempt < max_retries - 1:
                    wait_time = (2 ** attempt) + 1
                    time.sleep(wait_time)
                    continue
                else:
                    raise e
        
        if result is None:
            raise Exception("Failed to get response after retries")
        
        try:
            # JSON 파싱 시도
            start_idx = result.find('{')
            end_idx = result.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = result[start_idx:end_idx]
                parsed_result = json.loads(json_str)
                
                return jsonify({
                    "status": "success",
                    "data": parsed_result
                })
            else:
                # JSON 파싱 실패 시 기본 응답
                return jsonify({
                    "status": "success",
                    "data": {
                        "meal_pattern": "식사 시간 분석이 완료되었습니다.",
                        "processed_snack_ratio": "가공식품 비율 분석이 완료되었습니다.",
                        "reco": "균형잡힌 식사를 권장합니다."
                    }
                })
                
        except json.JSONDecodeError:
            return jsonify({
                "status": "success",
                "data": {
                    "meal_pattern": "식사 시간 분석이 완료되었습니다.",
                    "processed_snack_ratio": "가공식품 비율 분석이 완료되었습니다.",
                    "reco": "균형잡힌 식사를 권장합니다."
                }
            })
            
    except Exception as e:
        print(f"Error in generate_health_report: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": "리포트 생성 중 서버 오류가 발생했습니다.",
            "code": "REPORT_GENERATION_ERROR"
        }), 500

@app.route('/api/v1/recommend-meal', methods=['POST'])
def recommend_meal():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "status": "error",
                "message": "Invalid data format or missing required fields",
                "code": "INVALID_DATA"
            }), 400
        
        # 필수 필드 검증
        required_fields = ['times', 'meal_snack', 'processed', 'reco_cal', 'cal_log']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "status": "error",
                    "message": "Invalid data format or missing required fields",
                    "code": "INVALID_DATA"
                }), 400
        
        # 데이터 테이블 생성 (3일간)
        table_rows = []
        for i in range(len(data['times'])):
            day = i + 1
            time_str = data['times'][i]
            cal = data['cal_log'][i] if i < len(data['cal_log']) else 0
            carbo = data.get('carbo_log', [0]*len(data['times']))[i] if i < len(data.get('carbo_log', [])) else 0
            protein = data.get('protein_log', [0]*len(data['times']))[i] if i < len(data.get('protein_log', [])) else 0
            fat = data.get('fat_log', [0]*len(data['times']))[i] if i < len(data.get('fat_log', [])) else 0
            sugar = data.get('sugar_log', [0]*len(data['times']))[i] if i < len(data.get('sugar_log', [])) else 0
            sodium = data.get('sodium_log', [0]*len(data['times']))[i] if i < len(data.get('sodium_log', [])) else 0
            
            table_rows.append(f"{day}일차 | {time_str} | {cal}kcal | {carbo}g | {protein}g | {fat}g | {sugar}g | {sodium}mg")

        nutrition_table = "\\n".join(table_rows)

        # AI 분석 프롬프트 개선
        prompt = f"""
        다음은 사용자의 3일간 식사 데이터입니다. 이를 분석하여 다음 끼니에 대한 식사 추천을 해주세요.

        **일일 권장 영양소 섭취량:**
        - 칼로리: {data['reco_cal']}kcal
        - 탄수화물: {data.get('reco_carbo', 300)}g
        - 단백질: {data.get('reco_protein', 65)}g
        - 지방: {data.get('reco_fat', 50)}g
        - 당류: {data.get('reco_sugar', 25)}g
        - 나트륨: {data.get('reco_sodium', 2000)}mg

        **3일간 식사 기록:**
        일차 | 시간 | 칼로리 | 탄수화물 | 단백질 | 지방 | 당류 | 나트륨
        {nutrition_table}

        **추가 정보:**
        - 식사/간식 칼로리 비율: 식사 {data['meal_snack'][0]}kcal, 간식 {data['meal_snack'][1]}kcal
        - 가공식품/자연식 횟수: 가공식품 {data['processed'][0]}회, 자연식 {data['processed'][1]}회

        위 데이터를 바탕으로 다음 끼니에 대한 구체적이고 실용적인 식사 추천을 해주세요:
        1. 권장량 대비 부족하거나 과다한 영양소 파악
        2. 가공식품 섭취 빈도 고려
        3. 균형잡힌 영양소 구성을 위한 구체적인 음식 추천
        4. 실천 가능한 식사 메뉴 제안

        3-4줄로 간결하고 실용적인 추천사항을 작성해주세요.
        """
        
        # ThrottlingException 처리를 위한 재시도 로직
        max_retries = 3
        result = None
        for attempt in range(max_retries):
            try:
                result = bedrock_service.chat(prompt)
                break
            except ClientError as e:
                if e.response['Error']['Code'] == 'ThrottlingException' and attempt < max_retries - 1:
                    wait_time = (2 ** attempt) + 1
                    time.sleep(wait_time)
                    continue
                else:
                    raise e
        
        if result is None:
            raise Exception("Failed to get response after retries")
        
        return jsonify({
            "status": "success",
            "data": {
                "reco": result.strip()
            }
        })
            
    except Exception as e:
        print(f"Error in recommend_meal: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": "식사 추천 생성 중 서버 오류가 발생했습니다.",
            "code": "RECOMMENDATION_ERROR"
        }), 500

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
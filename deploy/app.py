from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from bedrock_service import BedrockService
from werkzeug.utils import secure_filename
import tempfile
import time
from botocore.exceptions import ClientError
import requests

app = Flask(__name__)
CORS(app)

# BedrockService 초기화
bedrock_service = BedrockService()

# 허용된 파일 확장자
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_food_nutrition(food_name):
    # SSL 경고 무시
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    try:
        base_url = "https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo02/getFoodNtrCpntDbInq02"
        params = {
            "serviceKey": "0c3a58a00c706c24b262f34ac5a1367467fd6b075a8e2466c8273a064084edb1",
            "FOOD_NM_KR": food_name,
            "numOfRows": 1,
            "type": "json"
        }

        # Postman과 동일한 설정
        import ssl
        from requests.adapters import HTTPAdapter
        from requests.packages.urllib3.util.retry import Retry
        
        # SSL 컨텍스트 설정 (Postman 스타일)
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        ssl_context.set_ciphers('DEFAULT@SECLEVEL=1')  # 암호화 레벨 낮춤
        
        class PostmanStyleAdapter(HTTPAdapter):
            def init_poolmanager(self, *args, **kwargs):
                kwargs['ssl_context'] = ssl_context
                kwargs['cert_reqs'] = 'CERT_NONE'
                return super().init_poolmanager(*args, **kwargs)
        
        # 재시도 설정
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504]
        )
        
        session = requests.Session()
        adapter = PostmanStyleAdapter(max_retries=retry_strategy)
        session.mount('https://', adapter)
        session.mount('http://', adapter)
        session.verify = False
        
        # Postman 스타일 헤더
        headers = {
            'User-Agent': 'PostmanRuntime/7.32.3',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
        }
        
        response = session.get(base_url, params=params, headers=headers, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        
        if data['header']['resultCode'] == '00' and len(data['body']['items']) > 0:
            item = data['body']['items'][0]
            
            return {
                "calories": float(item['AMT_NUM1']),
                "carbohydrates": float(item['AMT_NUM6']),
                "protein": float(item['AMT_NUM3']), 
                "fat": float(item['AMT_NUM4']),
                "sugar": float(item['AMT_NUM7']),
                "sodium": float(item['AMT_NUM13']),
                "fiber": float(item['AMT_NUM8']) if item['AMT_NUM8'] else 0
            }
        else:
            return {
            "calories": 0,
            "carbohydrates": 0,
            "protein": 0,
            "fat": 0,
            "sugar": 0,
            "sodium": 0,
            "fiber": 0
        }

    except requests.RequestException as e:
        print(e)
        return {
            "calories": 0,
            "carbohydrates": 0,
            "protein": 0,
            "fat": 0,
            "sugar": 0,
            "sodium": 0,
            "fiber": 0
        }

def get_dummy_nutrition(food_name):
    """음식명에 따른 더미 영양 정보 반환"""
    nutrition_db = {
        '피자': {
            "calories": 35,
            "carbohydrates": 7.0,
            "protein": 1.5,
            "fat": 0.5,
            "sugar": 1.0,
            "sodium": 800,
            "fiber": 2.5
        },
        '햄버거': {
            "calories": 218,
            "carbohydrates": 44.8,
            "protein": 4.5,
            "fat": 1.8,
            "sugar": 0.8,
            "sodium": 2,
            "fiber": 3.5
        },
        '김밥': {
            "calories": 250,
            "carbohydrates": 35.0,
            "protein": 8.0,
            "fat": 8.5,
            "sugar": 2.0,
            "sodium": 450,
            "fiber": 2.0
        },
        '라면': {
            "calories": 380,
            "carbohydrates": 55.0,
            "protein": 9.0,
            "fat": 14.0,
            "sugar": 3.0,
            "sodium": 1200,
            "fiber": 1.5
        },
        '비빔밥': {
            "calories": 320,
            "carbohydrates": 48.0,
            "protein": 12.0,
            "fat": 9.0,
            "sugar": 4.0,
            "sodium": 650,
            "fiber": 4.0
        }
    }
    
    # 기본값 (음식을 찾을 수 없는 경우)
    default_nutrition = {
        "calories": 200,
        "carbohydrates": 30.0,
        "protein": 8.0,
        "fat": 6.0,
        "sugar": 2.0,
        "sodium": 400,
        "fiber": 2.0
    }
    
    return nutrition_db.get(food_name, default_nutrition)

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
        time = request.form.get('time')
        portion_size = request.form.get('portion_size')
        
        if not file or not time or not portion_size:
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
        이미지에 있는 어떤이 음식이 있는지 요리 단위로 조사하십시오.
        
        각 음식명 마다 아래의 정보가 모두 포함되도록 정보를 추출하십시오.
        1. 음식명 (한국어)
        2. 제공량 (예상되는 양)
        3. 가공식품 여부 (true/false)
        4. 간식 여부 (true/false)
        
        응답은 반드시 다음 JSON 형식으로만 답변해주세요:
        [
            {
                {
                "food_name": "음식명(ex.김밥)",
                "portion_size": "예상 제공량",
                "is_processed": "true 또는 false",
                "is_snack": "true 또는 false"
                },
                {
                "food_name": "음식명(ex.라면)",
                "portion_size": "예상 제공량",
                "is_processed": "true 또는 false",
                "is_snack": "true 또는 false"
                },
            }
        ]
        """
        
        # AI 분석 실행
        result = bedrock_service.analyze_image(tmp_file_path, prompt)
        
        # JSON 파싱 시도
        start_idx = result.find('[')
        end_idx = result.rfind(']') + 1
        if start_idx != -1 and end_idx != 0:
            json_str = result[start_idx:end_idx]
            json_str = json_str.replace("'", '"')
    
            parsed_result = json.loads(json_str)
            
            # 영양 정보 추가
            for food_item in parsed_result:
                food_item['nutrition'] = get_food_nutrition(food_item['food_name'])
            
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
        
        # AI 분석 프롬프트
        table_rows = []
        for i in range(len(data['times'])):
            day = i + 1
            time_str = data['times'][i]
            cal = data['cal_log'][i]
            carbo = data['carbo_log'][i]
            protein = data['protein_log'][i]
            fat = data['fat_log'][i]
            sugar = data['sugar_log'][i]
            sodium = data['sodium_log'][i]
            
            table_rows.append(f"{day}일차 | {time_str} | {cal}kcal | {carbo}g | {protein}g | {fat}g | {sugar}g | {sodium}mg")

        nutrition_table = "\n".join(table_rows)

        # AI 분석 프롬프트 개선
        prompt = f"""
        다음은 사용자의 식사 데이터입니다. 이를 분석하여 건강 리포트를 생성해주세요.

        **일일 권장 영양소 섭취량:**
        - 칼로리: {data['reco_cal']}kcal
        - 탄수화물: {data['reco_carbo']}g
        - 단백질: {data['reco_protein']}g
        - 지방: {data['reco_fat']}g
        - 당류: {data['reco_sugar']}g
        - 나트륨: {data['reco_sodium']}mg

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
        
        try:
            # JSON 파싱 시도
            start_idx = result.find('{')
            end_idx = result.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = result[start_idx:end_idx]
                json_str = json_str.replace("'", '"')

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
        
        # AI 분석 프롬프트
        table_rows = []
        for i in range(len(data['times'])):
            day = i + 1
            time_str = data['times'][i]
            cal = data['cal_log'][i]
            carbo = data['carbo_log'][i]
            protein = data['protein_log'][i]
            fat = data['fat_log'][i]
            sugar = data['sugar_log'][i]
            sodium = data['sodium_log'][i]
            
            table_rows.append(f"{day}일차 | {time_str} | {cal}kcal | {carbo}g | {protein}g | {fat}g | {sugar}g | {sodium}mg")

        nutrition_table = "\n".join(table_rows)

        # AI 분석 프롬프트 개선
        prompt = f"""
        다음은 사용자의 식사 데이터입니다. 이를 분석하여 다음 끼니에 대한 식사 추천을 해주세요.

        **일일 권장 영양소 섭취량:**
        - 칼로리: {data['reco_cal']}kcal
        - 탄수화물: {data['reco_carbo']}g
        - 단백질: {data['reco_protein']}g
        - 지방: {data['reco_fat']}g
        - 당류: {data['reco_sugar']}g
        - 나트륨: {data['reco_sodium']}mg

        **식사 기록:**
        일차 | 시간 | 칼로리 | 탄수화물 | 단백질 | 지방 | 당류 | 나트륨
        {nutrition_table}

        **추가 정보:**
        - 식사/간식 칼로리 비율: 식사 {data['meal_snack'][0]}kcal, 간식 {data['meal_snack'][1]}kcal
        - 가공식품/자연식 횟수: 가공식품 {data['processed'][0]}회, 자연식 {data['processed'][1]}회

        위 데이터를 바탕으로 다음 끼니에 대한 구체적인 식사 메뉴 3가지 이상을 추천해주세요:
        1. 권장량 대비 부족하거나 과다한 영양소 파악
        2. 가공식품 섭취 빈도 고려
        3. 균형잡힌 영양소 구성을 위한 구체적인 음식 추천
        4. 실천 가능한 식사 메뉴 제안
        5. 대중적으로 인기 있는 메뉴로 추천

        다음 JSON 형식으로 응답해주세요:
        {{
            "menu": ["추천 메뉴 1", "추천 메뉴 2", "추천 메뉴 3"],
            "reason": "메뉴 선정 이유 및 영양학적 근거"
        }}
        """
        
        # ThrottlingException 처리를 위한 재시도 로직
        max_retries = 3
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
        
        try:
            # JSON 파싱 시도
            start_idx = result.find('{')
            end_idx = result.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = result[start_idx:end_idx]
                json_str = json_str.replace("'", '"')

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
                        "menu": ["현미밥과 구운 연어", "두부 샐러드", "닭가슴살 볶음"],
                        "reason": "균형잡힌 영양소 섭취를 위한 추천입니다."
                    }
                })
                
        except json.JSONDecodeError:
            return jsonify({
                "status": "success",
                "data": {
                    "menu": ["현미밥과 구운 연어", "두부 샐러드", "닭가슴살 볶음"],
                    "reason": "균형잡힌 영양소 섭취를 위한 추천입니다."
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

@app.route('/api/v1/analyze-barcode', methods=['POST'])
def analyze_barcode():
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
        
        if not file or not allowed_file(file.filename):
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

        # 바코드 분석 프롬프트
        prompt = """
        이미지를 분석하여 바코드가 있는지 확인하고, 바코드 번호를 추출해주세요.

        다음 JSON 형식으로만 응답해주세요:
        {
            "has_barcode": true 또는 false,
            "barcode_number": "바코드 번호 (숫자만, 바코드가 없으면 null)",
            "barcode_type": "바코드 타입 (EAN-13, UPC-A 등, 없으면 null)"
        }

        주의사항:
        - 바코드가 명확하게 보이지 않으면 has_barcode를 false로 설정
        - 바코드 번호는 숫자만 추출 (공백, 하이픈 제거)
        - JSON 형식을 정확히 지켜주세요
        """
        
        barcode_result = bedrock_service.analyze_image(tmp_file_path, prompt)

        # JSON 파싱 시도
        start_idx = barcode_result.find('{')
        end_idx = barcode_result.rfind('}') + 1
        if start_idx != -1 and end_idx != 0:
            json_str = barcode_result[start_idx:end_idx]
            json_str = json_str.replace("'", '"')

            parsed_result = json.loads(json_str)
            
            # has_barcode가 true인 경우에만 바코드 번호 반환
            if parsed_result.get('has_barcode'):
                barcode = parsed_result.get('barcode_number')
        
            # Open Food Facts API 호출
            api_url = f"https://world.openfoodfacts.org/api/v0/product/{barcode.strip()}"
            response = requests.get(api_url)
            
            if response.status_code == 200:
                data = response.json()
                
                if data['status'] == 1:
                    product = data['product']
                    
                    # 필요한 정보 추출
                    result = [
                        {
                        "food_name": product.get('product_name', ''),
                        "portion_size": product.get('serving_size', '100g'),
                        "nutrition": {
                            "calories": float(product.get('nutriments', {}).get('energy-kcal_100g', 0)),
                            "carbohydrates": float(product.get('nutriments', {}).get('carbohydrates_100g', 0)),
                            "protein": float(product.get('nutriments', {}).get('proteins_100g', 0)),
                            "fat": float(product.get('nutriments', {}).get('fat_100g', 0)),
                            "sugar": float(product.get('nutriments', {}).get('sugars_100g', 0)),
                            "sodium": float(product.get('nutriments', {}).get('sodium_100g', 0)),
                            "fiber": float(product.get('nutriments', {}).get('fiber_100g', 0))
                        },
                        "is_snack": "true"
                        }
                    ]
                    
                    return jsonify({
                        "status": "success",
                        "data": result
                    })
                else:
                    return jsonify({
                        "status": "error",
                        "message": "바코드가 감지되지 않았거나 제품 정보를 찾을 수 없습니다.",
                        "code": "BARCODE_NOT_FOUND"
                    })
            else:
               return jsonify({
                        "status": "error",
                        "message": "API 요청 실패 또는 제품을 찾을 수 없습니다.",
                        "code": "API_ERROR"
                    })       

    except Exception as e:
        print(f"Error in analyze_barcode: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": "바코드 인식 중 오류가 발생했습니다.",
            "code": "ANALYSIS_SERVER_ERROR"
        }), 500

    finally:
        # 임시 파일 안전하게 삭제
        if tmp_file_path and os.path.exists(tmp_file_path):
            try:
                os.unlink(tmp_file_path)
            except PermissionError:
                pass

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
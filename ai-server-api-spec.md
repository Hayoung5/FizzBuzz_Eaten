# AI API 정의서

## 1. 음식사진 분석 API

### 엔드포인트
```
POST /api/v1/analyze-food
```

### 요청 (Request)

**Content-Type**: `multipart/form-data`

**Parameters**:
- `image` (file, required): 음식 사진 파일 (jpg, png, webp)
- `time` (string, required): 촬영/섭취 시간 (ISO 8601 format)
- `portion_size` (string, required): 예상 제공량 정보

**Example Request**:
```bash
curl -X POST "https://ai-server.example.com/api/v1/analyze-food" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@food_image.jpg" \
  -F "time=2025-09-04T12:00:00Z" \
  -F "portion_size=1회 제공량"
```

### 응답 (Response)

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "food_name": "배추김치",
    "portion_size": "1회 제공량 (100g)",
    "nutrition": {
      "calories": 35,
      "carbohydrates": 7.0,
      "protein": 1.5,
      "fat": 0.5,
      "sugar": 1.0,
      "sodium": 800,
      "fiber": 2.5
    }
  }
}
```

**Nutrition Object**:
- `calories` (number): 칼로리 (kcal)
- `carbohydrates` (number): 탄수화물 (g)
- `protein` (number): 단백질 (g)
- `fat` (number): 지방 (g)
- `sugar` (number): 당류 (g)
- `sodium` (number): 나트륨 (mg)
- `fiber` (number): 식이섬유 (g)

**Error Response (400 Bad Request)**:
```json
{
  "status": "error",
  "message": "Invalid image format or missing required fields",
  "code": "INVALID_REQUEST"
}
```

**Error Response (422 Unprocessable Entity) - 음식 미발견**:
```json
{
  "status": "error",
  "message": "음식이 감지되지 않았습니다. 음식이 명확히 보이는 사진을 다시 업로드해주세요.",
  "code": "FOOD_NOT_DETECTED"
}
```

**Error Response (404 Not Found) - 영양정보 미발견**:
```json
{
  "status": "error",
  "message": "음식은 인식되었지만 해당 음식의 영양정보를 찾을 수 없습니다.",
  "code": "NUTRITION_INFO_NOT_FOUND",
  "data": {
    "detected_food": "인식된 음식명"
  }
}
```

**Error Response (500 Internal Server Error)**:
```json
{
  "status": "error",
  "message": "AI 분석 중 서버 오류가 발생했습니다.",
  "code": "ANALYSIS_SERVER_ERROR"
}
```

## 2. 건강리포트 생성 API

### 엔드포인트
```
POST /api/v1/generate-health-report
```

### 요청 (Request)

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "times": ["2025-09-01T08:00:00Z", "2025-09-01T12:30:00Z", "2025-09-01T115:30:00Z"],
  "meal_snack": [14320, 600],
  "processed": [12, 8],
  "reco_cal": 2400,
  "reco_carbo": 300,
  "reco_protein": 65,
  "reco_fat": 50,
  "reco_sugar": 25,
  "reco_sodium": 2000,
  "cal_log": [2200, 2300, 2500, 2100, 2000, 2400, 2600],
  "carbo_log": [280, 310, 295, 270, 260, 300, 310],
  "protein_log": [60, 70, 65, 55, 50, 68, 72],
  "fat_log": [45, 52, 50, 40, 42, 55, 60],
  "sugar_log": [20, 22, 18, 25, 30, 28, 27],
  "sodium_log": [1900, 2100, 2200, 1800, 2000, 2300, 2400]
}
```

**Example Request**:
```bash
curl -X POST "https://ai-server.example.com/api/v1/generate-health-report" \
  -H "Content-Type: application/json" \
  -d @health_data.json
```

### 응답 (Response)

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "meal_pattern": "식사 시간이 비교적 규칙적이나, 늦은 저녁 섭취가 잦습니다.",
    "processed_snack_ratio": "최근 7일간 가공식품 비율은 55%, 간식 비율은 30%입니다.",
    "reco": "다음 끼니에는 단백질이 풍부한 식품(두부, 계란, 생선)을 포함하면 좋습니다."
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "status": "error",
  "message": "Invalid data format or missing required fields",
  "code": "INVALID_DATA"
}
```

**Error Response (500 Internal Server Error)**:
```json
{
  "status": "error",
  "message": "리포트 생성 중 서버 오류가 발생했습니다.",
  "code": "REPORT_GENERATION_ERROR"
}
```

### 데이터 타입 정의

**Request Parameters**:
- `times` (array): 7일간 식사 시간 목록 (ISO 8601 format)
- `meal_snack` (array): [식사 칼로리, 간식 칼로리] 7일 누적
- `processed` (array): [가공식품 횟수, 자연식 횟수] 7일 누적
- `reco_*` (number): 1일 권장량 (칼로리, 탄수화물, 단백질, 지방, 당, 나트륨)
- `*_log` (array): 7일간 각 영양소 섭취량 기록

## 3. 식사 추천 API

### 엔드포인트
```
POST /api/v1/recommend-meal
```

### 요청 (Request)

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "times": ["2025-09-03T08:00:00Z", "2025-09-03T12:30:00Z"],
  "meal_snack": [6120, 300],
  "processed": [5, 4],
  "reco_cal": 2400,
  "reco_carbo": 300,
  "reco_protein": 65,
  "reco_fat": 50,
  "reco_sugar": 25,
  "reco_sodium": 2000,
  "cal_log": [2200, 2300, 2500],
  "carbo_log": [280, 310, 295],
  "protein_log": [60, 70, 65],
  "fat_log": [45, 52, 50],
  "sugar_log": [20, 22, 18],
  "sodium_log": [1900, 2100, 2200]
}
```

**Example Request**:
```bash
curl -X POST "https://ai-server.example.com/api/v1/recommend-meal" \
  -H "Content-Type: application/json" \
  -d @meal_data.json
```

### 응답 (Response)

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "reco": "다음 끼니에는 단백질이 풍부한 식품(두부, 계란, 생선)을 포함하면 좋습니다.\n최근 3일간 나트륨 섭취가 높으니 저염 식품을 선택해보세요.\n신선한 채소와 과일을 추가하여 식이섬유를 보충하는 것을 권장합니다."
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "status": "error",
  "message": "Invalid data format or missing required fields",
  "code": "INVALID_DATA"
}
```

**Error Response (500 Internal Server Error)**:
```json
{
  "status": "error",
  "message": "식사 추천 생성 중 서버 오류가 발생했습니다.",
  "code": "RECOMMENDATION_ERROR"
}
```

### 데이터 타입 정의

**Request Parameters (3일간 데이터)**:
- `times` (array): 3일간 식사 시간 목록 (ISO 8601 format)
- `meal_snack` (array): [식사 칼로리, 간식 칼로리] 3일 누적
- `processed` (array): [가공식품 횟수, 자연식 횟수] 3일 누적
- `reco_*` (number): 1일 권장량 (칼로리, 탄수화물, 단백질, 지방, 당, 나트륨)
- `*_log` (array): 3일간 각 영양소 섭취량 기록

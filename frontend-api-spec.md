# Frontend-Backend API 정의서

### 1. 사용자 정보 등록

**POST** `/api/user_info`

- **요청 (Request)**
    
    ```json
    {
      "age": 25,
      "gender": "male",         // enum: ["male", "female"]
      "activity": "medium"      // enum: ["low", "medium", "high"]
    }
    
    ```
    
- **응답 (Response)**
    
    ```json
    {
      "user_id": 1234
    }
    ```
    

---

### 2. 음식 사진 분석

**POST** `/api/photo_analy`

- **요청 (Request)**
    - Content-Type: `multipart/form-data`
    - Body:
        - `user_id`: integer
        - `time`: string (ISO 8601 timestamp, 예: `"2025-09-04T12:00:00Z"`)
        - `photo`: file (jpg/png 등 이미지 파일)
        - `portion_size`: string (optional, null 가능)
    
    예시 (JSON 표현):
    
    ```json
    {
      "user_id": 1234,
      "time": "2025-09-04T12:00:00Z",
      "portion_size": "1회 제공량"
    }
    ```
    
- **응답 (Response)**
    
    ```json
    {
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
    
    ```
    
- **실패 1: 사진 분석 실패 (422 Unprocessable Entity)**
    
    ```json
    {
      "error_code": "ANALYSIS_FAILED",
      "message": "사진에서 음식을 인식하지 못했습니다. 다른 사진을 다시 업로드해주세요."
    }
    ```
    
- **실패 2: 영양정보 조회 실패 (404 Not Found)**
    
    ```json
    {
      "error_code": "NUTRITION_NOT_FOUND",
      "message": "음식은 인식했지만 영양정보를 찾을 수 없습니다. 비슷한 음식으로 다시 시도해주세요."
    }
    ```
    

---

### 3. 사용자 통계 조회

**GET** `/api/statistics`

- **요청 (Request)**
    
    ```
    /api/statistics?user_id=1234
    
    ```
    
- **응답 (Response)**
    
    ```json
    {
      "times": ["2025-09-01T08:00:00Z", "2025-09-01T12:30:00Z"], // [7일간 식사 시간]
      "meal_snack": [14320, 600],     // [(7일 누적) 식사 칼로리, 간식 칼로리]
      "processed": [12, 8],           // [(7일 누적) 가공식품 횟수, 자연식 횟수]
      "reco_cal": 2400,               // 1일 칼로리 권장량
      "reco_carbo": 300,              // 1일 탄수화물 권장량
      "reco_protein": 65,              // 1일 단백질 권장량
      "reco_fat": 50,              // 1일 지방 권장량
      "reco_sugar": 25,              // 1일 당 권장량
      "reco_sodium": 2000,              // 1일 나트륨 권장량
      "cal_log": [2200, 2300, 2500, 2100, 2000, 2400, 2600],  //7일간 칼로리 섭취량
      "carbo_log": [280, 310, 295, 270, 260, 300, 310],
      "protein_log": [60, 70, 65, 55, 50, 68, 72],
      "fat_log": [45, 52, 50, 40, 42, 55, 60],
      "sugar_log": [20, 22, 18, 25, 30, 28, 27],
      "sodium_log": [1900, 2100, 2200, 1800, 2000, 2300, 2400]
    }
    
    ```
    

---

### 4. 건강 리포트 조회

**GET** `/api/report`

- **요청 (Request)**
    
    ```
    /api/report?user_id=1234
    
    ```
    
- **응답 (Response)**
    
    ```json
    {
      "meal_pattern": "식사 시간이 비교적 규칙적이나, 늦은 저녁 섭취가 잦습니다.",
      "processed_snack_ratio": "최근 7일간 가공식품 비율은 55%, 간식 비율은 30%입니다.",
      "reco": "다음 끼니에는 단백질이 풍부한 식품(두부, 계란, 생선)을 포함하면 좋습니다.",
      "ratio": [90, 75, 80, 120, 110] //7일간 권장량 대비 칼로리,단백질,당,탄수,나트륨 비율
    }
    
    ```
    

---

### 5. 다음끼니 식사 추천

**GET** `/api/meal_reco`

- **요청 (Request)**
    
    ```
    /api/meal_reco?user_id=1234
    
    ```
    
- **응답 (Response)**
    
    ```json
    {
      "reco": "다음 끼니에는 단백질이 풍부한 식품(두부, 계란, 생선)을 포함하면 좋습니다.(여러줄)",
    }
    
    ```

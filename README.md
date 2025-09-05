# FizzBuzz Eaten - AI 기반 음식 분석 및 영양 관리 시스템

Amazon Q Developer Hackathon으로 구현한 AI 기반 음식 분석 및 개인화된 영양 관리 어플리케이션입니다.

## 어플리케이션 개요

사용자가 음식 사진을 업로드하면 AI가 음식을 인식하고 영양정보를 분석하여, 개인화된 건강 리포트와 식사 추천을 제공하는 서비스입니다.

## 🚀 개발 환경 설정

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd FizzBuzz_Eaten
```

### 2. 데이터베이스 설정
```bash
# MySQL 데이터베이스 생성
mysql -u root -e "CREATE DATABASE fizzbuzz_eaten;"

# 덤프 파일로 테이블 및 더미 데이터 복원
mysql -u root fizzbuzz_eaten < fizzbuzz_eaten_dump.sql
```

### 3. 환경변수 설정
```bash
cd backend
cp .env.example .env
```

`.env` 파일에 실제 값 입력:
```
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fizzbuzz_eaten

# AI Server Configuration
AI_SERVER_URL=http://localhost:5001

# Server Configuration
PORT=3000

# Kakao OAuth Configuration
KAKAO_CLIENT_ID=your_kakao_rest_api_key
JWT_SECRET=your_jwt_secret_key
```

### 4. 백엔드 서버 실행
```bash
cd backend
npm install
npm start
```

### 5. API 테스트
서버 실행 후 다음 URL들로 테스트 가능:
- `GET http://localhost:3000/api/user_info/1` - 사용자 정보 조회
- `GET http://localhost:3000/api/statistics?user_id=1` - 7일간 영양 통계
- `GET http://localhost:3000/api/report?user_id=1` - AI 건강 리포트
- `GET http://localhost:3000/api/meal_reco?user_id=1` - 식사 추천
- `GET http://localhost:3000/api/auth/kakao` - 카카오 로그인

## 프로젝트 구조

```
FizzBuzz_Eaten/
├── backend/                          # Node.js 백엔드 서버
│   ├── src/
│   │   ├── app.js                   # 메인 애플리케이션 (Express 서버 설정)
│   │   ├── controllers/             # API 요청 처리 로직
│   │   │   ├── userController.js    # 사용자 등록/조회 처리
│   │   │   ├── photoController.js   # 음식 사진 분석 처리 (AI 연동)
│   │   │   ├── statsController.js   # 통계/리포트 처리 (AI 연동)
│   │   │   └── authController.js    # OAuth 인증 처리
│   │   ├── routes/                  # API 라우팅
│   │   │   ├── userRoutes.js        # 사용자 관련 라우트
│   │   │   ├── photoRoutes.js       # 사진 분석 라우트
│   │   │   ├── statsRoutes.js       # 통계/리포트 라우트
│   │   │   └── authRoutes.js        # 인증 라우트
│   │   ├── models/                  # 데이터 모델
│   │   │   ├── User.js              # 사용자 데이터 관리 (권장량 계산 포함)
│   │   │   └── FoodLog.js           # 음식 로그 데이터 관리
│   │   ├── services/                # 비즈니스 로직
│   │   │   ├── foodAnalysisService.js # AI 음식 분석 서비스
│   │   │   └── statsService.js      # 통계/추천 서비스 (실제 DB 기반)
│   │   ├── clients/                 # 외부 서비스 클라이언트
│   │   │   └── aiClient.js          # AI 서버 HTTP 클라이언트
│   │   ├── config/                  # 설정 파일
│   │   │   ├── aiServer.js          # AI 서버 연결 설정
│   │   │   ├── database.js          # MySQL 데이터베이스 연결
│   │   │   └── passport.js          # Passport OAuth 설정
│   │   ├── data/                    # 정적 데이터
│   │   │   └── nutrition-recommendations.json # 나이/성별/활동량별 권장량
│   │   └── middleware/              # 미들웨어
│   │       ├── upload.js            # 파일 업로드 처리
│   │       └── auth.js              # JWT 인증 미들웨어
│   ├── uploads/                     # 업로드된 이미지 파일 저장소
│   ├── package.json                 # 의존성 및 스크립트 정의
│   ├── .env.example                 # 환경변수 예시 파일
│   └── .gitignore                   # Git 제외 파일 목록
├── database/                        # 데이터베이스 관련 파일
│   ├── schema.sql                   # 테이블 스키마 정의
│   ├── dummy_data.sql               # 기본 더미 데이터
│   └── additional_dummy_data.sql    # 7일간 추가 더미 데이터
├── fizzbuzz_eaten_dump.sql          # 전체 DB 덤프 파일 (개발환경 구축용)
├── frontend-api-spec.md             # 프론트엔드-백엔드 API 명세서
├── ai-server-api-spec.md            # AI 서버 API 명세서
├── swagger.yaml                     # Swagger API 문서
└── README.md                        # 프로젝트 문서 (현재 파일)
```

## API 엔드포인트

### 사용자 관리
- `POST /api/user_info` - 사용자 정보 등록 (나이, 성별, 활동량 → 자동 권장량 계산)
- `GET /api/user_info/:id` - 사용자 정보 조회

### 인증 (OAuth 2.0)
- `GET /api/auth/kakao` - 카카오 로그인 시작
- `GET /api/auth/kakao/callback` - 카카오 콜백 처리
- `POST /api/auth/complete-signup` - 신규 사용자 추가 정보 등록
- `GET /api/auth/me` - 내 정보 조회 (JWT 토큰 필요)
- `POST /api/auth/logout` - 로그아웃

### 음식 분석 (AI 연동)
- `POST /api/photo_analy` - 음식 사진 업로드 및 AI 분석

### 통계 및 리포트 (실제 DB 기반)
- `GET /api/statistics` - 7일간 영양소 섭취 통계 (개인별 권장량 포함)
- `GET /api/report` - AI 기반 건강 리포트 생성 (실제 ratio 계산)
- `GET /api/meal_reco` - AI 기반 개인화된 식사 추천

## 주요 기능

### ✅ 구현 완료된 기능

1. **카카오 OAuth 2.0 인증 시스템**
   - 카카오 로그인/회원가입
   - JWT 토큰 기반 인증
   - 신규 사용자 추가 정보 입력 플로우

2. **개인화된 영양 권장량 시스템**
   - 나이, 성별, 활동량별 권장량 자동 계산
   - 칼로리, 탄수화물, 단백질, 지방, 당, 나트륨, 식이섬유 권장량 제공

3. **AI 서버 연동**
   - HTTP 클라이언트 기반 실제 AI 서버 통신
   - 음식 분석, 건강 리포트, 식사 추천 API 구현
   - 에러 처리 및 타임아웃 설정

4. **실제 데이터 기반 통계 시스템**
   - 최근 7일간 식사 기록 분석
   - 식사/간식 분류, 가공식품/자연식품 집계
   - 일별 영양소 섭취량 추적

5. **건강 리포트 생성**
   - 권장량 대비 실제 섭취 비율 계산
   - 개인별 맞춤 분석 결과 제공

6. **데이터베이스 연동**
   - MySQL 기반 사용자 및 식사 기록 관리
   - OAuth 사용자 정보 저장
   - 가공식품/간식 분류 정보 저장

### 🚧 구현 예정 기능
- 프론트엔드 개발
- AWS 배포
- 추가 OAuth 제공자 (구글, 네이버)

## 데이터베이스 스키마

### users 테이블
- 사용자 기본 정보 (나이, 성별, 활동량)
- OAuth 정보 (provider, oauth_id, email, name)
- 개인별 영양 권장량 (자동 계산)

### food_logs 테이블
- 식사 기록 (음식명, 영양정보, 섭취 시간)
- 가공식품/간식 분류 정보
- 이미지 경로

## 더미 데이터

현재 user_id 1의 7일간(8월 29일~9월 5일) 식사 기록 20개가 포함되어 있습니다:
- 다양한 음식 종류 (한식, 양식, 간식 등)
- 가공식품/자연식품 분류
- 식사/간식 구분
- 실제 영양정보 기반 데이터

## 기술 스택

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: Passport.js (Kakao OAuth 2.0), JWT
- **AI Integration**: Axios 기반 HTTP 클라이언트
- **File Upload**: Multer (이미지 파일 처리)
- **Session**: express-session

## 인증 플로우

### 신규 사용자
1. 카카오 로그인 → 추가 정보 입력 페이지 리다이렉트
2. 나이/성별/활동량 입력 → 사용자 생성 완료
3. JWT 토큰 발급 → 서비스 이용

### 기존 사용자
1. 카카오 로그인 → JWT 토큰 발급
2. 바로 서비스 이용

## 프로젝트 기대 효과 및 예상 사용 사례

- **개인 건강 관리**: 일상적인 식사 기록을 통한 영양 관리
- **다이어트 지원**: AI 기반 맞춤형 식단 추천
- **건강한 식습관 형성**: 데이터 기반 식습관 개선 제안
- **소셜 로그인**: 간편한 회원가입 및 로그인 경험

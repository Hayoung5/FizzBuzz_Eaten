# FizzBuzz Eaten - AI 기반 음식 분석 및 영양 관리 시스템

Amazon Q Developer Hackathon으로 구현한 AI 기반 음식 분석 및 개인화된 영양 관리 어플리케이션입니다.

## 어플리케이션 개요

사용자가 음식 사진을 업로드하면 AI가 음식을 인식하고 영양정보를 분석하여, 개인화된 건강 리포트와 식사 추천을 제공하는 서비스입니다.

## 프로젝트 구조

```
FizzBuzz_Eaten/
├── backend/                          # Node.js 백엔드 서버
│   ├── src/
│   │   ├── app.js                   # 메인 애플리케이션 (Express 서버 설정)
│   │   ├── controllers/             # API 요청 처리 로직
│   │   │   ├── userController.js    # 사용자 등록 처리
│   │   │   ├── photoController.js   # 음식 사진 분석 처리 (AI 연동)
│   │   │   └── statsController.js   # 통계/리포트 처리 (AI 연동)
│   │   ├── routes/                  # API 라우팅
│   │   │   ├── userRoutes.js        # 사용자 관련 라우트
│   │   │   ├── photoRoutes.js       # 사진 분석 라우트
│   │   │   └── statsRoutes.js       # 통계/리포트 라우트
│   │   ├── models/                  # 데이터 모델
│   │   │   ├── User.js              # 사용자 데이터 관리
│   │   │   └── FoodLog.js           # 음식 로그 데이터 관리
│   │   ├── services/                # 비즈니스 로직
│   │   │   ├── foodAnalysisService.js # AI 음식 분석 서비스
│   │   │   └── statsService.js      # AI 통계/추천 서비스
│   │   ├── clients/                 # 외부 서비스 클라이언트
│   │   │   └── aiClient.js          # AI 서버 HTTP 클라이언트
│   │   ├── config/                  # 설정 파일
│   │   │   └── aiServer.js          # AI 서버 연결 설정
│   │   └── middleware/              # 미들웨어
│   │       └── upload.js            # 파일 업로드 처리
│   ├── uploads/                     # 업로드된 이미지 파일 저장소
│   ├── package.json                 # 의존성 및 스크립트 정의
│   ├── .env.example                 # 환경변수 예시 파일
│   └── .gitignore                   # Git 제외 파일 목록
├── frontend-api-spec.md             # 프론트엔드-백엔드 API 명세서
├── ai-server-api-spec.md            # AI 서버 API 명세서
└── README.md                        # 프로젝트 문서 (현재 파일)
```

## 파일별 상세 역할

### 📁 Controllers (API 요청 처리)
- **userController.js**: 사용자 등록 요청 처리, 입력 데이터 검증
- **photoController.js**: 음식 사진 업로드 및 AI 분석 요청 처리, 에러 응답 관리
- **statsController.js**: 통계 조회, AI 기반 건강 리포트 및 식사 추천 API 처리

### 📁 Routes (API 라우팅)
- **userRoutes.js**: 사용자 관련 엔드포인트 라우팅 (`/api/user_info`)
- **photoRoutes.js**: 사진 분석 엔드포인트 라우팅 (`/api/photo_analy`)
- **statsRoutes.js**: 통계/리포트 엔드포인트 라우팅 (`/api/statistics`, `/api/report`, `/api/meal_reco`)

### 📁 Models (데이터 관리)
- **User.js**: 사용자 정보 저장/조회 (나이, 성별, 활동량)
- **FoodLog.js**: 음식 섭취 기록 저장/조회 (시간, 음식명, 영양정보)

### 📁 Services (비즈니스 로직)
- **foodAnalysisService.js**: AI 서버를 통한 음식 사진 분석, 에러 처리
- **statsService.js**: AI 서버를 통한 건강 리포트 생성 및 식사 추천

### 📁 Clients (외부 서비스 연동)
- **aiClient.js**: AI 서버와의 HTTP 통신 담당, 요청/응답 처리

### 📁 Config (설정 관리)
- **aiServer.js**: AI 서버 URL, 인증 토큰, 타임아웃 등 연결 설정

### 📁 Middleware (미들웨어)
- **upload.js**: multer 기반 이미지 파일 업로드 처리

## API 엔드포인트

### 사용자 관리
- `POST /api/user_info` - 사용자 정보 등록 (나이, 성별, 활동량)

### 음식 분석 (AI 연동)
- `POST /api/photo_analy` - 음식 사진 업로드 및 AI 분석

### 통계 및 리포트 (AI 연동)
- `GET /api/statistics` - 7일간 영양소 섭취 통계
- `GET /api/report` - AI 기반 건강 리포트 생성
- `GET /api/meal_reco` - AI 기반 개인화된 식사 추천

## 주요 기능

1. **음식 사진 AI 분석**
   - 사진 업로드 시 AI가 음식 인식
   - 자동 영양정보 계산 및 제공

2. **개인화된 건강 리포트**
   - AI 기반 식습관 패턴 분석
   - 가공식품/간식 비율 분석
   - 개선 제안 제공

3. **맞춤형 식사 추천**
   - 개인 데이터 기반 AI 추천
   - 부족한 영양소 보충 제안

## 개발 환경 설정

### 백엔드 서버 실행

```bash
cd backend
npm install
npm start
```

### 환경변수 설정

```bash
cp .env.example .env
# .env 파일에서 AI 서버 URL과 토큰 설정
```

## 기술 스택

- **Backend**: Node.js, Express.js
- **AI Integration**: REST API 기반 외부 AI 서버 연동
- **File Upload**: Multer (이미지 파일 처리)
- **Data Storage**: 메모리 기반 (추후 DB 연동 예정)

## 구현 상태

### ✅ 완료된 기능
- 프로젝트 구조 설계
- API 엔드포인트 구현
- AI 서버 연동 구조 구축
- 파일 업로드 처리
- 목업 데이터 기반 동작

### 🚧 구현 예정 기능
- 실제 AI 서버 연동 (HTTP 클라이언트)
- 데이터베이스 연동
- 사용자 인증 시스템
- 프론트엔드 개발
- AWS 배포

## 구현 우선순위

| 우선순위 | 파일 | 구현해야 할 기능 |
|---------|------|------------------|
| 🔥 높음 | `aiClient.js` | axios/fetch 기반 실제 HTTP 요청 구현 |
| 🔥 높음 | `foodAnalysisService.js` | AI 서버 연동 및 에러 처리 |
| 🔥 높음 | `statsService.js` | AI 기반 리포트 생성 |
| 🟡 중간 | `User.js` / `FoodLog.js` | 데이터베이스 연동 |
| 🟡 중간 | `upload.js` | 파일 검증 및 S3 연동 |
| 🟢 낮음 | 전체 | 사용자 인증 시스템 |

## 동영상 데모

*구현 완료 후 데모 영상 추가 예정*

## 리소스 배포하기

*AWS 배포 가이드 추가 예정*

## 프로젝트 기대 효과 및 예상 사용 사례

- **개인 건강 관리**: 일상적인 식사 기록을 통한 영양 관리
- **다이어트 지원**: AI 기반 맞춤형 식단 추천
- **건강한 식습관 형성**: 데이터 기반 식습관 개선 제안

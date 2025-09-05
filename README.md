# FizzBuzz Eaten : AI 음식 분석 및 건강 관리 서비스

Amazon Bedrock을 활용한 음식 사진 분석 및 개인 맞춤형 건강 리포트 생성 서비스입니다.

## 어플리케이션 개요

사용자가 업로드한 음식 사진을 AI로 분석하여 영양 정보를 제공하고, 개인의 식습관 데이터를 바탕으로 건강 리포트와 식사 추천을 제공하는 서비스입니다. Amazon Bedrock의 Claude 모델을 사용하여 정확한 음식 인식과 영양 분석을 수행합니다.

## 주요 기능

### 1. 음식 사진 분석 API
- 업로드된 음식 사진을 AI로 분석
- 음식명, 예상 제공량, 가공식품/간식 여부 판별
- 다중 음식 인식 지원

### 2. 건강 리포트 생성 API
- 7일간의 식사 데이터 분석
- 식사 패턴, 가공식품 비율 분석
- 권장량 대비 실제 섭취량 비교
- 개인 맞춤형 개선 방안 제시

### 3. 식사 추천 API
- 3일간의 식사 기록 기반 분석
- 부족한 영양소 파악 및 보완 방안 제시
- 실용적이고 구체적인 식사 메뉴 추천

## Docker로 빠른 시작

### 사전 요구사항
- Docker & Docker Compose
- AWS Bedrock 액세스 권한

### 1단계: 저장소 클론
```bash
git clone https://github.com/woopo666/FizzBuzz_Eaten.git
cd FizzBuzz_Eaten/deploy
```

### 2단계: 환경변수 설정
```bash
cp .env.example .env
```

`.env` 파일에 AWS 자격증명 입력:
```
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_DEFAULT_REGION=us-east-1
```

### 3단계: Docker 실행
```bash
docker-compose up -d
```

### 4단계: API 테스트
```bash
# 서버 상태 확인
curl http://localhost:5000/health

# Python 테스트 클라이언트 실행
cd ..
python request.py
```

## API 엔드포인트

| 엔드포인트 | 메소드 | 설명 |
|-----------|--------|------|
| `/health` | GET | 서버 상태 확인 |
| `/api/v1/analyze-food` | POST | 음식 사진 분석 |
| `/api/v1/generate-health-report` | POST | 건강 리포트 생성 |
| `/api/v1/recommend-meal` | POST | 식사 추천 |

## 사용 예시

### 음식 분석
```python
import requests

with open("food_image.jpg", "rb") as f:
    response = requests.post(
        "http://localhost:5000/api/v1/analyze-food",
        files={'image': f},
        data={
            'time': '2025-09-04T12:00:00Z',
            'portion_size': '1회 제공량'
        }
    )
print(response.json())
```

## 서버 관리

```bash
# 서버 중지
docker-compose down

# 로그 확인
docker-compose logs -f

# 컨테이너 재시작
docker-compose restart
```

## 프로젝트 구조

```
FizzBuzz_Eaten/
├── AI/                    # 개발용 소스코드
│   ├── images/           # 테스트용 음식 이미지
│   ├── app.py           # Flask 애플리케이션
│   ├── bedrock_service.py # AWS Bedrock 서비스
│   └── test_client.py   # API 테스트 클라이언트
├── deploy/               # Docker 배포용
│   ├── Dockerfile       # Docker 이미지 설정
│   ├── docker-compose.yml # 컨테이너 실행 설정
│   └── .env.example     # 환경변수 템플릿
└── request.py           # 간단한 API 테스트 스크립트
```

## 기술 스택

- **Backend**: Python Flask
- **AI/ML**: Amazon Bedrock (Claude 3.5 Sonnet)
- **Containerization**: Docker, Docker Compose
- **Cloud**: AWS (Bedrock)

## 프로젝트 기대 효과 및 예상 사용 사례

### 기대 효과
- 개인 맞춤형 영양 관리 서비스 제공
- AI 기반 정확한 음식 인식으로 편리한 칼로리 추적
- 데이터 기반 건강한 식습관 형성 지원

### 예상 사용 사례
- **개인 사용자**: 일상적인 식단 관리 및 건강 모니터링
- **헬스케어 앱**: 영양 분석 기능 통합
- **병원/클리닉**: 환자 식단 관리 도구
- **피트니스 센터**: 회원 영양 상담 지원 도구

## 라이선스

MIT License

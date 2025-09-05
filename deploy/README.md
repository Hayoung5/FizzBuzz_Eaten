# AI 서버 Docker 배포

이 프로젝트는 음식 분석 및 건강 리포트 생성을 위한 AI 서버입니다.

## 사전 요구사항

- Docker
- Docker Compose
- AWS Bedrock 액세스 권한

## 설정

1. 환경 변수 설정:
```bash
cp .env.example .env
```

2. `.env` 파일에 AWS 자격 증명 입력:
```
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_DEFAULT_REGION=us-east-1
```

## 실행 방법

### Windows에서 실행
```cmd
run.bat
```

### Linux/Mac에서 실행
```bash
# 이미지 빌드
docker build -t ai-server .

# 컨테이너 실행
docker run -d \
  -p 5000:5000 \
  --env-file .env \
  --name ai-server \
  ai-server
```

## API 엔드포인트

서버가 실행되면 다음 엔드포인트를 사용할 수 있습니다:

- `GET /` - 서버 상태 확인
- `GET /health` - 헬스체크
- `POST /api/v1/analyze-food` - 음식 분석
- `POST /api/v1/generate-health-report` - 건강 리포트 생성
- `POST /api/v1/recommend-meal` - 식사 추천

## 서버 확인

```bash
curl http://localhost:5000/health
```

## 중지

### Windows
```cmd
stop.bat
```

### Linux/Mac
```bash
docker stop ai-server
docker rm ai-server
```

## 로그 확인

```bash
docker logs -f ai-server
```
#!/bin/bash

# 수동으로 백엔드를 배포하는 스크립트

echo "Deploying backend to EC2..."

ssh -i nutrition-app-key.pem ec2-user@44.214.236.166 << 'EOF'
# 백엔드 디렉토리로 이동 (없으면 생성)
mkdir -p /home/ec2-user/nutrition-backend
cd /home/ec2-user/nutrition-backend

echo "Current directory: $(pwd)"

# 기존 프로세스 종료
echo "Stopping existing processes..."
pkill -f "python.*app.py" || true
pkill -f "gunicorn" || true

# Git 저장소 초기화 또는 업데이트
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git remote add origin https://github.com/your-username/FizzBuzz_Eaten.git
fi

# 최신 코드 가져오기
echo "Fetching latest code..."
git fetch origin
git checkout main
git pull origin main

# Python 가상환경 설정
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

# 의존성 설치
if [ -f "requirements.txt" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
else
    echo "No requirements.txt found, installing basic dependencies..."
    pip install flask flask-cors python-dotenv
fi

# 백엔드 서버 실행
echo "Starting backend server..."
nohup python app.py > backend.log 2>&1 &

# 프로세스 확인
sleep 3
echo "Checking processes..."
ps aux | grep python | grep -v grep

echo "Backend deployment completed!"
echo "Check logs with: tail -f /home/ec2-user/nutrition-backend/backend.log"
EOF
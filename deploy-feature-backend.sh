#!/bin/bash

# feature/backend 브랜치 배포 스크립트

echo "Deploying feature/backend branch to EC2..."

ssh -i nutrition-app-key.pem ec2-user@44.214.236.166 << 'EOF'
# 백엔드 디렉토리로 이동
mkdir -p /home/ec2-user/nutrition-backend
cd /home/ec2-user/nutrition-backend

echo "Current directory: $(pwd)"

# 기존 프로세스 종료
echo "Stopping existing processes..."
pkill -f "python.*app.py" || true
pkill -f "gunicorn" || true

# Git 저장소 클론 또는 업데이트
if [ ! -d ".git" ]; then
    echo "Cloning repository..."
    rm -rf *
    git clone -b feature/backend https://github.com/Hayoung5/FizzBuzz_Eaten.git .
else
    echo "Updating existing repository..."
    git fetch origin
    git checkout feature/backend
    git pull origin feature/backend
fi

# Python 가상환경 설정
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

# 의존성 설치
if [ -f "requirements.txt" ]; then
    echo "Installing dependencies from requirements.txt..."
    pip install -r requirements.txt
else
    echo "Installing basic Flask dependencies..."
    pip install flask flask-cors python-dotenv requests
fi

# 백엔드 서버 실행
echo "Starting backend server..."
nohup python app.py > backend.log 2>&1 &

# 프로세스 확인
sleep 3
echo "Checking processes..."
ps aux | grep python | grep -v grep

# 포트 확인
echo "Checking port 3000..."
netstat -tlnp | grep :3000 || echo "Port 3000 not listening yet"

echo "Backend deployment completed!"
echo "Check logs with: tail -f /home/ec2-user/nutrition-backend/backend.log"
EOF
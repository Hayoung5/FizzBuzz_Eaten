#!/bin/bash

# EC2에서 백엔드 서버를 실행하는 스크립트

echo "Starting backend server on EC2..."

# EC2에 SSH 접속하여 백엔드 실행
ssh -i nutrition-app-key.pem ec2-user@44.214.236.166 << 'EOF'
# 백엔드 디렉토리로 이동
cd /home/ec2-user/nutrition-backend

# 기존 프로세스 종료 (있다면)
pkill -f "python.*app.py" || true
pkill -f "gunicorn" || true

# 가상환경 활성화 (있다면)
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# 백그라운드에서 서버 실행
nohup python app.py > backend.log 2>&1 &

# 프로세스 확인
sleep 2
ps aux | grep python | grep -v grep

echo "Backend server started on port 3000"
echo "Check logs with: tail -f /home/ec2-user/nutrition-backend/backend.log"
EOF
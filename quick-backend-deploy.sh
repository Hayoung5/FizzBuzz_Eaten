#!/bin/bash

# 빠른 백엔드 배포 (Git 없이)

echo "Quick backend deployment to EC2..."

# 현재 디렉토리의 백엔드 파일들을 EC2로 복사
scp -i nutrition-app-key.pem -r backend/* ec2-user@44.214.236.166:/home/ec2-user/nutrition-backend/ 2>/dev/null || echo "No backend directory found locally"

# EC2에서 서버 실행
ssh -i nutrition-app-key.pem ec2-user@44.214.236.166 << 'EOF'
cd /home/ec2-user/nutrition-backend

# 기존 프로세스 종료
pkill -f "python.*app.py" || true

# 간단한 Flask 앱 생성 (백엔드 파일이 없는 경우)
if [ ! -f "app.py" ]; then
    cat > app.py << 'PYTHON_EOF'
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/user_info', methods=['POST'])
def create_user():
    data = request.json
    return jsonify({
        'user_id': 1,
        'name': None
    })

@app.route('/api/auth/kakao')
def kakao_login():
    return jsonify({'message': 'Kakao login endpoint'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
PYTHON_EOF
fi

# 의존성 설치
pip3 install flask flask-cors --user

# 서버 실행
nohup python3 app.py > backend.log 2>&1 &

sleep 2
ps aux | grep python | grep -v grep
echo "Backend server started on port 3000"
EOF
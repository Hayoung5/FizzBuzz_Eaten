#!/bin/bash

# EC2 백엔드 상태 확인 스크립트

echo "Checking backend status on EC2..."

ssh -i nutrition-app-key.pem ec2-user@44.214.236.166 << 'EOF'
echo "=== Process Status ==="
ps aux | grep python | grep -v grep

echo -e "\n=== Port 3000 Status ==="
netstat -tlnp | grep :3000 || echo "Port 3000 not listening"

echo -e "\n=== Recent Backend Logs ==="
if [ -f "/home/ec2-user/nutrition-backend/backend.log" ]; then
    tail -20 /home/ec2-user/nutrition-backend/backend.log
else
    echo "No backend log file found"
fi

echo -e "\n=== Directory Contents ==="
ls -la /home/ec2-user/nutrition-backend/ 2>/dev/null || echo "Backend directory not found"
EOF
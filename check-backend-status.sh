#!/bin/bash

echo "Checking backend status on EC2..."

ssh -i nutrition-app-key.pem ec2-user@44.214.236.166 << 'EOF'
echo "=== Node.js Process Status ==="
ps aux | grep node | grep -v grep

echo -e "\n=== Port 3000 Status ==="
netstat -tlnp | grep :3000 || echo "Port 3000 not listening"

echo -e "\n=== Backend Logs ==="
tail -20 /home/ec2-user/nutrition-backend/backend/backend.log 2>/dev/null || echo "No backend log found"

echo -e "\n=== Directory Structure ==="
ls -la /home/ec2-user/nutrition-backend/backend/ 2>/dev/null || echo "Backend directory not found"

echo -e "\n=== Environment Variables ==="
cd /home/ec2-user/nutrition-backend/backend
ls -la .env* 2>/dev/null || echo "No .env files found"

echo -e "\n=== Test API Endpoint ==="
curl -s http://localhost:3000/health || echo "Health endpoint not responding"
EOF
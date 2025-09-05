#!/bin/bash

# EC2에서 실행할 배포 설정 스크립트

# nginx 설정 업데이트
sudo cp nginx.conf /etc/nginx/sites-available/nutrition-app-frontend
sudo ln -sf /etc/nginx/sites-available/nutrition-app-frontend /etc/nginx/sites-enabled/

# 기존 default 사이트 비활성화 (필요시)
sudo rm -f /etc/nginx/sites-enabled/default

# nginx 설정 테스트
sudo nginx -t

# nginx 재시작
sudo systemctl restart nginx

# 방화벽 포트 3001 열기
sudo ufw allow 3001

echo "Frontend deployment setup completed on port 3001"
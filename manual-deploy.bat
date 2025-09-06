@echo off
echo Manual backend deployment to EC2...

ssh -i nutrition-app-key.pem ec2-user@44.214.236.166 "cd /home/ec2-user && rm -rf nutrition-backend && git clone -b feature/backend https://github.com/Hayoung5/FizzBuzz_Eaten.git nutrition-backend && cd nutrition-backend/backend && npm install && pkill node; nohup node src/app.js > backend.log 2>&1 &"

echo Backend deployment completed!
pause
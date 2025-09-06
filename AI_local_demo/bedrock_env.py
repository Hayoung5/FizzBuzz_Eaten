import boto3
import json
import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

class BedrockService:
    def __init__(self):
        # 환경 변수에서 자격 증명 읽기
        self.bedrock = boto3.client(
            'bedrock-runtime',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1')
        )
    
    def chat(self, message):
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "messages": [{"role": "user", "content": message}]
        }
        
        response = self.bedrock.invoke_model(
            modelId='anthropic.claude-3-sonnet-20240229-v1:0',
            body=json.dumps(body)
        )
        
        result = json.loads(response['body'].read())
        return result['content'][0]['text']

# 사용 예시
if __name__ == "__main__":
    service = BedrockService()
    response = service.chat("안녕하세요!")
    print(response)
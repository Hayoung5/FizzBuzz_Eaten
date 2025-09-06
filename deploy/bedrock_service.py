import boto3
import json
import base64
import os
from PIL import Image
import io
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

class BedrockService:
    def __init__(self, model_id = 'anthropic.claude-opus-4-20250514-v1:0'):

        self.model_id = model_id
        self.bedrock = boto3.client(
            'bedrock-runtime',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name= os.getenv('AWS_DEFAULT_REGION', 'us-east-1')
        )
    
    # Tool
    def chat(self, message):
        """텍스트 채팅"""
        return self.generate_claude_text(message)
    
    def analyze_image(self, image_path, question="이미지를 설명해주세요."):
        """이미지 분석"""
        return self.generate_claude_vision(image_path, question)
    

    def generate_claude_text(self, prompt):
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "messages": [{"role": "user", "content": prompt}]
        }
        
        response = self.bedrock.invoke_model(
            modelId = self.model_id,
            body=json.dumps(body)
        )
        
        result = json.loads(response['body'].read())
        return result['content'][0]['text']
    
    
    def generate_claude_vision(self, image_path, prompt):
        with Image.open(image_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            buffer = io.BytesIO()
            img.save(buffer, format='JPEG', quality=85)
            image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": image_base64
                            }
                        },
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ]
        }
        
        response = self.bedrock.invoke_model(
            modelId=self.model_id,
            body=json.dumps(body)
        )
        
        result = json.loads(response['body'].read())
        return result['content'][0]['text']
    
    def generate_claude_vision_v1(self, image_path, prompt):
        with Image.open(image_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            buffer = io.BytesIO()
            img.save(buffer, format='JPEG', quality=85)
            image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": image_base64
                            }
                        },
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ]
        }
        
        response = self.bedrock.invoke_model(
            modelId=self.model_id,
            body=json.dumps(body)
        )
        
        result = json.loads(response['body'].read())
        return result['content'][0]['text']
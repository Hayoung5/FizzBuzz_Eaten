from bedrock_service import BedrockService

def main():
    print("AWS Bedrock 데모")
    print("=" * 30)
    
    service = BedrockService(model_id = 'anthropic.claude-3-5-sonnet-20240620-v1:0')
    
    while True:
        print("\n1. 텍스트 채팅")
        print("2. 이미지 분석")
        print("3. 종료")
        
        choice = input("\n선택: ")
        
        if choice == '1':
            message = input("메시지: ")
            try:
                response = service.chat(message)
                print(f"\n응답: {response}")
            except Exception as e:
                print(f"오류: {e}")
        
        elif choice == '2':
            image_path = input("이미지 경로: ")
            question = input("질문 (엔터시 기본값): ") or "이미지를 설명해주세요."
            
            try:
                result = service.analyze_image(image_path, question)
                print(f"\n결과: {result}")
            except Exception as e:
                print(f"오류: {e}")
        
        elif choice == '3':
            break
        
        else:
            print("잘못된 선택입니다.")

if __name__ == "__main__":
    main()
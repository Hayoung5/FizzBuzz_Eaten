#!/usr/bin/env python3
"""
API 테스트 클라이언트
"""

import requests
import json
import os

BASE_URL = "http://localhost:5000/api/v1"

def get_food_nutrition(food_name):
    try:
        base_url = "https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo02/getFoodNtrCpntDbInq02"
        params = {
            "serviceKey": "392b322a06d187880079454523eef7608de24774e22bd29e0b17b7de3d96bc07",
            "FOOD_NM_KR": food_name,
            "numOfRows": 1,
            "type": "json"
        }

        response = requests.get(base_url, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        if data['header']['resultCode'] == '00' and len(data['body']['items']) > 0:
            item = data['body']['items'][0]
            
            return {
                "calories": float(item['AMT_NUM1']),
                "carbohydrates": float(item['AMT_NUM6']),
                "protein": float(item['AMT_NUM3']), 
                "fat": float(item['AMT_NUM4']),
                "sugar": float(item['AMT_NUM7']),
                "sodium": float(item['AMT_NUM13']),
                "fiber": float(item['AMT_NUM8']) if item['AMT_NUM8'] else 0
            }
        else:
            return {
            "calories": 0,
            "carbohydrates": 0,
            "protein": 0,
            "fat": 0,
            "sugar": 0,
            "sodium": 0,
            "fiber": 0
        }

    except requests.RequestException as e:
        return {
            "calories": 0,
            "carbohydrates": 0,
            "protein": 0,
            "fat": 0,
            "sugar": 0,
            "sodium": 0,
            "fiber": 0
        }

def test_analyze_food():
    """음식 분석 API 테스트"""
    print("=== 음식 분석 API 테스트 ===")
    
    # 이미지 파일 경로 (images 폴더에서 찾기)
    image_path = "images/hamburger.jpg"
    if not os.path.exists(image_path):
        print(f"이미지 파일을 찾을 수 없습니다: {image_path}")
        return
    
    url = f"{BASE_URL}/analyze-food"
    
    with open(image_path, 'rb') as f:
        files = {'image': f}
        data = {
            'time': '2025-09-04T12:00:00Z',
            'portion_size': '1회 제공량'
        }
        
        try:
            response = requests.post(url, files=files, data=data)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        except requests.exceptions.RequestException as e:
            print(f"요청 실패: {e}")

def test_health_report():
    """건강 리포트 API 테스트"""
    print("\n=== 건강 리포트 API 테스트 ===")
    
    url = f"{BASE_URL}/generate-health-report"
    
    data = {
        "times": ["2025-09-01T08:00:00Z", "2025-09-01T12:30:00Z", "2025-09-01T18:30:00Z"],
        "meal_snack": [1800, 600],
        "processed": [12, 8],
        "reco_cal": 2400,
        "reco_carbo": 300,
        "reco_protein": 65,
        "reco_fat": 50,
        "reco_sugar": 25,
        "reco_sodium": 2000,
        "cal_log": [2200, 2300, 2500, 2100, 2000, 2400, 2600],
        "carbo_log": [280, 310, 295, 270, 260, 300, 310],
        "protein_log": [60, 70, 65, 55, 50, 68, 72],
        "fat_log": [45, 52, 50, 40, 42, 55, 60],
        "sugar_log": [20, 22, 18, 25, 30, 28, 27],
        "sodium_log": [1900, 2100, 2200, 1800, 2000, 2300, 2400]
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    except requests.exceptions.RequestException as e:
        print(f"요청 실패: {e}")

def test_meal_recommendation():
    """식사 추천 API 테스트"""
    print("\n=== 식사 추천 API 테스트 ===")
    
    url = f"{BASE_URL}/recommend-meal"
    
    data = {
        "times": ["2025-09-03T08:00:00Z", "2025-09-03T12:30:00Z"],
        "meal_snack": [1200, 300],
        "processed": [5, 4],
        "reco_cal": 2400,
        "reco_carbo": 300,
        "reco_protein": 65,
        "reco_fat": 50,
        "reco_sugar": 25,
        "reco_sodium": 2000,
        "cal_log": [2200, 2300, 2500],
        "carbo_log": [280, 310, 295],
        "protein_log": [60, 70, 65],
        "fat_log": [45, 52, 50],
        "sugar_log": [20, 22, 18],
        "sodium_log": [1900, 2100, 2200]
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    except requests.exceptions.RequestException as e:
        print(f"요청 실패: {e}")

if __name__ == "__main__":
    print("AI API 테스트 클라이언트")
    print("서버가 실행 중인지 확인하세요: http://localhost:5000")
    print()
    
    # 모든 API 테스트 실행
    # test_analyze_food()
    # test_health_report()
    # test_meal_recommendation()
    get_food_nutrition("피자")
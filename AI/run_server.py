#!/usr/bin/env python3
"""
AI 서버 실행 스크립트
"""

import os
import sys
from app import app

if __name__ == '__main__':
    print("AI 서버를 시작합니다...")
    print("API 엔드포인트:")
    print("- POST /api/v1/analyze-food")
    print("- POST /api/v1/generate-health-report") 
    print("- POST /api/v1/recommend-meal")
    print("\n서버 주소: http://localhost:5000")
    print("종료하려면 Ctrl+C를 누르세요.\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
/**
 * AI 서버 클라이언트
 * - AI 서버와의 HTTP 통신 담당
 * - 요청/응답 처리 및 에러 핸들링
 * - 재시도 로직 및 타임아웃 처리
 * 
 * TODO: 실제 구현시 추가할 기능들
 * - axios 또는 fetch 기반 HTTP 클라이언트
 * - 인증 헤더 추가
 * - 요청/응답 로깅
 * - 서킷 브레이커 패턴
 */

const FormData = require('form-data');
const fs = require('fs');
const aiServerConfig = require('../config/aiServer');

class AIClient {
  constructor() {
    this.baseURL = aiServerConfig.baseURL;
    this.timeout = aiServerConfig.timeout;
    this.retryCount = aiServerConfig.retryCount;
  }

  /**
   * 음식 사진 분석 요청
   * @param {string} imagePath - 업로드된 이미지 파일 경로
   * @param {string} time - 촬영/섭취 시간 (ISO 8601)
   * @param {string} portionSize - 예상 제공량 정보
   * @returns {Promise<Object>} AI 분석 결과
   */
  async analyzeFoodPhoto(imagePath, time, portionSize) {
    try {
      // TODO: 실제 HTTP 요청 구현
      // const formData = new FormData();
      // formData.append('image', fs.createReadStream(imagePath));
      // formData.append('time', time);
      // formData.append('portion_size', portionSize);
      
      // const response = await this._makeRequest('POST', aiServerConfig.endpoints.analyzeFood, formData);
      // return this._handleResponse(response);
      
      // 현재는 목업 응답 반환
      return this._getMockFoodAnalysis();
      
    } catch (error) {
      throw this._handleError(error, 'FOOD_ANALYSIS_ERROR');
    }
  }

  /**
   * 건강 리포트 생성 요청
   * @param {Object} healthData - 사용자 건강 통계 데이터
   * @returns {Promise<Object>} 생성된 건강 리포트
   */
  async generateHealthReport(healthData) {
    try {
      // TODO: 실제 HTTP 요청 구현
      // const response = await this._makeRequest('POST', aiServerConfig.endpoints.generateHealthReport, healthData);
      // return this._handleResponse(response);
      
      // 현재는 목업 응답 반환
      return this._getMockHealthReport();
      
    } catch (error) {
      throw this._handleError(error, 'HEALTH_REPORT_ERROR');
    }
  }

  /**
   * 식사 추천 요청
   * @param {Object} mealData - 최근 식사 데이터
   * @returns {Promise<Object>} 개인화된 식사 추천
   */
  async recommendMeal(mealData) {
    try {
      // TODO: 실제 HTTP 요청 구현
      // const response = await this._makeRequest('POST', aiServerConfig.endpoints.recommendMeal, mealData);
      // return this._handleResponse(response);
      
      // 현재는 목업 응답 반환
      return this._getMockMealRecommendation();
      
    } catch (error) {
      throw this._handleError(error, 'MEAL_RECOMMENDATION_ERROR');
    }
  }

  /**
   * HTTP 요청 실행 (실제 구현시 사용)
   * @private
   */
  async _makeRequest(method, endpoint, data) {
    // TODO: axios 또는 fetch를 사용한 실제 HTTP 요청
    // const url = `${this.baseURL}${endpoint}`;
    // const config = {
    //   method,
    //   url,
    //   timeout: this.timeout,
    //   headers: {
    //     'Authorization': `Bearer ${aiServerConfig.authToken}`
    //   }
    // };
    
    // if (data instanceof FormData) {
    //   config.data = data;
    //   config.headers['Content-Type'] = 'multipart/form-data';
    // } else {
    //   config.data = data;
    //   config.headers['Content-Type'] = 'application/json';
    // }
    
    // return await axios(config);
  }

  /**
   * 응답 처리
   * @private
   */
  _handleResponse(response) {
    if (response.data.status === 'success') {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'AI server error');
    }
  }

  /**
   * 에러 처리
   * @private
   */
  _handleError(error, defaultCode) {
    console.error(`AI Client Error [${defaultCode}]:`, error.message);
    
    // AI 서버 응답 에러 코드 매핑
    if (error.response?.data?.code) {
      const errorCode = error.response.data.code;
      switch (errorCode) {
        case 'FOOD_NOT_DETECTED':
          throw new Error('ANALYSIS_FAILED');
        case 'NUTRITION_INFO_NOT_FOUND':
          throw new Error('NUTRITION_NOT_FOUND');
        default:
          throw new Error(defaultCode);
      }
    }
    
    throw new Error(defaultCode);
  }

  // 목업 데이터 메서드들 (실제 구현시 제거)
  _getMockFoodAnalysis() {
    const mockFoods = [
      {
        food_name: "배추김치",
        portion_size: "1회 제공량 (100g)",
        nutrition: {
          calories: 35,
          carbohydrates: 7.0,
          protein: 1.5,
          fat: 0.5,
          sugar: 1.0,
          sodium: 800,
          fiber: 2.5
        }
      },
      {
        food_name: "백미밥",
        portion_size: "1공기 (210g)",
        nutrition: {
          calories: 300,
          carbohydrates: 65.0,
          protein: 6.0,
          fat: 0.5,
          sugar: 0.1,
          sodium: 5,
          fiber: 0.3
        }
      }
    ];
    
    return mockFoods[Math.floor(Math.random() * mockFoods.length)];
  }

  _getMockHealthReport() {
    return {
      meal_pattern: "식사 시간이 비교적 규칙적이나, 늦은 저녁 섭취가 잦습니다.",
      processed_snack_ratio: "최근 7일간 가공식품 비율은 55%, 간식 비율은 30%입니다.",
      reco: "다음 끼니에는 단백질이 풍부한 식품(두부, 계란, 생선)을 포함하면 좋습니다."
    };
  }

  _getMockMealRecommendation() {
    const recommendations = [
      "다음 끼니에는 단백질이 풍부한 식품(두부, 계란, 생선)을 포함하면 좋습니다.\n최근 3일간 나트륨 섭취가 높으니 저염 식품을 선택해보세요.",
      "탄수화물 섭취량이 높으니 채소 위주의 식단을 권장합니다.\n신선한 과일로 비타민을 보충하세요.",
      "지방 섭취가 부족합니다. 견과류나 올리브오일을 추가해보세요.\n충분한 수분 섭취도 잊지 마세요."
    ];
    
    return {
      reco: recommendations[Math.floor(Math.random() * recommendations.length)]
    };
  }
}

module.exports = new AIClient();

/**
 * AI 서버 클라이언트
 * - AI 서버와의 HTTP 통신 담당
 * - 요청/응답 처리 및 에러 핸들링
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class AIClient {
  constructor() {
    this.baseURL = process.env.AI_SERVER_URL || 'http://localhost:5000';
    this.timeout = 30000; // 30초
  }

  /**
   * 음식 사진 분석 요청
   * @param {Object} params - {imagePath, time, portion_size}
   * @returns {Promise<Object>} AI 분석 결과
   */
  async analyzeFood({ imagePath, time, portion_size }) {
    try {
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));
      formData.append('time', time);
      formData.append('portion_size', portion_size);

      const response = await axios.post(
        `${this.baseURL}/api/v1/analyze-food`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: this.timeout
        }
      );

      if (response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data.message || 'AI 분석 실패');
      }

    } catch (error) {
      console.log(error)
      console.error('AI Food Analysis Error:', error.message);
      
      if (error.response?.data?.code) {
        const errorCode = error.response.data.code;
        switch (errorCode) {
          case 'FOOD_NOT_DETECTED':
            throw new Error('음식이 감지되지 않았습니다. 음식이 명확히 보이는 사진을 다시 업로드해주세요.');
          case 'NUTRITION_INFO_NOT_FOUND':
            throw new Error('음식은 인식되었지만 해당 음식의 영양정보를 찾을 수 없습니다.');
          default:
            throw new Error('AI 분석 중 서버 오류가 발생했습니다.');
        }
      }
      
      throw new Error('AI 서버 연결 오류가 발생했습니다.');
    }
  }

  /**
   * 건강 리포트 생성 요청
   * @param {Object} healthData - 사용자 건강 통계 데이터
   * @returns {Promise<Object>} 생성된 건강 리포트
   */
  async generateHealthReport(healthData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/v1/generate-health-report`,
        healthData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: this.timeout
        }
      );

      if (response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data.message || '리포트 생성 실패');
      }

    } catch (error) {
      console.error('AI Health Report Error:', error.message);
      throw new Error('리포트 생성 중 서버 오류가 발생했습니다.');
    }
  }

  /**
   * 식사 추천 요청
   * @param {Object} mealData - 최근 식사 데이터
   * @returns {Promise<Object>} 개인화된 식사 추천
   */
  async recommendMeal(mealData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/v1/recommend-meal`,
        mealData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: this.timeout
        }
      );

      if (response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data.message || '식사 추천 실패');
      }

    } catch (error) {
      console.error('AI Meal Recommendation Error:', error.message);
      throw new Error('식사 추천 생성 중 서버 오류가 발생했습니다.');
    }
  }
  /**
   * 바코드 사진 분석 요청
   * @param {Object} params - {imagePath}
   * @returns {Promise<Object>} AI 분석 결과
   */
  async analyzeBarcode({ imagePath }) {
    try {
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));

      const response = await axios.post(
        `${this.baseURL}/api/v1/analyze-barcode`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: this.timeout
        }
      );

      if (response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.data.message || 'AI 바코드 분석 실패');
      }

    } catch (error) {
      console.error('AI Barcode Analysis Error:', error.message);
      
      if (error.response?.data?.code) {
        const errorCode = error.response.data.code;
        switch (errorCode) {
          case 'BARCODE_NOT_DETECTED':
            throw new Error('바코드가 감지되지 않았습니다. 바코드가 명확히 보이는 사진을 다시 업로드해주세요.');
          case 'PRODUCT_INFO_NOT_FOUND':
            throw new Error('바코드는 인식되었지만 해당 제품의 정보를 찾을 수 없습니다.');
          default:
            throw new Error('AI 바코드 분석 중 서버 오류가 발생했습니다.');
        }
      }
      
      throw new Error('AI 서버 연결 오류가 발생했습니다.');
    }
  }

}

module.exports = new AIClient();

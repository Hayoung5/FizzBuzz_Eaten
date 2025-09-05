/**
 * 음식 분석 서비스
 * - AI 서버를 통한 음식 사진 분석
 * - 분석 결과 처리 및 에러 핸들링
 * 
 * TODO: 실제 구현시 추가할 기능들
 * - 이미지 전처리 (크기 조정, 품질 최적화)
 * - 분석 결과 캐싱
 * - 분석 히스토리 저장
 * - 분석 정확도 피드백 수집
 */

const aiClient = require('../clients/aiClient');

/**
 * 음식 사진 분석 함수
 * @param {File} photoFile - 업로드된 이미지 파일
 * @param {string} time - 촬영/섭취 시간
 * @param {string} portionSize - 예상 제공량
 * @returns {Promise<Object>} 음식명과 영양정보
 * 
 * 실제 구현 흐름:
 * 1. 이미지 파일을 AI 서버에 전송
 * 2. AI 서버에서 음식 인식 및 영양정보 조회
 * 3. 분석 결과 반환 또는 에러 처리
 */
const analyzeFoodPhoto = async (photoFile, time = new Date().toISOString(), portionSize = "1회 제공량") => {
  try {
    // AI 서버에 음식 분석 요청
    const analysisResult = await aiClient.analyzeFoodPhoto(
      photoFile.path,  // 업로드된 파일 경로
      time,
      portionSize
    );
    
    // TODO: 분석 결과 후처리
    // - 영양정보 단위 변환
    // - 분석 신뢰도 체크
    // - 결과 로깅
    
    return analysisResult;
    
  } catch (error) {
    // AI 서버 에러를 프론트엔드 API 스펙에 맞게 변환
    console.error('Food analysis error:', error.message);
    
    switch (error.message) {
      case 'ANALYSIS_FAILED':
        throw {
          code: 'ANALYSIS_FAILED',
          message: '사진에서 음식을 인식하지 못했습니다. 다른 사진을 다시 업로드해주세요.',
          status: 422
        };
      case 'NUTRITION_NOT_FOUND':
        throw {
          code: 'NUTRITION_NOT_FOUND',
          message: '음식은 인식했지만 영양정보를 찾을 수 없습니다. 비슷한 음식으로 다시 시도해주세요.',
          status: 404
        };
      default:
        throw {
          code: 'ANALYSIS_ERROR',
          message: '음식 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          status: 500
        };
    }
  }
};

module.exports = { analyzeFoodPhoto };

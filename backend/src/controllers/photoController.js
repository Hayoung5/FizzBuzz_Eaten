/**
 * 사진 분석 컨트롤러
 * - 음식 사진 업로드 및 분석 요청 처리
 * - AI 서버 연동을 통한 분석 결과 처리
 * - 분석 결과를 음식 로그에 저장
 * - 에러 응답 처리 (AI 서버 스펙에 맞춤)
 * 
 * TODO: 실제 구현시 추가할 기능들
 * - 이미지 파일 형식 검증 (jpg, png 등)
 * - 파일 크기 제한
 * - 분석 결과 검증 및 후처리
 * - 분석 히스토리 관리
 */

const FoodLog = require('../models/FoodLog');
const foodAnalysisService = require('../services/foodAnalysisService');

/**
 * 음식 사진 분석 API
 * POST /api/photo_analy
 * @param {Object} req.body - {user_id, time, portion_size}
 * @param {File} req.file - 업로드된 이미지 파일
 * @returns {Object} 음식 분석 결과 또는 에러 응답
 */
const analyzePhoto = async (req, res) => {
  const { user_id, time, portion_size } = req.body;
  
  // 필수 필드 검증
  if (!user_id || !time || !req.file) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // TODO: 추가 검증
  // - user_id 존재 여부 확인
  // - time 형식 검증 (ISO 8601)
  // - 이미지 파일 형식/크기 검증
  
  try {
    // AI 서버를 통한 음식 사진 분석
    const analysisResult = await foodAnalysisService.analyzeFoodPhoto(
      req.file, 
      time, 
      portion_size
    );
    
    // 분석 결과를 음식 로그에 저장
    FoodLog.add(user_id, {
      time,
      ...analysisResult,
      isProcessed: Math.random() > 0.5, // TODO: 실제 가공식품 판별 로직
      isSnack: Math.random() > 0.7      // TODO: 실제 간식 판별 로직
    });
    
    // 성공 응답 (프론트엔드 API 스펙에 맞춤)
    res.json(analysisResult);
    
  } catch (error) {
    // AI 서버 에러를 프론트엔드 API 스펙에 맞게 변환
    console.error('Photo analysis error:', error);
    
    if (error.code && error.status) {
      // AI 서버에서 정의된 에러 코드 처리
      return res.status(error.status).json({
        error_code: error.code,
        message: error.message
      });
    }
    
    // 예상치 못한 에러
    res.status(500).json({
      error_code: 'INTERNAL_ERROR',
      message: '음식 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    });
  }
};

module.exports = { analyzePhoto };

/**
 * 통계 및 리포트 컨트롤러
 * - AI 서버 연동을 통한 사용자 통계 조회
 * - AI 기반 건강 리포트 생성
 * - AI 기반 식사 추천 제공
 * 
 * TODO: 실제 구현시 추가할 기능들
 * - 실제 사용자 데이터 기반 통계 계산
 * - AI 서버 응답 캐싱 처리
 * - 개인화된 추천 알고리즘 개선
 * - 분석 결과 히스토리 관리
 */

const User = require('../models/User');
const statsService = require('../services/statsService');

/**
 * 사용자 통계 조회 API
 * GET /api/statistics?user_id=1234
 * @returns {Object} 7일간 영양소 통계 데이터
 */
const getStatistics = async (req, res) => {
  const { user_id } = req.query;
  
  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }
  
  try {
    // 사용자 존재 확인
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 실제 DB 데이터 기반 통계 조회
    const stats = await statsService.getUserStatistics(user_id);
    res.json(stats);
  } catch (error) {
    console.error('Statistics error:', error.message);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
};

/**
 * AI 기반 건강 리포트 조회 API
 * GET /api/report?user_id=1234
 * @returns {Object} AI가 생성한 식습관 분석 및 개선 제안
 */
const getReport = async (req, res) => {
  const { user_id } = req.query;
  
  if (!user_id || !User.findById(user_id)) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  try {
    // AI 서버를 통한 건강 리포트 생성
    const report = await statsService.generateHealthReport(user_id);
    
    // ratio 필드 추가 (프론트엔드 API 스펙에 맞춤)
    report.ratio = [90, 75, 80, 120, 110]; // TODO: 실제 계산된 비율 사용
    
    res.json(report);
  } catch (error) {
    console.error('Health report error:', error.message);
    res.status(500).json({ error: 'Failed to generate health report' });
  }
};

/**
 * AI 기반 다음끼니 식사 추천 API
 * GET /api/meal_reco?user_id=1234
 * @returns {Object} AI가 생성한 개인화된 식사 추천
 */
const getMealRecommendation = async (req, res) => {
  const { user_id } = req.query;
  
  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }
  
  try {
    // 사용자 존재 확인
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // AI 기반 식사 추천
    const recommendation = await statsService.getMealRecommendation(user_id);
    res.json(recommendation);
  } catch (error) {
    console.error('Meal recommendation error:', error.message);
    res.status(500).json({ error: 'Failed to get meal recommendation' });
  }
};

module.exports = { getStatistics, getReport, getMealRecommendation };

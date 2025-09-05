/**
 * 통계 및 리포트 관련 라우트
 * - 사용자 통계, 건강 리포트, 식사 추천 API 라우팅
 * 
 * 현재 구현된 엔드포인트:
 * - GET /api/statistics : 사용자 영양 통계 조회
 * - GET /api/report : 건강 리포트 조회
 * - GET /api/meal_reco : 다음끼니 식사 추천
 * 
 * TODO: 추가 가능한 엔드포인트들
 * - GET /api/statistics/weekly : 주간 통계
 * - GET /api/statistics/monthly : 월간 통계
 * - GET /api/goals : 개인 목표 설정/조회
 */

const express = require('express');
const { getStatistics, getReport, getMealRecommendation } = require('../controllers/statsController');

const router = express.Router();

// 사용자 통계 조회
router.get('/statistics', getStatistics);

// 건강 리포트 조회
router.get('/report', getReport);

// 다음끼니 식사 추천
router.get('/meal_reco', getMealRecommendation);

module.exports = router;

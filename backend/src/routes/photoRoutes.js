/**
 * 사진 분석 관련 라우트
 * - 음식 사진 업로드 및 분석 API 라우팅
 * 
 * 현재 구현된 엔드포인트:
 * - POST /api/photo_analy : 음식 사진 분석
 * 
 * TODO: 추가 가능한 엔드포인트들
 * - GET /api/photo/:id : 업로드된 사진 조회
 * - DELETE /api/photo/:id : 사진 삭제
 * - POST /api/photo/batch : 여러 사진 일괄 분석
 */

const express = require('express');
const upload = require('../middleware/upload');
const { analyzePhoto } = require('../controllers/photoController');

const router = express.Router();

// 음식 사진 분석 (multipart/form-data)
router.post('/photo_analy', upload.single('photo'), analyzePhoto);

module.exports = router;

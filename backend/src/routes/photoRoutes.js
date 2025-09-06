/**
 * 사진 분석 관련 라우트
 * - 음식 사진 업로드 및 분석 API 라우팅
 * - 바코드 사진 업로드 및 분석 API 라우팅
 * 
 * 현재 구현된 엔드포인트:
 * - POST /api/photo_analy : 음식 사진 분석
 * - POST /api/barcode_analy : 바코드 사진 분석
 */

const express = require('express');
const upload = require('../middleware/upload');
const { analyzePhoto, analyzeBarcode } = require('../controllers/photoController');

const router = express.Router();

// 음식 사진 분석 (multipart/form-data)
router.post('/photo_analy', upload.single('image'), analyzePhoto);

// 바코드 사진 분석 (multipart/form-data)
router.post('/barcode_analy', upload.single('photo'), analyzeBarcode);

module.exports = router;

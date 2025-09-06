/**
 * 사용자 관련 라우트
 * - 사용자 등록 API 라우팅
 * 
 * 현재 구현된 엔드포인트:
 * - POST /api/user_info : 사용자 정보 등록
 * 
 * TODO: 추가 가능한 엔드포인트들
 * - GET /api/user/:id : 사용자 정보 조회
 * - PUT /api/user/:id : 사용자 정보 수정
 * - DELETE /api/user/:id : 사용자 삭제
 */

const express = require('express');
const { createUser, getUser } = require('../controllers/userController');

const router = express.Router();

// 사용자 정보 등록
router.post('/user_info', createUser);

// 사용자 정보 조회
router.get('/user_info/:id', getUser);

module.exports = router;

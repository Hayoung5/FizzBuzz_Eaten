const express = require('express');
const passport = require('../config/passport');
const { kakaoCallback, completeSignup, checkUserExists, logout, getMe } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 카카오 로그인 시작
router.get('/kakao', passport.authenticate('kakao'));

// 카카오 콜백 처리
router.get('/kakao/callback', 
  passport.authenticate('kakao', { failureRedirect: '/login' }),
  kakaoCallback
);

// 카카오 사용자 존재 여부 확인
router.post('/check-user', checkUserExists);

// 신규 사용자 추가 정보 등록
router.post('/complete-signup', completeSignup);

// 로그아웃
router.post('/logout', logout);

// 내 정보 조회 (JWT 토큰 필요)
router.get('/me', authenticateToken, getMe);

module.exports = router;

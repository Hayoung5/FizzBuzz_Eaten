/**
 * 메인 애플리케이션 파일
 * - Express 서버 설정 및 시작
 * - 미들웨어 등록
 * - 라우트 연결
 * - 데이터베이스 연결 확인
 */

require('dotenv').config(); // 환경변수를 가장 먼저 로드

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const { testConnection } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const photoRoutes = require('./routes/photoRoutes');
const statsRoutes = require('./routes/statsRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 파싱

// 세션 설정
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // HTTPS에서는 true로 설정
}));

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// API 라우트 연결
app.use('/api', userRoutes);    // 사용자 관련 API
app.use('/api', photoRoutes);   // 사진 분석 API
app.use('/api', statsRoutes);   // 통계/리포트 API
app.use('/api/auth', authRoutes); // 인증 API

// 헬스체크 엔드포인트
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: 'ok',
    database: dbStatus ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// 로그 확인 엔드포인트
app.get('/logs', (req, res) => {
  const logger = require('./src/middleware/logger');
  const lines = parseInt(req.query.lines) || 50;
  const logs = logger.getLogs(lines);
  res.json({ logs, total: logs.length });
});

// 서버 시작
const startServer = async () => {
  try {
    // 데이터베이스 연결 확인
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📋 Available endpoints:`);
      console.log(`   - GET  /api/user_info/:id`);
      console.log(`   - POST /api/user_info`);
      console.log(`   - POST /api/photo_analy`);
      console.log(`   - GET  /api/statistics`);
      console.log(`   - GET  /api/report`);
      console.log(`   - GET  /api/meal_reco`);
      console.log(`   - GET  /api/auth/kakao`);
      console.log(`   - GET  /api/auth/me`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;

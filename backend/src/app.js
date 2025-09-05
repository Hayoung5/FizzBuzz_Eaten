/**
 * 메인 애플리케이션 파일
 * - Express 서버 설정 및 시작
 * - 미들웨어 등록
 * - 라우트 연결
 * - 데이터베이스 연결 확인
 */

const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const photoRoutes = require('./routes/photoRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 파싱

// API 라우트 연결
app.use('/api', userRoutes);    // 사용자 관련 API
app.use('/api', photoRoutes);   // 사진 분석 API
app.use('/api', statsRoutes);   // 통계/리포트 API

// 헬스체크 엔드포인트
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: 'ok',
    database: dbStatus ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// 서버 시작
const startServer = async () => {
  try {
    // 데이터베이스 연결 확인
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;

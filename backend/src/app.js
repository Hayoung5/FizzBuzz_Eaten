/**
 * 메인 애플리케이션 파일
 * - Express 서버 설정 및 시작
 * - 미들웨어 등록
 * - 라우트 연결
 * - 서버 포트 설정
 */

const express = require('express');
const cors = require('cors');
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

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

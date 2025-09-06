/**
 * AI 서버 설정 파일
 * - AI 서버 연결 정보 및 설정값 관리
 * - 환경변수 기반 설정
 * 
 * TODO: 실제 구현시 필요한 설정들
 * - AI 서버 인증 토큰
 * - 타임아웃 설정
 * - 재시도 정책
 * - 로깅 레벨
 */

const aiServerConfig = {
  // AI 서버 기본 URL (환경변수에서 가져오거나 기본값 사용)
  baseURL: process.env.AI_SERVER_URL || 'https://ai-server.example.com',
  
  // API 버전
  apiVersion: 'v1',
  
  // 요청 타임아웃 (밀리초)
  timeout: parseInt(process.env.AI_SERVER_TIMEOUT) || 30000,
  
  // 재시도 횟수
  retryCount: parseInt(process.env.AI_SERVER_RETRY_COUNT) || 3,
  
  // 인증 토큰 (실제 구현시 환경변수에서 가져오기)
  authToken: process.env.AI_SERVER_AUTH_TOKEN || '',
  
  // API 엔드포인트들
  endpoints: {
    analyzeFood: '/api/v1/analyze-food',
    generateHealthReport: '/api/v1/generate-health-report',
    recommendMeal: '/api/v1/recommend-meal'
  }
};

module.exports = aiServerConfig;

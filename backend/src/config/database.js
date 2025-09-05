/**
 * MySQL 데이터베이스 연결 설정
 * - MySQL 연결 풀 관리
 * - 환경별 데이터베이스 설정
 * - 연결 상태 모니터링
 * 
 * TODO: 실제 구현시 필요한 설정들
 * - SSL 연결 설정
 * - 연결 풀 최적화
 * - 쿼리 로깅 설정
 * - 트랜잭션 관리
 */

const mysql = require('mysql2/promise');

// 데이터베이스 연결 설정
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fizzbuzz_eaten',
  
  // 연결 풀 설정
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT) || 60000,
  timeout: parseInt(process.env.DB_TIMEOUT) || 60000,
  
  // 재연결 설정
  reconnect: true,
  
  // 타임존 설정
  timezone: '+09:00'
};

// 연결 풀 생성
const pool = mysql.createPool(dbConfig);

/**
 * 데이터베이스 연결 테스트
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL 데이터베이스 연결 성공');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL 데이터베이스 연결 실패:', error.message);
    return false;
  }
};

/**
 * 쿼리 실행 헬퍼 함수
 * @param {string} query - SQL 쿼리
 * @param {Array} params - 쿼리 파라미터
 * @returns {Promise<Array>} 쿼리 결과
 */
const executeQuery = async (query, params = []) => {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('쿼리 실행 오류:', error.message);
    throw error;
  }
};

/**
 * 트랜잭션 실행 헬퍼 함수
 * @param {Function} callback - 트랜잭션 내에서 실행할 함수
 * @returns {Promise} 트랜잭션 결과
 */
const executeTransaction = async (callback) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  testConnection,
  executeQuery,
  executeTransaction
};

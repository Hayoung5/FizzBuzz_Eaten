/**
 * 데이터베이스 초기화 스크립트
 * - 테이블 생성 및 초기 데이터 삽입
 * - 마이그레이션 실행
 * - 개발용 시드 데이터 생성
 */

const fs = require('fs').promises;
const path = require('path');
const { executeQuery, testConnection } = require('../config/database');

/**
 * SQL 파일 실행
 * @param {string} filePath - SQL 파일 경로
 */
const executeSqlFile = async (filePath) => {
  try {
    const sql = await fs.readFile(filePath, 'utf8');
    
    // 세미콜론으로 구분된 쿼리들을 분리하여 실행
    const queries = sql.split(';').filter(query => query.trim());
    
    for (const query of queries) {
      if (query.trim()) {
        await executeQuery(query);
      }
    }
    
    console.log(`✅ ${path.basename(filePath)} 실행 완료`);
  } catch (error) {
    console.error(`❌ ${path.basename(filePath)} 실행 실패:`, error.message);
    throw error;
  }
};

/**
 * 마이그레이션 실행
 */
const runMigrations = async () => {
  console.log('🔄 데이터베이스 마이그레이션 시작...');
  
  const migrationsDir = path.join(__dirname, 'migrations');
  const migrationFiles = await fs.readdir(migrationsDir);
  
  // 파일명 순서대로 정렬
  migrationFiles.sort();
  
  for (const file of migrationFiles) {
    if (file.endsWith('.sql')) {
      const filePath = path.join(migrationsDir, file);
      await executeSqlFile(filePath);
    }
  }
  
  console.log('✅ 마이그레이션 완료');
};

/**
 * 시드 데이터 삽입
 */
const runSeeds = async () => {
  console.log('🌱 시드 데이터 삽입 시작...');
  
  const seedsDir = path.join(__dirname, 'seeds');
  const seedFiles = await fs.readdir(seedsDir);
  
  // 파일명 순서대로 정렬
  seedFiles.sort();
  
  for (const file of seedFiles) {
    if (file.endsWith('.sql')) {
      const filePath = path.join(seedsDir, file);
      await executeSqlFile(filePath);
    }
  }
  
  console.log('✅ 시드 데이터 삽입 완료');
};

/**
 * 데이터베이스 초기화 실행
 */
const initializeDatabase = async () => {
  try {
    console.log('🚀 데이터베이스 초기화 시작...');
    
    // 데이터베이스 연결 테스트
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('데이터베이스 연결 실패');
    }
    
    // 마이그레이션 실행
    await runMigrations();
    
    // 시드 데이터 삽입 (개발 환경에서만)
    if (process.env.NODE_ENV !== 'production') {
      await runSeeds();
    }
    
    console.log('🎉 데이터베이스 초기화 완료!');
    
  } catch (error) {
    console.error('💥 데이터베이스 초기화 실패:', error.message);
    process.exit(1);
  }
};

// 스크립트로 직접 실행될 때
if (require.main === module) {
  initializeDatabase();
}

module.exports = {
  initializeDatabase,
  runMigrations,
  runSeeds
};

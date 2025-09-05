/**
 * 사용자 데이터 모델
 * - 사용자 정보 저장/조회 관리
 * - 메모리 기반 저장소 (실제 구현시 DB 연동 필요)
 * 
 * TODO: 실제 구현시 필요한 기능들
 * - 데이터베이스 연동 (MongoDB, PostgreSQL 등)
 * - 사용자 인증/권한 관리
 * - 데이터 유효성 검증
 */

class User {
  constructor() {
    this.users = {}; // 임시 메모리 저장소
    this.userCounter = 1000; // 사용자 ID 카운터
  }

  /**
   * 새 사용자 생성
   * @param {Object} userData - {age, gender, activity}
   * @returns {number} 생성된 사용자 ID
   */
  create(userData) {
    const userId = this.userCounter++;
    this.users[userId] = userData;
    return userId;
  }

  /**
   * 사용자 ID로 사용자 정보 조회
   * @param {number} userId - 사용자 ID
   * @returns {Object|undefined} 사용자 정보
   */
  findById(userId) {
    return this.users[userId];
  }
}

module.exports = new User();

/**
 * 음식 로그 데이터 모델
 * - 사용자별 음식 섭취 기록 관리
 * - 메모리 기반 저장소 (실제 구현시 DB 연동 필요)
 * 
 * TODO: 실제 구현시 필요한 기능들
 * - 데이터베이스 연동
 * - 날짜별 조회 기능
 * - 영양소 집계 기능
 * - 데이터 백업/복원
 */

class FoodLog {
  constructor() {
    this.logs = {}; // {userId: [foodLogs]}
  }

  /**
   * 음식 로그 추가
   * @param {number} userId - 사용자 ID
   * @param {Object} logData - 음식 로그 데이터
   */
  add(userId, logData) {
    if (!this.logs[userId]) {
      this.logs[userId] = [];
    }
    this.logs[userId].push(logData);
  }

  /**
   * 사용자별 음식 로그 조회
   * @param {number} userId - 사용자 ID
   * @returns {Array} 음식 로그 배열
   */
  getByUserId(userId) {
    return this.logs[userId] || [];
  }
}

module.exports = new FoodLog();

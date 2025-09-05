/**
 * 사용자 데이터 모델 (MySQL 연동)
 * - MySQL 데이터베이스를 통한 사용자 정보 관리
 * - CRUD 작업 및 데이터 검증
 * 
 * TODO: 실제 구현시 추가할 기능들
 * - 사용자 인증/권한 관리
 * - 데이터 유효성 검증 강화
 * - 사용자 프로필 확장
 * - 개인정보 암호화
 */

const { executeQuery } = require('../config/database');

class User {
  /**
   * 새 사용자 생성
   * @param {Object} userData - {age, gender, activity}
   * @returns {Promise<number>} 생성된 사용자 ID
   */
  async create(userData) {
    const { age, gender, activity } = userData;
    
    // TODO: 데이터 유효성 검증
    // - age: 1-120 범위 체크
    // - gender: enum 값 체크
    // - activity: enum 값 체크
    
    const query = `
      INSERT INTO users (age, gender, activity) 
      VALUES (?, ?, ?)
    `;
    
    const result = await executeQuery(query, [age, gender, activity]);
    return result.insertId;
  }

  /**
   * 사용자 ID로 사용자 정보 조회
   * @param {number} userId - 사용자 ID
   * @returns {Promise<Object|null>} 사용자 정보
   */
  async findById(userId) {
    const query = `
      SELECT id, age, gender, activity, created_at, updated_at 
      FROM users 
      WHERE id = ?
    `;
    
    const result = await executeQuery(query, [userId]);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * 사용자 정보 수정
   * @param {number} userId - 사용자 ID
   * @param {Object} updateData - 수정할 데이터
   * @returns {Promise<boolean>} 수정 성공 여부
   */
  async update(userId, updateData) {
    const { age, gender, activity } = updateData;
    
    const query = `
      UPDATE users 
      SET age = ?, gender = ?, activity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const result = await executeQuery(query, [age, gender, activity, userId]);
    return result.affectedRows > 0;
  }

  /**
   * 사용자 삭제
   * @param {number} userId - 사용자 ID
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async delete(userId) {
    const query = `DELETE FROM users WHERE id = ?`;
    
    const result = await executeQuery(query, [userId]);
    return result.affectedRows > 0;
  }

  /**
   * 사용자별 영양 권장량 조회
   * @param {number} userId - 사용자 ID
   * @returns {Promise<Object|null>} 영양 권장량 정보
   */
  async getNutritionRecommendations(userId) {
    const query = `
      SELECT * FROM nutrition_recommendations 
      WHERE user_id = ?
    `;
    
    const result = await executeQuery(query, [userId]);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * 사용자별 영양 권장량 설정
   * @param {number} userId - 사용자 ID
   * @param {Object} recommendations - 권장량 데이터
   * @returns {Promise<boolean>} 설정 성공 여부
   */
  async setNutritionRecommendations(userId, recommendations) {
    const {
      recommended_calories,
      recommended_carbohydrates,
      recommended_protein,
      recommended_fat,
      recommended_sugar,
      recommended_sodium,
      recommended_fiber
    } = recommendations;

    const query = `
      INSERT INTO nutrition_recommendations (
        user_id, recommended_calories, recommended_carbohydrates, 
        recommended_protein, recommended_fat, recommended_sugar, 
        recommended_sodium, recommended_fiber
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        recommended_calories = VALUES(recommended_calories),
        recommended_carbohydrates = VALUES(recommended_carbohydrates),
        recommended_protein = VALUES(recommended_protein),
        recommended_fat = VALUES(recommended_fat),
        recommended_sugar = VALUES(recommended_sugar),
        recommended_sodium = VALUES(recommended_sodium),
        recommended_fiber = VALUES(recommended_fiber),
        updated_at = CURRENT_TIMESTAMP
    `;

    const result = await executeQuery(query, [
      userId, recommended_calories, recommended_carbohydrates,
      recommended_protein, recommended_fat, recommended_sugar,
      recommended_sodium, recommended_fiber
    ]);

    return result.affectedRows > 0;
  }
}

module.exports = new User();

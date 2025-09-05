/**
 * 음식 로그 데이터 모델 (MySQL 연동)
 * - MySQL 데이터베이스를 통한 음식 섭취 기록 관리
 * - 영양소 통계 및 분석 기능
 * 
 * TODO: 실제 구현시 추가할 기능들
 * - 날짜별/기간별 조회 최적화
 * - 영양소 집계 성능 개선
 * - 데이터 백업/복원 기능
 * - 이미지 파일 관리
 */

const { executeQuery } = require('../config/database');

class FoodLog {
  /**
   * 음식 로그 추가
   * @param {number} userId - 사용자 ID
   * @param {Object} logData - 음식 로그 데이터
   * @returns {Promise<number>} 생성된 로그 ID
   */
  async add(userId, logData) {
    const {
      food_name,
      portion_size,
      time,
      nutrition,
      isProcessed = false,
      isSnack = false,
      imagePath = null
    } = logData;

    const query = `
      INSERT INTO food_logs (
        user_id, food_name, portion_size, meal_time,
        calories, carbohydrates, protein, fat, sugar, sodium, fiber,
        is_processed, is_snack, image_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      userId, food_name, portion_size, time,
      nutrition.calories, nutrition.carbohydrates, nutrition.protein,
      nutrition.fat, nutrition.sugar, nutrition.sodium, nutrition.fiber,
      isProcessed, isSnack, imagePath
    ];

    const result = await executeQuery(query, params);
    return result.insertId;
  }

  /**
   * 사용자별 음식 로그 조회
   * @param {number} userId - 사용자 ID
   * @param {number} days - 조회할 일수 (기본: 7일)
   * @returns {Promise<Array>} 음식 로그 배열
   */
  async getByUserId(userId, days = 7) {
    const query = `
      SELECT * FROM food_logs 
      WHERE user_id = ? 
        AND meal_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ORDER BY meal_time DESC
    `;

    return await executeQuery(query, [userId, days]);
  }

  /**
   * 특정 기간 음식 로그 조회
   * @param {number} userId - 사용자 ID
   * @param {string} startDate - 시작 날짜 (YYYY-MM-DD)
   * @param {string} endDate - 종료 날짜 (YYYY-MM-DD)
   * @returns {Promise<Array>} 음식 로그 배열
   */
  async getByDateRange(userId, startDate, endDate) {
    const query = `
      SELECT * FROM food_logs 
      WHERE user_id = ? 
        AND DATE(meal_time) BETWEEN ? AND ?
      ORDER BY meal_time DESC
    `;

    return await executeQuery(query, [userId, startDate, endDate]);
  }

  /**
   * 일별 영양소 통계 조회
   * @param {number} userId - 사용자 ID
   * @param {number} days - 조회할 일수
   * @returns {Promise<Array>} 일별 영양소 합계
   */
  async getDailyNutritionStats(userId, days = 7) {
    const query = `
      SELECT 
        DATE(meal_time) as date,
        SUM(calories) as total_calories,
        SUM(carbohydrates) as total_carbohydrates,
        SUM(protein) as total_protein,
        SUM(fat) as total_fat,
        SUM(sugar) as total_sugar,
        SUM(sodium) as total_sodium,
        SUM(fiber) as total_fiber,
        COUNT(*) as meal_count,
        SUM(CASE WHEN is_snack = 1 THEN calories ELSE 0 END) as snack_calories,
        SUM(CASE WHEN is_snack = 0 THEN calories ELSE 0 END) as meal_calories,
        SUM(CASE WHEN is_processed = 1 THEN 1 ELSE 0 END) as processed_count,
        SUM(CASE WHEN is_processed = 0 THEN 1 ELSE 0 END) as natural_count
      FROM food_logs 
      WHERE user_id = ? 
        AND meal_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(meal_time)
      ORDER BY date DESC
    `;

    return await executeQuery(query, [userId, days]);
  }

  /**
   * 식사 시간 패턴 분석
   * @param {number} userId - 사용자 ID
   * @param {number} days - 분석할 일수
   * @returns {Promise<Array>} 식사 시간 목록
   */
  async getMealTimePattern(userId, days = 7) {
    const query = `
      SELECT meal_time
      FROM food_logs 
      WHERE user_id = ? 
        AND meal_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
        AND is_snack = 0
      ORDER BY meal_time
    `;

    return await executeQuery(query, [userId, days]);
  }

  /**
   * 음식 로그 삭제
   * @param {number} logId - 로그 ID
   * @param {number} userId - 사용자 ID (권한 확인용)
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async delete(logId, userId) {
    const query = `
      DELETE FROM food_logs 
      WHERE id = ? AND user_id = ?
    `;

    const result = await executeQuery(query, [logId, userId]);
    return result.affectedRows > 0;
  }

  /**
   * 음식 로그 수정
   * @param {number} logId - 로그 ID
   * @param {number} userId - 사용자 ID
   * @param {Object} updateData - 수정할 데이터
   * @returns {Promise<boolean>} 수정 성공 여부
   */
  async update(logId, userId, updateData) {
    const {
      food_name,
      portion_size,
      nutrition,
      isProcessed,
      isSnack
    } = updateData;

    const query = `
      UPDATE food_logs SET
        food_name = ?, portion_size = ?,
        calories = ?, carbohydrates = ?, protein = ?, fat = ?,
        sugar = ?, sodium = ?, fiber = ?,
        is_processed = ?, is_snack = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `;

    const params = [
      food_name, portion_size,
      nutrition.calories, nutrition.carbohydrates, nutrition.protein,
      nutrition.fat, nutrition.sugar, nutrition.sodium, nutrition.fiber,
      isProcessed, isSnack, logId, userId
    ];

    const result = await executeQuery(query, params);
    return result.affectedRows > 0;
  }
}

module.exports = new FoodLog();

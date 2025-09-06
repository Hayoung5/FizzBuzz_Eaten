const { pool } = require('../config/database');

class FoodLog {
    static async create(logData) {
        const { user_id, food_name, calories, protein, carbs, fat, fiber, sodium, sugar, is_processed, is_snack, image_path, time } = logData;

        // ISO 8601 형식을 MySQL DATETIME 형식으로 변환
        const mysqlDateTime = new Date(time).toISOString().slice(0, 19).replace('T', ' ');

        const [result] = await pool.execute(
            `INSERT INTO food_logs (user_id, food_name, calories, protein, carbs, fat, fiber, sodium, sugar, is_processed, is_snack, image_path, logged_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, food_name, calories, protein, carbs, fat, fiber || 0, sodium || 0, sugar || 0, is_processed || false, is_snack || false, image_path, mysqlDateTime]
        );
        return result.insertId;
    }

    static async findByUserId(userId, days = 7) {
        const [rows] = await pool.execute(
            `SELECT * FROM food_logs
             WHERE user_id = ? AND logged_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
             ORDER BY logged_at DESC`,
            [userId, days]
        );
        return rows;
    }

    static async getDailyStats(userId, date) {
        const [rows] = await pool.execute(
            `SELECT
                SUM(calories) as total_calories,
                SUM(protein) as total_protein,
                SUM(carbs) as total_carbs,
                SUM(fat) as total_fat,
                SUM(fiber) as total_fiber,
                SUM(sodium) as total_sodium,
                SUM(sugar) as total_sugar
             FROM food_logs
             WHERE user_id = ? AND DATE(logged_at) = ?`,
            [userId, date]
        );
        return rows[0];
    }
}

module.exports = FoodLog;
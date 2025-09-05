const db = require('../config/database');

class FoodLog {
    static async create(logData) {
        const { user_id, food_name, calories, protein, carbs, fat, fiber, sodium, sugar, image_path, meal_time } = logData;
        const [result] = await db.execute(
            `INSERT INTO food_logs (user_id, food_name, calories, protein, carbs, fat, fiber, sodium, sugar, image_path, meal_time) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, food_name, calories, protein, carbs, fat, fiber || 0, sodium || 0, sugar || 0, image_path, meal_time || 'snack']
        );
        return result.insertId;
    }

    static async findByUserId(userId, days = 7) {
        const [rows] = await db.execute(
            `SELECT * FROM food_logs 
             WHERE user_id = ? AND logged_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
             ORDER BY logged_at DESC`,
            [userId, days]
        );
        return rows;
    }

    static async getDailyStats(userId, date) {
        const [rows] = await db.execute(
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

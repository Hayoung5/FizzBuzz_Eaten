const { pool } = require('../config/database');

class User {
    static async create(userData) {
        const { age, gender, activity_level } = userData;
        const [result] = await pool.execute(
            'INSERT INTO users (age, gender, activity_level) VALUES (?, ?, ?)',
            [age, gender, activity_level]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, userData) {
        const { age, gender, activity_level } = userData;
        await pool.execute(
            'UPDATE users SET age = ?, gender = ?, activity_level = ? WHERE id = ?',
            [age, gender, activity_level, id]
        );
    }
}

module.exports = User;

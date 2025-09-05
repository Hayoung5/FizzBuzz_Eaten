const { pool } = require('../config/database');

class User {
    static async create(userData) {
        const { age, gender, activity } = userData;
        const [result] = await pool.execute(
            'INSERT INTO users (age, gender, activity) VALUES (?, ?, ?)',
            [age, gender, activity]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, userData) {
        const { age, gender, activity } = userData;
        await pool.execute(
            'UPDATE users SET age = ?, gender = ?, activity = ? WHERE id = ?',
            [age, gender, activity, id]
        );
    }
}

module.exports = User;

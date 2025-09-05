const { pool } = require('../config/database');
const nutritionData = require('../data/nutrition-recommendations.json');

class User {
    static async create(userData) {
        const { age, gender, activity } = userData;
        
        // 권장량 계산
        const recommendations = this.calculateRecommendations(age, gender, activity);
        
        const [result] = await pool.execute(
            `INSERT INTO users (age, gender, activity, reco_calories, reco_carbs, reco_protein, reco_fat, reco_sugar, reco_sodium, reco_fiber) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [age, gender, activity, recommendations.calories, recommendations.carbohydrates, recommendations.protein, recommendations.fat, 
             recommendations.sugar, recommendations.sodium, recommendations.fiber]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, userData) {
        const { age, gender, activity } = userData;
        
        // 권장량 재계산
        const recommendations = this.calculateRecommendations(age, gender, activity);
        
        await pool.execute(
            `UPDATE users SET age = ?, gender = ?, activity = ?, reco_calories = ?, reco_carbs = ?, reco_protein = ?, reco_fat = ?, reco_sugar = ?, reco_sodium = ?, reco_fiber = ? 
             WHERE id = ?`,
            [age, gender, activity, recommendations.calories, recommendations.carbohydrates, recommendations.protein, recommendations.fat,
             recommendations.sugar, recommendations.sodium, recommendations.fiber, id]
        );
    }

    static calculateRecommendations(age, gender, activity) {
        // 나이 그룹 결정
        let ageGroup;
        if (age >= 6 && age <= 8) ageGroup = '6-8';
        else if (age >= 9 && age <= 11) ageGroup = '9-11';
        else if (age >= 12 && age <= 14) ageGroup = '12-14';
        else if (age >= 19 && age <= 29) ageGroup = '19-29';
        else if (age >= 30 && age <= 49) ageGroup = '30-49';
        else if (age >= 50 && age <= 64) ageGroup = '50-64';
        else if (age >= 65) ageGroup = '65+';
        else ageGroup = '19-29'; // 기본값

        // 활동량 매핑
        const activityMap = {
            'low': 'low',
            'moderate': 'medium', 
            'high': 'high'
        };

        const activityLevel = activityMap[activity] || 'medium';
        const data = nutritionData[gender]?.[ageGroup];

        if (!data) {
            // 기본값 반환
            return {
                calories: 2000,
                carbohydrates: 300,
                protein: 50,
                fat: 60,
                sugar: 30,
                sodium: 1800,
                fiber: 20
            };
        }

        return {
            calories: data.calories[activityLevel],
            carbohydrates: data.carbohydrates,
            protein: data.protein,
            fat: data.fat,
            sugar: data.sugars,
            sodium: data.sodium,
            fiber: data.fiber
        };
    }
}

module.exports = User;

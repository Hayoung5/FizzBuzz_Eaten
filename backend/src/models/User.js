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
            [age, gender, activity, recommendations.calories, recommendations.carbohydrates, 
             recommendations.protein, recommendations.fat, recommendations.sugar, 
             recommendations.sodium, recommendations.fiber]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async findByOAuth(provider, oauthId) {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ?',
            [provider, oauthId]
        );
        return rows[0];
    }

    static async createOAuthUser(userData) {
        const { oauth_provider, oauth_id, email, name, age, gender, activity } = userData;
        
        // 권장량 계산
        const recommendations = this.calculateRecommendations(age, gender, activity);
        
        const [result] = await pool.execute(
            `INSERT INTO users (oauth_provider, oauth_id, email, name, age, gender, activity, reco_calories, reco_carbs, reco_protein, reco_fat, reco_sugar, reco_sodium, reco_fiber) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [oauth_provider, oauth_id, email, name, age, gender, activity, 
             recommendations.calories, recommendations.carbohydrates, recommendations.protein, 
             recommendations.fat, recommendations.sugar, recommendations.sodium, recommendations.fiber]
        );
        return result.insertId;
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
        
        // 안전한 데이터 접근
        const genderData = nutritionData[gender];
        if (!genderData) {
            console.log(`Gender data not found for: ${gender}, using default`);
            return this.getDefaultRecommendations();
        }
        
        const ageData = genderData[ageGroup];
        if (!ageData) {
            console.log(`Age group data not found for: ${gender}/${ageGroup}, using default`);
            return this.getDefaultRecommendations();
        }

        // 각 영양소별 안전한 접근
        return {
            calories: ageData.calories?.[activityLevel] || 2000,
            carbohydrates: ageData.carbohydrates?.[activityLevel] || 300,
            protein: ageData.protein?.[activityLevel] || 50,
            fat: ageData.fat?.[activityLevel] || 60,
            sugar: ageData.sugar?.[activityLevel] || 30,
            sodium: ageData.sodium?.[activityLevel] || 2000,
            fiber: ageData.fiber?.[activityLevel] || 25
        };
    }

    static getDefaultRecommendations() {
        return {
            calories: 2000,
            carbohydrates: 300,
            protein: 50,
            fat: 60,
            sugar: 30,
            sodium: 2000,
            fiber: 25
        };
    }
}

module.exports = User;

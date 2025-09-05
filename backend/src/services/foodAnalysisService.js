/**
 * 음식 분석 서비스
 * - AI 서버를 통한 음식 사진 분석
 * - 분석 결과 처리 및 데이터베이스 저장
 * - 객체 배열 응답 처리 및 영양정보 총합 계산
 */

const aiClient = require('../clients/aiClient');
const FoodLog = require('../models/FoodLog');

/**
 * 음식 사진 분석 및 로그 저장
 * @param {Object} analysisData - {user_id, time, portion_size, imagePath}
 * @returns {Promise<Object>} 분석 결과
 */
const analyzeAndSaveFood = async (analysisData) => {
  try {
    const { user_id, time, portion_size, imagePath } = analysisData;
    
    // AI 서버에 분석 요청
    const aiResponse = await aiClient.analyzeFood({
      imagePath,
      time,
      portion_size
    });

    if (aiResponse.status !== 'success') {
      throw new Error(aiResponse.message || 'AI 분석 실패');
    }

    const foodItems = aiResponse.data; // 객체 배열

    // 음식명 처리
    let finalFoodName;
    if (foodItems.length > 1) {
      finalFoodName = `${foodItems[0].food_name} 외 ${foodItems.length - 1}개`;
    } else {
      finalFoodName = foodItems[0].food_name;
    }

    // 영양정보 총합 계산
    const totalNutrition = foodItems.reduce((sum, item) => ({
      calories: sum.calories + item.nutrition.calories,
      carbohydrates: sum.carbohydrates + item.nutrition.carbohydrates,
      protein: sum.protein + item.nutrition.protein,
      fat: sum.fat + item.nutrition.fat,
      sugar: sum.sugar + item.nutrition.sugar,
      sodium: sum.sodium + item.nutrition.sodium,
      fiber: sum.fiber + item.nutrition.fiber
    }), {
      calories: 0, carbohydrates: 0, protein: 0, fat: 0, sugar: 0, sodium: 0, fiber: 0
    });

    // 가공식품/간식 여부: 하나라도 true면 true
    const finalIsProcessed = foodItems.some(item => item.is_processed);
    const finalIsSnack = foodItems.some(item => item.is_snack);

    // 데이터베이스에 저장
    const logId = await FoodLog.create({
      user_id,
      food_name: finalFoodName,
      calories: totalNutrition.calories,
      protein: totalNutrition.protein,
      carbs: totalNutrition.carbohydrates,
      fat: totalNutrition.fat,
      fiber: totalNutrition.fiber,
      sodium: totalNutrition.sodium,
      sugar: totalNutrition.sugar,
      is_processed: finalIsProcessed,
      is_snack: finalIsSnack,
      image_path: imagePath,
      time
    });

    return {
      log_id: logId,
      food_name: finalFoodName,
      nutrition: totalNutrition,
      is_processed: finalIsProcessed,
      is_snack: finalIsSnack
    };

  } catch (error) {
    console.error('Food analysis error:', error);
    throw error;
  }
};

module.exports = {
  analyzeAndSaveFood
};

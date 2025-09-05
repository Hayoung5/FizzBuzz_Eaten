/**
 * 음식 분석 서비스
 * - AI 서버를 통한 음식 사진 분석
 * - 분석 결과 처리 및 데이터베이스 저장
 * - 배열 응답 처리 및 영양정보 총합 계산
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

    const { food_name, portion_size: portions, is_processed, is_snack, nutrition } = aiResponse.data;

    // 배열 응답 처리
    let finalFoodName, totalNutrition, finalIsProcessed, finalIsSnack;

    if (Array.isArray(food_name) && food_name.length > 1) {
      // 여러 음식인 경우: "배추김치 외 1개" 형식
      finalFoodName = `${food_name[0]} 외 ${food_name.length - 1}개`;
      
      // 영양정보 총합 계산
      totalNutrition = nutrition.reduce((sum, item) => ({
        calories: sum.calories + item.calories,
        carbohydrates: sum.carbohydrates + item.carbohydrates,
        protein: sum.protein + item.protein,
        fat: sum.fat + item.fat,
        sugar: sum.sugar + item.sugar,
        sodium: sum.sodium + item.sodium,
        fiber: sum.fiber + item.fiber
      }), {
        calories: 0, carbohydrates: 0, protein: 0, fat: 0, sugar: 0, sodium: 0, fiber: 0
      });

      // 가공식품/간식 여부: 하나라도 true면 true
      finalIsProcessed = is_processed.some(Boolean);
      finalIsSnack = is_snack.some(Boolean);
      
    } else {
      // 단일 음식인 경우
      finalFoodName = Array.isArray(food_name) ? food_name[0] : food_name;
      totalNutrition = Array.isArray(nutrition) ? nutrition[0] : nutrition;
      finalIsProcessed = Array.isArray(is_processed) ? is_processed[0] : is_processed;
      finalIsSnack = Array.isArray(is_snack) ? is_snack[0] : is_snack;
    }

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

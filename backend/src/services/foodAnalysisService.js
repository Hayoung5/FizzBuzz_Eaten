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

    console.log('AI Response:', JSON.stringify(aiResponse, null, 2)); // 디버깅용

    const foodItems = aiResponse.data; // 객체 배열

    // 응답 데이터 검증
    if (!Array.isArray(foodItems) || foodItems.length === 0) {
      throw new Error('AI 서버에서 음식 데이터를 받지 못했습니다.');
    }

    // 각 음식 아이템 검증
    for (let i = 0; i < foodItems.length; i++) {
      const item = foodItems[i];
      if (!item.nutrition) {
        console.error(`Food item ${i} missing nutrition:`, item);
        throw new Error(`음식 ${i + 1}의 영양정보가 누락되었습니다.`);
      }
      
      const nutrition = item.nutrition;
      if (typeof nutrition.calories === 'undefined') {
        console.error(`Food item ${i} missing calories:`, nutrition);
        throw new Error(`음식 ${i + 1}의 칼로리 정보가 누락되었습니다.`);
      }
    }

    // 음식명 처리
    let finalFoodName;
    if (foodItems.length > 1) {
      finalFoodName = `${foodItems[0].food_name} 외 ${foodItems.length - 1}개`;
    } else {
      finalFoodName = foodItems[0].food_name;
    }

    // 영양정보 총합 계산
    const totalNutrition = foodItems.reduce((sum, item) => ({
      calories: sum.calories + (item.nutrition.calories || 0),
      carbohydrates: sum.carbohydrates + (item.nutrition.carbohydrates || 0),
      protein: sum.protein + (item.nutrition.protein || 0),
      fat: sum.fat + (item.nutrition.fat || 0),
      sugar: sum.sugar + (item.nutrition.sugar || 0),
      sodium: sum.sodium + (item.nutrition.sodium || 0),
      fiber: sum.fiber + (item.nutrition.fiber || 0)
    }), {
      calories: 0, carbohydrates: 0, protein: 0, fat: 0, sugar: 0, sodium: 0, fiber: 0
    });

    // 가공식품/간식 여부: 하나라도 true면 true
    const finalIsProcessed = foodItems.some(item => item.is_processed);
    const finalIsSnack = foodItems.every(item => item.is_snack);

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

/**
 * 바코드 분석 및 음식 로그 저장
 * @param {Object} data - {user_id, time, portion_size, imagePath}
 * @returns {Object} 분석 결과 및 저장된 로그 정보
 */
const analyzeBarcodeAndSaveFood = async (data) => {
  const { user_id, time, portion_size, imagePath } = data;
  
  try {
    // AI 서버에 바코드 분석 요청
    const aiResponse = await aiClient.analyzeBarcode({
      imagePath,
      time,
      portion_size
    });
    
    // AI 응답을 프론트엔드 API 스펙에 맞게 변환
    const foods = aiResponse.foods || [];
    const savedLogs = [];
    
    // 각 음식을 DB에 저장
    for (const food of foods) {
      const logData = {
        user_id: parseInt(user_id),
        food_name: food.name,
        calories: food.nutrition.calories,
        protein: food.nutrition.protein,
        carbs: food.nutrition.carbohydrates,
        fat: food.nutrition.fat,
        fiber: food.nutrition.fiber,
        sodium: food.nutrition.sodium,
        sugar: food.nutrition.sugar,
        is_processed: food.is_processed || false,
        is_snack: food.is_snack || false,
        logged_at: time,
        image_path: imagePath
      };
      
      const logId = await FoodLog.create(logData);
      savedLogs.push({ ...logData, id: logId });
    }
    
    // 프론트엔드 API 스펙에 맞는 응답 형태로 변환
    return {
      foods: foods.map(food => ({
        name: food.name,
        nutrition: food.nutrition,
        is_processed: food.is_processed || false,
        is_snack: food.is_snack || false
      })),
      total_nutrition: aiResponse.total_nutrition,
      saved_logs: savedLogs
    };
    
  } catch (error) {
    console.error('Barcode analysis service error:', error);
    throw error;
  }
};

module.exports = {
  analyzeAndSaveFood,
  analyzeBarcodeAndSaveFood
};

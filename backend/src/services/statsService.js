/**
 * 통계 및 분석 서비스
 * - AI 서버를 통한 건강 리포트 생성
 * - AI 서버를 통한 개인화된 식사 추천
 * - 사용자별 영양 통계 계산
 * 
 * TODO: 실제 구현시 필요한 기능들
 * - 실제 사용자 음식 로그 데이터 기반 계산
 * - 개인별 권장량 계산 (나이, 성별, 활동량 고려)
 * - 통계 데이터 캐싱
 * - 분석 결과 히스토리 관리
 */

const aiClient = require('../clients/aiClient');
const FoodLog = require('../models/FoodLog');
const User = require('../models/User');

/**
 * 사용자 통계 데이터 조회
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 7일간 영양소 섭취 통계
 */
const getUserStatistics = async (userId) => {
  try {
    // 사용자 정보 및 권장량 조회
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 최근 7일간 식사 기록 조회
    const foodLogs = await FoodLog.findByUserId(userId, 7);
    
    if (foodLogs.length === 0) {
      return {
        times: [],
        meal_snack: [0, 0],
        processed: [0, 0],
        reco_cal: user.reco_calories || 2400,
        reco_carbo: user.reco_carbs || 300,
        reco_protein: user.reco_protein || 65,
        reco_fat: user.reco_fat || 50,
        reco_sugar: user.reco_sugar || 25,
        reco_sodium: user.reco_sodium || 2000,
        cal_log: [0, 0, 0, 0, 0, 0, 0],
        carbo_log: [0, 0, 0, 0, 0, 0, 0],
        protein_log: [0, 0, 0, 0, 0, 0, 0],
        fat_log: [0, 0, 0, 0, 0, 0, 0],
        sugar_log: [0, 0, 0, 0, 0, 0, 0],
        sodium_log: [0, 0, 0, 0, 0, 0, 0]
      };
    }

    // 식사 시간 추출
    const times = foodLogs.map(log => log.logged_at.toISOString());

    // 식사/간식 칼로리 분류
    let mealCalories = 0, snackCalories = 0;
    let processedCount = 0, naturalCount = 0;

    foodLogs.forEach(log => {
      if (log.is_snack) {
        snackCalories += parseFloat(log.calories);
      } else {
        mealCalories += parseFloat(log.calories);
      }

      if (log.is_processed) {
        processedCount++;
      } else {
        naturalCount++;
      }
    });

    // 일별 영양소 합계 계산 (최근 7일)
    const dailyNutrition = {};
    const today = new Date();
    
    // 7일간 초기화
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dailyNutrition[dateKey] = {
        calories: 0, carbs: 0, protein: 0, fat: 0, sugar: 0, sodium: 0
      };
    }

    // 실제 데이터로 채우기
    foodLogs.forEach(log => {
      const dateKey = log.logged_at.toISOString().split('T')[0];
      if (dailyNutrition[dateKey]) {
        dailyNutrition[dateKey].calories += parseFloat(log.calories);
        dailyNutrition[dateKey].carbs += parseFloat(log.carbs);
        dailyNutrition[dateKey].protein += parseFloat(log.protein);
        dailyNutrition[dateKey].fat += parseFloat(log.fat);
        dailyNutrition[dateKey].sugar += parseFloat(log.sugar);
        dailyNutrition[dateKey].sodium += parseFloat(log.sodium);
      }
    });

    // 배열로 변환
    const dates = Object.keys(dailyNutrition).sort();
    const cal_log = dates.map(date => Math.round(dailyNutrition[date].calories));
    const carbo_log = dates.map(date => Math.round(dailyNutrition[date].carbs));
    const protein_log = dates.map(date => Math.round(dailyNutrition[date].protein));
    const fat_log = dates.map(date => Math.round(dailyNutrition[date].fat));
    const sugar_log = dates.map(date => Math.round(dailyNutrition[date].sugar));
    const sodium_log = dates.map(date => Math.round(dailyNutrition[date].sodium));

    return {
      times,
      meal_snack: [Math.round(mealCalories), Math.round(snackCalories)],
      processed: [processedCount, naturalCount],
      reco_cal: user.reco_calories || 2400,
      reco_carbo: user.reco_carbs || 300,
      reco_protein: user.reco_protein || 65,
      reco_fat: user.reco_fat || 50,
      reco_sugar: user.reco_sugar || 25,
      reco_sodium: user.reco_sodium || 2000,
      cal_log,
      carbo_log,
      protein_log,
      fat_log,
      sugar_log,
      sodium_log
    };

  } catch (error) {
    console.error('Statistics calculation error:', error);
    throw error;
  }
};

/**
 * AI 기반 건강 리포트 생성
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 식습관 분석 및 개선 제안
 * 
 * 실제 구현 흐름:
 * 1. 사용자 통계 데이터 수집
 * 2. AI 서버에 건강 리포트 생성 요청
 * 3. AI 분석 결과 반환
 */
const generateHealthReport = async (userId) => {
  try {
    // 사용자 통계 데이터 수집
    const statsData = await getUserStatistics(userId);
    
    // 7일간 평균 섭취량 계산
    const avgCalories = statsData.cal_log.reduce((sum, val) => sum + val, 0) / 7;
    const avgProtein = statsData.protein_log.reduce((sum, val) => sum + val, 0) / 7;
    const avgSugar = statsData.sugar_log.reduce((sum, val) => sum + val, 0) / 7;
    const avgCarbs = statsData.carbo_log.reduce((sum, val) => sum + val, 0) / 7;
    const avgSodium = statsData.sodium_log.reduce((sum, val) => sum + val, 0) / 7;

    // 권장량 대비 비율 계산 (%)
    const ratio = [
      Math.round((avgCalories / statsData.reco_cal) * 100),      // 칼로리
      Math.round((avgProtein / statsData.reco_protein) * 100),   // 단백질
      Math.round((avgSugar / statsData.reco_sugar) * 100),       // 당
      Math.round((avgCarbs / statsData.reco_carbo) * 100),       // 탄수화물
      Math.round((avgSodium / statsData.reco_sodium) * 100)      // 나트륨
    ];

    try {
      // AI 서버에 건강 리포트 생성 요청
      const aiResponse = await aiClient.generateHealthReport(statsData);
      
      // AI 응답에 실제 계산된 ratio 추가
      return {
        ...aiResponse.data,
        ratio: ratio
      };
      
    } catch (aiError) {
      console.error('AI Health Report Error:', aiError.message);
      
      // AI 서버 오류시 목업 데이터 + 실제 ratio
      return {
        meal_pattern: "식사 시간이 비교적 규칙적이나, 늦은 저녁 섭취가 잦습니다.",
        processed_snack_ratio: "최근 7일간 가공식품 비율은 55%, 간식 비율은 30%입니다.",
        reco: "다음 끼니에는 단백질이 풍부한 식품(두부, 계란, 생선)을 포함하면 좋습니다.",
        ratio: ratio
      };
    }
    
  } catch (error) {
    console.error('Health report generation error:', error.message);
    
    // 에러시 기본 리포트 반환
    return {
      meal_pattern: "식사 패턴 분석 중 오류가 발생했습니다.",
      processed_snack_ratio: "가공식품 비율 분석을 완료할 수 없습니다.",
      reco: "건강한 식습관을 위해 규칙적인 식사와 균형잡힌 영양소 섭취를 권장합니다.",
      ratio: [100, 100, 100, 100, 100] // 기본값
    };
  }
};

/**
 * AI 기반 개인화된 식사 추천
 * @param {number} userId - 사용자 ID
 * @returns {Promise<string>} 맞춤 식사 추천 메시지
 * 
 * 실제 구현 흐름:
 * 1. 최근 3일간 식사 데이터 수집
 * 2. AI 서버에 식사 추천 요청
 * 3. 개인화된 추천 결과 반환
 */
const getMealRecommendation = async (userId) => {
  try {
    // 최근 3일간 데이터 수집 (AI 서버 스펙에 맞춤)
    const recentData = _getRecentMealData(userId);
    
    try {
      // AI 서버에 식사 추천 요청
      const aiResponse = await aiClient.recommendMeal(recentData);
      return {
        menu: aiResponse.data.menu,
        reason: aiResponse.data.reason
      };
      
    } catch (aiError) {
      console.error('AI Meal Recommendation Error:', aiError.message);
      
      // AI 서버 오류시 기본 추천 반환
      return {
        menu: [
          "현미밥 + 구운 닭가슴살 + 브로콜리 + 방울토마토",
          "통밀빵 샌드위치 + 아보카도 + 채소 샐러드",
          "연어구이 + 퀴노아 + 구운 채소"
        ],
        reason: "건강한 식습관을 위해 다양한 영양소를 골고루 섭취하고, 가공식품을 줄이며 자연식 위주의 식단을 권장합니다."
      };
    }
    
  } catch (error) {
    console.error('Meal recommendation error:', error.message);
    return {
      menu: ["균형잡힌 식단을 위해 단백질, 탄수화물, 채소를 골고루 섭취하세요."],
      reason: "건강한 식습관을 위해 규칙적인 식사와 균형잡힌 영양소 섭취를 권장합니다."
    };
  }
};

/**
 * 최근 3일간 식사 데이터 수집 (AI 서버 요청 형식에 맞춤)
 * @private
 */
const _getRecentMealData = (userId) => {
  // TODO: 실제 데이터 조회 및 가공
  // const foodLogs = FoodLog.getByUserId(userId);
  // const last3Days = filterLast3Days(foodLogs);
  // return formatForAIServer(last3Days);
  
  // 현재는 목업 데이터 반환
  return {
    times: ["2025-09-03T08:00:00Z", "2025-09-03T12:30:00Z"],
    meal_snack: [6120, 300],
    processed: [5, 4],
    reco_cal: 2400,
    reco_carbo: 300,
    reco_protein: 65,
    reco_fat: 50,
    reco_sugar: 25,
    reco_sodium: 2000,
    cal_log: [2200, 2300, 2500],
    carbo_log: [280, 310, 295],
    protein_log: [60, 70, 65],
    fat_log: [45, 52, 50],
    sugar_log: [20, 22, 18],
    sodium_log: [1900, 2100, 2200]
  };
};

module.exports = { getUserStatistics, generateHealthReport, getMealRecommendation };

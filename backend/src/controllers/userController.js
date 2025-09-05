/**
 * 사용자 관련 컨트롤러
 * - 사용자 등록 요청 처리
 * - 요청 데이터 검증
 * - 응답 형식 관리
 */

const User = require('../models/User');

/**
 * 사용자 정보 등록 API
 * POST /api/user_info
 * @param {Object} req.body - {age: number, gender: string, activity: string}
 * @returns {Object} {user_id: number}
 */
const createUser = async (req, res) => {
  const { age, gender, activity } = req.body;
  
  // 필수 필드 검증
  if (!age || !gender || !activity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const userId = await User.create({ age, gender, activity });
    
    // 생성된 사용자 정보 조회하여 name 포함하여 응답
    const user = await User.findById(userId);
    
    res.json({ 
      user_id: userId,
      name: user.name || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

/**
 * 사용자 정보 조회 API
 * GET /api/user_info/:id
 * @param {string} req.params.id - 사용자 ID
 * @returns {Object} 사용자 정보 (name 포함)
 */
const getUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // 사용자 정보 반환 (name 포함)
    res.json({
      id: user.id,
      name: user.name || null,
      age: user.age,
      gender: user.gender,
      activity: user.activity,
      reco_calories: user.reco_calories,
      reco_carbs: user.reco_carbs,
      reco_protein: user.reco_protein,
      reco_fat: user.reco_fat,
      reco_sugar: user.reco_sugar,
      reco_sodium: user.reco_sodium,
      reco_fiber: user.reco_fiber
    });
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(500).json({ error: 'Failed to get user information' });
  }
};

module.exports = { createUser, getUser };

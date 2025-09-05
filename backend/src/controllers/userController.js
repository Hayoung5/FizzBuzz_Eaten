/**
 * 사용자 관련 컨트롤러
 * - 사용자 등록 요청 처리
 * - 요청 데이터 검증
 * - 응답 형식 관리
 * 
 * TODO: 실제 구현시 추가할 기능들
 * - 입력 데이터 상세 검증 (나이 범위, 성별 enum 등)
 * - 에러 처리 강화
 * - 로깅 추가
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
    res.json({ user_id: userId });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = { createUser };

const { generateToken } = require('../middleware/auth');

/**
 * 카카오 OAuth 콜백 처리
 */
const kakaoCallback = (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.redirect('/auth/callback?success=false&error=auth_failed');
    }
    
    const isNewUser = !user.age || !user.gender || !user.activity;
    
    if (isNewUser) {
      const params = new URLSearchParams({
        success: 'true',
        isNewUser: 'true',
        oauth_id: user.oauth_id,
        email: user.email || '',
        name: user.name || ''
      });
      return res.redirect(`/auth/callback?${params.toString()}`);
    } else {
      const token = generateToken(user.id);
      const params = new URLSearchParams({
        success: 'true',
        isNewUser: 'false',
        token: token,
        user_id: user.id,
        name: user.name || '',
        email: user.email || ''
      });
      return res.redirect(`/auth/callback?${params.toString()}`);
    }
    
  } catch (error) {
    console.error('Kakao callback error:', error);
    res.redirect('/auth/callback?success=false&error=server_error');
  }
};

/**
 * 신규 사용자 추가 정보 등록
 */
const completeSignup = async (req, res) => {
  try {
    const { oauth_provider, oauth_id, email, name, age, gender, activity } = req.body;
    
    if (!age || !gender || !activity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // 사용자 생성
    const User = require('../models/User');
    const userId = await User.createOAuthUser({
      oauth_provider, oauth_id, email, name, age, gender, activity
    });
    
    // JWT 토큰 생성
    const token = generateToken(userId);
    
    res.json({
      success: true,
      token,
      user_id: userId
    });
    
  } catch (error) {
    console.error('Complete signup error:', error);
    res.status(500).json({ error: 'Failed to complete signup' });
  }
};

/**
 * 로그아웃
 */
const logout = (req, res) => {
  // JWT는 stateless이므로 클라이언트에서 토큰 삭제
  res.json({ message: 'Logged out successfully' });
};

/**
 * 내 정보 조회
 */
const getMe = (req, res) => {
  // authenticateToken 미들웨어에서 req.user 설정됨
  const { id, name, email, age, gender, activity } = req.user;
  
  res.json({
    id,
    name,
    email,
    age,
    gender,
    activity
  });
};

/**
 * 카카오 사용자 존재 여부 확인
 */
const checkUserExists = async (req, res) => {
  try {
    const { oauth_id } = req.body;
    
    if (!oauth_id) {
      return res.status(400).json({ error: 'oauth_id is required' });
    }
    
    // 카카오 사용자 존재 여부 확인
    const User = require('../models/User');
    const user = await User.findByOAuth('kakao', oauth_id);
    
    res.json({
      exists: !!user,
      user_id: user ? user.id : null
    });
    
  } catch (error) {
    console.error('Check user exists error:', error);
    res.status(500).json({ error: 'Failed to check user existence' });
  }
};

module.exports = {
  kakaoCallback,
  completeSignup,
  checkUserExists,
  logout,
  getMe
};

const { generateToken } = require('../middleware/auth');

/**
 * 카카오 OAuth 콜백 처리
 */
const kakaoCallback = (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.redirect('http://localhost:3001/login?error=auth_failed');
    }
    
    if (user.isNewUser) {
      // 신규 사용자 - 추가 정보 입력 페이지로 리다이렉트
      const tempData = encodeURIComponent(JSON.stringify({
        oauth_provider: user.oauth_provider,
        oauth_id: user.oauth_id,
        email: user.email,
        name: user.name
      }));
      
      return res.redirect(`http://localhost:3001/setup?temp_data=${tempData}`);
    }
    
    // 기존 사용자 - JWT 토큰 생성하여 메인으로
    const token = generateToken(user.id);
    res.redirect(`http://localhost:3001/dashboard?token=${token}&user_id=${user.id}`);
    
  } catch (error) {
    console.error('Kakao callback error:', error);
    res.redirect('http://localhost:3001/login?error=server_error');
  }
};

/**
 * 신규 사용자 추가 정보 등록
 */
const completeSignup = async (req, res) => {
  try {
    const { oauth_provider, oauth_id, email, name, age, gender, activity } = req.body;
    
    if (!oauth_provider || !oauth_id || !age || !gender || !activity) {
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

module.exports = {
  kakaoCallback,
  completeSignup,
  logout,
  getMe
};

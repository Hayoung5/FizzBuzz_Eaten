const { generateToken } = require('../middleware/auth');

/**
 * 카카오 OAuth 콜백 처리
 */
const kakaoCallback = (req, res) => {
  try {
    const user = req.user;
    console.log('Kakao callback - user:', user);
    
    if (!user) {
      console.log('No user found, redirecting to login');
      return res.redirect('http://44.214.236.166/login?error=auth_failed');
    }
    
    // 신규 사용자인지 확인
    console.log('User isNewUser:', user.isNewUser);
    if (user.isNewUser) {
      // 신규 사용자 - 추가 정보 입력 페이지로
      const setupUrl = `http://44.214.236.166/setup?provider=kakao&oauth_id=${user.oauth_id}&email=${user.email}&name=${encodeURIComponent(user.name || '')}`;
      console.log('Redirecting new user to setup:', setupUrl);
      res.redirect(setupUrl);
    } else {
      // 기존 사용자 - JWT 토큰 생성하여 대시보드로
      const token = generateToken(user.id);
      const dashboardUrl = `http://44.214.236.166/dashboard?token=${token}&user_id=${user.id}`;
      console.log('Redirecting existing user to dashboard:', dashboardUrl);
      res.redirect(dashboardUrl);
    }
    
  } catch (error) {
    console.error('Kakao callback error:', error);
    res.redirect('http://44.214.236.166/login?error=server_error');
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

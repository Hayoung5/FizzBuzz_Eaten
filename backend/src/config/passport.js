const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/User');

console.log('KAKAO_CLIENT_ID:', process.env.KAKAO_CLIENT_ID); // 디버깅용

passport.use(new KakaoStrategy({
  clientID: process.env.KAKAO_CLIENT_ID,
  callbackURL: '/api/auth/kakao/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // 기존 사용자 확인
    let user = await User.findByOAuth('kakao', profile.id);
    
    if (user) {
      // 기존 사용자 로그인 성공
      return done(null, user);
    }
    
    // 신규 사용자 - 기본 정보로 자동 생성
    const userData = {
      oauth_provider: 'kakao',
      oauth_id: profile.id,
      email: profile._json.kakao_account?.email || null,
      name: profile.displayName || profile._json.properties?.nickname || '카카오 사용자',
      age: 25, // 기본값
      gender: 'unknown', // 기본값
      activity: 'moderate' // 기본값
    };
    
    // 사용자 생성
    const userId = await User.createOAuthUser(userData);
    const newUser = await User.findById(userId);
    
    return done(null, newUser);
    
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;

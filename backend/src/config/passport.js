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
    
    // 신규 사용자 - 추가 정보 입력 필요
    // 임시 사용자 정보만 전달
    const tempUser = {
      isNewUser: true,
      oauth_provider: 'kakao',
      oauth_id: profile.id,
      email: profile._json.kakao_account?.email || null,
      name: profile.displayName || profile._json.properties?.nickname
    };
    
    return done(null, tempUser);
    
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  if (user.isNewUser) {
    // 신규 사용자는 임시 데이터를 세션에 저장
    done(null, { isNewUser: true, tempData: user });
  } else {
    // 기존 사용자는 ID만 저장
    done(null, user.id);
  }
});

passport.deserializeUser(async (data, done) => {
  try {
    if (data.isNewUser) {
      // 신규 사용자는 임시 데이터 반환
      done(null, data.tempData);
    } else {
      // 기존 사용자는 DB에서 조회
      const user = await User.findById(data);
      done(null, user);
    }
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;

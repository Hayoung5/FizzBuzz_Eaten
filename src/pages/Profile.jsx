import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import Button from '../components/Button';
import { CARD_WIDTH } from '../constants/layout';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = 1;
        
        const response = await fetch(`http://localhost:3000/api/user_info/${userId}`);
        console.log(response)
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          throw new Error('사용자 정보를 찾을 수 없습니다');
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        setUserInfo({
          id: userId,
          name: '김세끼',
          email: 'kimseekki@kakao.com',
          age: 28,
          gender: 'female',
          activity: 'moderate',
          oauth_provider: 'kakao',
          created_at: '2025-09-05',
          last_login: '2025-09-05 17:30:00'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-16">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center relative" style={{width: CARD_WIDTH}}>
          <h1 className="text-xl font-medium text-gray-800 mb-2">로딩 중...</h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">사용자 정보를 불러오고 있습니다...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-16">
      <div className="bg-white rounded-3xl shadow-lg p-8 text-center relative" style={{width: CARD_WIDTH}}>
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-6 left-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title="뒤로가기"
        >
          <span className="text-lg">←</span>
        </button>
        
        {/* 헤더 */}
        <header className="mb-6">
          <h1 className="text-xl font-medium text-gray-800 mb-2">👤 내 정보</h1>
          <p className="text-sm text-gray-600 leading-relaxed">등록된 사용자 정보를 확인하세요</p>
        </header>

        {/* 컨텐츠 */}
        <div className="space-y-4">
          {/* 프로필 아바타 */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-lime-400 to-green-500 rounded-full mx-auto flex items-center justify-center">
              <span className="text-2xl text-white font-bold">
                {userInfo?.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="bg-lime-50 p-4 rounded-xl mb-4">
            <h3 className="text-sm font-semibold text-lime-800 mb-3">기본 정보</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-lime-600">나이</span>
                <span className="text-sm text-lime-800">{userInfo?.age}세</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-lime-600">성별</span>
                <span className="text-sm text-lime-800">
                  {userInfo?.gender === 'male' ? '남성' : userInfo?.gender === 'female' ? '여성' : '미설정'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-lime-600">활동량</span>
                <span className="text-sm text-lime-800">
                  {userInfo?.activity === 'low' ? '낮음' : 
                   userInfo?.activity === 'moderate' ? '보통' : 
                   userInfo?.activity === 'high' ? '높음' : '미설정'}
                </span>
              </div>
            </div>
          </div>

          {/* 계정 정보 */}
          <div className="bg-green-50 p-4 rounded-xl mb-6">
            <h3 className="text-sm font-semibold text-green-800 mb-3">계정 정보</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-600">로그인 방식</span>
                <span className="text-sm text-green-800 flex items-center">
                  🟡 카카오
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-600">가입일</span>
                <span className="text-sm text-green-800">{userInfo?.created_at}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-600">최근 로그인</span>
                <span className="text-sm text-green-800">{userInfo?.last_login}</span>
              </div>
            </div>
          </div>

          {/* 대시보드 버튼 */}
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/dashboard')}
            className="w-full"
          >
            대시보드로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
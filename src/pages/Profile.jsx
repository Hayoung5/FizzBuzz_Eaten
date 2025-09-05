import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem('userId') || '2';
        
        // API로 사용자 정보 가져오기
        const response = await fetch(`http://44.214.236.166:3000/api/user_info/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          throw new Error('사용자 정보를 찾을 수 없습니다');
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        // API 실패 시 목업 데이터 사용
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">사용자 정보를 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-lg p-7"
           style={{
             background: 'linear-gradient(135deg, #fefefe, #f7faff)',
             boxShadow: '0 6px 14px rgba(0,0,0,0.08)'
           }}>
        
        {/* 프로필 헤더 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-white font-bold">
              {userInfo?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            👤 내 정보
          </h2>
          <p className="text-sm text-gray-500">
            등록된 사용자 정보를 확인하세요
          </p>
        </div>

        {/* 사용자 정보 */}
        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-xl">

            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">나이</span>
              <span className="text-sm text-gray-800">{userInfo?.age}세</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">성별</span>
              <span className="text-sm text-gray-800">
                {userInfo?.gender === 'male' ? '남성' : userInfo?.gender === 'female' ? '여성' : '미설정'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">활동량</span>
              <span className="text-sm text-gray-800">
                {userInfo?.activity === 'low' ? '낮음' : 
                 userInfo?.activity === 'moderate' ? '보통' : 
                 userInfo?.activity === 'high' ? '높음' : '미설정'}
              </span>
            </div>
          </div>

          {/* 계정 정보 */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-blue-800 mb-3">계정 정보</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-600">로그인 방식</span>
              <span className="text-sm text-blue-800 flex items-center">
                🟡 카카오
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-600">가입일</span>
              <span className="text-sm text-blue-800">{userInfo?.created_at}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-600">최근 로그인</span>
              <span className="text-sm text-blue-800">{userInfo?.last_login}</span>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
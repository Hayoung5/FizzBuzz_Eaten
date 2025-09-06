import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../services/api';

const Report = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // 임시로 userId=2 사용
        const data = await reportService.getReport(1);
        setReportData(data);
      } catch (error) {
        console.error('리포트 로드 실패:', error);
        // 에러가 발생해도 기본 리포트 표시
        setReportData({ name: '사용자' });
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">리포트를 생성하고 있습니다...</p>
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
        
        {/* 리포트 제목 */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            📝 {reportData?.name || '사용자'}님의 주간 건강 리포트
          </h2>
          <p className="text-sm text-gray-500">
            (2025년 8월 29일 ~ 9월 4일)
          </p>
        </div>

        {/* 1. 식사 패턴 분석 */}
        <div className="mb-6">
          <h3 className="flex items-center text-base font-semibold text-gray-800 mb-3">
            <span className="text-xl mr-2">🥱</span>
            식사 패턴
          </h3>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 leading-relaxed">
              아침과 점심은 규칙적이지만, 저녁 늦게 야식을 드신 날이 <strong>전체의 30%</strong>를 차지했어요. 
              건강한 수면과 소화를 위해 야식은 조금씩 줄여보는 게 어떨까요?
            </p>
          </div>
        </div>

        {/* 2. 가공식품/간식 비율 */}
        <div className="mb-6">
          <h3 className="flex items-center text-base font-semibold text-gray-800 mb-3">
            <span className="text-xl mr-2">🍔</span>
            가공식품 및 간식 비율
          </h3>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 leading-relaxed">
              최근 7일간 섭취한 음식 중 <strong>가공식품이 약 40%</strong>로 높은 편이에요. 
              간식으로 끼니를 대체한 날도 있었네요. 신선한 재료로 직접 요리하는 즐거움을 느껴보세요!
            </p>
          </div>
        </div>

        {/* 3. 영양 섭취 분석 */}
        <div className="mb-6">
          <h3 className="flex items-center text-base font-semibold text-gray-800 mb-3">
            <span className="text-xl mr-2">🥗</span>
            주요 영양소 섭취 현황
          </h3>
          <div className="space-y-2">
            {/* 칼로리: 적절 */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
              <span className="font-semibold text-green-700">칼로리</span>
              <span className="text-sm text-green-700">권장량의 95% (적절)</span>
            </div>
            
            {/* 단백질: 부족 */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50">
              <span className="font-semibold text-orange-600">단백질</span>
              <span className="text-sm text-orange-600">권장량의 70% (부족)</span>
            </div>
            
            {/* 당류: 과잉 */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-red-50">
              <span className="font-semibold text-red-600">당류</span>
              <span className="text-sm text-red-600">권장량의 120% (과잉)</span>
            </div>
            
            {/* 탄수화물: 적절 */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
              <span className="font-semibold text-green-700">탄수화물</span>
              <span className="text-sm text-green-700">권장량의 105% (적절)</span>
            </div>
            
            {/* 나트륨: 높음 */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-red-50">
              <span className="font-semibold text-red-600">나트륨</span>
              <span className="text-sm text-red-600">권장량의 130% (높음)</span>
            </div>
          </div>
        </div>

        {/* 4. 추천 행동 */}
        <div className="border-t border-gray-200 pt-5">
          <h3 className="flex items-center text-base font-semibold text-gray-800 mb-3">
            <span className="text-xl mr-2">💪</span>
            이튼의 건강 제안
          </h3>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 leading-relaxed">
              다음 식사엔 <strong>단백질(계란, 두부, 닭가슴살)</strong>을 꼭 추가해보세요! 
              달고 짠 음식은 조금만 줄여도, 훨씬 균형 잡힌 식단이 될 거예요. 작은 변화가 건강한 내일을 만듭니다.
            </p>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => navigate('/statistics')}
            className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
          >
            통계로 돌아가기
          </button>
          <button
            onClick={() => navigate('/meal-recommendation')}
            className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
          >
            추천 메뉴 제안
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
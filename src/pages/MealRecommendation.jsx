import React from 'react';
import { useNavigate } from 'react-router-dom';

const MealRecommendation = () => {
  const navigate = useNavigate();

  const recommendation = {
    name: '김세끼',
    recommendation: `🍽 최근 2~3일간 섭취량을 살펴보니, <strong>단백질</strong>이 조금 부족한 편이에요.

🥚 다음 끼니에는 <strong>계란, 두부, 닭가슴살</strong>과 같은 단백질 풍부한 메뉴를 추가하면 좋겠습니다.

🥦 <strong>탄수화물</strong>과 <strong>나트륨</strong>은 충분히 섭취했으니, 밥이나 국물은 조금 가볍게 조절해도 괜찮아요.

🥗 <strong>샐러드나 채소 중심의 반찬</strong>을 함께 곁들이면 균형 잡힌 식사가 됩니다.

🍛 간단히 예를 들면, '<strong>두부 계란덮밥 + 채소 샐러드</strong>', '<strong>닭가슴살 구이 + 야채 볶음</strong>', '<strong>계란 야채 스크램블</strong>' 같은 메뉴를 시도해보세요.

🍎 추가로 비타민 C가 풍부한 <strong>키위, 오렌지, 브로콜리</strong> 같은 과일이나 채소를 간식으로 드시면 면역력 향상에도 도움이 될 거예요!

🍵 물도 하루 8잔 이상 마시는 것을 잊지 마세요. 신진대사와 노폐물 배출에 중요한 역할을 합니다.`
  };

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-7 min-h-[300px] flex flex-col justify-center items-center text-center"
             style={{
               background: 'linear-gradient(135deg, #fefefe, #f7faff)',
               boxShadow: '0 6px 14px rgba(0,0,0,0.08)'
             }}>
          
          {/* 로딩 스피너 */}
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-400 rounded-full animate-spin mb-6"></div>
          
          {/* 안내 문구 */}
          <p className="text-sm text-gray-600 leading-relaxed">
            🤔 이튼이 최근 식사를 분석해<br/>추천 메뉴를 고민하고 있어요...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-lg p-7"
           style={{
             background: 'linear-gradient(135deg, #fefefe, #f7faff)',
             boxShadow: '0 6px 14px rgba(0,0,0,0.08)'
           }}>
        
        {/* 제목 */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            💡 오늘의 맞춤 식사 제안
          </h2>
          <p className="text-sm text-gray-500">
            {recommendation.name}님의 최근 식단을 분석했어요!
          </p>
        </div>

        {/* 추천 내용 */}
        <div className="bg-gray-50 p-5 rounded-xl mb-8">
          {recommendation.recommendation.split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} 
                 className="text-sm text-gray-600 leading-relaxed mb-3 last:mb-0"
                 dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            )
          ))}
        </div>

        {/* 버튼들 */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/report')}
            className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
          >
            리포트로 돌아가기
          </button>
          <button
            onClick={() => navigate('/statistics')}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            통계로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealRecommendation;
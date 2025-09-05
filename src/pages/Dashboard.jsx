import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className="p-8 min-h-screen flex items-center">
      <div className="max-w-lg mx-auto w-full py-16 px-12 rounded-3xl shadow-lg bg-gradient-to-br from-white to-blue-50">
        <h2 className="text-center mb-6 text-gray-800 text-2xl font-medium">
          🤔 무엇을 도와드릴까요?
        </h2>
        <p className="text-base text-gray-600 mb-8 text-center leading-relaxed">
          사진으로 식단을 분석하고, 통계를 확인하며<br/>똑똑한 맞춤 식단을 추천받아보세요!
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/analysis"
            className="flex items-center w-full p-5 border border-gray-200 rounded-2xl bg-white cursor-pointer text-left transition-all duration-200 shadow-sm hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl mr-4">📸</div>
            <div>
              <div className="font-bold text-gray-800 text-base">사진으로 영양분석하기</div>
              <div className="text-sm text-gray-600 mt-1">음식 사진을 통해 영양 정보를 확인하세요.</div>
            </div>
          </Link>

          <Link
            to="/statistics"
            className="flex items-center w-full p-5 border border-gray-200 rounded-2xl bg-white cursor-pointer text-left transition-all duration-200 shadow-sm hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl mr-4">📊</div>
            <div>
              <div className="font-bold text-gray-800 text-base">통계 및 레포트</div>
              <div className="text-sm text-gray-600 mt-1">나의 식단 기록과 건강 리포트를 받으세요.</div>
            </div>
          </Link>

          <Link
            to="/report"
            className="flex items-center w-full p-5 border border-gray-200 rounded-2xl bg-white cursor-pointer text-left transition-all duration-200 shadow-sm hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl mr-4">🥗</div>
            <div>
              <div className="font-bold text-gray-800 text-base">오늘 끼니 추천</div>
              <div className="text-sm text-gray-600 mt-1">사용자 정보 기반 맞춤 식단을 추천해드려요.</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
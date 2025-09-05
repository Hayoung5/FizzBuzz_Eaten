import { useNavigate } from 'react-router-dom'

const Statistics = () => {
  const navigate = useNavigate()
  
  const handlePatternAnalysis = () => {
    navigate('/pattern-analysis')
  }

  const handleAnalysisReport = () => {
    console.log('식사 분석 리포트 클릭')
    navigate('/report')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-8">
      <div className="w-full max-w-md mx-7 p-7 rounded-3xl shadow-lg bg-gradient-to-br from-white to-blue-50">
        <h2 className="text-center mb-3 text-gray-800 text-xl font-semibold">
          📊 통계 및 리포트
        </h2>
        <p className="text-sm text-gray-600 mb-7 text-center leading-relaxed">
          나의 식사 습관을 돌아보고,<br/> 건강한 변화를 위한 리포트를 확인해보세요.
        </p>

        <div className="flex flex-col gap-4">
          <button 
            onClick={handlePatternAnalysis}
            className="flex items-center w-full p-4 border border-gray-200 rounded-2xl bg-white cursor-pointer text-left transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1"
          >
            <div className="text-3xl mr-4">📈</div>
            <div>
              <div className="font-bold text-gray-800 text-sm">식사 패턴 분석</div>
              <div className="text-xs text-gray-600 mt-1">언제, 무엇을 먹는지 한눈에 파악하고 패턴을 발견해요.</div>
            </div>
          </button>

          <button 
            onClick={handleAnalysisReport}
            className="flex items-center w-full p-4 border border-gray-200 rounded-2xl bg-white cursor-pointer text-left transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1"
          >
            <div className="text-3xl mr-4">💡</div>
            <div>
              <div className="font-bold text-gray-800 text-sm">식사 분석 리포트</div>
              <div className="text-xs text-gray-600 mt-1">영양 상태를 진단하고, 맞춤형 건강 조언을 얻어가세요.</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Statistics
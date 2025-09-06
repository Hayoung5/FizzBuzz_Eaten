import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import Button from '../components/Button'

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
    <PageLayout
      title="📊 통계 및 리포트"
      subtitle="나의 식사 습관을 돌아보고, 건강한 변화를 위한 리포트를 확인해보세요."
      showBackButton={true}
      onBack={() => window.history.back()}
    >
      <div className="flex flex-col gap-4">
        <button 
          onClick={handlePatternAnalysis}
          className="flex items-center w-full p-4 border border-gray-200 rounded-2xl bg-white cursor-pointer text-left transition-colors"
        >
          <div className="text-3xl mr-4">📈</div>
          <div>
            <div className="font-bold text-gray-800 text-sm">식사 패턴 분석</div>
            <div className="text-xs text-gray-600 mt-1">언제, 무엇을 먹는지 한눈에 파악하고 패턴을 발견해요.</div>
          </div>
        </button>

        <button 
          onClick={handleAnalysisReport}
          className="flex items-center w-full p-4 border border-gray-200 rounded-2xl bg-white cursor-pointer text-left transition-colors"
        >
          <div className="text-3xl mr-4">💡</div>
          <div>
            <div className="font-bold text-gray-800 text-sm">식사 분석 리포트</div>
            <div className="text-xs text-gray-600 mt-1">영양 상태를 진단하고, 맞춤형 건강 조언을 얻어가세요.</div>
          </div>
        </button>
      </div>
    </PageLayout>
  )
}

export default Statistics
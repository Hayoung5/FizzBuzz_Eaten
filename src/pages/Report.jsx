import { useState, useEffect } from 'react'
import { reportService, mealRecoService } from '../services/api'
import ReportCard from '../components/ReportCard'
import RecommendationCard from '../components/RecommendationCard'

const Report = () => {
  const [report, setReport] = useState(null)
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId')
        if (userId) {
          const [reportData, recoData] = await Promise.all([
            reportService.getReport(userId),
            mealRecoService.getMealRecommendation(userId)
          ])
          setReport(reportData)
          setRecommendation(recoData)
        }
      } catch (error) {
        console.error('리포트 데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-4">로딩 중...</div>

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">건강 리포트</h2>
      
      {report && <ReportCard report={report} />}
      {recommendation && <RecommendationCard recommendation={recommendation} />}
    </div>
  )
}

export default Report
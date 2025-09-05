import { useState, useEffect } from 'react'
import { statisticsService } from '../services/api'
import NutritionChart from '../components/NutritionChart'
import CalorieChart from '../components/CalorieChart'

const Statistics = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId')
        if (userId) {
          const response = await statisticsService.getStatistics(userId)
          setData(response)
        }
      } catch (error) {
        console.error('통계 데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-4">로딩 중...</div>
  if (!data) return <div className="p-4">데이터가 없습니다.</div>

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">주간 영양 통계</h2>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-4">칼로리 섭취량</h3>
        <CalorieChart data={data} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-4">영양소 섭취량</h3>
        <NutritionChart data={data} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-primary-600">
            {data.meal_snack[0]}
          </div>
          <div className="text-sm text-gray-600">식사 칼로리</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-orange-500">
            {data.meal_snack[1]}
          </div>
          <div className="text-sm text-gray-600">간식 칼로리</div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
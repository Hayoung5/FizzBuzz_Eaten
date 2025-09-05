import { useState, useEffect } from 'react'
import { statisticsService } from '../services/api'

const PatternAnalysis = () => {
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

  useEffect(() => {
    if (data && !loading) {
      // Google Charts 로드
      const script = document.createElement('script')
      script.src = 'https://www.gstatic.com/charts/loader.js'
      script.onload = () => {
        window.google.charts.load('current', { packages: ['corechart'] })
        window.google.charts.setOnLoadCallback(drawCharts)
      }
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    }
  }, [data, loading])

  const drawCharts = () => {
    if (!data) return

    // 1. 끼니/간식 비율 차트
    const caloriesData = window.google.visualization.arrayToDataTable([
      ['항목', '칼로리'],
      ['끼니', data.meal_snack[0]],
      ['간식', data.meal_snack[1]]
    ])

    const caloriesOptions = {
      title: '7일간 끼니/간식 비율 (칼로리)',
      pieHole: 0.4,
      colors: ['#22c55e', '#16a34a'],
      fontName: "'Noto Sans KR', 'Segoe UI', sans-serif",
      titleTextStyle: {
        fontSize: 16,
        bold: true,
        color: '#333'
      },
      legend: { position: 'bottom' },
      chartArea: { width: '90%', height: '80%' }
    }

    const caloriesChart = new window.google.visualization.PieChart(
      document.getElementById('piechart_calories')
    )
    caloriesChart.draw(caloriesData, caloriesOptions)

    // 2. 가공식품 비율 차트
    const processedData = window.google.visualization.arrayToDataTable([
      ['식품 종류', '섭취 횟수'],
      ['자연식품', data.processed[1]],
      ['가공식품', data.processed[0]]
    ])

    const processedOptions = {
      title: '가공식품 섭취 비율 (횟수)',
      pieHole: 0.4,
      colors: ['#10b981', '#f59e0b'],
      fontName: "'Noto Sans KR', 'Segoe UI', sans-serif",
      titleTextStyle: {
        fontSize: 16,
        bold: true,
        color: '#333'
      },
      legend: { position: 'bottom' },
      chartArea: { width: '90%', height: '80%' }
    }

    const processedChart = new window.google.visualization.PieChart(
      document.getElementById('piechart_processed')
    )
    processedChart.draw(processedData, processedOptions)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-16">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md text-center">
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-16">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-center mb-7 text-gray-800 text-xl font-semibold">
          🍽️ 식사 패턴 분석
        </h2>
        
        <div id="piechart_calories" style={{ width: '100%', height: '300px' }}></div>
        <div id="piechart_processed" style={{ width: '100%', height: '300px', marginTop: '20px' }}></div>
      </div>
    </div>
  )
}

export default PatternAnalysis
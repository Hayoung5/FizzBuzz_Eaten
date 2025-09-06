import { useState, useEffect } from 'react'
import { statisticsService } from '../services/api'

const PatternAnalysis = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 1
        const response = await statisticsService.getStatistics(userId)
        setData(response)
      } catch (error) {
        console.error('통계 데이터 로드 실패:', error)
        // 실패 시 목업 데이터 사용
        setData({
          meal_snack: [3200, 800], // [끝니 칼로리, 간식 칼로리]
          processed: [12, 8], // [가공식품 횟수, 자연식품 횟수]
          times: ['08:30', '12:45', '19:20', '22:30', '07:45', '13:10', '18:50'],
          reco_cal: 2200,
          reco_carbo: 300,
          reco_protein: 80,
          reco_fat: 70,
          reco_sugar: 50,
          reco_sodium: 2000,
          cal_log: [2100, 2350, 1900, 2500, 2250, 1800, 2400],
          carbo_log: [250, 280, 220, 320, 270, 200, 310],
          protein_log: [85, 92, 75, 98, 88, 70, 95],
          fat_log: [65, 78, 58, 88, 72, 55, 82],
          sugar_log: [45, 52, 38, 58, 48, 35, 55],
          sodium_log: [1800, 2100, 1600, 2300, 1900, 1500, 2200]
        })
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
        window.google.charts.setOnLoadCallback(() => {
          drawCharts()
          drawTimeline()
          drawNutritionCharts()
        })
      }
      document.head.appendChild(script)

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
      }
    }
  }, [data, loading])

  const drawCharts = () => {
    if (!data || !window.google) return

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

  const drawTimeline = () => {
    const container = document.getElementById('timeline-container')
    if (!container) return

    const mockMeals = [
      { date: '9월 5일 (목)', meals: [{ time: '08:30', emoji: '☀️', type: '아침' }, { time: '12:45', emoji: '🍝', type: '점심' }, { time: '19:20', emoji: '🌙', type: '저녁' }] },
      { date: '9월 4일 (수)', meals: [{ time: '09:15', emoji: '☀️', type: '아침' }, { time: '13:10', emoji: '🍝', type: '점심' }, { time: '18:50', emoji: '🌙', type: '저녁' }, { time: '22:30', emoji: '🍗', type: '야식' }] },
      { date: '9월 3일 (화)', meals: [{ time: '07:45', emoji: '☀️', type: '아침' }, { time: '12:20', emoji: '🍝', type: '점심' }, { time: '19:40', emoji: '🌙', type: '저녁' }] }
    ]

    container.innerHTML = mockMeals.map(day => `
      <div style="margin-bottom: 20px;">
        <div style="font-weight: bold; color: #444; margin-bottom: 12px; font-size: 15px;">${day.date}</div>
        <div style="position: relative; width: 100%; height: 8px; background-color: #e9ecef; border-radius: 4px; margin-top: 30px; margin-bottom: 40px;">
          <div style="position:absolute; left:25%; top:8px; height:6px; width:1px; background:#ccc;"></div>
          <div style="position:absolute; left:50%; top:8px; height:10px; width:1px; background:#999;"></div>
          <div style="position:absolute; left:75%; top:8px; height:6px; width:1px; background:#ccc;"></div>

          ${day.meals.map(meal => {
            const hour = parseInt(meal.time.split(':')[0])
            const minute = parseInt(meal.time.split(':')[1])
            const position = ((hour * 60 + minute) / 1440) * 100
            return `
              <div style="position: absolute; left: ${position}%; transform: translateX(-50%); text-align: center; top: -12px;">
                <div title="${meal.type}: ${meal.time}">${meal.emoji}</div>
                <div style="font-size: 11px; color: #555; margin-top: 4px;">${meal.time}</div>
              </div>
            `
          }).join('')}
        </div>
      </div>
    `).join('')
  }

  const [currentNutrient, setCurrentNutrient] = useState('칼로리')

  const nutritionData = {
    '칼로리': {
      data: [['날짜', '칼로리', '권장량'], ['오늘', 2100, 2200], ['1일전', 2350, 2200], ['2일전', 1900, 2200], ['3일전', 2500, 2200], ['4일전', 2250, 2200], ['5일전', 1800, 2200], ['6일전', 2400, 2200]],
      unit: 'kcal'
    },
    '탄수화물': {
      data: [['날짜', '탄수화물', '권장량'], ['오늘', 250, 300], ['1일전', 280, 300], ['2일전', 220, 300], ['3일전', 320, 300], ['4일전', 270, 300], ['5일전', 200, 300], ['6일전', 310, 300]],
      unit: 'g'
    },
    '당': {
      data: [['날짜', '당', '권장량'], ['오늘', 45, 50], ['1일전', 52, 50], ['2일전', 38, 50], ['3일전', 58, 50], ['4일전', 48, 50], ['5일전', 35, 50], ['6일전', 55, 50]],
      unit: 'g'
    },
    '나트륨': {
      data: [['날짜', '나트륨', '권장량'], ['오늘', 1800, 2000], ['1일전', 2100, 2000], ['2일전', 1600, 2000], ['3일전', 2300, 2000], ['4일전', 1900, 2000], ['5일전', 1500, 2000], ['6일전', 2200, 2000]],
      unit: 'mg'
    },
    '단백질': {
      data: [['날짜', '단백질', '권장량'], ['오늘', 85, 80], ['1일전', 92, 80], ['2일전', 75, 80], ['3일전', 98, 80], ['4일전', 88, 80], ['5일전', 70, 80], ['6일전', 95, 80]],
      unit: 'g'
    }
  }

  const drawNutritionCharts = () => {
    if (!window.google) return
    drawBarChart(currentNutrient)
  }

  const drawBarChart = (nutrient) => {
    if (!window.google || !nutritionData[nutrient]) return

    const data = nutritionData[nutrient]
    const barData = window.google.visualization.arrayToDataTable(data.data)

    const barOptions = {
      title: `최근 7일간 ${nutrient} 섭취량`,
      titleTextStyle: { fontSize: 16, bold: true, color: '#333' },
      fontName: "'Noto Sans KR', 'Segoe UI', sans-serif",
      vAxis: { title: `${nutrient} (${data.unit})`, gridlines: { color: '#f3f3f3' } },
      hAxis: { title: '날짜' },
      seriesType: 'bars',
      series: { 1: { type: 'line', color: '#e29595', lineWidth: 2, pointSize: 5 } },
      colors: ['#22c55e'],
      legend: { position: 'bottom' },
      chartArea: { width: '85%', height: '70%' }
    }

    const barChart = new window.google.visualization.ComboChart(
      document.getElementById('bar_chart')
    )
    barChart.draw(barData, barOptions)

    // 파이 차트 데이터
    const pieData = window.google.visualization.arrayToDataTable([
      ['영양소', '그램(g)'],
      ['탄수화물', 150],
      ['단백질', 70],
      ['지방', 50]
    ])

    const pieOptions = {
      title: '최근 3끼의 탄·단·지 구성 비율',
      titleTextStyle: { fontSize: 16, bold: true, color: '#333' },
      fontName: "'Noto Sans KR', 'Segoe UI', sans-serif",
      pieHole: 0.4,
      colors: ['#87CEEB', '#98FB98', '#FFB6C1'],
      legend: { position: 'bottom' },
      chartArea: { width: '90%', height: '75%' }
    }

    const pieChart = new window.google.visualization.PieChart(
      document.getElementById('pie_chart')
    )
    pieChart.draw(pieData, pieOptions)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-16">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-lg text-center">
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* 첫 번째 섹션: 파이차트 */}
      <div className="max-w-lg mx-auto mb-8 bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-center mb-7 text-gray-800 text-xl font-semibold">
          🍽️ 식사 패턴 분석
        </h2>
        <div id="piechart_calories" style={{ width: '100%', height: '300px' }}></div>
        <div id="piechart_processed" style={{ width: '100%', height: '300px', marginTop: '20px' }}></div>
      </div>

      {/* 두 번째 섹션: 식사 타임라인 */}
      <div className="max-w-lg mx-auto mb-8 bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-center mb-3 text-gray-800 text-xl font-semibold">
          📅 최근 식사 기록
        </h2>
        <p className="text-sm text-gray-600 mb-7 text-center leading-relaxed">
          나의 식사 습관을 타임라인으로 확인해보세요.
        </p>
        <div id="timeline-container"></div>
      </div>

      {/* 세 번째 섹션: 상세 영양 분석 */}
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-center mb-7 text-gray-800 text-xl font-semibold">
          📊 상세 영양 분석
        </h2>
        <div className="text-center mb-4">
          {['칼로리', '탄수화물', '당', '나트륨', '단백질'].map(nutrient => (
            <button 
              key={nutrient}
              className={`inline-block px-3 py-1 m-1 text-sm rounded-full border transition-colors ${
                currentNutrient === nutrient 
                  ? 'bg-green-500 text-white border-green-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => {
                setCurrentNutrient(nutrient)
                drawBarChart(nutrient)
              }}
            >
              {nutrient}
            </button>
          ))}
        </div>
        <div id="bar_chart" style={{ width: '100%', height: '350px' }}></div>
        <div id="pie_chart" style={{ width: '100%', height: '320px', marginTop: '30px' }}></div>
      </div>
    </div>
  )
}

export default PatternAnalysis
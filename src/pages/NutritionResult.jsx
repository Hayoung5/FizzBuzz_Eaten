import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(...registerables, ChartDataLabels)

const NutritionResult = ({ data }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  // 목업 데이터 (실제로는 props로 받을 예정)
  const foodData = data || {
    name: "배추김치",
    serving: "100g",
    calories: 35,
    carbs: 7.0,
    protein: 1.5,
    fat: 0.5,
    sugar: 1.0,
    sodium: 800,
    fiber: 2.5
  }

  const nutritionItems = {
    "칼로리": foodData.calories + " kcal",
    "탄수화물": foodData.carbs + " g",
    "단백질": foodData.protein + " g",
    "지방": foodData.fat + " g",
    "당류": foodData.sugar + " g",
    "나트륨": foodData.sodium + " mg",
    "식이섬유": foodData.fiber + " g"
  }

  useEffect(() => {
    if (chartRef.current) {
      // 기존 차트 제거
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const totalMacro = foodData.carbs + foodData.protein + foodData.fat
      const macroPercent = [
        ((foodData.carbs / totalMacro) * 100).toFixed(1),
        ((foodData.protein / totalMacro) * 100).toFixed(1),
        ((foodData.fat / totalMacro) * 100).toFixed(1)
      ]

      const ctx = chartRef.current.getContext('2d')
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['탄수화물', '단백질', '지방'],
          datasets: [{
            data: [foodData.carbs, foodData.protein, foodData.fat],
            backgroundColor: ['#ff9aa2', '#a0c4ff', '#ffdac1'],
            borderColor: '#ffffff',
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom'
            },
            datalabels: {
              color: '#333',
              font: {
                weight: 'bold',
                size: 12
              },
              formatter: (value, context) => {
                const i = context.dataIndex
                return macroPercent[i] + "%"
              }
            }
          }
        },
        plugins: [ChartDataLabels]
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [foodData])

  return (
    <div className="min-h-screen bg-white flex justify-center items-start pt-12">
      <div className="w-full max-w-md text-center">
        <h1 className="text-xl font-bold mb-5 text-black">🥗 영양 성분 분석 결과</h1>

        {/* 영양 정보 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-5 text-left">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            {foodData.name} ({foodData.serving} 기준)
          </h2>
          <table className="w-full">
            <tbody>
              {Object.entries(nutritionItems).map(([key, value]) => (
                <tr key={key}>
                  <td className="py-1.5 text-sm text-gray-600">{key}</td>
                  <td className="py-1.5 text-sm text-gray-600 text-right">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 차트 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">🍚 탄단지 비율</h2>
          <div className="flex justify-center">
            <canvas 
              ref={chartRef}
              className="max-w-64 mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NutritionResult
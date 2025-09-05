import { RotateCcw } from 'lucide-react'

const NutritionResult = ({ result, onReset }) => {
  const nutritionItems = [
    { label: '칼로리', value: result.nutrition.calories, unit: 'kcal' },
    { label: '탄수화물', value: result.nutrition.carbohydrates, unit: 'g' },
    { label: '단백질', value: result.nutrition.protein, unit: 'g' },
    { label: '지방', value: result.nutrition.fat, unit: 'g' },
    { label: '당분', value: result.nutrition.sugar, unit: 'g' },
    { label: '나트륨', value: result.nutrition.sodium, unit: 'mg' },
    { label: '식이섬유', value: result.nutrition.fiber, unit: 'g' }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">{result.food_name}</h3>
        <p className="text-gray-600">{result.portion_size}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="font-medium mb-4">영양 정보</h4>
        <div className="grid grid-cols-2 gap-4">
          {nutritionItems.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-lg font-bold text-primary-600">
                {item.value}{item.unit}
              </div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="flex items-center justify-center w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium"
      >
        <RotateCcw className="mr-2" size={16} />
        다시 분석하기
      </button>
    </div>
  )
}

export default NutritionResult
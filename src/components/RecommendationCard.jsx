const RecommendationCard = ({ recommendation }) => {
  return (
    <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
      <h3 className="font-bold text-green-800 mb-4 text-lg">🍽️ 다음 끼니 추천</h3>
      
      <div className="space-y-3 mb-5">
        {recommendation.menu?.map((menu, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border border-green-100">
            <div className="flex items-start">
              <span className="bg-green-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                {index + 1}
              </span>
              <p className="text-gray-800 text-sm leading-relaxed flex-1">
                {menu}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-green-100 p-4 rounded-xl">
        <h4 className="font-medium text-green-800 mb-2">📝 추천 근거</h4>
        <p className="text-green-700 text-sm leading-relaxed">
          {recommendation.reason}
        </p>
      </div>
    </div>
  )
}

export default RecommendationCard
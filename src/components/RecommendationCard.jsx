import { Lightbulb } from 'lucide-react'

const RecommendationCard = ({ recommendation }) => {
  return (
    <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
      <div className="flex items-start">
        <Lightbulb className="text-primary-600 mr-3 mt-1 flex-shrink-0" size={20} />
        <div>
          <h3 className="font-medium text-primary-800 mb-2">다음 끼니 추천</h3>
          <p className="text-primary-700 text-sm leading-relaxed whitespace-pre-line">
            {recommendation.reco}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RecommendationCard
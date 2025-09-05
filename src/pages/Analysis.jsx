import { useState } from 'react'
import { Camera, Upload } from 'lucide-react'
import PhotoUpload from '../components/PhotoUpload'
import NutritionResult from '../components/NutritionResult'

const Analysis = () => {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6">음식 사진 분석</h2>
      
      {!result ? (
        <PhotoUpload 
          onResult={setResult} 
          loading={loading} 
          setLoading={setLoading} 
        />
      ) : (
        <NutritionResult result={result} onReset={() => setResult(null)} />
      )}
    </div>
  )
}

export default Analysis
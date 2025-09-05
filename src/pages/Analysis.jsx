import { useState } from 'react'
import { photoService } from '../services/api'
import NutritionResult from './NutritionResult'

const Analysis = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [showActions, setShowActions] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const handleFileUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        setSelectedFile(file)
        const reader = new FileReader()
        reader.onload = (event) => {
          setPreviewUrl(event.target.result)
          setShowActions(true)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setShowActions(false)
  }

  const handleCamera = async () => {
    // 카메라 지원 여부 체크
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setModalMessage('이 기기는 카메라를 지원하지 않습니다. 파일 업로드를 이용해주세요.')
      setShowModal(true)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // 카메라 스트림을 캔버스로 캡처하는 로직 추가 예정
      console.log('카메라 접근 성공')
    } catch (error) {
      console.error('카메라 접근 실패:', error)
      
      let errorMessage
      
      if (error.name === 'NotAllowedError') {
        errorMessage = '카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.'
      } else if (error.name === 'NotFoundError') {
        errorMessage = '카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해주세요.'
      } else if (error.name === 'NotReadableError') {
        errorMessage = '카메라가 다른 애플리케이션에서 사용 중입니다.'
      } else {
        errorMessage = '카메라에 접근할 수 없습니다. 파일 업로드를 이용해주세요.'
      }
      
      setModalMessage(errorMessage)
      setShowModal(true)
    }
  }

  const handleConfirm = async () => {
    setIsAnalyzing(true)
    
    try {
      const userId = localStorage.getItem('userId') || 2
      const formData = new FormData()
      formData.append('user_id', userId)
      formData.append('time', new Date().toISOString())
      formData.append('image', selectedFile)
      
      const response = await photoService.analyzePhoto(formData)
      
      const result = {
        name: response.food_name,
        serving: '1인분',
        calories: response.nutrition.calories,
        carbs: response.nutrition.carbohydrates,
        protein: response.nutrition.protein,
        fat: response.nutrition.fat,
        sugar: response.nutrition.sugar,
        sodium: response.nutrition.sodium,
        fiber: response.nutrition.fiber
      }
      
      setAnalysisResult(result)
    } catch (error) {
      console.error('분석 실패:', error)
      setModalMessage('음식 분석에 실패했습니다. 다시 시도해주세요.')
      setShowModal(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 분석 결과 화면
  if (analysisResult) {
    return <NutritionResult data={analysisResult} />
  }

  // 로딩 화면
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-16">
        <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-md text-center">
          <h1 className="text-xl font-medium mb-4">🔎 분석 중...</h1>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            업로드하신 음식 사진을 기반으로 영양 성분을 분석하고 있습니다.<br/>
            조금만 기다려주세요! 🍎🥦🍗
          </p>
          <div className="flex justify-center gap-2 mb-5">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
          <p className="text-xs text-gray-500">
            ※ 분석 완료 후 자동으로 결과 화면으로 이동합니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-16">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md text-center" style={{minHeight: '500px'}}>
        <h1 className="text-xl font-medium mb-4">📸 음식 사진 업로드</h1>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          인공지능이 사진을 분석하여 음식 종류를 자동으로 인식합니다.<br/>
          아래에서 원하는 방법을 선택해주세요.
        </p>
        
        <div className="flex gap-3 mb-5">
          <button 
            onClick={handleCamera}
            className="flex-1 p-4 rounded-xl border-none cursor-pointer text-base font-bold bg-green-500 text-white hover:bg-green-600 transition-all duration-200"
          >
            사진 촬영
          </button>
          
          <button 
            onClick={handleFileUpload}
            className="flex-1 p-4 rounded-xl border-none cursor-pointer text-base font-bold bg-green-500 text-white hover:bg-green-600 transition-all duration-200"
          >
            사진 업로드
          </button>
        </div>

        <div className="h-48 mb-5 flex items-center justify-center bg-gray-50 rounded-xl">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="사진 미리보기" 
              className="max-w-full max-h-full rounded-xl object-contain"
            />
          ) : (
            <p className="text-gray-400 text-sm">사진을 선택해주세요</p>
          )}
        </div>

        {showActions && (
          <div className="flex gap-3 mb-5">
            <button 
              onClick={handleConfirm}
              className="flex-1 p-3 rounded-xl border-none cursor-pointer font-bold text-sm bg-green-500 text-white hover:bg-green-600 transition-all duration-200"
            >
              확인
            </button>
            <button 
              onClick={handleCancel}
              className="flex-1 p-3 rounded-xl border-none cursor-pointer font-bold text-sm bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all duration-200"
            >
              취소
            </button>
          </div>
        )}

        <p className="mt-5 text-xs text-gray-500">
          ※ 촬영 또는 업로드된 사진은 영양 분석 용도로만 사용됩니다.
        </p>
      </div>

      {/* 에러 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-32 z-[9999]">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center shadow-2xl">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-gray-800 mb-6 leading-relaxed">{modalMessage}</p>
            <button 
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analysis
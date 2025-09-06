import { useState } from 'react'
import { photoService } from '../services/api'
import NutritionResult from './NutritionResult'
import PageLayout from '../components/PageLayout'
import Button from '../components/Button'

const BarcodeAnalysis = () => {
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
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setModalMessage('이 기기는 카메라를 지원하지 않습니다. 파일 업로드를 이용해주세요.')
      setShowModal(true)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
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
      formData.append('portion_size', '1개')
      formData.append('photo', selectedFile)
      
      const response = await photoService.analyzeBarcode(formData)
      console.log(response)
      const result = {
        name: response.food_name,
        serving: response.portion_size || '1개',
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
      console.error('바코드 분석 실패:', error)
      
      let errorMessage = '바코드 분석에 실패했습니다.'
      
      if (error.response?.status === 422) {
        errorMessage = '바코드가 감지되지 않았습니다. 바코드가 명확히 보이는 사진을 다시 업로드해주세요.'
      } else if (error.response?.status === 404) {
        errorMessage = '바코드는 인식되었지만 해당 제품의 정보를 찾을 수 없습니다.'
      } else if (error.response?.status === 400) {
        errorMessage = '필수 정보가 누락되었습니다. 다시 시도해주세요.'
      } else if (error.response?.status === 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      }
      
      setModalMessage(errorMessage)
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
      <PageLayout
        title="🔍 바코드 분석 중..."
        subtitle="업로드하신 바코드 이미지를 기반으로 제품 정보와 영양 성분을 분석하고 있습니다. 조금만 기다려주세요! 📱🔍"
      >
        <div className="flex justify-center gap-2 mb-5">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
        <p className="text-xs text-gray-500">
          ※ 분석 완료 후 자동으로 결과 화면으로 이동합니다.
        </p>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title="📱 바코드 사진 업로드"
      subtitle="제품의 바코드를 촬영하거나 업로드하면 인공지능이 제품 정보와 영양성분을 자동으로 분석합니다."
      showBackButton={true}
      onBack={() => window.history.back()}
    >
      {/* 업로드 버튼들 */}
      <div className="flex gap-3 mb-6">
        <Button variant="blue" onClick={handleCamera} className="flex-1">
          바코드 촬영
        </Button>
        <Button variant="blue" onClick={handleFileUpload} className="flex-1">
          사진 업로드
        </Button>
      </div>

      {/* 미리보기 */}
      <div className="h-48 mb-6 flex items-center justify-center bg-gray-50 rounded-xl">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="바코드 미리보기" 
            className="max-w-full max-h-full rounded-xl object-contain"
          />
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">📱</div>
            <p className="text-gray-400 text-sm">바코드 사진을 선택해주세요</p>
          </div>
        )}
      </div>

      {/* 확인/취소 버튼 */}
      {showActions && (
        <div className="flex gap-3 mb-6">
          <Button variant="blue" onClick={handleConfirm} className="flex-1">
            분석하기
          </Button>
          <Button variant="secondary" onClick={handleCancel} className="flex-1">
            취소
          </Button>
        </div>
      )}

      {/* 바코드 촬영 팁 */}
      <div className="bg-blue-50 rounded-xl p-4 mb-4">
        <p className="text-xs text-blue-700 font-medium mb-2">💡 바코드 촬영 팁</p>
        <ul className="text-xs text-blue-600 text-left space-y-1">
          <li>• 바코드가 화면에 선명하게 보이도록 촬영하세요</li>
          <li>• 조명이 충분한 곳에서 촬영하세요</li>
          <li>• 바코드 전체가 사진에 포함되도록 하세요</li>
        </ul>
      </div>

      {/* 안내 문구 */}
      <p className="text-xs text-gray-500">
        ※ 촬영 또는 업로드된 사진은 제품 분석 용도로만 사용됩니다.
      </p>

      {/* 에러 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-32 z-[9999]">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center shadow-2xl">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-gray-800 mb-6 leading-relaxed">{modalMessage}</p>
            <Button variant="blue" onClick={() => setShowModal(false)}>
              확인
            </Button>
          </div>
        </div>
      )}
    </PageLayout>
  )
}

export default BarcodeAnalysis

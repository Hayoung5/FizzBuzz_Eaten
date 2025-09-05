import { useState } from 'react'

const Analysis = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [showActions, setShowActions] = useState(false)

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

  const handleConfirm = () => {
    // 임시로 영양 분석 결과 페이지로 이동
    console.log('영양 분석 시작:', selectedFile)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-16">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-lg text-center">
        <h1 className="text-xl font-medium mb-4">📸 음식 사진 업로드</h1>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          인공지능이 사진을 분석하여 음식 종류를 자동으로 인식합니다.<br/>
          아래에서 원하는 방법을 선택해주세요.
        </p>
        
        <button className="w-full p-4 mb-3 rounded-xl border-none cursor-pointer text-base font-bold bg-green-500 text-white hover:bg-green-600 transition-all duration-200">
          📷 사진 촬영하기
        </button>
        
        <button 
          onClick={handleFileUpload}
          className="w-full p-4 mb-5 rounded-xl border-none cursor-pointer text-base font-bold bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
        >
          🖼️ 사진 업로드하기
        </button>

        {previewUrl && (
          <img 
            src={previewUrl} 
            alt="사진 미리보기" 
            className="mt-5 max-w-full rounded-xl"
          />
        )}

        {showActions && (
          <div className="flex justify-between mt-5 gap-3">
            <button 
              onClick={handleConfirm}
              className="flex-1 p-3 rounded-xl border-none cursor-pointer font-bold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200"
            >
              ✅ 확인
            </button>
            <button 
              onClick={handleCancel}
              className="flex-1 p-3 rounded-xl border-none cursor-pointer font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
            >
              ❌ 취소
            </button>
          </div>
        )}

        <p className="mt-5 text-xs text-gray-500">
          ※ 촬영 또는 업로드된 사진은 영양 분석 용도로만 사용됩니다.
        </p>
      </div>
    </div>
  )
}

export default Analysis
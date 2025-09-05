import { useState } from 'react'
import { Camera, Upload } from 'lucide-react'
import { photoService } from '../services/api'

const PhotoUpload = ({ onResult, loading, setLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [portionSize, setPortionSize] = useState('')

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('photo', selectedFile)
      formData.append('user_id', localStorage.getItem('userId') || '1234')
      formData.append('time', new Date().toISOString())
      if (portionSize) {
        formData.append('portion_size', portionSize)
      }

      const result = await photoService.analyzePhoto(formData)
      onResult(result)
    } catch (error) {
      console.error('분석 실패:', error)
      alert('분석에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {selectedFile ? (
          <div>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="선택된 음식"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-sm text-gray-600">{selectedFile.name}</p>
          </div>
        ) : (
          <div>
            <Camera className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 mb-4">음식 사진을 업로드하세요</p>
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer"
        >
          <Upload className="mr-2" size={16} />
          사진 선택
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">분량 (선택사항)</label>
        <input
          type="text"
          value={portionSize}
          onChange={(e) => setPortionSize(e.target.value)}
          placeholder="예: 1회 제공량, 한 그릇"
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedFile || loading}
        className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium disabled:bg-gray-300"
      >
        {loading ? '분석 중...' : '영양 분석하기'}
      </button>
    </div>
  )
}

export default PhotoUpload
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/api'
import PageLayout from '../components/PageLayout'
import Button from '../components/Button'

const UserSetup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    activity: ''
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.age) {
      newErrors.age = '나이를 입력해주세요'
    } else if (formData.age < 1) {
      newErrors.age = '나이는 1살 이상이어야 합니다'
    }
    if (!formData.gender) newErrors.gender = '성별을 선택해주세요'
    if (!formData.activity) newErrors.activity = '활동 수준을 선택해주세요'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      try {
        const userData = {
          age: parseInt(formData.age),
          gender: formData.gender,
          activity: formData.activity
        }
        
        const result = await userService.createUser(userData)
        
        if (result.user_id) {
          localStorage.setItem('userId', result.user_id)
          navigate('/dashboard')
        }
      } catch (error) {
        console.error('User registration error:', error)
        setErrors({ submit: '사용자 등록 중 오류가 발생했습니다.' })
      }
    }
  }

  return (
    <PageLayout
      title="🍱 세끼 건강 분석 시작하기"
      subtitle="맞춤형 식단과 영양 분석을 위해 간단한 정보를 입력해주세요 ✨"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 나이 입력 */}
        <div>
          <label className="block mb-3 font-bold text-gray-700 text-base">나이</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => {
              setFormData({...formData, age: e.target.value})
              if (errors.age) setErrors({...errors, age: ''})
            }}
            placeholder="예: 25"
            className="w-full p-4 border border-gray-300 rounded-xl text-base bg-white focus:border-lime-400 focus:ring-2 focus:ring-lime-200 transition-colors"
          />
          {errors.age && <p className="text-red-500 text-sm mt-2">{errors.age}</p>}
        </div>

        {/* 성별 선택 */}
        <div>
          <label className="block mb-3 font-bold text-gray-700 text-base">성별</label>
          <div className="relative">
            <select
              value={formData.gender}
              onChange={(e) => {
                setFormData({...formData, gender: e.target.value})
                if (errors.gender) setErrors({...errors, gender: ''})
              }}
              className="w-full p-4 pr-12 border border-gray-300 rounded-xl text-base bg-white appearance-none focus:border-lime-400 focus:ring-2 focus:ring-lime-200 transition-colors"
            >
              <option value="" disabled>선택하세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.gender && <p className="text-red-500 text-sm mt-2">{errors.gender}</p>}
        </div>

        {/* 활동 수준 선택 */}
        <div>
          <label className="block mb-3 font-bold text-gray-700 text-base">활동 수준</label>
          <div className="relative">
            <select
              value={formData.activity}
              onChange={(e) => {
                setFormData({...formData, activity: e.target.value})
                if (errors.activity) setErrors({...errors, activity: ''})
              }}
              className="w-full p-4 pr-12 border border-gray-300 rounded-xl text-base bg-white appearance-none focus:border-lime-400 focus:ring-2 focus:ring-lime-200 transition-colors"
            >
              <option value="" disabled>선택하세요</option>
              <option value="low">⬇️ 낮음 (Low)</option>
              <option value="moderate">⚖️ 보통 (Moderate)</option>
              <option value="high">🔥 높음 (High)</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.activity && <p className="text-red-500 text-sm mt-2">{errors.activity}</p>}
        </div>

        {/* 활동 수준 설명 */}
        <div className="bg-lime-50 rounded-xl p-4 text-sm text-lime-700 leading-relaxed">
          <p className="font-medium mb-2">💡 활동 수준 가이드</p>
          <div className="space-y-1">
            <div>⬇️ <strong>낮음:</strong> 하루 대부분 앉아서 생활, 주 1회 미만 운동</div>
            <div>⚖️ <strong>보통:</strong> 주 1~3회, 1시간 이상 가벼운/중간 강도 운동</div>
            <div>🔥 <strong>높음:</strong> 주 3회 이상 고강도 운동 또는 활동 많은 직업</div>
          </div>
        </div>

        {/* 안내 문구 */}
        <p className="text-sm text-gray-500 text-center">
          📊 입력된 정보는 <strong>맞춤형 분석과 식사 추천</strong>에 활용됩니다.
        </p>

        {/* 에러 메시지 */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* 제출 버튼 */}
        <Button
          type="submit"
          variant="primary"
          size="large"
          className="w-full"
        >
          👉 다음으로
        </Button>
      </form>
    </PageLayout>
  )
}

export default UserSetup
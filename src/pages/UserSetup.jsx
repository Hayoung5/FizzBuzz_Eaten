import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/api'

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
        // URL에서 OAuth 정보 가져오기 (카카오 로그인 후 전달됨)
        const urlParams = new URLSearchParams(window.location.search)
        const oauthProvider = urlParams.get('provider') || 'kakao'
        const oauthId = urlParams.get('oauth_id')
        const email = urlParams.get('email')
        const name = urlParams.get('name')
        
        const userData = {
          oauth_provider: oauthProvider,
          oauth_id: oauthId,
          email: email,
          name: name,
          age: parseInt(formData.age),
          gender: formData.gender,
          activity: formData.activity
        }
        
        const response = await fetch('/api/auth/complete-signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        })
        
        const result = await response.json()
        
        if (result.success) {
          localStorage.setItem('token', result.token)
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
    <div className="p-8 min-h-screen flex items-center">
      <div className="max-w-lg mx-auto w-full py-16 px-12 rounded-3xl shadow-lg bg-gradient-to-br from-white to-blue-50">
        <h2 className="text-center mb-6 text-gray-800 text-2xl font-medium">
          🍱 세끼 건강 분석 시작하기
        </h2>
        <p className="text-base text-gray-600 mb-8 text-center leading-relaxed">
          맞춤형 식단과 영양 분석을 위해<br/> 간단한 정보를 입력해주세요 ✨
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-3 font-bold text-gray-700 text-lg">나이</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => {
                setFormData({...formData, age: e.target.value})
                if (errors.age) setErrors({...errors, age: ''})
              }}
              placeholder="예: 25"
              className="w-full p-4 border border-gray-300 rounded-xl text-base bg-white"
            />
            {errors.age && <p className="text-red-500 text-sm mt-2 mb-4">{errors.age}</p>}
            {!errors.age && <div className="mb-6"></div>}
          </div>

          <div>
            <label className="block mb-3 font-bold text-gray-700 text-lg">성별</label>
            <div className="relative">
              <select
                value={formData.gender}
                onChange={(e) => {
                  setFormData({...formData, gender: e.target.value})
                  if (errors.gender) setErrors({...errors, gender: ''})
                }}
                className="w-full p-4 pr-12 border border-gray-300 rounded-xl text-base bg-white appearance-none"
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
            {errors.gender && <p className="text-red-500 text-sm mt-2 mb-4">{errors.gender}</p>}
            {!errors.gender && <div className="mb-6"></div>}
          </div>

          <div>
            <label className="block mb-3 font-bold text-gray-700 text-lg">활동 수준</label>
            <div className="relative">
              <select
                value={formData.activity}
                onChange={(e) => {
                  setFormData({...formData, activity: e.target.value})
                  if (errors.activity) setErrors({...errors, activity: ''})
                }}
                className="w-full p-4 pr-12 border border-gray-300 rounded-xl text-base bg-white appearance-none"
              >
                <option value="" disabled>선택하세요</option>
                <option value="low">⬇️ 낮음 (Low)</option>
                <option value="medium">⚖️ 보통 (Medium)</option>
                <option value="high">🔥 높음 (High)</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.activity && <p className="text-red-500 text-sm mt-2 mb-4">{errors.activity}</p>}
            {!errors.activity && <div className="mb-4"></div>}
          </div>

          <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-600 mb-6 leading-relaxed">
            ⬇️ 낮음: 하루 대부분 앉아서 생활, 주 1회 미만 운동<br/>
            ⚖️ 보통: 주 1~3회, 1시간 이상 가벼운/중간 강도 운동<br/>
            🔥 높음: 주 3회 이상 고강도 운동 또는 활동 많은 직업
          </div>

          <p className="text-sm text-gray-500 mb-6 text-center">
            📊 입력된 정보는 <b>맞춤형 분석과 식사 추천</b>에 활용됩니다.
          </p>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-300 to-purple-300 text-white border-none rounded-3xl py-5 text-base font-bold tracking-wide shadow-lg hover:opacity-90 transition-opacity duration-200"
          >
            👉 다음으로
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserSetup
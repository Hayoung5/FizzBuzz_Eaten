import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../services/api'
import '../styles/base.css'

const Login = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    activity: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.age) newErrors.age = '나이를 입력해주세요.'
    if (!formData.gender) newErrors.gender = '성별을 선택해주세요.'
    if (!formData.activity) newErrors.activity = '활동량을 선택해주세요.'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)

    // 목업: 2초 후 자동 등록 완료
    setTimeout(() => {
      const mockUserId = Date.now() // 임시 ID 생성
      localStorage.setItem('userId', mockUserId)
      navigate('/dashboard')
      setIsLoading(false)
    }, 2000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // 입력 시 해당 필드 에러 제거
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  return (
    <main className="container">
      <section className="card">
        <header className="center mb-4">
          <div className="logo">🍴</div>
          <h1 className="h1 mt-3">삼시 세끼 영양 분석</h1>
          <p className="text-muted mt-2">건강 분석 시작하기 위한 기본 정보를 입력해주세요.</p>
        </header>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="label" htmlFor="age">나이</label>
            <input 
              className="input" 
              id="age" 
              name="age" 
              type="number" 
              placeholder="25" 
              value={formData.age}
              onChange={handleChange}
            />
            {errors.age && <p className="note" style={{color: 'var(--danger)', marginTop: '4px'}}>{errors.age}</p>}
          </div>

          <div>
            <label className="label" htmlFor="gender">성별</label>
            <select 
              className="input" 
              id="gender" 
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled hidden>선택해주세요</option>
              <option value="male">👨 남성</option>
              <option value="female">👩 여성</option>
            </select>
            {errors.gender && <p className="note" style={{color: 'var(--danger)', marginTop: '4px'}}>{errors.gender}</p>}
          </div>

          <div>
            <label className="label" htmlFor="activity">활동량</label>
            <select 
              className="input" 
              id="activity" 
              name="activity"
              value={formData.activity}
              onChange={handleChange}
            >
              <option value="" disabled hidden>선택해주세요</option>
              <option value="low">🛋️ 낮음</option>
              <option value="medium">🚶 보통</option>
              <option value="high">🏃 높음</option>
            </select>
            {errors.activity && <p className="note" style={{color: 'var(--danger)', marginTop: '4px'}}>{errors.activity}</p>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary mt-3"
            disabled={isLoading}
          >
            {isLoading ? '등록 중...' : '시작하기'}
          </button>
        </form>

        <p className="note mt-4 center">
          ※ 입력하신 정보는 영양 분석 용도로만 사용됩니다.
        </p>
      </section>
    </main>
  )
}

export default Login
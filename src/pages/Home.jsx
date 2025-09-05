import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { statisticsService } from '../services/api'

const Home = () => {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // 백엔드 완성까지 무조건 로그인 페이지로 이동
    navigate('/login')
    setIsChecking(false)
  }, [navigate])

  if (isChecking) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return null
}

export default Home
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const AuthCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleCallback = () => {
      try {
        // URL 파라미터에서 인증 결과 확인
        const success = searchParams.get('success')
        const isNewUser = searchParams.get('isNewUser')
        const token = searchParams.get('token')
        const error = searchParams.get('error')

        if (error) {
          navigate('/login?error=' + error)
          return
        }

        if (success === 'true') {
          if (isNewUser === 'true') {
            // 신규 사용자 - setup 페이지로 이동
            const user = {
              oauth_id: searchParams.get('oauth_id'),
              email: searchParams.get('email'),
              name: searchParams.get('name')
            }
            navigate('/setup', { state: { user } })
          } else {
            // 기존 사용자 - 토큰 저장 후 대시보드로 이동
            if (token) {
              localStorage.setItem('token', token)
              const user = {
                id: searchParams.get('user_id'),
                name: searchParams.get('name'),
                email: searchParams.get('email')
              }
              localStorage.setItem('user', JSON.stringify(user))
              navigate('/dashboard')
            } else {
              navigate('/login?error=token_missing')
            }
          }
        } else {
          navigate('/login?error=auth_failed')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate('/login?error=server_error')
      }
    }

    handleCallback()
  }, [navigate, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  )
}

export default AuthCallback

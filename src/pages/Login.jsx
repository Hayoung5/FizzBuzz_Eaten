import PageLayout from '../components/PageLayout'
import Button from '../components/Button'

const Login = () => {
  const handleKakaoLogin = async () => {
    try {
      window.location.href = '/api/auth/kakao'
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <PageLayout
      subtitle="AI로 분석하는 나만의 영양 관리 서비스"
    >
      {/* 로고 */}
      <div className="mb-8">
        <img 
          src="/FullLogo.png" 
          alt="FizzBuzz Eaten Logo" 
          className="w-48 h-auto mx-auto"
        />
      </div>

      {/* 카카오 로그인 버튼 */}
      <Button
        variant="kakao"
        size="large"
        onClick={handleKakaoLogin}
        className="w-full max-w-xs mx-auto"
      >
        <span className="text-lg">💬</span>
        카카오 로그인
      </Button>

      {/* 안내 문구 */}
      <p className="text-xs text-gray-500 mt-6">
        ※ 카카오 로그인 후 추가 정보를 입력하시면 서비스를 이용하실 수 있습니다.
      </p>
    </PageLayout>
  )
}

export default Login
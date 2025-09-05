import '../styles/base.css'

const Login = () => {
  const handleKakaoLogin = () => {
    window.location.href = '/api/auth/kakao'
  }

  return (
    <main className="container">
      <section className="card">
        <header className="center mb-4">
          <div className="logo">🍴</div>
          <h1 className="h1 mt-3">삼시 세끼 영양 분석</h1>
          <p className="text-muted mt-2">AI로 분석하는 나만의 영양 관리 서비스</p>
        </header>

        <div className="center">
          <button 
            onClick={handleKakaoLogin}
            className="btn" 
            style={{
              backgroundColor: '#FEE500',
              color: '#000000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              maxWidth: '300px'
            }}
          >
            <span style={{ fontSize: '18px' }}>💬</span>
            카카오로 시작하기
          </button>
        </div>

        <p className="note mt-4 center">
          ※ 카카오 로그인 후 추가 정보를 입력하시면 서비스를 이용하실 수 있습니다.
        </p>
      </section>
    </main>
  )
}

export default Login
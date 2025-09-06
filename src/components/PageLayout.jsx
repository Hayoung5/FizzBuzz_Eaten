import { CARD_WIDTH } from '../constants/layout'

const PageLayout = ({ 
  title, 
  subtitle, 
  icon, 
  children, 
  showBackButton = false, 
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start pt-16">
      <div className="bg-white rounded-3xl shadow-lg p-8 text-center relative" style={{width: CARD_WIDTH}}>
        {/* 뒤로가기 버튼 */}
        {showBackButton && (
          <button
            onClick={onBack}
            className="absolute top-6 left-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            title="뒤로가기"
          >
            <span className="text-lg">←</span>
          </button>
        )}
        
        {/* 헤더 */}
        <header className="mb-6">
          {icon && <div className="text-4xl mb-3">{icon}</div>}
          <h1 className="text-xl font-medium text-gray-800 mb-2">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600 leading-relaxed">{subtitle}</p>
          )}
        </header>

        {/* 컨텐츠 */}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default PageLayout

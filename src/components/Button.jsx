const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "font-bold rounded-xl border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
  
  const variants = {
    primary: "bg-gradient-to-r from-lime-400 to-green-500 text-white hover:from-lime-500 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-400",
    secondary: "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 hover:from-gray-400 hover:to-gray-500",
    blue: "bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400",
    kakao: "bg-gradient-to-r from-yellow-300 to-yellow-400 text-black hover:from-yellow-400 hover:to-yellow-500"
  }
  
  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg"
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <button 
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

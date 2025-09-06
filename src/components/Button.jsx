const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "font-bold rounded-xl border-none cursor-pointer transition-colors duration-200 flex items-center justify-center gap-2"
  
  const variants = {
    primary: "bg-lime-500 text-white hover:bg-lime-600 disabled:bg-gray-400",
    secondary: "bg-gray-300 text-gray-700 hover:bg-gray-400",
    blue: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400",
    kakao: "bg-yellow-400 text-black hover:bg-yellow-500"
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

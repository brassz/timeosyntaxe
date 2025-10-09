'use client'

interface TimeoLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function TimeoLogo({ className = '', size = 'md' }: TimeoLogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8', 
    lg: 'h-12'
  }

  return (
    <div className={`flex items-center ${className}`}>
      <svg
        className={sizeClasses[size]}
        viewBox="0 0 200 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* TIME text */}
        <text
          x="0"
          y="45"
          fontSize="48"
          fontWeight="bold"
          fontFamily="Inter, system-ui, sans-serif"
          fill="#1f2937"
        >
          TIME
        </text>
        
        {/* O circle */}
        <circle
          cx="170"
          cy="30"
          r="25"
          fill="#ea580c"
        />
        
        {/* Inner circle for the O */}
        <circle
          cx="170"
          cy="30"
          r="12"
          fill="white"
        />
      </svg>
    </div>
  )
}
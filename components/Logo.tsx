import React from 'react'
import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
  variant?: 'dark' | 'light'
}

export function Logo({ size = 'md', href = '/dashboard', className = '', variant = 'dark' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  const dotSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-8 h-8'
  }

  const LogoContent = () => (
    <div className={`flex items-center ${className}`}>
      {/* TIM em preto com outline */}
      <span className={`${sizeClasses[size]} font-bold ${variant === 'light' ? 'text-white' : 'text-black'} relative`} style={{
        textShadow: variant === 'light' 
          ? '0 0 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.6)' 
          : '0 0 1px rgba(255,255,255,0.8), 0 0 2px rgba(255,255,255,0.6)'
      }}>
        TIM
      </span>
      
      {/* E com barra cortada */}
      <span className={`${sizeClasses[size]} font-bold text-orange-500 relative`}>
        E
        {/* Linha cortada no meio do E */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-full h-0.5 ${variant === 'light' ? 'bg-white' : 'bg-black'} absolute top-1/2 transform -translate-y-1/2`}></div>
        </div>
      </span>
      
      {/* Ō com ponto acima */}
      <span className={`${sizeClasses[size]} font-bold text-orange-500 relative`}>
        O
        {/* Ponto acima do O */}
        <div className={`${dotSizeClasses[size]} bg-orange-500 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2`}></div>
      </span>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}
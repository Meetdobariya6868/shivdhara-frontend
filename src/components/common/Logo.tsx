import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'svg' | 'image';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'image' 
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  // If using image variant, try to load the logo image
  if (variant === 'image') {
    return (
      <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        <img 
          src="/src/assets/images/logo.png" 
          alt="Shivdhara Logo" 
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback to SVG if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.nextElementSibling) {
              (target.nextElementSibling as HTMLElement).style.display = 'block';
            }
          }}
        />
        <svg 
          width="200" 
          height="200" 
          viewBox="0 0 200 200" 
          className="w-full h-full"
          style={{ display: 'none' }}
        >
          <path
            d="M 70 50 Q 85 50 100 60 Q 115 50 130 50 L 160 50 Q 165 50 165 55 L 165 75 Q 165 80 160 80 L 130 80 Q 120 80 110 87 L 100 95 L 90 87 Q 80 80 70 80 L 40 80 Q 35 80 35 75 L 35 55 Q 35 50 40 50 Z"
            fill="#7a9ba8"
            opacity="0.8"
          />
          <ellipse cx="85" cy="65" rx="20" ry="15" fill="#4a6b78" opacity="0.7" />
          
          <path
            d="M 60 95 Q 75 95 90 102 Q 105 95 120 95 L 140 95 Q 145 95 145 100 L 145 120 Q 145 125 140 125 L 120 125 Q 110 125 100 132 L 90 140 L 80 132 Q 70 125 60 125 L 50 125 Q 45 125 45 120 L 45 100 Q 45 95 50 95 Z"
            fill="#a89ba8"
            opacity="0.7"
          />
          <ellipse cx="95" cy="110" rx="18" ry="13" fill="#6a5b6a" opacity="0.8" />
          
          <path
            d="M 70 140 Q 85 140 100 147 Q 115 140 130 140 L 160 140 Q 165 140 165 145 L 165 165 Q 165 170 160 170 L 130 170 Q 120 170 110 177 L 100 185 L 90 177 Q 80 170 70 170 L 40 170 Q 35 170 35 165 L 35 145 Q 35 140 40 140 Z"
            fill="#7a9ba8"
            opacity="0.8"
          />
          <ellipse cx="85" cy="155" rx="20" ry="15" fill="#4a6b78" opacity="0.7" />
          
          <text x="168" y="48" fontSize="10" fill="#666" fontFamily="Arial">™</text>
        </svg>
      </div>
    );
  }

  // SVG variant (original)
  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <svg width="200" height="200" viewBox="0 0 200 200" className="w-full h-full">
        <path
          d="M 70 50 Q 85 50 100 60 Q 115 50 130 50 L 160 50 Q 165 50 165 55 L 165 75 Q 165 80 160 80 L 130 80 Q 120 80 110 87 L 100 95 L 90 87 Q 80 80 70 80 L 40 80 Q 35 80 35 75 L 35 55 Q 35 50 40 50 Z"
          fill="#7a9ba8"
          opacity="0.8"
        />
        <ellipse cx="85" cy="65" rx="20" ry="15" fill="#4a6b78" opacity="0.7" />
        
        <path
          d="M 60 95 Q 75 95 90 102 Q 105 95 120 95 L 140 95 Q 145 95 145 100 L 145 120 Q 145 125 140 125 L 120 125 Q 110 125 100 132 L 90 140 L 80 132 Q 70 125 60 125 L 50 125 Q 45 125 45 120 L 45 100 Q 45 95 50 95 Z"
          fill="#a89ba8"
          opacity="0.7"
        />
        <ellipse cx="95" cy="110" rx="18" ry="13" fill="#6a5b6a" opacity="0.8" />
        
        <path
          d="M 70 140 Q 85 140 100 147 Q 115 140 130 140 L 160 140 Q 165 140 165 145 L 165 165 Q 165 170 160 170 L 130 170 Q 120 170 110 177 L 100 185 L 90 177 Q 80 170 70 170 L 40 170 Q 35 170 35 165 L 35 145 Q 35 140 40 140 Z"
          fill="#7a9ba8"
          opacity="0.8"
        />
        <ellipse cx="85" cy="155" rx="20" ry="15" fill="#4a6b78" opacity="0.7" />
        
        <text x="168" y="48" fontSize="10" fill="#666" fontFamily="Arial">™</text>
      </svg>
    </div>
  );
};
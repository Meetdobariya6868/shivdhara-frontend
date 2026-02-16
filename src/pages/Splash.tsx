import React, { useEffect } from 'react';
import { Logo } from '@/components/shared/layout/Logo';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="absolute top-8 sm:top-12 left-0 right-0 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-[#1a4132]">
          SHIVDHARA
        </h1>
      </div>

      {/* Logo */}
      <div className="animate-pulse">
        <Logo size="lg" />
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 text-center px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
          Marbo & Granite
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600">
          Welcome, to our community
        </p>
      </div>
    </div>
  );
};
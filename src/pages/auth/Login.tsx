import React from 'react';
import { Logo } from '@/components/shared/layout/Logo';
import { LoginForm } from '@/components/auth/LoginForm';

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="flex-shrink-0 pt-8 sm:pt-12 pb-6 sm:pb-8 px-4">
        <Logo size="md" className="mx-auto" />
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-start sm:items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            Login Your Account
          </h1>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};
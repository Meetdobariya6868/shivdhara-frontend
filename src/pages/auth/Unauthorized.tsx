import React from 'react';
import { ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/shared/ui/Button';

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <ShieldOff size={64} className="mx-auto text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page.
        </p>
        <Link to={ROUTES.LOGIN}>
          <Button className="w-full max-w-xs mx-auto">
            Back to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

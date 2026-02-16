import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: number;
  fullScreen?: boolean;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 40, 
  fullScreen = false,
  text 
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
        <Loader2 className="animate-spin text-primary-600" size={size} />
        {text && (
          <p className="mt-4 text-gray-600 text-sm">{text}</p>
        )}
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="animate-spin text-primary-600" size={size} />
    </div>
  );
};
import React, { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface PageContainerProps {
  children: ReactNode;
  showBottomNav?: boolean;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  showBottomNav = true,
  className = ''
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className={`${showBottomNav ? 'pb-20' : 'pb-8'} ${className}`}>
        {children}
      </div>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

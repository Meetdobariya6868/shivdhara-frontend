import React, { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add your header, sidebar, etc. here later */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
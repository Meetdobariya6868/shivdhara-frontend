import { useState, useEffect } from 'react';

// Network Information API types
interface NetworkInformation extends EventTarget {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  addEventListener(type: 'change', listener: () => void): void;
  removeEventListener(type: 'change', listener: () => void): void;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
}

export const useNetwork = (): NetworkStatus => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection speed if available
    if ('connection' in navigator) {
      const connection = (navigator as NavigatorWithConnection).connection;
      
      if (connection) {
        const checkSpeed = () => {
          const slowTypes: Array<string> = ['slow-2g', '2g'];
          if (connection.effectiveType && slowTypes.includes(connection.effectiveType)) {
            setIsSlowConnection(true);
          } else {
            setIsSlowConnection(false);
          }
        };
        
        connection.addEventListener('change', checkSpeed);
        checkSpeed();
        
        return () => {
          connection.removeEventListener('change', checkSpeed);
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isSlowConnection };
};
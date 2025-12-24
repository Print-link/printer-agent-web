import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const { theme } = useTheme();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 ${
        theme === 'dark'
          ? 'bg-yellow-900/90 border-b border-yellow-800'
          : 'bg-yellow-50 border-b border-yellow-200'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center justify-center gap-2 px-4 py-2">
        <WifiOff size={16} className={theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'} />
        <span className={`text-sm font-medium ${
          theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'
        }`}>
          You are currently offline. Some features may be unavailable.
        </span>
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Wifi, RefreshCw, CloudOff } from 'lucide-react';

interface ConnectivityIssueProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  compact?: boolean;
  style?: React.CSSProperties;
}

export function ConnectivityIssue({
  message,
  onRetry,
  showRetry = true,
  compact = false,
  style,
}: ConnectivityIssueProps) {
  const { theme } = useTheme();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);

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

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
    } else {
      setIsRetrying(true);
      try {
        await fetch('/', { method: 'HEAD', cache: 'no-cache' });
        setIsOnline(true);
      } catch {
        // Still offline
      } finally {
        setIsRetrying(false);
      }
    }
  };

  const defaultMessage = isOnline
    ? 'Unable to connect to the server. Please check your connection and try again.'
    : 'No internet connection. Please check your network settings.';

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 p-2 rounded-md ${
          theme === 'dark'
            ? 'bg-amber-900/30 border border-amber-800'
            : 'bg-amber-50 border border-amber-200'
        }`}
        style={style}
      >
        <Wifi
          size={16}
          className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}
        />
        <span className={`text-sm flex-1 ${
          theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
        }`}>
          {message || defaultMessage}
        </span>
        {showRetry && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={`p-1 rounded ${
              theme === 'dark'
                ? 'hover:bg-amber-900/50 text-amber-400'
                : 'hover:bg-amber-100 text-amber-600'
            } ${isRetrying ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Retry connection"
          >
            <RefreshCw
              size={14}
              className={isRetrying ? 'animate-spin' : ''}
            />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 min-h-[200px] w-full ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}
      style={style}
    >
      <div className="flex flex-col items-center text-center max-w-[500px] w-full">
        <div className="mb-3">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-100'
          }`}>
            {isOnline ? (
              <CloudOff size={48} className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} />
            ) : (
              <Wifi size={48} className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} />
            )}
          </div>
        </div>

        <h3 className={`text-xl font-semibold mb-2 ${
          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {isOnline ? 'Connection Issue' : "You're Offline"}
        </h3>

        <p className={`text-sm mb-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {message || defaultMessage}
        </p>

        {showRetry && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={`px-5 py-2 rounded-md font-medium flex items-center gap-2 ${
              isRetrying
                ? 'bg-amber-300 cursor-not-allowed'
                : 'bg-amber-400 hover:bg-amber-500'
            } text-gray-900 transition-all`}
          >
            <RefreshCw size={18} className={isRetrying ? 'animate-spin' : ''} />
            {isRetrying ? 'Retrying...' : 'Retry Connection'}
          </button>
        )}

        {isOnline && !isRetrying && (
          <p className={`text-xs mt-4 italic ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            You may be viewing cached data. New updates will appear when connection is restored.
          </p>
        )}
      </div>
    </div>
  );
}


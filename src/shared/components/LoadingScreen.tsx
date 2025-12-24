import { useTheme } from '../../contexts/ThemeContext';
import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  const { theme } = useTheme();

  return (
    <div className={`flex items-center justify-center h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className={`animate-spin ${
          theme === 'dark' ? 'text-amber-400' : 'text-amber-500'
        }`} size={48} />
        <p className={`text-lg ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Loading...
        </p>
      </div>
    </div>
  );
}


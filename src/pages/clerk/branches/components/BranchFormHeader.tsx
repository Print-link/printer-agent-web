import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';

interface BranchFormHeaderProps {
  title: string;
  description: string;
  onBack: () => void;
}

export function BranchFormHeader({ title, description, onBack }: BranchFormHeaderProps) {
  const { theme } = useTheme();

  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={onBack}
        className={`p-2 rounded-md ${
          theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
        }`}
      >
        <ArrowLeft size={24} />
      </button>
      <div>
        <h1 className={`text-2xl font-bold ${
          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {title}
        </h1>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          {description}
        </p>
      </div>
    </div>
  );
}


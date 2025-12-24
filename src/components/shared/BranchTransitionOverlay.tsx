import { useEffect, useState } from 'react';
import { Store } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { Branch } from '../../types';

interface BranchTransitionOverlayProps {
  branch: Branch | null;
  isVisible: boolean;
}

export function BranchTransitionOverlay({
  branch,
  isVisible,
}: BranchTransitionOverlayProps) {
  const { theme } = useTheme();
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isVisible && branch) {
      setShouldRender(true);
      setImageError(false);
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isVisible, branch]);

  if (!shouldRender || !branch) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .branch-transition-overlay {
          animation: ${isAnimating ? 'fadeInScale 0.4s ease-out' : 'fadeOut 0.4s ease-in'};
        }

        .branch-transition-icon {
          animation: pulse 2s ease-in-out infinite;
        }

        .branch-transition-spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
      <div
        className="branch-transition-overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6"
        style={{
          background: theme === 'dark' 
            ? 'rgba(0, 0, 0, 0.9)' 
            : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(12px)',
          opacity: isAnimating ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Branch Image/Icon */}
        <div
          className="branch-transition-icon w-[120px] h-[120px] rounded-[20px] overflow-hidden flex items-center justify-center relative"
          style={{
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            border: '3px solid #fbbf24',
            boxShadow: theme === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.4)'
              : '0 8px 32px rgba(0, 0, 0, 0.15)',
          }}
        >
          {branch.branchCoverImage && !imageError ? (
            <img
              src={branch.branchCoverImage}
              alt={branch.name}
              className="w-full h-full object-cover"
              onError={() => {
                setImageError(true);
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                color: '#fbbf24',
                background: theme === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)',
              }}
            >
              <Store size={48} />
            </div>
          )}
        </div>

        {/* Branch Name */}
        <div className="text-center max-w-[400px] px-6">
          <h2 className={`text-[28px] font-bold m-0 mb-2 leading-tight ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Switching to {branch.name}
          </h2>
          {branch.location?.address && (
            <p className={`text-base m-0 leading-normal ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {branch.location.address}
            </p>
          )}
        </div>

        {/* Loading Spinner */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="branch-transition-spinner w-10 h-10 rounded-full"
            style={{
              border: `4px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              borderTop: '4px solid #fbbf24',
            }}
          />
          <p className={`text-sm m-0 font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Loading branch data...
          </p>
        </div>
      </div>
    </>
  );
}


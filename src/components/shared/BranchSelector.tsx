import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search, Store, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../stores/authStore';
import { useBranchStore } from '../../stores/branchStore';
import { apiService } from '../../services/api';
import { BranchTransitionOverlay } from './BranchTransitionOverlay';
import type { Branch } from '../../types';

interface BranchSelectorProps {
  isSidebarCollapsed: boolean;
}

export function BranchSelector({ isSidebarCollapsed }: BranchSelectorProps) {
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const { selectedBranch, selectBranch, clearBranch, setLoading, setError } = useBranchStore();
  const [isOpen, setIsOpen] = useState(false);
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);
  const [transitionBranch, setTransitionBranch] = useState<Branch | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Fetch all branches when dropdown opens
  useEffect(() => {
    if (isOpen && allBranches.length === 0 && user?.id) {
      setIsLoadingBranches(true);
      apiService.getAllBranches(user.id)
        .then((branches) => {
          setAllBranches(branches);
        })
        .catch((error) => {
          setError(error instanceof Error ? error.message : 'Failed to load branches');
        })
        .finally(() => {
          setIsLoadingBranches(false);
        });
    }
  }, [isOpen, allBranches.length, setError, user?.id]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Don't render if no branch is selected or sidebar is collapsed
  if (!selectedBranch || isSidebarCollapsed) {
    return null;
  }

  const handleBranchSelect = async (branch: Branch) => {
    if (branch.id === selectedBranch.id) {
      setIsOpen(false);
      return;
    }

    // Prevent multiple clicks
    if (isSwitching) return;

    try {
      setIsSwitching(true);
      setSelectedBranchId(branch.id);
      
      // Show immediate visual feedback
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Show transition overlay
      setTransitionBranch(branch);
      setShowTransition(true);
      setLoading(true);
      setError(null);
      
      // Keep dropdown open briefly to show selection
      await new Promise((resolve) => setTimeout(resolve, 200));
      setIsOpen(false);

      // Fetch branch details
      const branchDetails = await apiService.getBranchById(branch.id);
      selectBranch(branchDetails);

      // Wait for transition animation
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      // Navigate to dashboard
      navigate('/clerk/dashboard');

      // Hide overlay after navigation
      setTimeout(() => {
        setShowTransition(false);
        setTransitionBranch(null);
        setLoading(false);
        setSelectedBranchId(null);
        setIsSwitching(false);
      }, 500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch branch';
      setError(errorMessage);
      setShowTransition(false);
      setTransitionBranch(null);
      setLoading(false);
      setSelectedBranchId(null);
      setIsSwitching(false);
    }
  };

  const handleDeselectBranch = async () => {
    // Prevent multiple clicks
    if (isSwitching) return;

    try {
      setIsSwitching(true);
      setLoading(true);
      setError(null);
      setIsOpen(false);

      // Clear the selected branch
      clearBranch();

      // Navigate to overview page (where managers see when no branch is selected)
      navigate('/clerk/overview');

      // Reset state
      setTimeout(() => {
        setLoading(false);
        setIsSwitching(false);
      }, 300);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to deselect branch';
      setError(errorMessage);
      setLoading(false);
      setIsSwitching(false);
    }
  };

  const formatAddress = (location?: Branch['location']) => {
    if (!location?.address) return 'No address';
    if (location.address.length > 35) {
      return location.address.substring(0, 32) + '...';
    }
    return location.address;
  };

  const filteredBranches = allBranches.filter((branch) => {
    if (branch.id === selectedBranch.id) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      branch.name.toLowerCase().includes(query) ||
      branch.location?.address?.toLowerCase().includes(query)
    );
  });

  const visibleBranches = filteredBranches.slice(0, visibleCount);
  const hasMore = filteredBranches.length > visibleCount;

  return (
    <>
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <BranchTransitionOverlay
        branch={transitionBranch}
        isVisible={showTransition}
      />
      <div
        ref={dropdownRef}
        className={`relative border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        } p-3`}
      >
        {/* Current Branch Display */}
        <button
          onClick={() => {
            if (!isSwitching) {
              setIsOpen(!isOpen);
              if (!isOpen) {
                setSearchQuery('');
                setVisibleCount(5);
              }
            }
          }}
          disabled={isSwitching}
          className={`w-full p-2 border-none bg-transparent cursor-pointer text-left flex items-center gap-2 rounded-lg transition-all ${
            isSwitching
              ? 'opacity-60 cursor-not-allowed'
              : theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
          }`}
        >
          {/* Branch Image Thumbnail */}
          {selectedBranch.branchCoverImage ? (
            <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 border">
              <img
                src={selectedBranch.branchCoverImage}
                alt={selectedBranch.name}
                className="w-full h-full object-cover block"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className={`w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center ${
              theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}>
              <Store size={16} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-semibold truncate mb-0.5 ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {selectedBranch.name}
            </div>
            <div className={`text-xs truncate ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {formatAddress(selectedBranch.location)}
            </div>
          </div>
          <div className={`text-xs flex-shrink-0 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className={`absolute top-full left-0 right-0 rounded-lg shadow-xl z-[1000] max-h-[500px] overflow-hidden mt-1 flex flex-col transition-all duration-200 ${
              theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
            style={{
              animation: 'fadeInDown 0.2s ease-out',
            }}
          >
            {/* Search Input */}
            <div className={`p-3 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="relative flex items-center">
                <Search
                  className={`absolute left-2.5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                  size={14}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search branches..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(5);
                  }}
                  className={`w-full pl-8 pr-2 py-2 rounded-md border text-xs outline-none ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-gray-100'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsOpen(false);
                    }
                  }}
                />
              </div>
            </div>

            {/* Deselect Branch Option */}
            <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={handleDeselectBranch}
                disabled={isSwitching}
                className={`w-full p-3 border-none bg-transparent cursor-pointer text-left flex items-center gap-3 transition-all ${
                  isSwitching
                    ? 'opacity-50 cursor-not-allowed'
                    : theme === 'dark'
                    ? 'hover:bg-red-900/20 active:bg-red-900/30 text-red-400'
                    : 'hover:bg-red-50 active:bg-red-100 text-red-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'
                }`}>
                  <X size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}>
                    Deselect Branch
                  </div>
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Return to overview
                  </div>
                </div>
              </button>
            </div>

            {/* Branches List */}
            <div className="overflow-y-auto max-h-[400px]">
              {isLoadingBranches ? (
                <div className={`p-6 text-center ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Loading branches...
                </div>
              ) : visibleBranches.length === 0 ? (
                <div className={`p-6 text-center ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {searchQuery ? 'No branches found' : 'No other branches available'}
                </div>
              ) : (
                <>
                  {visibleBranches.map((branch) => {
                    const isSelected = selectedBranchId === branch.id;
                    const isActive = isSelected && isSwitching;
                    
                    return (
                      <button
                        key={branch.id}
                        onClick={() => handleBranchSelect(branch)}
                        disabled={isSwitching}
                        className={`w-full p-3 border-none bg-transparent cursor-pointer text-left flex items-center gap-3 border-b transition-all relative group ${
                          isActive
                            ? theme === 'dark'
                              ? 'bg-amber-500/20 border-amber-500/30 shadow-inner'
                              : 'bg-amber-100 border-amber-200 shadow-inner'
                            : theme === 'dark'
                            ? 'border-gray-700 hover:bg-gray-700/50 active:bg-gray-700/70'
                            : 'border-gray-200 hover:bg-gray-50 active:bg-gray-100'
                        } ${isSwitching && !isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{
                          transform: isActive ? 'scale(0.98)' : 'scale(1)',
                        }}
                      >
                        {isActive && (
                          <>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded">
                              <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                              theme === 'dark' ? 'bg-amber-400' : 'bg-amber-500'
                            }`} />
                          </>
                        )}
                        {/* Branch Image Thumbnail */}
                        <div className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border transition-all ${
                          isActive ? 'ring-2 ring-amber-400 scale-105 shadow-lg' : 'group-hover:scale-105'
                        }`}>
                          {branch.branchCoverImage ? (
                            <img
                              src={branch.branchCoverImage}
                              alt={branch.name}
                              className="w-full h-full object-cover block"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${
                              theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <Store size={18} />
                            </div>
                          )}
                        </div>
                        <div className={`flex-1 min-w-0 transition-all ${isActive ? 'translate-x-1' : ''}`}>
                          <div className={`text-sm font-semibold truncate mb-0.5 transition-colors ${
                            isActive
                              ? 'text-amber-600 dark:text-amber-400'
                              : theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                          }`}>
                            {branch.name}
                          </div>
                          <div className={`text-xs truncate ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {formatAddress(branch.location)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {/* Show More Button */}
                  {hasMore && (
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 10)}
                      className={`w-full p-3 border-none bg-transparent cursor-pointer text-center border-t transition-all ${
                        theme === 'dark'
                          ? 'text-amber-400 border-gray-700 hover:bg-gray-700/50'
                          : 'text-amber-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Show {Math.min(10, filteredBranches.length - visibleCount)} more
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}


import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../stores/authStore';
import { useBranchStore } from '../../stores/branchStore';
import { apiService } from '../../services/api';
import { BranchesHeader, BranchesList } from './branches/components';
import { BranchTransitionOverlay } from '../../components/shared/BranchTransitionOverlay';
import type { Branch } from '../../types';

export default function BranchesPage() {
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const { selectBranch, setLoading, setError } = useBranchStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [transitionBranch, setTransitionBranch] = useState<Branch | null>(null);
  const [showTransition, setShowTransition] = useState(false);

  // Check if user is manager
  if (user?.role !== 'manager' || !user?.id) {
    return (
      <div className={`p-6 rounded-lg ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Access denied. Manager role required.
        </p>
      </div>
    );
  }

  // Fetch branches using React Query
  const {
    data: branches = [],
    isLoading: isLoadingBranches,
    error: branchesError,
  } = useQuery({
    queryKey: ['branches', user.id],
    queryFn: () => apiService.getAllBranches(user.id),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const handleBranchClick = async (branch: Branch) => {
    try {
      setTransitionBranch(branch);
      setShowTransition(true);
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 300));

      const branchDetails = await apiService.getBranchById(branch.id);
      selectBranch(branchDetails);

      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate('/clerk/dashboard');

      setTimeout(() => {
        setShowTransition(false);
        setTransitionBranch(null);
        setLoading(false);
      }, 600);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load branch details';
      setError(errorMessage);
      setShowTransition(false);
      setTransitionBranch(null);
      setLoading(false);
    }
  };

  const handleCreateBranch = () => {
    navigate('/clerk/branches/create');
  };

  const handleEditBranch = (branch: Branch) => {
    navigate(`/clerk/branches/edit/${branch.id}`);
  };

  const handleDeleteBranch = async (branch: Branch) => {
    if (!window.confirm(`Are you sure you want to delete "${branch.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await apiService.deleteBranch(branch.id);
      queryClient.invalidateQueries({ queryKey: ['branches', user.id] });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete branch';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingBranches && branches.length === 0) {
    return (
      <div className={`p-3 h-full overflow-auto`}>
        <div className={`p-6 rounded-md border text-center ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Loading branches...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BranchTransitionOverlay
        branch={transitionBranch}
        isVisible={showTransition}
      />
      <div className="p-3 h-full overflow-auto">
        <BranchesHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onCreateBranch={handleCreateBranch}
        />
        {branchesError && (
          <div className={`p-3 rounded-md border mb-3 ${
            theme === 'dark'
              ? 'bg-red-900/20 border-red-500 text-red-400'
              : 'bg-red-50 border-red-500 text-red-600'
          }`}>
            Error loading branches: {branchesError instanceof Error ? branchesError.message : 'Unknown error'}
          </div>
        )}
        <BranchesList
          branches={branches}
          viewMode={viewMode}
          onBranchClick={handleBranchClick}
          onEditBranch={handleEditBranch}
          onDeleteBranch={handleDeleteBranch}
        />
      </div>
    </>
  );
}

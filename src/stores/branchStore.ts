import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Branch } from '../types';

interface BranchState {
  selectedBranch: Branch | null;
  isLoading: boolean;
  error: string | null;
}

interface BranchActions {
  selectBranch: (branch: Branch) => void;
  clearBranch: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBranchStore = create<BranchState & BranchActions>()(
  persist(
    (set) => ({
      selectedBranch: null,
      isLoading: false,
      error: null,

      selectBranch: (branch: Branch) => {
        set({ selectedBranch: branch, error: null });
      },

      clearBranch: () => {
        set({ selectedBranch: null, error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'branch-storage',
      partialize: (state) => ({
        selectedBranch: state.selectedBranch,
      }),
    }
  )
);


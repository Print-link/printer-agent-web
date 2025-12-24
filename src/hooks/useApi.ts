import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { PrintJob, PrinterAgent, PrinterLog, AnalyticsData, User } from '../types';

// Query Keys
export const queryKeys = {
  jobs: ['jobs'] as const,
  job: (id: string) => ['jobs', id] as const,
  agents: ['agents'] as const,
  agent: (id: string) => ['agents', id] as const,
  logs: ['logs'] as const,
  logsByAgent: (agentId: string) => ['logs', 'agent', agentId] as const,
  analytics: ['analytics'] as const,
  comparison: ['analytics', 'comparison'] as const,
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  userStats: ['users', 'stats'] as const,
  usersByRole: (role: string) => ['users', 'role', role] as const,
  profile: ['profile'] as const,
};

// Authentication Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiService.login(email, password),
    onSuccess: (data) => {
      localStorage.setItem('auth-token', data.token);
      queryClient.setQueryData(queryKeys.profile, data.user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: { email: string; password: string; name: string; role?: string }) =>
      apiService.register(userData),
    onSuccess: (data) => {
      localStorage.setItem('auth-token', data.token);
      queryClient.setQueryData(queryKeys.profile, data.user);
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: apiService.getProfile,
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: { name?: string; email?: string }) =>
      apiService.updateProfile(updates),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile, data);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      apiService.changePassword(currentPassword, newPassword),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.logout,
    onSuccess: () => {
      localStorage.removeItem('auth-token');
      queryClient.clear();
    },
  });
};

// Print Jobs Hooks
export const useJobs = () => {
  return useQuery({
    queryKey: queryKeys.jobs,
    queryFn: apiService.getJobs,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: queryKeys.job(id),
    queryFn: () => apiService.getJob(id),
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<PrintJob> }) =>
      apiService.updateJob(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
      queryClient.invalidateQueries({ queryKey: queryKeys.job(variables.id) });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
    },
  });
};

export const useSubmitJobToPrinter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ jobId, agentId }: { jobId: string; agentId: string }) =>
      apiService.submitJobToPrinter(jobId, agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
      queryClient.invalidateQueries({ queryKey: queryKeys.agents });
    },
  });
};

// Printer Agents Hooks
export const useAgents = () => {
  return useQuery({
    queryKey: queryKeys.agents,
    queryFn: apiService.getAgents,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};

export const useAgent = (id: string) => {
  return useQuery({
    queryKey: queryKeys.agent(id),
    queryFn: () => apiService.getAgent(id),
    enabled: !!id,
  });
};

export const useUpdateAgentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PrinterAgent['status'] }) =>
      apiService.updateAgentStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents });
      queryClient.invalidateQueries({ queryKey: queryKeys.agent(variables.id) });
    },
  });
};

// Printer Logs Hooks
export const useLogs = (agentId?: string) => {
  return useQuery({
    queryKey: agentId ? queryKeys.logsByAgent(agentId) : queryKeys.logs,
    queryFn: () => apiService.getLogs(agentId),
    refetchInterval: 15000, // Refetch every 15 seconds
  });
};

export const useLogsByDateRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['logs', 'dateRange', startDate, endDate],
    queryFn: () => apiService.getLogsByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

// Analytics Hooks
export const useAnalytics = (dateRange?: { start: string; end: string }) => {
  return useQuery({
    queryKey: [...queryKeys.analytics, dateRange],
    queryFn: () => apiService.getAnalytics(dateRange),
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useComparisonData = () => {
  return useQuery({
    queryKey: queryKeys.comparison,
    queryFn: apiService.getComparisonData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// User Management Hooks
export const useAllUsers = (params?: {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.users, params],
    queryFn: () => apiService.getAllUsers(params),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => apiService.getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.userStats });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) =>
      apiService.updateUser(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.userStats });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.userStats });
    },
  });
};

export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
      apiService.resetUserPassword(id, newPassword),
  });
};

export const useUsersByRole = (role: string) => {
  return useQuery({
    queryKey: queryKeys.usersByRole(role),
    queryFn: () => apiService.getUsersByRole(role),
    enabled: !!role,
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: queryKeys.userStats,
    queryFn: apiService.getUserStats,
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useBulkUpdateUserRoles = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userIds, role }: { userIds: string[]; role: string }) =>
      apiService.bulkUpdateUserRoles(userIds, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.userStats });
    },
  });
};

// File Upload Hook
export const useFileUpload = () => {
  return useMutation({
    mutationFn: apiService.uploadFile,
  });
};

// Health Check Hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: apiService.healthCheck,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

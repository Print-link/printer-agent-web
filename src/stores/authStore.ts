import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, AuthResponse } from '../types';
import { apiService } from '../services/api';
import { queryClient } from '../lib/queryClient';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
	login: (credentials: LoginCredentials) => Promise<void>;
	logout: () => void;
	refreshToken: () => Promise<void>;
	clearError: () => void;
	updateUserLocation: (location: {
		latitude: number;
		longitude: number;
		address: string;
	}) => Promise<void>;
	updateUserProfile: (updates: {
		businessName?: string;
		businessPhone?: string;
		websiteUrl?: string;
		firstName?: string;
		lastName?: string;
		name?: string;
		email?: string;
		phoneNumber?: string;
		avatar?: string;
	}) => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,

			login: async (credentials) => {
				set({ isLoading: true, error: null });
				try {
					const response: AuthResponse & {
						requiresLocation?: boolean;
						requiresPasswordSetup?: boolean;
					} = await apiService.login(
						credentials.email,
						credentials.password,
						credentials.role
					);

					// Check if password setup is required (for clerks with temporary password)
					if (response.user?.isTemporaryPassword === true) {
						// Clerk has temporary password - store user data temporarily but DON'T authenticate
						set({
							user: response.user,
							token: response.token,
							isAuthenticated: false, // Not authenticated yet - password setup required
							isLoading: false,
						});
						// Don't throw error - navigation will happen in LoginPage
						return;
					}

					// User is authenticated (no location/business setup required)
					set({
						user: response.user,
						token: response.token,
						isAuthenticated: true,
						isLoading: false,
					});
				} catch (error: unknown) {
					const errorMessage =
						error instanceof Error
							? error.message
							: (error as { response?: { data?: { message?: string } } })
									?.response?.data?.message || "Login failed";
					set({
						error: errorMessage,
						isLoading: false,
					});
					throw error;
				}
			},

			logout: async () => {
				const { token } = get();
				if (token) {
					try {
						await apiService.logout();
					} catch {
						// Silent error handling
					}
				}

				// Clear React Query cache
				try {
					queryClient.clear();
				} catch {
					// Silent error handling
				}

				// Set state to null first (this will trigger Zustand to persist null values)
				set({
					user: null,
					token: null,
					isAuthenticated: false,
					error: null,
				});

				// Clear ALL localStorage data after state update
				// This ensures we remove auth-storage, appSettings, theme, auth-token, and any other stored data
				try {
					if (typeof window !== "undefined" && window.localStorage) {
						window.localStorage.clear();
					}
				} catch (error) {
					console.error("Error clearing localStorage:", error);
				}
			},

			refreshToken: async () => {
				const { token } = get();
				if (!token) return;

				try {
					const newTokenResponse = await apiService.refreshToken();
					set({ token: newTokenResponse.token });
				} catch {
					// Token refresh failed, logout
					get().logout();
				}
			},

			clearError: () => set({ error: null }),

			updateUserLocation: async (location: {
				latitude: number;
				longitude: number;
				address: string;
			}) => {
				const { user } = get();
				if (!user) throw new Error("User not found");

				const updatedUser = await apiService.updateLocation(user.id, location);
				set({ user: updatedUser as User });
			},

			updateUserProfile: async (updates) => {
				try {
					const { user } = get();
					if (!user) throw new Error("User not found");

					// Users only have basic profile fields: firstName, lastName, name, email, phoneNumber, avatar
					const updatePayload: {
						firstName?: string;
						lastName?: string;
						name?: string;
						email?: string;
						phoneNumber?: string;
						avatar?: string;
					} = {};

					if (updates.firstName !== undefined)
						updatePayload.firstName = updates.firstName;
					if (updates.lastName !== undefined)
						updatePayload.lastName = updates.lastName;
					if (updates.name !== undefined) updatePayload.name = updates.name;
					if (updates.email !== undefined) updatePayload.email = updates.email;
					if (updates.phoneNumber !== undefined)
						updatePayload.phoneNumber = updates.phoneNumber;
					if (updates.avatar !== undefined)
						updatePayload.avatar = updates.avatar;

					// Update user profile via API using /auth/profile endpoint
					// The API service will handle transformation to unified User format
					const updatedUser = await apiService.updateProfile(updatePayload);

					// Update local user state and authenticate
					set({
						user: updatedUser,
						isAuthenticated: true,
					});
				} catch (error: unknown) {
					const errorMessage =
						error instanceof Error
							? error.message
							: (error as { response?: { data?: { message?: string } } })
									?.response?.data?.message || "Failed to update profile";
					set({ error: errorMessage });
					throw error;
				}
			},
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({
				token: state.token,
				user: state.user,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
);

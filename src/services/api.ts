import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type {
	User,
	AuthResponse,
	ClerkOrdersResponse,
	ClerkOrdersFilters,
	ClerkOrderDetail,
	ClerkDashboardStats,
	ClerkCategoryAnalytics,
	ClerkWeeklyActivity,
	ManagerOverviewStats,
	ManagerBranchStats,
	CategoryAnalytics,
	WeeklyActivityItem,
	Branch,
	BranchCategoryBreakdown,
	PrintJob,
	PrinterAgent,
	AnalyticsData,
	PrinterLog,
	ClerkOrder,
	OrderStatus,
	Category,
	CategoryType,
	RegularFormatProperties,
	ServiceCategory,
	ServiceSubCategory,
	ServiceTemplate,
	AgentService,
	CreateAgentServiceData,
	UpdateAgentServiceData,
	PricingConfig,
} from "../types";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ||
	"https://paper-link-backend-production.up.railway.app/api"; /*|| 'https://paper-link-backend-production.up.railway.app/api'*/

class ApiService {
	private axiosInstance: AxiosInstance;

	constructor() {
		this.axiosInstance = axios.create({
			baseURL: API_BASE_URL,
			timeout: 30000,
			headers: {
				"Content-Type": "application/json",
			},
		});

		// Request interceptor to add auth token
		this.axiosInstance.interceptors.request.use(
			(config) => {
				const token = localStorage.getItem("auth-token");
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		// Response interceptor for error handling
		this.axiosInstance.interceptors.response.use(
			(response: AxiosResponse) => {
				return response;
			},
			(error) => {
				if (error.response?.status === 401) {
					localStorage.removeItem("auth-token");
					window.location.href = "/login";
				}
				return Promise.reject(error);
			}
		);
	}

	// Authentication
	async forgotPassword(
		email: string
	): Promise<{ success: boolean; message: string }> {
		const response = await this.axiosInstance.post("/auth/forgot-password", {
			email,
		});
		if (!response.data.success) {
			throw new Error(response.data.message || "Failed to send reset email");
		}
		return response.data;
	}

	async resetPassword(
		token: string,
		newPassword: string
	): Promise<{ success: boolean; message: string }> {
		const response = await this.axiosInstance.post("/auth/reset-password", {
			token,
			newPassword,
		});
		if (!response.data.success) {
			throw new Error(response.data.message || "Failed to reset password");
		}
		return response.data;
	}

	async login(
		email: string,
		password: string,
		role?: "manager" | "clerk"
	): Promise<AuthResponse> {
		// Route to correct endpoint based on role
		const endpoint = role === "clerk" ? "/auth/login/clerk" : "/auth/login";
		const response = await this.axiosInstance.post(endpoint, {
			email,
			password,
		});

		if (!response.data.success) {
			throw new Error(response.data.message || "Login failed");
		}

		// Backend returns different structures for manager vs clerk
		// Manager: { success: true, data: { manager: {...}, token } }
		// Clerk: { success: true, data: { clerk: {...}, token } }
		const data = response.data.data;
		const userData = data.manager || data.clerk;
		const token = data.token;

		// Transform to unified User format
		const user: User = {
			id: userData.id,
			firstName: userData.firstName,
			lastName: userData.lastName,
			name:
				`${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
				userData.email, // For backward compatibility
			email: userData.email,
			phoneNumber: userData.phoneNumber || undefined,
			avatar: userData.avatar || undefined,
			branch_id: userData.branch_id || undefined, // Only for clerks
			role: userData.role || role || "manager",
			permissions: [],
			// Note: business fields, location, and workingHours belong to branches, not users
			isActive: userData.isActive !== undefined ? userData.isActive : true,
			isTemporaryPassword: userData.isTemporaryPassword || false,
			createdAt: userData.createdAt
				? typeof userData.createdAt === "string"
					? new Date(userData.createdAt).getTime()
					: userData.createdAt
				: Date.now(),
			updatedAt: userData.updatedAt
				? typeof userData.updatedAt === "string"
					? new Date(userData.updatedAt).getTime()
					: userData.updatedAt
				: Date.now(),
		};

		// Store token in localStorage
		if (token) {
			localStorage.setItem("auth-token", token);
		}

		return {
			user,
			token,
			requiresPasswordSetup: user.isTemporaryPassword === true,
		};
	}

	async getProfile(): Promise<User> {
		const response = await this.axiosInstance.get("/auth/profile");

		// Backend returns different structures based on role
		// Manager: { success: true, data: { ...manager fields } }
		// Clerk: { success: true, data: { ...clerk fields } }
		const userData = response.data.data || response.data;

		// Transform to unified User format
		const user: User = {
			id: userData.id,
			firstName: userData.firstName,
			lastName: userData.lastName,
			name:
				`${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
				userData.email,
			email: userData.email,
			phoneNumber: userData.phoneNumber || undefined,
			avatar: userData.avatar || undefined,
			branch_id: userData.branch_id || undefined,
			role: userData.role || "manager",
			permissions: [],
			// Note: business fields, location, and workingHours belong to branches, not users
			isActive: userData.isActive !== undefined ? userData.isActive : true,
			isTemporaryPassword: userData.isTemporaryPassword || false,
			createdAt: userData.createdAt
				? typeof userData.createdAt === "string"
					? new Date(userData.createdAt).getTime()
					: userData.createdAt
				: Date.now(),
			updatedAt: userData.updatedAt
				? typeof userData.updatedAt === "string"
					? new Date(userData.updatedAt).getTime()
					: userData.updatedAt
				: Date.now(),
		};

		return user;
	}

	async updateProfile(updates: {
		firstName?: string;
		lastName?: string;
		name?: string;
		email?: string;
		phoneNumber?: string;
		avatar?: string;
	}): Promise<User> {
		// Regular JSON update - users only have basic profile fields
		const response = await this.axiosInstance.put("/auth/profile", updates);
		const userData = response.data.data || response.data;
		return this.transformToUser(userData);
	}

	// Helper method to transform backend response to unified User format
	private transformToUser(userData: {
		id: string;
		firstName?: string;
		lastName?: string;
		email: string;
		phoneNumber?: string | null;
		avatar?: string | null;
		branch_id?: string | null;
		role?: "manager" | "clerk";
		businessName?: string | null;
		businessPhone?: string | null;
		businessCoverImage?: string | null;
		websiteUrl?: string | null;
		workingHours?: Array<{
			day: string;
			isOpen: boolean;
			openTime?: string;
			closeTime?: string;
		}> | null;
		location?: {
			latitude: number;
			longitude: number;
			address: string;
		} | null;
		isActive?: boolean;
		isTemporaryPassword?: boolean;
		createdAt?: string | number | Date;
		updatedAt?: string | number | Date;
	}): User {
		return {
			id: userData.id,
			firstName: userData.firstName,
			lastName: userData.lastName,
			name:
				`${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
				userData.email,
			email: userData.email,
			phoneNumber: userData.phoneNumber || undefined,
			avatar: userData.avatar || undefined,
			branch_id: userData.branch_id || undefined,
			role: userData.role || "manager",
			permissions: [],
			// Note: business fields, location, and workingHours belong to branches, not users
			isActive: userData.isActive !== undefined ? userData.isActive : true,
			isTemporaryPassword: userData.isTemporaryPassword || false,
			createdAt: userData.createdAt
				? typeof userData.createdAt === "string"
					? new Date(userData.createdAt).getTime()
					: userData.createdAt
				: Date.now(),
			updatedAt: userData.updatedAt
				? typeof userData.updatedAt === "string"
					? new Date(userData.updatedAt).getTime()
					: userData.updatedAt
				: Date.now(),
		};
	}

	async changePassword(
		currentPassword: string,
		newPassword: string
	): Promise<void> {
		await this.axiosInstance.put("/auth/change-password", {
			currentPassword,
			newPassword,
		});
	}

	async logout(): Promise<void> {
		await this.axiosInstance.post("/auth/logout");
	}

	async refreshToken(): Promise<{ token: string }> {
		const response = await this.axiosInstance.post("/auth/refresh");
		return response.data.data;
	}

	// Print Jobs
	async getJobs(): Promise<PrintJob[]> {
		const response = await this.axiosInstance.get("/print/jobs");
		return response.data.data;
	}

	async getJob(id: string): Promise<PrintJob> {
		const response = await this.axiosInstance.get(`/print/jobs/${id}`);
		return response.data.data;
	}

	async createJob(
		job: Omit<PrintJob, "id" | "submittedAt">
	): Promise<PrintJob> {
		const response = await this.axiosInstance.post("/print/jobs", job);
		return response.data.data;
	}

	async updateJob(id: string, updates: Partial<PrintJob>): Promise<PrintJob> {
		const response = await this.axiosInstance.patch(
			`/print/jobs/${id}`,
			updates
		);
		return response.data.data;
	}

	async deleteJob(id: string): Promise<void> {
		await this.axiosInstance.delete(`/print/jobs/${id}`);
	}

	async submitJobToPrinter(jobId: string, agentId: string): Promise<void> {
		await this.axiosInstance.post(`/print/jobs/${jobId}/submit`, { agentId });
	}

	// Printer Agents
	async getAgents(): Promise<PrinterAgent[]> {
		try {
			const response = await this.axiosInstance.get("/print/agents");
			return response.data.data || [];
		} catch (error) {
			// Handle 404 or other errors gracefully - return empty array if endpoint doesn't exist
			if (error && typeof error === "object" && "response" in error) {
				const axiosError = error as { response?: { status?: number } };
				if (axiosError.response?.status === 404) {
					console.warn("Print agents endpoint not available (404)");
					return [];
				}
			}
			throw error;
		}
	}

	async getAgent(id: string): Promise<PrinterAgent> {
		try {
			const response = await this.axiosInstance.get(`/print/agents/${id}`);
			return response.data.data;
		} catch (error) {
			// Handle 404 gracefully
			if (error && typeof error === "object" && "response" in error) {
				const axiosError = error as { response?: { status?: number } };
				if (axiosError.response?.status === 404) {
					throw new Error("Agent not found");
				}
			}
			throw error;
		}
	}

	async updateAgentStatus(
		id: string,
		status: PrinterAgent["status"]
	): Promise<PrinterAgent> {
		const response = await this.axiosInstance.patch(
			`/print/agents/${id}/status`,
			{ status }
		);
		return response.data.data;
	}

	// Printer Logs
	async getLogs(agentId?: string): Promise<PrinterLog[]> {
		const params = agentId ? { agentId } : {};
		const response = await this.axiosInstance.get("/print/logs", { params });
		return response.data.data;
	}

	async getLogsByDateRange(
		startDate: string,
		endDate: string
	): Promise<PrinterLog[]> {
		const response = await this.axiosInstance.get("/print/logs", {
			params: { startDate, endDate },
		});
		return response.data.data;
	}

	// Analytics
	async getAnalytics(dateRange?: {
		start: string;
		end: string;
	}): Promise<AnalyticsData> {
		const params = dateRange
			? { start: dateRange.start, end: dateRange.end }
			: {};
		const response = await this.axiosInstance.get("/print/analytics", {
			params,
		});
		return response.data.data;
	}

	async getComparisonData(): Promise<{
		requestedJobs: PrintJob[];
		actualPrints: PrinterLog[];
		discrepancies: Array<{
			jobId: string;
			requestedPages: number;
			actualPages: number;
			difference: number;
		}>;
	}> {
		const response = await this.axiosInstance.get(
			"/print/analytics/comparison"
		);
		return response.data.data;
	}

	// User Management (Admin only)
	async getAllUsers(params?: {
		page?: number;
		limit?: number;
		role?: string;
		isActive?: boolean;
		search?: string;
	}): Promise<{
		users: User[];
		pagination: {
			current: number;
			pages: number;
			total: number;
			limit: number;
		};
	}> {
		const response = await this.axiosInstance.get("/users", { params });
		return response.data.data;
	}

	async getUserById(id: string): Promise<User> {
		const response = await this.axiosInstance.get(`/users/${id}`);
		return response.data.data.user;
	}

	async createUser(userData: {
		email: string;
		password: string;
		name: string;
		role: string;
		permissions?: string[];
	}): Promise<User> {
		const response = await this.axiosInstance.post("/users", userData);
		return response.data.data.user;
	}

	async updateUser(id: string, updates: Partial<User>): Promise<User> {
		const response = await this.axiosInstance.put(`/users/${id}`, updates);
		return response.data.data.user;
	}

	async deleteUser(id: string): Promise<void> {
		await this.axiosInstance.delete(`/users/${id}`);
	}

	async resetUserPassword(id: string, newPassword: string): Promise<void> {
		await this.axiosInstance.put(`/users/${id}/reset-password`, {
			newPassword,
		});
	}

	async getUsersByRole(role: string): Promise<User[]> {
		const response = await this.axiosInstance.get(`/users/role/${role}`);
		return response.data.data.users;
	}

	async getUserStats(): Promise<{
		totalUsers: number;
		usersByRole: Array<{ _id: string; count: number }>;
		recentUsers: User[];
	}> {
		const response = await this.axiosInstance.get("/users/stats");
		return response.data.data;
	}

	async bulkUpdateUserRoles(
		userIds: string[],
		role: string
	): Promise<{
		modifiedCount: number;
	}> {
		const response = await this.axiosInstance.put("/users/bulk-update-roles", {
			userIds,
			role,
		});
		return response.data.data;
	}

	// File Upload
	async uploadFile(
		file: File
	): Promise<{ fileId: string; fileName: string; fileSize: number }> {
		const formData = new FormData();
		formData.append("file", file);

		const response = await this.axiosInstance.post("/print/upload", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data.data;
	}

	// Health check
	async healthCheck(): Promise<{
		success: boolean;
		message: string;
		timestamp: string;
		version: string;
	}> {
		const response = await this.axiosInstance.get("/health");
		return response.data;
	}

	// Clerk Dashboard APIs
	async getClerkOrders(
		filters?: ClerkOrdersFilters
	): Promise<ClerkOrdersResponse> {
		const response = await this.axiosInstance.get("/clerk/orders", {
			params: filters,
		});
		return response.data.data;
	}

	async getClerkOrderDetail(orderId: string): Promise<ClerkOrderDetail> {
		const response = await this.axiosInstance.get(`/clerk/orders/${orderId}`);
		return response.data.data;
	}

	async getClerkOrdersByDate(
		date: string,
		branchId?: string
	): Promise<ClerkOrderDetail[]> {
		const params = branchId ? { date, branchId } : { date };
		const response = await this.axiosInstance.get("/clerk/orders/by-date", {
			params,
		});
		return response.data.data;
	}

	async getClerkDashboardStats(
		branchId?: string
	): Promise<ClerkDashboardStats> {
		const params = branchId ? { branchId } : {};
		const response = await this.axiosInstance.get("/clerk/dashboard/stats", {
			params,
		});
		return response.data.data;
	}

	async getClerkCategoryAnalytics(
		days?: number,
		branchId?: string
	): Promise<ClerkCategoryAnalytics[]> {
		const params: Record<string, string | number> = {};
		if (days) params.days = days;
		if (branchId) params.branchId = branchId;
		const response = await this.axiosInstance.get(
			"/clerk/dashboard/category-analytics",
			{ params }
		);
		return response.data.data;
	}

	async getClerkWeeklyActivity(
		month?: string,
		year?: string,
		branchId?: string
	): Promise<ClerkWeeklyActivity[]> {
		const params: Record<string, string> = {};
		if (month) params.month = month;
		if (year) params.year = year;
		if (branchId) params.branchId = branchId;
		const response = await this.axiosInstance.get(
			"/clerk/dashboard/weekly-activity",
			{ params }
		);
		return response.data.data;
	}

	// Manager Dashboard APIs
	async getManagerOverviewStats(filters?: {
		startDate?: string;
		endDate?: string;
		month?: string;
		year?: string;
	}): Promise<ManagerOverviewStats> {
		const response = await this.axiosInstance.get(
			"/manager/dashboard/overview/stats",
			{ params: filters }
		);
		return response.data.data;
	}

	async getManagerOverviewBranches(filters?: {
		startDate?: string;
		endDate?: string;
		month?: string;
		year?: string;
	}): Promise<BranchCategoryBreakdown[]> {
		const response = await this.axiosInstance.get(
			"/manager/dashboard/overview/branches",
			{ params: filters }
		);
		return response.data.data;
	}

	async getManagerOverviewCategoryAnalytics(
		days?: number
	): Promise<CategoryAnalytics[]> {
		const params = days ? { days } : {};
		const response = await this.axiosInstance.get(
			"/manager/dashboard/overview/category-analytics",
			{ params }
		);
		return response.data.data;
	}

	async getManagerOverviewWeeklyActivity(
		month?: string,
		year?: string
	): Promise<WeeklyActivityItem[]> {
		const params: Record<string, string> = {};
		if (month) params.month = month;
		if (year) params.year = year;
		const response = await this.axiosInstance.get(
			"/manager/dashboard/overview/weekly-activity",
			{ params }
		);
		return response.data.data;
	}

	async getManagerBranchStats(
		branchId: string,
		filters?: {
			startDate?: string;
			endDate?: string;
			month?: string;
			year?: string;
		}
	): Promise<ManagerBranchStats> {
		const response = await this.axiosInstance.get(
			`/manager/dashboard/branch/${branchId}/stats`,
			{ params: filters }
		);
		return response.data.data;
	}

	async getManagerBranchCategoryAnalytics(
		branchId: string,
		days?: number
	): Promise<CategoryAnalytics[]> {
		const params = days ? { days } : {};
		const response = await this.axiosInstance.get(
			`/manager/dashboard/branch/${branchId}/category-analytics`,
			{ params }
		);
		return response.data.data;
	}

	async getManagerBranchWeeklyActivity(
		branchId: string,
		month?: string,
		year?: string
	): Promise<WeeklyActivityItem[]> {
		const params: Record<string, string> = {};
		if (month) params.month = month;
		if (year) params.year = year;
		const response = await this.axiosInstance.get(
			`/manager/dashboard/branch/${branchId}/weekly-activity`,
			{ params }
		);
		return response.data.data;
	}

	// Branch APIs
	async getAllBranches(managerId: string): Promise<Branch[]> {
		const response = await this.axiosInstance.get(
			`/branches/manager/${managerId}`
		);
		return response.data.data;
	}

	async getBranchById(branchId: string): Promise<Branch> {
		const response = await this.axiosInstance.get(`/branches/${branchId}`);
		return response.data.data;
	}

	async createBranch(
		branchData: Omit<Branch, "id" | "createdAt" | "updatedAt">,
		coverImageFile?: File
	): Promise<Branch> {
		// If we have a file, send as FormData (required by backend multer middleware)
		if (coverImageFile) {
			const formData = new FormData();

			// Add file
			formData.append("branchCoverImage", coverImageFile);

			// Add branch data fields
			formData.append("name", branchData.name);
			formData.append("manager_id", branchData.manager_id);
			formData.append("status", branchData.status);
			formData.append("isMainBranch", String(branchData.isMainBranch));

			if (branchData.phoneNumber) {
				formData.append("phoneNumber", branchData.phoneNumber);
			}
			if (branchData.branchEmailAddress) {
				formData.append("branchEmailAddress", branchData.branchEmailAddress);
			}

			// Stringify operatingHours (backend expects string or object)
			formData.append(
				"operatingHours",
				JSON.stringify(branchData.operatingHours)
			);

			// Add location_id if provided (location will be created separately)
			if (branchData.location_id) {
				formData.append("location_id", branchData.location_id);
			}

			const response = await this.axiosInstance.post("/branches", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data.data;
		}

		// Fallback to JSON if no file (though backend requires file)
		const response = await this.axiosInstance.post("/branches", branchData);
		return response.data.data;
	}

	async updateBranch(
		branchId: string,
		branchData: Partial<Omit<Branch, "id" | "createdAt" | "updatedAt">>
	): Promise<Branch> {
		const response = await this.axiosInstance.put(
			`/branches/${branchId}`,
			branchData
		);
		return response.data.data;
	}

	async deleteBranch(branchId: string): Promise<void> {
		await this.axiosInstance.delete(`/branches/${branchId}`);
	}

	// Location APIs
	async createLocation(locationData: {
		branch_id: string;
		address: string;
		latitude: number;
		longitude: number;
		city?: string;
		state?: string;
		country?: string;
		postalCode?: string;
	}): Promise<{ id: string }> {
		const response = await this.axiosInstance.post("/locations", locationData);
		return response.data.data;
	}

	async updateLocation(
		locationId: string,
		locationData: {
			branch_id?: string;
			address?: string;
			latitude?: number;
			longitude?: number;
			city?: string;
			state?: string;
			country?: string;
			postalCode?: string;
		}
	): Promise<{ id: string }> {
		const response = await this.axiosInstance.put(
			`/locations/${locationId}`,
			locationData
		);
		return response.data.data;
	}

	// Branch Orders APIs
	async getBranchOrders(branchId: string): Promise<ClerkOrder[]> {
		// Backend route: GET /orders/branch/:branchId
		// Returns orders with client info but without orderNumber or itemCount
		const response = await this.axiosInstance.get(`/orders/branch/${branchId}`);

		if (!response.data.status && !response.data.success) {
			throw new Error(response.data.message || "Failed to get branch orders");
		}

		const orders = response.data.data || [];

		// Transform backend response to match ClerkOrder type
		// Backend returns: { id, clientId, branchId, status, totalPrice, createdAt, updatedAt, client: {...} }
		// We need: { id, orderNumber, status, totalPrice, client: {...}, itemCount, createdAt, updatedAt }
		return orders.map(
			(order: {
				id: string;
				clientId: string;
				branchId: string;
				status: string;
				totalPrice: number;
				createdAt: Date | string;
				updatedAt: Date | string;
				client: {
					id: string;
					firstName: string;
					lastName: string;
					fullName: string;
					email: string;
					phoneNumber: string;
					avatar?: string;
				};
			}) => ({
				id: order.id,
				orderNumber: `ORD-${order.id.substring(0, 8).toUpperCase()}`, // Generate orderNumber
				status: order.status as OrderStatus,
				totalPrice: order.totalPrice,
				client: order.client,
				itemCount: 0, // Will be populated when order detail is fetched
				createdAt: order.createdAt,
				updatedAt: order.updatedAt,
			})
		);
	}

	async getBranchOrderDetail(
		orderId: string,
		branchId?: string
	): Promise<ClerkOrderDetail> {
		// Backend route: GET /clerk/dashboard/orders/:orderId
		// This endpoint returns ClerkOrderDetail with items array
		// For managers, we need to pass branchId as query param
		const params = branchId ? { branchId } : {};
		const response = await this.axiosInstance.get(
			`/clerk/dashboard/orders/${orderId}`,
			{ params }
		);
		if (!response.data.success) {
			throw new Error(response.data.message || "Failed to get order detail");
		}
		// Backend returns ClerkOrderDetail which extends ClerkOrder with items
		return response.data.data;
	}

	async updateBranchOrder(
		orderId: string,
		order: Partial<ClerkOrder> & { estimatedCompletionTime?: string }
	): Promise<ClerkOrderDetail> {
		// Backend route: PUT /orders/:id
		const response = await this.axiosInstance.put(`/orders/${orderId}`, order);
		if (!response.data.success) {
			throw new Error(response.data.message || "Failed to update order");
		}
		return response.data.data;
	}

	async updateClerkOrder(
		orderId: string,
		order: Partial<ClerkOrder> & { estimatedCompletionTime?: string }
	): Promise<ClerkOrderDetail> {
		return this.updateBranchOrder(orderId, order);
	}

	// Admin Management APIs (for managers to manage clerks)
	async createClerk(data: {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
		branch_id: string;
		phoneNumber?: string;
		avatar?: string;
	}): Promise<User> {
		// Backend route: POST /auth/register/clerk (from authController.registerClerk)
		const response = await this.axiosInstance.post(
			"/auth/register/clerk",
			data
		);

		if (!response.data.success) {
			throw new Error(response.data.message || "Failed to create clerk");
		}

		const clerkData = response.data.data.clerk;
		return this.transformToUser(clerkData);
	}

	async getClerksByBranchId(branchId: string): Promise<User[]> {
		// Backend route: GET /clerks/branch/:branchId
		const response = await this.axiosInstance.get(`/clerks/branch/${branchId}`);

		if (!response.data.success) {
			throw new Error(response.data.message || "Failed to get clerks");
		}

		const clerks = response.data.data || [];
		return clerks.map(
			(clerk: {
				id: string;
				firstName: string;
				lastName: string;
				email: string;
				phoneNumber?: string | null;
				avatar?: string | null;
				branch_id?: string | null;
				role?: "clerk";
				createdAt?: string | Date;
				updatedAt?: string | Date;
			}) => this.transformToUser(clerk)
		);
	}

	async changeClerkPassword(
		clerkId: string,
		newPassword: string
	): Promise<User> {
		// Backend route: PUT /clerks/:id (update with password field)
		const response = await this.axiosInstance.put(`/clerks/${clerkId}`, {
			password: newPassword,
		});

		if (!response.data.success) {
			throw new Error(
				response.data.message || "Failed to change clerk password"
			);
		}

		const clerkData = response.data.data;
		return this.transformToUser(clerkData);
	}

	// Setup Password API
	async setupPassword(password: string): Promise<User> {
		const response = await this.axiosInstance.post("/auth/setup-password", {
			password,
		});
		return response.data.data.user;
	}

	// Category APIs
	async getAllCategories(adminId: string): Promise<Category[]> {
		const response = await this.axiosInstance.get("/categories", {
			params: { adminId },
		});
		return response.data.data;
	}

	async createCategory(data: {
		name: string;
		unitPrice: number;
		description?: string;
		adminId: string;
		categoryType?: CategoryType;
		regularFormatProperties?: RegularFormatProperties;
	}): Promise<Category> {
		const response = await this.axiosInstance.post("/categories", data);
		return response.data.data;
	}

	async updateCategory(
		id: string,
		data: {
			name?: string;
			unitPrice?: number;
			description?: string;
			categoryType?: CategoryType;
			regularFormatProperties?: RegularFormatProperties;
		}
	): Promise<Category> {
		const response = await this.axiosInstance.put(`/categories/${id}`, data);
		return response.data.data;
	}

	async deleteCategory(id: string): Promise<void> {
		await this.axiosInstance.delete(`/categories/${id}`);
	}

	// Service APIs (Platform-owned services)
	async getServiceCategories(): Promise<ServiceCategory[]> {
		const response = await this.axiosInstance.get("/categories");
		return response.data.data || response.data;
	}

	async getServiceSubCategories(
		categoryId: string
	): Promise<ServiceSubCategory[]> {
		const response = await this.axiosInstance.get("/sub-categories", {
			params: { categoryId },
		});
		return response.data.data || response.data;
	}

	async getServiceTemplates(subCategoryId: string): Promise<ServiceTemplate[]> {
		const response = await this.axiosInstance.get("/service-templates", {
			params: { subCategoryId },
		});
		return response.data.data || response.data;
	}

	async getAgentServices(
		branchId: string,
		isActive?: boolean
	): Promise<AgentService[]> {
		const params: Record<string, string | boolean> = { branchId };
		if (isActive !== undefined) {
			params.isActive = isActive;
		}
		const response = await this.axiosInstance.get("/agent-services", {
			params,
		});
		return response.data.data || response.data;
	}

	async getAgentServiceById(agentServiceId: string): Promise<AgentService> {
		const response = await this.axiosInstance.get(
			`/agent-services/${agentServiceId}`
		);
		return response.data.data || response.data;
	}

	async createAgentService(
		data: CreateAgentServiceData
	): Promise<AgentService> {
		// Validate required fields before sending
		if (!data.branchId || !data.branchId.trim()) {
			throw new Error("Branch ID is required");
		}
		if (!data.serviceTemplateId || !data.serviceTemplateId.trim()) {
			throw new Error("Service template ID is required");
		}

		try {
			const response = await this.axiosInstance.post("/agent-services", data);
			if (!response.data.success && response.data.message) {
				throw new Error(response.data.message);
			}
			return response.data.data || response.data;
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				const errorMessage =
					error.response?.data?.message ||
					error.message ||
					"Failed to create agent service";
				console.error("Error creating agent service:", {
					status: error.response?.status,
					message: errorMessage,
					responseData: error.response?.data,
					requestData: data,
				});
				throw new Error(errorMessage);
			}
			throw error;
		}
	}

	async updateAgentService(
		agentServiceId: string,
		data: UpdateAgentServiceData
	): Promise<AgentService> {
		const response = await this.axiosInstance.put(
			`/agent-services/${agentServiceId}`,
			data
		);
		return response.data.data || response.data;
	}

	async deleteAgentService(agentServiceId: string): Promise<void> {
		await this.axiosInstance.delete(`/agent-services/${agentServiceId}`);
	}

	async updateAgentServicePricingConfig(
		agentServiceId: string,
		pricingConfig: PricingConfig
	): Promise<AgentService> {
		const response = await this.axiosInstance.put(
			`/agent-services/${agentServiceId}/pricing-config`,
			{ pricingConfig }
		);
		return response.data.data || response.data;
	}
}

export const apiService = new ApiService();
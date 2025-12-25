import type { PrintJob, PrinterAgent, PrinterLog, AnalyticsData, User } from '../types';

// Mock data
const mockUsers: User[] = [
	{
		id: "1",
		email: "admin@example.com",
		name: "Admin User",
		role: "manager",
		createdAt: new Date("2024-01-01T00:00:00Z"),
		updatedAt: new Date("2024-01-01T00:00:00Z"),
	},
	{
		id: "2",
		email: "clerk@example.com",
		name: "Clerk User",
		role: "clerk",
		createdAt: new Date("2024-01-01T00:00:00Z"),
		updatedAt: new Date("2024-01-01T00:00:00Z"),
	},
];

const mockJobs: PrintJob[] = [
	{
		id: "1",
		customerId: "c1",
		customerName: "John Doe",
		fileName: "document1.pdf",
		fileSize: 1024000,
		fileType: "pdf",
		status: "pending",
		priority: "medium",
		submittedAt: "2024-01-15T10:30:00Z",
		pages: 5,
		cost: 2.5,
	},
	{
		id: "2",
		customerId: "c2",
		customerName: "Jane Smith",
		fileName: "presentation.pptx",
		fileSize: 2048000,
		fileType: "pptx",
		status: "processing",
		priority: "high",
		submittedAt: "2024-01-15T09:15:00Z",
		processedAt: "2024-01-15T09:20:00Z",
		pages: 20,
		cost: 10.0,
		agentId: "agent1",
		printerId: "printer1",
	},
	{
		id: "3",
		customerId: "c3",
		customerName: "Bob Johnson",
		fileName: "report.pdf",
		fileSize: 512000,
		fileType: "pdf",
		status: "completed",
		priority: "low",
		submittedAt: "2024-01-15T08:00:00Z",
		processedAt: "2024-01-15T08:05:00Z",
		completedAt: "2024-01-15T08:10:00Z",
		pages: 3,
		cost: 1.5,
		agentId: "agent2",
		printerId: "printer2",
	},
];

const mockAgents: PrinterAgent[] = [
	{
		id: "agent1",
		name: "Agent Alpha",
		computerId: "comp1",
		printerId: "printer1",
		status: "online",
		lastSeen: "2024-01-15T10:30:00Z",
		currentJob: "2",
		totalJobs: 45,
		totalPages: 1200,
	},
	{
		id: "agent2",
		name: "Agent Beta",
		computerId: "comp2",
		printerId: "printer2",
		status: "online",
		lastSeen: "2024-01-15T10:25:00Z",
		totalJobs: 38,
		totalPages: 950,
	},
	{
		id: "agent3",
		name: "Agent Gamma",
		computerId: "comp3",
		printerId: "printer3",
		status: "offline",
		lastSeen: "2024-01-15T08:30:00Z",
		totalJobs: 22,
		totalPages: 600,
	},
];

const mockLogs: PrinterLog[] = [
	{
		id: "log1",
		printerId: "printer1",
		agentId: "agent1",
		jobId: "2",
		action: "print",
		fileName: "presentation.pptx",
		pages: 20,
		timestamp: "2024-01-15T09:20:00Z",
		details: "Job completed successfully",
	},
	{
		id: "log2",
		printerId: "printer2",
		agentId: "agent2",
		jobId: "3",
		action: "print",
		fileName: "report.pdf",
		pages: 3,
		timestamp: "2024-01-15T08:10:00Z",
		details: "Job completed successfully",
	},
	{
		id: "log3",
		printerId: "printer1",
		action: "anonymous_print",
		fileName: "unknown.pdf",
		pages: 1,
		timestamp: "2024-01-15T07:45:00Z",
		details: "Anonymous print detected",
	},
];

const mockAnalytics: AnalyticsData = {
	totalJobs: 150,
	completedJobs: 142,
	failedJobs: 8,
	totalPages: 3500,
	totalRevenue: 1750.0,
	averageJobTime: 5.5,
	jobsByStatus: {
		pending: 12,
		processing: 8,
		completed: 142,
		failed: 8,
	},
	jobsByDay: [
		{ date: "2024-01-09", jobs: 15, pages: 350 },
		{ date: "2024-01-10", jobs: 18, pages: 420 },
		{ date: "2024-01-11", jobs: 22, pages: 500 },
		{ date: "2024-01-12", jobs: 20, pages: 480 },
		{ date: "2024-01-13", jobs: 16, pages: 380 },
		{ date: "2024-01-14", jobs: 19, pages: 450 },
		{ date: "2024-01-15", jobs: 12, pages: 320 },
	],
	topCustomers: [
		{ customerId: "c1", customerName: "John Doe", jobs: 25, pages: 600 },
		{ customerId: "c2", customerName: "Jane Smith", jobs: 20, pages: 500 },
		{ customerId: "c3", customerName: "Bob Johnson", jobs: 18, pages: 450 },
	],
};

class MockApiService {
	private delay(ms: number = 500) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async login(
		email: string,
		password: string
	): Promise<{ user: User; token: string }> {
		await this.delay();

		const user = mockUsers.find((u) => u.email === email);
		if (!user || (password !== "admin123" && password !== "clerk123")) {
			throw new Error("Invalid credentials");
		}

		return {
			user,
			token: "mock-jwt-token",
		};
	}

	async getJobs(): Promise<PrintJob[]> {
		await this.delay();
		return [...mockJobs];
	}

	async getJob(id: string): Promise<PrintJob> {
		await this.delay();
		const job = mockJobs.find((j) => j.id === id);
		if (!job) throw new Error("Job not found");
		return job;
	}

	async createJob(
		job: Omit<PrintJob, "id" | "submittedAt">
	): Promise<PrintJob> {
		await this.delay();
		const newJob: PrintJob = {
			...job,
			id: Date.now().toString(),
			submittedAt: new Date().toISOString(),
		};
		mockJobs.push(newJob);
		return newJob;
	}

	async updateJob(id: string, updates: Partial<PrintJob>): Promise<PrintJob> {
		await this.delay();
		const index = mockJobs.findIndex((j) => j.id === id);
		if (index === -1) throw new Error("Job not found");

		mockJobs[index] = { ...mockJobs[index], ...updates };
		return mockJobs[index];
	}

	async deleteJob(id: string): Promise<void> {
		await this.delay();
		const index = mockJobs.findIndex((j) => j.id === id);
		if (index === -1) throw new Error("Job not found");
		mockJobs.splice(index, 1);
	}

	async submitJobToPrinter(jobId: string, agentId: string): Promise<void> {
		await this.delay();
		const job = mockJobs.find((j) => j.id === jobId);
		const agent = mockAgents.find((a) => a.id === agentId);

		if (!job || !agent) throw new Error("Job or agent not found");

		job.status = "processing";
		job.agentId = agentId;
		job.processedAt = new Date().toISOString();
		agent.currentJob = jobId;
	}

	async getAgents(): Promise<PrinterAgent[]> {
		await this.delay();
		return [...mockAgents];
	}

	async getAgent(id: string): Promise<PrinterAgent> {
		await this.delay();
		const agent = mockAgents.find((a) => a.id === id);
		if (!agent) throw new Error("Agent not found");
		return agent;
	}

	async updateAgentStatus(
		id: string,
		status: PrinterAgent["status"]
	): Promise<PrinterAgent> {
		await this.delay();
		const agent = mockAgents.find((a) => a.id === id);
		if (!agent) throw new Error("Agent not found");

		agent.status = status;
		agent.lastSeen = new Date().toISOString();
		return agent;
	}

	async getLogs(agentId?: string): Promise<PrinterLog[]> {
		await this.delay();
		if (agentId) {
			return mockLogs.filter((log) => log.agentId === agentId);
		}
		return [...mockLogs];
	}

	async getLogsByDateRange(
		startDate: string,
		endDate: string
	): Promise<PrinterLog[]> {
		await this.delay();
		return mockLogs.filter((log) => {
			const logDate = new Date(log.timestamp);
			return logDate >= new Date(startDate) && logDate <= new Date(endDate);
		});
	}

	async getAnalytics(dateRange?: {
		start: string;
		end: string;
	}): Promise<AnalyticsData> {
		await this.delay();
		return mockAnalytics;
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
		await this.delay();

		const discrepancies = mockJobs
			.filter((job) => job.status === "completed" && job.pages)
			.map((job) => {
				const log = mockLogs.find((l) => l.jobId === job.id);
				const actualPages = log?.pages || 0;
				return {
					jobId: job.id,
					requestedPages: job.pages || 0,
					actualPages,
					difference: actualPages - (job.pages || 0),
				};
			});

		return {
			requestedJobs: mockJobs,
			actualPrints: mockLogs,
			discrepancies,
		};
	}

	async uploadFile(
		file: File
	): Promise<{ fileId: string; fileName: string; fileSize: number }> {
		await this.delay();
		return {
			fileId: Date.now().toString(),
			fileName: file.name,
			fileSize: file.size,
		};
	}

	// Additional methods for user management
	async getProfile(): Promise<User> {
		await this.delay();
		return mockUsers[0]; // Return admin user
	}

	async updateProfile(updates: {
		name?: string;
		email?: string;
	}): Promise<User> {
		await this.delay();
		const user = { ...mockUsers[0], ...updates };
		return user;
	}

	async changePassword(
		currentPassword: string,
		newPassword: string
	): Promise<void> {
		await this.delay();
		// Mock implementation
	}

	async logout(): Promise<void> {
		await this.delay();
		// Mock implementation
	}

	async refreshToken(): Promise<{ token: string }> {
		await this.delay();
		return { token: "mock-refreshed-token" };
	}

	// User management methods
	async getAllUsers(params?: any): Promise<{
		users: User[];
		pagination: {
			current: number;
			pages: number;
			total: number;
			limit: number;
		};
	}> {
		await this.delay();
		return {
			users: mockUsers,
			pagination: {
				current: 1,
				pages: 1,
				total: mockUsers.length,
				limit: 10,
			},
		};
	}

	async getUserById(id: string): Promise<User> {
		await this.delay();
		const user = mockUsers.find((u) => u.id === id);
		if (!user) throw new Error("User not found");
		return user;
	}

	async createUser(userData: any): Promise<User> {
		await this.delay();
		const newUser: User = {
			id: Date.now().toString(),
			email: userData.email,
			name: userData.name,
			role: userData.role || "customer",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		mockUsers.push(newUser);
		return newUser;
	}

	async updateUser(id: string, updates: any): Promise<User> {
		await this.delay();
		const userIndex = mockUsers.findIndex((u) => u.id === id);
		if (userIndex === -1) throw new Error("User not found");

		mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
		return mockUsers[userIndex];
	}

	async deleteUser(id: string): Promise<void> {
		await this.delay();
		const userIndex = mockUsers.findIndex((u) => u.id === id);
		if (userIndex === -1) throw new Error("User not found");
		mockUsers.splice(userIndex, 1);
	}

	async resetUserPassword(id: string, newPassword: string): Promise<void> {
		await this.delay();
		// Mock implementation
	}

	async getUsersByRole(role: string): Promise<User[]> {
		await this.delay();
		return mockUsers.filter((u) => u.role === role);
	}

	async getUserStats(): Promise<{
		totalUsers: number;
		usersByRole: Array<{ _id: string; count: number }>;
		recentUsers: User[];
	}> {
		await this.delay();
		return {
			totalUsers: mockUsers.length,
			usersByRole: [
				{ _id: "admin", count: 1 },
				{ _id: "clerk", count: 1 },
			],
			recentUsers: mockUsers.slice(0, 5),
		};
	}

	async bulkUpdateUserRoles(
		userIds: string[],
		role: string
	): Promise<{
		modifiedCount: number;
	}> {
		await this.delay();
		return { modifiedCount: userIds.length };
	}
}

export const mockApiService = new MockApiService();

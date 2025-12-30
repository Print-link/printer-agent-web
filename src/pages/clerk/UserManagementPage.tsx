import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { useBranchStore } from '../../stores/branchStore';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { apiService } from '../../services/api';
import { Users, Plus, Trash2, X, Key } from "lucide-react";
import type { User } from "../../types";

export default function UserManagementPage() {
	const { user } = useAuthStore();
	const { selectedBranch } = useBranchStore();
	const { theme } = useTheme();
	const { success, error: showError } = useToast();
	const queryClient = useQueryClient();
	const [showCreateForm, setShowCreateForm] = useState(false);
	// const [editingClerk, setEditingClerk] = useState<any>(null);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [selectedClerkId, setSelectedClerkId] = useState<string | null>(null);
	const [newPassword, setNewPassword] = useState("");
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		phoneNumber: "",
	});

	const { data: clerks = [], isLoading } = useQuery({
		queryKey: ["clerks", selectedBranch?.id],
		queryFn: () => apiService.getClerksByBranchId(selectedBranch?.id || ""),
		enabled: !!selectedBranch?.id,
	});

	const createClerkMutation = useMutation({
		mutationFn: (
			data: Omit<
				User,
				| "id"
				| "createdAt"
				| "updatedAt"
				| "name"
				| "role"
				| "permissions"
				| "avatar"
				| "isActive"
				| "isTemporaryPassword"
			> & { password: string } & { branch_id: string } & {
				firstName: string;
			} & { lastName: string } & { email: string } & { phoneNumber: string }
		) =>
			apiService.createClerk({
				...data,
				branch_id: selectedBranch?.id || "",
				password: data.password,
			}),
	});

	const deleteMutation = useMutation({
		mutationFn: (clerkId: string) => apiService.deleteUser(clerkId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["clerks"] });
			success("Clerk account deleted successfully", "User Deleted", 4000);
		},
		onError: (error: unknown) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to delete clerk account";
			showError(errorMessage, "Deletion Failed", 5000);
		},
	});

	const changePasswordMutation = useMutation({
		mutationFn: ({
			clerkId,
			password,
		}: {
			clerkId: string;
			password: string;
		}) => apiService.changeClerkPassword(clerkId, password),
		onSuccess: () => {
			setShowPasswordModal(false);
			setSelectedClerkId(null);
			setNewPassword("");
			success("Password changed successfully", "Password Updated", 4000);
		},
		onError: (error: unknown) => {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to change password";
			showError(errorMessage, "Update Failed", 5000);
		},
	});

	if (user?.role !== "manager" || !selectedBranch) {
		return (
			<div
				className={`p-6 rounded-lg ${
					theme === "dark"
						? "bg-gray-800 border border-gray-700"
						: "bg-white border border-gray-200"
				}`}
			>
				<p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
					Access denied. Manager role and branch selection required.
				</p>
			</div>
		);
	}

	const generatePassword = () => {
		const length = 12;
		const charset =
			"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
		let password = "";
		for (let i = 0; i < length; i++) {
			password += charset.charAt(Math.floor(Math.random() * charset.length));
		}
		setFormData({ ...formData, password });
	};

	const handleCreateSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!formData.firstName.trim() ||
			!formData.lastName.trim() ||
			!formData.email.trim() ||
			!formData.password.trim()
		) {
			showError("Please fill in all required fields", "Validation Error", 4000);
			return;
		}
		createClerkMutation.mutate({
			...formData,
			branch_id: selectedBranch?.id || "",
		});

		setShowCreateForm(false);
		setFormData({
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			phoneNumber: "",
		});
		success("Clerk created successfully", "User Created", 4000);
		queryClient.invalidateQueries({ queryKey: ["clerks"] });
	};

	const handlePasswordChange = (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedClerkId || !newPassword.trim()) {
			alert("Please enter a new password");
			return;
		}
		if (newPassword.length < 6) {
			alert("Password must be at least 6 characters");
			return;
		}
		changePasswordMutation.mutate({
			clerkId: selectedClerkId,
			password: newPassword,
		});
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2
					className={`text-2xl font-bold ${
						theme === "dark" ? "text-gray-100" : "text-gray-900"
					}`}
				>
					User Management
				</h2>
				<button
					onClick={() => setShowCreateForm(true)}
					className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-md font-semibold"
				>
					<Plus size={20} />
					Add Clerk
				</button>
			</div>

			{/* Create Clerk Form Modal */}
			{showCreateForm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div
						className={`rounded-lg shadow-xl p-6 max-w-md w-full ${
							theme === "dark"
								? "bg-gray-800 border border-gray-700"
								: "bg-white border border-gray-200"
						}`}
					>
						<div className="flex items-center justify-between mb-6">
							<h3
								className={`text-xl font-bold ${
									theme === "dark" ? "text-gray-100" : "text-gray-900"
								}`}
							>
								Create New Clerk
							</h3>
							<button
								onClick={() => {
									setShowCreateForm(false);
									setFormData({
										firstName: "",
										lastName: "",
										email: "",
										password: "",
										phoneNumber: "",
									});
								}}
								className={`p-2 rounded-md ${
									theme === "dark"
										? "hover:bg-gray-700 text-gray-400"
										: "hover:bg-gray-100 text-gray-600"
								}`}
							>
								<X size={20} />
							</button>
						</div>

						<form onSubmit={handleCreateSubmit} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										className={`block text-sm font-medium mb-2 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}
									>
										First Name *
									</label>
									<input
										type="text"
										value={formData.firstName}
										onChange={(e) =>
											setFormData({ ...formData, firstName: e.target.value })
										}
										className={`w-full px-4 py-2 rounded-md border ${
											theme === "dark"
												? "bg-gray-700 border-gray-600 text-gray-100"
												: "bg-white border-gray-300 text-gray-900"
										} focus:outline-none focus:ring-2 focus:ring-amber-400`}
										required
									/>
								</div>
								<div>
									<label
										className={`block text-sm font-medium mb-2 ${
											theme === "dark" ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Last Name *
									</label>
									<input
										type="text"
										value={formData.lastName}
										onChange={(e) =>
											setFormData({ ...formData, lastName: e.target.value })
										}
										className={`w-full px-4 py-2 rounded-md border ${
											theme === "dark"
												? "bg-gray-700 border-gray-600 text-gray-100"
												: "bg-white border-gray-300 text-gray-900"
										} focus:outline-none focus:ring-2 focus:ring-amber-400`}
										required
									/>
								</div>
							</div>

							<div>
								<label
									className={`block text-sm font-medium mb-2 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Email *
								</label>
								<input
									type="email"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									className={`w-full px-4 py-2 rounded-md border ${
										theme === "dark"
											? "bg-gray-700 border-gray-600 text-gray-100"
											: "bg-white border-gray-300 text-gray-900"
									} focus:outline-none focus:ring-2 focus:ring-amber-400`}
									required
								/>
							</div>

							<div>
								<label
									className={`block text-sm font-medium mb-2 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Temporary Password *
								</label>
								<div className="flex gap-2">
									<input
										type="text"
										value={formData.password}
										onChange={(e) =>
											setFormData({ ...formData, password: e.target.value })
										}
										placeholder="Click Generate to create a temporary password"
										className={`flex-1 px-4 py-2 rounded-md border ${
											theme === "dark"
												? "bg-gray-700 border-gray-600 text-gray-100"
												: "bg-white border-gray-300 text-gray-900"
										} focus:outline-none focus:ring-2 focus:ring-amber-400`}
										required
									/>
									<button
										type="button"
										onClick={generatePassword}
										className={`px-4 py-2 rounded-md font-medium ${
											theme === "dark"
												? "bg-gray-700 hover:bg-gray-600 text-gray-300"
												: "bg-gray-100 hover:bg-gray-200 text-gray-600"
										}`}
									>
										Generate
									</button>
								</div>
							</div>

							<div>
								<label
									className={`block text-sm font-medium mb-2 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Phone Number
								</label>
								<input
									type="tel"
									value={formData.phoneNumber}
									onChange={(e) =>
										setFormData({ ...formData, phoneNumber: e.target.value })
									}
									className={`w-full px-4 py-2 rounded-md border ${
										theme === "dark"
											? "bg-gray-700 border-gray-600 text-gray-100"
											: "bg-white border-gray-300 text-gray-900"
									} focus:outline-none focus:ring-2 focus:ring-amber-400`}
								/>
							</div>

							<div className="flex gap-3">
								<button
									type="submit"
									disabled={createClerkMutation.isPending}
									className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm ${
										createClerkMutation.isPending
											? "bg-amber-300 cursor-not-allowed"
											: "bg-amber-400 hover:bg-amber-500 text-gray-900"
									}`}
								>
									{createClerkMutation.isPending
										? "Creating..."
										: "Create Clerk"}
								</button>
								<button
									type="button"
									onClick={() => {
										setShowCreateForm(false);
										setFormData({
											firstName: "",
											lastName: "",
											email: "",
											password: "",
											phoneNumber: "",
										});
									}}
									className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm ${
										theme === "dark"
											? "bg-gray-700 hover:bg-gray-600 text-gray-300"
											: "bg-gray-100 hover:bg-gray-200 text-gray-600"
									}`}
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Change Password Modal */}
			{showPasswordModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div
						className={`rounded-lg shadow-xl p-6 max-w-md w-full ${
							theme === "dark"
								? "bg-gray-800 border border-gray-700"
								: "bg-white border border-gray-200"
						}`}
					>
						<div className="flex items-center justify-between mb-6">
							<h3
								className={`text-xl font-bold ${
									theme === "dark" ? "text-gray-100" : "text-gray-900"
								}`}
							>
								Change Password
							</h3>
							<button
								onClick={() => {
									setShowPasswordModal(false);
									setSelectedClerkId(null);
									setNewPassword("");
								}}
								className={`p-2 rounded-md ${
									theme === "dark"
										? "hover:bg-gray-700 text-gray-400"
										: "hover:bg-gray-100 text-gray-600"
								}`}
							>
								<X size={20} />
							</button>
						</div>

						<form onSubmit={handlePasswordChange} className="space-y-4">
							<div>
								<label
									className={`block text-sm font-medium mb-2 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}
								>
									New Password *
								</label>
								<input
									type="password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									className={`w-full px-4 py-2 rounded-md border ${
										theme === "dark"
											? "bg-gray-700 border-gray-600 text-gray-100"
											: "bg-white border-gray-300 text-gray-900"
									} focus:outline-none focus:ring-2 focus:ring-amber-400`}
									required
									minLength={6}
								/>
							</div>

							<div className="flex gap-3">
								<button
									type="submit"
									disabled={changePasswordMutation.isPending}
									className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm ${
										changePasswordMutation.isPending
											? "bg-amber-300 cursor-not-allowed"
											: "bg-amber-400 hover:bg-amber-500 text-gray-900"
									}`}
								>
									{changePasswordMutation.isPending
										? "Updating..."
										: "Update Password"}
								</button>
								<button
									type="button"
									onClick={() => {
										setShowPasswordModal(false);
										setSelectedClerkId(null);
										setNewPassword("");
									}}
									className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm ${
										theme === "dark"
											? "bg-gray-700 hover:bg-gray-600 text-gray-300"
											: "bg-gray-100 hover:bg-gray-200 text-gray-600"
									}`}
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{isLoading ? (
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
				</div>
			) : clerks.length === 0 ? (
				<div
					className={`p-6 rounded-lg text-center ${
						theme === "dark"
							? "bg-gray-800 border border-gray-700"
							: "bg-white border border-gray-200"
					}`}
				>
					<Users
						className={`mx-auto mb-4 ${
							theme === "dark" ? "text-gray-600" : "text-gray-400"
						}`}
						size={48}
					/>
					<p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
						No clerks found for this branch.
					</p>
				</div>
			) : (
				<div
					className={`rounded-lg overflow-hidden ${
						theme === "dark"
							? "bg-gray-800 border border-gray-700"
							: "bg-white border border-gray-200"
					}`}
				>
					<table className="w-full">
						<thead className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}>
							<tr>
								<th
									className={`px-6 py-3 text-left text-xs font-medium uppercase ${
										theme === "dark" ? "text-gray-300" : "text-gray-600"
									}`}
								>
									Name
								</th>
								<th
									className={`px-6 py-3 text-left text-xs font-medium uppercase ${
										theme === "dark" ? "text-gray-300" : "text-gray-600"
									}`}
								>
									Email
								</th>
								<th
									className={`px-6 py-3 text-left text-xs font-medium uppercase ${
										theme === "dark" ? "text-gray-300" : "text-gray-600"
									}`}
								>
									Phone
								</th>
								<th
									className={`px-6 py-3 text-left text-xs font-medium uppercase ${
										theme === "dark" ? "text-gray-300" : "text-gray-600"
									}`}
								>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
							{clerks.map((clerk: User) => (
								<tr key={clerk.id}>
									<td
										className={`px-6 py-4 whitespace-nowrap ${
											theme === "dark" ? "text-gray-100" : "text-gray-900"
										}`}
									>
										{clerk.name ||
											`${clerk.firstName || ""} ${
												clerk.lastName || ""
											}`.trim() ||
											"N/A"}
									</td>
									<td
										className={`px-6 py-4 whitespace-nowrap ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}
									>
										{clerk.email}
									</td>
									<td
										className={`px-6 py-4 whitespace-nowrap ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}
									>
										{clerk.phoneNumber || "N/A"}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex gap-2">
											<button
												onClick={() => {
													setSelectedClerkId(clerk.id);
													setNewPassword("");
													setShowPasswordModal(true);
												}}
												className={`p-2 rounded-md ${
													theme === "dark"
														? "hover:bg-gray-700 text-gray-400"
														: "hover:bg-gray-100 text-gray-600"
												}`}
												title="Change Password"
											>
												<Key size={16} />
											</button>
											<button
												onClick={() => {
													if (
														confirm(
															"Are you sure you want to delete this user?"
														)
													) {
														deleteMutation.mutate(clerk.id);
													}
												}}
												className={`p-2 rounded-md ${
													theme === "dark"
														? "hover:bg-red-900/30 text-red-400"
														: "hover:bg-red-50 text-red-600"
												}`}
											>
												<Trash2 size={16} />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}


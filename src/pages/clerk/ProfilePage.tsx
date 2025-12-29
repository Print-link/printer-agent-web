import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
// import { useBranchStore } from '../../stores/branchStore';
import { useTheme } from "../../contexts/ThemeContext";
import { apiService } from "../../services/api";
import {
	User,
	Mail,
	Lock,
	MapPin,
	Calendar,
	LogOut,
	Edit,
	Save,
	X,
	Key,
} from "lucide-react";

export default function ProfilePage() {
	const { user, logout, updateUserProfile } = useAuthStore();
	// const { selectedBranch } = useBranchStore();
	const { theme } = useTheme();
	const navigate = useNavigate();

	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [profileData, setProfileData] = useState({
		name: user?.name || user?.firstName || "",
		email: user?.email || "",
	});
	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [profileError, setProfileError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const getInitials = (name?: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const formatDate = (timestamp: number | Date | undefined) => {
		if (!timestamp) return "N/A";
		const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatLocation = (location?: {
		latitude: number;
		longitude: number;
		address: string;
	}) => {
		if (!location?.address) return "N/A";
		const parts = location.address.split(",").map((p) => p.trim());
		if (parts.length > 2) {
			return parts.slice(-2).join(", ");
		}
		if (location.address.length > 50) {
			return location.address.substring(0, 47) + "...";
		}
		return location.address;
	};

	const handleProfileSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setProfileError(null);
		setIsSubmitting(true);

		try {
			await updateUserProfile({
				name: profileData.name.trim() || undefined,
				email: profileData.email.trim() || undefined,
			});
			setIsEditingProfile(false);
			setSuccessMessage("Profile updated successfully!");
			setTimeout(() => setSuccessMessage(null), 3000);
		} catch (err: unknown) {
			setProfileError(
				err instanceof Error ? err.message : "Failed to update profile"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handlePasswordSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setPasswordError(null);
		setIsSubmitting(true);

		if (!passwordData.currentPassword) {
			setPasswordError("Current password is required");
			setIsSubmitting(false);
			return;
		}

		if (!passwordData.newPassword) {
			setPasswordError("New password is required");
			setIsSubmitting(false);
			return;
		}

		if (passwordData.newPassword.length < 6) {
			setPasswordError("New password must be at least 6 characters");
			setIsSubmitting(false);
			return;
		}

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setPasswordError("Passwords do not match");
			setIsSubmitting(false);
			return;
		}

		try {
			await apiService.changePassword(
				passwordData.currentPassword,
				passwordData.newPassword
			);
			setIsChangingPassword(false);
			setPasswordData({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
			setSuccessMessage("Password changed successfully!");
			setTimeout(() => setSuccessMessage(null), 3000);
		} catch (err: unknown) {
			setPasswordError(
				err instanceof Error ? err.message : "Failed to change password"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1
					className={`text-2xl font-bold mb-2 ${
						theme === "dark" ? "text-gray-100" : "text-gray-900"
					}`}
				>
					My Profile
				</h1>
				<p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
					Manage your account information and preferences
				</p>
			</div>

			{/* Success Message */}
			{successMessage && (
				<div
					className={`p-4 rounded-lg flex items-center gap-3 ${
						theme === "dark"
							? "bg-green-900/30 border border-green-800 text-green-400"
							: "bg-green-50 border border-green-200 text-green-600"
					}`}
				>
					<Save size={20} />
					<span>{successMessage}</span>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Personal Information Card */}
				<div
					className={`rounded-lg p-6 ${
						theme === "dark"
							? "bg-gray-800 border border-gray-700"
							: "bg-white border border-gray-200"
					}`}
				>
					<div className="flex items-center justify-between mb-6">
						<h2
							className={`text-lg font-semibold flex items-center gap-2 ${
								theme === "dark" ? "text-gray-100" : "text-gray-900"
							}`}
						>
							<User className="text-amber-400" size={20} />
							Personal Information
						</h2>
						{!isEditingProfile && (
							<button
								onClick={() => setIsEditingProfile(true)}
								className={`p-2 rounded-md flex items-center gap-2 ${
									theme === "dark"
										? "bg-gray-700 hover:bg-gray-600 text-gray-300"
										: "bg-gray-100 hover:bg-gray-200 text-gray-600"
								}`}
							>
								<Edit size={16} />
								Edit
							</button>
						)}
					</div>

					{isEditingProfile ? (
						<form onSubmit={handleProfileSubmit} className="space-y-4">
							<div>
								<label
									className={`block text-sm font-medium mb-2 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Full Name
								</label>
								<input
									type="text"
									value={profileData.name}
									onChange={(e) =>
										setProfileData({ ...profileData, name: e.target.value })
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
									Email Address
								</label>
								<input
									type="email"
									value={profileData.email}
									onChange={(e) =>
										setProfileData({ ...profileData, email: e.target.value })
									}
									className={`w-full px-4 py-2 rounded-md border ${
										theme === "dark"
											? "bg-gray-700 border-gray-600 text-gray-100"
											: "bg-white border-gray-300 text-gray-900"
									} focus:outline-none focus:ring-2 focus:ring-amber-400`}
									required
								/>
							</div>

							{profileError && (
								<div
									className={`p-3 rounded-md text-sm ${
										theme === "dark"
											? "bg-red-900/30 text-red-400 border border-red-800"
											: "bg-red-50 text-red-600 border border-red-200"
									}`}
								>
									{profileError}
								</div>
							)}

							<div className="flex gap-3">
								<button
									type="submit"
									disabled={isSubmitting}
									className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 ${
										isSubmitting
											? "bg-amber-300 cursor-not-allowed"
											: "bg-amber-400 hover:bg-amber-500 text-gray-900"
									}`}
								>
									<Save size={16} />
									{isSubmitting ? "Saving..." : "Save Changes"}
								</button>
								<button
									type="button"
									onClick={() => {
										setIsEditingProfile(false);
										setProfileData({
											name: user?.name || user?.firstName || "",
											email: user?.email || "",
										});
										setProfileError(null);
									}}
									className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 ${
										theme === "dark"
											? "bg-gray-700 hover:bg-gray-600 text-gray-300"
											: "bg-gray-100 hover:bg-gray-200 text-gray-600"
									}`}
								>
									<X size={16} />
									Cancel
								</button>
							</div>
						</form>
					) : (
						<div className="space-y-6">
							{/* Avatar */}
							<div
								className={`flex items-center gap-5 pb-6 border-b ${
									theme === "dark" ? "border-gray-700" : "border-gray-200"
								}`}
							>
								<div className="w-20 h-20 rounded-full bg-amber-400 flex items-center justify-center text-2xl font-bold text-gray-900">
									{getInitials(user?.name || user?.firstName)}
								</div>
								<div>
									<h3
										className={`text-2xl font-bold mb-1 ${
											theme === "dark" ? "text-gray-100" : "text-gray-900"
										}`}
									>
										{user?.name || user?.firstName || "User"}
									</h3>
									<p
										className={`text-sm flex items-center gap-2 ${
											theme === "dark" ? "text-gray-400" : "text-gray-600"
										}`}
									>
										<Mail size={14} />
										{user?.email || "No email"}
									</p>
								</div>
							</div>

							{/* Account Details */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<Mail
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}
											size={18}
										/>
										<span
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}
										>
											Email
										</span>
									</div>
									<span
										className={
											theme === "dark" ? "text-gray-100" : "text-gray-900"
										}
									>
										{user?.email || "N/A"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<User
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}
											size={18}
										/>
										<span
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}
										>
											Role
										</span>
									</div>
									<span
										className={
											theme === "dark" ? "text-gray-100" : "text-gray-900"
										}
									>
										{user?.role
											? user.role.charAt(0).toUpperCase() + user.role.slice(1)
											: "N/A"}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<Calendar
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}
											size={18}
										/>
										<span
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}
										>
											Member Since
										</span>
									</div>
									<span
										className={
											theme === "dark" ? "text-gray-100" : "text-gray-900"
										}
									>
										{formatDate(user?.createdAt)}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<MapPin
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}
											size={18}
										/>
										<span
											className={
												theme === "dark" ? "text-gray-400" : "text-gray-600"
											}
										>
											Location
										</span>
									</div>
									<span
										className={
											theme === "dark" ? "text-gray-100" : "text-gray-900"
										}
									>
										{formatLocation(
											user?.branch_id as unknown as {
												latitude: number;
												longitude: number;
												address: string;
											}
										)}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Security Card */}
				<div
					className={`rounded-lg p-6 ${
						theme === "dark"
							? "bg-gray-800 border border-gray-700"
							: "bg-white border border-gray-200"
					}`}
				>
					<div className="flex items-center gap-2 mb-6">
						<Lock className="text-amber-400" size={24} />
						<h2
							className={`text-lg font-semibold ${
								theme === "dark" ? "text-gray-100" : "text-gray-900"
							}`}
						>
							Security
						</h2>
					</div>

					{isChangingPassword ? (
						<form onSubmit={handlePasswordSubmit} className="space-y-4">
							<div>
								<label
									className={`block text-sm font-medium mb-2 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Current Password
								</label>
								<input
									type="password"
									value={passwordData.currentPassword}
									onChange={(e) =>
										setPasswordData({
											...passwordData,
											currentPassword: e.target.value,
										})
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
									New Password
								</label>
								<input
									type="password"
									value={passwordData.newPassword}
									onChange={(e) =>
										setPasswordData({
											...passwordData,
											newPassword: e.target.value,
										})
									}
									className={`w-full px-4 py-2 rounded-md border ${
										theme === "dark"
											? "bg-gray-700 border-gray-600 text-gray-100"
											: "bg-white border-gray-300 text-gray-900"
									} focus:outline-none focus:ring-2 focus:ring-amber-400`}
									required
									minLength={6}
								/>
							</div>

							<div>
								<label
									className={`block text-sm font-medium mb-2 ${
										theme === "dark" ? "text-gray-300" : "text-gray-700"
									}`}
								>
									Confirm New Password
								</label>
								<input
									type="password"
									value={passwordData.confirmPassword}
									onChange={(e) =>
										setPasswordData({
											...passwordData,
											confirmPassword: e.target.value,
										})
									}
									className={`w-full px-4 py-2 rounded-md border ${
										theme === "dark"
											? "bg-gray-700 border-gray-600 text-gray-100"
											: "bg-white border-gray-300 text-gray-900"
									} focus:outline-none focus:ring-2 focus:ring-amber-400`}
									required
									minLength={6}
								/>
							</div>

							{passwordError && (
								<div
									className={`p-3 rounded-md text-sm ${
										theme === "dark"
											? "bg-red-900/30 text-red-400 border border-red-800"
											: "bg-red-50 text-red-600 border border-red-200"
									}`}
								>
									{passwordError}
								</div>
							)}

							<div className="flex gap-3">
								<button
									type="submit"
									disabled={isSubmitting}
									className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 ${
										isSubmitting
											? "bg-amber-300 cursor-not-allowed"
											: "bg-amber-400 hover:bg-amber-500 text-gray-900"
									}`}
								>
									<Key size={16} />
									{isSubmitting ? "Updating..." : "Update Password"}
								</button>
								<button
									type="button"
									onClick={() => {
										setIsChangingPassword(false);
										setPasswordData({
											currentPassword: "",
											newPassword: "",
											confirmPassword: "",
										});
										setPasswordError(null);
									}}
									className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 ${
										theme === "dark"
											? "bg-gray-700 hover:bg-gray-600 text-gray-300"
											: "bg-gray-100 hover:bg-gray-200 text-gray-600"
									}`}
								>
									<X size={16} />
									Cancel
								</button>
							</div>
						</form>
					) : (
						<div className="space-y-4">
							<div
								className={`p-4 rounded-lg ${
									theme === "dark"
										? "bg-gray-700 border border-gray-600"
										: "bg-gray-50 border border-gray-200"
								}`}
							>
								<p
									className={`text-sm mb-3 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								>
									Change your password to keep your account secure
								</p>
								<button
									onClick={() => setIsChangingPassword(true)}
									className={`w-full py-2 px-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 ${
										theme === "dark"
											? "bg-gray-600 hover:bg-gray-500 text-gray-100"
											: "bg-gray-200 hover:bg-gray-300 text-gray-900"
									}`}
								>
									<Key size={16} />
									Change Password
								</button>
							</div>

							{/* Logout Section */}
							<div
								className={`p-4 rounded-lg border ${
									theme === "dark"
										? "bg-red-900/20 border-red-800"
										: "bg-red-50 border-red-200"
								}`}
							>
								<p
									className={`text-sm mb-3 ${
										theme === "dark" ? "text-gray-400" : "text-gray-600"
									}`}
								>
									Sign out of your account
								</p>
								<button
									onClick={handleLogout}
									className="w-full py-2 px-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white"
								>
									<LogOut size={16} />
									Logout
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

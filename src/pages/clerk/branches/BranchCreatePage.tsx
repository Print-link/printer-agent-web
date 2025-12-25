import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/authStore';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';
import { apiService } from '../../../services/api';
import type { Branch } from "../../../types";
import { useBranchForm } from "./hooks/useBranchForm";
import { useBranchImage } from "./hooks/useBranchImage";
import {
	BranchFormHeader,
	BranchFormStepper,
	BranchFormNavigation,
	BasicInfoStep,
	LocationStep,
	OperatingHoursStep,
	ReviewStep,
} from "./components";
import type { Step } from "./components/BranchFormStepper";

const STEPS: Step[] = [
	{
		id: 1,
		title: "Basic Information",
		description: "Branch name and contact details",
	},
	{ id: 2, title: "Location", description: "Address and coordinates" },
	{
		id: 3,
		title: "Operating Hours",
		description: "Set working hours for each day",
	},
	{ id: 4, title: "Review", description: "Review and confirm details" },
];

export default function BranchCreatePage() {
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const { theme } = useTheme();
	const { success, error: showError } = useToast();
	const queryClient = useQueryClient();
	const [currentStep, setCurrentStep] = useState(1);

	// Form state management
	const {
		formData,
		locationData,
		operatingHours,
		errors,
		updateFormData,
		updateLocationData,
		updateOperatingHours,
		validateStep,
	} = useBranchForm();

	// Image handling
	const {
		imagePreview,
		handleImageSelect: handleImageSelectBase,
		handleRemoveImage: handleRemoveImageBase,
	} = useBranchImage();

	// Image handlers with form data updates
	const handleImageSelect = (file: File) => {
		handleImageSelectBase(file, (selectedFile) => {
			updateFormData({ branchCoverImage: selectedFile });
		});
	};

	const handleRemoveImage = () => {
		handleRemoveImageBase(() => {
			updateFormData({ branchCoverImage: null });
		});
	};

	// Branch creation mutation
	const createBranchMutation = useMutation({
		mutationFn: async (
			branchData: Omit<Branch, "id" | "createdAt" | "updatedAt">
		) => {
			if (!user?.id) {
				throw new Error("User not authenticated");
			}

			// Validate that cover image is provided (backend requires it)
			if (
				!formData.branchCoverImage ||
				!(formData.branchCoverImage instanceof File)
			) {
				throw new Error("Branch cover image is required");
			}

			// Step 1: Create branch first (following reference app pattern)
			const newBranch = await apiService.createBranch(
				branchData,
				formData.branchCoverImage as File
			);

			// Step 2: Create location separately with the branch_id (if location data provided)
			if (
				locationData.address &&
				locationData.latitude &&
				locationData.longitude
			) {
				try {
					await apiService.createLocation({
						branch_id: newBranch.id,
						address: locationData.address,
						latitude: locationData.latitude,
						longitude: locationData.longitude,
						city: locationData.city || undefined,
						state: locationData.state || undefined,
						country: locationData.country || undefined,
						postalCode: locationData.postalCode || undefined,
					});
				} catch (locationError) {
					console.error("Failed to create location:", locationError);
					// Continue even if location creation fails - branch is already created
					// User can update location later if needed
				}
			}

			return newBranch;
		},
		onSuccess: () => {
			if (user?.id) {
				queryClient.invalidateQueries({ queryKey: ["branches", user.id] });
			}
			success("Branch created successfully", "Branch Created", 4000);
			navigate("/clerk/branches");
		},
		onError: (error: unknown) => {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create branch";
			showError(errorMessage, "Creation Failed", 5000);
		},
	});

	// Navigation handlers
	const handleNext = () => {
		if (validateStep(currentStep)) {
			setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
		}
	};

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	};

	const handleCancel = () => {
		navigate("/clerk/branches");
	};

	// Submit handler
	const handleSubmit = async () => {
		if (!validateStep(currentStep)) return;

		if (!user?.id) {
			showError("User not authenticated", "Error", 3000);
			return;
		}

		// Convert operating hours to the correct format (object with day keys)
		const formattedOperatingHours: Record<
			string,
			{ open: string; close: string }
		> = {};
		Object.entries(operatingHours).forEach(([day, hours]) => {
			if (hours.open && hours.close) {
				formattedOperatingHours[day] = {
					open: hours.open,
					close: hours.close,
				};
			}
		});

		const branchData: Omit<Branch, "id" | "createdAt" | "updatedAt"> = {
			name: formData.name,
			phoneNumber: formData.phoneNumber || undefined,
			branchEmailAddress: formData.branchEmailAddress || undefined,
			manager_id: user.id,
			status: formData.status,
			isMainBranch: formData.isMainBranch,
			branchCoverImage: undefined, // Will be set after upload in mutation
			operatingHours: formattedOperatingHours,
		};

		createBranchMutation.mutate(branchData);
	};

	// Render step content
	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<BasicInfoStep
						formData={formData}
						errors={errors}
						imagePreview={imagePreview}
						onFormDataChange={updateFormData}
						onImageSelect={handleImageSelect}
						onRemoveImage={handleRemoveImage}
					/>
				);
			case 2:
				return (
					<LocationStep
						locationData={locationData}
						errors={errors}
						onLocationChange={updateLocationData}
					/>
				);
			case 3:
				return (
					<OperatingHoursStep
						operatingHours={operatingHours}
						errors={errors}
						onOperatingHoursChange={updateOperatingHours}
					/>
				);
			case 4:
				return (
					<ReviewStep
						formData={formData}
						locationData={locationData}
						operatingHours={operatingHours}
					/>
				);
			default:
				return null;
		}
	};

	// Access control
	if (!user || user.role !== "manager" || !user.id) {
		return (
			<div
				className={`flex items-center justify-center min-h-screen ${
					theme === "dark" ? "bg-gray-900" : "bg-gray-50"
				}`}
			>
				<div className="text-center p-6">
					<p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
						Access Denied
					</p>
					<button
						onClick={handleCancel}
						className="mt-4 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-md font-semibold"
					>
						Back to Branches
					</button>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen ${
				theme === "dark" ? "bg-gray-900" : "bg-gray-50"
			}`}
		>
			<div className="max-w-4xl mx-auto p-6">
				<BranchFormHeader
					title="Create New Branch"
					description={STEPS[currentStep - 1].description}
					onBack={handleCancel}
				/>

				<BranchFormStepper steps={STEPS} currentStep={currentStep} />

				<div
					className={`p-6 rounded-lg mb-6 ${
						theme === "dark"
							? "bg-gray-800 border border-gray-700"
							: "bg-white border border-gray-200"
					}`}
				>
					{renderStepContent()}
				</div>

				<BranchFormNavigation
					currentStep={currentStep}
					totalSteps={STEPS.length}
					isSubmitting={createBranchMutation.isPending}
					onPrevious={handlePrevious}
					onNext={handleNext}
					onCancel={handleCancel}
					onSubmit={handleSubmit}
				/>
			</div>
		</div>
	);
}

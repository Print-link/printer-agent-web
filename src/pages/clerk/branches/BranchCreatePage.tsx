import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/authStore';
import { useTheme } from '../../../contexts/ThemeContext';
import { apiService } from '../../../services/api';
import { ArrowLeft, CheckCircle, X } from 'lucide-react';
import type { IBranch } from '../../../types';

const STEPS = [
  { id: 1, title: 'Basic Information', description: 'Branch name and contact details' },
  { id: 2, title: 'Location', description: 'Address and coordinates' },
  { id: 3, title: 'Operating Hours', description: 'Set working hours for each day' },
  { id: 4, title: 'Review', description: 'Review and confirm details' },
];

export default function BranchCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    branchCoverImage: null as File | string | null,
  });
  const [locationData, setLocationData] = useState({
    latitude: 0,
    longitude: 0,
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });
  const [operatingHours, setOperatingHours] = useState<Record<string, { open: string; close: string; isClosed: boolean }>>({
    monday: { open: '09:00', close: '17:00', isClosed: false },
    tuesday: { open: '09:00', close: '17:00', isClosed: false },
    wednesday: { open: '09:00', close: '17:00', isClosed: false },
    thursday: { open: '09:00', close: '17:00', isClosed: false },
    friday: { open: '09:00', close: '17:00', isClosed: false },
    saturday: { open: '09:00', close: '17:00', isClosed: false },
    sunday: { open: '09:00', close: '17:00', isClosed: true },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user || user.role !== 'manager' || !user.id) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center p-6">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Access Denied
          </p>
          <button
            onClick={() => navigate('/clerk/branches')}
            className="mt-4 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-md font-semibold"
          >
            Back to Branches
          </button>
        </div>
      </div>
    );
  }

  const createBranchMutation = useMutation({
    mutationFn: async (branchData: any) => {
      // Upload image if provided
      let coverImageUrl = '';
      if (formData.branchCoverImage instanceof File) {
        const uploadResult = await apiService.uploadFile(formData.branchCoverImage);
        coverImageUrl = uploadResult.fileId; // Assuming fileId is the URL
      }

      return apiService.createBranch({
        ...branchData,
        managerId: user.id,
        coverImage: coverImageUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      navigate('/clerk/branches');
    },
  });

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Branch name is required';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    } else if (step === 2) {
      if (!locationData.address.trim()) newErrors.address = 'Address is required';
      if (!locationData.latitude || !locationData.longitude) {
        newErrors.location = 'Please select a location on the map';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    const branchData: any = {
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email || undefined,
      location: {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        address: locationData.address,
        city: locationData.city,
        state: locationData.state,
        country: locationData.country,
        postalCode: locationData.postalCode,
      },
      operatingHours: Object.entries(operatingHours).map(([day, hours]) => ({
        day,
        open: hours.isClosed ? null : hours.open,
        close: hours.isClosed ? null : hours.close,
        isClosed: hours.isClosed,
      })),
    };

    createBranchMutation.mutate(branchData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Branch Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                required
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Address *
              </label>
              <input
                type="text"
                value={locationData.address}
                onChange={(e) => setLocationData({ ...locationData, address: e.target.value })}
                placeholder="Enter address or search for location"
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                required
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  City
                </label>
                <input
                  type="text"
                  value={locationData.city}
                  onChange={(e) => setLocationData({ ...locationData, city: e.target.value })}
                  className={`w-full px-4 py-2 rounded-md border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-gray-100'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  State
                </label>
                <input
                  type="text"
                  value={locationData.state}
                  onChange={(e) => setLocationData({ ...locationData, state: e.target.value })}
                  className={`w-full px-4 py-2 rounded-md border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-gray-100'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                />
              </div>
            </div>

            <div className="h-64 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Map integration coming soon. Please enter coordinates manually or use address search.
              </p>
            </div>

            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            {Object.entries(operatingHours).map(([day, hours]) => (
              <div key={day} className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <label className={`font-medium capitalize ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {day}
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!hours.isClosed}
                      onChange={(e) => {
                        setOperatingHours({
                          ...operatingHours,
                          [day]: { ...hours, isClosed: !e.target.checked },
                        });
                      }}
                      className="rounded"
                    />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Open
                    </span>
                  </label>
                </div>
                {!hours.isClosed && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Open
                      </label>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => {
                          setOperatingHours({
                            ...operatingHours,
                            [day]: { ...hours, open: e.target.value },
                          });
                        }}
                        className={`w-full px-3 py-2 rounded-md border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-600 text-gray-100'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Close
                      </label>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => {
                          setOperatingHours({
                            ...operatingHours,
                            [day]: { ...hours, close: e.target.value },
                          });
                        }}
                        className={`w-full px-3 py-2 rounded-md border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-600 text-gray-100'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-amber-400`}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h3 className={`font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Basic Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Name:</span> {formData.name}</p>
                <p><span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Phone:</span> {formData.phoneNumber}</p>
                {formData.email && (
                  <p><span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Email:</span> {formData.email}</p>
                )}
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h3 className={`font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Location
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {locationData.address}
              </p>
            </div>

            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h3 className={`font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Operating Hours
              </h3>
              <div className="space-y-1 text-sm">
                {Object.entries(operatingHours).map(([day, hours]) => (
                  <p key={day} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    <span className="capitalize">{day}:</span>{' '}
                    {hours.isClosed ? 'Closed' : `${hours.open} - ${hours.close}`}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/clerk/branches')}
            className={`p-2 rounded-md ${
              theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Create New Branch
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {STEPS[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-amber-400 text-gray-900'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle size={20} />
                    ) : (
                      step.id
                    )}
                  </div>
                  <p className={`text-xs mt-2 text-center ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step.id
                      ? 'bg-green-500'
                      : theme === 'dark'
                      ? 'bg-gray-700'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className={`p-6 rounded-lg mb-6 ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={currentStep === 1 ? () => navigate('/clerk/branches') : handlePrevious}
            className={`px-6 py-2 rounded-md font-semibold ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </button>
          <div className="flex gap-3">
            {currentStep < STEPS.length ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-md font-semibold"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={createBranchMutation.isPending}
                className={`px-6 py-2 rounded-md font-semibold ${
                  createBranchMutation.isPending
                    ? 'bg-amber-300 cursor-not-allowed'
                    : 'bg-amber-400 hover:bg-amber-500'
                } text-gray-900`}
              >
                {createBranchMutation.isPending ? 'Creating...' : 'Create Branch'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


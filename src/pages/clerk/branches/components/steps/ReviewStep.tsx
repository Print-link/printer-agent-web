import { useTheme } from '../../../../../contexts/ThemeContext';
import type { BranchFormData, LocationFormData, OperatingHours } from '../../hooks/useBranchForm';

interface ReviewStepProps {
  formData: BranchFormData;
  locationData: LocationFormData;
  operatingHours: OperatingHours;
}

export function ReviewStep({
  formData,
  locationData,
  operatingHours,
}: ReviewStepProps) {
  const { theme } = useTheme();

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
          <p>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Name:</span>{' '}
            <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>{formData.name}</span>
          </p>
          {formData.phoneNumber && (
            <p>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Phone:</span>{' '}
              <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>{formData.phoneNumber}</span>
            </p>
          )}
          {formData.branchEmailAddress && (
            <p>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Email:</span>{' '}
              <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>{formData.branchEmailAddress}</span>
            </p>
          )}
          <p>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Status:</span>{' '}
            <span className={`capitalize ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              {formData.status.replace('_', ' ')}
            </span>
          </p>
          <p>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Main Branch:</span>{' '}
            <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
              {formData.isMainBranch ? 'Yes' : 'No'}
            </span>
          </p>
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
        <div className="space-y-2 text-sm">
          <p>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Address:</span>{' '}
            <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>{locationData.address}</span>
          </p>
          {locationData.city && (
            <p>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>City:</span>{' '}
              <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>{locationData.city}</span>
            </p>
          )}
          {locationData.state && (
            <p>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>State:</span>{' '}
              <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>{locationData.state}</span>
            </p>
          )}
          {locationData.country && (
            <p>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Country:</span>{' '}
              <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>{locationData.country}</span>
            </p>
          )}
          <p>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Coordinates:</span>{' '}
            <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
              {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
            </span>
          </p>
        </div>
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
              <span className="capitalize font-medium">{day}:</span>{' '}
              {hours.open && hours.close ? `${hours.open} - ${hours.close}` : 'Not set'}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}


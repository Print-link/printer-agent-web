import { MapPin } from 'lucide-react';
import { useTheme } from '../../../../../contexts/ThemeContext';
import type { LocationFormData } from '../../hooks/useBranchForm';

interface LocationStepProps {
  locationData: LocationFormData;
  errors: Record<string, string>;
  onLocationChange: (updates: Partial<LocationFormData>) => void;
}

export function LocationStep({
  locationData,
  errors,
  onLocationChange,
}: LocationStepProps) {
  const { theme } = useTheme();

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
          onChange={(e) => onLocationChange({ address: e.target.value })}
          placeholder="Enter full address"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            City
          </label>
          <input
            type="text"
            value={locationData.city}
            onChange={(e) => onLocationChange({ city: e.target.value })}
            className={`w-full px-4 py-2 rounded-md border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-amber-400`}
            placeholder="City"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            State/Region
          </label>
          <input
            type="text"
            value={locationData.state}
            onChange={(e) => onLocationChange({ state: e.target.value })}
            className={`w-full px-4 py-2 rounded-md border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-amber-400`}
            placeholder="State/Region"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Country
          </label>
          <input
            type="text"
            value={locationData.country}
            onChange={(e) => onLocationChange({ country: e.target.value })}
            className={`w-full px-4 py-2 rounded-md border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-amber-400`}
            placeholder="Country"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Postal Code
          </label>
          <input
            type="text"
            value={locationData.postalCode}
            onChange={(e) => onLocationChange({ postalCode: e.target.value })}
            className={`w-full px-4 py-2 rounded-md border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-amber-400`}
            placeholder="Postal Code"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Latitude *
          </label>
          <input
            type="number"
            step="any"
            value={locationData.latitude || ''}
            onChange={(e) => onLocationChange({ latitude: parseFloat(e.target.value) || 0 })}
            className={`w-full px-4 py-2 rounded-md border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-amber-400`}
            placeholder="e.g., 5.6037"
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Longitude *
          </label>
          <input
            type="number"
            step="any"
            value={locationData.longitude || ''}
            onChange={(e) => onLocationChange({ longitude: parseFloat(e.target.value) || 0 })}
            className={`w-full px-4 py-2 rounded-md border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-amber-400`}
            placeholder="e.g., -0.1870"
            required
          />
        </div>
      </div>

      <div className={`p-4 rounded-lg border ${
        theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-amber-50/50 border-amber-200'
      }`}>
        <div className="flex items-start gap-2">
          <MapPin className={`mt-0.5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} size={16} />
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <strong>Note:</strong> Enter the latitude and longitude coordinates for the branch location.
            You can find these coordinates using Google Maps or other mapping services.
          </p>
        </div>
      </div>

      {errors.location && (
        <p className="text-red-500 text-sm">{errors.location}</p>
      )}
    </div>
  );
}


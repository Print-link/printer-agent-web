import { useTheme } from '../../../../../contexts/ThemeContext';
import type { OperatingHours } from '../../hooks/useBranchForm';

interface OperatingHoursStepProps {
  operatingHours: OperatingHours;
  errors: Record<string, string>;
  onOperatingHoursChange: (day: string, field: 'open' | 'close', value: string) => void;
}

export function OperatingHoursStep({
  operatingHours,
  errors,
  onOperatingHoursChange,
}: OperatingHoursStepProps) {
  const { theme } = useTheme();

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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Open Time
              </label>
              <input
                type="time"
                value={hours.open}
                onChange={(e) => onOperatingHoursChange(day, 'open', e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              />
              {errors[`hours_${day}`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`hours_${day}`]}</p>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Close Time
              </label>
              <input
                type="time"
                value={hours.close}
                onChange={(e) => onOperatingHoursChange(day, 'close', e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


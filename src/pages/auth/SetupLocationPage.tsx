import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../contexts/ThemeContext';
import { MapPin, Search } from 'lucide-react';

export default function SetupLocationPage() {
  const navigate = useNavigate();
  const { user, updateUserLocation } = useAuthStore();
  const { theme } = useTheme();
  const [address, setAddress] = useState(user?.location?.address || '');
  const [latitude, setLatitude] = useState(user?.location?.latitude || 0);
  const [longitude, setLongitude] = useState(user?.location?.longitude || 0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);

        // Reverse geocode to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          setAddress(data.display_name || `${lat}, ${lng}`);
        } catch (err) {
          setAddress(`${lat}, ${lng}`);
        }
        setIsGettingLocation(false);
      },
      (err) => {
        setError('Unable to retrieve your location. Please enter it manually.');
        setIsGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!address.trim()) {
      setError('Address is required');
      setIsLoading(false);
      return;
    }

    if (latitude === 0 && longitude === 0) {
      setError('Please get your location or enter coordinates');
      setIsLoading(false);
      return;
    }

    try {
      await updateUserLocation({
        latitude,
        longitude,
        address: address.trim(),
      });
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Failed to save location');
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-5 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-white to-gray-50'
    }`}>
      <div className={`w-full max-w-md rounded-lg shadow-xl p-8 ${
        theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-400 mb-4">
            <MapPin className="w-8 h-8 text-gray-900" />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Set Your Location
          </h2>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Help us find your business location
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Address *
            </label>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your business address"
                required
                className={`w-full pl-10 pr-4 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-all ${
              isGettingLocation
                ? 'bg-gray-400 cursor-not-allowed'
                : theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            {isGettingLocation ? 'Getting location...' : 'Use Current Location'}
          </button>

          {latitude !== 0 && longitude !== 0 && (
            <div className={`p-3 rounded-md text-sm ${
              theme === 'dark' 
                ? 'bg-green-900/30 text-green-400 border border-green-800' 
                : 'bg-green-50 text-green-600 border border-green-200'
            }`}>
              Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </div>
          )}

          {error && (
            <div className={`p-3 rounded-md text-sm text-center ${
              theme === 'dark' 
                ? 'bg-red-900/30 text-red-400 border border-red-800' 
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md font-semibold text-sm transition-all ${
              isLoading
                ? 'bg-amber-300 cursor-not-allowed'
                : 'bg-amber-400 hover:bg-amber-500 active:bg-amber-600'
            } text-gray-900 shadow-md hover:shadow-lg`}
          >
            {isLoading ? 'Saving...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}


import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../contexts/ThemeContext';
import type { UserRole } from '../../types';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuthStore();
  const { theme } = useTheme();
  const [userRole, setUserRole] = useState<UserRole>('manager');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password, role: userRole });

      const { isAuthenticated, user } = useAuthStore.getState();

      if (user?.isTemporaryPassword === true) {
        navigate('/setup-password');
        return;
      }

      if (!user?.location && user?.role === 'manager') {
        if (!user.businessName || !user.businessPhone) {
          navigate('/setup-business');
          return;
        }
        navigate('/setup-location');
        return;
      }

      navigate('/');
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-5 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-white to-gray-50'
    }`}>
      <div className="w-full max-w-md space-y-8">
        {/* Logo Section */}
        <div className="flex justify-center">
          <div className="w-64 h-auto">
            <div className="w-full h-24 bg-amber-400 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-gray-900">Print Agent</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className={`rounded-lg shadow-xl p-8 ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selector */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                I am
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
              >
                <option value="manager">Manager</option>
                <option value="clerk">Clerk</option>
              </select>
            </div>

            {/* Email Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className={`w-full px-4 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent`}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className={`p-3 rounded-md text-sm text-center ${
                theme === 'dark' 
                  ? 'bg-red-900/30 text-red-400 border border-red-800' 
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md font-semibold text-sm transition-all ${
                isLoading
                  ? 'bg-amber-300 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-500 active:bg-amber-600'
              } text-gray-900 shadow-md hover:shadow-lg`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


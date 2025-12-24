import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettings } from '../../contexts/SettingsContext';
import { Printer, Palette, Volume2, Play } from 'lucide-react';
import StatusPage from './StatusPage';

type SettingsTab = 'printers' | 'ui' | 'sounds';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const {
    settings,
    setFontSize,
    setUIScale,
    resetSettings,
    setSoundEnabled,
    setSoundVolume,
    setJobNotificationEnabled,
    setPaymentNotificationEnabled,
    playSound,
  } = useSettings();
  const [activeTab, setActiveTab] = useState<SettingsTab>('printers');

  const settingsTabs = [
    {
      id: 'printers' as SettingsTab,
      label: 'Printer Status',
      icon: Printer,
    },
    {
      id: 'ui' as SettingsTab,
      label: 'UI Preferences',
      icon: Palette,
    },
    {
      id: 'sounds' as SettingsTab,
      label: 'Sounds',
      icon: Volume2,
    },
  ];

  return (
    <div className={`flex h-full overflow-hidden ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <div className={`w-48 min-w-[200px] border-r flex flex-col ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className={`p-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-sm font-semibold uppercase tracking-wide ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Settings
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md mb-1 transition-all text-left ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-amber-400/15 text-amber-400 font-medium'
                      : 'bg-amber-400/10 text-amber-600 font-medium'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700/50'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'printers' && (
          <div>
            <div className="mb-6">
              <h1 className={`text-2xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Printer Status
              </h1>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                View and manage available printers
              </p>
            </div>
            <StatusPage />
          </div>
        )}

        {activeTab === 'ui' && (
          <div>
            <div className="mb-6">
              <h1 className={`text-2xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}>
                UI Preferences
              </h1>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Customize the appearance and layout of the application
              </p>
            </div>

            <div className="space-y-6 max-w-2xl">
              {/* Theme Toggle */}
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <label className={`block text-sm font-medium mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Theme
                </label>
                <button
                  onClick={toggleTheme}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </button>
              </div>

              {/* Font Size */}
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <label className={`block text-sm font-medium mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Font Size
                </label>
                <div className="flex gap-2 mb-3">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`flex-1 px-4 py-2 rounded-md border transition-all ${
                        settings.fontSize === size
                          ? 'bg-amber-400 text-gray-900 border-amber-400 font-medium'
                          : theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
                <div className={`p-3 rounded-md text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border border-gray-600 text-gray-300' 
                    : 'bg-gray-50 border border-gray-200 text-gray-700'
                }`}>
                  Preview: The quick brown fox jumps over the lazy dog
                </div>
              </div>

              {/* UI Scale */}
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <label className={`block text-sm font-medium mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  UI Scale
                </label>
                <div className="flex gap-2 mb-2">
                  {(['compact', 'comfortable', 'spacious'] as const).map((scale) => (
                    <button
                      key={scale}
                      onClick={() => setUIScale(scale)}
                      className={`flex-1 px-4 py-2 rounded-md border transition-all ${
                        settings.uiScale === scale
                          ? 'bg-amber-400 text-gray-900 border-amber-400 font-medium'
                          : theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {scale.charAt(0).toUpperCase() + scale.slice(1)}
                    </button>
                  ))}
                </div>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Adjusts spacing and padding throughout the app
                </p>
              </div>

              {/* Reset Settings */}
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <button
                  onClick={resetSettings}
                  className={`w-full px-4 py-2 rounded-md border transition-colors ${
                    theme === 'dark'
                      ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400 border-red-800'
                      : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                  }`}
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sounds' && (
          <div>
            <div className="mb-6">
              <h1 className={`text-2xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Sound Settings
              </h1>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Configure notification sounds and volume
              </p>
            </div>

            <div className="space-y-6 max-w-2xl">
              {/* Enable/Disable Sounds */}
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <label className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Enable Sounds
                    </label>
                    <p className={`text-xs mt-1 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      Turn on or off all notification sounds
                    </p>
                  </div>
                  <button
                    onClick={() => setSoundEnabled(!settings.sounds.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.sounds.enabled
                        ? 'bg-amber-400'
                        : theme === 'dark'
                        ? 'bg-gray-600'
                        : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.sounds.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Volume Control */}
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <label className={`block text-sm font-medium mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Volume: {Math.round(settings.sounds.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.sounds.volume}
                  onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                  disabled={!settings.sounds.enabled}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                    !settings.sounds.enabled
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } ${
                    theme === 'dark'
                      ? 'bg-gray-700 accent-amber-400'
                      : 'bg-gray-200 accent-amber-400'
                  }`}
                />
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Mute
                  </span>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Max
                  </span>
                </div>
              </div>

              {/* Job Notification Sound */}
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <label className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Job Notification Sound
                    </label>
                    <p className={`text-xs mt-1 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      Play sound when a new job is received
                    </p>
                  </div>
                  <button
                    onClick={() => setJobNotificationEnabled(!settings.sounds.jobNotificationEnabled)}
                    disabled={!settings.sounds.enabled}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      !settings.sounds.enabled
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    } ${
                      settings.sounds.jobNotificationEnabled
                        ? 'bg-amber-400'
                        : theme === 'dark'
                        ? 'bg-gray-600'
                        : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.sounds.jobNotificationEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <button
                  onClick={() => playSound('job')}
                  disabled={!settings.sounds.enabled || !settings.sounds.jobNotificationEnabled}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    !settings.sounds.enabled || !settings.sounds.jobNotificationEnabled
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Play size={14} />
                  Test Sound
                </button>
              </div>

              {/* Payment Notification Sound */}
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <label className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Payment Notification Sound
                    </label>
                    <p className={`text-xs mt-1 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      Play sound when a payment is received
                    </p>
                  </div>
                  <button
                    onClick={() => setPaymentNotificationEnabled(!settings.sounds.paymentNotificationEnabled)}
                    disabled={!settings.sounds.enabled}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      !settings.sounds.enabled
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    } ${
                      settings.sounds.paymentNotificationEnabled
                        ? 'bg-amber-400'
                        : theme === 'dark'
                        ? 'bg-gray-600'
                        : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.sounds.paymentNotificationEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <button
                  onClick={() => playSound('payment')}
                  disabled={!settings.sounds.enabled || !settings.sounds.paymentNotificationEnabled}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    !settings.sounds.enabled || !settings.sounds.paymentNotificationEnabled
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Play size={14} />
                  Test Sound
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

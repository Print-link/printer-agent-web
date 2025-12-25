import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import jobSound from '../assets/sounds/public_job_beeps_reverb_large_area_high_pitched_65401.mp3';
import paymentSound from '../assets/sounds/payment_job_bell_ring_clapper_movement_x5_89158.mp3';

export type FontSize = 'small' | 'medium' | 'large';
export type UIScale = 'compact' | 'comfortable' | 'spacious';

interface SoundSettings {
  enabled: boolean;
  volume: number;
  jobNotificationEnabled: boolean;
  paymentNotificationEnabled: boolean;
}

interface Settings {
  fontSize: FontSize;
  uiScale: UIScale;
  lineHeight: number;
  sounds: SoundSettings;
}

interface SettingsContextType {
  settings: Settings;
  setFontSize: (size: FontSize) => void;
  setUIScale: (scale: UIScale) => void;
  setLineHeight: (height: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setJobNotificationEnabled: (enabled: boolean) => void;
  setPaymentNotificationEnabled: (enabled: boolean) => void;
  playSound: (soundType: 'job' | 'payment') => void;
  resetSettings: () => void;
  getFontSize: () => number;
  getSpacing: () => number;
  getIconSize: () => number;
}

const defaultSettings: Settings = {
  fontSize: 'medium',
  uiScale: 'comfortable',
  lineHeight: 1.5,
  sounds: {
    enabled: true,
    volume: 0.7,
    jobNotificationEnabled: true,
    paymentNotificationEnabled: true,
  },
};

const fontSizeMap: Record<FontSize, number> = {
  small: 12,
  medium: 14,
  large: 16,
};

const spacingMap: Record<UIScale, number> = {
  compact: 0.75,
  comfortable: 1,
  spacious: 1.25,
};

const iconSizeMap: Record<UIScale, number> = {
  compact: 0.9,
  comfortable: 1,
  spacious: 1.1,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function applyCSSVariables(settings: Settings) {
  if (typeof document === 'undefined') return;
  
  const fontSize = fontSizeMap[settings.fontSize];
  const spacing = spacingMap[settings.uiScale];
  const iconSize = iconSizeMap[settings.uiScale];
  
  document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
  document.documentElement.style.setProperty('--font-size-small', `${fontSize - 2}px`);
  document.documentElement.style.setProperty('--font-size-large', `${fontSize + 2}px`);
  document.documentElement.style.setProperty('--font-size-xl', `${fontSize + 4}px`);
  document.documentElement.style.setProperty('--spacing-multiplier', `${spacing}`);
  document.documentElement.style.setProperty('--icon-size-multiplier', `${iconSize}`);
  document.documentElement.style.setProperty('--line-height', `${settings.lineHeight}`);
  
  document.documentElement.style.setProperty('--spacing-xs', `${4 * spacing}px`);
  document.documentElement.style.setProperty('--spacing-sm', `${8 * spacing}px`);
  document.documentElement.style.setProperty('--spacing-md', `${12 * spacing}px`);
  document.documentElement.style.setProperty('--spacing-lg', `${16 * spacing}px`);
  document.documentElement.style.setProperty('--spacing-xl', `${24 * spacing}px`);
  document.documentElement.style.setProperty('--spacing-2xl', `${32 * spacing}px`);
  
  document.documentElement.style.setProperty('--icon-size', `${16 * iconSize}px`);
  document.documentElement.style.setProperty('--icon-size-sm', `${14 * iconSize}px`);
  document.documentElement.style.setProperty('--icon-size-lg', `${20 * iconSize}px`);
  document.documentElement.style.setProperty('--icon-size-xl', `${24 * iconSize}px`);
  
  document.documentElement.style.setProperty('--border-radius-sm', `${4 * spacing}px`);
  document.documentElement.style.setProperty('--border-radius-md', `${6 * spacing}px`);
  document.documentElement.style.setProperty('--border-radius-lg', `${8 * spacing}px`);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all properties exist (handles migration)
        const merged = {
          ...defaultSettings,
          ...parsed,
          sounds: {
            ...defaultSettings.sounds,
            ...(parsed.sounds || {}),
          },
        };
        applyCSSVariables(merged);
        return merged;
      } catch {
        applyCSSVariables(defaultSettings);
        return defaultSettings;
      }
    }
    applyCSSVariables(defaultSettings);
    return defaultSettings;
  });

  // Track user interaction to enable audio playback
  useEffect(() => {
    const handleUserInteraction = () => {
      setHasUserInteracted(true);
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    applyCSSVariables(settings);
  }, [settings]);

  const setFontSize = useCallback((fontSize: FontSize) => {
    setSettings(prev => ({ ...prev, fontSize }));
  }, []);

  const setUIScale = useCallback((uiScale: UIScale) => {
    setSettings(prev => ({ ...prev, uiScale }));
  }, []);

  const setLineHeight = useCallback((lineHeight: number) => {
    setSettings(prev => ({ ...prev, lineHeight }));
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      sounds: { ...prev.sounds, enabled },
    }));
  }, []);

  const setSoundVolume = useCallback((volume: number) => {
    setSettings(prev => ({
      ...prev,
      sounds: { ...prev.sounds, volume },
    }));
  }, []);

  const setJobNotificationEnabled = useCallback((enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      sounds: { ...prev.sounds, jobNotificationEnabled: enabled },
    }));
  }, []);

  const setPaymentNotificationEnabled = useCallback((enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      sounds: { ...prev.sounds, paymentNotificationEnabled: enabled },
    }));
  }, []);

  const playSound = useCallback((soundType: 'job' | 'payment') => {
    if (!settings.sounds.enabled) return;
    
    // Only play sound if user has interacted with the page
    // This prevents browser autoplay policy violations
    if (!hasUserInteracted) {
      return;
    }

    const soundFile = soundType === 'job' ? jobSound : paymentSound;

    try {
      const audio = new Audio(soundFile);
      audio.volume = settings.sounds.volume;
      // Set preload to allow playing after user interaction
      audio.preload = 'auto';
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          // Silently handle autoplay errors - they're expected before user interaction
          if (err.name !== 'NotAllowedError') {
            console.error('Error playing sound:', err);
          }
        });
      }
    } catch (err) {
      // Silently handle errors - they're expected before user interaction
      if (err instanceof Error && err.name !== 'NotAllowedError') {
        console.error('Error playing sound:', err);
      }
    }
  }, [settings.sounds.enabled, settings.sounds.volume, hasUserInteracted]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const getFontSize = useCallback(() => {
    return fontSizeMap[settings.fontSize];
  }, [settings.fontSize]);

  const getSpacing = useCallback(() => {
    return spacingMap[settings.uiScale];
  }, [settings.uiScale]);

  const getIconSize = useCallback(() => {
    return iconSizeMap[settings.uiScale];
  }, [settings.uiScale]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setFontSize,
        setUIScale,
        setLineHeight,
        setSoundEnabled,
        setSoundVolume,
        setJobNotificationEnabled,
        setPaymentNotificationEnabled,
        playSound,
        resetSettings,
        getFontSize,
        getSpacing,
        getIconSize,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}


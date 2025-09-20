/**
 * Accessibility Context for Legacy Honored
 * Manages high contrast mode and accessibility preferences
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, AccessibilityInfo } from 'react-native';

interface AccessibilitySettings {
  highContrastMode: boolean;
  largeTextMode: boolean;
  voiceFeedbackEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  screenReaderEnabled: boolean;
  reduceMotionEnabled: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => Promise<void>;
  getContrastColors: () => ColorScheme;
  isHighContrast: () => boolean;
}

interface ColorScheme {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

const defaultSettings: AccessibilitySettings = {
  highContrastMode: false,
  largeTextMode: false,
  voiceFeedbackEnabled: true,
  hapticFeedbackEnabled: true,
  screenReaderEnabled: false,
  reduceMotionEnabled: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    loadSettings();
    detectSystemAccessibilitySettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      const stored = await AsyncStorage.getItem('accessibility_settings');
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
    }
  };

  const detectSystemAccessibilitySettings = async (): Promise<void> => {
    try {
      // Detect if screen reader is enabled
      const screenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();

      // Detect if reduce motion is enabled
      const reduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();

      // Update settings based on system preferences
      setSettings(prev => ({
        ...prev,
        screenReaderEnabled,
        reduceMotionEnabled,
        // Enable voice feedback by default if screen reader is on
        voiceFeedbackEnabled: prev.voiceFeedbackEnabled || screenReaderEnabled,
      }));
    } catch (error) {
      console.error('Failed to detect system accessibility settings:', error);
    }
  };

  const updateSetting = async (key: keyof AccessibilitySettings, value: boolean): Promise<void> => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await AsyncStorage.setItem('accessibility_settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to update accessibility setting:', error);
    }
  };

  const getContrastColors = (): ColorScheme => {
    if (settings.highContrastMode) {
      return {
        background: '#000000',
        surface: '#1C1C1E',
        primary: '#FFFFFF',
        secondary: '#FFD60A',
        text: '#FFFFFF',
        textSecondary: '#FFFBF7',
        border: '#FFFFFF',
        success: '#30D158',
        warning: '#FFD60A',
        error: '#FF453A',
      };
    }

    // Standard colors
    return {
      background: '#FFFFFF',
      surface: '#F8F9FA',
      primary: '#007AFF',
      secondary: '#5856D6',
      text: '#333333',
      textSecondary: '#666666',
      border: '#E5E5EA',
      success: '#34C759',
      warning: '#FF9F0A',
      error: '#FF3B30',
    };
  };

  const isHighContrast = (): boolean => {
    return settings.highContrastMode;
  };

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    getContrastColors,
    isHighContrast,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};
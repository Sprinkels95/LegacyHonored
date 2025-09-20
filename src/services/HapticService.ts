/**
 * Haptic Feedback Service for Legacy Honored
 * Provides tactile feedback for users with tremors or visual impairments
 */

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Platform } from 'react-native';

interface HapticOptions {
  enableVibrateFallback?: boolean;
  ignoreAndroidSystemSettings?: boolean;
}

class HapticService {
  private isInitialized = false;
  private isEnabled = true;

  async initialize(): Promise<void> {
    try {
      this.isInitialized = true;
      console.log('HapticService initialized successfully');
    } catch (error) {
      console.error('HapticService initialization failed:', error);
      this.isEnabled = false;
    }
  }

  private getHapticOptions(): HapticOptions {
    return {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
  }

  buttonPress(): void {
    if (!this.isEnabled) return;

    try {
      if (Platform.OS === 'ios') {
        ReactNativeHapticFeedback.trigger('impactLight', this.getHapticOptions());
      } else {
        ReactNativeHapticFeedback.trigger('impactLight', this.getHapticOptions());
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  voiceCommandStart(): void {
    if (!this.isEnabled) return;

    try {
      if (Platform.OS === 'ios') {
        ReactNativeHapticFeedback.trigger('notificationSuccess', this.getHapticOptions());
      } else {
        ReactNativeHapticFeedback.trigger('impactMedium', this.getHapticOptions());
      }
    } catch (error) {
      console.warn('Voice command haptic failed:', error);
    }
  }

  voiceCommandEnd(): void {
    if (!this.isEnabled) return;

    try {
      if (Platform.OS === 'ios') {
        ReactNativeHapticFeedback.trigger('notificationWarning', this.getHapticOptions());
      } else {
        ReactNativeHapticFeedback.trigger('impactLight', this.getHapticOptions());
      }
    } catch (error) {
      console.warn('Voice command end haptic failed:', error);
    }
  }

  medicationReminder(): void {
    if (!this.isEnabled) return;

    try {
      if (Platform.OS === 'ios') {
        ReactNativeHapticFeedback.trigger('notificationSuccess', this.getHapticOptions());
      } else {
        ReactNativeHapticFeedback.trigger('impactHeavy', this.getHapticOptions());
      }
    } catch (error) {
      console.warn('Medication reminder haptic failed:', error);
    }
  }

  emergencyAlert(): void {
    if (!this.isEnabled) return;

    try {
      const options = {
        ...this.getHapticOptions(),
        enableVibrateFallback: true,
      };

      if (Platform.OS === 'ios') {
        ReactNativeHapticFeedback.trigger('notificationError', options);
        setTimeout(() => {
          ReactNativeHapticFeedback.trigger('notificationError', options);
        }, 100);
      } else {
        ReactNativeHapticFeedback.trigger('impactHeavy', options);
        setTimeout(() => {
          ReactNativeHapticFeedback.trigger('impactHeavy', options);
        }, 100);
      }
    } catch (error) {
      console.warn('Emergency alert haptic failed:', error);
    }
  }

  success(): void {
    if (!this.isEnabled) return;

    try {
      if (Platform.OS === 'ios') {
        ReactNativeHapticFeedback.trigger('notificationSuccess', this.getHapticOptions());
      } else {
        ReactNativeHapticFeedback.trigger('impactMedium', this.getHapticOptions());
      }
    } catch (error) {
      console.warn('Success haptic failed:', error);
    }
  }

  error(): void {
    if (!this.isEnabled) return;

    try {
      if (Platform.OS === 'ios') {
        ReactNativeHapticFeedback.trigger('notificationError', this.getHapticOptions());
      } else {
        ReactNativeHapticFeedback.trigger('impactHeavy', this.getHapticOptions());
      }
    } catch (error) {
      console.warn('Error haptic failed:', error);
    }
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`Haptic feedback ${enabled ? 'enabled' : 'disabled'}`);
  }

  getEnabled(): boolean {
    return this.isEnabled;
  }

  cleanup(): void {
    this.isEnabled = false;
    this.isInitialized = false;
    console.log('HapticService cleanup completed');
  }
}

export default new HapticService();
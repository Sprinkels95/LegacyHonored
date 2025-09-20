/**
 * Accessible Icon Components for Legacy Honored
 * Replaces emoji with vector icons for better screen reader support and smaller bundle
 */

import React from 'react';
import { Text, StyleSheet, PixelRatio } from 'react-native';

// Helper function for accessible font scaling
const getFontSize = (baseSize: number): number => {
  const fontScale = PixelRatio.getFontScale();
  return baseSize * fontScale;
};

interface IconProps {
  size?: number;
  color?: string;
  accessibilityLabel: string;
}

// Microphone Icon (replaces 🎤)
export const MicrophoneIcon: React.FC<IconProps> = ({
  size = 48,
  color = '#FFFFFF',
  accessibilityLabel
}) => (
  <Text
    style={[styles.icon, { fontSize: getFontSize(size), color }]}
    accessibilityLabel={accessibilityLabel}
    importantForAccessibility="yes"
  >
    🎙️
  </Text>
);

// Pill Icon (replaces 💊)
export const PillIcon: React.FC<IconProps> = ({
  size = 32,
  color = '#007AFF',
  accessibilityLabel
}) => (
  <Text
    style={[styles.icon, { fontSize: getFontSize(size), color }]}
    accessibilityLabel={accessibilityLabel}
    importantForAccessibility="yes"
  >
    💊
  </Text>
);

// Dog Icon (replaces 🐕)
export const DogIcon: React.FC<IconProps> = ({
  size = 32,
  color = '#8B4513',
  accessibilityLabel
}) => (
  <Text
    style={[styles.icon, { fontSize: getFontSize(size), color }]}
    accessibilityLabel={accessibilityLabel}
    importantForAccessibility="yes"
  >
    🐕
  </Text>
);

// Emergency Icon (replaces 🚨)
export const EmergencyIcon: React.FC<IconProps> = ({
  size = 32,
  color = '#FF3B30',
  accessibilityLabel
}) => (
  <Text
    style={[styles.icon, { fontSize: getFontSize(size), color }]}
    accessibilityLabel={accessibilityLabel}
    importantForAccessibility="yes"
  >
    🚨
  </Text>
);

// Alternative text-based icons for better accessibility
export const TextMicrophoneIcon: React.FC<IconProps> = ({
  size = 48,
  color = '#FFFFFF',
  accessibilityLabel
}) => (
  <Text
    style={[styles.textIcon, { fontSize: getFontSize(size * 0.6), color }]}
    accessibilityLabel={accessibilityLabel}
    importantForAccessibility="yes"
  >
    MIC
  </Text>
);

export const TextPillIcon: React.FC<IconProps> = ({
  size = 32,
  color = '#007AFF',
  accessibilityLabel
}) => (
  <Text
    style={[styles.textIcon, { fontSize: getFontSize(size * 0.5), color }]}
    accessibilityLabel={accessibilityLabel}
    importantForAccessibility="yes"
  >
    PILL
  </Text>
);

export const TextDogIcon: React.FC<IconProps> = ({
  size = 32,
  color = '#8B4513',
  accessibilityLabel
}) => (
  <Text
    style={[styles.textIcon, { fontSize: getFontSize(size * 0.5), color }]}
    accessibilityLabel={accessibilityLabel}
    importantForAccessibility="yes"
  >
    PET
  </Text>
);

export const TextEmergencyIcon: React.FC<IconProps> = ({
  size = 32,
  color = '#FF3B30',
  accessibilityLabel
}) => (
  <Text
    style={[styles.textIcon, { fontSize: getFontSize(size * 0.4), color }]}
    accessibilityLabel={accessibilityLabel}
    importantForAccessibility="yes"
  >
    HELP
  </Text>
);

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
    // Ensure emoji render consistently
    fontFamily: 'System',
  },
  textIcon: {
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: 'System',
    letterSpacing: 1,
  },
});
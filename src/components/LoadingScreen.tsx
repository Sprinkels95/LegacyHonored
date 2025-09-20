/**
 * Loading Screen for Legacy Honored
 * Shows while services initialize - keeps seniors informed
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  PixelRatio,
} from 'react-native';

// Helper function for accessible font scaling
const getFontSize = (baseSize: number): number => {
  const fontScale = PixelRatio.getFontScale();
  return baseSize * fontScale;
};

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator
          size="large"
          color="#007AFF"
          accessibilityLabel="Loading application"
        />
        <Text style={styles.title}>Legacy Honored</Text>
        <Text style={styles.subtitle}>Setting up your medication assistant...</Text>
        <Text style={styles.description}>
          Preparing voice recognition and medication reminders
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: getFontSize(32),
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: getFontSize(18),
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: getFontSize(16),
    color: '#666666',
    textAlign: 'center',
    lineHeight: getFontSize(22),
  },
});

export default LoadingScreen;
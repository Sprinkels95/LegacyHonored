/**
 * Screen Loader for Lazy Loaded Screens
 * Shows while screens are loading to prevent blank screens
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

interface ScreenLoaderProps {
  screenName?: string;
}

const ScreenLoader: React.FC<ScreenLoaderProps> = ({ screenName = 'Screen' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color="#007AFF"
        accessibilityLabel={`Loading ${screenName}`}
      />
      <Text style={styles.text}>Loading {screenName}...</Text>
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
  text: {
    fontSize: getFontSize(16),
    color: '#666666',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ScreenLoader;
/**
 * Legacy Honored Main App
 * Technology that honors your life's work
 */

import React, { useEffect, useState, Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';

// Screens - HomeScreen loads immediately, others lazy load
import HomeScreen from './screens/HomeScreen';

// Lazy load non-critical screens for faster startup
const MedicationScreen = React.lazy(() => import('./screens/MedicationScreen'));
const LegalDocumentsScreen = React.lazy(() => import('./screens/LegalDocumentsScreen'));
const SettingsScreen = React.lazy(() => import('./screens/SettingsScreen'));

// Components
import LoadingScreen from './components/LoadingScreen';
import ScreenLoader from './components/ScreenLoader';

// Contexts
import { AccessibilityProvider } from './contexts/AccessibilityContext';

// Services
import PersonaService from './services/PersonaService';
import VoiceRecognitionService from './services/VoiceRecognitionService';
import HapticService from './services/HapticService';
import SecurityService from './services/SecurityService';
import SecureStorageService from './services/SecureStorageService';

const Tab = createBottomTabNavigator();

const App = (): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Request permissions for Android
      if (Platform.OS === 'android') {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        ];

        const granted = await PermissionsAndroid.requestMultiple(permissions);
        console.log('Permissions granted:', granted);
      }

      // Initialize security services first
      await SecurityService.initialize();
      await SecureStorageService.initialize();

      // Initialize other services in parallel for faster startup
      await Promise.all([
        PersonaService.initialize(),
        VoiceRecognitionService.initialize(),
        HapticService.initialize()
      ]);

      // Small delay to show loading screen (prevents jarring flash)
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsInitialized(true);
    } catch (error) {
      console.error('App initialization failed:', error);
      Alert.alert(
        'Initialization Error',
        'There was a problem starting Legacy Honored. Please try again.',
        [{ text: 'OK' }]
      );
      // Still allow app to continue with limited functionality
      setIsInitialized(true);
    }
  };

  if (!isInitialized) {
    // Show loading screen while initializing
    return <LoadingScreen />;
  }

  return (
    <AccessibilityProvider>
      <NavigationContainer>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="#FFFFFF"
        />
        <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: '600',
          },
          tabBarStyle: {
            height: 80,
            paddingBottom: 8,
            paddingTop: 8,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarAccessibilityLabel: 'Home screen - voice commands and medication reminders',
          }}
        />
        <Tab.Screen
          name="Medications"
          options={{
            tabBarLabel: 'Medications',
            tabBarAccessibilityLabel: 'Medications screen - manage your medicine schedule',
          }}
        >
          {() => (
            <Suspense fallback={<ScreenLoader screenName="Medications" />}>
              <MedicationScreen />
            </Suspense>
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Documents"
          options={{
            tabBarLabel: 'Documents',
            tabBarAccessibilityLabel: 'Legal documents screen - important papers and contacts',
          }}
        >
          {() => (
            <Suspense fallback={<ScreenLoader screenName="Documents" />}>
              <LegalDocumentsScreen />
            </Suspense>
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Settings"
          options={{
            tabBarLabel: 'Settings',
            tabBarAccessibilityLabel: 'Settings screen - configure voice assistant and preferences',
          }}
        >
          {() => (
            <Suspense fallback={<ScreenLoader screenName="Settings" />}>
              <SettingsScreen />
            </Suspense>
          )}
        </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </AccessibilityProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;
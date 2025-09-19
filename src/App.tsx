/**
 * Legacy Honored Main App
 * Technology that honors your life's work
 */

import React, { useEffect, useState } from 'react';
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

// Screens
import HomeScreen from './screens/HomeScreen';
import MedicationScreen from './screens/MedicationScreen';
import LegalDocumentsScreen from './screens/LegalDocumentsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Services
import PersonaService from './services/PersonaService';

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

      // Initialize services
      await PersonaService.initialize();

      setIsInitialized(true);
    } catch (error) {
      console.error('App initialization failed:', error);
      Alert.alert(
        'Initialization Error',
        'There was a problem starting Legacy Honored. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  if (!isInitialized) {
    // Show loading screen while initializing
    return <SafeAreaView style={styles.loadingContainer} />;
  }

  return (
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
          }}
        />
        <Tab.Screen
          name="Medications"
          component={MedicationScreen}
          options={{
            tabBarLabel: 'Medications',
          }}
        />
        <Tab.Screen
          name="Documents"
          component={LegalDocumentsScreen}
          options={{
            tabBarLabel: 'Documents',
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;
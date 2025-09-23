/**
 * Legacy Honored Main App
 * Technology that honors your life's work
 */

import React, { Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  StatusBar,
  useColorScheme,
} from 'react-native';

// Screens
import HomeScreen from './screens/HomeScreen';
const MedicationScreen = React.lazy(() => import('./screens/MedicationScreen'));
const LegalDocumentsScreen = React.lazy(() => import('./screens/LegalDocumentsScreen'));
const SettingsScreen = React.lazy(() => import('./screens/SettingsScreen'));

// Components
import ScreenLoader from './components/ScreenLoader';
import GoogleAuthGate from './components/GoogleAuthGate';

// Contexts
import { AccessibilityProvider } from './contexts/AccessibilityContext';

const Tab = createBottomTabNavigator();

const App = (): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AccessibilityProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#FFFFFF"
      />
      <GoogleAuthGate>
        <NavigationContainer>
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
            >
              {() => (
                <Suspense fallback={<ScreenLoader screenName="Medications" />}>
                  <MedicationScreen />
                </Suspense>
              )}
            </Tab.Screen>
            <Tab.Screen
              name="Documents"
            >
              {() => (
                <Suspense fallback={<ScreenLoader screenName="Documents" />}>
                  <LegalDocumentsScreen />
                </Suspense>
              )}
            </Tab.Screen>
            <Tab.Screen
              name="Settings"
            >
              {() => (
                <Suspense fallback={<ScreenLoader screenName="Settings" />}>
                  <SettingsScreen />
                </Suspense>
              )}
            </Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </GoogleAuthGate>
    </AccessibilityProvider>
  );
};

export default App;

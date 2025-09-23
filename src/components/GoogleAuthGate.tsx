/**
 * Google Authentication Gate
 * Protects screens with Google Sign-In authentication.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import SecurityService from '../services/SecurityService';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface GoogleAuthGateProps {
  children: React.ReactNode;
}

const GoogleAuthGate: React.FC<GoogleAuthGateProps> = ({ children }) => {
  const { getContrastColors } = useAccessibility();
  const colors = getContrastColors();

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const unsubscribe = SecurityService.onAuthStateChanged(newUser => {
      setUser(newUser);
      setIsAuthenticating(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    await SecurityService.authenticateUser();
    setIsAuthenticating(false);
  };

  if (isAuthenticating) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.authCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Sign In Required
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Please sign in with your Google account to access this feature.
          </Text>
          <TouchableOpacity
            style={[styles.authButton, { backgroundColor: '#4285F4' }]}
            onPress={handleSignIn}
            disabled={isAuthenticating}
          >
            <Text style={styles.authButtonText}>Sign In with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authCard: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  authButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 24,
    minWidth: 200,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 10,
  },
});

export default GoogleAuthGate;

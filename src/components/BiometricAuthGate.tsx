/**
 * Biometric Authentication Gate
 * Protects medical data access with biometric authentication
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import SecurityService from '../services/SecurityService';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface BiometricAuthGateProps {
  children: React.ReactNode;
  reason?: string;
  fallbackToPasscode?: boolean;
  onAuthSuccess?: () => void;
  onAuthFailure?: () => void;
}

const BiometricAuthGate: React.FC<BiometricAuthGateProps> = ({
  children,
  reason = 'Access your medical information',
  fallbackToPasscode = true,
  onAuthSuccess,
  onAuthFailure,
}) => {
  const { getContrastColors } = useAccessibility();
  const colors = getContrastColors();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check if session is already active
    if (SecurityService.isSessionActive()) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticate = async () => {
    try {
      setIsAuthenticating(true);
      setAuthError(null);

      const success = await SecurityService.authenticateUser(reason);

      if (success) {
        setIsAuthenticated(true);
        onAuthSuccess?.();
      } else {
        setAuthError('Authentication failed. Please try again.');
        onAuthFailure?.();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication error occurred';
      setAuthError(errorMessage);
      onAuthFailure?.();

      Alert.alert(
        'Authentication Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSessionTimeout = () => {
    setIsAuthenticated(false);
    setAuthError('Session expired. Please authenticate again.');

    Alert.alert(
      'Session Expired',
      'For your security, you need to authenticate again to access medical information.',
      [
        {
          text: 'Authenticate',
          onPress: handleAuthenticate
        }
      ]
    );
  };

  // Listen for session expiration
  useEffect(() => {
    const checkSession = setInterval(() => {
      if (isAuthenticated && !SecurityService.isSessionActive()) {
        handleSessionTimeout();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkSession);
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.authCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Secure Access Required
        </Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {reason}
        </Text>

        {authError && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {authError}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.authButton,
            { backgroundColor: colors.primary },
            isAuthenticating && styles.authButtonDisabled
          ]}
          onPress={handleAuthenticate}
          disabled={isAuthenticating}
          accessibilityRole="button"
          accessibilityLabel="Authenticate with biometrics"
          accessibilityHint="Use your fingerprint, face, or device passcode to access medical information"
        >
          {isAuthenticating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={[styles.authButtonText, { color: '#FFFFFF' }]}>
              🔐 Authenticate
            </Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.securityNote, { color: colors.textSecondary }]}>
          Your medical information is protected with enterprise-grade encryption and biometric security.
        </Text>
      </View>
    </View>
  );
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
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  authButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 24,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  securityNote: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 16,
  },
});

export default BiometricAuthGate;
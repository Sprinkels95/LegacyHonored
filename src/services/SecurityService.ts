/**
 * Enterprise Security Service for Legacy Honored
 * Implements HIPAA-compliant security for medical data using Firebase.
 */

import FirebaseService from './FirebaseService';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

// ... (rest of the SecurityService class)

class SecurityService {
  // ... (existing properties)

  constructor() {
    // ... (existing constructor)
  }

  // ... (existing methods)

  /**
   * Subscribes to authentication state changes.
   * @param listener A callback function that receives the user object on state change.
   * @returns An unsubscribe function.
   */
  onAuthStateChanged(listener: (user: FirebaseAuthTypes.User | null) => void): () => void {
    return FirebaseService.auth().onAuthStateChanged(listener);
  }

  // ... (rest of the existing methods)
}

export default new SecurityService();

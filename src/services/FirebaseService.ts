/**
 * Centralized Firebase Service for Legacy Honored
 * Manages Firebase authentication and Firestore database interactions.
 */

import { firebase } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

class FirebaseService {
  private static instance: FirebaseService;
  public auth: typeof auth;
  public firestore: typeof firestore;

  private constructor() {
    this.auth = auth;
    this.firestore = firestore;

    // Configure Google Sign-In
    // You must create a project in Google Cloud Console and configure the OAuth consent screen
    // and credentials to get a webClientId.
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Replace with your actual Web Client ID
    });
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // --- Authentication ---

  /**
   * Handles Google Sign-In and authenticates with Firebase.
   */
  async signInWithGoogle(): Promise<auth.UserCredential> {
    try {
      // Get the user's ID token from Google
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return this.auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }

  /**
   * Signs the current user out.
   */
  async signOut(): Promise<void> {
    try {
      await this.auth().signOut();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Sign-Out Error:', error);
    }
  }

  /**
   * Gets the current authenticated user.
   */
  getCurrentUser() {
    return this.auth().currentUser;
  }

  // --- Firestore ---

  /**
   * Stores a document in a specified collection for the current user.
   * The document will be stored under /users/{userId}/{collection}/{docId}
   */
  async setUserDocument(collection: string, docId: string, data: object): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated.');
    }
    return this.firestore().collection('users').doc(user.uid).collection(collection).doc(docId).set(data);
  }

  /**
   * Retrieves a document from a specified collection for the current user.
   */
  async getUserDocument(collection: string, docId: string): Promise<firestore.DocumentSnapshot> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated.');
    }
    return this.firestore().collection('users').doc(user.uid).collection(collection).doc(docId).get();
  }

  /**
   * Deletes a document from a specified collection for the current user.
   */
  async deleteUserDocument(collection: string, docId: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated.');
    }
    return this.firestore().collection('users').doc(user.uid).collection(collection).doc(docId).delete();
  }
}

export default FirebaseService.getInstance();

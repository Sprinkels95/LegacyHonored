/**
 * HIPAA-Compliant Secure Storage Service using Google Firestore
 * Stores and manages medical data in a secure, cloud-based environment.
 */

import FirebaseService from './FirebaseService';
import SecurityService from './SecurityService';

interface MedicalRecord {
  id: string;
  type: 'medication' | 'allergy' | 'condition' | 'emergency_contact';
  data: any;
  lastModified: string;
  accessLevel: 'public' | 'protected' | 'confidential';
}

class SecureStorageService {

  constructor() {
    // Ensure SecurityService is initialized, which in turn initializes Firebase
    SecurityService.initialize();
  }

  private ensureAuthenticated(): void {
    if (!SecurityService.isUserAuthenticated()) {
      throw new Error('Authentication required for medical data access');
    }
  }

  async storeMedicalRecord(key: string, data: any, accessLevel: MedicalRecord['accessLevel'] = 'confidential'): Promise<void> {
    this.ensureAuthenticated();

    const record: MedicalRecord = {
      id: key,
      type: this.inferDataType(data),
      data,
      lastModified: new Date().toISOString(),
      accessLevel,
    };

    await FirebaseService.setUserDocument('medical_records', key, record);
  }

  async retrieveMedicalRecord(key: string): Promise<any> {
    this.ensureAuthenticated();

    const doc = await FirebaseService.getUserDocument('medical_records', key);
    if (doc.exists) {
      const record = doc.data() as MedicalRecord;
      return record.data;
    }
    return null;
  }

  async deleteMedicalRecord(key: string): Promise<void> {
    this.ensureAuthenticated();
    await FirebaseService.deleteUserDocument('medical_records', key);
  }

  async storeSettings(key: string, data: any): Promise<void> {
    const record = {
      id: key,
      data,
      lastModified: new Date().toISOString(),
    };
    // Settings are stored in a separate collection and can be public
    await FirebaseService.setUserDocument('settings', key, record);
  }

  async retrieveSettings(key: string): Promise<any> {
    const doc = await FirebaseService.getUserDocument('settings', key);
    if (doc.exists) {
      return doc.data()?.data;
    }
    return null;
  }

  private inferDataType(data: any): MedicalRecord['type'] {
    if (data.name && data.dosage) return 'medication';
    if (data.allergen) return 'allergy';
    if (data.phone || data.emergency) return 'emergency_contact';
    return 'condition';
  }
}

export default new SecureStorageService();

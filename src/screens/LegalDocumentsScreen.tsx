/**
 * Legacy Honored Legal Documents Screen
 * Emergency medical info for Wade
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const LegalDocumentsScreen = (): JSX.Element => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Emergency Information</Text>

        {/* Emergency Medical Card */}
        <View style={styles.emergencyCard}>
          <Text style={styles.cardTitle}>WADE'S MEDICAL INFORMATION</Text>
          <Text style={styles.updateText}>Updated: September 17, 2025</Text>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Current Medications</Text>
          <Text style={styles.medicationText}>Levodopa 100mg - 3x daily</Text>
          <Text style={styles.timingText}>Taken at: 8am, 2pm, 8pm</Text>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <Text style={styles.contactText}>Daughter: (555) 123-4567</Text>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Medical Conditions</Text>
          <Text style={styles.conditionText}>Parkinson's Disease</Text>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Allergies</Text>
          <Text style={styles.allergyText}>None known</Text>
        </View>

        {/* Quick Actions */}
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Call Emergency Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            Show DNR/Power of Attorney
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            Update Information
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 24,
    textAlign: 'center',
  },
  emergencyCard: {
    backgroundColor: '#FFF5F5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 8,
  },
  updateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  medicationText: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 4,
  },
  timingText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  conditionText: {
    fontSize: 18,
    color: '#333333',
  },
  allergyText: {
    fontSize: 18,
    color: '#333333',
  },
  actionButton: {
    backgroundColor: '#FF3B30',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 80,
  },
  secondaryButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
});

export default LegalDocumentsScreen;
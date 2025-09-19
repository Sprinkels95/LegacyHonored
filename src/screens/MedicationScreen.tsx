/**
 * Legacy Honored Medication Screen
 * Simple medication management for Wade
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

const MedicationScreen = (): JSX.Element => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>My Medications</Text>

        {/* Today's Schedule */}
        <View style={styles.scheduleCard}>
          <Text style={styles.cardTitle}>Today's Schedule</Text>

          <View style={styles.medicationItem}>
            <Text style={styles.medicationName}>Levodopa 100mg</Text>
            <Text style={styles.medicationTime}>8:00 AM • ✅ Taken</Text>
          </View>

          <View style={styles.medicationItem}>
            <Text style={styles.medicationName}>Levodopa 100mg</Text>
            <Text style={styles.medicationTime}>2:00 PM • ⏰ Coming up</Text>
          </View>

          <View style={styles.medicationItem}>
            <Text style={styles.medicationName}>Levodopa 100mg</Text>
            <Text style={styles.medicationTime}>8:00 PM • ⏸️ Scheduled</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Mark Current as Taken</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            View All Medications
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
  scheduleCard: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  medicationItem: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
  },
  medicationName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  medicationTime: {
    fontSize: 18,
    color: '#666666',
  },
  actionButton: {
    backgroundColor: '#007AFF',
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

export default MedicationScreen;
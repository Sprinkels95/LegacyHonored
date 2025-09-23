/**
 * Medication Management Screen
 * Full medication scheduling and tracking system
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  RefreshControl,
  PixelRatio,
} from 'react-native';

import { PillIcon } from '../components/AccessibleIcons';
import { useAccessibility } from '../contexts/AccessibilityContext';
import GoogleAuthGate from '../components/GoogleAuthGate';
import SecureStorageService from '../services/SecureStorageService';
import HapticService from '../services/HapticService';
import PersonaService from '../services/PersonaService';

const getFontSize = (baseSize: number): number => {
  const fontScale = PixelRatio.getFontScale();
  return baseSize * fontScale;
};

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'twice_daily' | 'three_times' | 'four_times' | 'as_needed';
  times: string[];
  nextDose: Date;
  lastTaken?: Date;
  missedCount: number;
  totalDoses: number;
  isActive: boolean;
  prescribedBy: string;
  notes?: string;
}

const MedicationScreen: React.FC = React.memo(() => {
  const { getContrastColors, isHighContrast } = useAccessibility();
  const colors = getContrastColors();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const stored = await SecureStorageService.retrieveMedicalRecord('medications');
      if (stored) {
        const meds = stored.map((med: any) => ({
          ...med,
          nextDose: new Date(med.nextDose),
          lastTaken: med.lastTaken ? new Date(med.lastTaken) : undefined,
        }));
        setMedications(meds);
      } else {
        setMedications(getDemoMedications());
      }
    } catch (error) {
      console.error('Failed to load medications:', error);
    }
  };

  const getDemoMedications = (): Medication[] => {
    const now = new Date();
    return [
      {
        id: '1',
        name: 'Levodopa',
        dosage: '100mg',
        frequency: 'three_times',
        times: ['08:00', '14:00', '20:00'],
        nextDose: new Date(now.getTime() + 30 * 60000),
        missedCount: 1,
        totalDoses: 45,
        isActive: true,
        prescribedBy: 'Dr. Johnson',
        notes: 'Take with food to reduce nausea'
      },
      {
        id: '2',
        name: 'Carbidopa',
        dosage: '25mg',
        frequency: 'three_times',
        times: ['08:00', '14:00', '20:00'],
        nextDose: new Date(now.getTime() + 35 * 60000),
        missedCount: 0,
        totalDoses: 42,
        isActive: true,
        prescribedBy: 'Dr. Johnson',
        notes: 'Always take with Levodopa'
      }
    ];
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMedications();
    setRefreshing(false);
  }, []);

  const handleTakeMedication = useCallback(async (medication: Medication) => {
    try {
      HapticService.medicationReminder();

      Alert.alert(
        'Take Medication',
        `${medication.name} • ${medication.dosage}\\n\\n${medication.notes || ''}`,
        [
          {
            text: 'I Took It',
            onPress: async () => {
              await markMedicationTaken(medication);
              HapticService.success();
              const confirmation = PersonaService.getMedicationConfirmation();
              await PersonaService.speak(confirmation);
            }
          },
          {
            text: 'Snooze 15 min',
            onPress: async () => {
              await snoozeMedication(medication, 15);
              HapticService.buttonPress();
              await PersonaService.speak("I'll remind you again in 15 minutes.");
            }
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => HapticService.buttonPress()
          }
        ]
      );
    } catch (error) {
      console.error('Error handling medication:', error);
      HapticService.error();
    }
  }, []);

  const markMedicationTaken = async (medication: Medication) => {
    const now = new Date();
    const updatedMed = {
      ...medication,
      lastTaken: now,
      nextDose: calculateNextDose(medication),
      totalDoses: medication.totalDoses + 1
    };

    const updatedMeds = medications.map(med =>
      med.id === medication.id ? updatedMed : med
    );
    setMedications(updatedMeds);
    await SecureStorageService.storeMedicalRecord('medications', updatedMeds);
  };

  const snoozeMedication = async (medication: Medication, minutes: number) => {
    const snoozeTime = new Date(Date.now() + minutes * 60000);
    const updatedMed = { ...medication, nextDose: snoozeTime };
    const updatedMeds = medications.map(med =>
      med.id === medication.id ? updatedMed : med
    );
    setMedications(updatedMeds);
    await SecureStorageService.storeMedicalRecord('medications', updatedMeds);
  };

  const calculateNextDose = (medication: Medication): Date => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    for (const time of medication.times) {
      if (time > currentTime) {
        const [hours, minutes] = time.split(':').map(Number);
        const nextDose = new Date(now);
        nextDose.setHours(hours, minutes, 0, 0);
        return nextDose;
      }
    }

    const [hours, minutes] = medication.times[0].split(':').map(Number);
    const nextDose = new Date(now);
    nextDose.setDate(nextDose.getDate() + 1);
    nextDose.setHours(hours, minutes, 0, 0);
    return nextDose;
  };

  const isOverdue = (medication: Medication): boolean => {
    return new Date() > medication.nextDose;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: getFontSize(28),
      fontWeight: '700',
      color: colors.text,
      marginBottom: 24,
    },
    medicationCard: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: isHighContrast() ? 2 : 1,
      borderColor: colors.border,
    },
    overdueCard: {
      borderColor: colors.error,
      borderWidth: isHighContrast() ? 3 : 2,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    cardContent: {
      flex: 1,
      marginLeft: 16,
    },
    medicationName: {
      fontSize: getFontSize(20),
      fontWeight: '600',
      color: colors.text,
    },
    dosage: {
      fontSize: getFontSize(16),
      color: colors.textSecondary,
    },
    nextDose: {
      fontSize: getFontSize(16),
      fontWeight: '600',
      color: colors.text,
      marginTop: 8,
    },
    overdue: {
      color: colors.error,
    },
  }), [colors, isHighContrast]);

  return (
    <GoogleAuthGate reason="Access your medication schedule">
      <SafeAreaView style={dynamicStyles.container}>
        <ScrollView
          style={dynamicStyles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={dynamicStyles.title}>My Medications</Text>

          {medications
            .filter(med => med.isActive)
            .sort((a, b) => a.nextDose.getTime() - b.nextDose.getTime())
            .map((medication) => (
              <TouchableOpacity
                key={medication.id}
                style={[
                  dynamicStyles.medicationCard,
                  isOverdue(medication) && dynamicStyles.overdueCard,
                ]}
                onPress={() => handleTakeMedication(medication)}
                accessibilityRole="button"
                accessibilityLabel={`${medication.name}, ${medication.dosage}, next dose at ${formatTime(medication.nextDose)}`}
              >
                <View style={dynamicStyles.cardHeader}>
                  <PillIcon
                    size={32}
                    color={colors.primary}
                    accessibilityLabel="medication"
                  />
                  <View style={dynamicStyles.cardContent}>
                    <Text style={dynamicStyles.medicationName}>
                      {medication.name}
                    </Text>
                    <Text style={dynamicStyles.dosage}>
                      {medication.dosage}
                    </Text>
                  </View>
                </View>

                <Text style={[
                  dynamicStyles.nextDose,
                  isOverdue(medication) && dynamicStyles.overdue,
                ]}>
                  {isOverdue(medication)
                    ? `Overdue since ${formatTime(medication.nextDose)}`
                    : `Next dose: ${formatTime(medication.nextDose)}`
                  }
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </SafeAreaView>
    </GoogleAuthGate>
  );
});


export default MedicationScreen;
/**
 * Legacy Honored Home Screen
 * Big buttons, simple interface for Wade
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';

import PersonaService, { PersonaVoice } from '../services/PersonaService';
import VoiceRecognitionService from '../services/VoiceRecognitionService';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  nextDose: Date;
  taken: boolean;
  overdue: boolean;
}

interface PetTask {
  id: string;
  task: string;
  due: Date;
  completed: boolean;
}

const HomeScreen = (): JSX.Element => {
  const [currentPersona, setCurrentPersona] = useState<PersonaVoice | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [nextMedication, setNextMedication] = useState<Medication | null>(null);
  const [nextPetTask, setNextPetTask] = useState<PetTask | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    try {
      // Initialize services
      await VoiceRecognitionService.initialize();

      // Get current persona
      const persona = PersonaService.getCurrentPersona();
      setCurrentPersona(persona);

      // Load medication data (placeholder - would come from actual service)
      loadMockData();

      // Give daily greeting if persona is set
      if (persona) {
        const greeting = PersonaService.getDailyGreeting();
        await PersonaService.speak(greeting);
      }
    } catch (error) {
      console.error('Failed to initialize HomeScreen:', error);
    }
  };

  const loadMockData = () => {
    // Mock data for Wade - in real app this would come from medication service
    const now = new Date();
    const nextDose = new Date(now.getTime() + 30 * 60000); // 30 minutes from now

    setNextMedication({
      id: '1',
      name: 'Levodopa',
      dosage: '100mg',
      nextDose: nextDose,
      taken: false,
      overdue: false
    });

    setNextPetTask({
      id: '1',
      task: 'Walk the dog',
      due: new Date(now.getTime() + 60 * 60000), // 1 hour from now
      completed: false
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await initializeScreen();
    setRefreshing(false);
  }, []);

  const handleVoiceCommand = async () => {
    try {
      setIsListening(true);

      if (currentPersona) {
        await PersonaService.speak("I'm listening. What can I help you with?");
      }

      // Start voice recognition
      await VoiceRecognitionService.startListening();

      // Auto-stop after 10 seconds
      setTimeout(async () => {
        if (VoiceRecognitionService.isCurrentlyListening()) {
          await VoiceRecognitionService.stopListening();
          setIsListening(false);
        }
      }, 10000);

    } catch (error) {
      console.error('Voice command failed:', error);
      setIsListening(false);
      Alert.alert('Voice Error', 'Sorry, voice recognition is not available right now.');
    }
  };

  const handleMedicationAction = () => {
    if (!nextMedication) return;

    Alert.alert(
      'Medication',
      `${nextMedication.name} • ${nextMedication.dosage}`,
      [
        {
          text: 'I Took It',
          onPress: async () => {
            const confirmation = PersonaService.getMedicationConfirmation();
            await PersonaService.speak(confirmation);
            // Mark as taken
            setNextMedication(prev => prev ? {...prev, taken: true} : null);
          }
        },
        {
          text: 'Snooze 10 min',
          onPress: async () => {
            if (currentPersona?.id === 'dr_evil') {
              await PersonaService.speak("Acceptable delay! My evil timer will remind you in exactly 10 minutes!");
            } else {
              await PersonaService.speak("Okay, I'll remind you again in 10 minutes.");
            }
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handlePetCare = () => {
    if (!nextPetTask) return;

    Alert.alert(
      'Pet Care',
      nextPetTask.task,
      [
        {
          text: 'Done',
          onPress: async () => {
            if (currentPersona?.id === 'dr_evil') {
              await PersonaService.speak("Excellent! The furry minion has been cared for according to my evil plan!");
            } else {
              await PersonaService.speak("Great! I've marked that as completed.");
            }
            setNextPetTask(prev => prev ? {...prev, completed: true} : null);
          }
        },
        {
          text: 'Remind me later',
          onPress: async () => {
            await PersonaService.speak("I'll remind you about pet care later.");
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleEmergencyPress = () => {
    Alert.alert(
      'Emergency Help',
      'What kind of help do you need?',
      [
        {
          text: 'Call Family',
          onPress: async () => {
            const emergencyMessage = PersonaService.getEmergencyResponse();
            await PersonaService.speak(emergencyMessage);
            // Would trigger actual emergency call
          }
        },
        {
          text: 'Show Medical Info',
          onPress: () => {
            // Navigate to medical documents
            console.log('Show medical info');
          }
        },
        {
          text: 'Medication Help',
          onPress: () => {
            // Navigate to medications
            console.log('Show medications');
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Persona Header */}
        {currentPersona && (
          <View style={styles.personaHeader}>
            <Text style={styles.personaText}>
              {currentPersona.displayName}
            </Text>
          </View>
        )}

        {/* Main Voice Button */}
        <TouchableOpacity
          style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
          onPress={handleVoiceCommand}
          activeOpacity={0.8}
        >
          <Text style={styles.voiceButtonIcon}>🎤</Text>
          <Text style={styles.voiceButtonText}>
            {isListening ? 'Listening...' : 'Talk to Me'}
          </Text>
          {currentPersona && (
            <Text style={styles.voiceButtonSubtext}>
              Say "I took it" or "Help"
            </Text>
          )}
        </TouchableOpacity>

        {/* Next Medication */}
        {nextMedication && !nextMedication.taken && (
          <TouchableOpacity
            style={[styles.actionCard, nextMedication.overdue && styles.overdueCard]}
            onPress={handleMedicationAction}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>💊</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Next Medication</Text>
              <Text style={styles.actionDetails}>
                {nextMedication.name} • {nextMedication.dosage}
              </Text>
              <Text style={styles.actionTime}>
                Due at {formatTime(nextMedication.nextDose)}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Pet Care */}
        {nextPetTask && !nextPetTask.completed && (
          <TouchableOpacity
            style={styles.actionCard}
            onPress={handlePetCare}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>🐕</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Pet Care</Text>
              <Text style={styles.actionDetails}>{nextPetTask.task}</Text>
              <Text style={styles.actionTime}>
                Due at {formatTime(nextPetTask.due)}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Emergency Button */}
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergencyPress}
          activeOpacity={0.8}
        >
          <Text style={styles.emergencyIcon}>🚨</Text>
          <Text style={styles.emergencyText}>Emergency Help</Text>
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
  personaHeader: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  personaText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  voiceButton: {
    backgroundColor: '#007AFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  voiceButtonActive: {
    backgroundColor: '#FF3B30',
  },
  voiceButtonIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  voiceButtonText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  voiceButtonSubtext: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 120,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  overdueCard: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  actionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  actionDetails: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 4,
  },
  actionTime: {
    fontSize: 16,
    color: '#999999',
  },
  emergencyButton: {
    backgroundColor: '#FF3B30',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default HomeScreen;
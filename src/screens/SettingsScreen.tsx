/**
 * Legacy Honored Settings Screen
 * Simple settings for Wade
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';

import PersonaService, { PersonaVoice } from '../services/PersonaService';

const SettingsScreen = (): JSX.Element => {
  const [currentPersona, setCurrentPersona] = useState<PersonaVoice | null>(null);

  useEffect(() => {
    const persona = PersonaService.getCurrentPersona();
    setCurrentPersona(persona);
  }, []);

  const handleChangePersona = () => {
    const personas = PersonaService.getAllPersonas();
    const personaOptions = personas.map(p => ({
      text: p.displayName,
      onPress: async () => {
        await PersonaService.setPersona(p.id);
        setCurrentPersona(p);

        // Give a sample greeting in the new persona's voice
        const greeting = PersonaService.getDailyGreeting();
        await PersonaService.speak(greeting);
      }
    }));

    Alert.alert(
      'Choose Your Companion',
      'Select who you\'d like to help you each day:',
      [
        ...personaOptions,
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleEmergencyContacts = () => {
    Alert.alert(
      'Emergency Contacts',
      'Your emergency contacts are set up and ready.',
      [{ text: 'OK' }]
    );
  };

  const handleTestVoice = async () => {
    if (currentPersona) {
      const testMessage = PersonaService.getMedicationReminder('Test Medicine', '1 tablet');
      await PersonaService.speak(testMessage);
    } else {
      await PersonaService.speak('Please choose a companion first.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Settings</Text>

        {/* Current Persona */}
        <View style={styles.currentPersonaCard}>
          <Text style={styles.cardTitle}>Your AI Companion</Text>
          {currentPersona ? (
            <Text style={styles.personaName}>{currentPersona.displayName}</Text>
          ) : (
            <Text style={styles.noPersonaText}>No companion selected</Text>
          )}
        </View>

        {/* Settings Options */}
        <TouchableOpacity
          style={styles.settingCard}
          onPress={handleChangePersona}
          activeOpacity={0.8}
        >
          <Text style={styles.settingIcon}>🎭</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Change Companion</Text>
            <Text style={styles.settingSubtitle}>
              Choose your AI personality helper
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingCard}
          onPress={handleTestVoice}
          activeOpacity={0.8}
        >
          <Text style={styles.settingIcon}>🔊</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Test Voice</Text>
            <Text style={styles.settingSubtitle}>
              Hear your companion speak
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingCard}
          onPress={handleEmergencyContacts}
          activeOpacity={0.8}
        >
          <Text style={styles.settingIcon}>📞</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Emergency Contacts</Text>
            <Text style={styles.settingSubtitle}>
              Manage your emergency contacts
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingCard}
          activeOpacity={0.8}
        >
          <Text style={styles.settingIcon}>🔊</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Voice Volume</Text>
            <Text style={styles.settingSubtitle}>
              Adjust speech volume
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingCard}
          activeOpacity={0.8}
        >
          <Text style={styles.settingIcon}>⏰</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Reminder Times</Text>
            <Text style={styles.settingSubtitle}>
              Adjust medication reminders
            </Text>
          </View>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfoCard}>
          <Text style={styles.appInfoTitle}>Legacy Honored</Text>
          <Text style={styles.appInfoSubtitle}>
            Technology that honors your life's work
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
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
  currentPersonaCard: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  personaName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  noPersonaText: {
    fontSize: 18,
    color: '#666666',
    fontStyle: 'italic',
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
    borderWidth: 1,
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
  settingIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  appInfoCard: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  appInfoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  appInfoSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  versionText: {
    fontSize: 14,
    color: '#999999',
  },
});

export default SettingsScreen;
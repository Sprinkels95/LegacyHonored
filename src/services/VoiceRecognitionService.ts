/**
 * VoiceRecognitionService for Legacy Honored
 * Handles voice commands for Wade with Parkinson's considerations
 */

import Voice from '@react-native-voice/voice';
import PersonaService from './PersonaService';

interface VoiceCommand {
  patterns: string[];
  action: string;
  confidence: number;
}

class VoiceRecognitionServiceClass {
  private isListening: boolean = false;
  private commands: VoiceCommand[] = [
    // Medication commands
    {
      patterns: ['i took it', 'took it', 'i took my medicine', 'i took my medication', 'done', 'finished'],
      action: 'medication_taken',
      confidence: 0.6
    },
    {
      patterns: ['skip', 'skip this', 'dont need it', 'not now', 'i dont need it'],
      action: 'medication_skip',
      confidence: 0.7
    },
    {
      patterns: ['snooze', 'remind me later', 'in a few minutes', 'wait'],
      action: 'medication_snooze',
      confidence: 0.7
    },

    // Status queries
    {
      patterns: ['what time', 'what time is it', 'time'],
      action: 'tell_time',
      confidence: 0.8
    },
    {
      patterns: ['whats next', 'what is next', 'schedule', 'agenda'],
      action: 'show_schedule',
      confidence: 0.7
    },
    {
      patterns: ['did i take', 'have i taken', 'medication status', 'medicine status'],
      action: 'medication_status',
      confidence: 0.7
    },

    // Pet care commands
    {
      patterns: ['walked the dog', 'i walked', 'dog walked', 'walk done'],
      action: 'pet_walk_done',
      confidence: 0.7
    },
    {
      patterns: ['fed the dog', 'dog fed', 'feeding done', 'i fed'],
      action: 'pet_feed_done',
      confidence: 0.7
    },
    {
      patterns: ['time to walk', 'walk time', 'dog walk', 'walk the dog'],
      action: 'pet_walk_reminder',
      confidence: 0.7
    },

    // Emergency commands
    {
      patterns: ['help', 'emergency', 'i need help', 'call family', 'im hurt', 'i fell'],
      action: 'emergency',
      confidence: 0.9
    },
    {
      patterns: ['call doctor', 'need doctor', 'medical help', 'call 911'],
      action: 'medical_emergency',
      confidence: 0.9
    },

    // General commands
    {
      patterns: ['thank you', 'thanks', 'good job'],
      action: 'acknowledgment',
      confidence: 0.8
    }
  ];

  constructor() {
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
  }

  async initialize(): Promise<void> {
    try {
      console.log('VoiceRecognitionService initialized');
    } catch (error) {
      console.error('Failed to initialize VoiceRecognitionService:', error);
    }
  }

  async startListening(): Promise<void> {
    try {
      if (this.isListening) {
        await this.stopListening();
      }

      this.isListening = true;

      // Configure for Parkinson's users - extended timeouts for slower speech patterns
      await Voice.start('en-US', {
        EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 15000, // 15 seconds for Parkinson's pauses
        EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 8000, // 8 seconds for possible completion
        EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 3000, // 3 seconds minimum speech
        SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 12000, // 12 seconds before giving up
      });

      console.log('Voice recognition started');
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      this.isListening = false;
    }
  }

  async stopListening(): Promise<void> {
    try {
      await Voice.stop();
      this.isListening = false;
      console.log('Voice recognition stopped');
    } catch (error) {
      console.error('Failed to stop voice recognition:', error);
    }
  }

  private onSpeechStart(): void {
    console.log('Speech started');
  }

  private onSpeechEnd(): void {
    console.log('Speech ended');
    this.isListening = false;
  }

  private async onSpeechResults(event: any): Promise<void> {
    try {
      const results = event.value;
      if (results && results.length > 0) {
        const spokenText = results[0].toLowerCase();
        console.log('Speech recognized:', spokenText);

        await this.processCommand(spokenText);
      }
    } catch (error) {
      console.error('Error processing speech results:', error);
    }
  }

  private onSpeechError(event: any): void {
    console.error('Speech recognition error:', event.error);
    this.isListening = false;

    // Provide helpful feedback through persona
    const persona = PersonaService.getCurrentPersona();
    if (persona) {
      let errorMessage = "I didn't quite catch that. Try speaking clearly and a bit louder.";

      if (persona.id === 'dr_evil') {
        errorMessage = "My evil hearing device failed to capture your words! Speak louder, for my plan requires clear communication!";
      } else if (persona.id === 'ward_cleaver') {
        errorMessage = "I'm sorry, son, I didn't catch what you said. Try speaking a little clearer.";
      }

      PersonaService.speak(errorMessage);
    }
  }

  private async processCommand(spokenText: string): Promise<string> {
    // Find the best matching command
    let bestMatch: VoiceCommand | null = null;
    let highestScore = 0;

    for (const command of this.commands) {
      for (const pattern of command.patterns) {
        const score = this.calculateSimilarity(spokenText, pattern);
        if (score >= command.confidence && score > highestScore) {
          bestMatch = command;
          highestScore = score;
        }
      }
    }

    if (bestMatch) {
      return await this.executeCommand(bestMatch.action, spokenText);
    } else {
      // Fallback response
      const persona = PersonaService.getCurrentPersona();
      let fallbackMessage = "I'm not sure what you meant. Try saying 'I took it' for medication, or 'help' for assistance.";

      if (persona?.id === 'dr_evil') {
        fallbackMessage = "My evil plan does not include understanding that command! Try 'I took it' for medication, or 'help' for my emergency protocol!";
      } else if (persona?.id === 'ward_cleaver') {
        fallbackMessage = "I'm not quite sure what you meant, son. Try 'I took it' for your medication, or 'help' if you need assistance.";
      }

      await PersonaService.speak(fallbackMessage);
      return 'unknown_command';
    }
  }

  private calculateSimilarity(text1: string, text2: string): number {
    // Simple similarity calculation - checks if key words are present
    const words1 = text1.toLowerCase().split(' ');
    const words2 = text2.toLowerCase().split(' ');

    let matches = 0;
    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1.includes(word2) || word2.includes(word1)) {
          matches++;
          break;
        }
      }
    }

    return matches / Math.max(words1.length, words2.length);
  }

  private async executeCommand(action: string, originalText: string): Promise<string> {
    const persona = PersonaService.getCurrentPersona();

    switch (action) {
      case 'medication_taken':
        // This would integrate with MedicationService to mark as taken
        const confirmationMessage = PersonaService.getMedicationConfirmation();
        await PersonaService.speak(confirmationMessage);
        return 'medication_confirmed';

      case 'medication_skip':
        let skipMessage = "Okay, I'll mark this dose as skipped. Please remember to take your next dose on time.";
        if (persona?.id === 'dr_evil') {
          skipMessage = "Very well! My evil plan can accommodate this deviation. But the next dose is crucial for continued world... I mean, health domination!";
        }
        await PersonaService.speak(skipMessage);
        return 'medication_skipped';

      case 'medication_snooze':
        let snoozeMessage = "Okay, I'll remind you again in 10 minutes.";
        if (persona?.id === 'dr_evil') {
          snoozeMessage = "Acceptable delay! My evil timer will remind you in exactly 10 minutes. Do not test my patience further!";
        }
        await PersonaService.speak(snoozeMessage);
        return 'medication_snoozed';

      case 'tell_time':
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        await PersonaService.speak(`It's ${timeString}`);
        return 'time_told';

      case 'show_schedule':
        let scheduleMessage = "Let me check your schedule for today.";
        if (persona?.id === 'dr_evil') {
          scheduleMessage = "Ah yes, let me consult my evil agenda for your daily activities!";
        }
        await PersonaService.speak(scheduleMessage);
        return 'schedule_shown';

      case 'pet_walk_done':
        let walkMessage = "Great! I've marked the dog walk as completed.";
        if (persona?.id === 'dr_evil') {
          walkMessage = "Excellent! The furry minion has been exercised according to my evil plan!";
        }
        await PersonaService.speak(walkMessage);
        return 'pet_walk_logged';

      case 'emergency':
        const emergencyMessage = PersonaService.getEmergencyResponse();
        await PersonaService.speak(emergencyMessage);
        // This would trigger actual emergency protocols
        return 'emergency_triggered';

      case 'acknowledgment':
        let thanksMessage = "You're welcome! I'm always here to help.";
        if (persona?.id === 'dr_evil') {
          thanksMessage = "Your gratitude fuels my evil... I mean, helpful activities! Muahahaha!";
        } else if (persona?.id === 'ward_cleaver') {
          thanksMessage = "You're very welcome, son. That's what I'm here for.";
        }
        await PersonaService.speak(thanksMessage);
        return 'acknowledged';

      default:
        await PersonaService.speak("I'm not sure how to help with that.");
        return 'unknown_action';
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  // Public method to process text commands (for testing or manual input)
  async processTextCommand(text: string): Promise<string> {
    return await this.processCommand(text);
  }
}

const VoiceRecognitionService = new VoiceRecognitionServiceClass();
export default VoiceRecognitionService;
/**
 * PersonaService for Legacy Honored
 * Manages AI personality companions including Dr. Evil for Wade
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';

export interface PersonaVoice {
  id: string;
  name: string;
  displayName: string;
  gender: 'male' | 'female' | 'non-binary';
  description: string;
  era: string;
  personality: string[];
  category: 'classic' | 'lgbtq' | 'authority' | 'nurturing';
}

class PersonaServiceClass {
  private currentPersona: PersonaVoice | null = null;
  private personas: PersonaVoice[] = [
    // Male Personas
    {
      id: 'dr_evil',
      name: 'Dr. Evil',
      displayName: 'Dr. Evil (The Arch-Villain)',
      gender: 'male',
      description: 'Dramatically helpful villain who makes everything sound like an evil plot',
      era: '1960s-inspired (Austin Powers era)',
      personality: ['dramatic', 'humorous', 'theatrical', 'unexpectedly caring'],
      category: 'classic'
    },
    {
      id: 'ward_cleaver',
      name: 'Ward Cleaver',
      displayName: 'Ward Cleaver (The Wise Father)',
      gender: 'male',
      description: 'Kind, patient father figure who provides gentle guidance',
      era: '1950s-1960s (Leave It to Beaver)',
      personality: ['nurturing', 'wise', 'calm', 'supportive'],
      category: 'nurturing'
    },
    {
      id: 'perry_mason',
      name: 'Perry Mason',
      displayName: 'Perry Mason (The Detective)',
      gender: 'male',
      description: 'Logical detective who approaches daily tasks methodically',
      era: '1950s-1960s',
      personality: ['logical', 'thorough', 'reassuring', 'systematic'],
      category: 'authority'
    },

    // Female Personas
    {
      id: 'lucy_ricardo',
      name: 'Lucy Ricardo',
      displayName: 'Lucy Ricardo (The Comedienne)',
      gender: 'female',
      description: 'Fun, energetic character who uses humor to motivate',
      era: '1950s (I Love Lucy)',
      personality: ['playful', 'energetic', 'humorous', 'determined'],
      category: 'classic'
    },
    {
      id: 'june_cleaver',
      name: 'June Cleaver',
      displayName: 'June Cleaver (The Wise Mother)',
      gender: 'female',
      description: 'Nurturing mother figure who provides gentle encouragement',
      era: '1950s-1960s (Leave It to Beaver)',
      personality: ['gentle', 'encouraging', 'wise', 'comforting'],
      category: 'nurturing'
    },
    {
      id: 'lois_lane',
      name: 'Lois Lane',
      displayName: 'Lois Lane (The Reporter)',
      gender: 'female',
      description: 'Direct, efficient reporter who gets things done',
      era: '1950s (Superman)',
      personality: ['direct', 'efficient', 'brave', 'caring'],
      category: 'authority'
    },

    // LGBTQ+ Historical Icons
    {
      id: 'gladys_bentley',
      name: 'Gladys Bentley',
      displayName: 'Gladys Bentley (The Blues Singer)',
      gender: 'female',
      description: 'Vibrant blues singer with humor and resilience',
      era: '1920s-1930s (Harlem Renaissance)',
      personality: ['vibrant', 'musical', 'resilient', 'encouraging'],
      category: 'lgbtq'
    },
    {
      id: 'christine_jorgensen',
      name: 'Christine Jorgensen',
      displayName: 'Christine Jorgensen (The Pioneer)',
      gender: 'female',
      description: 'Courageous pioneer who encourages authenticity',
      era: '1950s',
      personality: ['courageous', 'authentic', 'pioneering', 'supportive'],
      category: 'lgbtq'
    },
    {
      id: 'storme_delarverie',
      name: 'Stormé DeLarverie',
      displayName: 'Stormé DeLarverie (The Guardian)',
      gender: 'non-binary',
      description: 'Strong protector who stands up for what\'s right',
      era: '1950s-1960s',
      personality: ['protective', 'strong', 'principled', 'caring'],
      category: 'lgbtq'
    }
  ];

  async initialize(): Promise<void> {
    try {
      // Configure TTS
      await Tts.setDefaultLanguage('en-US');
      await Tts.setDefaultRate(0.5); // Slower speech for seniors
      await Tts.setDefaultPitch(1.0);

      // Load saved persona
      const savedPersonaId = await AsyncStorage.getItem('selectedPersona');
      if (savedPersonaId) {
        this.currentPersona = this.personas.find(p => p.id === savedPersonaId) || null;
      }

      console.log('PersonaService initialized with persona:', this.currentPersona?.name || 'None');
    } catch (error) {
      console.error('Failed to initialize PersonaService:', error);
    }
  }

  async setPersona(personaId: string): Promise<void> {
    const persona = this.personas.find(p => p.id === personaId);
    if (persona) {
      this.currentPersona = persona;
      await AsyncStorage.setItem('selectedPersona', personaId);
      console.log('Persona set to:', persona.name);
    }
  }

  getCurrentPersona(): PersonaVoice | null {
    return this.currentPersona;
  }

  getAllPersonas(): PersonaVoice[] {
    return this.personas;
  }

  async speak(text: string): Promise<void> {
    try {
      await Tts.speak(text);
    } catch (error) {
      console.error('TTS failed:', error);
    }
  }

  // Generate persona-specific responses
  getMedicationReminder(medicationName: string, dosage: string, withFood: boolean = false): string {
    if (!this.currentPersona) {
      return `Time for your ${medicationName}, ${dosage}.`;
    }

    switch (this.currentPersona.id) {
      case 'dr_evil':
        return withFood
          ? `Attention! The time has come for your ${medicationName}, ${dosage}. My evil plan requires you to take it with food for maximum effectiveness! Muahahaha!`
          : `Excellent! It is time for your ${medicationName}, ${dosage}. Take it now, for my evil plan requires you to be healthy! Muahahaha!`;

      case 'ward_cleaver':
        return withFood
          ? `Son, it's time for your ${medicationName}, ${dosage}. Taking it with a little food will help it work better. You're doing great taking care of yourself.`
          : `Time for your medication, son. ${medicationName}, ${dosage}. You're showing real responsibility by staying on top of your health.`;

      case 'lucy_ricardo':
        return withFood
          ? `¡Dios mío! Time for your ${medicationName}, ${dosage}! Ricky always says to take medicine with food, so let's get you a little snack first!`
          : `Lucy here! Time for your ${medicationName}, ${dosage}! Let's take it and get on with our fabulous day!`;

      case 'perry_mason':
        return withFood
          ? `Let me present the evidence: it's time for your ${medicationName}, ${dosage}. The case for taking it with food is strong - better absorption and less stomach irritation.`
          : `The facts are clear: it's time for your ${medicationName}, ${dosage}. Let's proceed with taking your medication as scheduled.`;

      case 'june_cleaver':
        return withFood
          ? `Oh my, it's time for your ${medicationName}, dear. ${dosage} with a nice little snack would be perfect.`
          : `Time for your medicine, sweetheart. ${medicationName}, ${dosage}. You're taking such good care of yourself.`;

      case 'gladys_bentley':
        return withFood
          ? `Honey, it's showtime for your ${medicationName}! ${dosage} with some food - let's make this medicine go down smooth like a good blues song!`
          : `Sugar, time for your ${medicationName}, ${dosage}! Take it with style, you beautiful soul!`;

      case 'christine_jorgensen':
        return withFood
          ? `Time for your ${medicationName}, ${dosage}. Taking it with food shows you're caring for yourself with love and intention.`
          : `Your ${medicationName} is ready, ${dosage}. Every step you take to care for yourself is an act of self-love.`;

      case 'storme_delarverie':
        return withFood
          ? `Time for your ${medicationName}, ${dosage}. Take it with food - you deserve proper care and attention.`
          : `${medicationName} time - ${dosage}. You're doing what you need to do, and I'm proud of you for that.`;

      default:
        return `Time for your ${medicationName}, ${dosage}.`;
    }
  }

  getMedicationConfirmation(): string {
    if (!this.currentPersona) {
      return "Great! I've marked that as taken.";
    }

    switch (this.currentPersona.id) {
      case 'dr_evil':
        return "Excellent! My plan for your continued health is proceeding perfectly! Soon you will be unstoppably... well-medicated! Muahahaha!";

      case 'ward_cleaver':
        return "That's my boy! You're really showing responsibility by taking your medication on time. I'm proud of you.";

      case 'lucy_ricardo':
        return "¡Fantástico! You took your medicine! Ricky would be so proud! Now we can get back to having fun!";

      case 'perry_mason':
        return "Evidence logged: medication taken as prescribed. Your commitment to following the treatment plan is commendable.";

      case 'june_cleaver':
        return "Wonderful, dear! You're taking such good care of yourself. I'm so proud of you.";

      case 'gladys_bentley':
        return "That's my honey! You took that medicine like a champ! Now we can get back to living our best life!";

      case 'christine_jorgensen':
        return "Beautiful! You're honoring your body and your health. That takes real courage and self-love.";

      case 'storme_delarverie':
        return "Good job! You stood up for your health and did what needed to be done. That's real strength.";

      default:
        return "Great! Medication taken.";
    }
  }

  getDailyGreeting(): string {
    const hour = new Date().getHours();
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    if (hour >= 17) timeOfDay = 'evening';

    if (!this.currentPersona) {
      return `Good ${timeOfDay}! How can I help you today?`;
    }

    switch (this.currentPersona.id) {
      case 'dr_evil':
        return `Good ${timeOfDay}! You have built a legacy of courage and strength. Today, my evil plan is to help you continue that magnificent legacy with perfect health!`;

      case 'ward_cleaver':
        return `Good ${timeOfDay}, son! You're up bright and early. That shows real character. How can I help you today?`;

      case 'lucy_ricardo':
        return `¡Buenos días! It's a beautiful ${timeOfDay}! I've got some wonderful ideas for making today fantastic!`;

      case 'perry_mason':
        return `Good ${timeOfDay}! Let's review today's schedule and make sure we have all the facts straight.`;

      case 'june_cleaver':
        return `Good ${timeOfDay}, dear! I hope you slept well. What can I do to help make your day lovely?`;

      case 'gladys_bentley':
        return `Well hello there, beautiful! It's a gorgeous ${timeOfDay} and I'm ready to help you make some music with your day!`;

      case 'christine_jorgensen':
        return `Good ${timeOfDay}! Today is another opportunity to live authentically and care for yourself with love.`;

      case 'storme_delarverie':
        return `Good ${timeOfDay}! You've got strength and dignity, and I'm here to help you use both today.`;

      default:
        return `Good ${timeOfDay}! How can I help you today?`;
    }
  }

  getEmergencyResponse(): string {
    if (!this.currentPersona) {
      return "I'm getting help for you right away.";
    }

    switch (this.currentPersona.id) {
      case 'dr_evil':
        return "This is no time for evil schemes! I'm activating my emergency protocol immediately!";

      case 'ward_cleaver':
        return "Don't you worry, son. I'm calling your family right now. Everything's going to be alright.";

      case 'lucy_ricardo':
        return "¡Ay, Dios mío! Don't worry, I'm getting help right now! Ricky taught me what to do!";

      case 'perry_mason':
        return "Emergency protocol activated. I'm contacting your emergency contacts immediately with your location and medical information.";

      case 'june_cleaver':
        return "Oh my! Don't worry, dear. I'm calling for help right away. Just stay calm, sweetheart.";

      case 'gladys_bentley':
        return "Hold tight, honey! I'm getting the cavalry - your family is going to know you need help right now!";

      case 'christine_jorgensen':
        return "You're brave and you're going to be okay. I'm getting help for you immediately.";

      case 'storme_delarverie':
        return "I've got your back! Help is on the way - I'm calling your emergency contacts right now.";

      default:
        return "Getting help for you immediately.";
    }
  }
}

const PersonaService = new PersonaServiceClass();
export default PersonaService;
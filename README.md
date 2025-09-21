# LegacyHonored

**Technology that honors your life's work**

A React Native mobile application designed specifically for seniors with medication management needs, featuring AI personality companions and accessibility-focused design for users with Parkinson's disease and other conditions.

## 🎭 Features

### AI Persona Companions
Choose from 9 unique personality companions to make medication reminders more engaging:

- **Dr. Evil** - Dramatically helpful villain who makes everything sound like an evil plot
- **Ward Cleaver** - Kind, patient father figure providing gentle guidance
- **Perry Mason** - Logical detective approaching tasks methodically
- **Lucy Ricardo** - Fun, energetic character using humor to motivate
- **June Cleaver** - Nurturing mother figure with gentle encouragement
- **Lois Lane** - Direct, efficient reporter who gets things done
- **Gladys Bentley** - Vibrant blues singer with humor and resilience
- **Christine Jorgensen** - Courageous pioneer encouraging authenticity
- **Stormé DeLarverie** - Strong protector standing up for what's right

### Core Functionality
- 🗣️ **Voice Recognition** - "Talk to Me" button for hands-free interaction
- 🔊 **Text-to-Speech** - Persona-specific spoken reminders and responses
- 💊 **Medication Management** - Track medications with personalized reminders
- 🚨 **Emergency Help** - Quick access to emergency contacts and medical info
- 🐕 **Pet Care Reminders** - Track pet-related tasks and schedules
- ♿ **Accessibility** - Large buttons, simple interface, senior-friendly design

## 🛠️ Technology Stack

- **React Native 0.72.4** - Cross-platform mobile development
- **TypeScript** - Type-safe development
- **React Navigation** - Tab-based navigation
- **AsyncStorage** - Local data persistence
- **React Native Voice** - Speech recognition
- **React Native TTS** - Text-to-speech functionality
- **Google Cloud Build** - Automated APK generation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Android Studio (for local builds)
- Java JDK 11+
- Google Cloud SDK (for cloud builds)

### Installation

```bash
# Clone the repository
git clone https://github.com/[username]/LegacyHonored.git
cd LegacyHonored

# Install dependencies
npm install
```

### Build Options

#### Option 1: Google Cloud Build (Recommended)
```bash
# Set up Google Cloud project
gcloud config set project memory-lane-app-469523

# Create storage bucket (one time)
gsutil mb gs://memory-lane-app-469523-builds-$(date +%s)

# Update cloudbuild.yaml with your bucket name
# Edit line 46: location: 'gs://your-bucket-name'

# Build APK
gcloud builds submit --config cloudbuild.yaml .

# Download APK
gsutil cp gs://your-bucket-name/*.apk ./LegacyHonored.apk
```

#### Option 2: Local Build
```bash
# Generate bundle
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# Build APK
cd android && ./gradlew assembleRelease
```

#### Option 3: Development Mode
```bash
# Start Metro bundler
npm start

# Run on Android device/emulator
npx react-native run-android
```

## 📱 Installation on Device

1. **Enable Developer Options** on Android device
2. **Allow installation from unknown sources**
3. **Transfer APK** via USB, email, or cloud storage
4. **Install** by tapping the APK file

## 🎯 Target Users

### Primary: Seniors with Parkinson's Disease
- Large, easy-to-tap buttons
- Voice control for tremor accommodation
- Slower speech rate for better comprehension
- Dramatic personas (like Dr. Evil) for entertainment and engagement

### Secondary: General Senior Population
- Simplified interface design
- Medication reminder system
- Emergency contact integration
- Pet care scheduling

## 🗣️ Persona Examples

### Dr. Evil Medication Reminder
> "Attention! The time has come for your Levodopa, 100mg. My evil plan requires you to take it with food for maximum effectiveness! Muahahaha!"

### Ward Cleaver Encouragement
> "Son, it's time for your medication. You're showing real responsibility by staying on top of your health."

### Lucy Ricardo Energy
> "¡Dios mío! Time for your medicine! Let's take it and get on with our fabulous day!"

## 🏗️ Project Structure

```
LegacyHonored/
├── src/
│   ├── App.tsx                 # Main app component
│   ├── screens/                # Screen components
│   │   ├── HomeScreen.tsx      # Main dashboard
│   │   ├── MedicationScreen.tsx
│   │   ├── LegalDocumentsScreen.tsx
│   │   └── SettingsScreen.tsx
│   └── services/               # Business logic
│       ├── PersonaService.ts   # AI persona management
│       └── VoiceRecognitionService.ts
├── android/                    # Android build configuration
├── cloudbuild.yaml            # Google Cloud Build config
├── Dockerfile                 # Container build setup
└── GOOGLE_CLOUD_BUILD.md      # Detailed build instructions
```

## 🔧 Configuration

### Android Package
- **Package ID**: `com.legacyhonored.app`
- **App Name**: "Legacy Honored"
- **Version**: 1.0.0

### Permissions Required
- `RECORD_AUDIO` - Voice recognition
- `CALL_PHONE` - Emergency calling (planned feature)

## 🚀 Deployment

The app is configured for deployment via Google Cloud Build with automatic APK generation and storage in Google Cloud Storage buckets.

### Google Cloud Project
- **Project ID**: `memory-lane-app-469523`
- **Build Config**: `cloudbuild.yaml`
- **Storage**: Google Cloud Storage buckets

## 🤝 Contributing

This project was developed with accessibility and senior user experience as primary concerns. When contributing:

1. Maintain large button sizes (minimum 120px height)
2. Use high contrast colors for visibility
3. Test with voice recognition on various devices
4. Ensure persona responses are appropriate and encouraging
5. Follow React Native best practices for performance

## 📝 License

MIT License - See LICENSE file for details

## 👥 Credits

- **Developer**: Els, Sprinkels95
- **Target User Inspiration**: Individual with Parkinson's disease
- **AI Assistant**: Claude (Anthropic)

## 🆘 Support

For issues and feature requests, please create an issue in the GitHub repository.

---

*"Technology that honors your life's work" - LegacyHonored helps seniors maintain independence and dignity through thoughtful design and engaging AI companions.*

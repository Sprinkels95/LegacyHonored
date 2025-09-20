# URGENT Accessibility Fixes for LegacyHonored

## Phase 1: Critical Fixes (Week 1)

### 1. Add Accessibility to HomeScreen Voice Button
```typescript
<TouchableOpacity
  style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
  onPress={handleVoiceCommand}
  accessibilityRole="button"
  accessibilityLabel="Voice command for medication"
  accessibilityHint="Double tap to start listening. Say 'I took my medicine' or 'Help'"
  accessibilityState={{ busy: isListening, disabled: false }}
  accessible={true}
>
  <Text style={styles.voiceButtonText} importantForAccessibility="no-hide-descendants">
    {isListening ? 'Listening...' : 'Talk to Me'}
  </Text>
</TouchableOpacity>
```

### 2. Fix Medication Card Accessibility
```typescript
<TouchableOpacity
  style={[styles.actionCard, nextMedication.overdue && styles.overdueCard]}
  onPress={handleMedicationAction}
  accessibilityRole="button"
  accessibilityLabel={`Next medication: ${nextMedication.name}, ${nextMedication.dosage}`}
  accessibilityHint="Double tap to mark as taken or snooze"
  accessibilityState={{
    disabled: false,
    selected: nextMedication.overdue
  }}
  accessible={true}
>
```

### 3. Add Dynamic Font Scaling
```typescript
import { PixelRatio } from 'react-native';

const styles = StyleSheet.create({
  voiceButtonText: {
    fontSize: 18 * PixelRatio.getFontScale(), // Scales with system settings
    fontWeight: 'bold',
  },
  actionTitle: {
    fontSize: 16 * PixelRatio.getFontScale(),
  }
});
```

### 4. Extend Voice Recognition for Parkinson's
```typescript
// In VoiceRecognitionService.ts
const VOICE_CONFIG = {
  EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 15000, // 15 seconds
  SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 3000, // 3 seconds minimum
  EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 8000,
};
```

## Phase 2: Performance Optimizations (Week 2)

### 1. Async Service Initialization
```typescript
// In App.tsx
const [servicesReady, setServicesReady] = useState(false);

useEffect(() => {
  const initServices = async () => {
    await Promise.all([
      PersonaService.initialize(),
      VoiceRecognitionService.initialize()
    ]);
    setServicesReady(true);
  };
  initServices();
}, []);

if (!servicesReady) {
  return <LoadingScreen />;
}
```

### 2. Memory Cleanup
```typescript
// Add to each screen
useEffect(() => {
  return () => {
    VoiceRecognitionService.cleanup();
    PersonaService.clearCache();
  };
}, []);
```

### 3. Lazy Load Personas
```typescript
// Only load current persona data
const [currentPersonaData, setCurrentPersonaData] = useState(null);

const loadPersonaData = useCallback(async (personaId) => {
  const data = await PersonaService.getPersonaData(personaId);
  setCurrentPersonaData(data);
}, []);
```

## Phase 3: Bundle Size Reduction (Week 3)

### 1. Selective Navigation Imports
```typescript
// Replace full @react-navigation/bottom-tabs
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs/lib/commonjs/navigators/createBottomTabNavigator';
```

### 2. Remove Emoji Dependencies
```typescript
// Replace emoji with accessible text + icon fonts
const VoiceIcon = () => <Text style={styles.icon}>🎤</Text>;
// With:
import Icon from 'react-native-vector-icons/MaterialIcons';
const VoiceIcon = () => <Icon name="mic" size={24} accessibilityLabel="microphone" />;
```

### 3. Code Splitting
```typescript
const MedicationScreen = React.lazy(() => import('./screens/MedicationScreen'));
const SettingsScreen = React.lazy(() => import('./screens/SettingsScreen'));
```

## Testing Requirements

### Accessibility Testing
1. Enable TalkBack on Android device
2. Navigate entire app using only TalkBack
3. Test with 200% font size scaling
4. Test with high contrast mode
5. Test voice commands with 5-second pauses

### Performance Testing
1. Test on Android device with 2GB RAM or less
2. Measure app startup time (target: <3 seconds)
3. Monitor memory usage during 30-minute session
4. Test voice recognition with Parkinson's speech patterns

## Success Metrics
- TalkBack navigation: 100% functional
- Bundle size: <800KB (30% reduction)
- Startup time: <3 seconds
- Voice recognition success: >80% for senior users
- Memory usage: <150MB peak
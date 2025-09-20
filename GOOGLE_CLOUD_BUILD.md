# Building Legacy Honored APK with Google Cloud

## Quick Setup (5 minutes to build APK!)

### Option 1: Google Cloud Shell (Easiest)

1. **Open Google Cloud Console**
   - Go to https://console.cloud.google.com
   - Open Cloud Shell (terminal icon in top bar)

2. **Upload Legacy Honored Project**
   ```bash
   # In Cloud Shell, upload the LegacyHonored folder
   # Or clone from GitHub if you've pushed it there
   ```

3. **Build the APK**
   ```bash
   cd LegacyHonored

   # Install dependencies
   npm install --legacy-peer-deps

   # Create the bundle
   npx react-native bundle \
     --platform android \
     --dev false \
     --entry-file index.js \
     --bundle-output android/app/src/main/assets/index.android.bundle \
     --assets-dest android/app/src/main/res

   # Build APK with Docker
   docker build -t legacy-honored .
   docker run --rm -v $(pwd)/output:/output legacy-honored cp /output/*.apk ./
   ```

4. **Download APK**
   ```bash
   # APK will be in output/ directory
   # Download it from Cloud Shell
   ```

### Option 2: Google Cloud Build (Automated)

1. **Create Storage Bucket**
   ```bash
   gsutil mb gs://memory-lane-app-469523-builds
   ```

2. **Submit Build**
   ```bash
   cd LegacyHonored
   gcloud config set project memory-lane-app-469523
   gcloud builds submit --config cloudbuild.yaml .
   ```

3. **Download APK**
   ```bash
   gsutil cp gs://memory-lane-app-469523-builds/*.apk ./wade-legacy-honored.apk
   ```

### Option 3: Local with Google Cloud SDK

If you have gcloud CLI installed locally:

```bash
cd LegacyHonored
gcloud config set project memory-lane-app-469523
gcloud builds submit --config cloudbuild.yaml .
```

## What You'll Get

- **File**: `app-release.apk`
- **Size**: ~20-30MB
- **Package**: `com.legacyhonored.app`
- **Ready for**: Android phone installation!

## Install on Target Phone

1. **Enable Unknown Sources**
   - Settings → Security → Install Unknown Apps → Allow from Files

2. **Transfer APK**
   - Email, USB, or Google Drive to target phone

3. **Install**
   - Tap the APK file → Install

4. **User's First Experience**
   - Opens "Legacy Honored"
   - Chooses "Dr. Evil (The Arch-Villain)"
   - Hears: "Attention! You have built a legacy of courage and strength..."

🎉 **Wade gets his dramatic Dr. Evil medication companion!** 🎭
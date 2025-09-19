FROM cimg/android:2023.07

# Set working directory
WORKDIR /app

# Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && \
    sudo apt-get install -y nodejs

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Create bundle
RUN npx react-native bundle \
    --platform android \
    --dev false \
    --entry-file index.js \
    --bundle-output android/app/src/main/assets/index.android.bundle \
    --assets-dest android/app/src/main/res

# Build APK
WORKDIR /app/android
RUN chmod +x gradlew && \
    ./gradlew assembleRelease --no-daemon

# Copy APK to output
RUN mkdir -p /output && \
    cp app/build/outputs/apk/release/*.apk /output/
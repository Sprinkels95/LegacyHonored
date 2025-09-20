# Legacy Honored - Security-focused ProGuard rules

# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Security libraries
-keep class androidx.biometric.** { *; }
-keep class androidx.security.crypto.** { *; }

# Medical data models - keep for secure serialization
-keep class com.legacyhonored.medical.models.** { *; }

# Remove logging in production builds
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}

# Remove console.log statements
-assumenosideeffects class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}

# Security: Remove stack traces in production
-keepattributes !StackMapTable,!LocalVariableTable,!LocalVariableTypeTable

# Keep security-critical classes
-keep class com.legacyhonored.security.** { *; }

# Obfuscate but keep structure for crash reporting
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# React Native specific optimizations
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**

# Medical compliance - keep audit trail classes
-keep class *.AuditLog { *; }
-keep class *.SecurityService { *; }

# Performance optimizations
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification

# Security: Hide sensitive method names
-obfuscationdictionary dictionary.txt
-classobfuscationdictionary dictionary.txt
-packageobfuscationdictionary dictionary.txt
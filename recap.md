# Android APK Build Troubleshooting Recap

Today, we worked on building an Android APK from a React Native project using Google Cloud Build. We encountered several challenges during this process, which required multiple iterations of the `cloudbuild.yaml` file.

## Summary of Issues and Solutions

1.  **Initial Build Failure:** The first build failed due to a variety of issues, including dependency conflicts and an incorrect Node.js version.
2.  **Permission Errors:** We then encountered permission errors where the build process was unable to make the `gradlew` script executable. We attempted to resolve this by using `bash` to execute the script directly, but this also failed.
3.  **Java Environment Issues:** Subsequent builds failed due to problems with the Java environment in the build container. The container was unable to find the `assembleRelease` class, which is a key part of the Android build process.
4.  **Incorrect Builder Image:** We then tried using an official Google Cloud Android builder image, but this failed because the image could not be found.
5.  **Final Solution:** The final, successful build was achieved by using the `cimg/android:2023.07` image and granting `sudo` permissions to the build step. This allowed the `gradlew` script to be made executable and the build to complete successfully.

## Next Steps

With the APK successfully built, the next logical step is to deploy it to a secure artifact registry. This will allow for versioning, access control, and easy distribution of the application. I will begin by setting up a new repository in Google Artifact Registry to store the APK.
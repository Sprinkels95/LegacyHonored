#!/bin/bash
#
# Description:
# This script performs the one-time setup required for Google Cloud Build to
# interact with Firebase App Distribution.
#
# It grants the Cloud Build service account the "Firebase App Distribution Admin" role,
# allowing it to upload and distribute APKs.

# Exit immediately if a command exits with a non-zero status.
set -e

# Variables
PROJECT_ID="memory-lane-app-469523"

# Get the project number, which is required for the service account email
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
SERVICE_ACCOUNT="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# The role to grant
ROLE="roles/firebaseappdistro.admin"

echo "Project ID: $PROJECT_ID"
echo "Project Number: $PROJECT_NUMBER"
echo "Service Account: $SERVICE_ACCOUNT"
echo "Role to Grant: $ROLE"

# Grant the Firebase App Distribution Admin role to the Cloud Build service account
echo "
Granting Firebase App Distribution Admin role to the Cloud Build service account..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="$ROLE"

echo "
✅ Successfully granted the Firebase App Distribution Admin role."
echo "You can now run the Cloud Build pipeline using cloudbuild-simple-optimized.yaml."

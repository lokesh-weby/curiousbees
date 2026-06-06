# Firebase Configuration

CuriousBees uses Firebase for two primary functions:
1. Google Single Sign-On (SSO).
2. Firebase Cloud Messaging (FCM) for push notifications.

## Project Setup
1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Add a "Web App" to retrieve your Client API Keys (`NEXT_PUBLIC_FIREBASE_*`).
3. Under **Project Settings > Service Accounts**, generate a new private key. This JSON file contains the credentials needed for the NestJS Backend (`FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`).

## Authentication
1. Go to **Authentication > Sign-in method**.
2. Enable the **Google** provider.
3. Restrict domains if necessary (e.g., to `@srmist.edu.in` accounts in production).

## Cloud Messaging (FCM)
1. Go to **Project Settings > Cloud Messaging**.
2. Under "Web Push certificates", generate a new Key Pair. This is your `NEXT_PUBLIC_FIREBASE_VAPID_KEY`.
3. The frontend Service Worker (`firebase-messaging-sw.js`) dynamically receives the frontend config, meaning no hardcoded keys are required in the static worker file.

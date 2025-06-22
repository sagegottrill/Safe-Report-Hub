# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication with Google Sign-In for the Safety Support Report system.

## Prerequisites

1. A Google account
2. Node.js and npm installed
3. Basic knowledge of Firebase Console

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "safety-support-report")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Google" provider
5. Enable Google Sign-In by toggling the switch
6. Add your authorized domain (localhost for development)
7. Click "Save"

## Step 3: Create a Web App

1. In your Firebase project, click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Enter an app nickname (e.g., "Safety Support Report Web")
6. Check "Also set up Firebase Hosting" if you plan to deploy
7. Click "Register app"
8. Copy the Firebase configuration object

## Step 4: Set Up Environment Variables

1. Copy the `env.example` file to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Replace the placeholder values in `.env.local` with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id
   ```

## Step 5: Set Up Firestore Database (Optional)

If you want to store user data and reports in Firestore:

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users
5. Click "Done"

## Step 6: Configure Security Rules (Firestore)

If using Firestore, update the security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reports - users can create, admins can read all
    match /reports/{reportId} {
      allow create: if request.auth != null;
      allow read, write: if request.auth != null && 
        (resource.data.reporterId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin', 'country_admin']);
    }
  }
}
```

## Step 7: Test the Setup

1. Start the development server:
   ```bash
   npm run dev:full
   ```

2. Open your browser to `http://localhost:8080` (or the port shown)
3. Try signing in with Google
4. Check the browser console for any errors

## Troubleshooting

### Common Issues

1. **"Firebase is not configured" error**
   - Make sure all environment variables are set in `.env.local`
   - Restart the development server after changing environment variables

2. **"Google sign-in failed" error**
   - Check that Google Sign-In is enabled in Firebase Console
   - Verify your domain is authorized in Firebase Console
   - Check browser console for detailed error messages

3. **"Permission denied" error (Firestore)**
   - Update Firestore security rules
   - Make sure you're signed in with a valid account

4. **Port conflicts**
   - The API server will automatically try alternative ports
   - Check the console output for the actual port being used

### Development vs Production

For development:
- Use `localhost` in authorized domains
- Use test mode for Firestore
- Environment variables can be in `.env.local`

For production:
- Add your actual domain to authorized domains
- Set up proper Firestore security rules
- Use environment variables in your hosting platform

## Demo Accounts

For testing without Firebase, you can use these demo accounts:

- `admin.user@example.com` - Admin role
- `superadmin.user@example.com` - Super Admin role
- `country.user@example.com` - Country Admin role
- `case.user@example.com` - Case Worker role
- `field.user@example.com` - Field Officer role

Use any password with 6+ characters for these demo accounts.

## Next Steps

1. Set up Google Sheets integration (see `GOOGLE_APPS_SCRIPT_SETUP.md`)
2. Configure email notifications
3. Set up user role management
4. Deploy to production

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure Firebase project is properly configured
4. Check Firebase Console for authentication logs 
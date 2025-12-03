// ===================================
// Firebase Configuration
// ===================================
// REPLACE WITH YOUR OWN FIREBASE CONFIGURATION
// Get this from your Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
    apiKey: "AIzaSyYOUR_API_KEY_HERE",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890123456"
};

// ===================================
// Initialize Firebase
// ===================================
// Make sure to enable Authentication, Firestore, and Storage in your Firebase Console
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ===================================
// Firestore Settings (Optional)
// ===================================
// Enable offline persistence (good for PWA)
db.enablePersistence()
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled in one tab at a time.
          console.error('Firestore persistence failed: Multiple tabs open.');
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the features required to enable persistence.
          console.error('Firestore persistence failed: Browser not supported.');
      }
  });

console.log("Firebase Initialized Successfully.");

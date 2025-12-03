// ===================================
// auth.js (Updated for Modular SDK)
// ===================================

// Import the specific services you need from your firebase.js file
import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Function to log in a user
function loginUser(email, password) {
    // Use the imported 'auth' instance and the specific function
    return signInWithEmailAndPassword(auth, email, password);
}

// Function to log out a user
function logoutUser() {
    return signOut(auth);
}

// Set up an authentication state observer
function onAuthStateChanged(callback) {
    // Use the imported 'auth' instance and the specific function
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in.
            // Note: You would also import and use 'getDoc' and 'doc' from firestore to get user profile
            const profile = await getUserProfile(user.uid);
            callback({ user, profile });
        } else {
            // User is signed out.
            callback({ user: null, profile: null });
        }
    });
}

// You can export these functions to be used in other scripts
export { loginUser, logoutUser, onAuthStateChanged };

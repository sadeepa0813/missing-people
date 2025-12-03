// This file handles authentication logic.
// It relies on the 'auth' object being initialized in firebase.js

// Example function to sign up a new admin user
// This would typically be done in a secure backend environment, not client-side.
// For this demo, we'll assume an initial admin is created manually in the Firebase Console.
function signUpAdmin(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("Admin user created:", user);
            // You can then add this user's UID to a 'admins' collection in Firestore
            return db.collection('admins').doc(user.uid).set({
                email: email,
                role: 'Super Admin', // Or other roles
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .catch((error) => {
            console.error("Error signing up admin:", error);
        });
}

// Function to log in a user
function loginUser(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

// Function to log out a user
function logoutUser() {
    return auth.signOut();
}

// Function to get the current user's profile from Firestore
async function getUserProfile(uid) {
    try {
        const userDoc = await db.collection('admins').doc(uid).get();
        if (userDoc.exists) {
            return userDoc.data();
        } else {
            console.log("No such user profile!");
            return null;
        }
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
}

// Set up an authentication state observer
// This function will be called whenever the user's sign-in state changes.
function onAuthStateChanged(callback) {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // User is signed in.
            const profile = await getUserProfile(user.uid);
            callback({ user, profile });
        } else {
            // User is signed out.
            callback({ user: null, profile: null });
        }
    });
}


// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4quURBrgdNZQq2D_xpTFE0mezdjjiptg",
  authDomain: "taka-aa296.firebaseapp.com",
  projectId: "taka-aa296",
  storageBucket: "taka-aa296.firebasestorage.app",
  messagingSenderId: "1089979665683",
  appId: "1:1089979665683:web:998e38bbb11eecddb75ee6",
  measurementId: "G-Z8XK7KRTQK"
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let analytics: Analytics | null = null;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);

if (typeof window !== 'undefined') {
  // analytics = getAnalytics(app); // Temporarily commenting out as it can cause issues in some SSR environments without further checks.
                                  // If you specifically need analytics, ensure it's handled correctly for Next.js.
                                  // For now, focusing on auth setup.
}

export { app, auth, analytics };

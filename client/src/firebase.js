// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-1705.firebaseapp.com",
  projectId: "mern-blog-1705",
  storageBucket: "mern-blog-1705.firebasestorage.app",
  messagingSenderId: "807165314369",
  appId: "1:807165314369:web:3d7abee80db0efcc530dc0",
  measurementId: "G-RXKLVBGKQ1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1a6tkzqf8-7hbK0B7jVPmVPSwN6Jo0Rc",
  authDomain: "food-menu-app-ca392.firebaseapp.com",
  projectId: "food-menu-app-ca392",
  storageBucket: "food-menu-app-ca392.firebasestorage.app",
  messagingSenderId: "425944476317",
  appId: "1:425944476317:web:354cf70a06d6d8fb608274"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
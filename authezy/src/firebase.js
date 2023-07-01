// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAT-aPwo68_RvcgRgeGgBFWnFyOL0b_ouM",
    authDomain: "authezy-1fe38.firebaseapp.com",
    projectId: "authezy-1fe38",
    storageBucket: "authezy-1fe38.appspot.com",
    messagingSenderId: "360521044745",
    appId: "1:360521044745:web:6e9d27fcf178afe7f7b9d8"
};
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);

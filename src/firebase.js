// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider } from "firebase/auth";
import {getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkjyzHKbc8YBVsIAFe4WhB9d3Kzx4haLM",
  authDomain: "budgetbuddy-f1137.firebaseapp.com",
  projectId: "budgetbuddy-f1137",
  storageBucket: "budgetbuddy-f1137.appspot.com",
  messagingSenderId: "767667725496",
  appId: "1:767667725496:web:87e210919d8a1381a4804d",
  measurementId: "G-F7KP2J28QJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc };

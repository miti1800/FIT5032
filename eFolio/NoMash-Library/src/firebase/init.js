// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpjyt5CeloL_rK9i9rJK76O79P0aaUx0U",
  authDomain: "week7-miti.firebaseapp.com",
  projectId: "week7-miti",
  storageBucket: "week7-miti.firebasestorage.app",
  messagingSenderId: "521091350868",
  appId: "1:521091350868:web:4f477e30f53597953e48c1"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
export default db;
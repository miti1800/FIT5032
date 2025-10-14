import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDDkuzouU_bc46-QrEGpRj7nSar6GTAcvI",
  authDomain: "nutried-77949.firebaseapp.com",
  projectId: "nutried-77949",
  storageBucket: "nutried-77949.firebasestorage.app",
  messagingSenderId: "839081070965",
  appId: "1:839081070965:web:63bf71918e25b8ba8f833c"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
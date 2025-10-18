import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Initialize the Firebase app only once
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();
const storage = getStorage();

export { db, storage };
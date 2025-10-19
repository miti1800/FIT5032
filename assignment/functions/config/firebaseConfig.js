import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Initialize the app only if it hasn't been initialized yet
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();
const storage = getStorage();

export { db, storage };
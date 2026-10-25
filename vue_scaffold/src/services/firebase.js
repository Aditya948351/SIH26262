// Firebase Cloud Firestore & Sync Service (Project: sih26262)
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "sih26262",
  authDomain: "sih26262.firebaseapp.com",
  storageBucket: "sih26262.appspot.com"
};

let db = null;
let isOnline = false;

try {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  isOnline = true;
  console.log("Firebase Firestore connected for project sih26262");
} catch (err) {
  console.warn("Firebase operating in resilient offline/local mode", err);
}

export const FirebaseSync = {
  async logEvent(collectionName, data) {
    if (db && isOnline) {
      try {
        await addDoc(collection(db, collectionName), {
          ...data,
          clientTimestamp: new Date().toISOString()
        });
      } catch (e) {
        // Fallback silently for 100% offline uptime
      }
    }
  }
};

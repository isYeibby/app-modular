// Firebase config helper (JS)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Copied from FirebaseConfig.cs in the repo
const firebaseConfig = {
  apiKey: "AIzaSyBV-EtvnSAYSmcaSjNMdwbE-Cih988q1BI",
  authDomain: "mi-app-modular-ybmh.firebaseapp.com",
  projectId: "mi-app-modular-ybmh",
  storageBucket: "mi-app-modular-ybmh.firebasestorage.app",
  messagingSenderId: "472717752415",
  appId: "1:472717752415:web:10d7962d540bf1fffe03ea",
  measurementId: "G-JCMYW2G58X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };

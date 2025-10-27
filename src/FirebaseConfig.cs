// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBV-EtvnSAYSmcaSjNMdwbE-Cih988q1BI",
  authDomain: "mi-app-modular-ybmh.firebaseapp.com",
  projectId: "mi-app-modular-ybmh",
  storageBucket: "mi-app-modular-ybmh.firebasestorage.app",
  messagingSenderId: "472717752415",
  appId: "1:472717752415:web:10d7962d540bf1fffe03ea",
  measurementId: "G-JCMYW2G58X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

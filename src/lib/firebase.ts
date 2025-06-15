import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAy8b6l0IwPa-uHhhSgiyRSKncjsxzJQA",
  authDomain: "travelplan-809bc.firebaseapp.com",
  projectId: "travelplan-809bc",
  storageBucket: "travelplan-809bc.firebasestorage.app",
  messagingSenderId: "493250898366",
  appId: "1:493250898366:web:b191b86b6a556fb31a71ef",
  measurementId: "G-GH6D9B8TML"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

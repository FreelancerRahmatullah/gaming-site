// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// আপনার Firebase Console থেকে পাওয়া কোড এখানে বসান
const firebaseConfig = {
  apiKey: "AIzaSyA-OdbcnxBNFTluME13Mr9BjDR3bEqWG8U",
  authDomain: "gaming-site-3f5d2.firebaseapp.com",
  projectId: "gaming-site-3f5d2",
  storageBucket: "gaming-site-3f5d2.firebasestorage.app",
  messagingSenderId: "9696980924",
  appId: "1:9696980924:web:02c541b3baa639d97005b9",
  measurementId: "G-YFV793NPGJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Firebase client initialization for Next.js (anonymous uploads)
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBttFAFJW5rzrVArKfv9kr0BLSnJIv-2bY",
  authDomain: "mcp-cv.firebaseapp.com",
  projectId: "mcp-cv",
  storageBucket: "mcp-cv.firebasestorage.app",
  messagingSenderId: "359542354535",
  appId: "1:359542354535:web:41de2e87c92564fa6e1ac2"
};



const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db }; 
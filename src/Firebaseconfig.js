import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCDPium7XX1jFjFCuHoE_9HQ1jf0wjQzqk",
  authDomain: "texi-db.firebaseapp.com",
  projectId: "texi-db",
  storageBucket: "texi-db.firebasestorage.app",
  messagingSenderId: "905874751649",
  appId: "1:905874751649:web:a4570ced42c3669769b0e0",
  measurementId: "G-ZLJHBEVWN9"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };
export default app;
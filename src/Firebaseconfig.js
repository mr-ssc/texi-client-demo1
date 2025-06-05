import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAY3TseN8w0IvVJIxpaYvLKnP3H1DmtFYg",
  authDomain: "requiementgathering.firebaseapp.com",
  projectId: "requiementgathering",
  storageBucket: "requiementgathering.firebasestorage.app",
  messagingSenderId: "297040139948",
  appId: "1:297040139948:web:4a339a1d3150e95a3c3109",
  measurementId: "G-TB2KW7KLLB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };
export default app;
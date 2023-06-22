// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCf1cG9VbJStYR1Iwqxe7SZbmuul4tvrLk",
  authDomain: "snp-65.firebaseapp.com",
  projectId: "snp-65",
  storageBucket: "snp-65.appspot.com",
  messagingSenderId: "860809096143",
  appId: "1:860809096143:web:6f40a83bf3cf530f4ec0ba",
  measurementId: "G-M8BPVZJ4C9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getFirestore();

export { storage };
export default db;

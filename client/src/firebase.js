// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the below config object with your actual Firebase project config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCVEN8KVNKx0hjxXSNxmuhy-lVEosLrJ6k",
  authDomain: "my-okr-9ef5a.firebaseapp.com",
  projectId: "my-okr-9ef5a",
  storageBucket: "my-okr-9ef5a.firebasestorage.app",
  messagingSenderId: "1047149139393",
  appId: "1:1047149139393:web:e4eb5c92627831c8a7cb40",
  measurementId: "G-NYRREZE20W"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
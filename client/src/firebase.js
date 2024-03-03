// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-6d082.firebaseapp.com",
  projectId: "mern-estate-6d082",
  storageBucket: "mern-estate-6d082.appspot.com",
  messagingSenderId: "7767612409",
  appId: "1:7767612409:web:7868b33ecd2511703c7b28",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

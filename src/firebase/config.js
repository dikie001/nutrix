// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB3q1C6HxUWX_g0f8ZS4qwiTVnGebNxIIU",
  authDomain: "nutrix-169b9.firebaseapp.com",
  databaseURL: "https://nutrix-169b9-default-rtdb.firebaseio.com",
  projectId: "nutrix-169b9",
  storageBucket: "nutrix-169b9.firebasestorage.app",
  messagingSenderId: "902981789846",
  appId: "1:902981789846:web:8d5808bccf07ea7b8efab7",
  measurementId: "G-QP4590TSQK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4-ClUPcxJu6mk1HZzV5kTOqCe7aTGmCw",
  authDomain: "amquiz-react.firebaseapp.com",
  projectId: "amquiz-react",
  storageBucket: "amquiz-react.firebasestorage.app",
  messagingSenderId: "509293284157",
  appId: "1:509293284157:web:9802310d93767be3c39354",
  measurementId: "G-M0DD7WXZ23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
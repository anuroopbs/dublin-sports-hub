// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfOCjSQXA1hZvbxUk_bhZzDFkLxnkInLQ",
  authDomain: "dublin-sports-hub.firebaseapp.com",
  projectId: "dublin-sports-hub",
  storageBucket: "dublin-sports-hub.firebasestorage.app",
  messagingSenderId: "39820720000",
  appId: "1:39820720000:web:fb89bee759d9fdcf96f365",
  measurementId: "G-BXGT20LRNR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export the database and auth for use in other files
export { db, auth };
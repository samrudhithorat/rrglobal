// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZ63We38GdcsNBQVPWE5ItwJZURvK2Sis",
  authDomain: "rrglobalnexus-46be7.firebaseapp.com",
  projectId: "rrglobalnexus-46be7",
  storageBucket: "rrglobalnexus-46be7.firebasestorage.app",
  messagingSenderId: "965794180261",
  appId: "1:965794180261:web:139ccac3d779a9cf2c314c",
  measurementId: "G-B8M0DPCN85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
// firebaseConfig.js
// Replace the values with your Firebase project credentials from the Firebase console.
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA8Inqj8vqFYIxB-BGft_9hBQtb2gPcts4",
    authDomain: "sharmila-portfolio.firebaseapp.com",
    projectId: "sharmila-portfolio",
    storageBucket: "sharmila-portfolio.firebasestorage.app",
    messagingSenderId: "316701396353",
    appId: "1:316701396353:web:1244d0d7cf71d409292c80"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

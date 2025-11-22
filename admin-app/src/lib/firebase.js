import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA8Inqj8vqFYIxB-BGft_9hBQtb2gPcts4",
    authDomain: "sharmila-portfolio.firebaseapp.com",
    projectId: "sharmila-portfolio",
    storageBucket: "sharmila-portfolio.firebasestorage.app",
    messagingSenderId: "316701396353",
    appId: "1:316701396353:android:6b0e0de493d8fb01292c80"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

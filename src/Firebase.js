import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDuTt32saeLMlbe8ECBxFGp_wJGtpxsUxo",
    authDomain: "votingapp-29c2f.firebaseapp.com",
    projectId: "votingapp-29c2f",
    storageBucket: "votingapp-29c2f.appspot.com",
    messagingSenderId: "533256827680",
    appId: "1:533256827680:web:a8b1b8980364f8c7805d45",
};

// Firebase initialization
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

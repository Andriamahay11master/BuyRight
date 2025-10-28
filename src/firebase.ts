// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMjVNFekfsNyPR6w-xbcaPg3nuo-ei7Rg",
  authDomain: "buyright-e9f00.firebaseapp.com",
  projectId: "buyright-e9f00",
  storageBucket: "buyright-e9f00.firebasestorage.app",
  messagingSenderId: "516803355710",
  appId: "1:516803355710:web:23a9679c918f0859955d6f",
  measurementId: "G-G878CDQLV2",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export default { app, analytics, auth, db };

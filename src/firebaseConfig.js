// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA218N2FLnofX5KOvCiWX2gak65LIVqtvU",
    authDomain: "react-firebase-b0785.firebaseapp.com",
    projectId: "react-firebase-b0785",
    storageBucket: "react-firebase-b0785.appspot.com",
    messagingSenderId: "469664547595",
    appId: "1:469664547595:web:d370115b675419756a980e",
    measurementId: "G-TM47929K4B"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
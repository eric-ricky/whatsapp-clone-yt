// Import the functions you need from the SDKs you need
// import firebase from "firebase";

import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxRcRin196Q1HjWW6fNCeMwTPUS5MgjRs",
  authDomain: "whatsapp-clone-sonny-san-d0fb1.firebaseapp.com",
  projectId: "whatsapp-clone-sonny-san-d0fb1",
  storageBucket: "whatsapp-clone-sonny-san-d0fb1.appspot.com",
  messagingSenderId: "809528400877",
  appId: "1:809528400877:web:82bf644b1e469dcd26e5e4",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// const app = !firebase.apps.length
//   ? initializeApp(firebaseConfig)
//   : firebase.app();

// const db = app.firestore();
// const auth = app.auth();
// const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };

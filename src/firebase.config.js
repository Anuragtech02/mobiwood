import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvdBJhMeKzjLTlHwvmKXjCxuIRHTPy2N4",
  authDomain: "talent-e8b22.firebaseapp.com",
  databaseURL: "https://talent-e8b22.firebaseio.com",
  projectId: "talent-e8b22",
  storageBucket: "talent-e8b22.appspot.com",
  messagingSenderId: "130312623882",
  appId: "1:130312623882:web:c4593f357104a7beed8cf3",
  measurementId: "G-HJ1T6LT9JP",
};
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};

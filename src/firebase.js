import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBSJ-MqbjgrO8u7R-dxcS5sRxK8DWVMRxQ",
  authDomain: "worldcup-predictor-51c31.firebaseapp.com",
  projectId: "worldcup-predictor-51c31",
  storageBucket: "worldcup-predictor-51c31.firebasestorage.app",
  messagingSenderId: "799838659312",
  appId: "1:799838659312:web:6b44be660a3108101b5835"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Auth Helpers
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};

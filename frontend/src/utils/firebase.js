// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjHnWpV0VcQATIHkAz3Tgk_Lwi9P0a2HU",
  authDomain: "blog-app-7b63d.firebaseapp.com",
  projectId: "blog-app-7b63d",
  storageBucket: "blog-app-7b63d.firebasestorage.app",
  messagingSenderId: "560343726456",
  appId: "1:560343726456:web:51bd8b7c4a42c14f26308d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export async function googleAuth() {
  try {
    let data = await signInWithPopup(auth, provider);
    return data;
  } catch (error) {
    toast.error("Please try again later");
  }
}

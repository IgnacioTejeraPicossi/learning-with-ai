// Replace with your actual config from Firebase Console
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {

    apiKey: "AIzaSyB9jNx5pj5-KauoMnrKgwgqWEB5bFUu0cA",
  
    authDomain: "ai-learning-platform-71fcd.firebaseapp.com",
  
    projectId: "ai-learning-platform-71fcd",
  
    storageBucket: "ai-learning-platform-71fcd.firebasestorage.app",
  
    messagingSenderId: "970774568929",
  
    appId: "1:970774568929:web:4b263e342c77474eb93ca0"
  
  };
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

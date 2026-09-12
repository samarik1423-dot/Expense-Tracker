// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7IN2nEkQoJGPt0yapMpIttjAFu7pmmrs",
  authDomain: "my-expense-tracker-app-dcc5b.firebaseapp.com",
  projectId: "my-expense-tracker-app-dcc5b",
  storageBucket: "my-expense-tracker-app-dcc5b.firebasestorage.app",
  messagingSenderId: "226504399568",
  appId: "1:226504399568:web:915f3387b494b6c4ea1cd5",
  measurementId: "G-0C1RKRM8LE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Экспортируем auth для регистрации/входа
export const auth = getAuth(app);
export default app;

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqKJV-LaAQty9jYrOZDt68rJhGQt5yBFU",
  authDomain: "todo-application-95abd.firebaseapp.com",
  projectId: "todo-application-95abd",
  storageBucket: "todo-application-95abd.appspot.com",
  messagingSenderId: "37912690427",
  appId: "1:37912690427:web:9ad511dc94ef2786c83a5e",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };

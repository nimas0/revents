import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

// You can call multiple imports to avoid importing the entire firebase sdk

const firebaseConfig = {
    apiKey: "AIzaSyDgJ_29A-zlqn3H03Dgom6oIyTRJdIIfKg",
    authDomain: "revents-80570.firebaseapp.com",
    databaseURL: "https://revents-80570.firebaseio.com",
    projectId: "revents-80570",
    storageBucket: "revents-80570.appspot.com",
    messagingSenderId: "393430299969",
    appId: "1:393430299969:web:61ac0e1e29506feb5d9dc0",
    measurementId: "G-0L59PW86Y6"
  };

  firebase.initializeApp(firebaseConfig);
  firebase.firestore();

  export default firebase;
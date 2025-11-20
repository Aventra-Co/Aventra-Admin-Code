// Import Firebase modules
import 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {

  apiKey: "AIzaSyB8FxTSDhhEmL8rFwW5qdDYECEyHX_ul_0",

  authDomain: "my-boat-a9c54.firebaseapp.com",

  databaseURL: "https://my-boat-a9c54-default-rtdb.firebaseio.com",

  projectId: "my-boat-a9c54",

  storageBucket: "my-boat-a9c54.firebasestorage.app",

  messagingSenderId: "83903925512",

  appId: "1:83903925512:web:05db133012c6cbcc7bb0bd",

  measurementId: "G-XJG32KXL5L"

};


// Firebase configuration
// const firebaseConfig = {

//   apiKey: "AIzaSyC7LRqOD4SaMP0H95DYral1_nWIV1O6peU",
//   authDomain: "happinessindia-4b101.firebaseapp.com",
//   databaseURL: "https://happinessindia-4b101-default-rtdb.firebaseio.com",
//   projectId: "happinessindia-4b101",
//   storageBucket: "happinessindia-4b101.firebasestorage.app",
//   messagingSenderId: "54316471737",
//   appId: "1:54316471737:web:a28471b2f7a6d0d02bd268",
//   measurementId: "G-NWLC4HQ4Z5"
// };


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Export the database instance
export const database = getDatabase(app);

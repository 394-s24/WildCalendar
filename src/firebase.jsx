// import firebase from 'firebase/app';
import * as firebase from "firebase/app";

import 'firebase/app'


// // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase} from 'firebase/database';
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCTYcYGvNOL8dr9Fx3-15PXpJXxtIshhTg",
    authDomain: "wildcalendar-f3b5d.firebaseapp.com",
    databaseURL: "https://wildcalendar-f3b5d-default-rtdb.firebaseio.com",
    projectId: "wildcalendar-f3b5d",
    storageBucket: "wildcalendar-f3b5d.appspot.com",
    messagingSenderId: "480989815783",
    appId: "1:480989815783:web:208f3ada1d9c59f034d342",
    measurementId: "G-VM5K16BR3T"
  };

// Initialize Firebase

// const app = initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const database = getDatabase(app); 



// const database = app.database();
// const database = getDatabase(app);
export {firebase, database};

// const analytics = getAnalytics(app);


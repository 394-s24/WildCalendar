import * as firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getDatabase, get, set, push, ref } from 'firebase/database';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const getData = async (pathname) => {
    return await get(ref(database, pathname));
};

const setData = async (pathname, data) => {
    return await set(ref(database, pathname), data);
};

const pushData = async (pathname, data) => {
    return await push(ref(database, pathname), data);
};

const login = async () => {
    return signInWithPopup(auth, provider);
};

const observeAuthState = (callback) => {
    onAuthStateChanged(auth, callback);
};

export { firebase, database, getData, setData, pushData, login, observeAuthState };

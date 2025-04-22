// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, set, get, push, remove, update } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDvGJVG0qTA24cr_OAL9gQvlKaM6-L5o2g",
    authDomain: "bjd-doll-collection.firebaseapp.com",
    databaseURL: "https://bjd-doll-collection-default-rtdb.firebaseio.com",
    projectId: "bjd-doll-collection",
    storageBucket: "bjd-doll-collection.firebasestorage.app",
    messagingSenderId: "737802524264",
    appId: "1:737802524264:web:0bb6cabb8b372704fa8ddd",
    measurementId: "G-K8JB1C9GZZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const storage = getStorage(app);

// 導出所需的函數和對象
export {
    database,
    storage,
    ref,
    storageRef,
    onValue,
    set,
    get,
    push,
    remove,
    update,
    uploadBytes,
    getDownloadURL
};
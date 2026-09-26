import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDwqCNyePMWjCrcOUmuwSpZ1GEdK0ymHIM",
    authDomain: "gym-apolo-f7c42.firebaseapp.com",
    projectId: "gym-apolo-f7c42",
    storageBucket: "gym-apolo-f7c42.firebasestorage.app",
    messagingSenderId: "435455351622",
    appId: "1:435455351622:web:c7e25bce92612e73b2a347"
};

const aplicacion = initializeApp(firebaseConfig);
const db = getFirestore(aplicacion);

export { db };

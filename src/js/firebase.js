/*import { initializeApp }
from "firebase/app";

import {
getFirestore
}
from "firebase/firestore";*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {

apiKey:"AIzaSyBnc9IffckB5h1NiQV-NACkDfpgv3gr15A",

authDomain:
"council-of-young-scientists.firebaseapp.com",

projectId:
"council-of-young-scientists",

storageBucket:
"council-of-young-scientists.firebasestorage.app",

messagingSenderId:
"820465028154",

appId:
"1:820465028154:web:8a15dbf452a539d16cb903"

};

/*import {
getAuth
}
from "firebase/auth";*/
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

const auth =
getAuth(app);

export { 
    db, 
    auth 
};
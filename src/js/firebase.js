import { initializeApp }
from "firebase/app";

import {
    getFirestore
}
from "firebase/firestore";

const firebaseConfig = {

    apiKey:"***",

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

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

export { db };
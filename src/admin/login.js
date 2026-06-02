import { auth }
from "../js/firebase.js";

import {

signInWithEmailAndPassword

}
from "firebase/auth";

const form =
document.getElementById(
"loginForm"
);

form.addEventListener(
"submit",
async(e)=>
{

e.preventDefault();

const email =
document.getElementById(
"email"
).value;

const password =
document.getElementById(
"password"
).value;

try
{

await signInWithEmailAndPassword(

auth,
email,
password

);

window.location.href =
"/src/admin/admin.html";

}
catch(error)
{

document.getElementById(
"error"
).textContent =
"Неправильний логін або пароль.";

}

});
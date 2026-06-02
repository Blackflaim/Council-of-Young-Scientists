import { db }
from "../js/firebase.js";

import {

collection,
addDoc,
getDocs,
deleteDoc,
doc

}
from "firebase/firestore";

import { auth }
from "../js/firebase.js";

import {

onAuthStateChanged,
signOut

}
from "firebase/auth";

onAuthStateChanged(

auth,

(user)=>
{

if(!user)
{

window.location.href=
"/src/admin/login.html";

}

});

const modal =
document.getElementById(
"modal"
);

const openBtn =
document.getElementById(
"openModal"
);

const form =
document.getElementById(
"newsForm"
);

const list =
document.getElementById(
"newsList"
);

const deleteToggle =
document.getElementById(
"toggleDelete"
);

const newsCollection =
collection(
db,
"news"
);

let deleteMode = false;



/* ---------- OPEN MODAL ---------- */

openBtn.addEventListener(
"click",
() =>
{
modal.classList.remove(
"hidden"
);
}
);



/* ---------- DELETE MODE ---------- */

deleteToggle.addEventListener(
"click",
() =>
{

deleteMode = !deleteMode;

loadNews();

deleteToggle.textContent =

deleteMode

?

"✓ Завершити видалення"

:

"− Видалити новину";

}
);



/* ---------- ADD NEWS ---------- */

form.addEventListener(
"submit",

async (event)=>
{

event.preventDefault();

const title =
document.getElementById(
"title"
).value;

const description =
document.getElementById(
"description"
).value;

const content =
document.getElementById(
"content"
).value;

const image =
document.getElementById(
"image"
).value;



try
{

await addDoc(
newsCollection,
{

title,
description,
content,
image

}
);

form.reset();

modal.classList.add(
"hidden"
);

loadNews();

}

catch(error)
{

console.error(
"Firebase add error:",
error
);

}

}
);



/* ---------- LOAD NEWS ---------- */

async function loadNews()
{

list.innerHTML='';

try
{

const snapshot =
await getDocs(
newsCollection
);

snapshot.forEach(
(docItem)=>
{

const item =
docItem.data();

const card =
document.createElement(
"div"
);

card.className =
"news-card";

card.innerHTML = `

${
item.image

?

`<img
src="${item.image}"
alt="news image">`

:

""
}

<h3>
${item.title}
</h3>

<p>
${item.description}
</p>

${
deleteMode

?

`
<button
class="delete-btn">

Видалити

</button>
`

:

""
}

`;



if(deleteMode)
{

const deleteBtn =
card.querySelector(
".delete-btn"
);

deleteBtn.addEventListener(
"click",

async ()=>{

await deleteNews(
docItem.id
);

}
);

}

list.appendChild(
card
);

});

}

catch(error)
{

console.error(
"Load error:",
error
);

}

}



/* ---------- DELETE NEWS ---------- */

async function deleteNews(id)
{

try
{

await deleteDoc(

doc(
db,
"news",
id
)

);

loadNews();

}

catch(error)
{

console.error(
"Delete error:",
error
);

}

}



/* ---------- INITIAL LOAD ---------- */

loadNews();


/* ---------- LOGOUT BUTTON ---------- */
document
.getElementById(
"logoutBtn"
)
.addEventListener(

"click",

async()=>
{

await signOut(auth);

window.location.href=
"/";

}

);
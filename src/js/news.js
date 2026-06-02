import { db }
from "./firebase.js";

import {

collection,
getDocs

}
from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const container =
document.getElementById(
"newsContainer"
);

const newsCollection =
collection(
db,
"news"
);

async function loadNews()
{

if(!container)
return;

container.innerHTML='';

const snapshot =
await getDocs(
newsCollection
);

snapshot.forEach(docItem =>
{

const item =
docItem.data();

container.innerHTML += `

<article class="news-card">

${
item.image
?
`
<img
src="${item.image}"
alt="${item.title}">
`
:
''
}

<div class="news-body">

<h3>
${item.title}
</h3>

<p>
${item.description}
</p>

<a
href="/news.html?id=${docItem.id}"
class="news-read-more">

Читати далі →

</a>

</div>

</article>

`;

});

}

loadNews();
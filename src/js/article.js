import { db }
from "./firebase.js";

import {

doc,
getDoc

}
from "firebase/firestore";

const params =
new URLSearchParams(
window.location.search
);

const id =
params.get('id');

const container =
document.getElementById(
"articleContainer"
);

async function loadArticle()
{

if(!id)
return;

const reference =
doc(
db,
"news",
id
);

const snapshot =
await getDoc(
reference
);

if(!snapshot.exists())
{

container.innerHTML=
`
<h2>
Новину не знайдено
</h2>
`;

return;

}

const article =
snapshot.data();

container.innerHTML = `

<h1>
${article.title}
</h1>

${
article.image
?
`
<img
src="${article.image}"
alt="${article.title}">
`
:
''
}

<p>
${article.content}
</p>

`;

}

loadArticle();
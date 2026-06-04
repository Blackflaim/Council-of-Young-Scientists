import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

const container = document.getElementById("newsContainer");

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function loadAllNews() {
    if(!container || id) return;

    const snapshot = await getDocs(collection(db, "news"));
    container.innerHTML = "";

    snapshot.forEach(docItem => {
        const news = docItem.data();

        container.innerHTML += `
        <article class="news-card">
            ${
                news.image && news.image !== "none"
                ? `<img src="${news.image}" alt="${news.title}">`
                : ''
            }
            <div class="news-body">
                <h3>${news.title}</h3>
                <p>${news.description}</p>
                <a href="/news.html?id=${docItem.id}" class="news-read-more">Читати далі →</a>
            </div>
        </article>
        `;
    });
}

loadAllNews();
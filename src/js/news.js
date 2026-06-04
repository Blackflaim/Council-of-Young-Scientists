import { db } from "./firebase.js";
import { collection, getDocs, query, limit } from "firebase/firestore"; // Не забудь додати query та limit сюди

const container = document.getElementById("newsContainer");
const newsCollection = collection(db, "news");

async function loadNews() {
    if(!container) return;

    container.innerHTML = '';

    // Створюємо запит: взяти колекцію "news", але завантажити 4 штуки
    const q = query(newsCollection, limit(5));
    const snapshot = await getDocs(q);

    let index = 0; 

    snapshot.forEach(docItem => {
        const item = docItem.data();
        
        // Перша новина (index === 0) отримує клас featured
        const featuredClass = index === 0 ? "featured" : ""; 

        container.innerHTML += `
        <article class="news-card ${featuredClass}">
            ${
                item.image && item.image !== "none"
                ? `<div class="news-img"><img src="${item.image}" alt="${item.title}"></div>`
                : ''
            }
            <div class="news-body">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <a href="/news.html?id=${docItem.id}" class="news-read-more">Читати далі →</a>
            </div>
        </article>
        `;
        
        index++; 
    });
}

loadNews();
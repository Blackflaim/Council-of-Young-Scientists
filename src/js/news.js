import { db } from "./firebase.js";
import { collection, getDocs, query, limit} from "firebase/firestore";

const container = document.getElementById("newsContainer");
const newsCollection = collection(db, "news");

async function loadNewsPreview() {
    if (!container) return;

    try {
        // Завантажуємо рівно 5 новин
        const q = query(newsCollection, limit(5));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            container.innerHTML = '<p style="text-align:center;">Новин поки немає.</p>';
            return;
        }

        let htmlString = '';
        let index = 0;

        snapshot.forEach(docItem => {
            const item = docItem.data();
            
            const isFeatured = index === 0;
            const featuredClass = isFeatured ? " featured" : "";

            let imageHtml = '';
            if (item.image && item.image !== "none") {
                imageHtml = `<img src="${item.image}" alt="${item.title}" class="news-cover">`;
            } else {
                imageHtml = `<div class="news-img-placeholder">📰</div>`;
            }

            // Оверлей тільки для головної картки
            const overlayHtml = isFeatured ? `<div class="news-img-overlay"></div>` : '';

            // Опис тільки для головної картки
            const descriptionHtml = isFeatured && item.description 
                ? `<p>${item.description}</p>` 
                : '';

            // Безпечна дата (якщо в базі немає дати, ставимо заглушку)
            const dateStr = item.date || "06.06.2026";

            // Формуємо фінальну картку
            htmlString += `
            <div class="news-card${featuredClass}" onclick="window.location.href='/news.html?id=${docItem.id}'">
                <div class="news-img">
                    ${imageHtml}
                    ${overlayHtml}
                    <div class="news-date">${dateStr}</div>
                </div>
                <div class="news-body">
                    <h3>${item.title}</h3>
                    ${descriptionHtml}
                    <a href="/news.html?id=${docItem.id}" class="news-read-more">Читати далі &rarr;</a>
                </div>
            </div>
            `;

            index++;
        });

        // Вставляємо все в контейнер і гарантуємо наявність класу сітки
        container.innerHTML = htmlString;
        container.classList.add("news-grid");

    } catch (error) {
        console.error("Помилка завантаження прев'ю новин:", error);
    }
}

loadNewsPreview();
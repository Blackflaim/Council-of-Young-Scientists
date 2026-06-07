import { db } from "./firebase.js";
import { collection, getDocs, query, limit } from "firebase/firestore";

const container = document.getElementById("newsContainer");
const newsCollection = collection(db, "news");
const currentLang = localStorage.getItem("site_lang") || "ua";

async function loadNewsPreview() {
    if (!container) return;

    try {
        const q = query(newsCollection, limit(5));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            container.innerHTML = `<p style="text-align:center;">${currentLang === 'en' ? 'No news available.' : 'Новин поки немає.'}</p>`;
            return;
        }

        let htmlString = '';
        let index = 0;

        snapshot.forEach(docItem => {
            const item = docItem.data();
            
            const isFeatured = index === 0;
            const featuredClass = isFeatured ? " featured" : "";

            // Логіка перекладу
            const displayTitle = (currentLang === 'en' && item.title_en) ? item.title_en : item.title;
            const displayDesc = (currentLang === 'en' && item.description_en) ? item.description_en : item.description;

            // Логіка для зображення
            let imageHtml = '';
            if (item.image && item.image !== "none") {
                imageHtml = `<img src="${item.image}" alt="${displayTitle}" class="news-cover">`;
            } else {
                imageHtml = `<div class="news-img-placeholder">📰</div>`;
            }

            const overlayHtml = isFeatured ? `<div class="news-img-overlay"></div>` : '';
            const descriptionHtml = isFeatured && displayDesc ? `<p>${displayDesc}</p>` : '';
            const dateStr = item.date || "06.06.2026";
            const readMoreText = currentLang === 'en' ? 'Read more' : 'Читати далі';

            // Формуємо фінальну картку
            htmlString += `
            <div class="news-card${featuredClass}" onclick="window.location.href='/news.html?id=${docItem.id}'">
                <div class="news-img">
                    ${imageHtml}
                    ${overlayHtml}
                    <div class="news-date">${dateStr}</div>
                </div>
                <div class="news-body">
                    <h3>${displayTitle}</h3>
                    ${descriptionHtml}
                    <a href="/news.html?id=${docItem.id}" class="news-read-more">${readMoreText} &rarr;</a>
                </div>
            </div>
            `;

            index++;
        });

        container.innerHTML = htmlString;
        container.classList.add("news-grid");

    } catch (error) {
        console.error("Помилка завантаження прев'ю новин:", error);
    }
}

loadNewsPreview();
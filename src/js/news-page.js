import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

const container = document.getElementById("newsContainer");
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const pageHeader = document.querySelector('.page-header');
const pageTitle = document.getElementById("dynamic-page-title");
const pageDesc = document.getElementById("dynamic-page-desc");

const currentLang = localStorage.getItem("site_lang") || "ua";

async function loadAllNews() {
    // Якщо контейнера немає або є ID — зупиняємось
    if (!container || id) return;

    // Переконуємося, що шапка видима для списку новин
    if (pageHeader) {
        pageHeader.style.display = 'block';
    }

    // Встановлюємо текст заголовків
    if (pageTitle) {
        pageTitle.removeAttribute("data-i18n");
        pageTitle.innerHTML = currentLang === 'en' ? "News" : "Новини";
    }
    if (pageDesc) {
        pageDesc.removeAttribute("data-i18n");
        pageDesc.innerHTML = currentLang === 'en' ? "Latest events, announcements, and achievements" : "Актуальні події, анонси та досягнення";
    }

    try {
        container.innerHTML = `<p class="loading-text" style="grid-column: 1 / -1; text-align: center;">${currentLang === 'en' ? 'Loading news...' : 'Завантаження новин...'}</p>`;

        const snapshot = await getDocs(collection(db, "news"));
        
        if (snapshot.empty) {
            container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">${currentLang === 'en' ? 'No news available right now.' : 'Наразі новин немає.'}</p>`;
            return;
        }

        const htmlString = snapshot.docs.map(docItem => {
            const news = docItem.data();
            
            // Логіка перекладу
            const displayTitle = (currentLang === 'en' && news.title_en) ? news.title_en : news.title;
            const displayDesc = (currentLang === 'en' && news.description_en) ? news.description_en : news.description;
            
            let imageHtml = '';
            if (news.image && news.image !== "none") {
                imageHtml = `<img src="${news.image}" alt="${displayTitle}" class="news-cover">`;
            } else {
                imageHtml = `<div class="news-img-placeholder">📰</div>`;
            }

            const dateStr = news.date || "06.06.2026";
            const readMoreText = currentLang === 'en' ? 'Read more' : 'Читати далі';
            const defaultDesc = currentLang === 'en' ? 'Detailed information...' : 'Детальна інформація...';

            return `
            <article class="news-card" onclick="window.location.href='/news.html?id=${docItem.id}'">
                <div class="news-img">
                    ${imageHtml}
                    <div class="news-date">${dateStr}</div>
                </div>
                <div class="news-body">
                    <h3>${displayTitle}</h3>
                    <p>${displayDesc || defaultDesc}</p>
                    <a href="/news.html?id=${docItem.id}" class="news-read-more">${readMoreText} &rarr;</a>
                </div>
            </article>
            `;
        }).join('');

        container.innerHTML = htmlString;

    } catch (error) {
        console.error("Помилка завантаження новин:", error);
        container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #d32f2f;"><p>${currentLang === 'en' ? 'Failed to load news.' : 'Не вдалося завантажити новини.'}</p></div>`;
    }
}

loadAllNews();
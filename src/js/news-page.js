import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

const container = document.getElementById("newsContainer");
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// Знаходимо елементи шапки
const pageHeader = document.querySelector('.page-header');
const pageTitle = document.getElementById("dynamic-page-title");
const pageDesc = document.getElementById("dynamic-page-desc");

async function loadAllNews() {
    // Якщо є ID (ми на сторінці однієї новини) — зупиняємось
    if (!container || id) return;

    // 👇 НОВИЙ КОД: Переконуємося, що шапка видима для списку новин
    if (pageHeader) {
        pageHeader.style.display = 'block';
    }

    // Встановлюємо текст заголовків для сторінки ВСІХ новин
    if (pageTitle) {
        pageTitle.removeAttribute("data-i18n");
        pageTitle.innerHTML = "Новини";
    }
    if (pageDesc) {
        pageDesc.removeAttribute("data-i18n");
        pageDesc.innerHTML = "Актуальні події, анонси та досягнення";
    }

    try {
        container.innerHTML = '<p class="loading-text" style="grid-column: 1 / -1; text-align: center;">Завантаження новин...</p>';

        const snapshot = await getDocs(collection(db, "news"));
        
        if (snapshot.empty) {
            container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Наразі новин немає.</p>';
            return;
        }

        const htmlString = snapshot.docs.map(docItem => {
            const news = docItem.data();
            
            let imageHtml = '';
            if (news.image && news.image !== "none") {
                imageHtml = `<img src="${news.image}" alt="${news.title}" class="news-cover">`;
            } else {
                imageHtml = `<div class="news-img-placeholder">📰</div>`;
            }

            const dateStr = news.date || "06.06.2026";

            return `
            <article class="news-card" onclick="window.location.href='/news.html?id=${docItem.id}'">
                <div class="news-img">
                    ${imageHtml}
                    <div class="news-date">${dateStr}</div>
                </div>
                <div class="news-body">
                    <h3>${news.title}</h3>
                    <p>${news.description || 'Детальна інформація...'}</p>
                    <a href="/news.html?id=${docItem.id}" class="news-read-more">Читати далі &rarr;</a>
                </div>
            </article>
            `;
        }).join('');

        container.innerHTML = htmlString;

    } catch (error) {
        console.error("Помилка завантаження новин:", error);
        container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #d32f2f;"><p>Не вдалося завантажити новини.</p></div>`;
    }
}

loadAllNews();
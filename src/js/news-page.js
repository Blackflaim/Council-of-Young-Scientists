import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

const container = document.getElementById("newsContainer");
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// Знаходимо заголовки сторінки
const pageTitle = document.getElementById("dynamic-page-title");
const pageDesc = document.getElementById("dynamic-page-desc");

async function loadAllNews() {
    // Якщо контейнера немає, або є ID (ми на сторінці однієї новини) — зупиняємось
    if (!container || id) return;

    // Змінюємо заголовок для сторінки ВСІХ новин
    if (pageTitle) {
        pageTitle.removeAttribute("data-i18n");
        pageTitle.innerHTML = "Новини";
    }
    if (pageDesc) {
        pageDesc.removeAttribute("data-i18n");
        pageDesc.innerHTML = "Актуальні події, анонси та досягнення";
    }

    try {
        // Показуємо стан завантаження, поки чекаємо дані з бази
        container.innerHTML = '<p class="loading-text" style="grid-column: 1 / -1; text-align: center;">Завантаження новин...</p>';

        const snapshot = await getDocs(collection(db, "news"));
        
        // Перевіряємо, чи взагалі є новини в базі
        if (snapshot.empty) {
            container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Наразі новин немає. Загляніть сюди пізніше!</p>';
            return;
        }

        const htmlString = snapshot.docs.map(docItem => {
            const news = docItem.data();
            
            const imageHtml = (news.image && news.image !== "none")
                ? `<img src="${news.image}" alt="${news.title}">`
                : `<div class="news-img"><div class="news-img-placeholder">📰</div></div>`;

            return `
            <article class="news-card">
                ${imageHtml}
                <div class="news-body">
                    <h3>${news.title}</h3>
                    <p>${news.description || 'Детальна інформація...'}</p>
                    <a href="/news.html?id=${docItem.id}" class="news-read-more">Читати далі &rarr;</a>
                </div>
            </article>
            `;
        }).join(''); // Об'єднуємо масив рядків в один суцільний текст

        // Вставляємо готовий HTML у DOM
        container.innerHTML = htmlString;

    } catch (error) {
        console.error("Помилка завантаження новин:", error);
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #d32f2f;">
                <p>Не вдалося завантажити новини. Спробуйте оновити сторінку.</p>
            </div>
        `;
    }
}

loadAllNews();
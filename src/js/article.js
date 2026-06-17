import { db } from "./firebase.js";
import { doc, getDoc } from "firebase/firestore";

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const container = document.getElementById("articleContainer");
const newsContainer = document.getElementById("newsContainer");
const pageHeader = document.querySelector('.page-header');

const currentLang = localStorage.getItem("site_lang") || "ua";

async function loadArticle() 
{
    // Якщо ID немає — зупиняємось
    if (!id) return;

    // Ховаємо верхню синю шапку
    if (pageHeader) {
        pageHeader.style.display = 'none';
    }

    // Знищуємо контейнер усіх новин
    if (newsContainer) {
        newsContainer.innerHTML = ''; 
        newsContainer.style.display = 'none';
    }

    try {
        container.innerHTML = `<p class="loading-text" style="text-align:center; padding: 40px;">${currentLang === 'en' ? 'Loading article...' : 'Завантаження статті...'}</p>`;

        const reference = doc(db, "news", id);
        const snapshot = await getDoc(reference);

        if (!snapshot.exists()) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h2>${currentLang === 'en' ? 'Article not found' : 'Новину не знайдено'}</h2>
                    <a href="/news.html" class="btn-primary" style="margin-top: 20px;">${currentLang === 'en' ? 'Back to news' : 'Повернутися до новин'}</a>
                </div>
            `;
            return;
        }

        const article = snapshot.data();

        const displayTitle = (currentLang === 'en' && article.title_en) ? article.title_en : article.title;
        const displayContent = (currentLang === 'en' && article.content_en) ? article.content_en : article.content;
        
        let videoHtml = '';
        if (article.video && article.video.trim() !== "") 
        {
            videoHtml = `
                <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 30px 0; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <iframe src="${article.video}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
                </div>
            `;
        }

        const btnHomeText = currentLang === 'en' ? '&larr; Back to Home' : '&larr; На головну';
        const btnAllNewsText = currentLang === 'en' ? 'All News &rarr;' : 'До всіх новин &rarr;';
        const emptyContentText = currentLang === 'en' ? '<p>No content available.</p>' : '<p>Немає тексту новини.</p>';

        container.innerHTML = `
            <article class="article-page" style="padding-top: 40px;"> 
                <h1 style="font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 700; margin-bottom: 24px;">${displayTitle}</h1>
                
                ${article.image && article.image !== "none" ? `<img class="article-image" src="${article.image}" alt="${displayTitle}">` : ''}
                
                ${videoHtml}
                
                <div class="article-content" style="margin-top: 30px;">
                    ${displayContent || emptyContentText}
                </div>
                
                <div style="margin-top: 40px; border-top: 1px solid #e8ecf0; padding-top: 20px; margin-bottom: 60px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
                    <a href="/index.html#news" class="btn-outline btn-dark">${btnHomeText}</a>
                    <a href="/news.html" class="btn-outline btn-dark">${btnAllNewsText}</a>
                </div>
            </article>
        `;

    } catch (error) {
        console.error("Помилка завантаження статті:", error);
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2>${currentLang === 'en' ? 'An error occurred' : 'Сталася помилка при завантаженні новини'}</h2>
                <a href="/news.html" class="btn-primary" style="margin-top: 20px;">${currentLang === 'en' ? 'Back to news' : 'Повернутися до новин'}</a>
            </div>
        `;
    }
}

loadArticle();
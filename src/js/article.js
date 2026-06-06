import { db } from "./firebase.js";
import { doc, getDoc } from "firebase/firestore";

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const container = document.getElementById("articleContainer");
const newsContainer = document.getElementById("newsContainer");

// Знаходимо всю верхню синю шапку сторінки
const pageHeader = document.querySelector('.page-header');

async function loadArticle() {
  // Якщо ID немає — ми на сторінці ВСІХ новин. Скрипт зупиняється.
  if (!id) return;

  // 👇 НОВИЙ КОД: Ховаємо всю синю верхню шапку
  if (pageHeader) {
    pageHeader.style.display = 'none';
  }

  // ФІЗИЧНО знищуємо контейнер усіх новин, щоб CSS не зміг його показати
  if (newsContainer) {
    newsContainer.innerHTML = ''; 
    newsContainer.style.display = 'none';
  }

  try {
    container.innerHTML = '<p class="loading-text" style="text-align:center; padding: 40px;">Завантаження статті...</p>';

    const reference = doc(db, "news", id);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <h2>Новину не знайдено</h2>
          <a href="/news.html" class="btn-primary" style="margin-top: 20px;">Повернутися до новин</a>
        </div>
      `;
      return;
    }

    const article = snapshot.data();

    container.innerHTML = `
      <article class="article-page" style="padding-top: 40px;"> 
        <h1 style="font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 700; margin-bottom: 24px;">${article.title}</h1>
        ${article.image && article.image !== "none" ? `<img class="article-image" src="${article.image}" alt="${article.title}">` : ''}
        <div class="article-content" style="margin-top: 30px;">
          ${article.content || '<p>Немає тексту новини.</p>'}
        </div>
        
        <div style="margin-top: 40px; border-top: 1px solid #e8ecf0; padding-top: 20px; margin-bottom: 60px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
          <a href="/index.html#news" class="btn-outline btn-dark">&larr; На головну</a>
          <a href="/news.html" class="btn-outline btn-dark">До всіх новин &rarr;</a>
        </div>
        </article>
    `;

  } catch (error) {
    console.error("Помилка завантаження статті:", error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <h2>Сталася помилка при завантаженні новини</h2>
        <p>Перевірте з'єднання або спробуйте пізніше.</p>
        <a href="/news.html" class="btn-primary" style="margin-top: 20px;">Повернутися до новин</a>
      </div>
    `;
  }
}

loadArticle();
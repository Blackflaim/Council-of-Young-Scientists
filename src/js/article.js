import { db } from "./firebase.js";
import { doc, getDoc } from "firebase/firestore";

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const container = document.getElementById("articleContainer");
const newsContainer = document.getElementById("newsContainer");

// Знаходимо заголовки сторінки
const pageTitle = document.getElementById("dynamic-page-title");
const pageDesc = document.getElementById("dynamic-page-desc");

async function loadArticle() {
  // Якщо ID немає — ми на сторінці ВСІХ новин. Скрипт зупиняється.
  if (!id) return;

  // Якщо ID є — ми на сторінці ОДНІЄЇ новини.
  // 1. Змінюємо заголовок (забираємо переклад, щоб не перебивав)
  if (pageTitle) {
      pageTitle.removeAttribute("data-i18n");
      pageTitle.innerHTML = "Новина";
  }
  if (pageDesc) {
      pageDesc.removeAttribute("data-i18n");
      pageDesc.innerHTML = "Детальний перегляд публікації";
  }

  // 2. ФІЗИЧНО знищуємо контейнер усіх новин, щоб CSS не зміг його показати
  if (newsContainer) {
    newsContainer.innerHTML = ''; 
    newsContainer.style.display = 'none';
  }

  try {
    container.innerHTML = '<p class="loading-text" style="text-align:center;">Завантаження статті...</p>';

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
      <article class="article-page">
        <h1>${article.title}</h1>
        ${article.image && article.image !== "none" ? `<img class="article-image" src="${article.image}" alt="${article.title}">` : ''}
        <div class="article-content" style="margin-top: 20px;">
          ${article.content || '<p>Немає тексту новини.</p>'}
        </div>
        <div style="margin-top: 40px; border-top: 1px solid #e8ecf0; padding-top: 20px;">
          <a href="/news.html" class="btn-outline btn-dark">&larr; До всіх новин</a>
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
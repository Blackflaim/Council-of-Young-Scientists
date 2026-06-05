import { db } from "./firebase.js";
import { doc, getDoc } from "firebase/firestore";

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const container = document.getElementById("articleContainer");
// Знаходимо контейнер зі списком новин, щоб приховати його при потребі
const newsContainer = document.getElementById("newsContainer"); 

async function loadArticle() {
  // Якщо ID немає в URL, значить користувач на головній сторінці новин.
  // Цей скрипт просто зупиняється, а news-page.js покаже список.
  if (!id) return;

  // Якщо ми завантажуємо статтю, ховаємо загальний список новин
  if (newsContainer) {
    newsContainer.style.display = 'none';
  }

  try {
    // Показуємо стан завантаження
    container.innerHTML = '<p class="loading-text">Завантаження статті...</p>';

    const reference = doc(db, "news", id);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <h2>Новину не знайдено</h2>
          <a href="news.html" class="btn-primary" style="margin-top: 20px;">Повернутися до новин</a>
        </div>
      `;
      return;
    }

    const article = snapshot.data();

    // Формуємо HTML статті. Використовуємо тернарний оператор для перевірки наявності картинки
    container.innerHTML = `
      <article class="article-page">
        <h1>${article.title}</h1>
        
        ${article.image ? `<img class="article-image" src="${article.image}" alt="${article.title}">` : ''}
        
        <div class="article-content">
          ${article.content}
        </div>
        
        <div style="margin-top: 40px; border-top: 1px solid #e8ecf0; padding-top: 20px;">
          <a href="news.html" class="btn-outline btn-dark">&larr; До всіх новин</a>
        </div>
      </article>
    `;

  } catch (error) {
    console.error("Помилка завантаження статті:", error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <h2>Сталася помилка при завантаженні новини</h2>
        <p>Будь ласка, перевірте з'єднання з інтернетом або спробуйте пізніше.</p>
        <a href="news.html" class="btn-primary" style="margin-top: 20px;">Повернутися до новин</a>
      </div>
    `;
  }
}

loadArticle();
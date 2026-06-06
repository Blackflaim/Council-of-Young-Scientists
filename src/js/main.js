'use strict';
import { translations } from './translations.js';
import { db } from "./firebase.js";

import headerHtml from '../components/header.html?raw';
import footerHtml from '../components/footer.html?raw';
// Глобальні змінні
let currentLang = localStorage.getItem("site_lang") || "ua";

async function initComponents() {
    try {
        // 2. Просто вставляємо готовий текст у блоки, fetch більше НЕ потрібен!
        const headerEl = document.getElementById("header");
        const footerEl = document.getElementById("footer");
        
        if (headerEl) headerEl.innerHTML = headerHtml;
        if (footerEl) footerEl.innerHTML = footerHtml;
        
        // 3. Ініціалізуємо інтерфейс
        translatePage(currentLang);
        initLanguageUI();
        initNavbarListeners();
        initScrollReveal();
        initActiveSection();
        initSpotlight();
        initNavbarScroll();
        
        console.log("Firebase connected", db);
    } catch (err) {
        console.error("Component initialization error:", err);
    }
}

/**
 * система локалізації
 */
function translatePage(lang) {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key]; 
        }
    });
}

// Глобальна функція для перемикання мови
window.setLanguage = function(lang) {
    localStorage.setItem("site_lang", lang);
    location.reload(); 
};

// Ініціалізація UI елементів
function initLanguageUI() {
    const activeBtn = document.querySelector(`.nav-lang button[data-lang="${currentLang}"]`);
    if (activeBtn) activeBtn.classList.add("active");
}

function initNavbarListeners() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    }
    // Закриття меню при кліку на посилання
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => navLinks?.classList.remove('open'));
    });
}

// Ефект тіні навігації при скролі
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) {
            nav.style.boxShadow = window.scrollY > 40 ? '0 4px 30px rgba(0,0,0,0.4)' : 'none';
        }
    });
}

// Анімація появи елементів при скролі
function initScrollReveal() {
    const SELECTORS = '.about-card, .program-card, .news-card, .article-card, .project-card, .team-card, .report-item, .partner-logo, .comp-card, .grant-card';
    const elements = document.querySelectorAll(SELECTORS);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// Активні пункти меню
function initActiveSection() {
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        let current = '';

        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 150) current = section.getAttribute('id');
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (current && link.getAttribute('href').includes(current)) {
                link.classList.add('active-link');
            }
        });
    }, { passive: true });
}

// Ефект Spotlight для карток
function initSpotlight() {
    const cards = document.querySelectorAll('.program-card');
    cards.forEach(card => {
        const spot = card.querySelector('.spotlight');
        if (!spot) return;
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            spot.style.left = (e.clientX - rect.left) + 'px';
            spot.style.top = (e.clientY - rect.top) + 'px';
        });
    });
}

// Запуск
document.addEventListener("DOMContentLoaded", initComponents);
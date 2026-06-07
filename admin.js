import { db } from "./src/js/firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";

const loginScreen = document.getElementById('loginScreen');
const adminPanel = document.getElementById('adminPanel');
const loginBtn = document.getElementById('loginBtn');
const passInput = document.getElementById('adminPass');

// Елементи вкладок
const tabAdd = document.getElementById('tabAdd');
const tabManage = document.getElementById('tabManage');
const sectionAdd = document.getElementById('sectionAdd');
const sectionManage = document.getElementById('sectionManage');
const adminNewsList = document.getElementById('adminNewsList');

const form = document.getElementById('addNewsForm');
const statusMsg = document.getElementById('statusMessage');

// --- 1. АВТОРИЗАЦІЯ ---
loginBtn.addEventListener('click', () => {
    if (passInput.value === import.meta.env.VITE_ADMIN_PASSWORD) { 
        loginScreen.style.display = 'none';
        adminPanel.style.display = 'block';
    } else {
        // 👇 Змінюємо цей рядок
        alert(`Помилка! Ви ввели: "${passInput.value}". А сервер очікує: "${import.meta.env.VITE_ADMIN_PASSWORD}"`);
    }
});

// --- 2. ЛОГІКА ВКЛАДОК ---
tabAdd.addEventListener('click', () => {
    sectionAdd.style.display = 'block';
    sectionManage.style.display = 'none';
    tabAdd.className = 'btn-primary'; // Робимо кнопку активною
    tabManage.className = 'btn-outline btn-dark';
});

tabManage.addEventListener('click', () => {
    sectionAdd.style.display = 'none';
    sectionManage.style.display = 'block';
    tabManage.className = 'btn-primary';
    tabAdd.className = 'btn-outline btn-dark';
    loadAdminNews(); // Завантажуємо список при переході на вкладку
});

// --- 3. ЗАВАНТАЖЕННЯ ТА ВИДАЛЕННЯ НОВИН ---
async function loadAdminNews() {
    adminNewsList.innerHTML = '<p>Завантаження списку...</p>';
    try {
        // Беремо всі новини, сортуємо від найновіших
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            adminNewsList.innerHTML = '<p>Немає жодної новини.</p>';
            return;
        }

        let html = '';
        snapshot.forEach(docItem => {
            const news = docItem.data();
            const dateStr = news.date || 'Без дати';
            const titleStr = news.title || 'Без заголовка';
            
            // Створюємо картку для кожної новини з кнопкою видалення
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #e8ecf0; border-radius: 6px;">
                    <div>
                        <strong style="display: block; color: var(--navy);">${titleStr}</strong>
                        <span style="font-size: 12px; color: #666;">${dateStr}</span>
                    </div>
                    <button class="delete-btn" data-id="${docItem.id}" style="background: #dc2626; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">Видалити</button>
                </div>
            `;
        });
        adminNewsList.innerHTML = html;

    } catch (error) {
        console.error("Помилка завантаження новин:", error);
        adminNewsList.innerHTML = '<p style="color: red;">Помилка завантаження.</p>';
    }
}

// Слухаємо кліки по кнопках видалення
adminNewsList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const docId = event.target.getAttribute('data-id');
        
        // Перепитуємо, щоб не видалити випадково
        if (confirm("Ви точно хочете назавжди видалити цю новину?")) {
            event.target.innerText = "Видалення...";
            try {
                // Видаляємо документ з бази
                await deleteDoc(doc(db, "news", docId));
                // Оновлюємо список
                loadAdminNews();
            } catch (error) {
                console.error("Помилка видалення:", error);
                alert("Не вдалося видалити новину. Перевірте консоль.");
            }
        }
    }
});

// --- 4. ФУНКЦІЯ СТИСНЕННЯ КАРТИНКИ (BASE64) ---
function compressAndConvertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const maxWidth = 800;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                resolve(compressedBase64);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

// --- 5. ВІДПРАВКА ФОРМИ ---
form.addEventListener('submit', async (event) => {
    event.preventDefault(); 
    
    statusMsg.innerHTML = 'Обробка та публікація...⏳';
    statusMsg.style.color = '#2563eb';

    try {
        const today = new Date();
        const autoDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;

        const fileInput = document.getElementById('imageFile');
        let finalImageUrl = document.getElementById('image').value.trim() || 'none';

        if (fileInput.files.length > 0) {
            finalImageUrl = await compressAndConvertToBase64(fileInput.files[0]);
        }

        const newsData = {
            title: document.getElementById('title').value.trim(),
            description: document.getElementById('description').value.trim(),
            content: document.getElementById('content').value.trim(),
            title_en: document.getElementById('title_en').value.trim(),
            description_en: document.getElementById('description_en').value.trim(),
            content_en: document.getElementById('content_en').value.trim(),
            image: finalImageUrl,
            date: autoDate,
            createdAt: Date.now() 
        };

        await addDoc(collection(db, "news"), newsData);
        
        statusMsg.style.color = '#16a34a'; 
        statusMsg.innerHTML = 'Новину успішно опубліковано! ✅';
        form.reset(); 
        
    } catch (error) {
        console.error("Помилка публікації:", error);
        statusMsg.style.color = '#dc2626'; 
        statusMsg.innerHTML = 'Помилка при додаванні. Перевірте правила бази даних.';
    }
});
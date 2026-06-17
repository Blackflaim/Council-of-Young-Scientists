import { team } from "./teamData.js";

//Отримуємо поточну мову (ua або en)
const currentLang = localStorage.getItem("site_lang") || "ua";

function renderPreview(member) {
  // Захист даних: якщо перекладу поточною мовою немає, пробуємо взяти українську версію
  const name = member.name?.[currentLang] || member.name?.ua || 'Ім\'я не вказано';
  const degree = member.degree?.[currentLang] || member.degree?.ua || '';
  const badge = member.badge?.[currentLang] || member.badge?.ua || '';
  // Якщо фото немає, ставимо заглушку
  const imageSrc = member.image || '/icons/default-avatar.png';

  return `
    <div class="team-card">
      <div class="team-photo">
        <img src="${imageSrc}" alt="${name}">
      </div>
      <h4>${name}</h4>
      <p>${degree}</p>
      <span class="role">${badge}</span>
    </div>
  `;
}

function renderFull(member) {
  // Захист даних для багатомовності
  const name = member.name?.[currentLang] || member.name?.ua || 'Ім\'я не вказано';
  const degree = member.degree?.[currentLang] || member.degree?.ua || '';
  const badge = member.badge?.[currentLang] || member.badge?.ua || '';
  const institution = member.institution?.[currentLang] || member.institution?.ua || '';
  const desc = member.description?.[currentLang] || member.description?.ua || '';
  const imageSrc = member.image || '/icons/default-avatar.png';

  return `
    <div class="team-card ${member.role || ''}">
      <div class="team-badge">
        ${badge}
      </div>
      <div class="team-photo">
        <img src="${imageSrc}" alt="${name}">
      </div>
      <div class="team-info">
        <div class="team-title-wrap">
          <h3>${name}</h3>
          ${degree ? `<p class="team-degree">${degree}</p>` : ''}
        </div>
        
        <div class="team-tags">
          <span class="tag">${institution}</span>
        </div>
        ${desc ? `<p class="team-desc">${desc}</p>` : ''}
      </div>
    </div>
  `;
}

const previewContainer = document.getElementById("teamPreview");
const fullContainer = document.getElementById("teamContainer");

// Додано перевірку, чи team існує і чи є масивом, щоб методи .slice() та .map() не викинули критичну помилку
if (team && Array.isArray(team)) {
  if(previewContainer) {
    previewContainer.innerHTML = team.slice(0, 5).map(renderPreview).join('');
  }

  if(fullContainer) {
    fullContainer.innerHTML = team.map(renderFull).join('');
  }
}
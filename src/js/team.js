import { team } from "./teamData.js";

// Отримуємо поточну мову
const currentLang = localStorage.getItem("site_lang") || "ua";

function formatName(nameString) 
{
  if (!nameString) return 'Ім\'я не вказано';
  return nameString.replace(' ', '<br>');
}

function renderPreview(member) {
  // Захист даних
  const rawName = member.name?.[currentLang] || member.name?.ua || '';
  const name = formatName(rawName); // Застосовуємо розбиття на 2 рядки
  
  const degree = member.degree?.[currentLang] || member.degree?.ua || '';
  const badge = member.badge?.[currentLang] || member.badge?.ua || '';
  const imageSrc = member.image || '/icons/default-avatar.png';

  return `
    <div class="team-card">
      <div class="team-photo">
        <img src="${imageSrc}" alt="${rawName}">
      </div>
      <h4 style="text-align: center; line-height: 1.3;">${name}</h4>
      <p>${degree}</p>
      <span class="role">${badge}</span>
    </div>
  `;
}

function renderFull(member) {
  // Захист даних для багатомовності
  const rawName = member.name?.[currentLang] || member.name?.ua || '';
  const name = formatName(rawName); // Застосовуємо розбиття на 2 рядки
  
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
        <img src="${imageSrc}" alt="${rawName}">
      </div>
      <div class="team-info">
        <div class="team-title-wrap">
          <h3 style="text-align: center; line-height: 1.2;">${name}</h3>
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

// Перевірка, чи team існує
if (team && Array.isArray(team)) 
{
  if(previewContainer) {
    previewContainer.innerHTML = team.slice(0, 5).map(renderPreview).join('');
  }

  if(fullContainer) {
    fullContainer.innerHTML = team.map(renderFull).join('');
  }
}
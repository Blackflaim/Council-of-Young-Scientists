import { team } from "./teamData.js";

function renderPreview(member) {
  return `
    <div class="team-card">
      <div class="team-photo">
        <img src="${member.image}" alt="${member.name}">
      </div>
      <h4>${member.name}</h4>
      <p>${member.degree}</p>
      <span class="role">${member.badge}</span>
    </div>
  `;
}

function renderFull(member) {
  return `
    <div class="team-card ${member.role || ''}">
      <div class="team-badge">
        ${member.badge}
      </div>
      <div class="team-photo">
        <img src="${member.image}" alt="${member.name}">
      </div>
      <div class="team-info">
        <h3>${member.name}</h3>
        <p class="team-degree">${member.degree}</p>
        <div class="team-tags">
          <span class="tag">${member.institution}</span>
        </div>
        <p>${member.description || ''}</p>
      </div>
    </div>
  `;
}

const previewContainer = document.getElementById("teamPreview");
const fullContainer = document.getElementById("teamContainer");

if(previewContainer) {
  previewContainer.innerHTML = team.slice(0, 5).map(renderPreview).join('');
}

if(fullContainer) {
  fullContainer.innerHTML = team.map(renderFull).join('');
}
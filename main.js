document.addEventListener('DOMContentLoaded', () => 
{
  const cards = document.querySelectorAll('.program-card');

  cards.forEach(card => {
    const spot = card.querySelector('.spotlight');
    if (!spot) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      spot.style.left = x + 'px';
      spot.style.top = y + 'px';
    });
  });
});
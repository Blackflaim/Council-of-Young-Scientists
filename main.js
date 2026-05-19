'use strict';

document.addEventListener('DOMContentLoaded', () => 
{
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) 
  {
    hamburger.addEventListener('click', () => 
    {
      navLinks.classList.toggle('open');
    });
  }

  const langButtons = document.querySelectorAll('.nav-lang button');
  langButtons.forEach(btn => 
  {
    btn.addEventListener('click', (e) => 
    {
      langButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      console.log('Language switched to:', e.target.textContent);
    });
  });
});

(function initNavbarScroll() 
{
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => 
  {
    nav.style.boxShadow = window.scrollY > 40
      ? '0 4px 30px rgba(0,0,0,0.4)'
      : 'none';
  });
}());

(function initScrollReveal() 
{
  const SELECTORS = [
    '.about-card',
    '.program-card',
    '.news-card',
    '.article-card',
    '.project-card',
    '.team-card',
    '.report-item',
    '.partner-logo'
  ].join(', ');

  const elements = document.querySelectorAll(SELECTORS);

  elements.forEach(el => 
  {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver(
    (entries) => 
    {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
          
          setTimeout(() => 
          {
            entry.target.style.transform = '';
            entry.target.style.transition = '';
          }, 500);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(el => observer.observe(el));
}());

(function initNavLinkClose() 
{
  document.querySelectorAll('.nav-links a').forEach(link => 
  {
    link.addEventListener('click', () => 
    {
      const navLinks = document.getElementById('navLinks');
      if (navLinks) navLinks.classList.remove('open');
    });
  });
}());

(function initActiveSection() 
{
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const onScroll = () => 
  {
    let current = '';

    sections.forEach(section => 
    {
      if (window.scrollY >= section.offsetTop - 100) 
      {
        current = section.getAttribute('id');
      }
    });

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) 
    {
      if (sections.length > 0) 
      {
        current = sections[sections.length - 1].getAttribute('id');
      }
    }

    navLinks.forEach(link => 
    {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === '#' + current) 
      {
        link.classList.add('active-link');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}());

document.addEventListener('DOMContentLoaded', () => 
{
  const cards = document.querySelectorAll('.program-card');

  cards.forEach(card => 
  {
    const spot = card.querySelector('.spotlight');
    if (!spot) return;

    card.addEventListener('mousemove', (e) => 
    {
      const rect = card.getBoundingClientRect();
      spot.style.left = (e.clientX - rect.left) + 'px';
      spot.style.top  = (e.clientY - rect.top)  + 'px';
    });
  });
});
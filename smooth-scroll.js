// smooth-scroll.js

document.addEventListener("DOMContentLoaded", () => {
  const HEADER_OFFSET = document.querySelector("header")?.offsetHeight || 70;

  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  // Smooth scroll with offset
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const targetPos = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
      window.scrollTo({ top: targetPos, behavior: "smooth" });
      navLinks.forEach(a => a.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Scroll‑spy: highlight nav as you scroll
  window.addEventListener("scroll", () => {
    const scrollPos = window.pageYOffset + HEADER_OFFSET + 5;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = "#" + section.id;
      const link = document.querySelector(`nav a[href="${id}"]`);
      if (!link) return;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(a => a.classList.remove("active"));
        link.classList.add("active");
      }
    });
  });
});


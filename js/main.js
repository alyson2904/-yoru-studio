(() => {
  // Número de WhatsApp (solo dígitos, sin +)
  const WHATSAPP_NUMBER = "525664921229";
  const messages = {
    general: "Hola, YORU STUDIO. Me gustaría hablar sobre una idea que tengo.",
    services: "Hola, YORU STUDIO. Quisiera consultar información sobre sus servicios.",
    quote: "Hola, YORU STUDIO. Me gustaría solicitar una cotización para un proyecto. ¿Qué información necesitan?"
  };
  
  // Lógica de WhatsApp
  document.querySelectorAll(".whatsapp-link").forEach(link => {
    const text = messages[link.dataset.message] || messages.general;
    link.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  // Año dinámico en el footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menú móvil
  const nav = document.getElementById("nav");
  const menu = document.getElementById("menu");
  const menuBtn = document.getElementById("menuBtn");
  
  if (menuBtn && menu) {
    const closeMenu = () => {
      menu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "☰";
      menuBtn.setAttribute("aria-label", "Abrir menú");
    };
    
    menuBtn.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.textContent = open ? "×" : "☰";
      menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
  }

  // Efectos de scroll (barra de progreso)
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let scheduled = false;
  
  function onScroll() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--scroll", (y / max).toFixed(4));
      if (nav) nav.classList.toggle("scrolled", y > 35);
      scheduled = false;
    });
  }
  
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  // Animaciones de aparición
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { 
        entry.target.classList.add("visible"); 
        io.unobserve(entry.target); 
      }
    }), {threshold:.09});
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
  }

  // --- FONDO DINÁMICO POR SECCIÓN ---
  const bgElement = document.getElementById("global-bg");
  const sections = document.querySelectorAll("section");
  
  // Mapeo de las secciones a sus imágenes
  const sectionBackgrounds = {
    "inicio": "./assets/yoru.png",
    "estudio": "./assets/yoru.png", // Mantenemos la imagen original aquí para que no cambie
    "servicios-top": "./assets/yoru-azul.png",
    "proyectos-top": "./assets/yoru-morada.png",
    "contacto": "./assets/yoru-bosque.png"
  };

  if (bgElement && sections.length > 0) {
    const observerBg = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (sectionBackgrounds[id]) {
            bgElement.style.backgroundImage = `url('${sectionBackgrounds[id]}')`;
          }
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => observerBg.observe(section));
  }
  // --- LÓGICA DE MODALES (CATÁLOGO DE SERVICIOS) ---
const serviceCards = document.querySelectorAll('.service[data-target]');
const modals = document.querySelectorAll('.modal-overlay');
const closeBtns = document.querySelectorAll('[data-close]');

if (serviceCards.length > 0) {
  // Abrir modal al tocar una tarjeta
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.getAttribute('data-target');
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
      }
    });
  });

  // Cerrar modal con la X
  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Cerrar modal al tocar fuera de la caja
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}
})();

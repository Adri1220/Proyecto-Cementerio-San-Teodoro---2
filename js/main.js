/* ==========================================================================
   1. HEADER MÁGICO (Efecto Scroll)
   ========================================================================== */

// Esperamos a que todo el HTML cargue antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
   // 1. JS "selecciona" el header del HTML
   const header = document.querySelector(".header");

   // 2. JS "escucha" cada vez que el usuario hace scroll en la ventana
   window.addEventListener("scroll", () => {
      // 3. Condición: Si el usuario ha bajado más de 50 píxeles...
      if (window.scrollY > 50) {
         // Agrégale la clase CSS que reduce su tamaño y le da sombra
         header.classList.add("header--scrolled");
      } else {
         // Si está hasta arriba (menos de 50px), quítale la clase
         header.classList.remove("header--scrolled");
      }
   });
});

/* ==========================================================================
   SISTEMA DE FILTROS PARA EL CATÁLOGO
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
   const filterBtns = document.querySelectorAll(".filter-btn");
   const cards = document.querySelectorAll(".card");

   filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
         // 1. Quitar la clase activa de todos los botones
         filterBtns.forEach((b) => b.classList.remove("filter-btn--active"));
         // 2. Ponérsela solo al que el usuario hizo clic
         btn.classList.add("filter-btn--active");

         // 3. Obtener qué categoría queremos ver
         const filterValue = btn.getAttribute("data-filter");

         // 4. Mostrar u ocultar las tarjetas
         cards.forEach((card) => {
            const cardCategory = card.getAttribute("data-category");

            if (filterValue === "todos" || filterValue === cardCategory) {
               card.classList.remove("hidden");
            } else {
               card.classList.add("hidden");
            }
         });
      });
   });
});

// ==========================================================================
// 4. SCROLL SPY (Mejor Práctica: Intersection Observer)
// ==========================================================================

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav__list .nav__link");

// Configuramos el "vigilante"
const observerOptions = {
   root: null,
   rootMargin: "-150px 0px -60% 0px", // Ignora el header fijo y la parte inferior
   threshold: 0,
};

const observer = new IntersectionObserver((entries) => {
   entries.forEach((entry) => {
      // Si la sección entra en nuestra zona de visión...
      if (entry.isIntersecting) {
         const currentId = entry.target.getAttribute("id");

         // Actualizamos el menú
         navLinks.forEach((link) => {
            link.classList.remove("nav__link--active");
            if (link.getAttribute("href") === `#${currentId}`) {
               link.classList.add("nav__link--active");
            }
         });
      }
   });
}, observerOptions);

// Le decimos al vigilante que observe cada una de nuestras secciones
sections.forEach((section) => observer.observe(section));

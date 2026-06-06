/* ==========================================================================
   1. HEADER MÁGICO (Efecto Scroll)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
   const header = document.querySelector(".header");

   window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
         header.classList.add("header--scrolled");
      } else {
         header.classList.remove("header--scrolled");
      }
   });
});

/* ==========================================================================
   2. SISTEMA DE FILTROS PARA EL CATÁLOGO
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
   const filterBtns = document.querySelectorAll(".filter-btn");
   const cards = document.querySelectorAll(".card");

   filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
         filterBtns.forEach((b) => b.classList.remove("filter-btn--active"));
         btn.classList.add("filter-btn--active");

         const filterValue = btn.getAttribute("data-filter");

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

/* ==========================================================================
   3. SCROLL SPY (Vigilante de secciones para el menú)
   ========================================================================== */
const secciones = document.querySelectorAll("section[id]");
const enlacesMenu = document.querySelectorAll(".nav__link");

const opcionesSensor = {
   root: null,
   rootMargin: "-20% 0px -60% 0px",
   threshold: 0,
};

const observadorDeSecciones = new IntersectionObserver((entradas) => {
   entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
         const idVisible = entrada.target.getAttribute("id");

         enlacesMenu.forEach((enlace) =>
            enlace.classList.remove("nav__link--active"),
         );

         const enlaceActivo = document.querySelector(
            `.nav__link[href="#${idVisible}"]`,
         );
         if (enlaceActivo) {
            enlaceActivo.classList.add("nav__link--active");
         }
      }
   });
}, opcionesSensor);

secciones.forEach((seccion) => observadorDeSecciones.observe(seccion));

/* ==========================================================================
   4. INYECTOR DINÁMICO UNIVERSAL (Obras y Nichos)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
   const urlParams = new URLSearchParams(window.location.search);
   const id = urlParams.get("id");

   if (id && obras[id]) {
      const datos = obras[id];

      // --- A. LÓGICA PARA ESTATUAS (obra.html) ---
      if (document.querySelector(".artwork__title")) {
         // Inyectamos Textos
         document.querySelector(".artwork__title").innerText = datos.titulo;
         document.querySelector(".artwork__category").innerText =
            datos.categoria;
         document.querySelector(".artwork__description p").innerHTML =
            datos.descripcion;

         // Inyectamos Conservación
         if (datos.conservacion) {
            document.querySelector(".artwork__status").innerHTML =
               `<span class="status-dot"></span> ${datos.conservacion}`;
         }

         // Inyectamos Metadatos
         const metaValues = document.querySelectorAll(".meta-value");
         if (metaValues.length >= 3) {
            metaValues[0].innerText = datos.anio;
            metaValues[1].innerText = datos.material;
            metaValues[2].innerText = datos.autor;
         }

         // Inyectamos el Iframe 3D creando el código desde cero
         if (datos.modelo3d) {
            document.querySelector(".artwork__media").innerHTML = `
               <iframe
                  title="Modelo 3D de ${datos.titulo}"
                  frameborder="0"
                  allowfullscreen
                  mozallowfullscreen="true"
                  webkitallowfullscreen="true"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  xr-spatial-tracking
                  execution-while-out-of-viewport
                  execution-while-not-rendered
                  web-share
                  style="width: 100%; aspect-ratio: 4/3; border: 1px solid var(--color-border-marble);"
                  src="${datos.modelo3d}"
               ></iframe>
               <span class="artwork__media-caption">MODELO FOTOGRAMÉTRICO INTERACTIVO · ARRASTRA PARA ROTAR</span>
            `;
         }
      }

      // --- B. LÓGICA PARA NICHOS (nicho.html) ---
      if (document.querySelector(".narrative__title")) {
         // Inyectamos Textos
         document.querySelector(".narrative__title").innerText = datos.titulo;
         document.querySelector(".narrative__subtitle").innerText =
            datos.subtitulo;

         // Inyectamos Historia (Respetando párrafos)
         document.querySelector(".narrative__story").innerHTML =
            `<p>${datos.descripcion}</p>`;

         // Inyectamos Metadatos
         document.querySelector(".narrative__brief").innerHTML = `
            <p><strong>Ubicación:</strong> ${datos.ubicacion}</p>
            <p><strong>Material:</strong> ${datos.material}</p>
         `;

         // Inyectamos la Fotografía creando la etiqueta desde cero
         if (datos.imagen) {
            document.querySelector(".narrative__media").innerHTML = `
               <img src="${datos.imagen}" alt="Fotografía de ${datos.titulo}" class="narrative__img">
            `;
         }
      }

      // --- C. CAMBIO DE TÍTULO EN LA PESTAÑA DEL NAVEGADOR ---
      document.title = `${datos.titulo} - Archivo San Teodoro`;
   }
});

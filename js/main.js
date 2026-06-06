document.addEventListener("DOMContentLoaded", () => {
   // ==========================================================================
   // 1. HEADER MÁGICO Y SCROLL SPY
   // ==========================================================================
   const header = document.querySelector(".header");
   const secciones = document.querySelectorAll("section[id]");
   const enlacesMenu = document.querySelectorAll(".nav__link");

   window.addEventListener("scroll", () => {
      window.scrollY > 50
         ? header.classList.add("header--scrolled")
         : header.classList.remove("header--scrolled");
   });

   const observadorDeSecciones = new IntersectionObserver(
      (entradas) => {
         entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
               const idVisible = entrada.target.getAttribute("id");
               enlacesMenu.forEach((enlace) =>
                  enlace.classList.remove("nav__link--active"),
               );
               const enlaceActivo = document.querySelector(
                  `.nav__link[href="#${idVisible}"]`,
               );
               if (enlaceActivo)
                  enlaceActivo.classList.add("nav__link--active");
            }
         });
      },
      { rootMargin: "-20% 0px -60% 0px" },
   );

   secciones.forEach((seccion) => observadorDeSecciones.observe(seccion));

   // ==========================================================================
   // 2. GENERADOR AUTOMÁTICO DEL CATÁLOGO (index.html)
   // ==========================================================================
   const catalogGrid = document.querySelector(".catalog__grid");

   if (catalogGrid && typeof obras !== "undefined") {
      let tarjetasHTML = "";

      // Recorremos la base de datos para crear cada tarjeta
      for (const [slug, datos] of Object.entries(obras)) {
         // Determinamos a qué página debe llevar el enlace
         const enlaceBase = datos.tipo === "nicho" ? "nicho.html" : "obra.html";
         // Determinamos la categoría visual
         const categoriaVisual =
            datos.tipo === "nicho"
               ? "NICHO HISTÓRICO"
               : "ARQUITECTURA FUNERARIA";

         tarjetasHTML += `
            <article class="card" data-category="${datos.tipo}">
               <div class="card__image-wrapper">
                  <img src="${datos.imagen}" alt="${datos.titulo}" class="card__img" />
               </div>
               <div class="card__content">
                  <span class="card__category">${categoriaVisual}</span>
                  <h3 class="card__name">${datos.titulo}</h3>
                  <p class="card__description">${datos.descripcion.substring(0, 120)}...</p>
                  <a href="${enlaceBase}?id=${slug}" class="card__link">Conoce más →</a>
               </div>
            </article>
         `;
      }

      catalogGrid.innerHTML = tarjetasHTML;

      // ==========================================================================
      // 3. INICIALIZAR FILTROS (Solo después de inyectar las tarjetas)
      // ==========================================================================
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
   }

   // ==========================================================================
   // 4. INYECTOR DE PÁGINAS INTERNAS (obra.html y nicho.html)
   // ==========================================================================
   const urlParams = new URLSearchParams(window.location.search);
   const id = urlParams.get("id");

   if (id && obras[id]) {
      const datos = obras[id];

      // --- A. LÓGICA PARA ESTATUAS (obra.html) ---
      if (document.querySelector(".artwork__title")) {
         document.querySelector(".artwork__title").innerText = datos.titulo;
         document.querySelector(".artwork__category").innerText =
            datos.categoria;
         document.querySelector(".artwork__description p").innerHTML =
            datos.descripcion;

         if (datos.conservacion) {
            document.querySelector(".artwork__status").innerHTML =
               `<span class="status-dot"></span> ${datos.conservacion}`;
         }

         const metaValues = document.querySelectorAll(".meta-value");
         if (metaValues.length >= 3) {
            metaValues[0].innerText = datos.anio;
            metaValues[1].innerText = datos.material;
            metaValues[2].innerText = datos.autor;
         }

         if (datos.modelo3d) {
            document.querySelector(".artwork__media").innerHTML = `
               <iframe title="Modelo 3D de ${datos.titulo}" frameborder="0" allow="autoplay; fullscreen; xr-spatial-tracking; gyroscope; accelerometer" style="width: 100%; aspect-ratio: 4/3; border: 1px solid var(--color-border-marble);" src="${datos.modelo3d}"></iframe>
               <span class="artwork__media-caption">MODELO FOTOGRAMÉTRICO INTERACTIVO · ARRASTRA PARA ROTAR</span>
            `;
         }
      }

      // --- B. LÓGICA PARA NICHOS (nicho.html) ---
      if (document.querySelector(".narrative__title")) {
         document.querySelector(".narrative__title").innerText = datos.titulo;
         document.querySelector(".narrative__subtitle").innerText =
            datos.subtitulo;
         document.querySelector(".narrative__story").innerHTML =
            `<p>${datos.descripcion}</p>`;

         document.querySelector(".narrative__brief").innerHTML = `
            <p><strong>Ubicación:</strong> ${datos.ubicacion}</p>
            <p><strong>Material:</strong> ${datos.material}</p>
         `;

         if (datos.imagen) {
            document.querySelector(".narrative__media").innerHTML =
               `<img src="${datos.imagen}" alt="Fotografía de ${datos.titulo}" class="narrative__img">`;
         }
      }

      // --- C. CAMBIO DE TÍTULO EN LA PESTAÑA DEL NAVEGADOR ---
      document.title = `${datos.titulo} - Archivo San Teodoro`;
   }
});

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
   // 2 & 3. GENERADOR DE CATÁLOGO Y FILTROS CON PAGINACIÓN MATEMÁTICA
   // ==========================================================================
   const catalogGrid = document.querySelector(".catalog__grid");

   if (catalogGrid && typeof obras !== "undefined") {
      // Convertimos el objeto en un Array para poder hacer el "slicing"
      const obrasArray = Object.entries(obras);

      // Estado de la aplicación (State)
      let filtroActual = "todos";
      let paginaActual = 1;
      const elementosPorPagina = 6; // Límite de tarjetas por página

      // Creamos la caja para los botones dinámicamente y la inyectamos en el DOM
      const paginationContainer = document.createElement("div");
      paginationContainer.classList.add("catalog__pagination");
      catalogGrid.parentNode.insertBefore(
         paginationContainer,
         catalogGrid.nextSibling,
      );

      // Función Maestra de Renderizado
      const renderizarCatalogo = () => {
         // 1. Filtrar
         const obrasFiltradas = obrasArray.filter(([slug, datos]) => {
            return filtroActual === "todos" || datos.tipo === filtroActual;
         });

         // 2. Calcular Paginación
         const totalPaginas = Math.ceil(
            obrasFiltradas.length / elementosPorPagina,
         );
         if (paginaActual > totalPaginas && totalPaginas > 0)
            paginaActual = totalPaginas;

         // Slicing Matemático
         const indiceInicio = (paginaActual - 1) * elementosPorPagina;
         const indiceFin = indiceInicio + elementosPorPagina;
         const obrasPagina = obrasFiltradas.slice(indiceInicio, indiceFin);

         // 3. Dibujar Tarjetas
         let tarjetasHTML = "";
         obrasPagina.forEach(([slug, datos]) => {
            const enlaceBase =
               datos.tipo === "nicho" ? "nicho.html" : "obra.html";
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
         });

         catalogGrid.innerHTML =
            tarjetasHTML ||
            `<p style="grid-column: 1/-1; text-align:center; color: var(--color-text-muted);">No hay obras en esta categoría.</p>`;

         // 4. Dibujar Botones Numéricos
         let paginacionHTML = "";
         if (totalPaginas > 1) {
            for (let i = 1; i <= totalPaginas; i++) {
               paginacionHTML += `
                  <button class="page-btn ${i === paginaActual ? "page-btn--active" : ""}" data-page="${i}">
                     ${i}
                  </button>
               `;
            }
         }
         paginationContainer.innerHTML = paginacionHTML;

         // 5. Asignar interactividad a los nuevos botones
         document.querySelectorAll(".page-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
               paginaActual = parseInt(e.target.getAttribute("data-page"));
               renderizarCatalogo();

               // Scroll suave para llevar al usuario al inicio del catálogo tras cambiar de página
               document
                  .querySelector("#catalogo")
                  .scrollIntoView({ behavior: "smooth" });
            });
         });
      };

      // Inicialización por primera vez
      renderizarCatalogo();

      // Controladores de los filtros principales
      const filterBtns = document.querySelectorAll(".filter-btn");
      filterBtns.forEach((btn) => {
         btn.addEventListener("click", () => {
            filterBtns.forEach((b) => b.classList.remove("filter-btn--active"));
            btn.classList.add("filter-btn--active");

            filtroActual = btn.getAttribute("data-filter");
            paginaActual = 1; // Reseteamos a la pág 1 siempre que cambian de categoría
            renderizarCatalogo();
         });
      });
   }

   // ==========================================================================
   // 4. INYECTOR DE PÁGINAS INTERNAS (obra.html y nicho.html)
   // ==========================================================================
   const urlParams = new URLSearchParams(window.location.search);
   const id = urlParams.get("id");

   // Identificamos si estamos dentro de una página interna (sea obra o nicho)
   const pageContainer =
      document.querySelector(".artwork__container") ||
      document.querySelector(".narrative__container");

   if (pageContainer) {
      // Condición A: El ID existe y la obra está en nuestra base de datos
      if (id && typeof obras !== "undefined" && obras[id]) {
         const datos = obras[id];

         // --- LÓGICA PARA ESTATUAS (obra.html) ---
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

         // --- LÓGICA PARA NICHOS (nicho.html) ---
         if (document.querySelector(".narrative__title")) {
            document.querySelector(".narrative__title").innerText =
               datos.titulo;
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

         // --- CAMBIO DE TÍTULO EN LA PESTAÑA DEL NAVEGADOR ---
         document.title = `${datos.titulo} - Archivo San Teodoro`;
      } else {
         // Condición B: ERROR (El ID no existe, está mal escrito o entraron sin enlace)
         pageContainer.innerHTML = `
            <div style="text-align: center; padding: 100px 20px; display: flex; flex-direction: column; align-items: center; gap: 24px;">
               <h1 style="font-family: var(--font-serif); font-size: 48px; color: var(--color-text-main);">Registro no encontrado</h1>
               <p style="font-family: var(--font-sans); font-size: 16px; color: var(--color-text-muted); max-width: 500px; line-height: 1.6;">
                  Lo sentimos, la obra o nicho que intentas visualizar no existe en la base de datos actual o el enlace fue modificado.
               </p>
               <a href="index.html#catalogo" class="btn btn--primary" style="margin-top: 16px;">Volver al Catálogo 3D</a>
            </div>
         `;
         document.title = "No encontrado - Archivo San Teodoro";
      }
   }
}); // <-- Fin del DOMContentLoaded global

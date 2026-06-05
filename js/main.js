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
// SCROLL SPY (Vigilante de secciones para el menú)
// ==========================================================================

// 1. Seleccionamos todas las secciones con ID y los enlaces del menú
const secciones = document.querySelectorAll("section[id]");
const enlacesMenu = document.querySelectorAll(".nav__link");

// 2. Configuramos el sensor
const opcionesSensor = {
   root: null,
   rootMargin: "-20% 0px -60% 0px", // Se activa cuando la sección llega a la mitad de la pantalla
   threshold: 0,
};

const observadorDeSecciones = new IntersectionObserver((entradas) => {
   entradas.forEach((entrada) => {
      // Si la sección entra en el rango visible...
      if (entrada.isIntersecting) {
         const idVisible = entrada.target.getAttribute("id");

         // Quitamos la clase activa de todos los enlaces
         enlacesMenu.forEach((enlace) =>
            enlace.classList.remove("nav__link--active"),
         );

         // Buscamos el enlace que coincide con el ID y le ponemos la clase
         const enlaceActivo = document.querySelector(
            `.nav__link[href="#${idVisible}"]`,
         );
         if (enlaceActivo) {
            enlaceActivo.classList.add("nav__link--active");
         }
      }
   });
}, opcionesSensor);

// 3. Le decimos al sensor que vigile cada sección
secciones.forEach((seccion) => observadorDeSecciones.observe(seccion));

document.addEventListener("DOMContentLoaded", () => {
   // 1. Detectar qué ID viene en la URL (ej: obra.html?id=estatua1)
   const urlParams = new URLSearchParams(window.location.search);
   const obraId = urlParams.get("id");

   // 2. Si hay un ID y existe en nuestra base de datos (¡AQUÍ ESTABA EL DETALLE!)...
   if (obraId && obras[obraId]) {
      const datos = obras[obraId];

      // 3. Inyectar los datos en el HTML
      document.querySelector(".artwork__title").innerText = datos.titulo;
      document.querySelector(".artwork__category").innerText = datos.categoria;
      document.querySelector(".artwork__description p").innerText =
         datos.descripcion;

      // NUEVO: Inyectar conservación sin borrar el punto dorado
      document.querySelector(".artwork__status").innerHTML =
         `<span class="status-dot"></span> ${datos.conservacion}`;

      // Inyectar los metadatos (Año, Material, Autor)
      const metaValues = document.querySelectorAll(".meta-value");
      metaValues[0].innerText = datos.anio;
      metaValues[1].innerText = datos.material;
      metaValues[2].innerText = datos.autor;

      // Cambiar el título de la pestaña del navegador
      document.title = `${datos.titulo} - San Teodoro`;
   }
});

document.addEventListener("DOMContentLoaded", () => {
   const urlParams = new URLSearchParams(window.location.search);
   const id = urlParams.get("id");

   if (id && obras[id]) {
      const datos = obras[id];

      // --- SI ESTAMOS EN OBRA.HTML (ESTATUAS) ---
      if (document.querySelector(".artwork__title")) {
         document.querySelector(".artwork__title").innerText = datos.titulo;
         document.querySelector(".artwork__category").innerText =
            datos.categoria;
         document.querySelector(".artwork__description p").innerText =
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
      }

      // --- SI ESTAMOS EN NICHO.HTML (NICHOS) ---
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
      }

      // Cambiar el título de la pestaña del navegador para ambos casos
      document.title = `${datos.titulo} - San Teodoro`;
   }
});

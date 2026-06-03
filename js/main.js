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

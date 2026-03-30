(function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMobile = document.querySelector(".nav-mobile");
  const navLinks = document.querySelectorAll(".nav-mobile a, .nav-desktop a");

  function closeMenu() {
    if (navMobile) navMobile.classList.remove("is-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && navMobile) {
    menuToggle.addEventListener("click", function () {
      const open = navMobile.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 960) closeMenu();
  });

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

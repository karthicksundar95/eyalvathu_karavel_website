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

  const mediaScroll = document.querySelector(".media-stories-scroll");
  if (mediaScroll) {
    mediaScroll.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        mediaScroll.scrollBy({ left: -300, behavior: "smooth" });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        mediaScroll.scrollBy({ left: 300, behavior: "smooth" });
      }
    });
  }

  const contributionModal = document.getElementById("contribution-modal");
  const contributionOpen = document.querySelector(".js-open-contribution-modal");
  const contributionFormView = document.getElementById("contribution-modal-form-view");
  const contributionSuccess = document.getElementById("contribution-modal-success");
  const contributionForm = document.getElementById("contribution-interest-form");

  function resetContributionModal() {
    if (contributionFormView) contributionFormView.hidden = false;
    if (contributionSuccess) contributionSuccess.hidden = true;
    if (contributionForm) contributionForm.reset();
  }

  function openContributionModal() {
    resetContributionModal();
    if (contributionModal && typeof contributionModal.showModal === "function") {
      contributionModal.showModal();
    }
  }

  function closeContributionModal() {
    if (contributionModal && contributionModal.open) {
      contributionModal.close();
    }
  }

  if (contributionModal && contributionOpen) {
    contributionOpen.addEventListener("click", openContributionModal);

    contributionModal.addEventListener("click", function (e) {
      if (e.target === contributionModal) {
        closeContributionModal();
      }
    });

    contributionModal.addEventListener("close", resetContributionModal);

    document.querySelectorAll(".contribution-modal-close, .js-close-contribution-modal").forEach(function (btn) {
      btn.addEventListener("click", closeContributionModal);
    });

    if (contributionForm) {
      contributionForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!contributionForm.checkValidity()) {
          contributionForm.reportValidity();
          return;
        }
        if (contributionFormView) contributionFormView.hidden = true;
        if (contributionSuccess) contributionSuccess.hidden = false;
      });
    }
  }
})();

/* ==========================================================================
   Portfolio JavaScript – Hiba Makhzoumi
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initSmoothScroll();
  initProjectFilters();
  initContactForm();
  initScrollReveal();
  initCurrentYear();
});

/* ------------------------------------------------------------------ */
/* Mobile Navigation                                                  */
/* ------------------------------------------------------------------ */
function initMobileNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");
  const quickNavLinks = document.querySelectorAll(".mobile-nav-link");

  if (!navToggle || !navMenu) return;

  quickNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      quickNavLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("open");
    navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", !isOpen);
  });

  // Close menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ------------------------------------------------------------------ */
/* Smooth Scrolling for Navigation Links                              */
/* ------------------------------------------------------------------ */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });
}

/* ------------------------------------------------------------------ */
/* Project Filtering                                                  */
/* ------------------------------------------------------------------ */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      // Update active button
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter cards
      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "flex";
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          requestAnimationFrame(() => {
            card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          });
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* ------------------------------------------------------------------ */
/* Contact Form Validation                                            */
/* ------------------------------------------------------------------ */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const fields = [
    { id: "contact-name", errorId: "error-contact-name", type: "text", required: true },
    { id: "contact-email", errorId: "error-contact-email", type: "email", required: true },
    { id: "contact-subject", errorId: "error-contact-subject", type: "text", required: true },
    { id: "contact-message", errorId: "error-contact-message", type: "textarea", required: true },
  ];
  const status = document.getElementById("contact-form-status");

  const showError = (field) => {
    const errorEl = document.getElementById(field.errorId);
    const input = document.getElementById(field.id);
    const value = input.value.trim();

    let message = "";
    if (field.required && value === "") {
      message = "This field is required.";
    } else if (field.type === "email" && value !== "" && !validateEmail(value)) {
      message = "Please enter a valid email address.";
    }

    if (errorEl) errorEl.textContent = message;
    input.classList.toggle("error", Boolean(message));
    input.setAttribute("aria-invalid", String(Boolean(message)));
    return Boolean(message);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Real-time validation on blur
  fields.forEach((field) => {
    const input = document.getElementById(field.id);
    if (!input) return;

    input.addEventListener("blur", () => showError(field));

    input.addEventListener("input", () => {
      if (input.classList.contains("error")) showError(field);
      if (status) status.textContent = "";
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const hasError = fields.reduce((hasErrors, field) => showError(field) || hasErrors, false);

    if (hasError) {
      if (status) {
        status.textContent = "Please check the highlighted fields and try again.";
        status.classList.add("is-error");
        status.classList.remove("is-info");
      }
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const subject = document.getElementById("contact-subject").value.trim();
    const message = document.getElementById("contact-message").value.trim();
    const emailSubject = subject || `Portfolio contact from ${name}`;
    const emailBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message,
    ].join("\n");
    const mailtoUrl = `mailto:makhzoumihibz00@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    if (status) {
      status.textContent = "Opening your email app with a draft. Review it and press Send to deliver your message.";
      status.classList.add("is-info");
      status.classList.remove("is-error");
    }

    window.location.href = mailtoUrl;
  });
}

/* ------------------------------------------------------------------ */
/* Scroll Reveal Animations                                           */
/* ------------------------------------------------------------------ */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll(
    ".skill-category, .timeline-item, .project-card, .education-card, .contact-item, .contact-form-wrapper, .about-text"
  );

  revealElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

/* ------------------------------------------------------------------ */
/* Current Year in Footer                                             */
/* ------------------------------------------------------------------ */
function initCurrentYear() {
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

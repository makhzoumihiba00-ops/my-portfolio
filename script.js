/* ==========================================================================
   Portfolio JavaScript – Hiba Makhzoumi
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initSmoothScroll();
  initSectionNavigation();
  initLivingCanvas();
  initAboutStory();
  initSkillsExplorer();
  initExperienceJourney();
  initProjectGallery();
  initEducationArchive();
  initContactExperience();
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
  const mobileLayout = window.matchMedia("(max-width: 920px)");

  if (!navToggle || !navMenu) return;

  quickNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      quickNavLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  const setMenuOpen = (isOpen) => {
    navMenu.classList.toggle("open", isOpen);
    document.querySelector(".header")?.classList.toggle("is-menu-open", isOpen);
    document.documentElement.classList.toggle("nav-open", isOpen);
    navMenu.inert = !isOpen && mobileLayout.matches;
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
    if (isOpen) {
      const firstLink = navMenu.querySelector("a[href]");
      const focusFirstLink = () => {
        if (
          navMenu.classList.contains("open") &&
          !navMenu.inert &&
          !navMenu.contains(document.activeElement)
        ) {
          firstLink?.focus({ preventScroll: true });
        }
      };

      window.setTimeout(focusFirstLink, 360);
    }
  };

  navMenu.inert = mobileLayout.matches;
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("open");
    setMenuOpen(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (!navMenu.classList.contains("open")) return;

    if (event.key === "Escape") {
      setMenuOpen(false);
      navToggle.focus();
      return;
    }

    if (event.key === "Tab") {
      const menuLinks = navMenu.querySelectorAll("a[href]");
      const firstLink = menuLinks[0];
      const lastLink = menuLinks[menuLinks.length - 1];
      if (event.shiftKey && document.activeElement === navToggle) {
        event.preventDefault();
        lastLink.focus();
      } else if (event.shiftKey && document.activeElement === firstLink) {
        event.preventDefault();
        lastLink.focus();
      } else if (!event.shiftKey && document.activeElement === lastLink) {
        event.preventDefault();
        firstLink.focus();
      }
    }
  });

  document.addEventListener("click", (event) => {
    if (
      navMenu.classList.contains("open") &&
      !navMenu.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });

  const syncMenuToViewport = () => {
    if (!mobileLayout.matches) {
      const wasOpen = navMenu.classList.contains("open");
      setMenuOpen(false);
      if (wasOpen && document.activeElement === navToggle) navLinks[0]?.focus();
    } else {
      navMenu.inert = !navMenu.classList.contains("open");
    }
  };

  mobileLayout.addEventListener("change", syncMenuToViewport);
  window.addEventListener("resize", syncMenuToViewport);
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
        const headerOffset =
          (document.querySelector(".header")?.offsetHeight || 64) + 16;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });

        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });
}

/* ------------------------------------------------------------------ */
/* Active Section Navigation                                          */
/* ------------------------------------------------------------------ */
function initSectionNavigation() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(
    '.nav-menu a[href^="#"], .mobile-nav-link[href^="#"]'
  );
  const header = document.querySelector(".header");

  const setActiveSection = (sectionId) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (first, second) =>
            Math.abs(first.boundingClientRect.top) -
            Math.abs(second.boundingClientRect.top)
        );

      if (visibleSections[0]) {
        setActiveSection(visibleSections[0].target.id);
      }
    },
    {
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ------------------------------------------------------------------ */
/* Living Canvas                                                      */
/* ------------------------------------------------------------------ */
function initLivingCanvas() {
  const canvas = document.getElementById("living-canvas");
  if (!canvas) return;

  const status = document.getElementById("canvas-status");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const sequenceTimers = [];
  const phases = [
    { name: "structure", delay: 500 },
    { name: "design", delay: 1100 },
    { name: "build", delay: 1750 },
    { name: "alive", delay: 2450 },
  ];

  const runSequence = (announce = false) => {
    sequenceTimers.forEach((timer) => window.clearTimeout(timer));
    sequenceTimers.length = 0;

    if (reduceMotion) {
      canvas.dataset.phase = "alive";
      if (announce && status) status.textContent = "Canvas ready.";
      return;
    }

    canvas.dataset.phase = "idea";
    if (announce && status) status.textContent = "Replaying the interface assembly.";

    phases.forEach(({ name, delay }) => {
      sequenceTimers.push(
        window.setTimeout(() => {
          canvas.dataset.phase = name;
          if (name === "alive" && status) {
            status.textContent = "Canvas ready. Explore its theme and components.";
          }
        }, delay)
      );
    });
  };

  canvas.querySelectorAll("[data-theme]").forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.dataset.theme;
      canvas.dataset.canvasTheme = theme;
      canvas.querySelectorAll("[data-theme]").forEach((themeButton) => {
        const isActive = themeButton === button;
        themeButton.classList.toggle("is-active", isActive);
        themeButton.setAttribute("aria-pressed", String(isActive));
      });
      if (status) {
        status.textContent = `Miniature website theme: ${
          theme === "night" ? "night" : "paper"
        }.`;
      }
    });
  });

  canvas.querySelectorAll("[data-canvas-select]").forEach((button) => {
    button.addEventListener("click", () => {
      const selection = button.dataset.canvasSelect;
      canvas.dataset.selected = selection;
      canvas.querySelectorAll(".canvas-select-button").forEach((control) => {
        const isActive = control.dataset.canvasSelect === selection;
        control.classList.toggle("is-active", isActive);
        control.setAttribute("aria-pressed", String(isActive));
      });
      if (status) {
        const labels = {
          action: "call to action",
          navigation: "navigation",
          shape: "form",
          type: "typography",
        };
        status.textContent = `Selected: ${labels[selection] || selection}.`;
      }
    });
  });

  canvas.querySelector(".canvas-replay")?.addEventListener("click", () => {
    runSequence(true);
  });

  const canTilt =
    !reduceMotion &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (canTilt) {
    canvas.addEventListener("pointermove", (event) => {
      const bounds = canvas.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      canvas.style.setProperty("--canvas-tilt-x", `${-y * 2.2}deg`);
      canvas.style.setProperty("--canvas-tilt-y", `${x * 2.2}deg`);
    });

    canvas.addEventListener("pointerleave", () => {
      canvas.style.setProperty("--canvas-tilt-x", "0deg");
      canvas.style.setProperty("--canvas-tilt-y", "0deg");
    });
  }

  if (!reduceMotion) {
    document.querySelector(".hero--studio")?.classList.add("is-intro");
    window.requestAnimationFrame(() => runSequence());
  }
}

/* ------------------------------------------------------------------ */
/* About Editorial Story                                              */
/* ------------------------------------------------------------------ */
function initAboutStory() {
  const section = document.querySelector(".about-editorial");
  if (!section) return;

  const chapters = section.querySelectorAll(".about-chapter");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    section.classList.add("about-motion-ready", "about-heading-visible");
    chapters.forEach((chapter) => chapter.classList.add("is-visible"));
    section.style.setProperty("--about-progress", "1");
    return;
  }

  section.classList.add("about-motion-ready");

  const sectionObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add("about-heading-visible", "about-mark-visible");
      sectionObserver.disconnect();
    },
    { threshold: 0.08 }
  );
  sectionObserver.observe(section);

  const chapterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.18 }
  );
  chapters.forEach((chapter) => chapterObserver.observe(chapter));

  let progressFrame = 0;
  const updateProgress = () => {
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(() => {
      progressFrame = 0;
      const bounds = section.getBoundingClientRect();
      const travel = window.innerHeight + bounds.height;
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight - bounds.top) / travel)
      );
      section.style.setProperty("--about-progress", progress.toFixed(3));
    });
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

/* ------------------------------------------------------------------ */
/* Skills Tech Playground                                             */
/* ------------------------------------------------------------------ */
function initSkillsExplorer() {
  const system = document.getElementById("skills-system");
  if (!system) return;

  const categoryTabs = [...system.querySelectorAll(".skills-category-tab")];
  const technologyNodes = [...system.querySelectorAll(".skills-tech-node")];
  const resetButton = system.querySelector(".skills-reset");
  const panel = {
    kicker: document.getElementById("skills-detail-kicker"),
    index: document.getElementById("skills-detail-index"),
    title: document.getElementById("skills-detail-title"),
    copy: document.getElementById("skills-detail-copy"),
    count: document.getElementById("skills-detail-count"),
  };
  const categories = {
    overview: {
      label: "SYSTEM OVERVIEW",
      index: "00 / 04",
      title: "A connected toolkit.",
      copy: "Choose a category to explore the technologies I use across the development process. Select any technology for a closer look.",
      count: `${technologyNodes.length} TECHNOLOGIES`,
    },
    frontend: {
      label: "01 / INTERFACE",
      index: "01 / 04",
      title: "Where people meet the product.",
      copy: "Markup, styling, interaction, and responsive interfaces shape the experience on screen.",
      count: "",
    },
    backend: {
      label: "02 / APPLICATION",
      index: "02 / 04",
      title: "The logic behind the interface.",
      copy: "Server-side development, application structure, and REST API fundamentals support useful web experiences.",
      count: "",
    },
    databases: {
      label: "03 / DATA",
      index: "03 / 04",
      title: "Information, clearly structured.",
      copy: "Relational data, SQL, and database design provide a structure for application information.",
      count: "",
    },
    tools: {
      label: "04 / WORKFLOW",
      index: "04 / 04",
      title: "Tools for the day-to-day.",
      copy: "Version control, code collaboration, an editor, and dependency management support the development workflow.",
      count: "",
    },
  };
  const categoryCounts = technologyNodes.reduce((counts, node) => {
    const category = node.dataset.skillCategory;
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});

  const updateCategoryTabs = (category) => {
    categoryTabs.forEach((tab) => {
      const selected = tab.dataset.skillCategory === category;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
  };

  const updatePanel = (category, technology = null) => {
    const details = categories[category];
    panel.kicker.textContent = technology
      ? `${category.toUpperCase()} / SELECTED NODE`
      : details.label;
    panel.index.textContent = details.index;
    panel.title.textContent = technology
      ? technology.dataset.skillTech
      : details.title;
    panel.copy.textContent = technology
      ? technology.dataset.skillDescription
      : details.copy;
    panel.count.textContent = technology
      ? `${details.index.slice(0, 2)} / ${categoryCounts[category]} IN CATEGORY`
      : category === "overview"
        ? details.count
        : `${categoryCounts[category]} TECHNOLOGIES`;
    resetButton.hidden = category === "overview" && !technology;
  };

  const selectCategory = (category, focusTab = false) => {
    if (!categories[category]) return;

    system.dataset.category = category;
    system.dataset.selectedTech = "";
    updateCategoryTabs(category);
    technologyNodes.forEach((node) => {
      node.setAttribute("aria-pressed", "false");
      node.classList.remove("is-selected");
    });
    updatePanel(category);

    if (focusTab) {
      categoryTabs.find((tab) => tab.dataset.skillCategory === category)?.focus();
    }
  };

  categoryTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      selectCategory(tab.dataset.skillCategory);
    });
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (index + 1) % categoryTabs.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index - 1 + categoryTabs.length) % categoryTabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = categoryTabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      selectCategory(categoryTabs[nextIndex].dataset.skillCategory, true);
    });
  });

  technologyNodes.forEach((node) => {
    node.setAttribute("aria-pressed", "false");
    node.addEventListener("click", () => {
      const category = node.dataset.skillCategory;
      system.dataset.category = category;
      system.dataset.selectedTech = node.dataset.skillTech;
      updateCategoryTabs(category);
      technologyNodes.forEach((technology) => {
        const selected = technology === node;
        technology.classList.toggle("is-selected", selected);
        technology.setAttribute("aria-pressed", String(selected));
      });
      updatePanel(category, node);
    });
  });

  resetButton.addEventListener("click", () => {
    selectCategory("overview");
  });
}

/* ------------------------------------------------------------------ */
/* Experience Journey                                                 */
/* ------------------------------------------------------------------ */
function initExperienceJourney() {
  const section = document.querySelector(".experience-journey");
  if (!section) return;

  const chapters = [...section.querySelectorAll("[data-journey-chapter]")];
  const links = [...section.querySelectorAll("[data-journey-link]")];
  const currentCount = section.querySelector("#journey-current-count");
  const currentYear = section.querySelector("#journey-current-year");
  const currentTitle = section.querySelector("#journey-current-title");
  const progress = section.querySelector("#journey-progress");
  const progressFill = section.querySelector("#journey-progress-fill");
  const progressCaption = section.querySelector("#journey-progress-caption");

  if (!chapters.length || !links.length) return;

  const setActiveChapter = (index) => {
    const chapter = chapters[index];
    if (!chapter) return;
    const title = chapter.dataset.journeyTitle;
    const hasChanged = currentTitle.textContent !== title;

    chapters.forEach((item, chapterIndex) => {
      item.classList.toggle("is-active", chapterIndex === index);
    });
    links.forEach((link, linkIndex) => {
      if (linkIndex === index) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "step");
      } else {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      }
    });

    const chapterNumber = String(index + 1).padStart(2, "0");
    const chapterYear = chapter.dataset.journeyYear;
    currentCount.innerHTML = `${chapterNumber} <i>/ ${String(chapters.length).padStart(2, "0")}</i>`;
    currentYear.textContent = chapterYear;
    currentYear.classList.toggle(
      "journey-current-year-unlisted",
      chapterYear === "DATE NOT LISTED"
    );
    currentTitle.textContent = title;
    progress.value = index + 1;
    progress.setAttribute(
      "aria-valuetext",
      `Chapter ${index + 1} of ${chapters.length}`
    );
    progressFill.style.transform = `scaleX(${(index + 1) / chapters.length})`;
    progressCaption.textContent = `${chapterNumber} — ${String(chapters.length).padStart(2, "0")}`;

    if (
      hasChanged &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      [currentCount, currentYear, currentTitle].forEach((element) => {
        if (typeof element.animate === "function") {
          element.animate(
            [
              { opacity: 0.55, transform: "translateY(0.35rem)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 280, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
          );
        }
      });
    }
  };

  links.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveChapter(Number(link.dataset.journeyLink));
    });
  });

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;

      const activeLine = window.innerHeight * 0.44;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      chapters.forEach((chapter, index) => {
        const bounds = chapter.getBoundingClientRect();
        const distance =
          activeLine < bounds.top
            ? bounds.top - activeLine
            : activeLine > bounds.bottom
              ? activeLine - bounds.bottom
              : 0;
        if (distance < closestDistance) {
          closestIndex = index;
          closestDistance = distance;
        }
      });
      setActiveChapter(closestIndex);
    },
    { rootMargin: "-34% 0px -54% 0px", threshold: 0 }
  );

  chapters.forEach((chapter) => observer.observe(chapter));
}

/* ------------------------------------------------------------------ */
/* Project Gallery                                                    */
/* ------------------------------------------------------------------ */
function initProjectGallery() {
  const section = document.querySelector(".digital-showroom");
  if (!section) return;

  const projects = [...section.querySelectorAll("[data-showcase-project]")];
  const projectLinks = [...section.querySelectorAll("[data-showroom-link]")];
  const counter = section.querySelector("#showroom-counter");
  const totalLabel = section.querySelector("#showroom-index-total");
  const dialog = section.querySelector("#project-detail-dialog");
  const detailContent = section.querySelector(".project-detail-content");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!projects.length || !counter || !dialog || !detailContent) return;

  if (
    window.history.state &&
    Object.prototype.hasOwnProperty.call(window.history.state, "projectDetail")
  ) {
    const pageState = { ...window.history.state };
    delete pageState.projectDetail;
    window.history.replaceState(pageState, "", window.location.href);
  }

  const total = projects.length;
  const formatIndex = (index) => String(index + 1).padStart(2, "0");

  if (totalLabel) {
    const formattedTotal = String(total).padStart(2, "0");
    totalLabel.textContent = `${formattedTotal} / ${formattedTotal}`;
  }

  const setActiveProject = (index) => {
    const project = projects[index];
    if (!project) return;

    const number = formatIndex(index);
    counter.innerHTML = `${number} <i>—</i> ${formatIndex(total - 1)}`;
    counter.setAttribute("aria-label", `Project ${index + 1} of ${total}`);
    section.dataset.activeProject = project.dataset.projectKey;

    projectLinks.forEach((link) => {
      if (link.dataset.showroomLink === project.dataset.projectKey) {
        link.setAttribute("aria-current", "step");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  setActiveProject(0);

  const syncActiveProject = () => {
    const sectionBounds = section.getBoundingClientRect();
    if (
      sectionBounds.bottom < window.innerHeight * 0.15 ||
      sectionBounds.top > window.innerHeight * 0.85
    ) {
      return;
    }

    const activeLine = window.innerHeight * 0.44;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    projects.forEach((project, index) => {
      const bounds = project.getBoundingClientRect();
      const distance = Math.abs((bounds.top + bounds.bottom) / 2 - activeLine);
      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    });
    setActiveProject(closestIndex);
  };

  let scrollFrame = 0;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        syncActiveProject();
      });
    },
    { passive: true }
  );

  projectLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const index = projects.findIndex(
        (project) => project.dataset.projectKey === link.dataset.showroomLink
      );
      if (index >= 0) setActiveProject(index);
    });
  });

  const projectObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });

        syncActiveProject();
        },
        { rootMargin: "-30% 0px -35% 0px", threshold: 0 }
      )
    : null;

  projects.forEach((project) => {
    if (projectObserver) projectObserver.observe(project);
    project.querySelectorAll("[data-project-open]").forEach((control) => {
      control.addEventListener("click", () => {
        openProjectDetail(project.dataset.projectKey, control);
      });
    });

    const stage = project.querySelector(".showcase-stage");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!stage || !finePointer.matches) return;

    stage.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      const bounds = stage.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const offsetX = reducedMotion ? 0 : (x / bounds.width - 0.5) * 8;
      const offsetY = reducedMotion ? 0 : (y / bounds.height - 0.5) * 8;
      stage.style.setProperty("--explore-x", `${x}px`);
      stage.style.setProperty("--explore-y", `${y}px`);
      stage.style.setProperty("--image-shift-x", `${offsetX}px`);
      stage.style.setProperty("--image-shift-y", `${offsetY}px`);
      stage.classList.add("is-pointer-active");
      project.classList.add("is-exploring");
    });

    stage.addEventListener("pointerleave", () => {
      stage.classList.remove("is-pointer-active");
      project.classList.remove("is-exploring");
    });
  });

  if (projectObserver && !reducedMotion) {
    section.classList.add("showroom-motion-ready");
    projects.forEach((project) => project.classList.remove("is-visible"));
  } else {
    projects.forEach((project) => project.classList.add("is-visible"));
  }

  let activeProjectKey = null;
  let lastOpener = null;

  const openProjectDetail = (key, opener) => {
    const template = section.querySelector(`#project-detail-${key}`);
    if (!template || !template.content) return;

    activeProjectKey = key;
    if (opener) lastOpener = opener;
    detailContent.replaceChildren(template.content.cloneNode(true));

    window.history.pushState(
      { ...(window.history.state || {}), projectDetail: key },
      "",
      window.location.href
    );

    dialog.showModal();
    dialog.querySelector(".project-detail-close").focus();
  };

  const closeProjectDetail = (returnThroughHistory = true) => {
    if (!dialog.open) return;

    const shouldGoBack =
      returnThroughHistory &&
      window.history.state?.projectDetail === activeProjectKey;
    dialog.close();
    activeProjectKey = null;

    if (shouldGoBack) window.history.back();
    if (lastOpener?.isConnected) lastOpener.focus();
  };

  dialog.addEventListener("click", (event) => {
    const closeControl = event.target.closest("[data-project-close]");
    if (closeControl) {
      closeProjectDetail();
      return;
    }
    if (event.target === dialog) closeProjectDetail();
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeProjectDetail();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    closeProjectDetail();
  });

  window.addEventListener("popstate", () => {
    if (dialog.open) closeProjectDetail(false);
  });
}

/* ------------------------------------------------------------------ */
/* Education Archive                                                  */
/* ------------------------------------------------------------------ */
function initEducationArchive() {
  const section = document.querySelector(".education-archive");
  if (!section) return;

  const records = [...section.querySelectorAll("[data-education-record]")];
  const indexButtons = [...section.querySelectorAll("[data-education-index]")];
  if (!records.length || records.length !== indexButtons.length) return;

  const setActiveRecord = (activeIndex) => {
    records.forEach((record, index) => {
      const summary = record.querySelector(".education-record-summary");
      const panel = record.querySelector(".education-record-panel");
      const isActive = index === activeIndex;

      record.classList.toggle("is-active", isActive);
      summary.setAttribute("aria-expanded", String(record.open));
      panel.hidden = !record.open;
    });

    indexButtons.forEach((button, index) => {
      const isActive = index === activeIndex;
      button.classList.toggle("is-active", isActive);
      if (isActive) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  };

  const initialIndex = Math.max(
    0,
    records.findIndex((record) => record.open)
  );
  setActiveRecord(initialIndex);

  records.forEach((record, index) => {
    record.addEventListener("toggle", () => {
      if (record.open) {
        records.forEach((otherRecord) => {
          if (otherRecord !== record) otherRecord.open = false;
        });
        setActiveRecord(index);
      } else if (indexButtons[index].classList.contains("is-active")) {
        const nextOpenIndex = records.findIndex((item) => item.open);
        setActiveRecord(nextOpenIndex >= 0 ? nextOpenIndex : index);
      } else {
        setActiveRecord(indexButtons.findIndex((button) => button.classList.contains("is-active")));
      }
    });
  });

  indexButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      records.forEach((record, recordIndex) => {
        record.open = recordIndex === index;
      });
      setActiveRecord(index);
      records[index].scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "nearest",
      });
    });

    button.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        nextIndex = (index + 1) % indexButtons.length;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        nextIndex = (index - 1 + indexButtons.length) % indexButtons.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = indexButtons.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      indexButtons[nextIndex].focus();
      indexButtons[nextIndex].click();
    });
  });
}

/* ------------------------------------------------------------------ */
/* Contact Panel                                                      */
/* ------------------------------------------------------------------ */
function initContactExperience() {
  const trigger = document.getElementById("open-contact-panel");
  const panel = document.getElementById("contact-panel");
  const closeButton = panel?.querySelector(".contact-panel-close");
  const heading = document.getElementById("contact-panel-heading");

  if (!trigger || !(panel instanceof HTMLDialogElement) || !closeButton) return;

  const closePanel = () => {
    if (panel.open) panel.close();
    trigger.setAttribute("aria-expanded", "false");
    trigger.classList.remove("is-active");
    trigger.focus({ preventScroll: true });
  };

  trigger.addEventListener("click", () => {
    if (!panel.open) panel.showModal();
    trigger.setAttribute("aria-expanded", "true");
    trigger.classList.add("is-active");
    window.requestAnimationFrame(() => heading?.focus({ preventScroll: true }));
  });

  closeButton.addEventListener("click", closePanel);

  panel.addEventListener("click", (event) => {
    if (event.target === panel) closePanel();
  });

  panel.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    closePanel();
  });

  panel.addEventListener("close", () => {
    trigger.setAttribute("aria-expanded", "false");
    trigger.classList.remove("is-active");
  });

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  if (!prefersReducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
    trigger.addEventListener("pointermove", (event) => {
      const bounds = trigger.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
      trigger.style.setProperty("--mag-x", `${x.toFixed(1)}px`);
      trigger.style.setProperty("--mag-y", `${y.toFixed(1)}px`);
    });

    trigger.addEventListener("pointerleave", () => {
      trigger.style.removeProperty("--mag-x");
      trigger.style.removeProperty("--mag-y");
    });
  }
}

/* ------------------------------------------------------------------ */
/* Scroll Reveal Animations                                           */
/* ------------------------------------------------------------------ */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll(
    ".skill-category, .timeline-item, .education-card"
  );

  revealElements.forEach((el) => {
    el.classList.add("reveal");
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

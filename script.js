let slideIndex = 1;

let slideTimer;

document.addEventListener("DOMContentLoaded", () => {
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const dotButtons = document.querySelectorAll(".dot");
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  setActiveNav();
  initReveal();
  initContactForm();

  if (navToggle && mainNav) {
    const setNavState = (isOpen) => {
      mainNav.classList.toggle("is-open", isOpen);
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    };

    navToggle.addEventListener("click", () => {
      const isOpen = !navToggle.classList.contains("is-open");
      setNavState(isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavState(false));
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (
        !mainNav.contains(target) &&
        !navToggle.contains(target) &&
        mainNav.classList.contains("is-open")
      ) {
        setNavState(false);
      }
    });
  }

  if (prevButton && nextButton) {
    prevButton.addEventListener("click", () => {
      changeSlide(-1);
      resetAutoSlide();
    });

    nextButton.addEventListener("click", () => {
      changeSlide(1);
      resetAutoSlide();
    });
  }

  if (dotButtons.length > 0) {
    dotButtons.forEach((dot) => {
      dot.addEventListener("click", () => {
        const slideNumber = Number(dot.dataset.slide);
        currentSlide(slideNumber);
        resetAutoSlide();
      });
    });
  }

  setupPaymentRedirects();
  initHeaderScroll();

  if (document.getElementsByClassName("slide").length > 0) {
    showSlides(slideIndex);
    startAutoSlide();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoSlide();
      } else {
        startAutoSlide();
      }
    });
  }
});

function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".main-nav a");

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (!linkHref) return;

    if (
      linkHref === currentPage ||
      (currentPage === "" && linkHref === "index.html")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function initReveal() {
  const revealItems = document.querySelectorAll(
    ".section, .feature-grid article, .product-card, .payment-card, .contact-card, .image-card, .hero-banner",
  );

  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal");
    observer.observe(item);
  });
}

function initContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameField = form.querySelector('input[type="text"]');
    const message = document.createElement("p");
    message.className = "form-message";
    message.setAttribute("role", "status");
    message.setAttribute("aria-live", "polite");
    message.textContent = `Thanks${nameField && nameField.value ? ", " + nameField.value : ""}! Your message has been sent.`;

    const existingMessage = form.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    form.appendChild(message);
    form.reset();
  });
}

function setupPaymentRedirects() {
  const paymentButtons = document.querySelectorAll(".payment-button");

  paymentButtons.forEach((button) => {
    const redirectUrl = button.dataset.url;
    if (!redirectUrl) return;

    button.addEventListener("click", () => {
      window.location.href = redirectUrl;
    });
  });
}

function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let lastScrollY = window.pageYOffset;
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.pageYOffset;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollY > lastScrollY + 10) {
            header.classList.add("site-header--hidden");
            header.classList.remove("site-header--visible");
            header.classList.add("site-header--scrolled");
          } else if (currentScrollY < lastScrollY - 10) {
            header.classList.remove("site-header--hidden");
            header.classList.add("site-header--visible");
            header.classList.add("site-header--scrolled");
          }

          if (currentScrollY <= 20) {
            header.classList.remove("site-header--scrolled");
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
      }

      ticking = true;
    },
    { passive: true },
  );
}

function startAutoSlide() {
  stopAutoSlide();
  slideTimer = setInterval(() => {
    changeSlide(1);
  }, 5000);
}

function stopAutoSlide() {
  if (slideTimer) {
    clearInterval(slideTimer);
  }
}

function resetAutoSlide() {
  stopAutoSlide();
  startAutoSlide();
}

function changeSlide(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  const slides = document.getElementsByClassName("slide");
  const dots = document.getElementsByClassName("dot");

  if (slides.length === 0) {
    return;
  }

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("is-active", "is-prev");
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  const activeSlide = slides[slideIndex - 1];
  activeSlide.classList.add("is-active");

  for (let i = 0; i < slides.length; i++) {
    if (i !== slideIndex - 1) {
      slides[i].classList.add("is-prev");
    }
  }

  dots[slideIndex - 1].className += " active";
}

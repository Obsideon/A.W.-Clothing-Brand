let slideIndex = 1;

let slideTimer;

document.addEventListener("DOMContentLoaded", () => {
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const dotButtons = document.querySelectorAll(".dot");

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
    slides[i].style.display = "none";
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

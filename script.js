/* =========================================================
   SHINEWORKS CAR WASH - INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = mobileMenu.querySelectorAll("a");
  const slides = [...document.querySelectorAll(".carousel-slide")];
  const dotsContainer = document.getElementById("carouselDots");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const form = document.getElementById("bookingForm");
  const status = document.getElementById("formStatus");
  const dateInput = document.getElementById("bookingDate");

  /* ---------- Navigation ---------- */
  const updateNavbar = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };
  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  const toggleMenu = () => {
    const open = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  };

  hamburger.addEventListener("click", toggleMenu);
  mobileLinks.forEach(link => link.addEventListener("click", () => {
    if (mobileMenu.classList.contains("open")) toggleMenu();
  }));

  /* ---------- Hero Carousel ---------- */
  let current = 0;
  let timer;
  let touchStartX = 0;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index, true));
    dotsContainer.appendChild(dot);
  });

  const dots = [...dotsContainer.querySelectorAll(".carousel-dot")];

  function showSlide(index, restartTimer = false) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
      const heroText = slide.querySelector(".hero-text");
      if (heroText) {
        heroText.classList.remove("slide-in-left", "slide-in-right");
        if (i === current) {
          const directionClass = i % 2 === 0 ? "slide-in-left" : "slide-in-right";
          void heroText.offsetWidth;
          heroText.classList.add(directionClass);
          setTimeout(() => heroText.classList.add("reveal"), 80);
        } else {
          heroText.classList.remove("reveal");
        }
      }
    });

    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));

    if (restartTimer) startAutoPlay();
  }

  function nextSlide() { showSlide(current + 1); }
  function prevSlide() { showSlide(current - 1); }

  function startAutoPlay() {
    clearInterval(timer);
    timer = setInterval(nextSlide, 6500);
  }

  nextBtn.addEventListener("click", () => showSlide(current + 1, true));
  prevBtn.addEventListener("click", () => showSlide(current - 1, true));

  const carousel = document.querySelector(".carousel-container");
  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", startAutoPlay);

  carousel.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener("touchend", e => {
    const distance = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) > 50) {
      distance < 0 ? nextSlide() : prevSlide();
      startAutoPlay();
    }
  }, { passive: true });

  showSlide(0);
  startAutoPlay();

  /* ---------- Scroll Reveal ---------- */
  const revealElements = document.querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right, .scale-in"
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  revealElements.forEach(el => observer.observe(el));

  /* ---------- Booking Date ---------- */
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString().split("T")[0];
  dateInput.min = localToday;

  /* ---------- Booking Form -> WhatsApp ---------- */
  form.addEventListener("submit", e => {
    e.preventDefault();

    const data = new FormData(form);
    const name = data.get("name").trim();
    const phone = data.get("phone").trim();
    const vehicle = data.get("vehicle");
    const service = data.get("service");
    const date = data.get("date");
    const time = data.get("time");
    const message = data.get("message").trim();

    const bookingMessage =
`Hello ShineWorks! I'd like to make a booking.

Name: ${name}
Phone: ${phone}
Vehicle: ${vehicle}
Service: ${service}
Preferred date: ${date}
Preferred time: ${time}
${message ? `Message: ${message}` : ""}`;

    const whatsappNumber = "260975487259";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(bookingMessage)}`;

    status.style.display = "block";
    status.textContent = "Opening WhatsApp with your booking details...";
    window.open(url, "_blank", "noopener,noreferrer");
  });

  /* ---------- Current Year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Keyboard accessibility for carousel ---------- */
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") {
      nextSlide();
      startAutoPlay();
    }
    if (e.key === "ArrowLeft") {
      prevSlide();
      startAutoPlay();
    }
  });
});

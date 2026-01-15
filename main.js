// main.js
// JavaScript untuk Interaksi dan Animasi

document.addEventListener("DOMContentLoaded", function () {
  console.log("Landing Page Roti Gembong Raja Mahakam loaded.");

  // ===== SET CURRENT YEAR IN FOOTER =====
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // ===== MOBILE MENU TOGGLE =====
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuIcon = document.getElementById("menuIcon");
  const menuPath = document.getElementById("menuPath");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      // Toggle visibility
      mobileMenu.classList.toggle("hidden");
      // Update ARIA attributes
      menuToggle.setAttribute("aria-expanded", !isExpanded);
      mobileMenu.setAttribute("aria-hidden", isExpanded);

      // Animate hamburger icon to 'X'
      if (!isExpanded) {
        // Open state -> change to 'X'
        menuPath.setAttribute("d", "M6 18L18 6M6 6l12 12");
      } else {
        // Close state -> change back to hamburger
        menuPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
      }
    });

    // Close mobile menu when clicking a link (optional)
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuToggle.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
        menuPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16"); // Reset icon
      });
    });
  }

  // ===== SCROLLSPY / ACTIVE NAV LINK =====
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link, .nav-link-mobile");

  function updateActiveLink() {
    let current = "";
    const scrollPosition = window.scrollY + 100; // Offset for better UX

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  // Run once on load to set initial state
  updateActiveLink();

  // ===== BACK TO TOP BUTTON =====
  const backToTopBtn = document.getElementById("backToTop");

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.remove("opacity-0", "invisible");
        backToTopBtn.classList.add("opacity-100");
      } else {
        backToTopBtn.classList.remove("opacity-100");
        backToTopBtn.classList.add("opacity-0");
        setTimeout(() => {
          if (window.scrollY <= 500) {
            backToTopBtn.classList.add("invisible");
          }
        }, 300); // Match transition duration
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ===== REVEAL ANIMATIONS ON SCROLL (IntersectionObserver) =====
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Optional: Stop observing after animation triggers
        // observer.unobserve(entry.target);
      }
      // Optional: Remove class when out of view
      // else {
      //     entry.target.classList.remove('active');
      // }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observe all elements with reveal classes
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-up, .reveal-left, .reveal-right"
  );
  revealElements.forEach((el) => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mediaQuery || !mediaQuery.matches) {
      observer.observe(el);
    } else {
      // If reduced motion preferred, show elements immediately
      el.classList.add("active");
    }
  });

  // ===== FAQ ACCORDION =====
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((button) => {
    button.addEventListener("click", () => {
      const faqItem = button.closest(".faq-item");
      const answer = faqItem.querySelector(".faq-answer");
      const icon = button.querySelector(".faq-icon");
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      // Close all other open FAQs (optional - comment out for independent accordion)
      // faqQuestions.forEach(otherButton => {
      //     if (otherButton !== button) {
      //         const otherItem = otherButton.closest('.faq-item');
      //         const otherAnswer = otherItem.querySelector('.faq-answer');
      //         const otherIcon = otherButton.querySelector('.faq-icon');
      //         otherButton.setAttribute('aria-expanded', 'false');
      //         otherAnswer.classList.remove('open');
      //         otherIcon.classList.remove('rotate-180');
      //     }
      // });

      // Toggle current FAQ
      button.setAttribute("aria-expanded", !isExpanded);
      answer.classList.toggle("open");
      icon.classList.toggle("rotate-180");
    });
  });

  // ===== FORM VALIDATION & SUBMISSION =====
  const franchiseForm = document.getElementById("franchiseForm");
  const submitBtn = document.getElementById("submitBtn");
  const submitText = document.getElementById("submitText");
  const submitIcon = document.getElementById("submitIcon");

  if (franchiseForm) {
    franchiseForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent actual form submission

      // Reset previous errors
      clearErrors();

      // Get form values
      const nama = document.getElementById("nama").value.trim();
      const kota = document.getElementById("kota").value.trim();
      const whatsapp = document.getElementById("whatsapp").value.trim();
      const setuju = document.getElementById("setuju").checked;

      let isValid = true;

      // Validation: Nama
      if (nama.length < 3) {
        showError("nama", "Nama harus diisi (minimal 3 karakter).");
        isValid = false;
      }

      // Validation: Kota
      if (kota.length === 0) {
        showError("kota", "Kota harus diisi.");
        isValid = false;
      }

      // Validation: WhatsApp
      const whatsappRegex = /^[0-9]{10,15}$/; // Simple numeric check
      if (!whatsappRegex.test(whatsapp.replace(/\D/g, ""))) {
        showError(
          "whatsapp",
          "Nomor WhatsApp harus diisi (minimal 10 digit, angka saja)."
        );
        isValid = false;
      }

      // Validation: Agreement
      if (!setuju) {
        showError("setuju", "Anda harus menyetujui pernyataan ini.");
        isValid = false;
      }

      if (isValid) {
        // Simulate submission (loading state)
        submitBtn.disabled = true;
        submitText.textContent = "Mengirim...";
        submitIcon.setAttribute(
          "d",
          "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        );
        submitIcon.classList.add("animate-spin");

        // Simulate API call delay
        setTimeout(() => {
          // Show success message
          document.getElementById("formSuccess").classList.remove("hidden");

          // Reset form
          franchiseForm.reset();

          // Reset button state
          submitBtn.disabled = false;
          submitText.textContent = "Kirim Pengajuan Kemitraan";
          submitIcon.setAttribute(
            "d",
            "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          );
          submitIcon.classList.remove("animate-spin");

          // Scroll to success message
          document.getElementById("formSuccess").scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });

          // Optionally, hide success message after some time
          // setTimeout(() => {
          //     document.getElementById('formSuccess').classList.add('hidden');
          // }, 5000);
        }, 1500); // Simulate 1.5 second network delay
      }
    });
  }

  function showError(fieldId, message) {
    const errorElement = document.getElementById(`error-${fieldId}`);
    const inputElement = document.getElementById(fieldId);

    if (errorElement && inputElement) {
      errorElement.classList.remove("hidden");
      errorElement.textContent = message;
      inputElement.classList.add("error");
      // Focus on first error field
      if (!document.querySelector(".error:focus")) {
        inputElement.focus();
      }
    }
  }

  function clearErrors() {
    const errorElements = document.querySelectorAll('[id^="error-"]');
    errorElements.forEach((el) => {
      el.classList.add("hidden");
    });

    const inputElements = document.querySelectorAll(".form-input");
    inputElements.forEach((el) => {
      el.classList.remove("error");
    });
  }

  // Real-time validation for better UX (optional)
  const formInputs = document.querySelectorAll(
    "#franchiseForm input, #franchiseForm textarea"
  );
  formInputs.forEach((input) => {
    input.addEventListener("blur", function () {
      // Simple validation on blur
      if (
        this.id === "nama" &&
        this.value.trim().length > 0 &&
        this.value.trim().length < 3
      ) {
        showError("nama", "Nama minimal 3 karakter.");
      }
      if (this.id === "whatsapp" && this.value.trim().length > 0) {
        const cleaned = this.value.replace(/\D/g, "");
        if (cleaned.length < 10 || cleaned.length > 15) {
          showError("whatsapp", "Nomor harus 10-15 digit angka.");
        }
      }
    });

    input.addEventListener("input", function () {
      // Clear error when user starts typing
      if (this.classList.contains("error")) {
        this.classList.remove("error");
        const errorId = `error-${this.id}`;
        const errorEl = document.getElementById(errorId);
        if (errorEl) errorEl.classList.add("hidden");
      }
    });
  });
});

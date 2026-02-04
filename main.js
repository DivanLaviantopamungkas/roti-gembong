// main.js - JavaScript untuk Interaksi dan Animasi Landing Page Roti Gembong Raja Mahakam

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

    // Close mobile menu when clicking a link
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
      }
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

      // Toggle current FAQ
      button.setAttribute("aria-expanded", !isExpanded);
      answer.classList.toggle("open");

      // Toggle rotation class for icon
      if (icon.classList.contains("rotate-180")) {
        icon.classList.remove("rotate-180");
      } else {
        icon.classList.add("rotate-180");
      }
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
      const cleanedWhatsapp = whatsapp.replace(/\D/g, "");
      if (!whatsappRegex.test(cleanedWhatsapp)) {
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
        // Change icon to loading spinner
        submitIcon.innerHTML = "";
        submitIcon.innerHTML =
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />';
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
          // Restore original icon
          submitIcon.innerHTML = "";
          submitIcon.innerHTML =
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />';
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

  // Real-time validation for better UX
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

  // ===== ANIMASI CHART ROI =====
  function animateROIChart() {
    const chartBars = document.querySelectorAll(".chart-bar");

    // Check if we're in ROI section
    const roiSection = document.getElementById("roi");
    if (!roiSection) return;

    const chartObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate each bar with delay
            chartBars.forEach((bar, index) => {
              setTimeout(() => {
                bar.classList.add("animated");
                // Set custom property for animation height
                const currentHeight = bar.style.height;
                bar.style.setProperty("--target-height", currentHeight);
              }, index * 300);
            });
            // Stop observing after animation
            chartObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    chartObserver.observe(roiSection);
  }

  // Initialize ROI chart animation
  animateROIChart();

  // ===== IMAGE ERROR HANDLING =====
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.onerror = function () {
      console.warn(`Gambar tidak ditemukan: ${this.src}`);
      // Create placeholder
      const placeholder = document.createElement("div");
      placeholder.className =
        "bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center rounded-lg";
      placeholder.style.height = this.offsetHeight + "px" || "200px";
      placeholder.style.width = this.offsetWidth + "px" || "100%";

      const placeholderContent = document.createElement("div");
      placeholderContent.className = "text-center p-4";

      const icon = document.createElement("div");
      icon.className = "text-amber-600 mb-2";
      icon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';

      const text = document.createElement("p");
      text.className = "text-sm text-amber-800 font-medium";
      text.textContent = this.alt || "Gambar";

      placeholderContent.appendChild(icon);
      placeholderContent.appendChild(text);
      placeholder.appendChild(placeholderContent);

      // Replace image with placeholder
      this.parentNode.replaceChild(placeholder, this);
    };
  });

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Calculate offset for sticky header
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ===== HOVER EFFECTS FOR CARDS =====
  // Add ripple effect to cards on hover
  const advantageCards = document.querySelectorAll(".card-advantage");
  const packageCards = document.querySelectorAll(".card-package");

  advantageCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  packageCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // ===== INTERACTIVE ROI CALCULATOR =====
  const roiCalculator = {
    init: function () {
      this.elements = {
        investasi: document.getElementById("roi-investasi"),
        hargaJual: document.getElementById("roi-harga-jual"),
        hpp: document.getElementById("roi-hpp"),
        targetHarian: document.getElementById("roi-target-harian"),
        hasilOmzet: document.getElementById("hasil-omzet"),
        hasilLabaKotor: document.getElementById("hasil-laba-kotor"),
        hasilLabaBersih: document.getElementById("hasil-laba-bersih"),
        hasilRoi: document.getElementById("hasil-roi"),
      };

      // If calculator elements exist, add event listeners
      if (this.elements.investasi) {
        this.setupEventListeners();
        this.calculate(); // Initial calculation
      }
    },

    setupEventListeners: function () {
      const inputs = ["investasi", "hargaJual", "hpp", "targetHarian"];
      inputs.forEach((input) => {
        if (this.elements[input]) {
          this.elements[input].addEventListener("input", () =>
            this.calculate()
          );
        }
      });
    },

    calculate: function () {
      // Get values or use defaults
      const investasi = parseFloat(this.elements.investasi?.value) || 200000000;
      const hargaJual = parseFloat(this.elements.hargaJual?.value) || 15000;
      const hpp = parseFloat(this.elements.hpp?.value) || 6000;
      const targetHarian = parseFloat(this.elements.targetHarian?.value) || 100;

      // Calculations
      const margin = hargaJual - hpp;
      const marginPersen = (margin / hargaJual) * 100;

      // Monthly calculations
      const omzetBulanan = targetHarian * hargaJual * 30;
      const labaKotorBulanan = targetHarian * margin * 30;

      // Estimate net profit (50% of gross profit after expenses)
      const labaBersihBulanan = labaKotorBulanan * 0.5;

      // ROI in months
      const roiBulan = investasi / labaBersihBulanan;

      // Update display if elements exist
      if (this.elements.hasilOmzet) {
        this.elements.hasilOmzet.textContent = this.formatRupiah(omzetBulanan);
      }

      if (this.elements.hasilLabaKotor) {
        this.elements.hasilLabaKotor.textContent =
          this.formatRupiah(labaKotorBulanan);
      }

      if (this.elements.hasilLabaBersih) {
        this.elements.hasilLabaBersih.textContent =
          this.formatRupiah(labaBersihBulanan);
      }

      if (this.elements.hasilRoi) {
        this.elements.hasilRoi.textContent = roiBulan.toFixed(1);
      }

      // Update chart visualization
      this.updateChart(omzetBulanan, labaKotorBulanan, labaBersihBulanan);
    },

    formatRupiah: function (angka) {
      if (angka >= 1000000) {
        return `Rp ${(angka / 1000000).toFixed(1)} Jt`;
      }
      return `Rp ${angka.toLocaleString("id-ID")}`;
    },

    updateChart: function (omzet, labaKotor, labaBersih) {
      const chartBars = document.querySelectorAll(".chart-bar");
      if (chartBars.length >= 3) {
        // Calculate heights as percentages of omzet
        const maxValue = omzet;

        // Bar 1: Omzet (100%)
        chartBars[0].style.height = "100%";
        chartBars[0].previousElementSibling.querySelector(
          "p:last-child"
        ).textContent = this.formatRupiah(omzet);

        // Bar 2: Laba Kotor (percentage of omzet)
        const labaKotorPercent = (labaKotor / maxValue) * 100;
        chartBars[1].style.height = `${labaKotorPercent}%`;
        chartBars[1].previousElementSibling.querySelector(
          "p:last-child"
        ).textContent = this.formatRupiah(labaKotor);

        // Bar 3: Laba Bersih (percentage of omzet)
        const labaBersihPercent = (labaBersih / maxValue) * 100;
        chartBars[2].style.height = `${labaBersihPercent}%`;
        chartBars[2].previousElementSibling.querySelector(
          "p:last-child"
        ).textContent = this.formatRupiah(labaBersih);
      }
    },
  };

  // Initialize ROI calculator if elements exist
  setTimeout(() => {
    roiCalculator.init();
  }, 1000);

  // ===== LAZY LOAD IMAGES =====
  const lazyLoadImages = () => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute("data-src");
          if (src) {
            img.src = src;
            img.removeAttribute("data-src");
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  };

  // Initialize lazy loading
  lazyLoadImages();

  // ===== PRINT FRIENDLY ROI =====
  const printROIBtn = document.getElementById("print-roi");
  if (printROIBtn) {
    printROIBtn.addEventListener("click", function () {
      const printContent = document.getElementById("roi").innerHTML;
      const originalContent = document.body.innerHTML;

      document.body.innerHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Simulasi ROI - Roti Gembong Raja Mahakam</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #92400e; }
                        .disclaimer { background: #fee2e2; padding: 15px; margin: 20px 0; border-left: 4px solid #dc2626; }
                        @media print {
                            .no-print { display: none; }
                            button { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <h1>Simulasi ROI - Franchise Roti Gembong Raja Mahakam</h1>
                    <p><em>Dicetak pada: ${new Date().toLocaleDateString(
                      "id-ID"
                    )}</em></p>
                    ${printContent}
                    <div class="disclaimer">
                        <strong>CATATAN PENTING:</strong> Ini adalah simulasi/contoh perhitungan berdasarkan asumsi standar. <strong>Bukan jaminan profit.</strong> Hasil aktual bergantung pada lokasi, manajemen, dan kondisi pasar.
                    </div>
                    <button onclick="window.print()" class="no-print">Cetak</button>
                    <button onclick="location.reload()" class="no-print">Kembali</button>
                </body>
                </html>
            `;

      window.print();
      document.body.innerHTML = originalContent;
      location.reload();
    });
  }

  // ===== COUNTER ANIMATION FOR ROI NUMBERS =====
  function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value.toLocaleString("id-ID");
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Animate ROI numbers when section is visible
  const roiNumberObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const roiNumber = document.querySelector(".roi-number");
          if (roiNumber && !roiNumber.classList.contains("animated")) {
            animateCounter(roiNumber, 0, 24, 2000);
            roiNumber.classList.add("animated");
          }
          roiNumberObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const roiSection = document.getElementById("roi");
  if (roiSection) {
    roiNumberObserver.observe(roiSection);
  }

  // ===== FORM AUTO-SAVE (Local Storage) =====
  const formFields = ["nama", "kota", "whatsapp", "pesan"];

  // Load saved form data
  formFields.forEach((field) => {
    const element = document.getElementById(field);
    if (element) {
      const savedValue = localStorage.getItem(`franchise_form_${field}`);
      if (savedValue) {
        element.value = savedValue;
      }

      // Save on input
      element.addEventListener("input", function () {
        localStorage.setItem(`franchise_form_${field}`, this.value);
      });
    }
  });

  // Clear saved data on successful submission
  if (franchiseForm) {
    franchiseForm.addEventListener("submit", function () {
      setTimeout(() => {
        formFields.forEach((field) => {
          localStorage.removeItem(`franchise_form_${field}`);
        });
      }, 2000);
    });
  }

  // ===== SOCIAL SHARE BUTTONS =====
  const shareButtons = document.querySelectorAll(".share-btn");
  shareButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const platform = this.getAttribute("data-platform");
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      const text = encodeURIComponent(
        "Temukan peluang franchise Roti Gembong Raja Mahakam!"
      );

      let shareUrl = "";

      switch (platform) {
        case "whatsapp":
          shareUrl = `https://wa.me/?text=${text}%20${url}`;
          break;
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
          break;
        case "linkedin":
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
          break;
      }

      if (shareUrl) {
        window.open(shareUrl, "_blank", "width=600,height=400");
      }
    });
  });

  // ===== COOKIE CONSENT BANNER =====
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptCookiesBtn = document.getElementById("accept-cookies");
  const rejectCookiesBtn = document.getElementById("reject-cookies");

  if (cookieBanner && !localStorage.getItem("cookiesAccepted")) {
    // Show banner after 2 seconds
    setTimeout(() => {
      cookieBanner.classList.remove("hidden");
      cookieBanner.classList.add("flex");
    }, 2000);
  }

  if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "true");
      cookieBanner.classList.add("hidden");
      cookieBanner.classList.remove("flex");
    });
  }

  if (rejectCookiesBtn) {
    rejectCookiesBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "false");
      cookieBanner.classList.add("hidden");
      cookieBanner.classList.remove("flex");
    });
  }

  // ===== WHATSAPP CLICK TRACKING =====
  const whatsappButtons = document.querySelectorAll('a[href*="whatsapp"]');
  whatsappButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // You can add analytics tracking here
      console.log("WhatsApp button clicked:", this.href);
      // Example: Send data to analytics service
      // ga('send', 'event', 'WhatsApp', 'click', 'Franchise Inquiry');
    });
  });

  // ===== KEYBOARD NAVIGATION =====
  document.addEventListener("keydown", function (e) {
    // Escape key closes mobile menu
    if (
      e.key === "Escape" &&
      mobileMenu &&
      !mobileMenu.classList.contains("hidden")
    ) {
      mobileMenu.classList.add("hidden");
      menuToggle.setAttribute("aria-expanded", "false");
      menuPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
    }

    // Tab key navigation - add focus styles
    if (e.key === "Tab") {
      document.body.classList.add("using-keyboard");
    }
  });

  document.addEventListener("mousedown", function () {
    document.body.classList.remove("using-keyboard");
  });

  // ===== PERFORMANCE OPTIMIZATION =====
  // Debounce scroll events
  let scrollTimer;
  window.addEventListener("scroll", function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      // Update active link only after scrolling stops
      updateActiveLink();
    }, 100);
  });

  // ===== INITIALIZE ALL COMPONENTS =====
  console.log("All components initialized successfully.");
});

// ===== ADDITIONAL GLOBAL FUNCTIONS =====

// Format phone number for display
function formatPhoneNumber(phone) {
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  if (match) {
    return match[1] + "-" + match[2] + "-" + match[3];
  }
  return phone;
}

// Validate email format
function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ===== SERVICE WORKER REGISTRATION (PWA SUPPORT) =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/service-worker.js").then(
      function (registration) {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}

// ===== OFFLINE DETECTION =====
window.addEventListener("online", function () {
  console.log("You are online");
  // Show online notification if needed
});

window.addEventListener("offline", function () {
  console.log("You are offline");
  // Show offline notification if needed
});

// ===== PWA INSTALL PROMPT =====
let deferredPrompt;
const installButton = document.getElementById("install-pwa");

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show install button if it exists
  if (installButton) {
    installButton.style.display = "block";
    installButton.addEventListener("click", () => {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        deferredPrompt = null;
      });
    });
  }
});

// ===== ERROR HANDLING =====
window.addEventListener("error", function (e) {
  console.error(
    "JavaScript Error:",
    e.message,
    "at",
    e.filename,
    ":",
    e.lineno
  );
  // You can send this to your error tracking service
});

window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled Promise Rejection:", e.reason);
  // You can send this to your error tracking service
});

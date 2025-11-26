// import emailjs from 'emailjs-com';

// Init Animate On Scroll (Thư viện AOS)
AOS.init({
  once: true,
  offset: 100,
  duration: 800,
});

// --- PARTICLE BACKGROUND SCRIPT (Hiệu ứng hạt) ---
const canvas = document.getElementById("canvas-bg");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];

// Hàm điều chỉnh kích thước canvas theo màn hình
function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

// Lớp đối tượng Hạt (Particle)
class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5; // Vận tốc X
    this.vy = (Math.random() - 0.5) * 0.5; // Vận tốc Y
    this.size = Math.random() * 2;
    this.color = Math.random() > 0.5 ? "#00f3ff" : "#bc13fe"; // Màu Primary hoặc Secondary
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Nếu chạm mép màn hình thì bật lại
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
  }
}

// Khởi tạo số lượng hạt
function initParticles() {
  particles = [];
  // Tạo 100 hạt
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
}

// Vòng lặp Animation
function animateParticles() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  // Vẽ đường nối giữa các hạt gần nhau
  particles.forEach((p1, index) => {
    for (let j = index + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Nếu khoảng cách nhỏ hơn 100px thì vẽ dây nối
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animateParticles);
}

// Sự kiện thay đổi kích thước màn hình
window.addEventListener("resize", () => {
  resize();
  initParticles();
});

// Chạy chương trình
resize();
initParticles();
animateParticles();

// --- PROJECT GRID SLICK CAROUSEL (Mobile) ---
// Initialize Slick carousel on project-grid for mobile screens (≤768px)
function initProjectCarousel() {
  //   const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const projectGrids = document.querySelectorAll(".project-slide");

  $(".project-slide").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: true,
    dots: true,
    arrows: true,
    autoplay: true,
    speed: 1000,
    adaptiveHeight: true,
    spaceBetween: 20,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          spaceBetween: 15,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          spaceBetween: 10,
        },
      },
    ],
  });
} // Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProjectCarousel);
} else {
  initProjectCarousel();
}

// Re-initialize on resize (debounced)
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initProjectCarousel();
  }, 250);
});

// --- CONTACT FORM WITH EMAILJS ---
// Initialize EmailJS - Thay YOUR_PUBLIC_KEY bằng public key từ EmailJS
// Detect EmailJS availability and initialize when ready.
let emailjsReady = false;
const EMAILJS_PUBLIC_KEY = "bbQL5KiZSMDNZe1xA"; // replace if needed

function tryInitEmailJS() {
  if (
    typeof window.emailjs !== "undefined" &&
    window.emailjs &&
    !emailjsReady
  ) {
    try {
      window.emailjs.init(EMAILJS_PUBLIC_KEY);
      emailjsReady = true;
      console.info("EmailJS initialized (delayed).");
      // enable contact form submit if it was disabled
      const submitBtn = document.querySelector(
        '#contactForm button[type="submit"]'
      );
      if (submitBtn) submitBtn.disabled = false;
      const status = document.getElementById("formStatus");
      if (
        status &&
        status.textContent.includes("Hệ thống gửi mail chưa sẵn sàng")
      ) {
        status.style.display = "none";
      }
    } catch (initErr) {
      console.error("EmailJS init error:", initErr);
    }
    return true;
  }
  return false;
}

// Try immediate init first, then poll for a short period if not present.
tryInitEmailJS();
if (!emailjsReady) {
  let checks = 0;
  const maxChecks = 25; // ~5 seconds (25 * 200ms)
  const intervalId = setInterval(() => {
    checks++;
    if (tryInitEmailJS() || checks >= maxChecks) {
      clearInterval(intervalId);
      if (!emailjsReady) {
        console.warn(
          "EmailJS not available after polling. Email sending will be disabled."
        );
        // show persistent user-friendly message in formStatus if present
        const status = document.getElementById("formStatus");
        if (status) {
          status.textContent =
            "Hệ thống gửi mail chưa sẵn sàng. Vui lòng thử lại sau.";
          status.className = "error";
          status.style.display = "block";
        }
        // disable submit button to avoid user confusion
        const submitBtn = document.querySelector(
          '#contactForm button[type="submit"]'
        );
        if (submitBtn) submitBtn.disabled = true;
      }
    }
  }, 200);
}

// Handle form submission
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  // If URL contains query params (e.g. after an accidental GET submit), remove them for privacy
  function clearUrlQuery() {
    try {
      if (window.history && window.history.replaceState) {
        const newUrl = window.location.pathname + (window.location.hash || "");
        window.history.replaceState({}, document.title, newUrl);
      }
    } catch (err) {
      console.warn("clearUrlQuery failed", err);
    }
  }

  // Clean query on load to avoid exposing form data in URL
  if (window.location.search && window.location.search.length > 0) {
    clearUrlQuery();
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Collect form data
      const formData = {
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        service: document.getElementById("service").value,
        message: document.getElementById("message").value.trim(),
      };

      // Field-level validation
      clearFieldErrors();
      const validation = validateContactForm(formData);
      if (!validation.valid) {
        showFormStatus(validation.message, "error");
        if (validation.field)
          setFieldError(validation.field, validation.message);
        return;
      }

      // Show loading state
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
      submitBtn.disabled = true;

      try {
        if (typeof emailjs === "undefined") {
          showFormStatus(
            "Hệ thống gửi mail chưa sẵn sàng. Vui lòng thử lại sau.",
            "error"
          );
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          return;
        }

        // Send email via EmailJS
        const response = await emailjs.send(
          "service_wycs4sk",
          "template_rlo2xuu",
          {
            to_email: "tannguyen0916@gmail.com", // Email nhận
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            service: formData.service,
            message: formData.message,
            reply_to: formData.email,
          }
        );

        // EmailJS returns an object; check for success loosely
        if (response && (response.status === 200 || response === "OK")) {
          showFormStatus(
            "✓ Tin nhắn đã gửi thành công! Tôi sẽ liên hệ với bạn trong 24 giờ.",
            "success"
          );
          contactForm.reset();
          // Remove any query parameters from URL (privacy: prevent leaking form values)
          clearUrlQuery();
        } else {
          console.warn("EmailJS send response:", response);
          showFormStatus("Có lỗi xảy ra, vui lòng thử lại.", "error");
        }
      } catch (error) {
        console.error("EmailJS Error:", error);
        const errMsg =
          (error && (error.text || error.message)) || JSON.stringify(error);
        showFormStatus("Lỗi gửi email: " + errMsg, "error");
      } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});

// Helper functions
function showFormStatus(message, type) {
  const formStatus = document.getElementById("formStatus");
  formStatus.textContent = message;
  formStatus.className = type;
  formStatus.style.display = "block";

  // Auto hide success message after 5 seconds
  if (type === "success") {
    setTimeout(() => {
      formStatus.style.display = "none";
    }, 5000);
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate contact form fields and return { valid, field, message }
function validateContactForm(data) {
  if (!data.name || data.name.length < 2) {
    return {
      valid: false,
      field: "name",
      message: "Vui lòng nhập tên hợp lệ (ít nhất 2 ký tự)",
    };
  }

  if (!data.phone) {
    return {
      valid: false,
      field: "phone",
      message: "Vui lòng nhập số điện thoại",
    };
  }
  // Basic phone validation: allow +84 or 0 followed by 9-10 digits
  const phoneRegex = /^(?:\+84|0)\d{9,10}$/;
  if (!phoneRegex.test(data.phone.replace(/\s+/g, ""))) {
    return {
      valid: false,
      field: "phone",
      message: "Số điện thoại không hợp lệ",
    };
  }

  if (!data.email) {
    return { valid: false, field: "email", message: "Vui lòng nhập email" };
  }
  if (!isValidEmail(data.email)) {
    return { valid: false, field: "email", message: "Email không hợp lệ" };
  }

  if (!data.service) {
    return {
      valid: false,
      field: "service",
      message: "Vui lòng chọn gói dịch vụ",
    };
  }

  if (!data.message || data.message.length < 10) {
    return {
      valid: false,
      field: "message",
      message: "Vui lòng nhập nội dung chi tiết (ít nhất 10 ký tự)",
    };
  }

  return { valid: true };
}

function setFieldError(fieldId, message) {
  try {
    const el = document.getElementById(fieldId);
    if (!el) return;
    el.classList.add("input-error");
    el.setAttribute("aria-invalid", "true");
    // add inline small message if not exists
    let next = el.nextElementSibling;
    if (
      !next ||
      !next.classList ||
      !next.classList.contains("field-error-msg")
    ) {
      const small = document.createElement("div");
      small.className = "field-error-msg";
      small.textContent = message;
      el.parentNode.insertBefore(small, el.nextSibling);
    } else {
      next.textContent = message;
    }
    el.focus();
  } catch (err) {
    console.warn("setFieldError failed", err);
  }
}

function clearFieldErrors() {
  const errEls = document.querySelectorAll(".input-error");
  errEls.forEach((el) => {
    el.classList.remove("input-error");
    el.removeAttribute("aria-invalid");
  });
  const msgs = document.querySelectorAll(".field-error-msg");
  msgs.forEach((m) => m.remove());
}

// Import AOS library
// AOS library is already loaded via CDN in HTML
const AOS = window.AOS // Declare AOS variable

// Initialize AOS (Animate On Scroll)
document.addEventListener("DOMContentLoaded", () => {
    if (typeof AOS !== "undefined") {
        // Disable AOS on mobile
        const isMobile = window.innerWidth < 768;
        
        // Reset AOS first to prevent conflicts
        if (AOS) {
            AOS.refreshHard();
        }
        
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: false, // Cho phép chạy lại khi scroll
            offset: 100,
            disable: isMobile,
            startEvent: 'load',
            mirror: true, // Bật mirror để có hiệu ứng ngược lại khi scroll lên
            // Thêm các animation tùy chỉnh
            // Khi scroll xuống
            'aos:in': 'aos-animate',
            // Khi scroll lên
            'aos:out': 'aos-animate-out',
            // Khi kết thúc animation
            'aos:in:done': 'aos-animate-done',
            'aos:out:done': 'aos-animate-out-done'
        });
        
        // Thêm style cho hiệu ứng scroll lên
        const style = document.createElement('style');
        style.textContent = `
            /* Hiệu ứng mặc định khi scroll xuống */
            [data-aos] {
                opacity: 0;
                transition-property: opacity, transform;
                will-change: transform, opacity;
            }
            
            /* Hiệu ứng khi scroll lên */
            [data-aos].aos-animate-out {
                opacity: 0 !important;
                transform: translateY(50px) !important;
            }
            
            /* Hiệu ứng khi scroll xuống */
            [data-aos].aos-animate {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
});

// Mobile Navigation Toggle
const navToggle = document.querySelector(".nav-toggle")
const navMenu = document.querySelector(".nav-menu")

if (navToggle && navMenu) {
navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    navToggle.classList.toggle("active")
})
}

// Smooth Scroll to Form
function scrollToForm() {
const formSection = document.getElementById("contact")
if (formSection) {
    formSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
    })
}
}

// Header Scroll Effect
window.addEventListener("scroll", () => {
const header = document.querySelector(".header")
if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.98)"
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
} else {
    header.style.background = "rgba(255, 255, 255, 0.95)"
    header.style.boxShadow = "none"
}
})

// Form Handling
const contactForm = document.getElementById("contactForm")
const successModal = document.getElementById("successModal")

if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Validate required fields
    const requiredFields = ["fullName", "phone", "email", "product"];

    let isValid = true;

    requiredFields.forEach((field) => {
    const input = document.querySelector(`[name='${field}']`);
    if (!data[field] || data[field].trim() === "") {
        input.style.borderColor = "var(--error-color)";
        isValid = false;
    } else {
        input.style.borderColor = "var(--accent-color)";
    }
    });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailInput = document.querySelector("[name='email']");
    if (data.email && !emailRegex.test(data.email)) {
    emailInput.style.borderColor = "var(--error-color)";
    isValid = false;
    }

    // Validate phone format (chỉ số, tối đa 12 ký tự)
    const phoneRegex = /^\d{1,12}$/;
    const phoneInput = document.querySelector("[name='phone']");
    if (data.phone && !phoneRegex.test(data.phone)) {
    phoneInput.style.borderColor = "var(--error-color)";
    isValid = false;
    }

    if (!isValid) {
    showNotification("Vui lòng kiểm tra lại thông tin đã nhập!", "error");
    return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div> Đang gửi...';
    submitBtn.disabled = true;

    // Tạo nội dung email HTML
    const _emailHtml = `
    <h3>Thông tin đăng ký từ khách hàng</h3>
    <p><strong>Họ Tên:</strong> ${data.fullName}</p>
    <p><strong>Số điện thoại:</strong> ${data.phone}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Sản phẩm đang bán trên sàn:</strong> ${data.product}</p>
    `;

    console.log(_emailHtml);

    const _to = "tannguyen0916@gmail.com";
    const _cc = "";
    const _displayName = "XVNET-Noreply";
    const _subject =
    "Thông tin đăng ký tư vấn từ khách hàng: " + location.hostname;

    // Gửi Ajax
    $.ajax({
    url: "https://mangxuyenviet.vn/login.aspx/PostForm",
    type: "POST",
    data: JSON.stringify({
        funcParam: _emailHtml,
        to: _to,
        cc: _cc,
        displayName: _displayName,
        title: _subject,
    }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (response) {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        if (response.d === "abc") {
        showSuccessModal();
        contactForm.reset();

        requiredFields.forEach((field) => {
            document.querySelector(`[name='${field}']`).style.borderColor =
            "var(--accent-color)";
        });

        // Google Analytics event
        if (typeof gtag !== "undefined") {
            gtag("event", "form_submit", {
            event_category: "engagement",
            event_label: "contact_form",
            });
        }
        } else {
        showNotification("Gửi thất bại, vui lòng thử lại!", "error");
        }
    },
    error: function (xhr, status, error) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        console.error("Lỗi khi gửi:", error);
        showNotification("Gửi không thành công, vui lòng thử lại!", "error");
    },
    });
});
}


// Show Success Modal
function showSuccessModal() {
if (successModal) {
    successModal.style.display = "block"
    document.body.style.overflow = "hidden"

    // Auto close after 5 seconds
    setTimeout(() => {
    closeModal()
    }, 5000)
}
}

// Close Modal
function closeModal() {
if (successModal) {
    successModal.style.display = "none"
    document.body.style.overflow = "auto"
}
}

// Close modal when clicking outside
window.addEventListener("click", (e) => {
if (e.target === successModal) {
    closeModal()
}
})

// Notification System
function showNotification(message, type = "info") {
// Remove existing notifications
const existingNotifications = document.querySelectorAll(".notification")
existingNotifications.forEach((notification) => notification.remove())

// Create notification element
const notification = document.createElement("div")
notification.className = `notification notification-${type}`
notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === "error" ? "fa-exclamation-circle" : "fa-check-circle"}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `

// Add styles
notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 3000;
        background: ${type === "error" ? "#fee2e2" : "#dcfce7"};
        color: ${type === "error" ? "#dc2626" : "#16a34a"};
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border-left: 4px solid ${type === "error" ? "#dc2626" : "#16a34a"};
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `

// Add to page
document.body.appendChild(notification)

// Auto remove after 5 seconds
setTimeout(() => {
    if (notification.parentElement) {
    notification.remove()
    }
}, 5000)
}

// Add CSS for notification animation
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`
document.head.appendChild(notificationStyles)

// Parallax Effect for Hero Section
window.addEventListener("scroll", () => {
const scrolled = window.pageYOffset
const heroParticles = document.querySelector(".hero-particles")

if (heroParticles) {
    heroParticles.style.transform = `translateY(${scrolled * 0.5}px)`
}
})

// Counter Animation for Statistics (if needed)
function animateCounter(element, target, duration = 2000) {
let start = 0
const increment = target / (duration / 16)

const timer = setInterval(() => {
    start += increment
    element.textContent = Math.floor(start)

    if (start >= target) {
    element.textContent = target
    clearInterval(timer)
    }
}, 16)
}

// Remove duplicate Intersection Observer as we're using AOS
// This prevents animation conflicts

// Observe elements for animation (mục đích: để khi scroll đến các phần tử này thì sẽ có hiệu ứng)
// document.addEventListener("DOMContentLoaded", () => {
// const animateElements = document.querySelectorAll(".benefit-card, .template-card, .comparison-table")
// animateElements.forEach((el) => observer.observe(el))
// })

// Template Demo Functionality
// document.addEventListener("click", (e) => {
// if (e.target.textContent === "Xem demo") {
//     e.preventDefault()
//     showNotification("Demo sẽ được cập nhật sớm!", "info")
// }
// })

// Lazy Loading for Images
if ("IntersectionObserver" in window) {
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
    if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
    }
    })
})

const lazyImages = document.querySelectorAll("img[data-src]")
lazyImages.forEach((img) => imageObserver.observe(img))
}

// Performance Optimization: Debounce scroll events
function debounce(func, wait) {
let timeout
return function executedFunction(...args) {
    const later = () => {
    clearTimeout(timeout)
    func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
}
}

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(() => {
// Scroll-based animations and effects
const scrolled = window.pageYOffset

// Update header
const header = document.querySelector(".header")
if (scrolled > 100) {
    header.classList.add("scrolled")
} else {
    header.classList.remove("scrolled")
}

// Parallax effects
const heroParticles = document.querySelector(".hero-particles")
if (heroParticles) {
    heroParticles.style.transform = `translateY(${scrolled * 0.3}px)`
}
}, 10)

window.addEventListener("scroll", debouncedScrollHandler)

// Add smooth reveal animation for sections
const revealSections = document.querySelectorAll("section")
const revealObserver = new IntersectionObserver(
(entries) => {
    entries.forEach((entry) => {
    if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
    }
    })
},
{ threshold: 0.1 },
)

revealSections.forEach((section) => {
section.style.opacity = "0"
section.style.transform = "translateY(30px)"
section.style.transition = "opacity 0.6s ease, transform 0.6s ease"
revealObserver.observe(section)
})

// Console welcome message
console.log(`
🚀 WebShop Pro Landing Page
📧 Liên hệ: info@webshoppro.com
📱 Hotline: 1900 1234

Cảm ơn bạn đã quan tâm đến dịch vụ của chúng tôi!
`)

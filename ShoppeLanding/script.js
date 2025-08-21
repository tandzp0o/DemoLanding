// Import AOS library
// AOS library is already loaded via CDN in HTML
const AOS = window.AOS // Declare AOS variable

// Initialize AOS (Animate On Scroll)
document.addEventListener("DOMContentLoaded", () => {
if (typeof AOS !== "undefined") {
    AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    offset: 100,
    })
}
})

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
    e.preventDefault()

    // Get form data
    const formData = new FormData(contactForm)
    const data = Object.fromEntries(formData)

    // Validate required fields
    const requiredFields = ["fullName", "phone", "email", "product"]
    let isValid = true

    requiredFields.forEach((field) => {
    const input = document.getElementById(field)
    if (!data[field] || data[field].trim() === "") {
        input.style.borderColor = "#ef4444"
        isValid = false
    } else {
        input.style.borderColor = "#22c55e"
    }
    })

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const emailInput = document.getElementById("email")
    if (data.email && !emailRegex.test(data.email)) {
    emailInput.style.borderColor = "#ef4444"
    isValid = false
    }

    // Validate phone format (Vietnamese phone number)
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/
    const phoneInput = document.getElementById("phone")
    if (data.phone && !phoneRegex.test(data.phone.replace(/\s/g, ""))) {
    phoneInput.style.borderColor = "#ef4444"
    isValid = false
    }

    if (!isValid) {
    // Show error message
    showNotification("Vui lòng kiểm tra lại thông tin đã nhập!", "error")
    return
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = '<div class="loading"></div> Đang gửi...'
    submitBtn.disabled = true

    // Simulate API call
    setTimeout(() => {
    // Reset button
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false

    // Show success modal
    showSuccessModal()

    // Reset form
    contactForm.reset()

    // Reset input borders
    requiredFields.forEach((field) => {
        document.getElementById(field).style.borderColor = "#e5e7eb"
    })

    // Log form data (in real app, send to server)
    console.log("Form submitted:", data)

    // Google Analytics event (if GA is implemented)
    const gtag = window.gtag // Declare gtag variable
    if (typeof gtag !== "undefined") {
        gtag("event", "form_submit", {
        event_category: "engagement",
        event_label: "contact_form",
        })
    }
    }, 2000)
})
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

// Intersection Observer for animations
const observerOptions = {
threshold: 0.1,
rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
    if (entry.isIntersecting) {
    entry.target.classList.add("fade-in")
    }
})
}, observerOptions)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
const animateElements = document.querySelectorAll(".benefit-card, .template-card, .comparison-table")
animateElements.forEach((el) => observer.observe(el))
})

// Template Demo Functionality
document.addEventListener("click", (e) => {
if (e.target.textContent === "Xem demo") {
    e.preventDefault()
    showNotification("Demo sẽ được cập nhật sớm!", "info")
}
})

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

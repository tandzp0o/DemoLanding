// Init Animate On Scroll (Thư viện AOS)
AOS.init({
    once: true,
    offset: 100,
    duration: 800,
});

// --- PARTICLE BACKGROUND SCRIPT (Hiệu ứng hạt) ---
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

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
        this.color = Math.random() > 0.5 ? '#00f3ff' : '#bc13fe'; // Màu Primary hoặc Secondary
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

    particles.forEach(p => {
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
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animateParticles);
}

// Sự kiện thay đổi kích thước màn hình
window.addEventListener('resize', () => {
    resize();
    initParticles();
});

// Chạy chương trình
resize();
initParticles();
animateParticles();
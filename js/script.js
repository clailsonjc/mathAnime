// ===== PARTÍCULAS DE FUNDO =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = ['#ff2e93', '#6c5ce7', '#00d4ff', '#ffd700'][Math.floor(Math.random() * 4)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor(canvas.width / 15));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ===== MENU MOBILE =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== ANIMAÇÃO DE CONTAGEM =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        updateCounter();
    });
}

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.type-card').forEach(card => {
    observer.observe(card);
});

// Iniciar contadores quando a hero estiver visível
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.disconnect();
        }
    });
});
heroObserver.observe(document.querySelector('.hero'));

// ===== CALCULADORA DE REGRA DE TRÊS =====
let calcType = 'direta';
const typeBtns = document.querySelectorAll('.type-btn');
const calcBtn = document.getElementById('calcBtn');
const clearBtn = document.getElementById('clearBtn');
const calcResult = document.getElementById('calcResult');
const resultValue = document.getElementById('resultValue');
const resultExplanation = document.getElementById('resultExplanation');

typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        typeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        calcType = btn.dataset.type;
        calcResult.classList.add('hidden');
    });
});

calcBtn.addEventListener('click', () => {
    const a1 = parseFloat(document.getElementById('val1').value);
    const a2 = parseFloat(document.getElementById('val2').value);
    const b1 = parseFloat(document.getElementById('val3').value);

    if (isNaN(a1) || isNaN(a2) || isNaN(b1)) {
        alert('⚠️ Preencha todos os campos!');
        return;
    }

    if (a1 === 0) {
        alert('⚠️ O primeiro valor não pode ser zero!');
        return;
    }

    let result;
    let explanation;

    if (calcType === 'direta') {
        // A1/A2 = B1/x => x = (A2 * B1) / A1
        result = (a2 * b1) / a1;
        explanation = `Grandezas diretamente proporcionais:<br>
            ${a1}/${a2} = ${b1}/x<br>
            x = (${a2} × ${b1}) / ${a1} = <strong>${result.toFixed(2)}</strong>`;
    } else {
        // A1/A2 = x/B1 => x = (A1 * B1) / A2
        if (a2 === 0) {
            alert('⚠️ O segundo valor não pode ser zero!');
            return;
        }
        result = (a1 * b1) / a2;
        explanation = `Grandezas inversamente proporcionais:<br>
            A₁/A₂ = x/B₁ (invertemos!)<br>
            x = (${a1} × ${b1}) / ${a2} = <strong>${result.toFixed(2)}</strong>`;
    }

    resultValue.textContent = result.toFixed(2);
    resultExplanation.innerHTML = explanation;
    calcResult.classList.remove('hidden');

    // Efeito de shake no resultado
    calcResult.style.animation = 'none';
    setTimeout(() => {
        calcResult.style.animation = 'slideIn 0.5s';
    }, 10);
});

clearBtn.addEventListener('click', () => {
    document.getElementById('val1').value = '';
    document.getElementById('val2').value = '';
    document.getElementById('val3').value = '';
    calcResult.classList.add('hidden');
});

// ===== EFEITO PARALLAX SUAVE NO HERO =====
document.addEventListener('mousemove', (e) => {
    const heroChar = document.querySelector('.floating-char');
    if (!heroChar) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroChar.style.transform = `translate(${x}px, ${y}px)`;
});

// ===== SCROLL SUAVE PARA NAVBAR =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 31, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 31, 0.8)';
    }
});

console.log('🥷 MathAnime carregado com sucesso!');
console.log('📚 Pronto para dominar a Regra de Três!');

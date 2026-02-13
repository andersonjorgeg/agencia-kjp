// Initial Page Load Animations & Scroll Fix
window.addEventListener('load', () => {
    // Force scroll to top on refresh/load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    document.body.classList.add('loaded');
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.navbar-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-active');
    const icon = menuToggle.querySelector('.material-icons');
    icon.textContent = navLinks.classList.contains('mobile-active') ? 'close' : 'menu';
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
        menuToggle.querySelector('.material-icons').textContent = 'menu';
    });
});

// Reveal Animations (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(el => revealObserver.observe(el));

// --- Form Optimization & Security (Form CRO) ---

// Pure function for sanitization (Removes HTML tags and trims)
const sanitizeInput = (str) => {
    if (!str) return '';
    return str.replace(/<[^>]*>?/gm, '').trim();
};

const contactForm = document.getElementById('contact-form');
// Nota: O envio agora é feito de forma nativa pelo HTML (sem AJAX) para simplicidade,
// conforme as últimas instruções. O FormSubmit lidará com o processamento.

// Dynamic Year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Statistics Counter Animation
const statsSection = document.querySelector('.stats-row');
const counters = document.querySelectorAll('.stat-number[data-target]');
const COUNTER_DURATION = 500;

const animateCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const startTime = performance.now();

    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / COUNTER_DURATION, 1);

        // Easing function for smoother finish
        const easeOutQuad = (t) => t * (2 - t);
        const currentCount = Math.floor(easeOutQuad(progress) * target);

        el.innerText = currentCount;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.innerText = target;
        }
    };

    requestAnimationFrame(update);
};

let started = false;
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
            counters.forEach(counter => animateCounter(counter));
            started = true;
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

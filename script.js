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

// Form Submission (Simulated)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.submit-btn');
        const originalText = btn.textContent;

        btn.textContent = 'Enviando...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Mensagem Enviada!';
            btn.style.backgroundColor = '#4caf50';
            btn.style.color = '#fff';
            contactForm.reset();

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// Dynamic Year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Statistics Counter Animation
const statsSection = document.querySelector('.stats-row');
const counters = document.querySelectorAll('.stat-number[data-target]');
let started = false;

const startCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const count = +el.innerText;
    const speed = target / 100;

    if (count < target) {
        el.innerText = Math.ceil(count + speed);
        setTimeout(() => startCounter(el), 20);
    } else {
        el.innerText = target;
    }
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
            counters.forEach(counter => startCounter(counter));
            started = true;
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

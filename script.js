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
if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const btn = contactForm.querySelector('.submit-btn');
        const originalText = btn.textContent;
        const formData = new FormData(contactForm);

        // Sanitize and prepare data
        const data = {};
        formData.forEach((value, key) => {
            // Only sanitize text fields, keep hidden configs as is if they start with _
            if (key.startsWith('_')) {
                data[key] = value;
            } else {
                data[key] = sanitizeInput(value);
            }
        });

        // Feedback visual
        btn.textContent = 'Enviando...';
        btn.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success === "true") {
                btn.textContent = 'Mensagem Enviada!';
                btn.style.backgroundColor = '#4caf50';
                btn.style.color = '#fff';
                contactForm.reset();

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.disabled = false;
                }, 5000);
            } else {
                throw new Error(result.message || 'Erro no servidor');
            }
        } catch (error) {
            console.error('Submit error:', error);
            btn.textContent = 'Erro ao enviar';
            btn.style.backgroundColor = '#f44336';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 5000);

            alert('Erro ao enviar: ' + error.message + '\nPor favor, verifique se você já confirmou seu e-mail no FormSubmit após o primeiro envio.');
        }
    });
}

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

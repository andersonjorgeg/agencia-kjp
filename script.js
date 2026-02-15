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

// Mobile Menu Toggle Logic
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });
}

if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    });
}

// Close mobile menu on link click
const mobileMenuLinks = mobileMenu?.querySelectorAll('a, button');
mobileMenuLinks?.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
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
            if (key.startsWith('_')) {
                data[key] = value;
            } else {
                data[key] = sanitizeInput(value);
            }
        });

        // Feedback visual imediato
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

            if (response.ok) {
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
                throw new Error(result.message || 'Erro ao enviar');
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

            alert('Erro ao enviar. Por favor, tente novamente ou use o contato direto.');
        }
    });
}

// Máscara de Telefone (Formato: (21)981179936)
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

        let masked = '';
        if (value.length > 0) {
            masked = '(' + value.slice(0, 2);
            if (value.length > 2) {
                masked += ')' + value.slice(2);
            }
        }
        e.target.value = masked;
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

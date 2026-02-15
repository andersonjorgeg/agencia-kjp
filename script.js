// Initial Page Load Animations & Scroll Restoration
window.addEventListener('load', () => {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    document.body.classList.add('loaded');

    // Trigger Hero Animations with slight delay for impact
    setTimeout(() => {
        document.querySelector('.hero-reveal-title')?.classList.add('active');
        document.querySelector('.hero-reveal-desc')?.classList.add('active');
        document.querySelector('.hero-reveal-btns')?.classList.add('active');
    }, 300);
});

// Mobile Menu Toggle Logic with Smooth Transitions
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');

const openMenu = () => {
    mobileMenu.classList.remove('opacity-0', 'pointer-events-none', 'translate-x-full');
    mobileMenu.classList.add('opacity-100', 'translate-x-0');
    document.body.style.overflow = 'hidden';
};

const closeMenu = () => {
    mobileMenu.classList.remove('opacity-100', 'translate-x-0');
    mobileMenu.classList.add('opacity-0', 'pointer-events-none', 'translate-x-full');
    document.body.style.overflow = '';
};

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', openMenu);
}

if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', closeMenu);
}

// Close mobile menu on link click
const mobileMenuLinks = mobileMenu?.querySelectorAll('a, button');
mobileMenuLinks?.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Premium Reveal Animations (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Once revealed, we can unobserve if we want it to stay permanent
            // revealObserver.unobserve(entry.target);
        } else {
            // Optional: remove class when out of view for re-animation
            // entry.target.classList.remove('active');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// Hero Tilt Interactive Effect
const heroTiltContainer = document.querySelector('.hero-tilt');
if (heroTiltContainer) {
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const rotationX = ((clientY / innerHeight) - 0.5) * 10; // Max 5deg tilt
        const rotationY = ((clientX / innerWidth) - 0.5) * -10;

        heroTiltContainer.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    });
}

// Sutil Parallax Effect for Backgrounds
window.addEventListener('scroll', () => {
    const parallaxBgs = document.querySelectorAll('.parallax-bg');

    parallaxBgs.forEach(bg => {
        const parent = bg.parentElement;
        const rect = parent.getBoundingClientRect();

        // Só anima se o elemento pai estiver na viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            // Calcula o progresso do elemento cruzando a tela (-1 a 1)
            const scrollPercent = (rect.top + rect.height / 2) / (window.innerHeight / 2) - 1;
            const moveRange = 100; // Pixels de deslocamento total
            const yPos = scrollPercent * moveRange;

            // Adicionamos um scale para cobrir as bordas durante o movimento
            bg.style.transform = `translateY(${-yPos}px) scale(1.2)`;
        }
    });
});

// Statistics Counter Animation (Improved)
const statsSection = document.querySelector('.stats-row') || document.querySelector('.reveal');
const counters = document.querySelectorAll('.stat-number[data-target]');
const COUNTER_DURATION = 1500;

const animateCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const startTime = performance.now();

    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / COUNTER_DURATION, 1);
        const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        const currentCount = Math.floor(easeOutExpo(progress) * target);

        el.innerText = currentCount;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.innerText = target;
        }
    };

    requestAnimationFrame(update);
};

let statsStarted = false;
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsStarted) {
            counters.forEach(counter => animateCounter(counter));
            statsStarted = true;
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}


// Form Handling with AJAX & Sanitization
const sanitizeInput = (str) => {
    return str.replace(/<[^>]*>?/gm, '').trim();
};

const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;

    // Local Validation & Sanitization
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = sanitizeInput(value);
    });

    // Feedback: Sending
    submitBtn.disabled = true;
    submitBtn.innerText = 'Enviando...';
    submitBtn.style.opacity = '0.7';

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Success
            submitBtn.innerText = 'Mensagem Enviada!';
            submitBtn.style.backgroundColor = '#10B981'; // Green-500
            form.reset();
        } else if (response.status === 429) {
            // Rate Limit Error
            throw new Error('Muitas tentativas. Aguarde um momento.');
        } else {
            throw new Error('Erro na resposta do servidor');
        }
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);

        if (error.message.includes('Muitas tentativas')) {
            submitBtn.innerText = 'Muitas tentativas';
            submitBtn.style.backgroundColor = '#F59E0B'; // Amber-500
        } else {
            submitBtn.innerText = 'Erro ao enviar';
            submitBtn.style.backgroundColor = '#EF4444'; // Red-500
        }
    } finally {
        setTimeout(() => {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.backgroundColor = '';
        }, 5000);
    }
};

// Bind to all forms using FormSubmit endpoint
const forms = document.querySelectorAll('form[action*="formsubmit.co"]');
forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
});

// Dynamic Year
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

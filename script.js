// Initial Page Load Animations & Scroll Restoration
window.addEventListener('load', () => {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    document.body.classList.add('loaded');
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

// Sutil Parallax Effect for Backgrounds
window.addEventListener('scroll', () => {
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    const scrolled = window.pageYOffset;

    parallaxBgs.forEach(bg => {
        const coords = scrolled * 0.4 + 'px';
        bg.style.transform = `translateY(${coords})`;
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

// Dynamic Year
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

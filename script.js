// ── Navbar active link on scroll ──────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            }
        });
    },
    { threshold: 0.35, rootMargin: '-60px 0px -40% 0px' }
);

sections.forEach((s) => navObserver.observe(s));

// ── Hamburger menu ─────────────────────────────────────────────────────────
const hamburger    = document.getElementById('hamburger');
const navLinksList = document.getElementById('nav-links');

hamburger.addEventListener('click', () => navLinksList.classList.toggle('open'));
navLinksList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinksList.classList.remove('open'));
});

// ── Scroll reveal ──────────────────────────────────────────────────────────
const revealSelectors = [
    '.about-card',
    '.timeline-item',
    '.exp-card',
    '.pub-item',
    '.course-group',
    '.skill-group',
    '.contact-item',
];

revealSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.classList.add('reveal'));
});

// Stagger items inside grid/list containers
document.querySelectorAll('.exp-grid, .courses-grid, .skills-grid, .contact-grid, .pub-list').forEach((grid) => {
    grid.querySelectorAll('.reveal').forEach((item, i) => {
        item.style.transitionDelay = `${i * 0.08}s`;
    });
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

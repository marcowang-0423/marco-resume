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

hamburger.addEventListener('click', () => {
    const isOpen = navLinksList.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
});

navLinksList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        navLinksList.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinksList.contains(e.target)) {
        navLinksList.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
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

// ── Back to top ────────────────────────────────────────────────────────────
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 300);
}, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── GitHub Repos ────────────────────────────────────────────────────────────
const reposGrid = document.getElementById('repos-grid');
if (reposGrid) {
    fetch('assets/repos.json')
        .then(r => r.json())
        .then(repos => {
            if (!repos.length) { reposGrid.innerHTML = ''; return; }
            reposGrid.innerHTML = repos.map(repo => `
                <a class="repo-card reveal" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                    <div class="repo-name">${repo.name}</div>
                    ${repo.description ? `<p class="repo-desc">${repo.description}</p>` : ''}
                    <div class="repo-meta">
                        ${repo.language ? `<span class="repo-lang">${repo.language}</span>` : ''}
                        ${repo.stargazers_count > 0 ? `<span>&#9733; ${repo.stargazers_count}</span>` : ''}
                    </div>
                </a>
            `).join('');
            reposGrid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
        })
        .catch(() => { reposGrid.innerHTML = ''; });
}

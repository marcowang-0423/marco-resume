// Navbar active link tracking via IntersectionObserver
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(
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

sections.forEach((s) => observer.observe(s));

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinksList = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinksList.classList.toggle('open');
});

navLinksList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinksList.classList.remove('open'));
});

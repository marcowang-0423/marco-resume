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

// ── Contact form ────────────────────────────────────────────────────────────
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const note    = contactForm.querySelector('.form-note');
        const btn     = contactForm.querySelector('.form-submit');
        const data    = new FormData(contactForm);
        note.className = 'form-note';
        note.textContent = '';
        btn.disabled = true;
        btn.textContent = btn.textContent.includes('Send') ? 'Sending…' : '傳送中…';
        try {
            const res = await fetch(contactForm.action, {
                method: 'POST', body: data, headers: { Accept: 'application/json' }
            });
            if (res.ok) {
                note.className = 'form-note success';
                note.textContent = contactForm.action.includes('YOUR_FORM_ID')
                    ? '⚠ 尚未設定 Formspree ID，請先完成設定'
                    : (document.documentElement.lang === 'en'
                        ? 'Message sent! I\'ll get back to you soon.'
                        : '訊息已送出！我會盡快回覆您。');
                if (!contactForm.action.includes('YOUR_FORM_ID')) contactForm.reset();
            } else {
                throw new Error();
            }
        } catch {
            note.className = 'form-note error';
            note.textContent = document.documentElement.lang === 'en'
                ? 'Something went wrong. Please try again or email me directly.'
                : '送出失敗，請再試一次或直接寄信給我。';
        } finally {
            btn.disabled = false;
            btn.textContent = document.documentElement.lang === 'en' ? 'Send Message' : '送出訊息';
        }
    });
}

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

// ── RAG Chatbot ────────────────────────────────────────────────────────────────
const chatToggle = document.getElementById('chat-toggle');
const chatClose = document.getElementById('chat-close');
const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

if (chatToggle) {
    chatToggle.addEventListener('click', () => {
        const isOpen = !chatContainer.hidden;
        chatContainer.hidden = isOpen;
        chatToggle.setAttribute('aria-expanded', !isOpen);
        if (!isOpen) chatInput.focus();
    });

    chatClose.addEventListener('click', () => {
        chatContainer.hidden = true;
        chatToggle.setAttribute('aria-expanded', 'false');
    });

    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (!message) return;

        chatInput.value = '';
        chatMessages.innerHTML += `<div class="chat-message user"><p>${message}</p></div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) throw new Error('Failed to fetch response');
            const { reply } = await response.json();
            chatMessages.innerHTML += `<div class="chat-message bot"><p>${reply}</p></div>`;
        } catch (error) {
            chatMessages.innerHTML += `<div class="chat-message bot"><p>抱歉，發生錯誤。請稍後再試。</p></div>`;
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

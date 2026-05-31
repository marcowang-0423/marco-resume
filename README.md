# Marco Wang — Personal Resume Website

Bilingual (zh-TW / EN) static resume site deployed on **GitHub Pages**.

Live: https://marcowang-0423.github.io/marco-resume/

## Structure

```
personal-profile-site/
├── index.html              # 中文版
├── en.html                 # English version
├── styles.css              # All styles (dark mode + print included)
├── script.js               # Navbar, scroll reveal, contact form, GitHub repos
├── sitemap.xml             # SEO sitemap
├── robots.txt              # SEO robots
├── assets/
│   ├── profile.jpg         # Hero photo
│   ├── resume.pdf          # 中文 CV
│   ├── resume_en.pdf       # English CV
│   ├── nthu-logo.png/webp  # NTHU logo
│   ├── mnet-logo.png/webp  # Lab logo
│   ├── ieee-globecom-logo.png/webp
│   └── repos.json          # Auto-updated by GitHub Actions
└── .github/
    ├── lighthouserc.json
    └── workflows/
        ├── lighthouse.yml      # Lighthouse CI on every push
        ├── html-validate.yml   # W3C HTML validation on every push
        ├── link-check.yml      # Weekly external link checker
        └── fetch-repos.yml     # Daily GitHub repo list update
```

## Local Development

```bash
cd personal-profile-site
python -m http.server 8080
# open http://localhost:8080
```

> Opening `index.html` directly with `file://` will break `fetch()` calls (repos, contact form). Always use a local server.

## Contact Form Setup (Formspree)

1. Sign up at [formspree.io](https://formspree.io) and create a new form
2. Copy your form endpoint (e.g. `https://formspree.io/f/xpzgkwoj`)
3. Replace `YOUR_FORM_ID` in both `index.html` and `en.html`

## GitHub Actions

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `lighthouse.yml` | push / PR to main | Performance & accessibility audit |
| `html-validate.yml` | push / PR to main | W3C HTML validation |
| `link-check.yml` | every Monday | External link health check |
| `fetch-repos.yml` | push + daily | Updates `assets/repos.json` with latest GitHub repos |

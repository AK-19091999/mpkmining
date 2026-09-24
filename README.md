# MPK Mining Equipment & Supplies Ltd — Website

A single-page, fully responsive website for MPK Mining Equipment & Supplies
Ltd, ready to push straight to a GitHub repository and deploy on GitHub
Pages (or any static host). All files sit flat in this one folder — no
`css/`, `js/` or `images/` subfolders.

## No contact form
This site has no on-page contact form and no email-sending backend
(EmailJS or otherwise). Instead, the Contact section and the mobile
sticky bar link directly to:
- **WhatsApp** — `https://wa.me/260973045310`
- **Phone** — `tel:+260973045310`
- **Email** — `mailto:sales@mpkmining.com`

This removes a class of spam/bot risk entirely, avoids relying on a
third-party email-delivery service, and gets visitors talking to the
team in one tap instead of filling in fields.

## What's new in this version
- **No contact form** — replaced with direct WhatsApp / Call / Email CTAs.
- **Interactive product cards** — cursor-tracking 3D tilt, a light-follow
  glow, and category filter tabs (`#products`) built with vanilla JS
  (`script.js`, no dependencies).
- **Scroll progress bar**, infinite-marquee sourcing strip, and an FAQ
  accordion (`#faq`) with matching `FAQPage` structured data.
- **Fully responsive** — breakpoints at 1200 / 1080 / 980 / 960 / 720 /
  560 / 420 / 360px cover everything from ultra-wide desktops to small
  phones; the mobile nav collapses earlier now that the header carries
  an extra link.
- **SEO / AEO upgrades** — `Organization`, `LocalBusiness`, `WebSite`,
  `ItemList` (products/services) and `FAQPage` JSON-LD; tightened
  Content-Security-Policy (no longer allowlists the now-unused EmailJS
  domains); `og:image` dimensions; lazy-loaded below-the-fold image;
  an `apple-touch-icon`; and an expanded `llms.txt` for AI answer
  engines.

## Contact details already in the site
- Email: sales@mpkmining.com
- WhatsApp / Phone: +260 973 045 310 (floating button, mobile bar,
  footer, and contact section)
- Domain used throughout: https://mpkmining.com/

## Deploying on GitHub Pages
1. Push this folder's contents to the root of a new GitHub repository.
2. In the repo, go to **Settings → Pages**, set the source branch (e.g.
   `main`) and folder (`/root`), and save.
3. Point your custom domain (`mpkmining.com`) at GitHub Pages under
   Settings → Pages → Custom domain, and enable "Enforce HTTPS".

## Security notes
- A `Content-Security-Policy` meta tag restricts scripts/styles to this
  site and Google Fonts only — there's no form-submission endpoint to
  allowlist anymore.
- `X-Content-Type-Options` and a strict `referrer` policy are set.
- GitHub Pages serves everything over HTTPS by default — keep
  "Enforce HTTPS" enabled in repo settings.

## Structure
```
mpkmining/
├── index.html
├── style.css
├── script.js
├── logo.png
├── logo-black-bg.png
├── favicon.ico
├── robots.txt
├── sitemap.xml
├── llms.txt
└── README.md
```

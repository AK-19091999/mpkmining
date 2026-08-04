# MPK Mining Equipment & Supplies Ltd — Website

A single-page, responsive website for MPK Mining Equipment & Supplies Ltd,
ready to push straight to a GitHub repository and deploy on GitHub Pages
(or any static host). All files sit flat in this one folder — no `css/`,
`js/` or `images/` subfolders.

## Before you publish — required step

### Connect the contact form to your inbox
The form is pure HTML/JS (no backend), so it needs a form-processing service
to actually deliver mail to `nagendra@mpkmining.com`.

1. Go to https://formspree.io and create a free account using
   `nagendra@mpkmining.com`.
2. Create a new form, confirm the verification email.
3. Copy the endpoint it gives you (looks like `https://formspree.io/f/xxxxabcd`).
4. Open `script.js` and replace:
   ```js
   var FORM_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID";
   ```
   with your real endpoint.

Until this is done, the form will show a friendly "not configured yet"
message instead of silently failing.

## Contact details already in the site
- Email: nagendra@mpkmining.com
- WhatsApp: +260 973 045 310 (floating button + footer + contact section)
- Domain used throughout: https://mpkmining.com/

## Deploying on GitHub Pages
1. Push this folder's contents to the root of a new GitHub repository.
2. In the repo, go to **Settings → Pages**, set the source branch (e.g.
   `main`) and folder (`/root`), and save.
3. Point your custom domain (`mpkmining.com`) at GitHub Pages under
   Settings → Pages → Custom domain, and enable "Enforce HTTPS".

## Security notes
- A `Content-Security-Policy` meta tag restricts scripts/styles/connections
  to this site, Google Fonts and Formspree only.
- The contact form has a honeypot field, a submission-timing check, and
  client-side input validation/sanitization in addition to whatever spam
  filtering your form backend (e.g. Formspree) provides.
- All form fields are validated both with HTML5 constraints and JS regex
  before submission.
- No inline `<script>` execution is used, keeping the CSP tight.
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

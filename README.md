# MPK Mining Equipment & Supplies Ltd — Website

A single-page, responsive, glassmorphic website for MPK Mining Equipment &
Supplies Ltd, ready to push straight to a GitHub repository and deploy on
GitHub Pages (or any static host).

## Before you publish — 3 required steps

### 1. Connect the contact form to your inbox
The form is pure HTML/JS (no backend), so it needs a form-processing service
to actually deliver mail to `nagendra@mpkmining.com`.

1. Go to https://formspree.io and create a free account using
   `nagendra@mpkmining.com`.
2. Create a new form, confirm the verification email.
3. Copy the endpoint it gives you (looks like `https://formspree.io/f/xxxxabcd`).
4. Open `js/script.js` and replace:
   ```js
   var FORM_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID";
   ```
   with your real endpoint.

Until this is done, the form will show a friendly "not configured yet"
message instead of silently failing.

### 2. Replace placeholder details
- Phone number is not currently listed anywhere on the site (none could be
  confirmed publicly) — add one to the Contact section in `index.html` if
  you'd like a phone/WhatsApp option.
- Swap `images/logo-mark.png` and `favicon.ico` for your real logo if you
  have one — a simple placeholder mark is included so the site isn't blank.
- Double-check the About / Leadership section reflects who you want listed
  publicly.

### 3. Update the domain
Replace `https://www.mpkmining.com/` in `index.html`, `sitemap.xml` and
`robots.txt` with your actual domain once you know it.

## Deploying on GitHub Pages
1. Push this folder's contents to the root of a new GitHub repository.
2. In the repo, go to **Settings → Pages**, set the source branch (e.g.
   `main`) and folder (`/root`), and save.
3. Your site will be live at `https://<username>.github.io/<repo>/` (or your
   custom domain if you configure one under Settings → Pages → Custom domain).

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
├── css/style.css
├── js/script.js
├── images/
├── robots.txt
├── sitemap.xml
├── llms.txt
└── favicon.ico
```

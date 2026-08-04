# MPK Mining Equipment & Supplies Ltd — Website

A single-page, responsive website for MPK Mining Equipment & Supplies Ltd,
ready to push straight to a GitHub repository and deploy on GitHub Pages
(or any static host). All files sit flat in this one folder — no `css/`,
`js/` or `images/` subfolders.

## Before you publish — required step

### Connect the contact form to your inbox (and send an auto-reply)
The form is pure HTML/JS (no backend), so it uses EmailJS to deliver mail —
this also lets it send an automatic "thank you" reply to whoever fills the
form, using the two branded templates included in this folder
(`mpk-enquiry-notification-email.html` and `mpk-thank-you-email.html`).

1. Go to https://www.emailjs.com and create a free account using
   `nagendra@mpkmining.com`.
2. **Add an Email Service** (Email Services → Add New Service) — connect
   Gmail, Outlook, or your own SMTP inbox. Note the **Service ID**.
3. **Create the notification template** (Email Templates → Create New
   Template): switch to the code/HTML editor and paste in the contents of
   `mpk-enquiry-notification-email.html`. Set "To Email" to
   `nagendra@mpkmining.com`. Note the **Template ID**.
4. **Create the auto-reply template** the same way, pasting in
   `mpk-thank-you-email.html`. Set "To Email" to `{{email}}` (so it goes to
   whoever submitted the form).
5. On the **notification template**, open the **Auto-Reply** tab and link
   the auto-reply template you just created. This makes every enquiry
   trigger both emails from one submission.
6. Go to Account → General and copy your **Public Key**.
7. Open `script.js` and replace:
   ```js
   var EMAILJS_PUBLIC_KEY = "REPLACE_WITH_YOUR_PUBLIC_KEY";
   var EMAILJS_SERVICE_ID = "REPLACE_WITH_YOUR_SERVICE_ID";
   var EMAILJS_TEMPLATE_ID = "REPLACE_WITH_YOUR_NOTIFICATION_TEMPLATE_ID";
   ```
   with your real values.

Until this is done, the form will show a friendly "not configured yet"
message instead of silently failing. The free EmailJS plan covers 200
emails/month across exactly 2 templates, which matches this setup.

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
  to this site, Google Fonts, jsDelivr (for the EmailJS SDK) and the
  EmailJS API only.
- The contact form has a honeypot field, a submission-timing check, and
  client-side input validation/sanitization in addition to whatever spam
  filtering EmailJS provides.
- All form fields are validated both with HTML5 constraints and JS regex
  before submission.
- The EmailJS Public Key is safe to expose client-side by design — it only
  authorizes sending through your pre-configured templates, not reading
  your inbox.
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
├── mpk-enquiry-notification-email.html
├── mpk-thank-you-email.html
├── llms.txt
└── README.md
```

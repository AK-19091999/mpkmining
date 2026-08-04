(function () {
  "use strict";

  /* ---------- Scroll reveal + header + counters ----------
     Placed first and wrapped defensively so a later error elsewhere
     in this file (e.g. form handling) can never leave content hidden. */
  try {
    var siteHeader = document.querySelector(".site-header");
    if (siteHeader) {
      var onScrollHeader = function () {
        siteHeader.classList.toggle("scrolled", window.scrollY > 12);
      };
      onScrollHeader();
      window.addEventListener("scroll", onScrollHeader, { passive: true });
    }

    var revealEls = document.querySelectorAll(".reveal");
    var forceRevealAll = function () {
      for (var i = 0; i < revealEls.length; i++) {
        revealEls[i].classList.add("in-view");
      }
    };

    if (revealEls.length) {
      if ("IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                revealObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
        );
        for (var r = 0; r < revealEls.length; r++) {
          revealObserver.observe(revealEls[r]);
        }
      } else {
        forceRevealAll();
      }
      // Safety net: guarantee content is visible even if the observer
      // never fires for some reason (e.g. unusual layout/embedding).
      window.setTimeout(forceRevealAll, 2500);
    }

    var countEls = document.querySelectorAll("[data-count-to]");
    if (countEls.length) {
      var animateCount = function (el) {
        var target = parseInt(el.getAttribute("data-count-to"), 10) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var duration = 1200;
        var start = null;

        var step = function (timestamp) {
          if (start === null) start = timestamp;
          var progress = Math.min((timestamp - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            el.textContent = target + suffix;
          }
        };
        window.requestAnimationFrame(step);
      };

      if ("IntersectionObserver" in window) {
        var countObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                animateCount(entry.target);
                countObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.5 }
        );
        for (var c = 0; c < countEls.length; c++) {
          countObserver.observe(countEls[c]);
        }
      } else {
        for (var c2 = 0; c2 < countEls.length; c2++) {
          var el2 = countEls[c2];
          el2.textContent = el2.getAttribute("data-count-to") + (el2.getAttribute("data-suffix") || "");
        }
      }
    }
  } catch (e) {
    // If anything above fails, never let it leave content invisible.
    var fallbackReveal = document.querySelectorAll(".reveal");
    for (var f = 0; f < fallbackReveal.length; f++) {
      fallbackReveal[f].classList.add("in-view");
    }
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var siteNav = document.getElementById("site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Contact form ---------- */
  // IMPORTANT: replace this with your own Formspree endpoint (or other form
  // backend) before going live. Sign up free at https://formspree.io using
  // nagendra@mpkmining.com, create a form, and paste its endpoint below.
  var FORM_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID";

  var form = document.getElementById("enquiryForm");
  var submitBtn = document.getElementById("submitBtn");
  var formStatus = document.getElementById("formStatus");
  var modalOverlay = document.getElementById("modalOverlay");
  var modalClose = document.getElementById("modalClose");
  var modalOkBtn = document.getElementById("modalOkBtn");
  var formTsField = document.getElementById("form_ts");

  // Record the time the form became visible, used as a simple bot-speed trap.
  if (formTsField) formTsField.value = String(Date.now());

  var validators = {
    name: function (v) {
      return /^[A-Za-z\s.'-]{2,80}$/.test(v.trim());
    },
    mobile: function (v) {
      return /^[0-9+\s().-]{7,16}$/.test(v.trim());
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) && v.trim().length <= 120;
    },
    message: function (v) {
      var t = v.trim();
      return t.length >= 10 && t.length <= 2000;
    }
  };

  function sanitize(str) {
    // Strip characters that have no place in these fields and could be used
    // for header injection / script injection if ever reflected elsewhere.
    return str.replace(/[<>`]/g, "").replace(/[\r\n]{2,}/g, "\n").trim();
  }

  function setFieldState(id, valid) {
    var wrapper = document.getElementById(id).closest(".field");
    if (!wrapper) return;
    wrapper.classList.toggle("invalid", !valid);
  }

  function validateField(id) {
    var el = document.getElementById(id);
    var valid = validators[id] ? validators[id](el.value) : true;
    setFieldState(id, valid);
    return valid;
  }

  ["name", "mobile", "email", "message"].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("blur", function () {
      validateField(id);
    });
    el.addEventListener("input", function () {
      if (el.closest(".field").classList.contains("invalid")) validateField(id);
    });
  });

  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = "form-status" + (type ? " " + type : "");
  }

  function openModal() {
    modalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    modalOkBtn.focus();
  }

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalOkBtn) modalOkBtn.addEventListener("click", closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalOverlay && !modalOverlay.hidden) closeModal();
  });

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot check — if this hidden field has any value, silently drop.
      var honeypot = document.getElementById("company_website");
      if (honeypot && honeypot.value.trim() !== "") {
        showStatus("Thanks — your enquiry has been received.", "success");
        form.reset();
        return;
      }

      // Timing trap — genuine users take at least a couple of seconds.
      var startedAt = Number(formTsField.value || 0);
      if (startedAt && Date.now() - startedAt < 1500) {
        showStatus("Please take a moment to review the form and try again.", "error");
        return;
      }

      var fields = ["name", "mobile", "email", "message"];
      var allValid = fields.map(validateField).every(Boolean);

      if (!allValid) {
        showStatus("Please correct the highlighted fields.", "error");
        return;
      }

      if (FORM_ENDPOINT.indexOf("REPLACE_WITH_YOUR_FORM_ID") !== -1) {
        showStatus(
          "Form backend not configured yet — set FORM_ENDPOINT in script.js.",
          "error"
        );
        return;
      }

      var payload = {
        name: sanitize(document.getElementById("name").value),
        mobile: sanitize(document.getElementById("mobile").value),
        email: sanitize(document.getElementById("email").value),
        message: sanitize(document.getElementById("message").value),
        _subject: "New enquiry from mpkmining.com"
      };

      submitBtn.disabled = true;
      showStatus("Sending your enquiry…", "");

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          return res.json();
        })
        .then(function () {
          showStatus("", "");
          form.reset();
          formTsField.value = String(Date.now());
          openModal();
        })
        .catch(function () {
          showStatus(
            "Something went wrong sending your enquiry. Please email nagendra@mpkmining.com directly.",
            "error"
          );
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();

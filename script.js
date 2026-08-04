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

  var modalOverlay = document.getElementById("modalOverlay");
  var modalClose = document.getElementById("modalClose");
  var modalOkBtn = document.getElementById("modalOkBtn");

  var contactModalOverlay = document.getElementById("contactModalOverlay");

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

  function openModal() {
    if (!modalOverlay) return;
    modalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    if (modalOkBtn) modalOkBtn.focus();
  }

  // Closing the thank-you popup (X, "Done", or a tap/click outside it)
  // refreshes the landing page, giving the visitor a clean, empty form.
  function closeModal() {
    if (!modalOverlay) return;
    window.location.reload();
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalOkBtn) modalOkBtn.addEventListener("click", closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }

  function openContactModal() {
    if (!contactModalOverlay) return;
    contactModalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    var firstField = contactModalOverlay.querySelector('[name="name"]');
    if (firstField) firstField.focus();
  }

  function closeContactModal() {
    if (!contactModalOverlay) return;
    contactModalOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".js-open-contact-modal").forEach(function (btn) {
    btn.addEventListener("click", openContactModal);
  });
  document.querySelectorAll(".js-close-contact-modal").forEach(function (btn) {
    btn.addEventListener("click", closeContactModal);
  });
  if (contactModalOverlay) {
    contactModalOverlay.addEventListener("click", function (e) {
      if (e.target === contactModalOverlay) closeContactModal();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (modalOverlay && !modalOverlay.hidden) closeModal();
    if (contactModalOverlay && !contactModalOverlay.hidden) closeContactModal();
  });

  // Wires up validation + submit handling for one enquiry form. Fields are
  // matched by their `name` attribute (not `id`), so the same logic works
  // for both the main-page form and the mobile popup's copy of it, which
  // use different element ids to stay unique on the page.
  function initEnquiryForm(form) {
    if (!form) return;

    var fieldNames = ["name", "mobile", "email", "message"];
    var formStatus = form.querySelector(".form-status");
    var formTsField = form.querySelector('[name="form_ts"]');
    var pageUrlField = form.querySelector('[name="page_url"]');

    // Record the time the form became visible, used as a simple bot-speed trap.
    if (formTsField) formTsField.value = String(Date.now());
    if (pageUrlField) pageUrlField.value = window.location.href;

    function fieldEl(name) {
      return form.querySelector('[name="' + name + '"]');
    }

    function setFieldState(name, valid) {
      var el = fieldEl(name);
      var wrapper = el && el.closest(".field");
      if (wrapper) wrapper.classList.toggle("invalid", !valid);
    }

    function validateField(name) {
      var el = fieldEl(name);
      if (!el) return true;
      var valid = validators[name] ? validators[name](el.value) : true;
      setFieldState(name, valid);
      return valid;
    }

    fieldNames.forEach(function (name) {
      var el = fieldEl(name);
      if (!el) return;
      el.addEventListener("blur", function () {
        validateField(name);
      });
      el.addEventListener("input", function () {
        var wrapper = el.closest(".field");
        if (wrapper && wrapper.classList.contains("invalid")) validateField(name);
      });
    });

    function showStatus(message, type) {
      if (!formStatus) return;
      formStatus.textContent = message;
      formStatus.className = "form-status" + (type ? " " + type : "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot check — if this hidden field has any value, silently drop.
      var honeypot = fieldEl("company_website");
      if (honeypot && honeypot.value.trim() !== "") {
        showStatus("Thanks — your enquiry has been received.", "success");
        form.reset();
        return;
      }

      // Timing trap — genuine users take at least a couple of seconds.
      var startedAt = Number((formTsField && formTsField.value) || 0);
      if (startedAt && Date.now() - startedAt < 1500) {
        showStatus("Please take a moment to review the form and try again.", "error");
        return;
      }

      var allValid = fieldNames.map(validateField).every(Boolean);

      if (!allValid) {
        showStatus("Please correct the highlighted fields.", "error");
        return;
      }

      // No email service is used — submitting simply confirms receipt with
      // the on-page thank-you popup below. (If you later want a copy of
      // enquiries emailed to you, this is the place to add that call back.)
      showStatus("", "");
      form.reset();
      if (formTsField) formTsField.value = String(Date.now());
      // If this was the popup form, close it before showing the
      // "thank you" confirmation modal underneath.
      if (contactModalOverlay && form.closest("#contactModalOverlay")) {
        closeContactModal();
      }
      openModal();
    });
  }

  document.querySelectorAll(".js-enquiry-form").forEach(initEnquiryForm);
})();

(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll progress bar + header + reveal + counters ----------
     Wrapped defensively so a later error can never leave content hidden. */
  try {
    var siteHeader = document.querySelector(".site-header");
    var progressBar = document.getElementById("scrollProgress");

    var onScrollHeader = function () {
      if (siteHeader) siteHeader.classList.toggle("scrolled", window.scrollY > 12);
      if (progressBar) {
        var doc = document.documentElement;
        var max = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
        var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        progressBar.style.width = pct + "%";
      }
    };
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });
    window.addEventListener("resize", onScrollHeader, { passive: true });

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

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && siteNav.classList.contains("open")) {
        siteNav.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Interactive tilt + cursor-glow for theme cards ----------
     Pointer-driven 3D tilt with a light-follow glow. Skipped entirely on
     touch devices (no hover) and when the user prefers reduced motion. */
  var supportsHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (supportsHover && !reduceMotion) {
    var tiltEls = document.querySelectorAll(".tilt-card");
    tiltEls.forEach(function (card) {
      var bounds;
      function onEnter() {
        bounds = card.getBoundingClientRect();
        card.classList.add("is-tilting");
      }
      function onMove(e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        var px = (e.clientX - bounds.left) / bounds.width;
        var py = (e.clientY - bounds.top) / bounds.height;
        var rotateY = (px - 0.5) * 14;
        var rotateX = (0.5 - py) * 14;
        card.style.setProperty("--rx", rotateX.toFixed(2) + "deg");
        card.style.setProperty("--ry", rotateY.toFixed(2) + "deg");
        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      }
      function onLeave() {
        card.classList.remove("is-tilting");
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      }
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
    });
  }

  /* ---------- Product / theme card filtering ---------- */
  var filterBar = document.querySelector(".filter-tabs");
  if (filterBar) {
    var filterBtns = filterBar.querySelectorAll(".filter-tab");
    var cards = document.querySelectorAll("[data-category]");

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");

        filterBtns.forEach(function (b) {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });

        cards.forEach(function (card) {
          var cats = (card.getAttribute("data-category") || "").split(" ");
          var show = filter === "all" || cats.indexOf(filter) !== -1;
          if (show) {
            card.classList.remove("card-hidden");
          } else {
            card.classList.add("card-hidden");
          }
        });
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var trigger = item.querySelector(".faq-q");
    if (!trigger) return;
    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      faqItems.forEach(function (other) {
        other.classList.remove("open");
        var t = other.querySelector(".faq-q");
        if (t) t.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
})();

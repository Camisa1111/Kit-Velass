(function () {
  "use strict";

  /* ─────────────────────────────────────────────
     SCROLL REVEAL — Intersection Observer
  ───────────────────────────────────────────── */
  function revealEl(el, direction, delay, duration, distance) {
    direction = direction || "up";
    delay     = delay     || 0;
    duration  = duration  || 700;
    distance  = distance  || "40px";

    function getTransform(dir, dist) {
      if (dir === "up")    return "translateY("  + dist + ")";
      if (dir === "down")  return "translateY(-" + dist + ")";
      if (dir === "left")  return "translateX("  + dist + ")";
      if (dir === "right") return "translateX(-" + dist + ")";
      return "";
    }

    var transform = getTransform(direction, distance);
    var easing    = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

    el.style.opacity    = "0";
    el.style.transform  = transform;
    el.style.willChange = "opacity, transform";

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              el.style.transition =
                "opacity " + duration + "ms " + easing + " " + delay + "ms, " +
                "transform " + duration + "ms " + easing + " " + delay + "ms";
              el.style.opacity   = "1";
              el.style.transform = "translate(0, 0)";
            }, 16);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
  }

  function setupScrollReveal() {
    /* ── Hero ── */
    var heroTitle    = document.querySelector(".hero-title");
    var heroSubtitle = document.querySelector(".hero-subtitle");
    var heroImage    = document.querySelector(".hero-image-wrapper");

    if (heroTitle)    revealEl(heroTitle,    "left",  0,   700);
    if (heroSubtitle) revealEl(heroSubtitle, "left",  150, 700);
    if (heroImage)    revealEl(heroImage,    "right", 300, 800);

    /* ── Section headers (títulos + subtítulos) ── */
    document.querySelectorAll(".section-header .section-title").forEach(function (el) {
      revealEl(el, "up", 0);
    });
    document.querySelectorAll(".section-header .section-subtitle").forEach(function (el) {
      revealEl(el, "up", 150);
    });
    document.querySelectorAll(".section-header .intro-content").forEach(function (el) {
      revealEl(el, "up", 200);
    });

    /* ── Objection cards ── */
    document.querySelectorAll(".objection-card").forEach(function (el, i) {
      revealEl(el, "up", i * 150);
    });
    var solutionBox = document.querySelector(".solution-box");
    if (solutionBox) revealEl(solutionBox, "up", 0);

    /* ── For-who cards ── */
    document.querySelectorAll(".for-who-card").forEach(function (el, i) {
      revealEl(el, "up", i * 150);
    });
    var forWhoCta = document.querySelector(".for-who-cta");
    if (forWhoCta) revealEl(forWhoCta, "up", 300);

    /* ── What-not-need items ── */
    document.querySelectorAll(".not-need-item").forEach(function (el, i) {
      revealEl(el, "up", i * 120);
    });
    var notNeedFooter = document.querySelector(".not-need-footer");
    if (notNeedFooter) revealEl(notNeedFooter, "up", 0);

    /* ── Opportunity cards (Bonuses) ── */
    document.querySelectorAll(".opportunity-card").forEach(function (el, i) {
      revealEl(el, "up", i * 150);
    });

    /* ── Timeline items (primeiros 7 dias) — fadeInLeft com stagger ── */
    document.querySelectorAll(".timeline-item").forEach(function (el, i) {
      revealEl(el, "left", i * 150);
    });
    var sevenDaysFooter = document.querySelector(".seven-days-footer");
    if (sevenDaysFooter) revealEl(sevenDaysFooter, "up", 0);

    /* ── Course content items ── */
    document.querySelectorAll(".content-item").forEach(function (el, i) {
      revealEl(el, "up", i * 100);
    });

    /* ── Certificates ── */
    var certsHeader = document.querySelector(".certificates-header");
    if (certsHeader) revealEl(certsHeader, "up", 0);
    document.querySelectorAll(".certificate-item").forEach(function (el, i) {
      revealEl(el, "up", i * 150);
    });

    /* ── Comparison table ── */
    var compTable = document.querySelector(".comparison-table-wrapper");
    if (compTable) revealEl(compTable, "up", 200, 800);
    var compFooter = document.querySelector(".comparison-footer");
    if (compFooter) revealEl(compFooter, "up", 350);

    /* ── Social proof ── */
    document.querySelectorAll(".testimonial-card").forEach(function (el, i) {
      revealEl(el, "up", i * 150);
    });
    document.querySelectorAll(".stat-item").forEach(function (el, i) {
      revealEl(el, "up", i * 120);
    });
    document.querySelectorAll(".gallery-item").forEach(function (el, i) {
      revealEl(el, "up", i * 100);
    });

    /* ── Pricing ── */
    var pricingCard = document.querySelector(".pricing-card");
    if (pricingCard) revealEl(pricingCard, "up", 350, 800);
  }

  /* ─────────────────────────────────────────────
     PROGRESSIVE BLUR — barra fixa no bottom
  ───────────────────────────────────────────── */
  function setupProgressiveBlur() {
    var blurValues = [0.25, 0.5, 1, 2, 4, 8, 16, 32];
    var maskGradients = [
      "linear-gradient(to bottom, transparent 0%, black 12.5%, black 25%, transparent 37.5%)",
      "linear-gradient(to bottom, transparent 12.5%, black 25%, black 37.5%, transparent 50%)",
      "linear-gradient(to bottom, transparent 25%, black 37.5%, black 50%, transparent 62.5%)",
      "linear-gradient(to bottom, transparent 37.5%, black 50%, black 62.5%, transparent 75%)",
      "linear-gradient(to bottom, transparent 50%, black 62.5%, black 75%, transparent 87.5%)",
      "linear-gradient(to bottom, transparent 62.5%, black 75%, black 87.5%, transparent 100%)",
      "linear-gradient(to bottom, transparent 75%, black 87.5%, black 100%)",
      "linear-gradient(to bottom, transparent 87.5%, black 100%)",
    ];

    var container = document.createElement("div");
    container.style.cssText =
      "position:fixed;bottom:0;left:0;width:100%;height:200px;z-index:999;pointer-events:none;";

    blurValues.forEach(function (blur, i) {
      var layer = document.createElement("div");
      layer.style.position         = "absolute";
      layer.style.inset            = "0";
      layer.style.backdropFilter   = "blur(" + blur + "px)";
      layer.style.webkitBackdropFilter = "blur(" + blur + "px)";
      layer.style.maskImage        = maskGradients[i];
      layer.style.webkitMaskImage  = maskGradients[i];
      container.appendChild(layer);
    });

    document.body.appendChild(container);
  }

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setupScrollReveal();
      setupProgressiveBlur();
    });
  } else {
    setupScrollReveal();
    setupProgressiveBlur();
  }
})();

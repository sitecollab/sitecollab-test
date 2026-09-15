/* Mobile nav toggle + hero parallax + consent-gated 17hats contact form embed */

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Hero parallax — drifts the background image slower than scroll speed.
  // Skipped entirely for visitors who have prefers-reduced-motion set.
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var parallaxLayers = document.querySelectorAll(".parallax-layer");
  if (!reduceMotion && parallaxLayers.length) {
    var onParallax = function () {
      var y = window.scrollY;
      parallaxLayers.forEach(function (layer) {
        var speed = parseFloat(layer.dataset.speed || "0.3");
        layer.style.transform = "translateY(" + y * speed + "px)";
      });
    };
    window.addEventListener("scroll", onParallax, { passive: true });
    onParallax();
  }

  var CONTACT_IFRAME_HTML =
    '<iframe name="lc_contact_form" frameborder="0" width="100%" height="600" ' +
    'src="https://sitecollab.17hats.com/p#/embed/AyT1u4phggwS" title="SiteCollab enquiry form"></iframe>';
  var CONTACT_IFRAME_SIZER_SRC = "https://sitecollab.17hats.com/vendor/iframeSizer.min.js";

  document.querySelectorAll("[data-consent-category]").forEach(function (embed) {
    var placeholder = embed.querySelector("[data-embed-placeholder]");
    var target = embed.querySelector("[data-embed-target]");
    var loadBtn = embed.querySelector("[data-embed-load]");

    function reveal() {
      if (target.hasChildNodes()) return; // already loaded
      target.innerHTML = CONTACT_IFRAME_HTML;
      // A <script> tag set via innerHTML never executes (per the HTML spec) —
      // it has to be created as a real element to actually run.
      var sizerScript = document.createElement("script");
      sizerScript.src = CONTACT_IFRAME_SIZER_SRC;
      target.appendChild(sizerScript);
      target.hidden = false;
      placeholder.hidden = true;
    }

    // Already consented from a previous visit?
    if (
      typeof CookieConsent !== "undefined" &&
      CookieConsent.acceptedCategory &&
      CookieConsent.acceptedCategory("analytics_marketing")
    ) {
      reveal();
    }

    document.addEventListener("sitecollab:consent", function (e) {
      if (e.detail && e.detail.analytics_marketing) reveal();
    });

    if (loadBtn) {
      loadBtn.addEventListener("click", function () {
        if (typeof CookieConsent !== "undefined") {
          CookieConsent.acceptCategory("analytics_marketing");
          CookieConsent.hide();
        }
        reveal();
      });
    }
  });
});

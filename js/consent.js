/* SiteCollab cookie consent
 * Uses vanilla-cookieconsent v3 (orestbida/cookieconsent, MIT, jsDelivr).
 * Two categories only, by design (see sitecollab-hosting-migration.md):
 *   - necessary            : always on, no toggle (nothing actually uses this yet)
 *   - analytics_marketing  : GA4 + the 17hats contact-form iframe, combined
 *     (kept as one category to start with; split later if you want finer
 *     control — GA4 and 17hats are wired to the same consent event below,
 *     so splitting them just means adding a second category id and
 *     listening for it separately in site.js).
 */

function updateGoogleConsent(granted) {
  if (typeof gtag !== "function") return;
  gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (typeof CookieConsent === "undefined") return;

  CookieConsent.run({
    guiOptions: {
      consentModal: {
        layout: "box",
        position: "bottom right",
        equalWeightButtons: true,
      },
      preferencesModal: {
        layout: "box",
      },
    },
    categories: {
      necessary: {
        readOnly: true,
        enabled: true,
      },
      analytics_marketing: {
        autoClear: {
          cookies: [{ name: /^_ga/ }, { name: "_gid" }],
        },
      },
    },
    language: {
      default: "en",
      translations: {
        en: {
          consentModal: {
            title: "We use cookies",
            description:
              "We use essential cookies to run this site, and (only with your consent) analytics and our third-party contact form embed. See our <a href=\"/privacy-policy.html\">Privacy Policy</a> for details.",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject non-essential",
            showPreferencesBtn: "Manage preferences",
          },
          preferencesModal: {
            title: "Privacy preferences",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject non-essential",
            savePreferencesBtn: "Save settings",
            closeIconLabel: "Close",
            sections: [
              {
                title: "Strictly necessary",
                description: "Required for the site to function. Always on.",
                linkedCategory: "necessary",
              },
              {
                title: "Analytics & Marketing",
                description:
                  "Google Analytics (GA4) usage tracking, and the 17hats contact-form embed (which sets its own cookies once loaded).",
                linkedCategory: "analytics_marketing",
              },
            ],
          },
        },
      },
    },
    onConsent: function (cookie) {
      var granted = CookieConsent.acceptedCategory("analytics_marketing");
      updateGoogleConsent(granted);
      document.dispatchEvent(
        new CustomEvent("sitecollab:consent", { detail: { analytics_marketing: granted } })
      );
    },
    onChange: function () {
      var granted = CookieConsent.acceptedCategory("analytics_marketing");
      updateGoogleConsent(granted);
      document.dispatchEvent(
        new CustomEvent("sitecollab:consent", { detail: { analytics_marketing: granted } })
      );
    },
  });
});

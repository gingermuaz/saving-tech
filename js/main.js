/* ==========================================================================
   Saving Tech: shared site script
   Loaded at the end of every page, before any page-specific script.
   ========================================================================== */

(function () {
    'use strict';

    // Footer copyright year
    var year = document.getElementById('year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Mobile navigation: the menu button shows and hides the nav links
    var navToggle = document.querySelector('.nav-toggle');
    var siteNav = document.getElementById('site-nav');
    if (navToggle && siteNav) {
        navToggle.addEventListener('click', function () {
            var isOpen = siteNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        });
    }

    // Newsletter sign-up forms
    // NOTE: these are not connected to a mailing-list service yet.
    document.querySelectorAll('form.newsletter-form').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Thank you for subscribing!');
            form.reset();
        });
    });

    // Article search box (not connected to a search service yet)
    document.querySelectorAll('form.search-box').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
        });
    });
})();

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

        // Escape closes the open menu and puts focus back on the menu button
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && siteNav.classList.contains('is-open')) {
                siteNav.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Open menu');
                navToggle.focus();
            }
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

    // Article search box (Data Security Articles): filters the list of
    // articles on the page as you type. Every word typed has to appear in an
    // article's title, date or summary for it to stay in the list.
    document.querySelectorAll('form.search-box').forEach(function (form) {
        var input = form.querySelector('input');
        var cards = document.querySelectorAll('.article-card');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
        });
        if (!input || !cards.length) {
            return;
        }
        var list = cards[0].parentNode;
        var status = document.createElement('p');
        status.className = 'search-status';
        status.setAttribute('role', 'status');
        list.parentNode.insertBefore(status, list);

        var filter = function () {
            var typed = input.value.trim();
            var words = typed.toLowerCase().split(/\s+/).filter(Boolean);
            var shown = 0;
            cards.forEach(function (card) {
                var text = card.textContent.toLowerCase();
                var match = words.every(function (word) {
                    return text.indexOf(word) !== -1;
                });
                card.hidden = !match;
                if (match) {
                    shown += 1;
                }
            });
            if (!words.length) {
                status.textContent = '';
            } else if (shown) {
                status.textContent = shown + (shown === 1 ? ' article' : ' articles') + ' found for \u201c' + typed + '\u201d';
            } else {
                status.textContent = 'No articles found for \u201c' + typed + '\u201d. Try a different word.';
            }
        };

        input.addEventListener('input', filter);
        // Pressing Enter or the search button also brings the results into view
        form.addEventListener('submit', function () {
            filter();
            if (status.textContent) {
                var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                status.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
            }
        });
    });

    // Share buttons ("Share this:"): LinkedIn, Microsoft Teams, WhatsApp and
    // copy link. Each button has a data-share attribute and shares the address
    // of the page it's on. When a page is opened from a local copy rather than
    // the live site, its address on savingtech.co.uk is shared instead.
    var shareButtons = document.querySelectorAll('[data-share]');
    if (shareButtons.length) {
        var onLiveSite = /^https?:$/.test(location.protocol) && !/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
        var pageFile = location.pathname.split('/').pop();
        var shareUrl = onLiveSite
            ? location.origin + location.pathname
            : 'https://savingtech.co.uk/' + (pageFile === 'index.html' ? '' : pageFile);
        var shareTitle = document.title;
        var shareLinks = {
            linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(shareUrl),
            teams: 'https://teams.microsoft.com/share?href=' + encodeURIComponent(shareUrl) +
                '&msgText=' + encodeURIComponent(shareTitle),
            whatsapp: 'https://wa.me/?text=' + encodeURIComponent(shareTitle + ' ' + shareUrl)
        };

        var toast = null;
        var toastTimer = null;
        var showToast = function (text) {
            if (!toast) {
                toast = document.createElement('div');
                toast.className = 'share-toast';
                toast.setAttribute('role', 'status');
                toast.setAttribute('aria-live', 'polite');
                document.body.appendChild(toast);
            }
            toast.textContent = text;
            toast.classList.add('is-visible');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(function () {
                toast.classList.remove('is-visible');
            }, 2500);
        };

        var copyText = function (text) {
            if (navigator.clipboard && window.isSecureContext) {
                return navigator.clipboard.writeText(text);
            }
            return new Promise(function (resolve, reject) {
                var field = document.createElement('textarea');
                field.value = text;
                field.setAttribute('readonly', '');
                field.style.position = 'fixed';
                field.style.opacity = '0';
                document.body.appendChild(field);
                field.select();
                var copied = false;
                try {
                    copied = document.execCommand('copy');
                } catch (err) {
                    copied = false;
                }
                document.body.removeChild(field);
                if (copied) {
                    resolve();
                } else {
                    reject();
                }
            });
        };

        shareButtons.forEach(function (button) {
            var kind = button.getAttribute('data-share');
            if (shareLinks[kind]) {
                button.href = shareLinks[kind];
                button.target = '_blank';
                button.rel = 'noopener';
            } else if (kind === 'copy') {
                button.addEventListener('click', function (e) {
                    e.preventDefault();
                    copyText(shareUrl).then(function () {
                        showToast('Link copied');
                    }, function () {
                        window.prompt('Copy this link:', shareUrl);
                    });
                });
            }
        });
    }
})();

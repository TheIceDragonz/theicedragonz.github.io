/**
 * TheIceDragonz - Main Interactive Controller
 */

(function () {
    'use strict';

    // Toast Notification System
    function showToast(message, icon = 'fa-check') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            if (toast && toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    // Tab Navigation
    function initTabs() {
        const tabBtns = document.querySelectorAll('.nav-tab-btn');
        const sections = document.querySelectorAll('.content-section');

        function activateTab(tabId, pushHash = true) {
            tabBtns.forEach(btn => {
                const isActive = btn.dataset.target === tabId;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            sections.forEach(sec => {
                const isActive = sec.id === tabId;
                sec.classList.toggle('active', isActive);
            });

            if (pushHash) {
                history.replaceState(null, null, `#${tabId}`);
            }
        }

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;
                if (target) activateTab(target);
            });
        });

        // Check URL hash on initial load
        const initialHash = window.location.hash.replace('#', '');
        if (initialHash && document.getElementById(initialHash)) {
            activateTab(initialHash, false);
        }
    }

    // ToS Real-time Search & Filter
    function initTosSearch() {
        const searchInput = document.getElementById('tos-search');
        const clearBtn = document.getElementById('tos-search-clear');
        const clauses = document.querySelectorAll('.tos-clause');
        const noResults = document.getElementById('tos-no-results');

        if (!searchInput) return;

        function performSearch() {
            const query = searchInput.value.toLowerCase().trim();
            if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

            let visibleCount = 0;

            clauses.forEach(clause => {
                const text = clause.textContent.toLowerCase();
                const match = !query || text.includes(query);
                clause.style.display = match ? 'block' : 'none';
                if (match) visibleCount++;
            });

            if (noResults) {
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        }

        searchInput.addEventListener('input', performSearch);

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                performSearch();
                searchInput.focus();
            });
        }
    }

    // FAQ Accordion
    function initFaq() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const questionBtn = item.querySelector('.faq-question');
            if (questionBtn) {
                questionBtn.addEventListener('click', () => {
                    const isOpen = item.classList.contains('open');
                    // Close others
                    faqItems.forEach(other => other.classList.remove('open'));
                    // Toggle current
                    if (!isOpen) {
                        item.classList.add('open');
                    }
                });
            }
        });
    }

    // Reliable Copy to Clipboard Helper with Fallback
    function copyToClipboard(text, successMessage, icon = 'fa-check') {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(successMessage, icon);
            }).catch(() => {
                fallbackCopyText(text, successMessage, icon);
            });
        } else {
            fallbackCopyText(text, successMessage, icon);
        }
    }

    function fallbackCopyText(text, successMessage, icon) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (successful) {
                showToast(successMessage, icon);
            } else {
                showToast('Unable to copy text', 'fa-triangle-exclamation');
            }
        } catch (err) {
            showToast('Unable to copy text', 'fa-triangle-exclamation');
        }
    }

    // Clipboard Copy Helpers
    function initCopyFeatures() {
        // Copy Full ToS
        const copyFullBtn = document.getElementById('btn-copy-full-tos');
        if (copyFullBtn) {
            copyFullBtn.addEventListener('click', () => {
                const tosContainer = document.getElementById('tos-content-body');
                if (tosContainer) {
                    const text = tosContainer.innerText;
                    copyToClipboard(text, 'Terms of Service copied to clipboard!', 'fa-copy');
                }
            });
        }

        // Copy Individual Clause Link
        const clauseCopyBtns = document.querySelectorAll('.clause-copy-btn');
        clauseCopyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const clauseId = btn.dataset.clause;
                if (clauseId) {
                    const url = `${window.location.origin}${window.location.pathname}#tos-${clauseId}`;
                    copyToClipboard(url, `Link to Section #${clauseId} copied!`, 'fa-link');
                }
            });
        });
    }

    // Back to Top Button
    function initBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Initialize all modules
    document.addEventListener('DOMContentLoaded', () => {
        initTabs();
        initTosSearch();
        initFaq();
        initCopyFeatures();
        initBackToTop();
    });
})();

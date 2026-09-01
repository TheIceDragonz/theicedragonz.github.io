

(function () {
    'use strict';

    
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
            btn.addEventListener('click', (e) => {
                const target = btn.dataset.target;
                if (target && document.getElementById(target)) {
                    e.preventDefault();
                    activateTab(target);
                }
            });
        });

        
        const initialHash = window.location.hash.replace('#', '');
        if (initialHash && document.getElementById(initialHash)) {
            activateTab(initialHash, false);
        }
    }

    
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

    
    function initBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 250) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    
    document.addEventListener('DOMContentLoaded', () => {
        initTabs();
        initTosSearch();
        initBackToTop();
    });
})();
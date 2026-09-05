

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

    async function fetchDiscordLiveStats() {
        const memberElem = document.getElementById('discord-member-count');
        const onlineElem = document.getElementById('discord-online-count');
        const boostElem = document.getElementById('discord-boost-tier');
        const badgeElem = document.getElementById('discord-boost-badge');
        const descElem = document.getElementById('discord-desc-count');

        if (!memberElem && !onlineElem && !boostElem) return;

        try {
            const response = await fetch('https://discord.com/api/v9/invites/yf8vG5Ddcb?with_counts=true');
            if (!response.ok) return;

            const data = await response.json();

            // Total members
            const members = data.approximate_member_count || (data.profile && data.profile.member_count);
            if (members) {
                if (memberElem) {
                    const formatted = members >= 1000 
                        ? `${(members / 1000).toFixed(1)}K+` 
                        : members.toString();
                    memberElem.textContent = formatted;
                    memberElem.title = `${members.toLocaleString()} Total Members`;
                }
                if (descElem) {
                    descElem.textContent = `${members.toLocaleString()}+`;
                }
            }

            // Online members
            const online = data.approximate_presence_count || (data.profile && data.profile.online_count);
            if (online && onlineElem) {
                onlineElem.textContent = `${online} Online`;
                onlineElem.title = `${online.toLocaleString()} Active in Discord`;
            }

            // Server Boost status
            const guild = data.guild || data.profile;
            if (guild) {
                const tier = guild.premium_tier || 0;
                const boosts = guild.premium_subscription_count || 0;

                if (boostElem && tier > 0) {
                    boostElem.textContent = `Level ${tier}`;
                    if (boosts > 0) {
                        boostElem.title = `${boosts} Server Boosts`;
                    }
                }

                if (badgeElem && tier > 0) {
                    badgeElem.innerHTML = `<i class="fa-solid fa-gem"></i> Level ${tier} Boosted`;
                }
            }

            console.log('%c[Discord Live Stats]%c Dati caricati con successo:', 'color: #5865F2; font-weight: bold;', 'color: inherit;', {
                members,
                online,
                guild: data.guild?.name
            });
        } catch (err) {
            console.warn('[Discord Live Stats] Errore chiamata API:', err);
        }
    }

    
    document.addEventListener('DOMContentLoaded', () => {
        initTabs();
        initTosSearch();
        initBackToTop();
        fetchDiscordLiveStats();
    });
})();
(function () {
    'use strict';

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function calculateTenure(dateString) {
        if (!dateString) return 'Active Booster';
        const boostDate = new Date(dateString);
        const now = new Date();
        const diffMs = now - boostDate;

        if (diffMs <= 0) return 'Recent Supporter';

        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const months = Math.floor(totalDays / 30.44);
        const years = Math.floor(months / 12);
        const remMonths = months % 12;

        if (years >= 1) {
            if (remMonths > 0) {
                return `${years} yr${years > 1 ? 's' : ''}, ${remMonths} mo${remMonths > 1 ? 's' : ''}`;
            }
            return `${years} year${years > 1 ? 's' : ''}`;
        } else if (months >= 1) {
            return `${months} month${months > 1 ? 's' : ''}`;
        } else {
            return totalDays <= 1 ? 'Today' : `${totalDays} days`;
        }
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    }

    function renderBoosters(boosters) {
        const grid = document.getElementById('boosters-grid');
        const countElem = document.getElementById('boosters-count');
        const levelElem = document.getElementById('boosters-level');

        if (!grid) return;

        if (countElem) {
            countElem.textContent = boosters.length;
        }

        if (levelElem) {
            let level = 'Level 1';
            if (boosters.length >= 14) level = 'Level 3 Max';
            else if (boosters.length >= 7) level = 'Level 2';
            levelElem.textContent = level;
        }

        const sorted = [...boosters].sort((a, b) => {
            const dateA = new Date(a.boostSince || 0);
            const dateB = new Date(b.boostSince || 0);
            return dateA - dateB;
        });

        grid.innerHTML = sorted.map((booster) => {
            const tenure = calculateTenure(booster.boostSince);
            const formattedDate = formatDate(booster.boostSince);
            const username = escapeHtml(booster.username);
            const avatarUrl = escapeHtml(booster.imageUrl);

            return `
                <div class="booster-card">
                    <div class="booster-avatar-wrap">
                        <img src="${avatarUrl}" 
                             alt="${username}" 
                             class="booster-avatar" 
                             loading="lazy" 
                             onerror="this.onerror=null; this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                        <div class="booster-badge-icon" title="Discord Nitro Booster">
                            <i class="fa-solid fa-gem"></i>
                        </div>
                    </div>
                    <div class="booster-info">
                        <div class="booster-name" title="${username}">${username}</div>
                        <div>
                            <span class="booster-tenure">
                                <i class="fa-solid fa-bolt"></i> ${tenure}
                            </span>
                        </div>
                        <div class="booster-date">
                            Boosting since ${formattedDate}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    async function loadBoosters() {
        const pathsToTry = ['DiscordNitro/Boosters.json', '../DiscordNitro/Boosters.json', '/DiscordNitro/Boosters.json'];
        for (let path of pathsToTry) {
            try {
                const response = await fetch(path, { cache: 'no-cache' });
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        renderBoosters(data);
                        return;
                    }
                }
            } catch (err) {}
        }
    }

    document.addEventListener('DOMContentLoaded', loadBoosters);
})();
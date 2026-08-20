/**
 * TheIceDragonz - Discord Nitro Boosters Showcase Loader
 */

(function () {
    'use strict';

    // Fallback embedded booster data (ensures flawless render even if opened via file://)
    const FALLBACK_BOOSTERS = [
        {
            username: "༒𖦏ʝɛʄʄɛʀֆօռ𖦏༒",
            imageUrl: "https://cdn.discordapp.com/avatars/1265025653309182103/df2487ff760006d906e280c3248b5b70.webp",
            boostSince: "2026-08-20T04:41:10.661Z"
        },
        {
            username: "Akatsuki",
            imageUrl: "https://cdn.discordapp.com/avatars/442558257345724439/6424f29aeaaee370a896c32aa17baec2.webp",
            boostSince: "2024-12-15T17:48:35.254Z"
        },
        {
            username: "AriseCerberus",
            imageUrl: "https://cdn.discordapp.com/avatars/476505675439144975/1da2bc9597c546b8826ff14e650db7b9.webp",
            boostSince: "2024-12-14T05:20:49.397Z"
        },
        {
            username: "AV-UNIT ™",
            imageUrl: "https://cdn.discordapp.com/avatars/460171317417738263/a_095d166267bd73febc3c3be8d22222e8.gif",
            boostSince: "2026-08-14T20:37:26.751Z"
        },
        {
            username: "Bob_La_Beast",
            imageUrl: "https://cdn.discordapp.com/avatars/501128192124256276/d6f9387afdb6b71c7da0b1963e1aae46.webp",
            boostSince: "2024-12-18T03:02:27.179Z"
        },
        {
            username: "̶I̶̶c̶̶e̶_̶T̶̶r̶̶e̶_̶0̶̶7̶",
            imageUrl: "https://cdn.discordapp.com/avatars/550319842280996875/c666601e1b8ffc9a53a079fa0b587e7c.webp",
            boostSince: "2025-12-04T20:42:43.174Z"
        },
        {
            username: "Lïl RêÐ",
            imageUrl: "https://cdn.discordapp.com/avatars/721825780916682832/975a45641f63c322d1e879554f6a877c.webp",
            boostSince: "2023-10-24T16:19:40.988Z"
        },
        {
            username: "NoobgamersArmy",
            imageUrl: "https://cdn.discordapp.com/avatars/479741828162387978/769069e0678666dd39aa6dc4b005c83d.webp",
            boostSince: "2025-12-30T16:18:46.982Z"
        },
        {
            username: "NPCFanatic",
            imageUrl: "https://cdn.discordapp.com/avatars/203748960089669632/1862b30e665da4415f1c692a63a9516d.webp",
            boostSince: "2024-12-13T21:38:56.606Z"
        },
        {
            username: "TheIceDragonz",
            imageUrl: "https://cdn.discordapp.com/avatars/332565653900754945/d02e0cd1723d6c6584d88d93df6b4326.webp",
            boostSince: "2026-04-13T17:34:20.059Z"
        }
    ];

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
            // Discord Level calculation (Level 1: 2, Level 2: 7, Level 3: 14)
            let level = 'Level 1';
            if (boosters.length >= 14) level = 'Level 3 Max';
            else if (boosters.length >= 7) level = 'Level 2';
            levelElem.textContent = level;
        }

        // Sort by boost date (longest supporters first)
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
            } catch (err) {
                // Try next path
            }
        }
        // Render fallback if fetch fails or running locally on file://
        console.info('Loaded booster fallback data');
        renderBoosters(FALLBACK_BOOSTERS);
    }

    document.addEventListener('DOMContentLoaded', loadBoosters);
})();

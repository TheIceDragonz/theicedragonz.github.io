

document.addEventListener('DOMContentLoaded', () => {
    initAvatarModals();
    initAvatarSliders();
    fetchVRChatWorldStats();
});

async function fetchVRChatWorldStats() {
    const favElem = document.getElementById('vrchat-world-favorites');
    const visitsElem = document.getElementById('vrchat-world-visits');
    const capElem = document.getElementById('vrchat-world-capacity');
    const imgElem = document.getElementById('vrchat-world-img');

    if (!favElem && !visitsElem && !capElem) return;

    let data = null;

    // 1. Prova a caricare il file JSON locale generato/aggiornato dalla GitHub Action
    const pathsToTry = [
        '/VRChat/World.json',
        '../VRChat/World.json',
        'VRChat/World.json',
        '/vrchat-world.json'
    ];
    for (let path of pathsToTry) {
        try {
            const response = await fetch(path, { cache: 'no-cache' });
            if (response.ok) {
                const json = await response.json();
                if (json && json.favorites !== undefined) {
                    data = json;
                    break;
                }
            }
        } catch (e) {}
    }

    // 2. Fallback: chiamata API diretta
    if (!data) {
        try {
            const response = await fetch('https://api.vrchat.cloud/api/1/worlds/wrld_3c78d22f-e1d7-471c-a2b4-de208249f473');
            if (response.ok) {
                data = await response.json();
            }
        } catch (e) {}
    }

    if (!data) return;

    // Favorites
    if (data.favorites !== undefined && favElem) {
        const fav = data.favorites;
        favElem.textContent = fav >= 1000 ? `${(fav / 1000).toFixed(1)}K+` : fav.toString();
        favElem.title = `${fav.toLocaleString()} Favorites`;
    }

    // Visits
    if (data.visits !== undefined && visitsElem) {
        const visits = data.visits;
        visitsElem.textContent = visits >= 1000 ? `${(visits / 1000).toFixed(1)}K+` : visits.toString();
        visitsElem.title = `${visits.toLocaleString()} Total Visits`;
    }

    // Capacity
    if (data.capacity !== undefined && capElem) {
        capElem.textContent = `${data.capacity} Slots`;
    }

    // Image
    if (data.imageUrl && imgElem) {
        imgElem.src = data.imageUrl;
    }

    console.log('%c[VRChat World Stats]%c Dati caricati con successo:', 'color: #06b6d4; font-weight: bold;', 'color: inherit;', {
        favorites: data.favorites,
        visits: data.visits,
        capacity: data.capacity
    });
}

function initAvatarModals() {
    const triggers = document.querySelectorAll('[data-avatar-modal]');
    const modals = document.querySelectorAll('.avatar-detail-modal');

    function openModal(modalId) {
        const targetModal = document.getElementById(modalId);
        if (!targetModal) return;

        targetModal.classList.add('active');
        targetModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        
        window.dispatchEvent(new Event('resize'));
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        
        modal.querySelectorAll('iframe').forEach(iframe => {
            if (iframe.src) {
                const src = iframe.src;
                iframe.src = '';
                iframe.src = src;
            }
        });
    }

    
    triggers.forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-avatar-modal');
            if (modalId) openModal(modalId);
        });

        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const modalId = card.getAttribute('data-avatar-modal');
                if (modalId) openModal(modalId);
            }
        });
    });

    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.avatar-modal-close');
        const backdrop = modal.querySelector('.avatar-modal-backdrop');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal));
        }

        if (backdrop) {
            backdrop.addEventListener('click', () => closeModal(modal));
        }
    });

    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.avatar-detail-modal.active');
            if (activeModal) closeModal(activeModal);
        }
    });
}

function initAvatarSliders() {
    const modals = document.querySelectorAll('.avatar-detail-modal');

    modals.forEach(modal => {
        const slider = modal.querySelector('.avatar-media-slider');
        if (!slider) return;

        const track = slider.querySelector('.slider-track');
        const slides = slider.querySelectorAll('.slide-item');
        const prevBtn = slider.querySelector('.slider-arrow.prev');
        const nextBtn = slider.querySelector('.slider-arrow.next');
        const navPills = modal.querySelectorAll('.slider-nav-pill');
        const counter = slider.querySelector('.slider-counter');

        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        const totalSlides = slides.length;

        function updateSlider(index) {
            
            const prevSlide = slides[currentIndex];
            if (prevSlide && prevSlide.classList.contains('video-slide')) {
                const iframe = prevSlide.querySelector('iframe');
                if (iframe && iframe.src) {
                    const currentSrc = iframe.src;
                    iframe.src = '';
                    iframe.src = currentSrc;
                }
            }

            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentIndex = index;

            
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            
            navPills.forEach((pill, idx) => {
                pill.classList.toggle('active', idx === currentIndex);
            });

            
            if (counter) {
                counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
            }
        }

        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                updateSlider(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                updateSlider(currentIndex + 1);
            });
        }

        
        navPills.forEach((pill, idx) => {
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                updateSlider(idx);
            });
        });

        
        let startX = 0;
        let endX = 0;

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) {
                    updateSlider(currentIndex + 1);
                } else {
                    updateSlider(currentIndex - 1);
                }
            }
        }, { passive: true });

        
        updateSlider(0);
    });
}
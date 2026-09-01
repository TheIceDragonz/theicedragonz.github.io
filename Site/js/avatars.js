

document.addEventListener('DOMContentLoaded', () => {
    initAvatarModals();
    initAvatarSliders();
});

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
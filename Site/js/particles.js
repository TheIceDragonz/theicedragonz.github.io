

(function () {
    'use strict';

    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    
    const snowflakeCount = 18;
    const snowflakes = [];

    
    const STORAGE_KEY = 'theicedragonz_snowflakes_caught';
    let caughtCount = parseInt(localStorage.getItem(STORAGE_KEY), 10) || 0;
    let cursorTimer = null;

    
    const spriteSize = 48;
    const halfSprite = spriteSize / 2;
    const spriteCanvases = [];
    const colors = [
        'rgba(56, 189, 248, 0.85)',   
        'rgba(192, 132, 252, 0.85)',  
        'rgba(240, 249, 255, 0.9)'    
    ];

    colors.forEach(col => {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = spriteSize;
        offCanvas.height = spriteSize;
        const offCtx = offCanvas.getContext('2d');

        offCtx.translate(halfSprite, halfSprite);
        offCtx.strokeStyle = col;
        offCtx.fillStyle = col;
        offCtx.lineWidth = 1.6;
        offCtx.lineCap = 'round';

        const armRadius = 14;
        const arms = 6;
        for (let i = 0; i < arms; i++) {
            offCtx.beginPath();
            offCtx.moveTo(0, 0);
            offCtx.lineTo(0, armRadius);
            offCtx.stroke();

            
            const b1 = armRadius * 0.55;
            const b1Len = armRadius * 0.35;
            offCtx.beginPath();
            offCtx.moveTo(0, b1);
            offCtx.lineTo(-b1Len * 0.7, b1 + b1Len * 0.6);
            offCtx.moveTo(0, b1);
            offCtx.lineTo(b1Len * 0.7, b1 + b1Len * 0.6);
            offCtx.stroke();

            
            const b2 = armRadius * 0.82;
            const b2Len = armRadius * 0.22;
            offCtx.beginPath();
            offCtx.moveTo(0, b2);
            offCtx.lineTo(-b2Len * 0.7, b2 + b2Len * 0.6);
            offCtx.moveTo(0, b2);
            offCtx.lineTo(b2Len * 0.7, b2 + b2Len * 0.6);
            offCtx.stroke();

            offCtx.rotate((Math.PI * 2) / arms);
        }

        
        offCtx.beginPath();
        offCtx.arc(0, 0, 2, 0, Math.PI * 2);
        offCtx.fill();

        spriteCanvases.push(offCanvas);
    });

    function isMobileOrTouch() {
        return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    }

    function updateWidgetDisplay() {
        if (isMobileOrTouch()) return;

        const targetNumberEl = document.getElementById('particle-caught-count');
        const targetWidgetEl = document.getElementById('particle-counter-widget');
        if (targetNumberEl && caughtCount > 0) {
            targetNumberEl.textContent = caughtCount;
        }
        if (targetWidgetEl && caughtCount > 0) {
            targetWidgetEl.classList.add('visible');
        }
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', updateWidgetDisplay);
    } else {
        updateWidgetDisplay();
    }
    setTimeout(updateWidgetDisplay, 50);

    function triggerPusheenRiceCursor() {
        if (isMobileOrTouch()) return;
        document.body.classList.add('cursor-eating-rice');
        if (cursorTimer) clearTimeout(cursorTimer);
        cursorTimer = setTimeout(() => {
            document.body.classList.remove('cursor-eating-rice');
            cursorTimer = null;
        }, 500);
    }

    function incrementCounter() {
        if (isMobileOrTouch()) return;

        caughtCount++;
        try {
            localStorage.setItem(STORAGE_KEY, caughtCount.toString());
        } catch (e) {
            
        }

        const targetNumberEl = document.getElementById('particle-caught-count');
        const targetWidgetEl = document.getElementById('particle-counter-widget');
        if (targetNumberEl) {
            targetNumberEl.textContent = caughtCount;
        }
        if (targetWidgetEl) {
            if (!targetWidgetEl.classList.contains('visible')) {
                targetWidgetEl.classList.add('visible');
            }
            targetWidgetEl.classList.remove('pop-effect');
            void targetWidgetEl.offsetWidth; 
            targetWidgetEl.classList.add('pop-effect');
        }
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    
    window.addEventListener('click', (e) => {
        if (isMobileOrTouch()) return;

        const clickX = e.clientX;
        const clickY = e.clientY;
        let hit = false;

        for (let i = 0; i < snowflakes.length; i++) {
            const flake = snowflakes[i];
            const dx = flake.x - clickX;
            const dy = flake.y - clickY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            
            const hitRadius = Math.max(flake.scale * 20, 32);
            if (dist < hitRadius && !flake.popping) {
                flake.burst();
                hit = true;
            }
        }

        if (hit) {
            incrementCounter();
            triggerPusheenRiceCursor();
        }
    });

    class Snowflake {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : -30;
            this.scale = Math.random() * 0.45 + 0.65; 
            this.speedY = Math.random() * 0.45 + 0.25;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.012;
            this.opacity = Math.random() * 0.35 + 0.55;
            this.spriteIndex = Math.floor(Math.random() * spriteCanvases.length);
            this.popping = false;
            this.popScale = 1;
            this.popOpacity = 1;
        }

        burst() {
            this.popping = true;
            this.popScale = 1;
            this.popOpacity = 1;
        }

        update() {
            if (this.popping) {
                this.popScale += 0.15;
                this.popOpacity -= 0.08;
                if (this.popOpacity <= 0) {
                    this.popping = false;
                    this.reset();
                }
                return;
            }

            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotSpeed;

            if (this.y > height + 35 || this.x < -35 || this.x > width + 35) {
                this.reset();
            }
        }

        draw() {
            const currentScale = this.popping ? this.scale * this.popScale : this.scale;
            const currentOpacity = this.popping 
                ? Math.max(0, this.popOpacity) 
                : this.opacity;

            const sprite = spriteCanvases[this.spriteIndex];
            const drawDim = spriteSize * currentScale;

            ctx.save();
            ctx.globalAlpha = currentOpacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(sprite, -drawDim / 2, -drawDim / 2, drawDim, drawDim);
            ctx.restore();
        }
    }

    for (let i = 0; i < snowflakeCount; i++) {
        snowflakes.push(new Snowflake());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < snowflakes.length; i++) {
            snowflakes[i].update();
            snowflakes[i].draw();
        }

        requestAnimationFrame(animate);
    }

    animate();
})();
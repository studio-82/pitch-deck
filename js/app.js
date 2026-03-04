(function () {
    var slides = document.querySelectorAll('.slide');
    var dots = document.getElementById('dots');
    var progress = document.getElementById('progress');
    var counter = document.getElementById('counter');
    var arrowL = document.getElementById('arrowL');
    var arrowR = document.getElementById('arrowR');

    var current = 0;
    var total = slides.length;
    var transitioning = false;

    // Build dot navigation
    for (var i = 0; i < total; i++) {
        var btn = document.createElement('button');
        btn.className = 'dot-btn' + (i === 0 ? ' on' : '');
        btn.setAttribute('data-i', i);
        btn.setAttribute('aria-label', 'Slide ' + (i + 1));
        dots.appendChild(btn);
    }

    var dotBtns = dots.querySelectorAll('.dot-btn');

    function goTo(n) {
        if (n === current || n < 0 || n >= total || transitioning) return;
        transitioning = true;
        slides[current].classList.remove('active');
        current = n;
        slides[current].classList.add('active');
        updateChrome();
        setTimeout(function () { transitioning = false; }, 600);
    }

    function updateChrome() {
        for (var i = 0; i < dotBtns.length; i++) {
            dotBtns[i].classList.toggle('on', i === current);
        }
        var pct = total > 1 ? (current / (total - 1)) * 100 : 0;
        progress.style.width = pct + '%';
        counter.innerHTML = '<span>' + (current + 1) + '</span> / <span>' + total + '</span>';
    }

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault(); goTo(current + 1); break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault(); goTo(current - 1); break;
            case ' ':
                e.preventDefault(); goTo(current + 1); break;
            case 'Home':
                e.preventDefault(); goTo(0); break;
            case 'End':
                e.preventDefault(); goTo(total - 1); break;
        }
    });

    // Arrow click
    arrowL.addEventListener('click', function () { goTo(current - 1); });
    arrowR.addEventListener('click', function () { goTo(current + 1); });

    // Dot click
    dots.addEventListener('click', function (e) {
        var btn = e.target.closest('.dot-btn');
        if (btn) goTo(parseInt(btn.getAttribute('data-i'), 10));
    });

    // Touch swipe
    var touchX = 0;
    document.addEventListener('touchstart', function (e) {
        touchX = e.changedTouches[0].screenX;
    });
    document.addEventListener('touchend', function (e) {
        var dx = touchX - e.changedTouches[0].screenX;
        if (dx > 50) goTo(current + 1);
        if (dx < -50) goTo(current - 1);
    });

    // Mouse wheel (debounced)
    var wheelTimer = null;
    document.addEventListener('wheel', function (e) {
        if (wheelTimer) return;
        wheelTimer = setTimeout(function () { wheelTimer = null; }, 900);
        if (e.deltaY > 30) goTo(current + 1);
        if (e.deltaY < -30) goTo(current - 1);
    }, { passive: true });

    // ---- Collapsible prompts ----
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.prompt-collapse__btn');
        if (btn) {
            var parent = btn.closest('.prompt-collapse');
            parent.classList.toggle('open');
        }
    });

    // ---- Action buttons (See Result / Reveal Output) ----
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.action-btn');
        if (btn) {
            var target = btn.getAttribute('data-goto');
            if (target === 'next') {
                goTo(current + 1);
            } else {
                goTo(parseInt(target, 10));
            }
        }
    });

    // ---- Example links (clickable) ----
    document.addEventListener('click', function (e) {
        var item = e.target.closest('.ex-item');
        if (item && item.getAttribute('data-goto')) {
            goTo(parseInt(item.getAttribute('data-goto'), 10));
        }
    });

    // Init
    updateChrome();
})();

// Fit-to-screen board with two-finger pan + pinch zoom (pointer events, transform, rAF).
// One finger keeps tapping tiles; a second finger turns the touch into a view gesture.
window.BoardZoom = (function () {
    "use strict";
    var MAX_SCALE = 3;
    var current = null;
    var css = '.bz-view{position:relative;overflow:hidden;touch-action:none;max-width:100%;margin:0 auto}' +
        '.bz-board{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform}' +
        '.bz-board table{margin:0}' +
        '.bz-controls{position:absolute;right:6px;top:6px;z-index:5;display:flex;gap:6px}' +
        '.bz-btn{min-width:44px;height:44px;padding:0 10px;border-radius:22px;border:1px solid rgba(0,0,0,.25);' +
        'background:rgba(255,255,255,.92);color:#222;font:600 18px/1 Helvetica,Arial,sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.25)}' +
        '.bz-view:not(.bz-zoomed) [data-bz=out],.bz-view:not(.bz-zoomed) [data-bz=fit]{display:none}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    function Zoom(board) {
        var z = this;
        z.board = board;
        z.board.classList.add('bz-board');
        z.view = document.createElement('div');
        z.view.className = 'bz-view';
        board.parentNode.insertBefore(z.view, board);
        z.view.appendChild(board);
        z.view.insertAdjacentHTML('beforeend',
            '<div class="bz-controls">' +
            '<button type="button" class="bz-btn" data-bz="in" aria-label="Zoom in">+</button>' +
            '<button type="button" class="bz-btn" data-bz="out" aria-label="Zoom out">&minus;</button>' +
            '<button type="button" class="bz-btn" data-bz="fit" aria-label="Fit board to screen">Fit</button>' +
            '</div>');
        z.pointers = {};
        z.s = 1; z.x = 0; z.y = 0; z.fit = 1;
        z.gesture = null;
        z.frame = 0;

        z.onDown = function (e) {
            if (e.pointerType === 'mouse' || e.target.closest('.bz-controls')) return;
            z.pointers[e.pointerId] = {x: e.clientX, y: e.clientY};
            var ids = Object.keys(z.pointers);
            if (ids.length === 2) {
                z.startGesture();
                if (APP.game && typeof APP.game.unselectAll === 'function') {
                    try { APP.game.unselectAll(); } catch (err) {}
                }
            }
        };
        z.onMove = function (e) {
            if (!z.pointers[e.pointerId]) return;
            z.pointers[e.pointerId] = {x: e.clientX, y: e.clientY};
            if (z.gesture && Object.keys(z.pointers).length >= 2) {
                e.preventDefault();
                z.updateGesture();
            }
        };
        z.onUp = function (e) {
            if (!z.pointers[e.pointerId]) return;
            delete z.pointers[e.pointerId];
            var n = Object.keys(z.pointers).length;
            if (n < 2) z.gesture = null;
        };
        // Stop the second finger (and anything during a gesture) from reaching tile handlers.
        z.onTouchCapture = function (e) {
            if (e.touches.length > 1 || z.gesture) {
                e.stopPropagation();
                if (e.cancelable) e.preventDefault();
            }
        };
        z.onWheel = function (e) {
            if (!e.ctrlKey && !e.metaKey) return;
            e.preventDefault();
            var r = z.view.getBoundingClientRect();
            z.zoomAt(z.s * Math.exp(-e.deltaY * 0.01), e.clientX - r.left, e.clientY - r.top);
        };
        z.onClick = function (e) {
            var b = e.target.closest('[data-bz]');
            if (!b) return;
            e.preventDefault();
            var r = z.view.getBoundingClientRect();
            var act = b.getAttribute('data-bz');
            if (act === 'fit') z.reset();
            else z.zoomAt(z.s * (act === 'in' ? 1.5 : 1 / 1.5), r.width / 2, r.height / 2);
        };

        z.view.addEventListener('pointerdown', z.onDown, true);
        z.view.addEventListener('pointermove', z.onMove, true);
        z.view.addEventListener('pointerup', z.onUp, true);
        z.view.addEventListener('pointercancel', z.onUp, true);
        z.view.addEventListener('touchstart', z.onTouchCapture, {capture: true, passive: false});
        z.view.addEventListener('touchmove', z.onTouchCapture, {capture: true, passive: false});
        z.view.addEventListener('wheel', z.onWheel, {passive: false});
        z.view.addEventListener('click', z.onClick);
        z.settle(0);
    }

    Zoom.prototype.settle = function (tries) {
        var z = this;
        requestAnimationFrame(function () {
            if (z.naturalSize().w || tries > 30) z.reset();
            else z.settle(tries + 1);
        });
    };

    Zoom.prototype.naturalSize = function () {
        var t = this.board.querySelector('table') || this.board;
        return {w: t.offsetWidth, h: t.offsetHeight};
    };
    Zoom.prototype.reset = function () {
        var n = this.naturalSize();
        var avail = this.view.parentNode.clientWidth || window.innerWidth;
        this.fit = n.w ? Math.min(1, avail / n.w) : 1;
        this.natural = n;
        this.view.style.height = Math.ceil(n.h * this.fit) + 'px';
        this.s = this.fit; this.x = 0; this.y = 0;
        this.clamp();
        this.schedule();
    };
    Zoom.prototype.clamp = function () {
        var vw = this.view.clientWidth, vh = this.view.clientHeight;
        var w = this.natural.w * this.s, h = this.natural.h * this.s;
        this.x = w <= vw ? (vw - w) / 2 : Math.min(0, Math.max(vw - w, this.x));
        this.y = h <= vh ? (vh - h) / 2 : Math.min(0, Math.max(vh - h, this.y));
    };
    Zoom.prototype.zoomAt = function (s, px, py) {
        s = Math.max(this.fit, Math.min(MAX_SCALE, s));
        this.x = px - (px - this.x) * (s / this.s);
        this.y = py - (py - this.y) * (s / this.s);
        this.s = s;
        this.clamp();
        this.schedule();
    };
    Zoom.prototype.points = function () {
        var p = this.pointers, ids = Object.keys(p).slice(0, 2);
        var a = p[ids[0]], b = p[ids[1]], r = this.view.getBoundingClientRect();
        return {
            mx: (a.x + b.x) / 2 - r.left, my: (a.y + b.y) / 2 - r.top,
            d: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y))
        };
    };
    Zoom.prototype.startGesture = function () {
        var p = this.points();
        this.gesture = {mx: p.mx, my: p.my, d: p.d, s: this.s, x: this.x, y: this.y};
    };
    Zoom.prototype.updateGesture = function () {
        var g = this.gesture, p = this.points();
        var s = Math.max(this.fit, Math.min(MAX_SCALE, g.s * p.d / g.d));
        // keep the board point under the initial midpoint under the current midpoint
        this.x = p.mx - (g.mx - g.x) * (s / g.s);
        this.y = p.my - (g.my - g.y) * (s / g.s);
        this.s = s;
        this.clamp();
        this.schedule();
    };
    Zoom.prototype.schedule = function () {
        var z = this;
        if (z.frame) return;
        z.frame = requestAnimationFrame(function () {
            z.frame = 0;
            z.board.style.transform = 'translate3d(' + z.x + 'px,' + z.y + 'px,0) scale(' + z.s + ')';
            z.view.classList.toggle('bz-zoomed', z.s > z.fit + 0.001);
        });
    };

    var resizeTimer = 0;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (current && document.body.contains(current.view)) current.reset();
        }, 150);
    });

    return {
        attach: function (board) {
            board = board && board.jquery ? board[0] : board;
            if (!board || board.classList.contains('bz-board')) return null;
            current = new Zoom(board);
            return current;
        },
        current: function () { return current; }
    };
})();

// DragDropTouch Polyfill
// A simplified version to enable drag and drop on touch devices
(function() {
    'use strict';
    
    if (typeof document === 'undefined' || !('ontouchstart' in document.documentElement)) {
        return;
    }

    var DragDropTouch = (function () {
        function DragDropTouch() {
            this._lastClick = 0;
            this._THRESHOLD = 5;
            this._OPACITY = 0.5;
            this._DBLCLICK = 500;
            this._CTXMENU = 900;
            
            document.addEventListener('touchstart', this._touchstart.bind(this));
            document.addEventListener('touchmove', this._touchmove.bind(this));
            document.addEventListener('touchend', this._touchend.bind(this));
            document.addEventListener('touchcancel', this._touchend.bind(this));
        }

        DragDropTouch.prototype._touchstart = function (e) {
            if (this._shouldHandle(e)) {
                if (Date.now() - this._lastClick < this._DBLCLICK) {
                    if (this._dispatchEvent(e, 'dblclick', e.target)) {
                        e.preventDefault();
                        this._reset();
                        return;
                    }
                }
                this._reset();
                var src = this._closestDraggable(e.target);
                if (src) {
                    if (this._dispatchEvent(e, 'mousemove', e.target) || this._dispatchEvent(e, 'mousedown', e.target)) {
                        this._dragSource = src;
                        this._ptDown = this._getPoint(e);
                        this._lastClick = Date.now();
                        e.preventDefault();
                    }
                }
            }
        };

        DragDropTouch.prototype._touchmove = function (e) {
            if (this._shouldHandle(e)) {
                var s = this._closestDraggable(e.target);
                if (this._dragSource && !this._img) {
                    var delta = this._getDelta(e);
                    if (delta > this._THRESHOLD) {
                        this._dispatchEvent(e, 'dragstart', this._dragSource);
                        this._createImage(e);
                        this._dispatchEvent(e, 'dragenter', this._getElementAt(e));
                    }
                }
                if (this._img) {
                    this._moveImage(e);
                    this._dispatchEvent(e, 'dragover', this._getElementAt(e));
                }
            }
        };

        DragDropTouch.prototype._touchend = function (e) {
            if (this._shouldHandle(e)) {
                if (this._img) {
                    this._dispatchEvent(e, 'drop', this._getElementAt(e));
                    this._dispatchEvent(e, 'dragend', this._dragSource);
                }
                this._reset();
            }
        };

        DragDropTouch.prototype._shouldHandle = function (e) {
            return e && !e.defaultPrevented && e.touches && e.touches.length < 2;
        };

        DragDropTouch.prototype._reset = function () {
            if (this._img) {
                this._img.parentElement.removeChild(this._img);
            }
            this._dragSource = null;
            this._img = null;
        };

        DragDropTouch.prototype._getPoint = function (e, page) {
            if (e && e.touches && e.touches.length) {
                return { x: page ? e.touches[0].pageX : e.touches[0].clientX, y: page ? e.touches[0].pageY : e.touches[0].clientY };
            }
            return { x: 0, y: 0 };
        };

        DragDropTouch.prototype._getDelta = function (e) {
            var p = this._getPoint(e);
            return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y);
        };

        DragDropTouch.prototype._getElementAt = function (e) {
            var p = this._getPoint(e);
            return document.elementFromPoint(p.x, p.y);
        };

        DragDropTouch.prototype._closestDraggable = function (e) {
            for (; e; e = e.parentElement) {
                if (e.draggable) return e;
            }
            return null;
        };

        DragDropTouch.prototype._dispatchEvent = function (e, type, target) {
            if (e && target) {
                var evt = document.createEvent('Event');
                evt.initEvent(type, true, true);
                target.dispatchEvent(evt);
                return evt.defaultPrevented;
            }
            return false;
        };

        DragDropTouch.prototype._createImage = function (e) {
            if (this._img) this._img.parentElement.removeChild(this._img);
            this._img = this._dragSource.cloneNode(true);
            this._img.style.position = 'fixed';
            this._img.style.pointerEvents = 'none';
            this._img.style.zIndex = '999';
            this._img.style.opacity = this._OPACITY.toString();
            document.body.appendChild(this._img);
            this._moveImage(e);
        };

        DragDropTouch.prototype._moveImage = function (e) {
            var p = this._getPoint(e);
            this._img.style.left = p.x + 'px';
            this._img.style.top = p.y + 'px';
        };

        return DragDropTouch;
    }());

    new DragDropTouch();
})();

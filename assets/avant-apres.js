/* Curseurs avant / après des chantiers (accueil et page Nos chantiers) */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.ba').forEach(function (el, idx) {
    var range = el.querySelector('.ba-range'), used = false, down = null, moved = false;
    var tagL = el.querySelector('.ba-tag-l'), tagR = el.querySelector('.ba-tag-r');
    function set(v) {
      v = Math.max(0, Math.min(100, v));
      el.style.setProperty('--pos', v + '%');
      if (range) range.value = Math.round(v);
      var x = v / 100 * el.clientWidth;
      if (tagL) el.classList.toggle('hide-l', x < tagL.offsetLeft + tagL.offsetWidth + 6);
      if (tagR) el.classList.toggle('hide-r', x > tagR.offsetLeft - 6);
    }
    function fromEvent(e) { var b = el.getBoundingClientRect(); return (e.clientX - b.left) / b.width * 100; }
    el.addEventListener('pointerdown', function (e) {
      used = true; down = e; moved = false;
      if (e.pointerType === 'mouse') { el.setPointerCapture(e.pointerId); el.classList.add('is-dragging'); set(fromEvent(e)); }
    });
    el.addEventListener('pointermove', function (e) {
      if (!down) return;
      /* au doigt : on ne déplace le curseur qu'après un vrai geste horizontal, pour laisser défiler la page */
      if (e.pointerType !== 'mouse' && !moved) {
        if (Math.abs(e.clientX - down.clientX) < 6) return;
        moved = true; try { el.setPointerCapture(e.pointerId); } catch (_) {}
        el.classList.add('is-dragging');
      }
      set(fromEvent(e));
    });
    function end(e) {
      if (down && e.type === 'pointerup' && e.pointerType !== 'mouse' && !moved) set(fromEvent(e));
      down = null; el.classList.remove('is-dragging');
    }
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    if (range) range.addEventListener('input', function () { used = true; set(+range.value); });

    /* petite animation d'invitation, une seule fois, quand la carte est bien visible */
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.disconnect();
        setTimeout(function () {
          if (used) return;
          var t0 = null, dur = 1400;
          (function step(t) {
            if (used) return;
            if (!t0) t0 = t;
            var p = Math.min(1, (t - t0) / dur);
            set(50 + Math.sin(p * Math.PI * 2) * 18 * (1 - p * 0.35) * (p < 1 ? 1 : 0));
            if (p < 1) requestAnimationFrame(step); else set(50);
          })(performance.now());
        }, 300 + (idx % 4) * 250);
      });
    }, { threshold: 0.6 });
    io.observe(el);
  });
})();

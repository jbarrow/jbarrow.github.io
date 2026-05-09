/* site.js — tiny site-wide behaviours.
 *
 * 1. Asides: <details class="margin-note"> sit in the right margin on wide
 *    screens (always expanded) and collapse to a tappable footnote-style
 *    marker on phones. Browsers control <details> open state via JS only,
 *    so we set it based on a media query and keep it in sync on resize.
 *
 * 2. Code-block copy buttons: a small "copy" affordance on every fenced
 *    code block. Hidden by default, fades in on hover (always visible on
 *    touch devices via CSS).
 */
(function () {
  'use strict';

  // -- Asides --------------------------------------------------------------

  const NARROW = '(max-width: 720px)';
  const mq = window.matchMedia(NARROW);

  function syncAsides() {
    const wide = !mq.matches;
    document.querySelectorAll('details.margin-note').forEach(d => {
      d.open = wide;
    });
  }

  // -- Copy buttons --------------------------------------------------------

  function attachCopyButtons() {
    document.querySelectorAll('.codehilite').forEach(block => {
      if (block.querySelector('.code-copy')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy';
      btn.textContent = 'copy';
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      btn.addEventListener('click', () => {
        const code = block.querySelector('code') || block.querySelector('pre') || block;
        const text = code.innerText.replace(/\n$/, '');
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = 'copied';
          btn.classList.add('is-copied');
          setTimeout(() => {
            btn.textContent = 'copy';
            btn.classList.remove('is-copied');
          }, 1200);
        });
      });
      block.appendChild(btn);
    });
  }

  // -- Init ----------------------------------------------------------------

  function init() {
    syncAsides();
    attachCopyButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  mq.addEventListener('change', syncAsides);
})();

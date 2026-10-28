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
 *
 * 3. Subscribe form: submits to Kit in the background and shows the result
 *    inline. Without JS the form posts normally and Kit handles the redirect.
 *
 * 4. Subscribe popup: on long posts and field notes, slides in a signup
 *    prompt once the reader is partway down. Dismissing it hides it for
 *    30 days; subscribing hides it for good.
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

  // -- Tag filter ----------------------------------------------------------
  //
  // Field-notes index: clicking a .tag-chip toggles a filter. Multiple
  // selections OR together. Tag pills inside note items behave as shortcut
  // "select only this tag" actions. URL stays in sync via ?tag=a,b so links
  // are shareable.

  function attachTagFilter() {
    const root = document.querySelector('[data-tag-filter-root]');
    const list = document.querySelector('[data-note-list]');
    if (!root || !list) return;

    const empty = document.querySelector('[data-note-list-empty]');
    const items = Array.from(list.querySelectorAll('.note-list-item'));
    const chips = Array.from(root.querySelectorAll('.tag-chip'));

    const active = new Set();
    const fromUrl = new URLSearchParams(window.location.search).get('tag');
    if (fromUrl) {
      fromUrl.split(',').map(s => s.trim().toLowerCase()).filter(Boolean).forEach(t => active.add(t));
    }

    function syncUrl() {
      const params = new URLSearchParams(window.location.search);
      if (active.size === 0) {
        params.delete('tag');
      } else {
        params.set('tag', Array.from(active).join(','));
      }
      const qs = params.toString();
      const url = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
      window.history.replaceState(null, '', url);
    }

    function render() {
      chips.forEach(c => {
        const t = c.dataset.tagFilter;
        const on = t === '' ? active.size === 0 : active.has(t);
        c.classList.toggle('is-active', on);
      });
      let shown = 0;
      items.forEach(li => {
        const tags = (li.dataset.tags || '').split(/\s+/).filter(Boolean);
        const match = active.size === 0 || tags.some(t => active.has(t));
        li.classList.toggle('is-hidden', !match);
        if (match) shown += 1;
      });
      if (empty) empty.hidden = shown !== 0;
      syncUrl();
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const t = chip.dataset.tagFilter;
        if (t === '') {
          active.clear();
        } else if (active.has(t)) {
          active.delete(t);
        } else {
          active.add(t);
        }
        render();
      });
    });

    list.querySelectorAll('.note-tags .tag-pill').forEach(pill => {
      pill.addEventListener('click', evt => {
        evt.preventDefault();
        const t = pill.dataset.tagFilter;
        if (!t) return;
        active.clear();
        active.add(t);
        render();
      });
    });

    render();
  }

  // -- Subscribe form ------------------------------------------------------

  function attachSubscribe() {
    document.querySelectorAll('form.subscribe').forEach(form => {
      const status = form.querySelector('.subscribe-status');
      const button = form.querySelector('button');

      form.addEventListener('submit', async e => {
        e.preventDefault();
        button.disabled = true;
        status.className = 'subscribe-status';
        status.textContent = 'sending…';
        try {
          const res = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' },
          });
          const data = await res.json();
          if (data.status === 'failed') {
            const msgs = (data.errors && data.errors.messages) || [];
            throw new Error(msgs[0] || 'Something went wrong.');
          }
          form.reset();
          status.classList.add('is-ok');
          status.textContent = 'Thanks! Check your inbox to confirm.';
          store('subscribe-done', '1');
          const popup = form.closest('.subscribe-popup');
          if (popup) setTimeout(() => closePopup(popup), 2500);
        } catch (err) {
          status.classList.add('is-error');
          status.textContent = err.message || 'Something went wrong.';
        } finally {
          button.disabled = false;
        }
      });
    });
  }

  // -- Subscribe popup -----------------------------------------------------

  const DISMISS_DAYS = 30;
  const MIN_PAGE_SCREENS = 3;   // page must be at least this many viewports tall
  const TRIGGER_FRACTION = 0.4; // ...and the reader this far through it

  // localStorage can throw (private mode, blocked storage); treat as empty.
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }
  function recall(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function closePopup(popup) {
    popup.classList.remove('is-open');
    setTimeout(() => { popup.hidden = true; }, 250);
  }

  function attachSubscribePopup() {
    const popup = document.querySelector('.subscribe-popup');
    if (!popup || recall('subscribe-done')) return;
    const dismissed = Number(recall('subscribe-dismissed') || 0);
    if (Date.now() - dismissed < DISMISS_DAYS * 864e5) return;

    // Don't compete with the inline form at the end of a post.
    const inline = document.querySelector('form.subscribe:not(.subscribe--popup)');
    let inlineVisible = false;
    if (inline && 'IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        inlineVisible = entries[0].isIntersecting;
      }).observe(inline);
    }

    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (doc.scrollHeight < window.innerHeight * MIN_PAGE_SCREENS) return;
      if (window.scrollY / scrollable < TRIGGER_FRACTION || inlineVisible) return;
      window.removeEventListener('scroll', onScroll);
      popup.hidden = false;
      requestAnimationFrame(() => popup.classList.add('is-open'));
    }

    popup.querySelector('.subscribe-popup-close').addEventListener('click', () => {
      store('subscribe-dismissed', String(Date.now()));
      closePopup(popup);
    });
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // -- Init ----------------------------------------------------------------

  function init() {
    syncAsides();
    attachCopyButtons();
    attachTagFilter();
    attachSubscribe();
    attachSubscribePopup();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  mq.addEventListener('change', syncAsides);
})();

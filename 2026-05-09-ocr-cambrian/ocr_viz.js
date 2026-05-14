/* ============================================================================
 * ocr_viz.js — Renders the OCR comparison figures.
 *
 * Layout per figure (`.ocr-viz[data-page]`):
 *   - Tabs on the top-left (LightOnOCR · KOSMOS-2.5 · Chandra)
 *   - A row of controls beneath ("Hide blocks", plus a Chandra-only legend)
 *   - Two-column grid: input image (with overlay) on left, raw output on right
 *
 * Switching tabs swaps the overlay and the raw text but keeps the image in
 * place. LightOnOCR has no overlay; its "raw" is the rendered markdown.
 * ============================================================================ */
(function () {
  'use strict';

  const ROLES = [
    'Text', 'Section-Header', 'Page-Header', 'List-Group',
    'Form', 'Caption', 'Footnote', 'Diagram',
  ];

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'text') node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    }
    if (children) for (const c of children) node.appendChild(c);
    return node;
  }

  function renderOverlay(overlay, page, model) {
    overlay.classList.remove('is-kosmos', 'is-chandra');
    // Remove existing block children (keep the <img>).
    Array.from(overlay.querySelectorAll('.ocr-block')).forEach((n) => n.remove());
    if (model !== 'kosmos' && model !== 'chandra') return;

    overlay.classList.add('is-' + model);
    for (const b of page[model].blocks) {
      const div = el('div', { class: 'ocr-block', text: b.text });
      if (b.label) div.setAttribute('data-label', b.label);
      div.style.left   = b.left   + '%';
      div.style.top    = b.top    + '%';
      div.style.width  = b.width  + '%';
      div.style.height = b.height + '%';
      overlay.appendChild(div);
    }
  }

  function buildFigure(host, page) {
    host.innerHTML = '';

    // --- Tabs (top-left) ---------------------------------------------------
    const tabs = el('div', { class: 'ocr-tabs' });
    const tabDefs = [
      { id: 'lighton', label: 'Markdown', sub: 'LightOnOCR 2' },
      { id: 'kosmos',  label: 'Blocks', sub: 'KOSMOS-2.5'   },
      { id: 'chandra', label: 'Layout',    sub: 'Chandra'   },
    ];
    const tabBtns = {};
    for (const t of tabDefs) {
      const btn = el('button', { class: 'ocr-tab', 'data-model': t.id, type: 'button' }, [
        el('span', { class: 'ocr-tab-label', text: t.label }),
        el('span', { class: 'ocr-tab-sub',   text: t.sub   }),
      ]);
      if (t.id === 'lighton') btn.classList.add('is-active');
      tabs.appendChild(btn);
      tabBtns[t.id] = btn;
    }
    host.appendChild(tabs);
      //
    // --- Grid: image on left, raw output on right ------------------------
    const grid = el('div', { class: 'ocr-viz-grid' });
    const overlay = el('div', { class: 'ocr-overlay' });
    overlay.appendChild(el('img', { src: page.image, alt: 'Page ' + (page.index + 1) }));
    grid.appendChild(overlay);

    const rawPre = el('pre', { class: 'ocr-code' });
    const rawCode = el('code');
    rawPre.appendChild(rawCode);
    grid.appendChild(rawPre);
    host.appendChild(grid);

    // --- Controls (hide blocks, hidden when no overlay) -------------------
    const controls = el('div', { class: 'ocr-controls is-hidden' });
    const hideLabel = el('label');
    const hideCb = el('input', { type: 'checkbox' });
    hideLabel.appendChild(hideCb);
    hideLabel.appendChild(document.createTextNode(' Hide blocks'));
    controls.appendChild(hideLabel);
    host.appendChild(controls);

    // --- Chandra legend (hidden unless Chandra tab is active) ------------
    const legend = el('div', { class: 'ocr-legend is-hidden' });
    for (const role of ROLES) {
      const item = el('div', { class: 'ocr-legend-item' });
      item.appendChild(el('span', { class: 'ocr-legend-swatch', 'data-label': role }));
      item.appendChild(document.createTextNode(role));
      legend.appendChild(item);
    }
    host.appendChild(legend);


    function setActive(modelId) {
      for (const k in tabBtns) tabBtns[k].classList.toggle('is-active', k === modelId);
      const rawText = (modelId === 'lighton') ? page.lighton.markdown : page[modelId].raw;
      rawCode.textContent = rawText;
      renderOverlay(overlay, page, modelId);
      const hasBlocks = (modelId === 'kosmos' || modelId === 'chandra');
      controls.classList.toggle('is-hidden', !hasBlocks);
      legend.classList.toggle('is-hidden', modelId !== 'chandra');
      // Re-apply hide-blocks state on overlay.
      overlay.classList.toggle('blocks-hidden', hideCb.checked);
    }

    tabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.ocr-tab');
      if (!btn) return;
      setActive(btn.getAttribute('data-model'));
    });
    hideCb.addEventListener('change', () => {
      overlay.classList.toggle('blocks-hidden', hideCb.checked);
    });

    setActive('lighton');
  }

  function init(data) {
    document.querySelectorAll('.ocr-viz[data-page]').forEach((host) => {
      const idx = parseInt(host.getAttribute('data-page'), 10);
      const page = data.pages[idx];
      if (page) buildFigure(host, page);
    });
  }

  function start() {
    if (!document.querySelector('.ocr-viz[data-page]')) return;
    fetch('ocr_data.json')
      .then((r) => r.json())
      .then(init)
      .catch((err) => console.error('ocr_viz: failed to load data', err));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

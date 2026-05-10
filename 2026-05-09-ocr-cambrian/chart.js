/* Chart initialization for the OCR Cambrian post.
 *
 * Loads releases.json (produced by build.py from data.csv), bins it by
 * month, and renders the histogram with Viz.Histogram from viz.js.
 */
(function () {
  'use strict';

  const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function parseMonthYear(str) {
    const [m, y] = String(str).trim().split(/\s+/);
    const month = MONTHS_SHORT.indexOf(m) + 1;
    const year  = parseInt(y, 10);
    return { year, month, key: `${year}-${String(month).padStart(2, '0')}` };
  }

  fetch('releases.json')
    .then(r => r.json())
    .then(rows => {
      const parsed = rows.map(r => ({
        name: r['Model Name'],
        link: r['Paper Link'],
        ...parseMonthYear(r['Release Date']),
      }));

      const start = { year: 2021, month: 9 };
      const end   = { year: 2026, month: 5 };

      const data = Viz.Util.monthsBetween(start, end).map(bin => {
        const models = parsed
          .filter(r => r.year === bin.year && r.month === bin.month)
          .map(r => ({ name: r.name, link: r.link }));
        return { ...bin, count: models.length, models };
      });

      function tooltipFor(d) {
        const month = Viz.Util.formatLongMonth(d);
        if (!d.count) {
          return `<div class="tt-month">${month}</div>
                  <div class="tt-count">No releases</div>`;
        }
        const items = d.models.map(m =>
          `<li><a href="${m.link}" target="_blank" rel="noopener">${m.name}</a></li>`
        ).join('');
        return `<div class="tt-month">${month}</div>
                <div class="tt-count">${d.count} release${d.count > 1 ? 's' : ''}</div>
                <ul>${items}</ul>`;
      }

      const xTickFilter = (d, i) =>
        i === 0 || i === data.length - 1 || d.month === 1;

      const xTickFormat = (d, i) => {
        if (i === 0 || i === data.length - 1) return Viz.Util.formatShortMonth(d);
        return String(d.year);
      };

      new Viz.Histogram('#histogram', {
        data,
        xAccessor:      d => d.key,
        yAccessor:      d => d.count,
        tooltipContent: tooltipFor,
        xTickFilter,
        xTickFormat,
        yLabel:         'Models',
        height:         380,
        margin:         { top: 32, right: 24, bottom: 56, left: 36 },
        annotations: [
          {
            x: '2025-02',
            text: 'Qwen2.5-VL Release',
            dx: -150,
            dy: -36,
            anchor: 'middle',
          },
        ],
      });

      renderDataTable(parsed);
    });

  const MONTHS_LONG = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];

  function renderDataTable(parsed) {
    const style = document.createElement('style');
    style.textContent = `
      .ocr-table-wrap {
        overflow: hidden;
        max-height: 0;
        transition: max-height 420ms cubic-bezier(0.16, 1, 0.3, 1);
      }
      .ocr-table {
        width: 100%;
        border-collapse: collapse;
        font-family: var(--font-sans);
        font-size: 13px;
        margin-top: 28px;
        margin-bottom: 4px;
      }
      .ocr-table thead th {
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--ink-faint);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 500;
        text-align: left;
        padding: 0 16px 8px 0;
        border-bottom: 1px solid var(--rule);
      }
      .ocr-table tbody td {
        padding: 7px 16px 7px 0;
        border-bottom: 1px solid var(--rule);
        color: var(--ink-soft);
        vertical-align: middle;
        line-height: 1.4;
      }
      .ocr-table tbody tr:last-child td { border-bottom: none; }
      .ocr-table .col-date {
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--ink-faint);
        white-space: nowrap;
        width: 120px;
      }
      .ocr-table .col-name a {
        color: var(--accent);
        text-decoration: none;
      }
      .ocr-table .col-name a:hover { text-decoration: underline; }
      .ocr-toggle { cursor: pointer; flex-shrink: 0; padding: 2px 4px; }
    `;
    document.head.appendChild(style);

    const sorted = [...parsed].sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);

    const rows = sorted.map(r => `
      <tr>
        <td class="col-date">${MONTHS_LONG[r.month - 1]} ${r.year}</td>
        <td class="col-name"><a href="${r.link}" target="_blank" rel="noopener">${r.name}</a></td>
      </tr>`).join('');

    const wrap = document.createElement('div');
    wrap.className = 'ocr-table-wrap';
    wrap.innerHTML = `
      <table class="ocr-table">
        <thead><tr>
          <th class="col-date">Released</th>
          <th class="col-name">Model</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>`;

    const btn = document.createElement('button');
    btn.className = 'btn btn-paper ocr-toggle';
    btn.textContent = 'Show data table ↓';

    const figureSource = document.querySelector('.figure-source');
    figureSource.appendChild(btn);
    figureSource.insertAdjacentElement('afterend', wrap);

    btn.addEventListener('click', () => {
      const opening = wrap.style.maxHeight === '0px' || !wrap.style.maxHeight;
      if (opening) {
        wrap.style.maxHeight = wrap.scrollHeight + 'px';
        btn.textContent = 'Hide data table ↑';
      } else {
        wrap.style.maxHeight = '0';
        btn.textContent = 'Show data table ↓';
      }
    });
  }
})();

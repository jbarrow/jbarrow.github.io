/* Chart initialization for the OCR Cambrian post.
 *
 * Loads releases.json (produced by build.py from data.csv), bins it by
 * month, and renders the histogram with Viz.Histogram from viz.js.
 */
(function () {
  'use strict';

  fetch('releases.json')
    .then(r => r.json())
    .then(rows => {
      const parsed = rows.map(r => ({
        name: r.name,
        ...Viz.Util.parseMonthYear(r.release),
      }));

      const start = { year: 2021, month: 9 };
      const end   = { year: 2025, month: 11 };

      const data = Viz.Util.monthsBetween(start, end).map(bin => {
        const models = parsed
          .filter(r => r.year === bin.year && r.month === bin.month)
          .map(r => r.name);
        return { ...bin, count: models.length, models };
      });

      function tooltipFor(d) {
        const month = Viz.Util.formatLongMonth(d);
        if (!d.count) {
          return `<div class="tt-month">${month}</div>
                  <div class="tt-count">No releases</div>`;
        }
        const items = d.models.map(m => `<li>${m}</li>`).join('');
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
            x: '2025-10',
            text: 'Six releases in a single month',
            dx: -150,
            dy: -36,
            anchor: 'start',
          },
        ],
      });
    });
})();

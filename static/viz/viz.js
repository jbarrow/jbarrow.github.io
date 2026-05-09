/* ============================================================================
 * viz.js — A small, extensible chart library for editorial visualisations.
 *
 *   window.Viz = {
 *     BaseChart,    // extend this for new chart types
 *     Histogram,    // first concrete implementation
 *     Tooltip,      // reusable, works for any DOM node — not just SVG
 *     Scale,        // band + linear scales
 *     Util,         // date parsing, SVG factory, debounce
 *     TOKENS,       // colour + motion design tokens
 *   };
 *
 * Adding a new chart type (e.g. Scatter, ImageOverlay) is a matter of
 * subclassing BaseChart and implementing draw().
 * ============================================================================ */
(function (global) {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Tokens — keep all design constants here so styling stays cohesive
  // ---------------------------------------------------------------------------
  const TOKENS = {
    color: {
      ink:        '#1a1a1a',
      inkSoft:    '#4a4a4a',
      inkFaint:   '#8a8a8a',
      paper:      '#fff1e5',
      rule:       '#d4c8b8',
      gridline:   '#ebdfca',
      accent:     '#990f3d',
      bar:        '#2c2825',
      barHover:   '#990f3d',
    },
    motion: {
      ease:       'cubic-bezier(0.16, 1, 0.3, 1)',
      duration:   600,
    },
  };

  // ---------------------------------------------------------------------------
  // 2. Util — small helpers
  // ---------------------------------------------------------------------------
  const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const MONTHS_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const Util = {
    /** Parse "Sep 2021" → { year: 2021, month: 9, key: '2021-09' }. */
    parseMonthYear(str) {
      const [m, y] = String(str).trim().split(/\s+/);
      const month = MONTHS_SHORT.indexOf(m) + 1;
      const year  = parseInt(y, 10);
      return { year, month, key: `${year}-${String(month).padStart(2, '0')}` };
    },

    /** Inclusive list of monthly bins between two {year, month} pairs. */
    monthsBetween(start, end) {
      const out = [];
      let y = start.year, m = start.month;
      while (y < end.year || (y === end.year && m <= end.month)) {
        out.push({ year: y, month: m, key: `${y}-${String(m).padStart(2,'0')}` });
        if (++m > 12) { m = 1; y++; }
      }
      return out;
    },

    formatShortMonth(bin) { return `${MONTHS_SHORT[bin.month - 1]} ’${String(bin.year).slice(2)}`; },
    formatLongMonth(bin)  { return `${MONTHS_LONG[bin.month - 1]} ${bin.year}`; },

    /** SVG element factory. */
    svg(tag, attrs = {}, text = null) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (const k in attrs) el.setAttribute(k, attrs[k]);
      if (text != null) el.textContent = text;
      return el;
    },

    debounce(fn, wait = 150) {
      let t;
      return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    },
  };

  // ---------------------------------------------------------------------------
  // 3. Scales
  // ---------------------------------------------------------------------------
  function niceTickStep(span, count) {
    const rough = span / count;
    const pow   = Math.pow(10, Math.floor(Math.log10(rough)));
    const norm  = rough / pow;
    let nice;
    if      (norm < 1.5) nice = 1;
    else if (norm < 3)   nice = 2;
    else if (norm < 7)   nice = 5;
    else                 nice = 10;
    return nice * pow;
  }

  const Scale = {
    /** Band scale: discrete categorical input, evenly-spaced positions. */
    band(domain, range, padding = 0.1) {
      const step      = (range[1] - range[0]) / Math.max(domain.length, 1);
      const bandwidth = step * (1 - padding);
      const offset    = (step - bandwidth) / 2;
      const map = new Map(domain.map((d, i) => [d, range[0] + i * step + offset]));
      const fn  = (d) => map.get(d);
      fn.bandwidth = () => bandwidth;
      fn.step      = () => step;
      fn.domain    = () => domain;
      return fn;
    },

    /** Linear scale: continuous numeric input → numeric output. */
    linear(domain, range) {
      const [d0, d1] = domain, [r0, r1] = range;
      const slope = (r1 - r0) / ((d1 - d0) || 1);
      const fn = (v) => r0 + (v - d0) * slope;
      fn.invert = (p) => d0 + (p - r0) / slope;
      fn.domain = () => domain;
      fn.range  = () => range;
      fn.ticks  = (count = 5) => {
        const step  = niceTickStep(d1 - d0, count);
        const start = Math.ceil(d0 / step) * step;
        const ticks = [];
        for (let v = start; v <= d1 + 1e-9; v += step) ticks.push(+v.toFixed(10));
        return ticks;
      };
      return fn;
    },
  };

  // ---------------------------------------------------------------------------
  // 4. Tooltip — DOM-based, not SVG. Works for any visualisation.
  // ---------------------------------------------------------------------------
  class Tooltip {
    constructor() {
      this.el = document.createElement('div');
      this.el.className = 'viz-tooltip';
      this.el.setAttribute('role', 'tooltip');
      document.body.appendChild(this.el);
      this._visible = false;
    }
    show(html, x, y) {
      this.el.innerHTML = html;
      if (!this._visible) { this.el.classList.add('is-visible'); this._visible = true; }
      this.position(x, y);
    }
    position(x, y) {
      const r   = this.el.getBoundingClientRect();
      const pad = 14;
      let left  = x + pad;
      let top   = y - r.height - pad;
      if (left + r.width > window.innerWidth - pad) left = x - r.width - pad;
      if (top < pad) top = y + pad;
      this.el.style.transform = `translate(${left}px, ${top}px)`;
    }
    hide()    { this.el.classList.remove('is-visible'); this._visible = false; }
    destroy() { this.el.remove(); }
  }

  // ---------------------------------------------------------------------------
  // 5. BaseChart — the extension point
  // ---------------------------------------------------------------------------
  class BaseChart {
    constructor(selector, options = {}) {
      this.container = typeof selector === 'string'
        ? document.querySelector(selector) : selector;
      if (!this.container) throw new Error(`Viz: container not found: ${selector}`);

      this.options = Object.assign({
        margin: { top: 28, right: 16, bottom: 56, left: 44 },
        height: 380,
      }, options);

      this.container.classList.add('viz-chart');
      this.svg = Util.svg('svg', { preserveAspectRatio: 'xMidYMid meet' });
      this.container.appendChild(this.svg);
      this.g = Util.svg('g');
      this.svg.appendChild(this.g);

      this.tooltip = new Tooltip();

      // Re-render on resize so the chart stays crisp at any width.
      this._onResize = Util.debounce(() => this.render(), 120);
      if (typeof ResizeObserver !== 'undefined') {
        this._ro = new ResizeObserver(this._onResize);
        this._ro.observe(this.container);
      } else {
        window.addEventListener('resize', this._onResize);
      }
    }

    get width()       { return this.container.clientWidth || 720; }
    get height()      { return this.options.height; }
    get innerWidth()  { return this.width  - this.options.margin.left - this.options.margin.right; }
    get innerHeight() { return this.height - this.options.margin.top  - this.options.margin.bottom; }

    clear() { while (this.g.firstChild) this.g.removeChild(this.g.firstChild); }

    render() {
      this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
      this.svg.setAttribute('width',  this.width);
      this.svg.setAttribute('height', this.height);
      this.g.setAttribute('transform',
        `translate(${this.options.margin.left}, ${this.options.margin.top})`);
      this.clear();
      this.draw();
    }

    /** Subclasses override this. */
    draw() {}

    destroy() {
      if (this._ro) this._ro.disconnect();
      else window.removeEventListener('resize', this._onResize);
      this.tooltip.destroy();
      this.svg.remove();
      this.container.classList.remove('viz-chart');
    }
  }

  // ---------------------------------------------------------------------------
  // 6. Histogram — first concrete chart
  // ---------------------------------------------------------------------------
  class Histogram extends BaseChart {
    constructor(selector, options) {
      super(selector, options);

      this.data           = options.data || [];
      this.xAccessor      = options.xAccessor || (d => d.x);
      this.yAccessor      = options.yAccessor || (d => d.y);
      this.tooltipContent = options.tooltipContent || (d => `${this.xAccessor(d)}: ${this.yAccessor(d)}`);
      this.annotations    = options.annotations || [];
      this.xTickFilter    = options.xTickFilter || (() => true);
      this.xTickFormat    = options.xTickFormat || (d => d);
      this.yLabel         = options.yLabel || '';

      this.render();
    }

    draw() {
      const { innerWidth, innerHeight, data } = this;
      if (!data.length) return;

      const xValues = data.map(this.xAccessor);
      const yMax    = Math.max(1, ...data.map(this.yAccessor));

      const x = Scale.band(xValues, [0, innerWidth], 0.32);
      const y = Scale.linear([0, yMax], [innerHeight, 0]);

      // ── Y gridlines + tick labels ───────────────────────────────────────────
      const yTicks = y.ticks(Math.min(5, yMax));
      yTicks.forEach(t => {
        const yPos = y(t);
        this.g.appendChild(Util.svg('line', {
          class: t === 0 ? 'viz-axis-line' : 'viz-gridline',
          x1: 0, x2: innerWidth, y1: yPos, y2: yPos,
        }));
        this.g.appendChild(Util.svg('text', {
          class: 'viz-y-tick-label',
          x: -10, y: yPos, dy: '0.32em', 'text-anchor': 'end',
        }, t));
      });

      // ── Y-axis label (top-of-axis style, FT-like) ──────────────────────────
      if (this.yLabel) {
        this.g.appendChild(Util.svg('text', {
          class: 'viz-y-axis-label',
          x: -10, y: -10, 'text-anchor': 'end',
        }, this.yLabel));
      }

      // ── Bars ───────────────────────────────────────────────────────────────
      data.forEach((d, i) => {
        const v = this.yAccessor(d);
        if (v <= 0) return;

        const bx = x(this.xAccessor(d));
        const by = y(v);
        const bw = x.bandwidth();
        const bh = innerHeight - by;

        const bar = Util.svg('rect', {
          class: 'viz-bar',
          x: bx, y: innerHeight, width: bw, height: 0,
        });
        bar.style.transitionDelay = `${Math.min(i * 8, 240)}ms`;
        this.g.appendChild(bar);

        // Invisible full-column hit area makes hover forgiving on thin bars.
        const hit = Util.svg('rect', {
          class: 'viz-bar-hit',
          x: bx, y: 0, width: bw, height: innerHeight,
        });
        hit.addEventListener('mouseenter', (e) => {
          bar.classList.add('is-hover');
          this.tooltip.show(this.tooltipContent(d), e.clientX, e.clientY);
        });
        hit.addEventListener('mousemove', (e) => this.tooltip.position(e.clientX, e.clientY));
        hit.addEventListener('mouseleave', () => {
          bar.classList.remove('is-hover');
          this.tooltip.hide();
        });
        this.g.appendChild(hit);

        // Animate in on next frame.
        requestAnimationFrame(() => {
          bar.setAttribute('y', by);
          bar.setAttribute('height', bh);
        });
      });

      // ── X-axis ticks + labels ──────────────────────────────────────────────
      data.forEach((d, i) => {
        if (!this.xTickFilter(d, i)) return;
        const cx = x(this.xAccessor(d)) + x.bandwidth() / 2;
        this.g.appendChild(Util.svg('line', {
          class: 'viz-x-tick',
          x1: cx, x2: cx, y1: innerHeight, y2: innerHeight + 5,
        }));
        this.g.appendChild(Util.svg('text', {
          class: 'viz-x-tick-label',
          x: cx, y: innerHeight + 20, 'text-anchor': 'middle',
        }, this.xTickFormat(d, i)));
      });

      // ── Annotations: leader line + dot + italic note ───────────────────────
      this.annotations.forEach(ann => {
        const cx = x(ann.x);
        if (cx == null) return;
        const ax = cx + x.bandwidth() / 2;
        const ay = y(ann.y != null ? ann.y : yMax);
        const tx = ax + (ann.dx ?? 24);
        const ty = ay + (ann.dy ?? -28);

        this.g.appendChild(Util.svg('line', {
          class: 'viz-annotation-line',
          x1: ax, y1: ay, x2: tx, y2: ty + 6,
        }));
        this.g.appendChild(Util.svg('circle', {
          class: 'viz-annotation-dot',
          cx: ax, cy: ay, r: 3,
        }));
        this.g.appendChild(Util.svg('text', {
          class: 'viz-annotation-text',
          x: tx, y: ty, 'text-anchor': ann.anchor || 'start',
        }, ann.text));
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 7. Public API
  // ---------------------------------------------------------------------------
  global.Viz = { BaseChart, Histogram, Tooltip, Scale, Util, TOKENS };

})(typeof window !== 'undefined' ? window : globalThis);

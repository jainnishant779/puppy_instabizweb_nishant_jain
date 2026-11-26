/* TeddyPups U.A.E. — Interactive Choreography, Smooth Scroll, Generative Sketchbook & Live PupBuddy */
(() => {
  const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const PAW_PATH = 'M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z';

  // ── 1. Page Curtain & Route Transitions ─────────────────────────────────
  const curtain = document.querySelector('.tp-curtain');
  const curtainDown = () => Boolean(curtain && curtain.dataset.state !== 'idle');
  let arrivedTimer = 0;

  const finishCurtainIntro = () => {
    if (!curtain) return;
    curtain.dataset.state = 'idle';
    document.documentElement.removeAttribute('data-curtain');
    window.dispatchEvent(new CustomEvent('tp:arrived'));
  };

  if (curtain) {
    if (prefersReduced()) {
      finishCurtainIntro();
    } else {
      arrivedTimer = window.setTimeout(finishCurtainIntro, 1060);
    }
    window.addEventListener('pageshow', () => {
      window.clearTimeout(arrivedTimer);
      finishCurtainIntro();
    });

    document.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (prefersReduced()) return;
      const anchor = event.target.closest('a[href]');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      const rawHref = anchor.getAttribute('href');
      if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) return;
      let targetUrl;
      try { targetUrl = new URL(anchor.href, window.location.href); } catch { return; }
      if (targetUrl.origin !== window.location.origin) return;
      if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search && targetUrl.hash) return;
      event.preventDefault();
      curtain.dataset.state = 'covering';
      window.setTimeout(() => { window.location.href = targetUrl.href; }, 290);
    });
  }

  // ── 2. Smooth Wheel Scroller (Lenis-style on Desktop Fine Pointers) ─────
  (() => {
    if (!finePointer() || prefersReduced()) return;
    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let rafId = 0;
    let active = false;

    const tick = () => {
      const diff = targetY - currentY;
      if (Math.abs(diff) < 0.6) {
        window.scrollTo(0, targetY);
        currentY = targetY;
        active = false;
        rafId = 0;
        return;
      }
      currentY += diff * 0.11;
      window.scrollTo(0, currentY);
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) return;
      const t = e.target;
      if (t instanceof Element && t.closest('dialog, [data-lenis-prevent]')) return;
      if (document.documentElement.scrollHeight <= window.innerHeight) return;
      if (window.getComputedStyle(document.documentElement).overflowY === 'hidden') return;
      e.preventDefault();
      if (!active) {
        currentY = window.scrollY;
        targetY = currentY;
        active = true;
      }
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetY = clamp(targetY + e.deltaY * 0.85, 0, maxScroll);
      if (!rafId) rafId = window.requestAnimationFrame(tick);
    }, { passive: false });

    window.addEventListener('scroll', () => {
      if (!active) {
        currentY = window.scrollY;
        targetY = currentY;
      }
    }, { passive: true });
  })();

  // ── 3. Sticky Header Hide/Show & Scoped Hem + Mobile Menu ───────────────
  const header = document.getElementById('site-header');
  const menu = document.getElementById('mobile-menu');
  const menuToggle = document.querySelector('[data-menu]');

  if (header) {
    let lastY = window.scrollY;
    const isHome = header.hasAttribute('data-home');
    const syncHeader = () => {
      const y = window.scrollY;
      const menuOpen = Boolean(menu && menu.open);
      header.dataset.scrolled = String(!isHome || y > 24);
      if (menuOpen || y < 110 || y < lastY - 4) {
        header.dataset.hidden = 'false';
      } else if (y > lastY + 8 && y > 160) {
        header.dataset.hidden = 'true';
      }
      lastY = y;
    };
    window.addEventListener('scroll', syncHeader, { passive: true });
    syncHeader();
  }

  if (menu && menuToggle) {
    const closeMenu = () => {
      if (!menu.open || menu.hasAttribute('data-closing')) return;
      if (prefersReduced()) {
        menu.close();
        menuToggle.setAttribute('aria-expanded', 'false');
        return;
      }
      menu.setAttribute('data-closing', '');
      window.setTimeout(() => {
        menu.removeAttribute('data-closing');
        menu.close();
        menuToggle.setAttribute('aria-expanded', 'false');
      }, 420);
    };
    menuToggle.addEventListener('click', () => {
      menu.removeAttribute('data-closing');
      menu.showModal();
      menuToggle.setAttribute('aria-expanded', 'true');
    });
    menu.querySelector('[data-close-menu]')?.addEventListener('click', closeMenu);
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menu.close();
    }));
    menu.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeMenu();
    });
    menu.addEventListener('close', () => menuToggle.setAttribute('aria-expanded', 'false'));
  }

  // ── 4. Generative Organic Sketchbook Circles & Doodles (/puppies/) ──────
  (() => {
    const sketches = [...document.querySelectorAll('.tp-sketch[data-slug]')];
    if (!sketches.length) return;
    const WASH_COLORS = ['#f2be6b', '#f9cdbf', '#bfddf5', '#fbe3b4', '#e8c39a'];
    const INK_COLORS = ['#c2622b', '#a24a1a', '#2a170e', '#d4893f'];
    const DOODLE_KINDS = ['sparkle', 'heart', 'dashes', 'swirl', 'dots', 'paw'];

    const makePrng = (seedStr) => {
      let h = 0x811c9dc5;
      for (const ch of seedStr) h = Math.imul(h ^ ch.charCodeAt(0), 0x1000193);
      let s = h >>> 0;
      return () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
        return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
      };
    };

    const wobblePts = (rnd, r, amp, count = 40, start = 0, arc = Math.PI * 2) => {
      const ph = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28];
      const squash = 1 + (rnd() - 0.5) * 0.05;
      const pts = [];
      for (let i = 0; i < count; i++) {
        const a = start + (i / (arc >= Math.PI * 2 ? count : count - 1)) * arc;
        const rad = r + amp * (0.55 * Math.sin(2 * a + ph[0]) + 0.3 * Math.sin(3 * a + ph[1]) + 0.15 * Math.sin(5 * a + ph[2]));
        pts.push([50 + Math.cos(a) * rad * squash, 50 + Math.sin(a) * rad / squash]);
      }
      return pts;
    };

    const spline = (pts, closed) => {
      const n = pts.length;
      const get = (i) => pts[closed ? (i + n) % n : clamp(i, 0, n - 1)];
      let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
      const segs = closed ? n : n - 1;
      for (let i = 0; i < segs; i++) {
        const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
        const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += `C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
      }
      return closed ? `${d}Z` : d;
    };

    const doodleSvg = (d) => {
      const tf = `translate(${d.x.toFixed(1)} ${d.y.toFixed(1)}) rotate(${d.rot.toFixed(0)}) scale(${d.size.toFixed(2)})`;
      const stroke = `fill="none" stroke="${d.ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"`;
      let inner = '';
      if (d.kind === 'sparkle') inner = `<path d="M0 -6c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6z" fill="${d.ink}"/>`;
      else if (d.kind === 'heart') inner = `<path d="M0 5C-4.6 1.8-6.4-.8-6.4-3.2c0-1.9 1.5-3.3 3.3-3.3 1.3 0 2.4.7 3.1 1.9.7-1.2 1.8-1.9 3.1-1.9 1.8 0 3.3 1.4 3.3 3.3C6.4-.8 4.6 1.8 0 5z" ${stroke}/>`;
      else if (d.kind === 'dashes') inner = `<path d="M-5 -5l4 2M-6 0h5M-5 5l4 -2" ${stroke}/>`;
      else if (d.kind === 'swirl') inner = `<path d="M0 0c1.6-.6 2.4 1.4.8 2.6-2 1.4-4.6-.4-4-3 .7-3 4.8-3.8 6.8-1.2 2.4 3-0.2 7.4-3.8 7.2" ${stroke}/>`;
      else if (d.kind === 'dots') inner = `<g fill="${d.ink}"><circle cx="-4" cy="1" r="1.2"/><circle cx="0" cy="-2" r="1.2"/><circle cx="4" cy="1" r="1.2"/></g>`;
      else inner = `<path d="${PAW_PATH}" transform="scale(.17) translate(-32 -34)" fill="${d.ink}" opacity=".85"/>`;
      return `<g transform="${tf}"><g class="tp-sketch__doodle">${inner}</g></g>`;
    };

    for (const card of sketches) {
      const frame = card.querySelector('.tp-sketch__frame');
      const photo = card.querySelector('.tp-sketch__photo');
      if (!frame || !photo) continue;
      const rnd = makePrng(card.dataset.slug || 'pup');
      const maskPath = spline(wobblePts(rnd, 45.5, 2.6), true);
      const outlinePath = spline(wobblePts(rnd, 47.8, 3.1), true);
      const a0 = rnd() * Math.PI * 2;
      const retracePath = spline(wobblePts(rnd, 49, 3.4, 30, a0, Math.PI * (1.15 + 0.5 * rnd())), false);
      const washPath = spline(wobblePts(rnd, 46.5, 3.6), true);
      const dx = (rnd() - 0.5) * 9, dy = 3 + 4 * rnd();
      const washColor = WASH_COLORS[Math.floor(rnd() * WASH_COLORS.length)];
      const tilt = (rnd() - 0.5) * 5;
      const zones = [[0.86, 1.08], [1.16, 1.42], [-0.08, 0.16]].sort(() => rnd() - 0.5);
      const doodleCount = 2 + Math.floor(2 * rnd());
      const used = new Set();
      const doodles = [];
      for (let i = 0; i < doodleCount; i++) {
        let kind = DOODLE_KINDS[Math.floor(rnd() * DOODLE_KINDS.length)];
        if (used.has(kind)) kind = DOODLE_KINDS.find((k) => !used.has(k)) || 'sparkle';
        used.add(kind);
        const [z0, z1] = zones[i];
        const ang = Math.PI * (z0 + rnd() * (z1 - z0));
        const rad = 55 + 4 * rnd();
        doodles.push({
          kind,
          x: 50 + Math.cos(ang) * rad,
          y: 50 + Math.sin(ang) * rad,
          rot: (rnd() - 0.5) * 50,
          size: 0.85 + 0.35 * rnd(),
          ink: INK_COLORS[Math.floor(rnd() * INK_COLORS.length)],
        });
      }

      card.style.setProperty('--tilt', `${tilt.toFixed(2)}deg`);
      card.style.setProperty('--wash', washColor);
      const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${maskPath}" fill="#000"/></svg>`;
      const maskUrl = `url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")`;
      photo.style.webkitMaskImage = maskUrl;
      photo.style.maskImage = maskUrl;

      const ns = 'http://www.w3.org/2000/svg';
      const washSvg = document.createElementNS(ns, 'svg');
      washSvg.setAttribute('aria-hidden', 'true');
      washSvg.setAttribute('viewBox', '0 0 100 100');
      washSvg.setAttribute('class', 'tp-sketch__wash');
      washSvg.style.translate = `${dx.toFixed(1)}% ${dy.toFixed(1)}%`;
      washSvg.innerHTML = `<path d="${washPath}"></path>`;
      frame.prepend(washSvg);

      const inkSvg = document.createElementNS(ns, 'svg');
      inkSvg.setAttribute('aria-hidden', 'true');
      inkSvg.setAttribute('viewBox', '0 0 100 100');
      inkSvg.setAttribute('class', 'tp-sketch__ink');
      inkSvg.innerHTML = `<path d="${outlinePath}" pathLength="1" class="tp-sketch__line"></path><path d="${retracePath}" pathLength="1" class="tp-sketch__line tp-sketch__line--retrace"></path>${doodles.map(doodleSvg).join('')}`;
      photo.after(inkSvg);
    }
  })();

  // ── 5. Catalog Filter Bar (URL-synced) ──────────────────────────────────
  const filterRoot = document.querySelector('[data-filters]');
  if (filterRoot) {
    const cards = [...document.querySelectorAll('[data-puppy]')];
    const buttons = [...filterRoot.querySelectorAll('[data-key]')];
    const reset = filterRoot.querySelector('[data-reset]');
    const count = document.querySelector('[data-result]');
    const empty = document.querySelector('[data-empty]');
    const read = () => {
      const p = new URLSearchParams(window.location.search);
      return { origin: p.get('origin') || '', breed: p.get('breed') || '', gender: p.get('gender') || '' };
    };
    const apply = (state, push = true) => {
      let shown = 0;
      cards.forEach((el) => {
        const match = (!state.origin || (state.origin === 'korean-teacup' ? el.dataset.korean === 'true' : el.dataset.origin === state.origin))
          && (!state.breed || el.dataset.breeds.split(' ').includes(state.breed))
          && (!state.gender || el.dataset.sex.split(' ').includes(state.gender));
        el.hidden = !match;
        if (match) shown++;
      });
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(state[b.dataset.key] === b.dataset.value)));
      if (reset) reset.hidden = !state.origin && !state.breed && !state.gender;
      if (count) count.textContent = `${shown} ${shown === 1 ? 'puppy' : 'puppies'} looking for a home`;
      if (empty) empty.hidden = shown > 0;
      if (push) {
        const p = new URLSearchParams();
        Object.entries(state).forEach(([k, v]) => v && p.set(k, v));
        const qs = p.toString();
        history.pushState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
      }
    };
    buttons.forEach((b) => b.addEventListener('click', () => {
      const s = read();
      s[b.dataset.key] = b.dataset.value && s[b.dataset.key] === b.dataset.value ? '' : b.dataset.value;
      apply(s, true);
    }));
    reset?.addEventListener('click', () => apply({ origin: '', breed: '', gender: '' }, true));
    window.addEventListener('popstate', () => apply(read(), false));
    apply(read(), false);
  }

  // ── 6. FAQ Corkboard (Search + <mark> + Native <details> Corner Fold) ────
  const faqNotesWrap = document.querySelector('.tp-notes');
  const faqSearch = document.getElementById('faq-search');
  if (faqNotesWrap) {
    const noteItems = [...faqNotesWrap.querySelectorAll('.tp-note:not([data-no-faq])')];
    const countEl = document.querySelector('[data-faq-count]');
    const emptyEl = document.querySelector('[data-no-faq]');
    const cache = noteItems.map((li) => {
      const det = li.querySelector('details');
      const qSpan = li.querySelector('summary > span:first-child');
      const pEl = li.querySelector('.tp-note__flap p');
      return { li, det, qSpan, pEl, qRaw: qSpan?.textContent || '', pRaw: pEl?.textContent || '' };
    });

    const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const highlight = (raw, q) => {
      if (!q) return escapeHtml(raw);
      const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return raw.split(re).map((part, i) => i % 2 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)).join('');
    };

    const syncBubble = () => {
      const hasOpen = cache.some((c) => c.det?.open && !c.li.hidden);
      const hasQuery = Boolean(faqSearch && faqSearch.value.trim());
      if (hasOpen || hasQuery) faqNotesWrap.dataset.open = '';
      else delete faqNotesWrap.dataset.open;
    };

    cache.forEach(({ li, det }) => {
      det?.addEventListener('toggle', () => {
        if (det.open) li.dataset.unfolded = 'true';
        else delete li.dataset.unfolded;
        syncBubble();
      });
    });

    faqSearch?.addEventListener('input', () => {
      const q = faqSearch.value.trim();
      const ql = q.toLowerCase();
      let shown = 0;
      cache.forEach(({ li, det, qSpan, pEl, qRaw, pRaw }) => {
        const hitQ = qRaw.toLowerCase().includes(ql);
        const hitA = pRaw.toLowerCase().includes(ql);
        const match = !ql || hitQ || hitA;
        li.hidden = !match;
        if (det) det.hidden = !match;
        if (match) {
          shown++;
          if (qSpan) qSpan.innerHTML = highlight(qRaw, q);
          if (pEl) pEl.innerHTML = highlight(pRaw, q);
          if (det && ql && hitA) {
            det.open = true;
            li.dataset.unfolded = 'true';
          }
        }
      });
      if (countEl) countEl.textContent = q ? `${shown} ${shown === 1 ? 'note' : 'notes'} found` : `${cache.length} notes on the board`;
      if (emptyEl) emptyEl.hidden = shown > 0;
      syncBubble();
    });
  }

  // ── 7. How It Works Sliding Tabs (.tp-switch) ───────────────────────────
  const tablist = document.querySelector('.journey-tabs');
  if (tablist) {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const activate = (idx, focus = false) => {
      tablist.style.setProperty('--at', String(idx));
      tabs.forEach((tab, i) => {
        const sel = i === idx;
        tab.setAttribute('aria-selected', String(sel));
        tab.tabIndex = sel ? 0 : -1;
        const panel = document.getElementById(tab.getAttribute('aria-controls'));
        if (panel) panel.hidden = !sel;
      });
      if (focus) tabs[idx]?.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(i));
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); activate((i + 1) % tabs.length, true); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); activate((i - 1 + tabs.length) % tabs.length, true); }
        else if (e.key === 'Home') { e.preventDefault(); activate(0, true); }
        else if (e.key === 'End') { e.preventDefault(); activate(tabs.length - 1, true); }
      });
    });
  }

  // ── 8. Lightbox & Profile Story Gallery + Ribbon ────────────────────────
  const dialog = document.querySelector('.lightbox');
  const stage = dialog?.querySelector('[data-light-media]');
  const captionEl = dialog?.querySelector('figcaption');
  let galleryItems = [], galleryIdx = 0, returnFocusEl = null;

  const makeMediaNode = (item, autoplay = false) => {
    if (item.video) {
      const v = document.createElement('video');
      v.src = item.src;
      v.controls = true;
      v.playsInline = true;
      v.preload = 'metadata';
      if (item.poster) v.poster = item.poster;
      if (autoplay) v.autoplay = true;
      v.setAttribute('aria-label', item.alt || 'Puppy video');
      return v;
    }
    const imgEl = document.createElement('img');
    imgEl.src = item.src;
    imgEl.alt = item.alt || '';
    return imgEl;
  };

  const renderLightbox = () => {
    if (!stage || !galleryItems.length) return;
    const item = galleryItems[galleryIdx];
    stage.replaceChildren(makeMediaNode(item, true));
    if (captionEl) captionEl.textContent = `${galleryIdx + 1} / ${galleryItems.length}${item.alt ? ` — ${item.alt}` : ''}`;
    const multi = galleryItems.length > 1;
    dialog.querySelector('.light-prev').hidden = !multi;
    dialog.querySelector('.light-next').hidden = !multi;
  };

  const openLightbox = (items, index = 0, trigger = null) => {
    if (!dialog) return;
    galleryItems = items;
    galleryIdx = (index % items.length + items.length) % items.length;
    returnFocusEl = trigger;
    renderLightbox();
    dialog.showModal();
  };

  if (dialog) {
    dialog.querySelector('.light-close')?.addEventListener('click', () => dialog.close());
    dialog.querySelector('.light-prev')?.addEventListener('click', () => { galleryIdx = (galleryIdx - 1 + galleryItems.length) % galleryItems.length; renderLightbox(); });
    dialog.querySelector('.light-next')?.addEventListener('click', () => { galleryIdx = (galleryIdx + 1) % galleryItems.length; renderLightbox(); });
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && galleryItems.length > 1) { galleryIdx = (galleryIdx - 1 + galleryItems.length) % galleryItems.length; renderLightbox(); }
      else if (e.key === 'ArrowRight' && galleryItems.length > 1) { galleryIdx = (galleryIdx + 1) % galleryItems.length; renderLightbox(); }
    });
    dialog.addEventListener('close', () => {
      stage?.querySelector('video')?.pause();
      stage?.replaceChildren();
      returnFocusEl?.focus();
    });
  }

  document.querySelectorAll('[data-wall]').forEach((wall) => {
    const items = JSON.parse(wall.querySelector('[data-media]')?.textContent || '[]');
    wall.querySelectorAll('[data-photo]').forEach((btn) =>
      btn.addEventListener('click', () => openLightbox(items, Number(btn.dataset.photo), btn)));
  });

  document.querySelectorAll('[data-showroom-video]').forEach((btn) => {
    btn.addEventListener('click', () => openLightbox([{ src: btn.dataset.showroomVideo, video: true, alt: 'Puppy at our Dubai showroom' }], 0, btn));
  });

  const story = document.querySelector('[data-story]');
  if (story) {
    const items = JSON.parse(story.querySelector('[data-media]')?.textContent || '[]');
    const mediaBox = story.querySelector('.story-media');
    const countEl = story.querySelector('[data-story-count]');
    const thumbs = [...story.querySelectorAll('[data-thumb]')];
    let current = 0;

    const showSlide = (idx) => {
      current = (idx % items.length + items.length) % items.length;
      if (mediaBox && !prefersReduced()) {
        mediaBox.classList.add('is-turning');
        window.setTimeout(() => mediaBox.classList.remove('is-turning'), 240);
      }
      const oldVid = mediaBox?.querySelector('video');
      oldVid?.pause();
      mediaBox?.replaceChildren(makeMediaNode(items[current], false));
      if (countEl) countEl.textContent = `${current + 1} / ${items.length}`;
      thumbs.forEach((t, i) => t.setAttribute('aria-pressed', String(i === current)));
    };
    story.querySelector('[data-prev]')?.addEventListener('click', () => showSlide(current - 1));
    story.querySelector('[data-next]')?.addEventListener('click', () => showSlide(current + 1));
    thumbs.forEach((t) => t.addEventListener('click', () => showSlide(Number(t.dataset.thumb))));
    story.querySelector('[data-expand]')?.addEventListener('click', (e) => openLightbox(items, current, e.currentTarget));
  }

  // Storybook reading ribbon scaleY
  const storybook = document.querySelector('.tp-storybook');
  const ribbonBand = document.querySelector('.tp-ribbon__band');
  if (storybook && ribbonBand) {
    const syncRibbon = () => {
      const rect = storybook.getBoundingClientRect();
      const total = Math.max(1, storybook.offsetHeight - window.innerHeight * 0.5);
      const p = clamp((-rect.top + window.innerHeight * 0.25) / total, 0.07, 1);
      ribbonBand.style.transform = `scaleY(${p.toFixed(4)})`;
    };
    window.addEventListener('scroll', syncRibbon, { passive: true });
    syncRibbon();
  }

  // ── 9. Pinned Meet Hallway + Airplane Curve + Horizon Sun ───────────────
  const meetSection = document.querySelector('.tp-meet');
  if (meetSection) {
    const pinRange = meetSection.querySelector('[data-pin-range]');
    const hall = meetSection.querySelector('.tp-meet__hall');
    const track = meetSection.querySelector('.tp-meet__track');
    const doors = [...meetSection.querySelectorAll('.tp-door:not(.tp-door--all)')];
    let pinned = false, maxX = 0, currentTx = 0, targetTx = 0, raf = 0;

    const layoutMeet = () => {
      const desktop = window.matchMedia('(min-width: 1024px)').matches && !prefersReduced();
      pinned = desktop;
      if (desktop && hall && track && pinRange) {
        meetSection.setAttribute('data-pinned', 'true');
        const stage = meetSection.querySelector('.tp-meet__stage');
        const head = meetSection.querySelector('.tp-meet__head');
        const floorH = meetSection.querySelector('.tp-meet__floor')?.offsetHeight || 96;
        const maxPlateH = Math.max(64, ...[...track.querySelectorAll('.tp-door__plate')].map((p) => p.offsetHeight));
        const stageH = stage?.clientHeight || window.innerHeight;
        const headBottom = head ? head.offsetTop + head.offsetHeight : 0;
        const doorW = Math.max(128, Math.min(256, 0.15 * window.innerWidth, (stageH - headBottom - floorH - maxPlateH - 40) / 1.3));
        hall.style.setProperty('--door-w', `${doorW.toFixed(0)}px`);
        maxX = Math.max(0, track.scrollWidth - window.innerWidth);
        pinRange.style.height = `calc(100vh + ${Math.round(0.8 * maxX)}px)`;
        pinRange.style.setProperty('--pinned', '1');
        updateMeetScroll(false);
      } else {
        meetSection.removeAttribute('data-pinned');
        hall?.style.removeProperty('--door-w');
        hall?.style.removeProperty('--floor-x');
        track?.style.removeProperty('transform');
        if (pinRange) {
          pinRange.style.removeProperty('height');
          pinRange.style.removeProperty('--pinned');
        }
        doors.forEach((d) => { d.dataset.open = 'true'; });
      }
    };

    const applyTx = (tx, cue) => {
      if (!track || !hall) return;
      track.style.transform = `translateX(${tx.toFixed(1)}px)`;
      hall.style.setProperty('--floor-x', `${tx.toFixed(1)}px`);
      const threshold = 0.36 * window.innerWidth;
      for (const door of track.children) {
        const shouldOpen = door.offsetLeft + tx < threshold;
        const wasOpen = door.dataset.open === 'true';
        if (wasOpen !== shouldOpen) {
          door.dataset.open = String(shouldOpen);
          if (shouldOpen && cue) {
            window.dispatchEvent(new CustomEvent('pup:cue', { detail: { look: door, secs: 0.9 } }));
          }
        }
      }
    };

    const tickTx = () => {
      const diff = targetTx - currentTx;
      if (Math.abs(diff) < 0.4) {
        currentTx = targetTx;
        applyTx(currentTx, true);
        raf = 0;
        return;
      }
      currentTx += diff * 0.16;
      applyTx(currentTx, true);
      raf = window.requestAnimationFrame(tickTx);
    };

    const updateMeetScroll = (animate = true) => {
      if (!pinned || !pinRange) return;
      const rect = pinRange.getBoundingClientRect();
      const range = Math.max(1, pinRange.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / range, 0, 1);
      targetTx = -progress * maxX;
      if (!animate) {
        currentTx = targetTx;
        applyTx(currentTx, false);
      } else if (!raf) {
        raf = window.requestAnimationFrame(tickTx);
      }
    };

    window.addEventListener('scroll', () => updateMeetScroll(true), { passive: true });
    window.addEventListener('resize', layoutMeet);
    if (document.fonts) document.fonts.ready.then(layoutMeet);
    layoutMeet();
  }

  // Airplane curve scrub (.tp-paths) & Horizon Sun (.tp-horizon)
  const pathsSection = document.querySelector('.tp-paths');
  const routePath = pathsSection?.querySelector('.tp-flight__route');
  const planeGroup = pathsSection?.querySelector('.tp-flight__plane');
  const horizon = document.querySelector('.tp-horizon');
  const horizonSun = horizon?.querySelector('.tp-horizon__sun');

  if (routePath && planeGroup && !prefersReduced()) {
    const len = routePath.getTotalLength();
    const updateFlight = () => {
      const rect = pathsSection.getBoundingClientRect();
      const t = clamp((window.innerHeight * 0.85 - rect.top) / (window.innerHeight * 0.72 + rect.height * 0.45), 0, 1);
      const d = t * len;
      const p1 = routePath.getPointAtLength(d);
      const p0 = routePath.getPointAtLength(Math.max(0, d - 4));
      const p2 = routePath.getPointAtLength(Math.min(len, d + 4));
      const ang = Math.atan2(p2.y - p0.y, p2.x - p0.x) * (180 / Math.PI);
      planeGroup.setAttribute('transform', `translate(${p1.x.toFixed(1)} ${p1.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    };
    window.addEventListener('scroll', updateFlight, { passive: true });
    updateFlight();
  }

  if (horizon && horizonSun && !prefersReduced() && !CSS.supports('animation-timeline', 'view()')) {
    const syncSun = () => {
      const rect = horizon.getBoundingClientRect();
      const t = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
      horizonSun.style.translate = `0 ${lerp(-60, 40, t).toFixed(1)}%`;
    };
    window.addEventListener('scroll', syncSun, { passive: true });
    syncSun();
  }

  // ── 10. Scroll-Stepped Chat Phone Choreography ──────────────────────────
  const chatPhone = document.querySelector('[data-chat]');
  const chatSteps = [...document.querySelectorAll('.tp-chat__step')];
  if (chatPhone && chatSteps.length) {
    const groups = [...chatPhone.querySelectorAll('.tp-msg-group')];
    const typingEl = chatPhone.querySelector('.tp-typing');
    const statusEl = chatPhone.querySelector('.tp-phone__status');
    let highest = 0, typeTimer = 0;

    const showChatUpTo = (stepIdx) => {
      chatSteps.forEach((li, i) => {
        if (i === stepIdx) li.setAttribute('data-active', 'true');
        else li.removeAttribute('data-active');
        if (i < stepIdx) li.setAttribute('data-done', 'true');
        else li.removeAttribute('data-done');
      });
      groups.forEach((g) => {
        const s = Number(g.dataset.step);
        g.dataset.show = String(s <= stepIdx);
      });
    };

    if (!window.matchMedia('(min-width: 1024px)').matches || prefersReduced()) {
      showChatUpTo(groups.length - 1);
    } else {
      showChatUpTo(0);
      const advanceChat = (idx) => {
        if (idx <= highest) {
          showChatUpTo(highest);
          return;
        }
        highest = idx;
        window.clearTimeout(typeTimer);
        if (typingEl) typingEl.dataset.show = 'true';
        if (statusEl) statusEl.textContent = 'typing…';
        groups.forEach((g) => {
          g.dataset.show = String(Number(g.dataset.step) < idx);
        });
        typeTimer = window.setTimeout(() => {
          if (typingEl) typingEl.dataset.show = 'false';
          if (statusEl) statusEl.textContent = 'online';
          showChatUpTo(idx);
          const activeGroup = chatPhone.querySelector(`[data-step="${idx}"]`);
          if (activeGroup) {
            window.dispatchEvent(new CustomEvent('pup:cue', {
              detail: { look: activeGroup, secs: 1.4, say: idx === 1 ? 'ooh, photos!' : idx === 2 ? 'home soon!' : undefined },
            }));
          }
        }, 520);
      };

      const chatObs = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) advanceChat(chatSteps.indexOf(entry.target));
        }
      }, { rootMargin: '-28% 0px -62% 0px' });
      chatSteps.forEach((li) => chatObs.observe(li));

      window.addEventListener('scroll', () => {
        const triggerY = window.innerHeight * 0.42;
        let activeIdx = 0;
        chatSteps.forEach((li, i) => {
          if (li.getBoundingClientRect().top <= triggerY) activeIdx = i;
        });
        if (activeIdx > highest) advanceChat(activeIdx);
      }, { passive: true });
    }
  }

  // ── 11. RevealScope for Stamps, Polaroids, Notes, Sketches, Tickets ─────
  const revealTargets = [...document.querySelectorAll('[data-reveal]')];
  if (revealTargets.length) {
    if (prefersReduced()) {
      revealTargets.forEach((el) => { el.dataset.revealed = 'true'; });
    } else {
      const pending = new Set();
      const revealEl = (el) => { el.dataset.revealed = 'true'; };
      const revObs = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (curtainDown()) pending.add(entry.target);
          else revealEl(entry.target);
          revObs.unobserve(entry.target);
        }
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

      revealTargets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0 && !curtainDown()) {
          el.dataset.revealed = 'true';
        } else {
          el.dataset.armed = 'true';
          revObs.observe(el);
        }
      });

      const flushPending = () => {
        pending.forEach(revealEl);
        pending.clear();
      };
      window.addEventListener('tp:arrived', flushPending);
      window.setTimeout(flushPending, 1400);
    }
  }

  // ── 12. Cursor Paw Print Trail Canvas ───────────────────────────────────
  (() => {
    if (!finePointer() || prefersReduced()) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'paw-trail-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const paw2d = new Path2D(PAW_PATH);
    const prints = [];
    let lastPos = null, lastTime = 0, stepIndex = 0, running = false;

    const frame = (now) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = false;
      for (let i = prints.length - 1; i >= 0; i--) {
        const p = prints[i];
        const age = (now - p.t) / 1400;
        if (age >= 1) { prints.splice(i, 1); continue; }
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(0.28, 0.28);
        ctx.translate(-32, -32);
        ctx.globalAlpha = 0.28 * (1 - age) * (age < 0.12 ? age / 0.12 : 1);
        ctx.fillStyle = '#c2622b';
        ctx.fill(paw2d);
        ctx.restore();
      }
      if (alive) window.requestAnimationFrame(frame);
      else running = false;
    };

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const now = performance.now();
      if (!lastPos) { lastPos = { x: e.clientX, y: e.clientY }; lastTime = now; return; }
      const dx = e.clientX - lastPos.x, dy = e.clientY - lastPos.y;
      if (Math.hypot(dx, dy) < 42 || now - lastTime < 55) return;
      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      const side = (stepIndex++ & 1) ? 9 : -9;
      prints.push({ x: e.clientX + Math.cos(angle) * side, y: e.clientY + Math.sin(angle) * side, angle, t: now });
      if (prints.length > 26) prints.shift();
      lastPos = { x: e.clientX, y: e.clientY };
      lastTime = now;
      if (!running) { running = true; window.requestAnimationFrame(frame); }
    }, { passive: true });
  })();

  // ── 13. Full Articulated PupBuddy + Desktop/Mobile PupJourney ───────────
  const PUP_SVG_HTML = `<svg viewBox="0 0 300 240" aria-hidden="true" focusable="false" style="overflow:visible">
    <g data-p="root" transform="translate(0 0)">
      <ellipse data-p="shadow" cx="150" cy="230" rx="92" ry="7" fill="#2a170e" opacity="0.12" style="transform-box:fill-box;transform-origin:center center"></ellipse>
      <g data-p="body" transform="translate(0 0)" opacity="1">
        <g data-p="ff" transform="translate(168 192)"><path d="M-11 -14 C-11 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 11 4 11 -14Z" fill="#e4a352"></path><path d="M-11 -14 C-11 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 11 4 11 -14" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" fill="none"></path><path d="M-3.5 29 v5 M4.5 29 v5" stroke="#2a170e" stroke-width="2.4" stroke-linecap="round" fill="none"></path></g>
        <g data-p="bf" transform="translate(94 192)"><path d="M-14 -14 C-14 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 14 4 14 -14Z" fill="#e4a352"></path><path d="M-14 -14 C-14 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 14 4 14 -14" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" fill="none"></path><path d="M-3.5 29 v5 M4.5 29 v5" stroke="#2a170e" stroke-width="2.4" stroke-linecap="round" fill="none"></path></g>
        <g data-p="tail" transform="rotate(14 84 150)"><path d="M86 152 C80 146 76 140 74 136" stroke="#2a170e" stroke-width="9" stroke-linejoin="round" stroke-linecap="round" fill="none"></path><path d="M86 152 C80 146 76 140 74 136" stroke="#f2be6b" stroke-width="4" fill="none" stroke-linecap="round"></path><path d="M70.0 110.0Q78.1 105.0 80.9 113.7Q90.5 114.8 86.7 123.2Q93.4 129.9 84.7 134.0Q85.2 143.1 75.8 141.0Q70.0 148.3 64.2 141.0Q54.8 143.1 55.3 134.0Q46.6 129.9 53.3 123.2Q49.5 114.8 59.1 113.7Q61.9 105.0 70.0 110.0Z" fill="#f2be6b" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"></path></g>
        <path d="M76.8 175.6Q69.0 167.9 78.2 160.7Q76.6 151.8 90.3 147.3Q95.2 138.9 110.9 137.9Q121.6 131.3 136.7 134.0Q151.1 130.5 162.9 136.4Q178.7 136.4 185.3 144.5Q199.7 148.2 199.7 157.1Q210.3 163.7 203.9 171.9Q208.7 180.4 197.0 186.3Q195.3 195.2 180.3 198.0Q172.3 205.7 156.6 204.8Q143.7 210.0 130.0 205.6Q114.5 207.4 105.1 200.2Q89.7 198.3 86.3 189.6Q73.6 184.3 76.8 175.6Z" fill="#f2be6b" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"></path>
        <path d="M182.7 196.4Q169.4 196.9 166.6 183.0Q156.1 174.1 162.3 161.5Q159.6 147.6 171.9 142.2Q178.2 129.7 191.0 134.0Q203.3 128.7 210.5 140.8Q223.1 145.2 221.3 159.3Q228.4 171.5 218.5 181.0Q216.6 195.1 203.2 195.7Q193.3 205.1 182.7 196.4Z" fill="#f2be6b" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"></path>
        <g data-p="fn" transform="translate(186 194)"><path d="M-12 -14 C-12 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 12 4 12 -14Z" fill="#f2be6b"></path><path d="M-12 -14 C-12 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 12 4 12 -14" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" fill="none"></path><path d="M-3.5 27 v5 M4.5 27 v5" stroke="#2a170e" stroke-width="2.4" stroke-linecap="round" fill="none"></path></g>
        <g data-p="bn" transform="translate(110 194)"><path d="M-15 -14 C-15 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 15 4 15 -14Z" fill="#f2be6b"></path><path d="M-15 -14 C-15 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 15 4 15 -14" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" fill="none"></path><path d="M-3.5 27 v5 M4.5 27 v5" stroke="#2a170e" stroke-width="2.4" stroke-linecap="round" fill="none"></path></g>
      </g>
      <g data-p="haunch" opacity="0"><path d="M80.0 204.0Q75.1 194.9 85.7 189.9Q88.4 180.2 100.7 181.2Q110.0 174.6 119.3 181.2Q131.6 180.2 134.3 189.9Q144.9 194.9 140.0 204.0Q144.9 213.1 134.3 218.1Q131.6 227.8 119.3 226.8Q110.0 233.4 100.7 226.8Q88.4 227.8 85.7 218.1Q75.1 213.1 80.0 204.0Z" fill="#e4a352" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"></path></g>
      <g data-p="head" transform="translate(0 0)">
        <path d="M178 146 Q212 162 246 146 L246 154 Q212 170 178 154 Z" fill="#a24a1a" stroke="#2a170e" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"></path>
        <path d="M212 160 C212 156 206 155 206 159.4 C206 163 212 166.6 212 168.4 C212 166.6 218 163 218 159.4 C218 155 212 156 212 160 Z" fill="#fbe3b4" stroke="#2a170e" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"></path>
        <path data-p="earL" d="M177.1 78.7Q186.9 70.8 186.6 87.4Q196.0 89.9 189.9 105.5Q195.2 117.3 185.5 126.0Q184.7 142.8 175.2 141.2Q168.7 156.5 162.9 145.3Q153.1 153.2 153.4 136.6Q144.0 134.1 150.1 118.5Q144.8 106.7 154.5 98.0Q155.3 81.2 164.8 82.8Q171.3 67.5 177.1 78.7Z" fill="#e4a352" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" transform="rotate(-6 174 82)"></path>
        <path data-p="earR" d="M246.9 78.7Q252.7 67.5 259.2 82.8Q268.7 81.2 269.5 98.0Q279.2 106.7 273.9 118.5Q280.0 134.1 270.6 136.6Q270.9 153.2 261.1 145.3Q255.3 156.5 248.8 141.2Q239.3 142.8 238.5 126.0Q228.8 117.3 234.1 105.5Q228.0 89.9 237.4 87.4Q237.1 70.8 246.9 78.7Z" fill="#e4a352" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" transform="rotate(6 250 82)"></path>
        <path d="M212.0 54.0Q223.4 48.2 231.5 57.5Q244.5 56.1 248.1 67.5Q260.7 70.7 259.1 82.4Q269.4 89.7 263.0 100.0Q269.4 110.3 259.1 117.6Q260.7 129.3 248.1 132.5Q244.5 143.9 231.5 142.5Q223.4 151.8 212.0 146.0Q200.6 151.8 192.5 142.5Q179.5 143.9 175.9 132.5Q163.3 129.3 164.9 117.6Q154.6 110.3 161.0 100.0Q154.6 89.7 164.9 82.4Q163.3 70.7 175.9 67.5Q179.5 56.1 192.5 57.5Q200.6 48.2 212.0 54.0Z" fill="#f2be6b" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"></path>
        <path d="M195.0 52.0Q190.7 45.8 200.0 43.5Q203.2 36.9 212.0 40.0Q220.8 36.9 224.0 43.5Q233.3 45.8 229.0 52.0Q233.3 58.2 224.0 60.5Q220.8 67.1 212.0 64.0Q203.2 67.1 200.0 60.5Q190.7 58.2 195.0 52.0Z" fill="#f2be6b" stroke="#2a170e" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"></path>
        <path d="M188 120 C188 106 200 100 212 100 C224 100 236 106 236 120 C236 133 225 140 212 140 C199 140 188 133 188 120 Z" fill="#fbe3b4"></path>
        <circle cx="181" cy="116" r="7" fill="#f9b9a6" opacity="0.85"></circle>
        <circle cx="243" cy="116" r="7" fill="#f9b9a6" opacity="0.85"></circle>
        <g data-p="eyes" transform="translate(0 0)">
          <g data-p="open" opacity="1"><g data-p="blink" transform="translate(0 0) scale(1 1)" style="transform-origin:212px 98px"><ellipse cx="194" cy="98" rx="7.4" ry="8.6" fill="#2a170e"></ellipse><ellipse cx="230" cy="98" rx="7.4" ry="8.6" fill="#2a170e"></ellipse><circle cx="196.6" cy="94.6" r="2.7" fill="#fff"></circle><circle cx="232.6" cy="94.6" r="2.7" fill="#fff"></circle><circle cx="192" cy="101.2" r="1.2" fill="#fff"></circle><circle cx="228" cy="101.2" r="1.2" fill="#fff"></circle></g></g>
          <g data-p="shut" opacity="0"><path d="M186 98 Q194 104 202 98 M222 98 Q230 104 238 98" stroke="#2a170e" stroke-width="3.2" stroke-linecap="round" fill="none"></path></g>
          <g data-p="happy" opacity="0"><path d="M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" fill="none"></path></g>
        </g>
        <path d="M204.5 111.5 Q212 107.2 219.5 111.5 Q218.2 118.4 212 120 Q205.8 118.4 204.5 111.5 Z" fill="#2a170e"></path>
        <path d="M212 120 V124.5 M212 124.5 Q207.2 129.6 202.8 125.2 M212 124.5 Q216.8 129.6 221.2 125.2" stroke="#2a170e" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" fill="none"></path>
        <path data-p="tongue" d="M207.6 127.4 Q212 136.6 216.4 127.4 Z" fill="#e98c8c" stroke="#2a170e" stroke-width="2.2" stroke-linejoin="round" opacity="0.9"></path>
      </g>
      <g data-p="paws" opacity="0"><path d="M167.2 157.0Q159.0 156.8 161.2 148.9Q157.6 141.5 165.8 140.9Q170.3 133.9 176.2 139.6Q184.4 139.0 182.2 146.9Q185.8 154.3 177.6 154.9Q173.1 161.9 167.2 157.0Z" fill="#f2be6b" stroke="#2a170e" stroke-width="3" stroke-linejoin="round"></path><path d="M236.2 157.0Q228.0 156.8 230.2 148.9Q226.6 141.5 234.8 140.9Q239.3 133.9 245.2 139.6Q253.4 139.0 251.2 146.9Q254.8 154.3 246.6 154.9Q242.1 161.9 236.2 157.0Z" fill="#f2be6b" stroke="#2a170e" stroke-width="3" stroke-linejoin="round"></path></g>
    </g>
  </svg>`;

  const POSES = {
    stand: { bodyY: 0, bodyRot: 0, headY: 0, headRot: 0, bodyOp: 1, haunchOp: 0, pawsOp: 0, eyes: 1, happy: 0.15, mouth: 0.2 },
    walk:  { bodyY: 0, bodyRot: 0, headY: 0, headRot: 0, bodyOp: 1, haunchOp: 0, pawsOp: 0, eyes: 1, happy: 0.25, mouth: 0.35 },
    hop:   { bodyY: -4, bodyRot: -6, headY: -5, headRot: -3, bodyOp: 1, haunchOp: 0, pawsOp: 0, eyes: 1, happy: 0.9, mouth: 0.85 },
    sit:   { bodyY: 0, bodyRot: -24, headY: 0, headRot: 0, bodyOp: 1, haunchOp: 1, pawsOp: 0, eyes: 1, happy: 0.25, mouth: 0.25 },
    beg:   { bodyY: -2, bodyRot: -34, headY: -2, headRot: -5, bodyOp: 1, haunchOp: 1, pawsOp: 0, eyes: 1, happy: 0.8, mouth: 0.7 },
    bow:   { bodyY: 4, bodyRot: 14, headY: 16, headRot: -6, bodyOp: 1, haunchOp: 0, pawsOp: 0, eyes: 1, happy: 0.9, mouth: 0.8 },
    peek:  { bodyY: 50, bodyRot: 0, headY: 44, headRot: 0, bodyOp: 0, haunchOp: 0, pawsOp: 1, eyes: 1, happy: 0.4, mouth: 0.4 },
    snug:  { bodyY: 12, bodyRot: -12, headY: 22, headRot: 8, bodyOp: 0, haunchOp: 0, pawsOp: 1, eyes: 0.2, happy: 0.5, mouth: 0.1 },
  };
  const STOP_BOX = { sit: [50, 26, 284, 234], peek: [148, 34, 280, 163], snug: [148, 40, 280, 163], bow: [58, 56, 292, 236], def: [48, 30, 288, 236] };
  const lerpPose = (a, b, t) => ({
    bodyY: lerp(a.bodyY, b.bodyY, t), bodyRot: lerp(a.bodyRot, b.bodyRot, t),
    headY: lerp(a.headY, b.headY, t), headRot: lerp(a.headRot, b.headRot, t),
    bodyOp: lerp(a.bodyOp, b.bodyOp, t), haunchOp: lerp(a.haunchOp, b.haunchOp, t),
    pawsOp: lerp(a.pawsOp, b.pawsOp, t), eyes: lerp(a.eyes, b.eyes, t),
    happy: lerp(a.happy, b.happy, t), mouth: lerp(a.mouth, b.mouth, t),
  });

  function createPup(svg, initPose = 'sit', initFacing = 1) {
    const els = new Map();
    svg.querySelectorAll('[data-p]').forEach((el) => els.set(el.dataset.p, el));
    const state = {
      pose: { ...(POSES[initPose] || POSES.sit) },
      target: { ...(POSES[initPose] || POSES.sit) },
      facing: initFacing, facingTarget: initFacing, turnSpeed: 0.07,
      stride: 0, strideTarget: 0, wag: 0.35, wagTarget: 0.35,
      phase: 0, ear: 0, earV: 0, bounce: 0, bounceV: 0,
      tilt: 0, tiltTarget: 0, gazeX: 0, gazeY: 0, gazeTarget: { x: 0, y: 0 },
      blinkAt: -1, nextBlink: 1.5, woofUntil: 0, pet: 0, petTarget: 0,
    };
    const damp = (dt, half) => 1 - Math.exp(-dt / Math.max(0.01, half));
    return {
      get facingDir() { return state.facingTarget; },
      setPose(p) { state.target = typeof p === 'string' ? { ...(POSES[p] || POSES.sit) } : p; },
      jump(p, f) { state.pose = { ...(POSES[p] || POSES.sit) }; state.target = { ...state.pose }; if (f) state.facing = state.facingTarget = f; },
      face(f, s = 0.07) { state.facingTarget = f; state.turnSpeed = s; },
      stride(v) { state.strideTarget = clamp(v, 0, 1); },
      walkedTo(px) { state.phase = (px / 46) * Math.PI; },
      wag(v) { state.wagTarget = clamp(v, 0, 1); },
      cock(deg) { state.tiltTarget = deg; },
      jolt(v = 1) { state.earV += 220 * v; },
      hop(v = 1) { state.bounceV = -230 * v; state.earV += 200 * v; },
      woof(t) { state.woofUntil = t + 0.34; state.bounceV = -150; state.earV += 260; },
      yawn(t, dur = 0.9) { state.woofUntil = t + dur; },
      petting(on) { state.petTarget = on ? 1 : 0; },
      reset() { state.tiltTarget = 0; state.petTarget = 0; },
      lookAt(pt) {
        if (!pt) { state.gazeTarget = { x: 0, y: 0 }; return; }
        const r = svg.getBoundingClientRect();
        if (!r.width) return;
        const cx = r.left + ((state.facingTarget > 0 ? 212 : 88) / 300) * r.width;
        const cy = r.top + (100 / 240) * r.height;
        const dx = pt.x - cx, dy = pt.y - cy, dist = Math.hypot(dx, dy) || 1, k = Math.min(1, dist / 160);
        state.gazeTarget = { x: (dx / dist) * k * state.facingTarget, y: (dy / dist) * k };
      },
      tick(dt, now) {
        dt = Math.min(dt, 0.05);
        state.pose = lerpPose(state.pose, state.target, damp(dt, 0.16));
        state.facing += (state.facingTarget - state.facing) * damp(dt, state.turnSpeed);
        state.stride += (state.strideTarget - state.stride) * damp(dt, 0.12);
        if (state.stride < 0.012 && state.strideTarget === 0) state.stride = 0;
        state.wag += (state.wagTarget - state.wag) * damp(dt, 0.35);
        state.gazeX += (state.gazeTarget.x - state.gazeX) * damp(dt, 0.07);
        state.gazeY += (state.gazeTarget.y - state.gazeY) * damp(dt, 0.07);
        state.tilt += (state.tiltTarget + 3 * state.gazeX - state.tilt) * damp(dt, 0.18);
        state.earV += (-150 * state.ear - 10 * state.earV) * dt;
        state.ear = clamp(state.ear + state.earV * dt, -28, 28);
        state.bounceV += (-260 * state.bounce - 16 * state.bounceV) * dt;
        state.bounce += state.bounceV * dt;
        state.pet += (state.petTarget - state.pet) * damp(dt, 0.15);

        if (now > state.nextBlink && state.pose.eyes > 0.6) {
          state.blinkAt = now;
          state.nextBlink = now + 2.2 + 3.8 * Math.random();
          if (Math.random() < 0.18) state.nextBlink = now + 0.32;
        }
        const blinkP = (now - state.blinkAt) / 0.15;
        const blink = blinkP >= 0 && blinkP <= 1 ? Math.sin(blinkP * Math.PI) : 0;

        const breath = Math.sin(now * 2.4) * 1.4;
        const p = state.pose;
        const st = state.stride;
        const ph = state.phase;
        const swA = Math.sin(ph) * 20 * st;
        const swB = -Math.sin(ph) * 20 * st;
        const wagRot = 14 + Math.sin(now * (6 + state.wag * 9)) * (10 + state.wag * 18);
        const bodyY = p.bodyY + state.bounce + breath * 0.5;
        const headY = p.headY + 1.15 * state.bounce + breath;
        const fScale = Math.abs(state.facing) < 0.02 ? 0.02 * Math.sign(state.facing || 1) : state.facing;

        els.get('root')?.setAttribute('transform', `translate(150 0) scale(${fScale.toFixed(3)} 1) translate(-150 0)`);
        els.get('shadow')?.setAttribute('opacity', (0.12 * p.bodyOp).toFixed(3));
        els.get('body')?.setAttribute('transform', `translate(0 ${bodyY.toFixed(2)}) rotate(${p.bodyRot.toFixed(1)} 196 206)`);
        els.get('body')?.setAttribute('opacity', p.bodyOp.toFixed(2));
        els.get('haunch')?.setAttribute('opacity', p.haunchOp.toFixed(2));
        els.get('paws')?.setAttribute('opacity', p.pawsOp.toFixed(2));
        els.get('head')?.setAttribute('transform', `translate(0 ${headY.toFixed(2)}) rotate(${(p.headRot + state.tilt).toFixed(2)} 212 100)`);
        els.get('tail')?.setAttribute('transform', `rotate(${wagRot.toFixed(1)} 84 150)`);
        els.get('earL')?.setAttribute('transform', `rotate(${(-6 - state.ear * 0.6).toFixed(1)} 174 82)`);
        els.get('earR')?.setAttribute('transform', `rotate(${(6 + state.ear * 0.6).toFixed(1)} 250 82)`);

        const legLift = p.bodyRot < -10 ? -p.bodyRot : 0;
        els.get('ff')?.setAttribute('transform', `translate(168 192) rotate(${(swA + legLift).toFixed(1)})`);
        els.get('bf')?.setAttribute('transform', `translate(94 192) rotate(${swB.toFixed(1)})`);
        els.get('fn')?.setAttribute('transform', `translate(186 194) rotate(${(swB + legLift).toFixed(1)})`);
        els.get('bn')?.setAttribute('transform', `translate(110 194) rotate(${swA.toFixed(1)})`);

        els.get('eyes')?.setAttribute('transform', `translate(${(state.gazeX * 5).toFixed(1)} ${(state.gazeY * 4).toFixed(1)})`);
        const happyMode = Math.max(p.happy, state.pet) > 0.72 || p.eyes < 0.4;
        els.get('open')?.setAttribute('opacity', !happyMode && blink < 0.5 ? '1' : '0');
        els.get('shut')?.setAttribute('opacity', !happyMode && blink >= 0.5 ? '1' : '0');
        els.get('happy')?.setAttribute('opacity', happyMode ? '1' : '0');
        els.get('tongue')?.setAttribute('opacity', now < state.woofUntil || p.mouth > 0.45 ? '1' : '0');
      },
    };
  }

  const spawnHearts = (host, x, y) => {
    for (let i = 0; i < 4; i++) {
      const h = document.createElement('span');
      h.className = 'pup-heart';
      h.textContent = '♥';
      h.style.left = `${x + (i - 1.5) * 14}px`;
      h.style.top = `${y - 8}px`;
      host.appendChild(h);
      h.animate([
        { opacity: 0, transform: 'translateY(0) scale(.5)' },
        { opacity: 1, transform: 'translateY(-18px) scale(1.1)', offset: 0.3 },
        { opacity: 0, transform: `translate(${(i - 1.5) * 12}px, -48px) scale(.8)` },
      ], { duration: 1100 + i * 120, easing: 'ease-out' }).onfinish = () => h.remove();
    }
  };

  // Mount subpage buddies ([data-pup-buddy])
  document.querySelectorAll('[data-pup-buddy]').forEach((wrap) => {
    const pose = wrap.dataset.pupBuddy || 'sit';
    const facing = wrap.dataset.facing === 'left' ? -1 : 1;
    const act = wrap.dataset.act || '';
    const box = document.createElement('div');
    box.className = 'pup-buddy';
    box.dataset.facing = wrap.dataset.facing || 'right';
    box.innerHTML = `${PUP_SVG_HTML}<span class="pup-bubble" data-show="false"></span>`;
    wrap.replaceChildren(box);
    const svg = box.querySelector('svg');
    const bubble = box.querySelector('.pup-bubble');
    const pup = createPup(svg, pose, facing);
    let last = performance.now() / 1000, cueUntil = 0, mouse = null;
    if (prefersReduced()) { pup.tick(0, last); return; }

    box.dataset.live = 'true';
    window.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') mouse = { x: e.clientX, y: e.clientY, t: performance.now() / 1000 }; }, { passive: true });
    box.addEventListener('click', () => {
      const now = performance.now() / 1000;
      pup.hop(1.15); pup.woof(now); pup.wag(1);
      if (bubble) { bubble.textContent = act === 'tilt' ? 'ask away!' : 'woof!'; bubble.dataset.show = 'true'; cueUntil = now + 1.5; }
    });
    const loop = () => {
      const now = performance.now() / 1000;
      const dt = Math.min(0.05, now - last); last = now;
      if (mouse && now - mouse.t < 2.2) pup.lookAt(mouse); else pup.lookAt(null);
      if (act === 'tilt') pup.cock(Math.sin(now * 0.9) > 0.35 ? 13 : Math.sin(now * 0.9) < -0.35 ? -10 : 0);
      if (bubble && bubble.dataset.show === 'true' && now > cueUntil) bubble.dataset.show = 'false';
      pup.tick(dt, now);
      window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
  });

  // Home full PupJourney walker (Desktop stops + Mobile edge-peeking lane!)
  (() => {
    const rawStops = [...document.querySelectorAll('[data-pup-stop]')].filter((el) => el.getClientRects().length);
    if (rawStops.length < 2 || prefersReduced()) return;

    const printsHost = document.createElement('div');
    printsHost.className = 'pup-prints';
    printsHost.setAttribute('aria-hidden', 'true');
    const printNodes = Array.from({ length: 24 }, () => {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('viewBox', '0 0 64 64');
      s.innerHTML = `<path d="${PAW_PATH}"></path>`;
      printsHost.appendChild(s);
      return s;
    });
    document.body.appendChild(printsHost);

    const layer = document.createElement('div');
    layer.className = 'pup-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.dataset.front = 'true';
    layer.innerHTML = `<div class="pup-actor"><div class="pup-actor__body">${PUP_SVG_HTML}</div><span class="pup-bubble-at"><span class="pup-bubble" data-show="false"></span></span></div>`;
    document.body.appendChild(layer);

    const actor = layer.querySelector('.pup-actor');
    const bodyWrap = layer.querySelector('.pup-actor__body');
    const svg = bodyWrap.querySelector('svg');
    const bubbleAt = layer.querySelector('.pup-bubble-at');
    const bubble = layer.querySelector('.pup-bubble');
    const waBar = document.querySelector('[data-whatsapp-bar]');

    const measureStops = () => {
      const mobileLane = window.matchMedia('(max-width: 767px), (pointer: coarse) and (max-height: 519px)').matches;
      document.documentElement.dataset.pup = mobileLane ? 'lane' : 'live';
      const cw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const stops = [];
      const addNodeStop = (el) => {
        const rect = el.getBoundingClientRect();
        const pose = el.dataset.pose || 'sit';
        const act = el.dataset.act || '';
        const baseScale = rect.width / 300;
        const s = act === 'basket' || mobileLane ? baseScale : baseScale * 1.12;
        const pt = pose === 'peek' ? { x: 150, y: 159 } : { x: 150, y: 228 };
        let stickyParent = null;
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          if (window.getComputedStyle(p).position === 'sticky') { stickyParent = p; break; }
        }
        let track;
        if (!stickyParent) {
          track = { kind: 'page', top: rect.top + window.scrollY + pt.y * (baseScale - s) };
        } else {
          const stTop = parseFloat(window.getComputedStyle(stickyParent).top) || 0;
          const relY = rect.top - stickyParent.getBoundingClientRect().top;
          const prevPos = stickyParent.style.position;
          stickyParent.style.position = 'relative';
          const stRect = stickyParent.getBoundingClientRect();
          const pr = stickyParent.parentElement;
          const prBottom = pr.getBoundingClientRect().bottom - (parseFloat(window.getComputedStyle(pr).paddingBottom) || 0);
          stickyParent.style.position = prevPos;
          const from = stRect.top + window.scrollY - stTop;
          const to = prBottom + window.scrollY - stRect.height - stTop;
          track = to <= from
            ? { kind: 'page', top: stRect.top + window.scrollY + relY + pt.y * (baseScale - s) }
            : { kind: 'pin', top: stTop + relY + pt.y * (baseScale - s), from, to };
        }
        const scene = el.closest('[data-pup-scene]');
        const x = rect.left + pt.x * (baseScale - s) + 150 * s;
        const holdTop = track.kind === 'pin' ? track.from : track.top - vh * 0.56;
        const holdBot = track.kind === 'pin' ? track.to : track.top - vh * 0.28;
        stops.push({
          x, track, s, behind: el.dataset.behind === 'true', sink: 0,
          box: STOP_BOX[pose] || STOP_BOX.def,
          scene, pose, facing: el.dataset.facing === 'left' ? -1 : 1, act,
          looks: scene ? [...scene.querySelectorAll('[data-pup-look]')] : [],
          treadmill: act === 'treadmill' ? scene?.querySelector('[data-treadmill]') : null,
          hold: [Math.min(holdTop, holdBot), Math.max(holdTop, holdBot)],
        });
      };

      const activeStops = rawStops.filter((el) => el.getClientRects().length);
      if (mobileLane) {
        const laneEls = activeStops.filter((el) => el.dataset.lane === 'true');
        if (laneEls[0]) addNodeStop(laneEls[0]);
        const heroScene = laneEls[0]?.closest('[data-pup-scene]') || null;
        const scenes = [...document.querySelectorAll('#main [data-pup-scene]')].filter((el) => el !== heroScene && el.getClientRects().length);
        const sScale = clamp(cw / 650, 0.48, 0.6);
        const peekBox = STOP_BOX.peek;
        scenes.forEach((sc, i) => {
          const leftSide = i % 2 === 0;
          const x = leftSide ? 10 - peekBox[0] * sScale + 150 * sScale : cw - 10 - peekBox[2] * sScale + 150 * sScale;
          const scRect = sc.getBoundingClientRect();
          const h0 = scRect.top + window.scrollY - vh * 0.42;
          const h1 = scRect.bottom + window.scrollY - vh * 0.58;
          stops.push({
            x, track: { kind: 'screen', top: 0 }, s: sScale, behind: false, sink: 228 - 159,
            box: peekBox, scene: sc, pose: 'peek', facing: leftSide ? 1 : -1, act: 'lane',
            looks: [], treadmill: null,
            hold: [Math.min(h0, h1), Math.max(h0, h1)],
          });
        });
        if (laneEls.length > 1) addNodeStop(laneEls[laneEls.length - 1]);
      } else {
        activeStops.forEach(addNodeStop);
      }

      // Normalize holds so transitions never overlap
      if (stops.length) {
        stops[0].hold[0] = -1e7;
        stops[stops.length - 1].hold[1] = 1e7;
        for (let i = 0; i < stops.length - 1; i++) {
          const a = stops[i].hold, b = stops[i + 1].hold;
          const minGap = clamp(Math.abs(stops[i + 1].x - stops[i].x) * 0.7 + vh * 0.25, vh * 0.28, vh * 1.15);
          if (b[0] - a[1] < minGap) {
            const mid = (a[1] + b[0]) / 2;
            a[1] = Math.max(a[0], mid - minGap / 2);
            b[0] = Math.min(b[1], mid + minGap / 2);
          }
        }
      }
      return { lane: mobileLane, stops };
    };

    let data = measureStops();
    if (data.stops.length < 2) return;

    const firstStop = data.stops[0];
    const pup = createPup(svg, firstStop.pose, firstStop.facing);
    let lastTime = performance.now() / 1000;
    let settledK = -1, idleAt = lastTime, nextYawnAt = lastTime + 2.5, mouse = null, lookCue = null;
    let bubbleUntil = 0, lastPos = null, lastStepPrint = -1, printCursor = 0, lastTreadmillLeft = null, trickQueue = [];

    const say = (text, secs = 1.5) => {
      if (!bubble) return;
      bubble.textContent = text;
      bubble.dataset.show = 'true';
      bubbleUntil = performance.now() / 1000 + secs;
    };

    // Hero opening peekaboo choreography
    if (firstStop.act === 'peekaboo' && window.scrollY < 160) {
      settledK = 0;
      const now = performance.now() / 1000;
      const ducked = { ...POSES.peek, headY: 120 };
      trickQueue = [
        [now + 0.12, () => pup.setPose(ducked)],
        [now + 0.72, () => { pup.setPose('peek'); pup.jolt(1.2); say('peekaboo!', 1.6); }],
        [now + 1.85, () => pup.wag(1)],
      ];
    }

    window.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') mouse = { x: e.clientX, y: e.clientY, t: performance.now() / 1000 }; }, { passive: true });
    window.addEventListener('pup:cue', (e) => {
      const d = e.detail || {};
      const now = performance.now() / 1000;
      if (d.look) lookCue = { el: d.look, until: now + (d.secs || 1.4) };
      if (d.say) say(d.say, d.secs || 1.4);
    });
    window.addEventListener('focusin', (e) => {
      if (e.target instanceof HTMLElement && e.target.matches('a, button, input, select, textarea, summary')) {
        lookCue = { el: e.target, until: performance.now() / 1000 + 1.4 };
      }
    });

    // Click interactive tricks + pet hover
    const TRICKS = ['woof', 'hop', 'spin', 'love', 'beg'];
    let trickIdx = 0;
    actor.addEventListener('click', () => {
      const now = performance.now() / 1000;
      const t = TRICKS[trickIdx++ % TRICKS.length];
      if (t === 'woof') { pup.woof(now); say('woof!', 1.3); }
      else if (t === 'hop') { pup.hop(1.3); say('wheee!', 1.3); }
      else if (t === 'spin') {
        pup.hop(0.6);
        const orig = pup.facingDir;
        trickQueue = [[now + 0.14, () => pup.face(-orig)], [now + 0.38, () => pup.face(orig)], [now + 0.62, () => say('wheee!', 1.2)]];
      } else if (t === 'love') {
        pup.wag(1); pup.hop(0.5); say('I like you!', 1.5);
        spawnHearts(layer, parseFloat(actor.dataset.px || '200'), parseFloat(actor.dataset.py || '200'));
      } else {
        pup.setPose('beg'); pup.wag(1); say('treat, please?', 1.5);
        trickQueue = [[now + 1.6, () => pup.setPose(data.stops[Math.max(0, settledK)]?.pose || 'sit')]];
      }
    });
    actor.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { pup.petting(true); pup.wag(1); } });
    actor.addEventListener('pointerleave', () => pup.petting(false));

    const getStopY = (stop, sy) => {
      let top = stop.track.top;
      if (stop.track.kind === 'page') top -= sy;
      else if (stop.track.kind === 'screen') {
        const bottomEdge = waBar && waBar.getClientRects().length ? waBar.getBoundingClientRect().top : window.innerHeight - 6;
        top = bottomEdge - 159 * stop.s;
      } else if (sy < stop.track.from) top -= sy - stop.track.from;
      else if (sy > stop.track.to) top -= sy - stop.track.to;
      return top + 228 * stop.s;
    };

    const evalJourney = (sy) => {
      const { stops } = data;
      let k = 0, t = 0;
      if (sy <= stops[0].hold[1]) { k = 0; t = 0; }
      else {
        let found = false;
        for (let i = 0; i < stops.length - 1; i++) {
          if (sy < stops[i + 1].hold[0]) {
            k = i; t = clamp((sy - stops[i].hold[1]) / Math.max(1, stops[i + 1].hold[0] - stops[i].hold[1]), 0, 1);
            found = true; break;
          }
          if (sy <= stops[i + 1].hold[1]) { k = i + 1; t = 0; found = true; break; }
        }
        if (!found) { k = stops.length - 1; t = 0; }
      }
      if (t <= 0 || k >= stops.length - 1) {
        const s = stops[k];
        return { x: s.x, y: getStopY(s, sy), s: s.s, front: !s.behind, airborne: false, k, t: 0 };
      }
      const a = stops[k], b = stops[k + 1];
      const u = t * t * (3 - 2 * t);
      const ax = a.x, ay = getStopY(a, sy), bx = b.x, by = getStopY(b, sy);
      let px = lerp(ax, bx, u), py = lerp(ay, by, u);
      const jumpH = Math.sin(u * Math.PI) * ((a.behind || b.behind) ? 56 : 18);
      py -= jumpH;
      const scale = lerp(a.s, b.s, u);
      const front = !(a.behind && u < 0.25) && !(b.behind && u > 0.78);
      return { x: px, y: py, s: scale, front, airborne: jumpH > 20, k, t: u };
    };

    const tick = () => {
      const now = performance.now() / 1000;
      const dt = Math.min(0.05, now - lastTime); lastTime = now;
      while (trickQueue.length && trickQueue[0][0] <= now) trickQueue.shift()[1](now);

      const sy = window.scrollY;
      const pos = evalJourney(sy);
      const activeStop = data.stops[pos.k];

      if (pos.t === 0) {
        if (settledK !== pos.k) {
          settledK = pos.k;
          idleAt = now;
          lastTreadmillLeft = null;
          pup.reset();
          pup.setPose(activeStop.pose);
          pup.face(activeStop.facing, 0.14);
          pup.stride(0);
          pup.wag(activeStop.act === 'basket' ? 0.3 : 0.7);
          pup.jolt(0.4);
          nextYawnAt = now + 2.4;
        }
        if (activeStop.treadmill) {
          const left = activeStop.treadmill.getBoundingClientRect().left;
          const delta = lastTreadmillLeft === null ? 0 : left - lastTreadmillLeft;
          lastTreadmillLeft = left;
          pup.walkedTo(-left / pos.s);
          if (Math.abs(delta) > 0.15) {
            idleAt = now;
            pup.setPose('walk'); pup.stride(1);
            pup.face(delta < 0 ? 1 : -1, 0.16);
          } else if (now - idleAt > 0.25) {
            pup.setPose('stand'); pup.stride(0);
          }
        } else if (activeStop.act === 'tilt') {
          const s = Math.sin(0.9 * now);
          pup.cock(s > 0.35 ? 13 : s < -0.35 ? -10 : 0);
        } else if (activeStop.act === 'basket' && now > nextYawnAt) {
          nextYawnAt = now + 4.5 + Math.random() * 3;
          if (Math.random() < 0.7) pup.jolt(0.55);
          else pup.yawn(now, 0.7);
        }
      } else {
        settledK = -1;
        const stepDist = lastPos ? Math.hypot(pos.x - lastPos.x, pos.y - lastPos.y) : 0;
        if (pos.airborne) { pup.setPose('hop'); pup.stride(0); }
        else if (stepDist > 0.3) {
          pup.setPose('walk'); pup.stride(1);
          pup.walkedTo((stepDist + pos.t * 420) / Math.max(0.1, pos.s));
          if (Math.abs(pos.x - lastPos.x) > 0.6) pup.face(pos.x - lastPos.x > 0 ? 1 : -1, 0.16);
        } else {
          pup.setPose('stand'); pup.stride(0);
        }

        // Document-space paw prints on desktop walk
        if (!data.lane && !pos.airborne && lastPos && stepDist > 0.4) {
          const bucket = Math.floor((sy + pos.x * 0.5) / 48);
          if (bucket !== lastStepPrint) {
            lastStepPrint = bucket;
            const node = printNodes[printCursor++ % printNodes.length];
            const sz = 14 * Math.max(0.75, pos.s * 1.4);
            const ang = Math.atan2(pos.y - lastPos.y, pos.x - lastPos.x) + Math.PI / 2;
            const px = pos.x + ((printCursor & 1) ? 8 : -8);
            const py = pos.y + sy - 6;
            node.style.width = node.style.height = `${sz.toFixed(1)}px`;
            node.style.transform = `translate(${(px - sz / 2).toFixed(1)}px, ${(py - sz / 2).toFixed(1)}px) rotate(${ang.toFixed(2)}rad)`;
            node.animate([{ opacity: 0 }, { opacity: 0.45, offset: 0.1 }, { opacity: 0.45, offset: 0.5 }, { opacity: 0 }], { duration: 2400, easing: 'ease-out' });
          }
        }
      }

      lastPos = { x: pos.x, y: pos.y };

      // Mark [data-here] & [data-visited] scenes (drives welcome door swing & hero lineup duck)
      data.stops.forEach((st, idx) => {
        if (!st.scene) return;
        st.scene.dataset.here = String(pos.t === 0 && idx === pos.k);
        st.scene.dataset.visited = String(idx <= pos.k || (idx === pos.k + 1 && pos.t > 0.85));
      });

      if (lookCue && lookCue.until > now) {
        const r = lookCue.el.getBoundingClientRect();
        pup.lookAt({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      } else if (mouse && now - mouse.t < 2.5) {
        pup.lookAt(mouse);
      } else {
        pup.lookAt(null);
      }

      const drawX = pos.x - 150 * pos.s;
      const drawY = pos.y - 228 * pos.s;
      actor.dataset.px = String(pos.x);
      actor.dataset.py = String(pos.y);
      actor.style.transform = `translate3d(${drawX.toFixed(1)}px, ${drawY.toFixed(1)}px, 0)`;
      bodyWrap.style.transform = `scale(${pos.s.toFixed(4)})`;
      layer.dataset.front = String(pos.front);
      if (bubbleAt) bubbleAt.style.transform = `translate(${((pup.facingDir > 0 ? 214 : 86) * pos.s).toFixed(1)}px, ${(30 * pos.s).toFixed(1)}px)`;
      if (bubble && bubble.dataset.show === 'true' && now > bubbleUntil) bubble.dataset.show = 'false';

      pup.tick(dt, now);
      window.requestAnimationFrame(tick);
    };

    let remeasureTimer = 0;
    const remeasure = () => {
      window.clearTimeout(remeasureTimer);
      remeasureTimer = window.setTimeout(() => {
        const next = measureStops();
        if (next.stops.length >= 2) data = next;
      }, 120);
    };
    window.addEventListener('resize', remeasure, { passive: true });
    window.addEventListener('load', remeasure);
    if (document.fonts) document.fonts.ready.then(remeasure);
    window.requestAnimationFrame(tick);
  })();

  // ── 14. Hero Lineup Cycling + Overlay Tag Badges ───────────────────────
  (() => {
    const lineupEl = document.querySelector('.tp-lineup[aria-label]');
    const tagsEl = document.querySelector('.tp-lineup--tags');
    const jsonEl = document.querySelector('[data-lineup]');
    if (!lineupEl || !jsonEl) return;
    const pool = JSON.parse(jsonEl.textContent || '[]');
    const seats = [...lineupEl.querySelectorAll('.tp-lineup__pup')];
    const ghosts = tagsEl ? [...tagsEl.querySelectorAll('.tp-lineup__ghost')] : [];
    const nameEls = ghosts.map((g) => g.querySelector('.tp-lineup__name'));

    seats.forEach((seat, idx) => {
      const showTag = () => { if (ghosts[idx]) ghosts[idx].dataset.tag = 'show'; };
      const hideTag = () => { if (ghosts[idx]) delete ghosts[idx].dataset.tag; };
      seat.addEventListener('pointerenter', showTag);
      seat.addEventListener('pointerleave', hideTag);
      seat.addEventListener('focus', showTag);
      seat.addEventListener('blur', hideTag);
    });

    if (prefersReduced() || pool.length <= seats.length) return;
    const intervals = [1900, 2500, 1700, 2300, 2000, 2800, 1800];
    const shownIndices = seats.map((_, i) => i);
    const waiting = pool.map((_, i) => i).filter((i) => !shownIndices.includes(i));
    let lastSeat = -1, lastInteract = 0, turn = 0;

    ['scroll', 'pointerdown'].forEach((ev) => window.addEventListener(ev, () => { lastInteract = performance.now(); }, { passive: true }));
    lineupEl.addEventListener('pointerover', () => { lastInteract = performance.now(); }, { passive: true });

    const heroScene = lineupEl.closest('[data-pup-scene]');
    const step = () => {
      if (document.hidden || performance.now() - lastInteract < 1200 || heroScene?.dataset.here === 'false') {
        window.setTimeout(step, 900);
        return;
      }
      const choices = seats.map((_, i) => i).filter((i) => i !== lastSeat && seats[i].getClientRects().length);
      const idx = choices[Math.floor(Math.random() * choices.length)] ?? 0;
      lastSeat = idx;
      const nextPupIdx = waiting.shift();
      const prevPupIdx = shownIndices[idx];
      shownIndices[idx] = nextPupIdx;
      waiting.push(prevPupIdx);

      const seat = seats[idx];
      const nextPup = pool[nextPupIdx];
      seat.dataset.state = 'duck';
      window.setTimeout(() => {
        seat.href = nextPup.href;
        seat.setAttribute('aria-label', `Meet ${nextPup.name}`);
        const img = seat.querySelector('img');
        if (img) img.src = nextPup.src;
        if (nameEls[idx]) nameEls[idx].textContent = nextPup.name;
        seat.dataset.state = 'pop';
        if (ghosts[idx]) ghosts[idx].dataset.tag = 'show';
        window.setTimeout(() => { if (ghosts[idx]) delete ghosts[idx].dataset.tag; }, 1800);
        window.setTimeout(() => { delete seat.dataset.state; }, 700);
      }, 360);

      window.setTimeout(step, intervals[turn++ % intervals.length]);
    };
    window.setTimeout(step, 2400);
  })();

  // ── 15. LetterForm Validation + Mailbox Fold Animation + WhatsApp Draft ─
  document.querySelectorAll('[data-enquiry]').forEach((form) => {
    const postBox = form.closest('.tp-post');
    const sceneEl = postBox?.querySelector('.tp-post__scene');
    const sentEl = postBox?.querySelector('[data-sent-panel]');
    const status = postBox?.querySelector('.form-status') || form.querySelector('.form-status');
    const phoneInput = form.elements.phone;
    const nameInput = form.elements.name;

    const clearInvalid = (el) => () => { el.setCustomValidity(''); el.removeAttribute('aria-invalid'); };
    phoneInput?.addEventListener('input', clearInvalid(phoneInput));
    nameInput?.addEventListener('input', clearInvalid(nameInput));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = (nameInput?.value || '').trim();
      const phoneVal = (phoneInput?.value || '').trim();

      if (nameInput && nameVal.length < 2) {
        nameInput.setCustomValidity('Please enter your name.');
        nameInput.setAttribute('aria-invalid', 'true');
      } else {
        nameInput?.setCustomValidity('');
        nameInput?.removeAttribute('aria-invalid');
      }

      if (phoneInput && phoneVal.replace(/\D/g, '').length < 7) {
        phoneInput.setCustomValidity('Enter a phone or WhatsApp number with country code.');
        phoneInput.setAttribute('aria-invalid', 'true');
      } else {
        phoneInput?.setCustomValidity('');
        phoneInput?.removeAttribute('aria-invalid');
      }

      if (!form.reportValidity()) return;

      const d = Object.fromEntries(new FormData(form));
      const puppy = form.dataset.puppyName || d.puppy;
      const lines = [
        'Hello TeddyPups U.A.E.!',
        `Name: ${nameVal}`,
        `Phone: ${phoneVal}`,
        d.email ? `Email: ${d.email}` : '',
        d.area ? `Area: ${d.area}` : '',
        puppy ? `Puppy: ${puppy}` : '',
        d.message ? `Message: ${d.message}` : '',
      ].filter(Boolean);
      const url = `https://wa.me/${form.dataset.phone}?text=${encodeURIComponent(lines.join('\n'))}`;
      window.open(url, '_blank', 'noopener,noreferrer');

      // Show role="status" link immediately so test assertions & fallback never wait
      if (status) {
        status.hidden = false;
        status.innerHTML = '';
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Open the WhatsApp draft';
        status.append('WhatsApp draft ready — ', a, ' to review and send.');
      }

      if (postBox && sceneEl && sentEl && !prefersReduced()) {
        postBox.style.minHeight = `${form.offsetHeight}px`;
        postBox.dataset.phase = 'sealing';
        sceneEl.hidden = false;
        window.setTimeout(() => {
          postBox.dataset.phase = 'posting';
        }, 720);
        window.setTimeout(() => {
          postBox.dataset.phase = 'sent';
          form.hidden = true;
          sceneEl.hidden = true;
          sentEl.hidden = false;
        }, 1680);
      }
    });
  });
})();

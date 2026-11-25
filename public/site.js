const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const curtain = document.querySelector('.tp-curtain');
if (curtain) {
  if (reducedMotion) curtain.dataset.state = 'idle';
  else {
    const finishIntro = () => {
      if (curtain.dataset.state === 'intro') curtain.dataset.state = 'idle';
    };
    const blanket = curtain.querySelector('.tp-curtain__blanket');
    blanket?.addEventListener('animationend', (event) => {
      if (event.animationName === 'tp-curtain-lift') finishIntro();
    });
    const lift = blanket?.getAnimations().find((a) => a.animationName === 'tp-curtain-lift');
    const remaining = lift ? Math.max(0, 1080 - Number(lift.currentTime || 0)) : 1080;
    setTimeout(finishIntro, remaining + 60);
  }
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) curtain.dataset.state = 'idle';
  });
}

const menu = document.querySelector('#mobile-menu');
const menuToggle = document.querySelector('[data-menu]');
[...menu.querySelectorAll('nav a')].forEach((item, index) => item.style.setProperty('--mi', String(index)));
menuToggle.addEventListener('click', () => {
  menu.showModal();
  menuToggle.setAttribute('aria-expanded', 'true');
});
menu.querySelector('[data-close-menu]').addEventListener('click', () => menu.close());
menu.addEventListener('close', () => menuToggle.setAttribute('aria-expanded', 'false'));

if (curtain && !reducedMotion) {
  let navigating = false;
  document.addEventListener('click', (event) => {
    if (navigating || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest('a[href]');
    if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
    const url = new URL(anchor.href, location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search && url.hash)) return;
    event.preventDefault();
    navigating = true;
    if (menu.open) menu.close();
    curtain.dataset.state = 'covering';
    setTimeout(() => location.assign(url.href), 300);
  });
}

const filters = document.querySelector('[data-filters]');
if (filters) {
  const chips = [...filters.querySelectorAll('[data-key]')];
  const cards = [...document.querySelectorAll('[data-puppy]')];
  const count = document.querySelector('[data-result]');
  const empty = document.querySelector('[data-empty]');
  const reset = filters.querySelector('[data-reset]');
  const keys = ['origin', 'breed', 'gender'];

  function renderFilters() {
    const params = new URL(location.href).searchParams;
    const origin = params.get('origin') || '';
    const breed = params.get('breed') || '';
    const sex = params.get('gender') || '';
    let matches = 0;
    for (const card of cards) {
      const data = card.dataset;
      const originMatches = origin === 'korean-teacup' ? data.korean === 'true' : data.origin === origin;
      card.hidden = Boolean((origin && !originMatches) || (breed && !data.breeds.split(' ').includes(breed)) || (sex && !data.sex.split(' ').includes(sex)));
      if (!card.hidden) matches += 1;
    }
    for (const chip of chips) {
      chip.setAttribute('aria-pressed', String((params.get(chip.dataset.key) || '') === chip.dataset.value));
    }
    const filtered = Boolean(origin || breed || sex);
    const noun = matches === 1 ? 'puppy' : 'puppies';
    count.textContent = `${matches} ${noun} ${filtered ? (matches === 1 ? 'matches' : 'match') : 'looking for a home'}`;
    empty.hidden = matches !== 0;
    reset.hidden = !filtered;
  }

  function updateParams(update) {
    const url = new URL(location.href);
    update(url.searchParams);
    history.pushState(null, '', url);
    renderFilters();
  }

  for (const chip of chips) {
    chip.addEventListener('click', () => updateParams((params) => {
      const { key, value } = chip.dataset;
      if (value && params.get(key) !== value) params.set(key, value);
      else params.delete(key);
    }));
  }
  reset.addEventListener('click', () => {
    updateParams((params) => keys.forEach((key) => params.delete(key)));
    chips[0].focus();
  });
  window.addEventListener('popstate', renderFilters);
  renderFilters();
}

const search = document.querySelector('#faq-search');
if (search) {
  const notes = [...document.querySelectorAll('.faq-note')];
  const count = document.querySelector('[data-faq-count]');
  const empty = document.querySelector('[data-no-faq]');
  search.addEventListener('input', () => {
    const words = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let matches = 0;
    for (const note of notes) {
      const text = note.textContent.toLowerCase();
      note.hidden = !words.every((word) => text.includes(word));
      if (!note.hidden) matches += 1;
    }
    count.textContent = `${matches} ${matches === 1 ? 'note' : 'notes'} on the board`;
    empty.hidden = matches !== 0;
  });
}

const tabs = [...document.querySelectorAll('.journey-tabs [role="tab"]')];
function selectTab(selected, focus) {
  for (const tab of tabs) {
    const active = selected === tab;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  }
  if (focus) selected.focus();
}
for (const [index, tab] of tabs.entries()) {
  tab.addEventListener('click', () => selectTab(tab, false));
  tab.addEventListener('keydown', (event) => {
    const last = tabs.length - 1;
    const destinations = { ArrowLeft: (index + last) % tabs.length, ArrowRight: (index + 1) % tabs.length, Home: 0, End: last };
    if (Object.hasOwn(destinations, event.key)) {
      event.preventDefault();
      selectTab(tabs[destinations[event.key]], true);
    }
  });
}

const lightbox = document.querySelector('.lightbox');
const lightBody = lightbox.querySelector('[data-light-media]');
const lightCaption = lightbox.querySelector('figcaption');
const lightPrev = lightbox.querySelector('.light-prev');
const lightNext = lightbox.querySelector('.light-next');
let lightItems = [];
let lightIndex = 0;
let lightTrigger;

function makeMedia(item) {
  if (item.video) {
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = item.src;
    if (item.poster) video.poster = item.poster;
    video.setAttribute('aria-label', item.alt);
    return video;
  }
  const image = new Image();
  image.alt = item.alt;
  image.src = item.src;
  return image;
}

function showLight(index) {
  lightIndex = (index + lightItems.length) % lightItems.length;
  const item = lightItems[lightIndex];
  lightBody.replaceChildren(makeMedia(item));
  lightCaption.textContent = `${lightIndex + 1} / ${lightItems.length} · ${item.alt}`;
}

function openLight(items, index, trigger) {
  lightItems = items;
  lightTrigger = trigger;
  lightPrev.disabled = lightNext.disabled = items.length < 2;
  showLight(index);
  lightbox.showModal();
}

lightbox.querySelector('.light-close').addEventListener('click', () => lightbox.close());
lightPrev.addEventListener('click', () => showLight(lightIndex - 1));
lightNext.addEventListener('click', () => showLight(lightIndex + 1));
lightbox.addEventListener('close', () => {
  lightBody.replaceChildren();
  lightTrigger?.focus({ preventScroll: true });
});
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener('keydown', (event) => {
  if (lightItems.length < 2 || event.target.tagName === 'VIDEO') return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showLight(lightIndex + (event.key === 'ArrowLeft' ? -1 : 1));
  }
});

for (const wall of document.querySelectorAll('[data-wall]')) {
  const items = JSON.parse(wall.querySelector('[data-media]').textContent);
  wall.addEventListener('click', (event) => {
    const button = event.target.closest('[data-photo]');
    if (button) openLight(items, Number(button.dataset.photo), button);
  });
}

const story = document.querySelector('[data-story]');
if (story) {
  const items = JSON.parse(story.querySelector('[data-media]').textContent);
  const pane = story.querySelector('.story-media');
  const expand = story.querySelector('[data-expand]');
  const count = story.querySelector('[data-story-count]');
  const thumbs = [...story.querySelectorAll('[data-thumb]')];
  let active = 0;
  function showStory(index) {
    active = (index + items.length) % items.length;
    pane.replaceChildren(makeMedia(items[active]));
    count.textContent = `${active + 1} / ${items.length}`;
    thumbs.forEach((thumb, i) => thumb.setAttribute('aria-pressed', String(i === active)));
  }
  story.querySelector('[data-prev]')?.addEventListener('click', () => showStory(active - 1));
  story.querySelector('[data-next]')?.addEventListener('click', () => showStory(active + 1));
  for (const [index, thumb] of thumbs.entries()) thumb.addEventListener('click', () => showStory(index));
  expand.addEventListener('click', () => {
    pane.querySelector('video')?.pause();
    openLight(items, active, expand);
  });
}

const chat = document.querySelector('[data-chat]');
if (chat) {
  const reply = chat.querySelector('.phone-response');
  const video = chat.querySelector('[data-showroom-video]');
  video.addEventListener('click', () => openLight([{ src: video.dataset.showroomVideo, video: true, alt: 'Showroom puppy video', poster: video.querySelector('img').src }], 0, video));
  const chatObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      reply.hidden = false;
      chatObserver.disconnect();
    }
  }, { threshold: 0.2 });
  chatObserver.observe(chat);
}

if (!reducedMotion) {
  const doors = new IntersectionObserver((entries) => {
    for (const entry of entries) entry.target.classList.toggle('is-near', entry.isIntersecting);
  }, { rootMargin: '-16% 0px -12% 0px', threshold: 0.6 });
  for (const door of document.querySelectorAll('.door-card')) doors.observe(door);

  const revealTargets = [...document.querySelectorAll('.stamp, .polaroid, .sketch')];
  if (revealTargets.length) {
    for (const el of revealTargets) {
      el.setAttribute('data-reveal', '');
      el.setAttribute('data-armed', '');
    }
    const revealObs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-revealed', 'true');
          revealObs.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0.04 });
    const armReveals = () => {
      for (const el of revealTargets) {
        const rect = el.getBoundingClientRect();
        if (rect.top < innerHeight * 0.96 && rect.bottom > 0) el.setAttribute('data-revealed', 'true');
        else revealObs.observe(el);
      }
    };
    const revealDelay = curtain && curtain.dataset.state === 'intro' ? 620 : 0;
    setTimeout(armReveals, revealDelay);
  }

  const PAW_D = 'M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z';
  const fineMouse = matchMedia('(hover: hover) and (pointer: fine)');
  if (fineMouse.matches) {
    const trailCanvas = document.createElement('canvas');
    trailCanvas.className = 'paw-trail-canvas';
    trailCanvas.setAttribute('aria-hidden', 'true');
    document.body.append(trailCanvas);
    const ctx = trailCanvas.getContext('2d');
    const pawPath = new Path2D(PAW_D);
    const prints = [];
    let dpr = Math.min(devicePixelRatio || 1, 2);
    let lastX = null;
    let lastY = null;
    let dist = 0;
    let side = 1;
    let rafId = 0;
    const sizeCanvas = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      trailCanvas.width = Math.round(innerWidth * dpr);
      trailCanvas.height = Math.round(innerHeight * dpr);
    };
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas, { passive: true });
    const renderTrail = (now) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      while (prints.length && now - prints[0].born > 1000) prints.shift();
      for (const item of prints) {
        const age = now - item.born;
        const life = age < 600 ? 1 : 1 - (age - 600) / 400;
        ctx.save();
        ctx.globalAlpha = 0.42 * life * life;
        ctx.fillStyle = '#c2622b';
        ctx.translate(item.x * dpr, item.y * dpr);
        ctx.rotate(item.angle);
        ctx.scale(0.27 * dpr, 0.27 * dpr);
        ctx.translate(-32, -34);
        ctx.fill(pawPath);
        ctx.restore();
      }
      if (prints.length) rafId = requestAnimationFrame(renderTrail);
      else rafId = 0;
    };
    window.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      if (lastX === null) {
        lastX = event.clientX;
        lastY = event.clientY;
        return;
      }
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      dist += Math.hypot(dx, dy);
      if (dist < 46) return;
      dist = 0;
      side = -side;
      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      const offset = 7 * side;
      prints.push({
        x: event.clientX + Math.cos(angle) * offset + 14,
        y: event.clientY + Math.sin(angle) * offset + 16,
        angle,
        born: performance.now(),
      });
      if (prints.length > 14) prints.shift();
      if (!rafId) rafId = requestAnimationFrame(renderTrail);
    }, { passive: true });
  }

  const PUP_SVG_HTML = `<svg viewBox="0 0 300 240" aria-hidden="true" focusable="false" style="overflow:visible"><g data-p="root"><ellipse cx="150" cy="230" data-p="shadow" fill="#2a170e" opacity="0.12" rx="92" ry="7" style="transform-box:fill-box;transform-origin:center"></ellipse><g data-p="body"><g data-p="bf" transform="translate(94 192)"><path d="M-14 -14 C-14 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 14 4 14 -14Z" fill="#e4a352"></path><path d="M-14 -14 C-14 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 14 4 14 -14" fill="none" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.4"></path><path d="M-3.5 29 v5 M4.5 29 v5" fill="none" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"></path></g><g data-p="ff" transform="translate(168 192)"><path d="M-11 -14 C-11 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 11 4 11 -14Z" fill="#e4a352"></path><path d="M-11 -14 C-11 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 11 4 11 -14" fill="none" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.4"></path><path d="M-3.5 29 v5 M4.5 29 v5" fill="none" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"></path></g><g data-p="tail"><path d="M86 152 C80 146 76 140 74 136" fill="none" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="9"></path><path d="M86 152 C80 146 76 140 74 136" fill="none" stroke="#f2be6b" stroke-linecap="round" stroke-width="4"></path><path d="M70.0 110.0Q78.1 105.0 80.9 113.7Q90.5 114.8 86.7 123.2Q93.4 129.9 84.7 134.0Q85.2 143.1 75.8 141.0Q70.0 148.3 64.2 141.0Q54.8 143.1 55.3 134.0Q46.6 129.9 53.3 123.2Q49.5 114.8 59.1 113.7Q61.9 105.0 70.0 110.0Z" fill="#f2be6b" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.4"></path></g><g data-p="bn" transform="translate(110 194)"><path d="M-15 -14 C-15 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 15 4 15 -14Z" fill="#f2be6b"></path><path d="M-15 -14 C-15 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 15 4 15 -14" fill="none" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.4"></path><path d="M-3.5 27 v5 M4.5 27 v5" fill="none" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"></path></g><path d="M76.8 175.6Q69.0 167.9 78.2 160.7Q76.6 151.8 90.3 147.3Q95.2 138.9 110.9 137.9Q121.6 131.3 136.7 134.0Q151.1 130.5 162.9 136.4Q178.7 136.4 185.3 144.5Q199.7 148.2 199.7 157.1Q210.3 163.7 203.9 171.9Q208.7 180.4 197.0 186.3Q195.3 195.2 180.3 198.0Q172.3 205.7 156.6 204.8Q143.7 210.0 130.0 205.6Q114.5 207.4 105.1 200.2Q89.7 198.3 86.3 189.6Q73.6 184.3 76.8 175.6Z" fill="#f2be6b" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.4"></path><path d="M182.7 196.4Q169.4 196.9 166.6 183.0Q156.1 174.1 162.3 161.5Q159.6 147.6 171.9 142.2Q178.2 129.7 191.0 134.0Q203.3 128.7 210.5 140.8Q223.1 145.2 221.3 159.3Q228.4 171.5 218.5 181.0Q216.6 195.1 203.2 195.7Q193.3 205.1 182.7 196.4Z" fill="#f2be6b" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.4"></path><g data-p="fn" transform="translate(186 194)"><path d="M-12 -14 C-12 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 12 4 12 -14Z" fill="#f2be6b"></path><path d="M-12 -14 C-12 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 12 4 12 -14" fill="none" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.4"></path><path d="M-3.5 27 v5 M4.5 27 v5" fill="none" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"></path></g></g><g data-p="haunch"><path d="M80.0 204.0Q75.1 194.9 85.7 189.9Q88.4 180.2 100.7 181.2Q110.0 174.6 119.3 181.2Q131.6 180.2 134.3 189.9Q144.9 194.9 140.0 204.0Q144.9 213.1 134.3 218.1Q131.6 227.8 119.3 226.8Q110.0 233.4 100.7 226.8Q88.4 227.8 85.7 218.1Q75.1 213.1 80.0 204.0Z" fill="#f2be6b" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.4"></path><path d="M112 214 C126 212 142 214 146 221 C148 226 144 229 136 229 L116 229 C108 229 104 224 106 219 Z" fill="#f2be6b" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.4"></path><path d="M132 222v5M139 222v5" fill="none" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"></path></g><g data-p="head"><path d="M178 146 Q212 162 246 146 L246 154 Q212 170 178 154 Z" fill="#a24a1a" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></path><path d="M212 160 C212 156 206 155 206 159.4 C206 163 212 166.6 212 168.4 C212 166.6 218 163 218 159.4 C218 155 212 156 212 160 Z" fill="#fbe3b4" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"></path><path d="M177.1 78.7Q186.9 70.8 186.6 87.4Q196.0 89.9 189.9 105.5Q195.2 117.3 185.5 126.0Q184.7 142.8 175.2 141.2Q168.7 156.5 162.9 145.3Q153.1 153.2 153.4 136.6Q144.0 134.1 150.1 118.5Q144.8 106.7 154.5 98.0Q155.3 81.2 164.8 82.8Q171.3 67.5 177.1 78.7Z" data-p="earL" fill="#e4a352" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.4"></path><path d="M246.9 78.7Q252.7 67.5 259.2 82.8Q268.7 81.2 269.5 98.0Q279.2 106.7 273.9 118.5Q280.0 134.1 270.6 136.6Q270.9 153.2 261.1 145.3Q255.3 156.5 248.8 141.2Q239.3 142.8 238.5 126.0Q228.8 117.3 234.1 105.5Q228.0 89.9 237.4 87.4Q237.1 70.8 246.9 78.7Z" data-p="earR" fill="#e4a352" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.4"></path><path d="M212.0 54.0Q223.4 48.2 231.5 57.5Q244.5 56.1 248.1 67.5Q260.7 70.7 259.1 82.4Q269.4 89.7 263.0 100.0Q269.4 110.3 259.1 117.6Q260.7 129.3 248.1 132.5Q244.5 143.9 231.5 142.5Q223.4 151.8 212.0 146.0Q200.6 151.8 192.5 142.5Q179.5 143.9 175.9 132.5Q163.3 129.3 164.9 117.6Q154.6 110.3 161.0 100.0Q154.6 89.7 164.9 82.4Q163.3 70.7 175.9 67.5Q179.5 56.1 192.5 57.5Q200.6 48.2 212.0 54.0Z" fill="#f2be6b" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.4"></path><path d="M195.0 52.0Q190.7 45.8 200.0 43.5Q203.2 36.9 212.0 40.0Q220.8 36.9 224.0 43.5Q233.3 45.8 229.0 52.0Q233.3 58.2 224.0 60.5Q220.8 67.1 212.0 64.0Q203.2 67.1 200.0 60.5Q190.7 58.2 195.0 52.0Z" fill="#f2be6b" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></path><path d="M188 120 C188 106 200 100 212 100 C224 100 236 106 236 120 C236 133 225 140 212 140 C199 140 188 133 188 120 Z" fill="#fbe3b4"></path><circle cx="181" cy="116" fill="#f9b9a6" opacity="0.85" r="7"></circle><circle cx="243" cy="116" fill="#f9b9a6" opacity="0.85" r="7"></circle><g data-p="eyes"><g data-p="open"><g data-p="blink"><ellipse cx="194" cy="98" fill="#2a170e" rx="7.4" ry="8.6"></ellipse><ellipse cx="230" cy="98" fill="#2a170e" rx="7.4" ry="8.6"></ellipse><circle cx="196.6" cy="94.6" fill="#fff" r="2.7"></circle><circle cx="232.6" cy="94.6" fill="#fff" r="2.7"></circle><circle cx="192" cy="101.2" fill="#fff" r="1.2"></circle><circle cx="228" cy="101.2" fill="#fff" r="1.2"></circle></g></g></g><path d="M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101" data-p="happy" fill="none" opacity="0" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.4"></path><path d="M186.5 97 Q194 103.5 201.5 97 M222.5 97 Q230 103.5 237.5 97" data-p="shut" fill="none" opacity="0" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.4"></path><path d="M204.5 111.5 Q212 107.2 219.5 111.5 Q218.2 118.4 212 120 Q205.8 118.4 204.5 111.5 Z" fill="#2a170e"></path><path d="M212 120 V124.5 M212 124.5 Q207.2 129.6 202.8 125.2 M212 124.5 Q216.8 129.6 221.2 125.2" fill="none" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></path><path d="M207.6 127.4 Q212 136.6 216.4 127.4 Z" data-p="tongue" fill="#e98c8c" stroke="#2a170e" stroke-linejoin="round" stroke-width="2.2"></path><g data-p="mouth" opacity="0"><path d="M203 126 Q212 122 221 126 Q219 138 212 139 Q205 138 203 126 Z" fill="#6b2a1c" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.6"></path><path d="M206.5 133.5 Q212 130 217.5 133.5 Q215 138 212 138 Q209 138 206.5 133.5 Z" fill="#e98c8c"></path></g></g><g data-p="ledge" opacity="0"><path d="M175 159 C175 148 181 142 190 142 C199 142 205 148 205 159 Z M219 159 C219 148 225 142 234 142 C243 142 249 148 249 159 Z" fill="#f2be6b" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.4"></path><path d="M186 153 v-4.5 M194 153 v-4.5 M230 153 v-4.5 M238 153 v-4.5" fill="none" stroke="#2a170e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"></path></g></g></svg>`;
  const PHRASES = {
    woof: ['woof!', 'woof woof!'],
    spin: ['wheee!', 'boing!'],
    jump: ['boing!', 'yip!'],
    beg: ['treat, please?'],
    bow: ['play with me!'],
    hop: ['boing!'],
    love: ['I like you!'],
    tilt: ['hm?'],
    sneeze: ['achoo!'],
    zoomies: ['zoomies!'],
    peekaboo: ['peekaboo!'],
  };
  const TRICK_POOL = ['woof', 'spin', 'beg', 'bow', 'hop', 'love', 'tilt', 'sneeze'];
  let mousePt = null;
  let mouseUntil = 0;
  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    mousePt = { x: event.clientX, y: event.clientY };
    mouseUntil = performance.now() + 2600;
  }, { passive: true });

  const createPup = (host, opts) => {
    const wrap = document.createElement('div');
    wrap.innerHTML = PUP_SVG_HTML;
    const svg = wrap.firstElementChild;
    if (opts.viewBox) svg.setAttribute('viewBox', opts.viewBox);
    const part = (name) => svg.querySelector(`[data-p="${name}"]`);
    const p = {
      root: part('root'), shadow: part('shadow'), body: part('body'), bf: part('bf'), ff: part('ff'),
      tail: part('tail'), bn: part('bn'), fn: part('fn'), haunch: part('haunch'), head: part('head'),
      earL: part('earL'), earR: part('earR'), eyes: part('eyes'), open: part('open'), blink: part('blink'),
      happy: part('happy'), shut: part('shut'), tongue: part('tongue'), mouth: part('mouth'), ledge: part('ledge'),
    };
    const state = {
      pose: opts.pose || 'sit', facing: opts.facing || 'right', walked: 0,
      gazeX: 0, gazeY: 0, tilt: 0, wagRate: opts.pose === 'basket' ? 0.3 : 0.6,
      pet: false, trick: null, trickUntil: 0, clickCount: 0, lastClick: 0,
      nextBlink: performance.now() + 1200, blinkStart: -1, lastTime: performance.now(),
      bubbleTimer: 0, bag: [],
    };
    const say = (text, ms = 1400) => {
      if (!opts.bubble || !text) return;
      opts.bubble.textContent = text;
      opts.bubble.dataset.show = 'true';
      clearTimeout(state.bubbleTimer);
      state.bubbleTimer = setTimeout(() => { opts.bubble.dataset.show = 'false'; }, ms);
    };
    const spawnHearts = () => {
      if (!opts.heartHost) return;
      for (let i = 0; i < 5; i += 1) {
        const heart = document.createElement('span');
        heart.className = 'pup-heart';
        heart.textContent = '♥';
        heart.style.left = `${opts.heartX ?? 50}%`;
        heart.style.top = `${opts.heartY ?? 15}%`;
        opts.heartHost.append(heart);
        const dx = (Math.random() - 0.5) * 90;
        const dy = -70 - Math.random() * 60;
        const anim = heart.animate([
          { transform: 'translate(0,0) scale(.6)', opacity: 0 },
          { transform: `translate(${dx * 0.35}px,${dy * 0.35}px) scale(1.15)`, opacity: 1, offset: 0.2 },
          { transform: `translate(${dx}px,${dy}px) scale(.85)`, opacity: 0 },
        ], { duration: 1150 + 110 * i, delay: 80 * i, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
        anim.finished.then(() => heart.remove(), () => heart.remove());
      }
    };
    svg.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') state.pet = true;
    });
    svg.addEventListener('pointerleave', () => { state.pet = false; });
    svg.addEventListener('click', (event) => {
      event.stopPropagation();
      const now = performance.now();
      state.clickCount = now - state.lastClick < 700 ? state.clickCount + 1 : 1;
      state.lastClick = now;
      let kind;
      if (state.clickCount >= 4) {
        kind = 'zoomies';
        state.clickCount = 0;
      } else if (opts.act === 'peekaboo' && state.pose === 'peek') {
        kind = ['peekaboo', 'woof', 'tilt', 'sneeze'][Math.floor(Math.random() * 4)];
      } else {
        if (!state.bag.length) state.bag = [...TRICK_POOL].sort(() => Math.random() - 0.5);
        kind = state.bag.pop();
      }
      state.trick = kind;
      state.trickUntil = now + (kind === 'zoomies' ? 1900 : kind === 'beg' ? 1700 : 1200);
      const list = PHRASES[kind] || ['woof!'];
      say(list[Math.floor(Math.random() * list.length)], kind === 'beg' ? 1700 : 1400);
      if (kind === 'love') spawnHearts();
    });

    const step = (now) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - state.lastTime) / 1000));
      state.lastTime = now;
      if (state.trick && now > state.trickUntil) state.trick = null;
      const trick = state.trick;
      const t = now / 1000;
      let tx = 0;
      let ty = 0;
      if (mousePt && now < mouseUntil) {
        const box = svg.getBoundingClientRect();
        if (box.width > 0) {
          const vb = svg.viewBox.baseVal;
          const eyePx = box.left + ((state.facing === 'left' ? 300 - 212 : 212) - vb.x) / vb.width * box.width;
          const eyePy = box.top + (98 - vb.y) / vb.height * box.height;
          const dx = mousePt.x - eyePx;
          const dy = mousePt.y - eyePy;
          const d = Math.hypot(dx, dy) || 1;
          const mag = Math.min(1, d / 160);
          tx = (dx / d) * mag;
          ty = (dy / d) * mag;
        }
      }
      const gazeAlpha = 1 - Math.exp(-dt / 0.07);
      state.gazeX += (tx * (state.facing === 'left' ? -1 : 1) - state.gazeX) * gazeAlpha;
      state.gazeY += (ty - state.gazeY) * gazeAlpha;

      const tiltTarget = trick === 'tilt' ? 16 : trick === 'sneeze' ? -12 : state.gazeX * 5.5;
      state.tilt += (tiltTarget - state.tilt) * (1 - Math.exp(-dt / 0.16));

      if (now >= state.nextBlink) {
        state.blinkStart = now;
        state.nextBlink = now + (Math.random() < 0.18 ? 320 : 2200 + Math.random() * 3800);
      }
      const blinkElapsed = (now - state.blinkStart) / 1000;
      const blinking = state.blinkStart > 0 && blinkElapsed < 0.15;
      const happyEyes = state.pet || trick === 'love' || trick === 'spin' || trick === 'zoomies';
      p.open.setAttribute('opacity', happyEyes ? '0' : '1');
      p.happy.setAttribute('opacity', happyEyes ? '1' : '0');
      p.shut.setAttribute('opacity', '0');
      const blinkScale = blinking ? Math.max(0.08, 1 - Math.sin((blinkElapsed / 0.15) * Math.PI)) : 1;
      p.blink.setAttribute('transform', `translate(0 ${(1 - blinkScale) * 98}) scale(1 ${blinkScale.toFixed(2)})`);
      p.eyes.setAttribute('transform', `translate(${(state.gazeX * 5).toFixed(2)} ${(state.gazeY * 4).toFixed(2)})`);

      const mouthOpen = trick === 'woof' || trick === 'beg' || trick === 'peekaboo' || trick === 'zoomies';
      p.mouth.setAttribute('opacity', mouthOpen ? '1' : '0');
      p.tongue.setAttribute('opacity', mouthOpen ? '0' : '1');

      const peek = state.pose === 'peek';
      const sit = state.pose === 'sit' || state.pose === 'basket';
      const walk = state.pose === 'walk';
      p.body.setAttribute('opacity', peek ? '0' : '1');
      p.shadow.setAttribute('opacity', peek ? '0' : '0.12');
      p.ledge.setAttribute('opacity', peek ? '1' : '0');
      p.haunch.setAttribute('opacity', sit && !peek ? '1' : '0');
      p.bf.setAttribute('opacity', sit ? '0' : '1');
      p.bn.setAttribute('opacity', sit ? '0' : '1');

      const breath = Math.sin(t * ((2 * Math.PI) / 3.8));
      const swing = walk ? Math.sin(state.walked / 14) * 26 : 0;
      const hopY = trick === 'hop' || trick === 'jump' || trick === 'peekaboo' ? -Math.abs(Math.sin(t * 9)) * 16 : trick === 'bow' ? 10 : 0;
      const zoomX = trick === 'zoomies' ? Math.sin(t * 18) * 18 : 0;
      const spinRot = trick === 'spin' ? ((1 - Math.max(0, (state.trickUntil - now) / 1200)) * 360) : 0;
      const flip = state.facing === 'left' ? 'translate(300 0) scale(-1 1)' : '';
      p.root.setAttribute('transform', `${flip} translate(${zoomX.toFixed(1)} ${hopY.toFixed(1)}) rotate(${spinRot.toFixed(1)} 150 140) scale(1 ${(1 + breath * 0.014).toFixed(3)})`);

      const bodyTilt = sit ? (state.pose === 'basket' ? 14 : -22) : trick === 'bow' ? 16 : trick === 'beg' ? -18 : 0;
      const bodyY = walk ? -Math.abs(Math.sin(state.walked / 14)) * 4 : sit ? -2 : 0;
      p.body.setAttribute('transform', `translate(0 ${bodyY.toFixed(1)}) rotate(${bodyTilt} 196 206)`);
      p.ff.setAttribute('transform', `translate(168 192) rotate(${(sit ? (state.pose === 'basket' ? -60 : 22) : swing).toFixed(1)})`);
      p.fn.setAttribute('transform', `translate(186 194) rotate(${(sit ? (state.pose === 'basket' ? -65 : 22) : -swing).toFixed(1)})`);
      p.bf.setAttribute('transform', `translate(94 192) rotate(${(-swing).toFixed(1)})`);
      p.bn.setAttribute('transform', `translate(110 194) rotate(${swing.toFixed(1)})`);

      const wagSpeed = state.pet || happyEyes || walk ? 18 : state.wagRate * 14;
      const wagDeg = Math.sin(t * wagSpeed) * (state.pet || happyEyes ? 28 : 16);
      p.tail.setAttribute('transform', `rotate(${wagDeg.toFixed(1)} 84 150)`);

      const headY = peek ? 4 + breath * 2 : sit ? (state.pose === 'basket' ? 28 : -6) : 0;
      const headX = peek ? 0 : sit ? (state.pose === 'basket' ? 14 : -10) : 0;
      p.head.setAttribute('transform', `translate(${headX} ${headY.toFixed(1)}) rotate(${state.tilt.toFixed(1)} 212 100)`);
      const earTwitch = Math.sin(t * 3.1) > 0.94 ? -10 : 0;
      p.earL.setAttribute('transform', `rotate(${(peek ? -6 : earTwitch).toFixed(1)} 174 82)`);
      p.earR.setAttribute('transform', `rotate(${(peek ? 6 : -earTwitch).toFixed(1)} 250 82)`);
    };
    return { svg, state, say, step };
  };

  const animators = [];
  let pupRaf = 0;
  const runPupLoop = (now) => {
    for (const item of animators) item.step(now);
    if (animators.length) pupRaf = requestAnimationFrame(runPupLoop);
    else pupRaf = 0;
  };
  const registerPup = (animator) => {
    animators.push(animator);
    if (!pupRaf) pupRaf = requestAnimationFrame(runPupLoop);
  };

  const mountBuddy = (host, pose, facing, act, viewBox) => {
    const buddy = document.createElement('div');
    buddy.className = 'pup-buddy';
    buddy.dataset.live = 'true';
    buddy.dataset.facing = facing;
    const bubble = document.createElement('span');
    bubble.className = 'pup-bubble';
    bubble.dataset.show = 'false';
    const anim = createPup(buddy, { pose, facing, act, viewBox, bubble, heartHost: buddy, heartX: 55, heartY: 10 });
    buddy.append(anim.svg, bubble);
    host.append(buddy);
    registerPup(anim);
    return buddy;
  };

  for (const host of document.querySelectorAll('[data-pup-buddy]')) {
    const pose = host.dataset.pupBuddy || 'sit';
    mountBuddy(host, pose, host.dataset.facing || 'right', host.dataset.act || '', pose === 'peek' ? '144 39 136 137' : '0 0 300 240');
  }

  const stopEls = [...document.querySelectorAll('[data-pup-stop]')];
  if (stopEls.length) {
    document.documentElement.dataset.pup = 'live';
    for (const stop of stopEls) {
      const pose = stop.dataset.pose || 'sit';
      mountBuddy(stop, pose, stop.dataset.facing || 'right', stop.dataset.act || '', pose === 'peek' ? '144 39 136 137' : '0 0 300 240');
    }

    const printsLayer = document.createElement('div');
    printsLayer.className = 'pup-prints';
    printsLayer.setAttribute('aria-hidden', 'true');
    const poolSvgs = Array.from({ length: 24 }, () => {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('viewBox', '0 0 64 64');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', PAW_D);
      s.append(path);
      printsLayer.append(s);
      return s;
    });

    const layer = document.createElement('div');
    layer.className = 'pup-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.dataset.front = 'false';
    const actor = document.createElement('div');
    actor.className = 'pup-actor';
    const bodyBox = document.createElement('div');
    bodyBox.className = 'pup-actor__body';
    const bubbleAt = document.createElement('span');
    bubbleAt.className = 'pup-bubble-at';
    const bubble = document.createElement('span');
    bubble.className = 'pup-bubble';
    bubble.dataset.show = 'false';
    bubbleAt.append(bubble);

    const actorPup = createPup(actor, { pose: 'peek', facing: 'right', act: 'peekaboo', bubble, heartHost: actor, heartX: 60, heartY: 18 });
    bodyBox.append(actorPup.svg);
    actor.append(bodyBox, bubbleAt);
    layer.append(actor);
    document.body.append(printsLayer, layer);
    registerPup(actorPup);

    let stops = [];
    let printCursor = 0;
    let lastPrintStep = 0;
    let prevDocX = null;
    let prevDocY = null;
    const measureStops = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      stops = stopEls.map((el) => {
        const ref = el.querySelector('img') || el;
        const rect = ref.getBoundingClientRect();
        if (rect.width < 8 || rect.height < 8) return null;
        const pose = el.dataset.pose || 'sit';
        const peek = pose === 'peek';
        const scale = peek ? rect.width / 136 : rect.width / 300;
        const x = rect.left + scrollX - (peek ? 144 * scale : 0);
        const y = rect.top + scrollY - (peek ? 39 * scale : 0);
        const centerY = rect.top + scrollY + rect.height * 0.5;
        const holdY = peek ? 0 : el.dataset.pupStop === 'welcome' ? maxScroll : Math.min(maxScroll, Math.max(0, centerY - innerHeight * 0.52));
        return { el, pose, facing: el.dataset.facing || 'right', act: el.dataset.act || '', behind: peek, x, y, scale, holdY };
      }).filter(Boolean).sort((a, b) => a.holdY - b.holdY);
    };

    const spawnWalkPrint = (docX, docY, dx, dy, scale, facing, stepIndex) => {
      if (innerWidth <= 767) return;
      const svg = poolSvgs[printCursor % poolSvgs.length];
      printCursor += 1;
      const pawOffset = (stepIndex & 1) ? 186 : 110;
      const px = docX + (facing === 'right' ? pawOffset : 300 - pawOffset) * scale;
      const py = docY + 226 * scale + ((stepIndex & 1) ? -4 : 4) * scale;
      const size = 14 * Math.max(0.75, 1.5 * scale);
      const ang = Math.atan2(dy, dx) + Math.PI / 2;
      svg.style.width = `${size}px`;
      svg.style.height = `${size}px`;
      svg.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) rotate(${ang.toFixed(3)}rad)`;
      svg.animate([
        { opacity: 0 },
        { opacity: 0.45, offset: 0.08 },
        { opacity: 0.45, offset: 0.5 },
        { opacity: 0 },
      ], { duration: 2600, easing: 'ease-out', fill: 'forwards' });
    };

    const updateActor = () => {
      if (!stops.length || innerWidth <= 767) return;
      const sy = scrollY;
      let i = 0;
      while (i < stops.length - 1 && sy > stops[i + 1].holdY) i += 1;
      const a = stops[i];
      const b = stops[Math.min(i + 1, stops.length - 1)];
      const span = b.holdY - a.holdY;
      const v = span > 1 ? Math.min(1, Math.max(0, (sy - a.holdY) / span)) : 0;
      const w = v * v * v * (v * (6 * v - 15) + 10);
      const midArc = span > 1 ? Math.sin(v * Math.PI) * 56 : 0;
      const docX = a.x + (b.x - a.x) * w + (a === b ? 0 : (a.x <= innerWidth * 0.4 ? midArc : -midArc));
      const docY = a.y + (b.y - a.y) * w - (a.behind && v > 0 && v < 0.7 ? Math.sin(v * Math.PI) * 32 : 0);
      const scale = a.scale + (b.scale - a.scale) * w;
      const vx = Math.min(innerWidth - 280 * scale, Math.max(10, docX - scrollX));
      const vy = docY - scrollY;
      actor.style.transform = `translate3d(${vx.toFixed(2)}px, ${vy.toFixed(2)}px, 0)`;
      bodyBox.style.transform = `scale(${scale.toFixed(3)})`;
      bubbleAt.style.transform = `translate(${(212 * scale).toFixed(1)}px, ${(36 * scale).toFixed(1)}px)`;

      const moving = v > 0.03 && v < 0.97 && a !== b;
      layer.dataset.front = moving || !a.behind ? 'true' : 'false';
      actorPup.state.pose = moving ? 'walk' : (v >= 0.97 ? b.pose : a.pose);
      if (prevDocX !== null && moving) {
        const dx = docX - prevDocX;
        const dy = docY - prevDocY;
        const delta = Math.hypot(dx, dy);
        if (delta > 0.4) {
          if (Math.abs(dx) > 0.6) actorPup.state.facing = dx >= 0 ? 'right' : 'left';
          actorPup.state.walked += delta / Math.max(0.4, scale);
          const stepIdx = Math.floor(actorPup.state.walked / 34);
          if (stepIdx > lastPrintStep) {
            lastPrintStep = stepIdx;
            spawnWalkPrint(docX, docY, dx, dy, scale, actorPup.state.facing, stepIdx);
          }
        }
      } else if (!moving) {
        actorPup.state.facing = v >= 0.97 ? b.facing : a.facing;
      }
      prevDocX = docX;
      prevDocY = docY;
    };

    measureStops();
    updateActor();
    window.addEventListener('scroll', updateActor, { passive: true });
    window.addEventListener('resize', () => { measureStops(); updateActor(); }, { passive: true });
    window.addEventListener('load', () => { measureStops(); updateActor(); }, { once: true });
  }

  const lineup = document.querySelector('.lineup');
  const lineupSource = lineup?.querySelector('[data-lineup]');
  if (lineup && lineupSource) {
    const pool = JSON.parse(lineupSource.textContent);
    const slots = [...lineup.querySelectorAll('.portrait')];
    if (pool.length > slots.length) {
      const delays = [1900, 2500, 1700, 2300, 2000, 2800, 1800];
      let step = 0;
      let pausedUntil = 0;
      const pause = () => { pausedUntil = Date.now() + 1200; };
      lineup.addEventListener('pointerenter', pause);
      lineup.addEventListener('focusin', pause);
      const scheduleNext = () => setTimeout(() => {
        if (!document.hidden && Date.now() >= pausedUntil) {
          const candidates = slots.filter((slot) => !slot.matches(':hover, :focus-within') && !slot.dataset.state);
          const slot = candidates[Math.floor(Math.random() * candidates.length)];
          if (slot) {
            const shown = new Set(slots.map((item) => new URL(item.href, location.href).pathname));
            const nextPool = pool.filter((item) => !shown.has(new URL(item.href, location.href).pathname));
            const next = nextPool[Math.floor(Math.random() * nextPool.length)];
            if (next) {
              slot.dataset.state = 'duck';
              setTimeout(() => {
                slot.href = next.href;
                slot.setAttribute('aria-label', `Meet ${next.name}`);
                slot.querySelector('img').src = next.src;
                slot.querySelector('.hand').textContent = next.name;
                slot.dataset.state = 'pop';
                slot.classList.add('is-named');
                setTimeout(() => {
                  if (slot.dataset.state === 'pop') delete slot.dataset.state;
                }, 600);
                setTimeout(() => slot.classList.remove('is-named'), 1800);
              }, 350);
            }
          }
        }
        step = (step + 1) % delays.length;
        scheduleNext();
      }, delays[step]);
      setTimeout(scheduleNext, 2100);
    }
  }
}

for (const form of document.querySelectorAll('[data-enquiry]')) {
  const name = form.elements.namedItem('name');
  const phone = form.elements.namedItem('phone');
  const status = form.querySelector('.form-status');
  name.addEventListener('input', () => name.setCustomValidity(''));
  phone.addEventListener('input', () => phone.setCustomValidity(''));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const digits = phone.value.replace(/\D/g, '');
    name.setCustomValidity(name.value.trim() ? '' : 'Enter your name.');
    phone.setCustomValidity(/^\+?[0-9 ()-]+$/.test(phone.value.trim()) && digits.length >= 7 && digits.length <= 15 ? '' : 'Enter a phone number with country code.');
    if (!form.reportValidity()) return;

    const fields = new FormData(form);
    const value = (key) => String(fields.get(key) || '').trim();
    const optional = [['Email', value('email')], ['Area', value('area')], ['Puppy', form.dataset.puppyName || value('puppy')], ['Message', value('message')]];
    const message = ['Hello TeddyPups!', `Name: ${value('name')}`, `Phone: ${value('phone')}`,
      ...optional.filter(([, content]) => content).map(([label, content]) => `${label}: ${content}`)].join('\n');
    const url = new URL(`https://wa.me/${form.dataset.phone}`);
    url.searchParams.set('text', message);
    const draft = document.createElement('a');
    draft.href = url;
    draft.target = '_blank';
    draft.rel = 'noopener noreferrer';
    draft.textContent = 'Open the WhatsApp draft';
    status.replaceChildren('Your draft is ready. ', draft);
    status.hidden = false;
    window.open(url.href, '_blank', 'noopener,noreferrer');
  });
}

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

const nav = [
  ['Home', ''], ['Puppies', 'puppies/'], ['Happy families', 'happy-families/'],
  ['How it works', 'how-it-works/'], ['FAQ', 'faq/'], ['Visit & contact', 'contact/'],
];
const contactNumber = '919898124987';
const displayPhone = '+971 50 000 0000';
const call = 'tel:+971500000000';
const whatsApp = (text = 'Hello! I would like to know more about your puppies.') =>
  `https://wa.me/${contactNumber}?text=${encodeURIComponent(text)}`;

const escape = (value = '') => String(value).replace(/[&<>"']/g, (char) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

const pawPath = 'M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z';
const pawSvg = (cls = 'paw', fill = 'currentColor') =>
  `<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true" fill="${fill}"><path d="${pawPath}"/></svg>`;
const starSvg = (cls, style = '') =>
  `<svg viewBox="0 0 40 40" class="${cls}"${style ? ` style="${style}"` : ''} aria-hidden="true"><path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path></svg>`;
const heartOutlineSvg = (cls = 'tp-memories__heart') =>
  `<svg viewBox="0 0 48 44" class="${cls}" aria-hidden="true"><path d="M24 40C10 30 4 22 4 14.5 4 8.7 8.6 4 14.3 4c4.1 0 7.6 2.4 9.7 6 2.1-3.6 5.6-6 9.7-6C39.4 4 44 8.7 44 14.5 44 22 38 30 24 40z" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

const heading = (text, level = 'h2', cls = 'display') => `<${level} class="${cls}">${text}</${level}>`;
const link = (text, url, style = 'primary', extra = '') => {
  const btnCls = style === 'green' ? 'pill green btn btn-whatsapp'
    : style === 'outline' ? 'pill outline btn btn-ghost'
      : style === 'light' ? 'pill light btn btn-ghost'
        : 'pill primary btn btn-primary';
  return `<a class="${btnCls}${extra ? ` ${extra}` : ''}" href="${escape(url)}"${url.startsWith('https://wa.me') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
};
const img = (base, filename, alt = '', eager = false, cls = '') =>
  `<img${cls ? ` class="${cls}"` : ''} src="${base}assets/${escape(filename)}" alt="${escape(alt)}" ${eager ? 'loading="eager"' : 'loading="lazy"'} decoding="async">`;
const teddy = (base, variant = 'teddy', label = '') => img(base, `${variant}.svg`, label, variant === 'teddy-peek');
const profileUrl = (base, puppy) => `${base}puppies/${puppy.slug}/`;
const available = (data) => data.puppies.filter(({ status }) => status === 'available');
const adopted = (data) => data.puppies.filter(({ status }) => status === 'gone');
const breeds = [['maltipoo', 'Maltipoo'], ['pomeranian', 'Pomeranian'], ['poodle', 'Poodle'], ['cavapoo', 'Cavapoo'], ['shih-tzu', 'Shih Tzu']];
const options = [
  ['where', 'origin', [['', 'Everywhere'], ['imported', 'Imported'], ['korean-teacup', 'Korean Teacup']]],
  ['breed', 'breed', breeds],
  ['boy or girl', 'gender', [['male', 'Boys'], ['female', 'Girls']]],
];

const headerHem = `<svg class="tp-header__hem" width="100%" height="18" aria-hidden="true"><defs><pattern id="tp-header-scallop" width="48" height="18" patternUnits="userSpaceOnUse"><path class="tp-header__hem-fill" d="M0 0h48v4A24 13 0 0 1 0 4Z"></path><path class="tp-header__hem-line" d="M0 4A24 13 0 0 0 48 4"></path></pattern></defs><rect width="100%" height="18" fill="url(#tp-header-scallop)"></rect></svg>`;

function header(base, type, data) {
  const selected = type === 'profile' ? 'puppies' : type;
  const navigation = nav.map(([label, path]) => {
    const active = selected === (path.split('/')[0] || 'home');
    return `<li><a class="tp-nav-link" href="${base}${path}"${active ? ' aria-current="page" data-active="true"' : ''}>${label}${pawSvg('tp-nav-link__paw')}</a></li>`;
  }).join('');
  const mobileNav = nav.map(([label, path]) => {
    const active = selected === (path.split('/')[0] || 'home');
    return `<li><a class="tp-menu-link" href="${base}${path}"${active ? ' aria-current="page" data-active="true"' : ''}>${label}${pawSvg('tp-nav-link__paw')}</a></li>`;
  }).join('');
  return `<a class="skip sr-only-focusable" href="#main">Skip to content</a>
    <header id="site-header" class="site-header tp-header${type === 'home' ? ' home-header' : ''}"${type === 'home' ? ' data-home="true"' : ''} data-scrolled="${type === 'home' ? 'false' : 'true'}">
      <div class="tp-header__bar gutter">
        <a class="brand tp-header__brand" href="${base}">${img(base, data.logo, '', true, 'tp-header__logo')}<span class="tp-header__name font-plush">TeddyPups</span></a>
        <nav class="desktop-nav tp-header__nav" aria-label="Main navigation"><ul>${navigation}</ul></nav>
        <div class="tp-header__end">
          <div class="desktop-contact">${link('WhatsApp us', whatsApp(), 'green', 'tp-header__wa')}</div>
          <button class="pill outline menu-toggle" type="button" data-menu aria-controls="mobile-menu" aria-expanded="false">${pawSvg('paw')} Menu</button>
        </div>
      </div>${headerHem}
    </header>
    <dialog class="mobile-menu tp-menu" id="mobile-menu" aria-label="Site menu" data-lenis-prevent>
      <div class="menu-top"><a class="brand tp-header__brand" href="${base}">${img(base, data.logo, '', false, 'tp-header__logo')}<span class="font-plush">TeddyPups</span></a>
        <button class="pill outline" type="button" data-close-menu>Close</button></div>
      <nav aria-label="Mobile navigation"><ul>${mobileNav}</ul></nav>
      ${link('WhatsApp us', whatsApp(), 'green')}
    </dialog>
    <aside class="mobile-contact" data-whatsapp-bar aria-label="Quick contact">${link('WhatsApp us', whatsApp(), 'green')}${link('Call', call, 'outline')}</aside>`;
}

const footerStars = [
  [6, 18, 12.6, 0.0], [14, 42, 8.4, 0.4], [23, 12, 9.8, 0.8], [34, 34, 14, 1.2],
  [48, 22, 8.8, 1.6], [61, 38, 11.4, 2.0], [74, 16, 9.4, 2.4], [83, 30, 12.2, 2.8], [93, 46, 8.6, 1.1],
];

const basketBackSvg = `<svg viewBox="0 0 300 240" class="tp-basket__back" aria-hidden="true"><ellipse cx="150" cy="176" rx="116" ry="26" class="tp-basket__hollow"></ellipse><path d="M34 176 A116 26 0 0 1 266 176" class="tp-basket__rim-line"></path><path d="M34 176 A116 26 0 0 1 266 176" class="tp-basket__rim"></path></svg>`;
const basketFrontSvg = `<svg viewBox="0 0 300 240" class="tp-basket__front" aria-hidden="true"><path d="M34 176 A116 26 0 0 0 266 176 L242 224 C230 235 70 235 58 224 Z" class="tp-basket__body"></path><path d="M46 196 C100 212 200 212 254 196 M53 212 C105 226 195 226 247 212" class="tp-basket__weave"></path><path d="M84 194 L92 228 M124 198 L128 231 M176 198 L172 231 M216 194 L208 228" class="tp-basket__weave tp-basket__weave--stakes"></path><path d="M34 176 A116 26 0 0 0 266 176" class="tp-basket__rim-line"></path><path d="M34 176 A116 26 0 0 0 266 176" class="tp-basket__rim"></path></svg>`;

function footer(base, data) {
  return `<footer class="footer tp-footer relative text-milk">
    <svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" class="tp-footer__hill"><path d="M0 80V44c120-30 240-44 360-30s240 46 360 34 240-58 360-46 240 40 360 26v52z"></path></svg>
    <div aria-hidden="true" class="tp-footer__sky">
      ${footerStars.map(([l, t, w, d]) => starSvg('tp-twinkle', `left:${l}%;top:${t}%;width:${w}px;animation-delay:${d.toFixed(2)}s`)).join('')}
      <span class="tp-moon"></span>
    </div>
    <div class="wrap tp-footer__inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="tp-footer__cozy">
            <div class="tp-basket">
              ${basketBackSvg}
              <div class="pup-stop tp-basket__pup" data-pup-stop="basket" data-pose="snug" data-facing="right" data-act="basket" data-behind="true" data-lane="true">${teddy(base, 'teddy-basket', 'Teddy sleeping in basket')}</div>
              ${basketFrontSvg}
            </div>
            <div>
              <a class="brand" href="${base}">${img(base, data.logo)}TeddyPups U.A.E.</a>
              <p>Find your new companion in Dubai or ask about a puppy from abroad.</p>
              ${link('WhatsApp us', whatsApp(), 'green')}
            </div>
          </div>
        </div>
        <nav aria-label="Footer navigation"><h2>Explore</h2>
          <a href="${base}puppies/">Available puppies</a><a href="${base}gone-home/">Gone home</a>
          <a href="${base}happy-families/">Happy families</a><a href="${base}how-it-works/">How it works</a>
          <a href="${base}how-it-works/#delivery">Delivery &amp; collection</a>
          <a href="${base}faq/">FAQ</a><a href="${base}contact/">Visit &amp; contact</a></nav>
        <div><h2>Say hello</h2><a href="${whatsApp()}" target="_blank" rel="noopener noreferrer">WhatsApp ${displayPhone}</a>
          <a href="mailto:info@instabizweb.com">info@instabizweb.com</a><p>Downtown Dubai, United Arab Emirates</p>
          <div class="socials"><a href="https://www.instabizweb.com/">Instagram</a><a href="https://www.instabizweb.com/">TikTok</a><a href="https://www.instabizweb.com/">Facebook</a></div></div>
      </div>
      <div class="footer-end"><span>© 2026 TeddyPups U.A.E. · every puppy is family</span><span>Reference site recreation</span></div>
    </div>
  </footer>`;
}

const polaroidTilts = [-2.2, 1.6, -0.9, 2.4, -1.5, 0.8, -2.6, 1.2];
const tapeStyles = ['center', 'left', 'right', 'corners', 'center', 'right', 'left', 'center'];
const tapeColors = ['#f6d79a', '#f9cdbf', '#cfe5f6', '#f6d79a', '#e9dcc4'];

function polaroidMarkup(base, { image, caption }, i, count, wall = true, showCaption = true) {
  const tapeKind = tapeStyles[i % tapeStyles.length];
  const tapeColor = tapeColors[i % tapeColors.length];
  const tilt = polaroidTilts[i % polaroidTilts.length];
  const tapes = tapeKind === 'corners'
    ? '<span aria-hidden="true" class="tp-tape tp-tape--tl"></span><span aria-hidden="true" class="tp-tape tp-tape--tr"></span>'
    : `<span aria-hidden="true" class="tp-tape tp-tape--${tapeKind}"></span>`;
  return `<span class="tp-polaroid polaroid" style="--tilt:${tilt}deg;--tape:${tapeColor};--i:${i}">
    ${tapes}
    <span class="tp-polaroid__photo">${img(base, image, caption)}</span>
    ${showCaption ? `<span class="tp-polaroid__caption font-scrawl">${escape(caption)}</span>` : ''}
  </span>${wall ? pawSvg('tp-wall__paw') : ''}`;
}

function photoWall(base, items, captions = false, expanded = items) {
  const media = expanded.map(({ image, caption }) => ({ src: `${base}assets/${image}`, alt: caption }));
  return `<div class="photo-wall" data-wall>
    <ul class="tp-wall" aria-label="Photos from TeddyPups families">
      ${items.map((item, i) => `<li class="tp-wall__item" data-reveal="true" style="--d:${(i % 4) * 60}ms">
        <button class="tp-wall__print" type="button" data-photo="${i}" aria-label="Open photo ${i + 1} of ${expanded.length}">
          ${polaroidMarkup(base, item, i, expanded.length, true, captions)}
        </button>
      </li>`).join('')}
    </ul>
    ${json(media)}
  </div>`;
}

function json(data, attr = 'data-media') {
  return `<script type="application/json" ${attr}>${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function testimonial(cls = 'tp-memories__note') {
  return `<figure class="${cls}">
    ${cls === 'tp-memories__note' ? '<span aria-hidden="true" class="tp-tape tp-tape--center" style="--tape:#cfe5f6"></span>' : ''}
    <blockquote class="font-plush-text">“TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.”</blockquote>
    <figcaption class="font-scrawl">Sarah M., Dubai, UAE</figcaption>
  </figure>`;
}

const lineupSeats = [
  [9, 8.6, 0.62, -5], [22.5, 10.4, 0.8, 3], [35, 9.2, 0.7, -2],
  [65, 9.4, 0.74, 3], [77.5, 10.6, 0.82, -3], [91, 8.4, 0.6, 4],
];
const doorColors = ['#a24a1a', '#5a3a28', '#d4893f', '#b8644a', '#7a4a2e'];
const peepholeSvg = `<svg viewBox="0 0 48 24" class="tp-door__peephole" aria-hidden="true"><path d="M4 20c5-10 12-14 20-14s15 4 20 14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><circle cx="24" cy="14" r="3" fill="currentColor"/></svg>`;
const dubaiSkylineSvg = `<svg viewBox="0 0 300 120" class="tp-way__skyline" aria-hidden="true"><path d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
const horizonCitySvg = `<svg viewBox="0 0 1440 160" preserveAspectRatio="none" class="tp-horizon__city"><path d="M0 160V118h34v-14h22v-22h30v34h18V96h26v30h22v-18h16v-30h34v40h20V70h28v56h24V98h18v-26h30v54h20v-38h26v-40l14-6 14 6v40h22v46h18V84h26v-30h22v50h24V76h36v50h20V96h18v-58h30v44h14V96h22v-30h16v22h26v-52l6-8v-24l4-6v-30l3-18 3 18v30l4 6v24l6 8v52h26v30h22V82h30v-20h24v48h20V90h28v-36h26v56h18V74h30v36h22V94h26v-24h30v62h20V102h26v20h34v38z"></path></svg>`;

function home(base, data) {
  const puppies = available(data);
  const koreanPup = puppies.find((p) => p.slug.includes('korean-teacup-maltipoo')) || puppies[1] || puppies[0];
  const heroSeats = puppies.slice(0, 6);
  const chatSnaps = [data.showroom, data.chat, puppies[0]?.image, koreanPup?.image].filter(Boolean).slice(0, 4);
  const allFamilies = [...data.featuredFamilies, ...data.families.filter(({ image }) => !data.featuredFamilies.some(({ match }) => match === image))];
  const duskDelayIdx = [3, 0, 5, 1, 6, 2, 7, 4];

  const homes = [
    ['Choose your breed', 'Select your preferred breed or tell us what you’re looking for. We’ll guide you based on availability and your lifestyle.'],
    ['Get photos &amp; details', 'Our team will share real photos, health details, and all necessary information directly on WhatsApp.'],
    ['Secure &amp; safe delivery', 'Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.'],
  ];

  const stamps = [
    ['round', '#a24a1a', -8, '<path d="M32 54C16 43 8 34 8 24c0-7 5.4-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 6.6 0 12 5 12 12 0 10-8 19-24 30z" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 30h7l3-7 4 13 3-6h7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>', 'Vet-checked &amp; healthy', 'Every puppy comes vaccinated, dewormed, and with a verified health certificate.'],
    ['ticket', '#1f6b45', 5, '<path d="M6 36l22-3 12-17h6l-6 17 12-1 6-7h3l-2 10 2 10h-3l-6-7-12-1 6 17h-6L28 37 6 36z" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 50c10 4 20 4 30 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 7"/>', 'Korea to Dubai, safely', 'Trusted breeders, safe travel, and premium care from start to finish.'],
    ['oval', '#5a3a28', -4, '<path d="M10 14h44v28H30l-12 10v-10h-8z" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 28h0M32 28h0M42 28h0" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>', 'Support 24/7', 'Always here to help, from choosing your puppy to post-delivery support.'],
    ['scallop', '#c2622b', 7, '<circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 32h44M32 10c-8 8-8 36 0 44M32 10c8 8 8 36 0 44" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>', 'Trusted by families worldwide', 'Puppies delivered to loving homes all around the world.'],
  ];

  const nightStars = [
    [8, 12, 16.2, 0.0], [22, 30, 9.0, 0.4], [41, 8, 12.6, 0.8], [57, 22, 8.1, 1.2],
    [72, 6, 14.4, 1.6], [86, 26, 9.9, 2.0], [16, 62, 11.7, 0.6], [64, 58, 13.5, 1.4],
    [89, 72, 9.0, 2.3], [36, 78, 10.8, 1.9],
  ];

  return `<div class="tp-page" data-page="home">
  <section class="scene tp-scene tp-hero" data-pup-scene="true" data-tone="light" style="--sky-top:#fffdf8;--sky-bottom:#fff1d8;--quilt:#fff1d8" aria-labelledby="hero-title">
    <span aria-hidden="true" class="tp-hero__sun hero-sun"></span>
    <div class="tp-hero__copy gutter">
      <p class="tp-hero__note font-scrawl">every puppy is family<svg viewBox="0 0 220 24" preserveAspectRatio="none" class="tp-hero__wave" aria-hidden="true"><path d="M4 14c18-10 30 8 48-1s28-9 46 0 30 8 48-1 30-9 48 0 18 2 22 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></svg></p>
      <h1 id="hero-title" class="tp-hero__title font-plush"><span class="tp-hero__line">Premium teacup</span><span class="tp-hero__line tp-hero__line--2">puppies in Dubai</span></h1>
      <p class="tp-hero__lede">Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.</p>
      <div class="tp-hero__actions">${link('View available puppies', `${base}puppies/`)}${link('Enquire on WhatsApp', whatsApp(), 'outline')}</div>
    </div>
    <div class="tp-hero__stage">
      <ul class="tp-lineup lineup" aria-label="Some of the puppies in our showroom">
        ${heroSeats.map((p, i) => {
          const [x, w, peek, tilt] = lineupSeats[i];
          return `<li class="tp-lineup__seat" style="--x:${x}%;--w:${w}rem;--peek:${peek};--tilt:${tilt}deg;--i:${i}"><a class="tp-lineup__pup portrait portrait-${i + 1}" data-pup-friend="true" href="${profileUrl(base, p)}" aria-label="Meet ${escape(p.name)}"><span class="tp-lineup__photo">${img(base, p.image, p.alt || p.name, true)}</span></a></li>`;
        }).join('')}
      </ul>
      <div class="peek pup-stop tp-hero__teddy" data-pup-stop="hero" data-pose="peek" data-facing="right" data-act="peekaboo" data-behind="true" data-lane="true">${teddy(base, 'teddy-peek', 'Teddy the puppy mascot')}</div>
      <div class="tp-quilt" aria-hidden="true">
        <svg class="tp-quilt__edge" width="100%" height="40" preserveAspectRatio="none"><defs><pattern id="tp-scallop" width="76" height="40" patternUnits="userSpaceOnUse"><path d="M0 40V27A38 25 0 0 1 76 27V40Z" fill="#fff1d8"></path><path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" stroke-width="3"></path><path d="M11 33A27 19 0 0 1 65 33" fill="none" stroke="#2a170e" stroke-width="1.6" stroke-dasharray="3.5 5.5" stroke-linecap="round" opacity=".42"></path></pattern></defs><rect width="100%" height="40" fill="url(#tp-scallop)"></rect></svg>
      </div>
      <ul class="tp-lineup tp-lineup--tags" aria-hidden="true">
        ${heroSeats.map((p, i) => {
          const [x, w, peek, tilt] = lineupSeats[i];
          return `<li class="tp-lineup__seat" style="--x:${x}%;--w:${w}rem;--peek:${peek};--tilt:${tilt}deg;--i:${i}"><span class="tp-lineup__ghost"><span class="tp-lineup__name font-scrawl">${escape(p.name)}</span></span></li>`;
        }).join('')}
      </ul>
      ${json(puppies.map((p) => ({ name: p.name, href: profileUrl(base, p), src: `${base}assets/${p.image}` })), 'data-lineup')}
    </div>
  </section>

  <section class="scene tp-scene tp-meet" data-pup-scene="true" data-tone="light" style="--sky-top:#fff1d8;--sky-bottom:#fbe3b4" aria-labelledby="meet-title">
    <div data-pin-range="true">
      <div class="tp-meet__stage">
        <header class="tp-meet__head gutter">
          <div><h2 id="meet-title" class="font-plush text-huge">Meet the pups</h2><p class="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">Real puppies, real photos, looking for their families right now.</p></div>
          ${link('See all available puppies', `${base}puppies/`, 'primary', 'shrink-0')}
        </header>
        <div class="tp-meet__hall">
          <ol class="tp-meet__track" data-treadmill="true" aria-label="Puppies looking for a family">
            ${puppies.map((p, i) => `<li class="tp-door door-card" data-open="true">
              <a class="tp-door__link" style="--door:${doorColors[i % doorColors.length]}" href="${profileUrl(base, p)}">
                <span class="tp-door__plate"><span class="font-plush tp-door__name">${escape(p.name)}</span><span class="tp-door__meta">${escape(p.meta.replaceAll(' · ', ', '))}${p.media.some((m) => m.video) ? ', with video' : ''}</span></span>
                <span class="tp-door__frame">
                  <span class="tp-door__room">${img(base, p.image, p.alt || p.name)}</span>
                  <span aria-hidden="true" class="tp-door__way"><span class="tp-door__leaf">${peepholeSvg}<span class="tp-door__knob"></span></span></span>
                  <span class="tp-door__tag font-scrawl">Available</span>
                </span>
              </a>
            </li>`).join('')}
            <li class="tp-door tp-door--all" data-open="true">
              <a class="tp-door__link" href="${base}puppies/"><span class="tp-door__frame tp-door__frame--all"><span class="font-plush tp-door__all">Meet them all</span></span></a>
            </li>
          </ol>
          <div aria-hidden="true" class="tp-meet__floor"></div>
          <div class="pup-stop tp-meet__teddy" data-pup-stop="hall" data-pose="walk" data-facing="right" data-act="treadmill">${teddy(base, 'teddy', 'Teddy walking through the hallway')}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="scene tp-scene tp-paths" data-pup-scene="true" data-tone="light" style="--sky-top:#fbe3b4;--sky-bottom:#f7d18d" aria-labelledby="paths-title">
    <div class="gutter mx-auto max-w-[110rem]">
      <h2 id="paths-title" class="tp-paths__title font-plush text-huge">Two ways to meet your puppy</h2>
      <div class="tp-fork">
        <div aria-hidden="true" class="tp-fork__post"></div>
        <article class="tp-way tp-way--left" aria-labelledby="way-local">
          <h3 id="way-local" class="tp-sign tp-sign--left font-plush">Puppies in Dubai</h3>
          <div class="tp-way__scene" data-pup-look="true">
            ${dubaiSkylineSvg}
            <figure class="tp-window"><span class="tp-window__glass">${img(base, data.showroom, 'Apricot puppy in the showroom')}</span><figcaption class="font-scrawl">In our showroom</figcaption></figure>
          </div>
          <p class="tp-way__text">Spend time with a puppy at the Dubai showroom before choosing.</p>
          ${link('Meet local puppies', `${base}puppies/?origin=local`)}
        </article>
        <div class="pup-stop tp-fork__teddy" data-pup-stop="paths" data-pose="sit" data-facing="right">${teddy(base, 'teddy', 'Teddy at the signpost')}</div>
        <article class="tp-way tp-way--right" aria-labelledby="way-imported">
          <h3 id="way-imported" class="tp-sign tp-sign--right font-plush">Imported for you</h3>
          <div class="tp-way__scene" data-pup-look="true">
            <div class="tp-flight">
              <svg viewBox="0 0 660 300" role="img" aria-label="A plane bringing a Korean Teacup Maltipoo puppy from Korea to Dubai">
                <defs><clipPath id="tp-porthole-clip"><circle r="25"></circle></clipPath></defs>
                <path d="M40 250 C 170 40, 470 20, 620 168" class="tp-flight__route"></path>
                <circle cx="40" cy="250" r="7" class="tp-flight__dot"></circle>
                <circle cx="620" cy="168" r="7" class="tp-flight__dot"></circle>
                <text x="40" y="284" text-anchor="middle" class="tp-flight__label">Korea</text>
                <text x="620" y="202" text-anchor="middle" class="tp-flight__label">Dubai</text>
                <g class="tp-flight__plane" transform="translate(620 168) rotate(44.5)">
                  <g transform="translate(-126 -78)">
                    <path d="M28 60 L8 26 L34 26 L60 54 Z" class="tp-flight__wing"></path>
                    <path d="M108 112 L142 156 L172 156 L158 112 Z" class="tp-flight__wing tp-flight__wing--far"></path>
                    <path d="M20 80 C20 52 52 44 80 44 L168 44 C200 44 224 60 232 80 C224 100 200 112 168 112 L80 112 C52 112 20 104 20 80 Z" class="tp-flight__body"></path>
                    <path d="M104 44 L138 2 L168 2 L154 44 Z" class="tp-flight__wing"></path>
                    <path d="M206 64 C215 67 221 73 224 80" class="tp-flight__line"></path>
                  </g>
                  <g transform="translate(10 2)">
                    <image href="${base}assets/${escape(koreanPup.image)}" x="-25" y="-25" width="50" height="50" preserveAspectRatio="xMidYMid slice" clip-path="url(#tp-porthole-clip)"></image>
                    <circle r="25" class="tp-flight__porthole"></circle>
                  </g>
                </g>
              </svg>
            </div>
          </div>
          <p class="tp-way__text">Ask about Korean teacup breeds and get help arranging their journey to Dubai.</p>
          ${link('See imported puppies', `${base}puppies/?origin=imported`)}
        </article>
      </div>
    </div>
  </section>

  <section class="scene tp-scene tp-chat" data-pup-scene="true" data-tone="light" style="--sky-top:#f7d18d;--sky-bottom:#f0b866" aria-labelledby="journey-title">
    <div class="tp-chat__grid gutter" data-pin-range="true">
      <div class="tp-chat__story">
        <h2 id="journey-title" class="font-plush text-huge">Your puppy journey</h2>
        <p class="text-lede mt-5 max-w-[42ch] text-[var(--ink-soft)]">A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful.</p>
        <ol class="tp-chat__steps">
          ${homes.map(([title, copy], i) => `<li class="tp-chat__step" data-active="${i === 0 ? 'true' : 'false'}"><span class="tp-chat__num font-plush" aria-hidden="true">${i + 1}</span><h3 class="font-plush tp-chat__title">${title}</h3><p class="tp-chat__text">${copy}</p></li>`).join('')}
        </ol>
        ${link('How it works', `${base}how-it-works/`, 'outline', 'tp-chat__cta')}
      </div>
      <div class="tp-chat__side">
        <div class="tp-phone phone" data-chat role="group" aria-label="A WhatsApp conversation with TeddyPups U.A.E.">
          <div class="tp-phone__bar">${img(base, data.logo, '', false, 'tp-phone__avatar')}<span><span class="tp-phone__name">TeddyPups U.A.E.</span><span class="tp-phone__status">online</span></span></div>
          <div class="tp-phone__screen">
            <p class="tp-msg tp-msg--me">Hi TeddyPups! I’d love to know more about your puppies.</p>
            <div class="phone-response">
              <div class="tp-msg-group" data-step="0" data-show="true">
                <div class="tp-msg tp-msg--them"><p>Which breed are you interested in? We’ll guide you based on availability and your lifestyle.</p>
                  <ul class="tp-chips" aria-label="Breeds we have now">${breeds.map(([key, label]) => `<li><a href="${base}puppies/?breed=${key}">${label}</a></li>`).join('')}</ul>
                </div>
              </div>
              <div class="tp-msg-group" data-step="1" data-show="false">
                <div class="tp-msg tp-msg--them tp-msg--media"><div class="tp-snaps">${chatSnaps.map((file) => `<span class="tp-snaps__one">${img(base, file, 'Showroom puppy')}</span>`).join('')}</div></div>
                <div class="tp-msg tp-msg--them tp-msg--media">
                  <div class="tp-clip">
                    <video src="${base}assets/${escape(data.showroomVideo)}" poster="${base}assets/${escape(data.chat)}" muted loop playsinline preload="none" aria-label="Video of a tiny apricot teddy bear puppy in the TeddyPups showroom"></video>
                    <button type="button" class="chat-video tp-clip__play" data-showroom-video="${base}assets/${escape(data.showroomVideo)}" aria-pressed="false" aria-label="Play showroom video">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              <div class="tp-msg-group" data-step="2" data-show="false">
                <div class="tp-msg tp-msg--them"><p>${homes[2][1]}</p>
                  <svg viewBox="0 0 220 70" class="tp-route" aria-hidden="true">
                    <path d="M14 52 C 60 6, 120 70, 170 28" class="tp-route__line"></path>
                    <circle cx="14" cy="52" r="5" class="tp-route__dot"></circle>
                    <path d="M164 32 l12 -12 l12 12 v14 h-24 z" class="tp-route__home"></path>
                    <path d="M176 42 c-2-3-7-2-6 2c1 3 6 5 6 5s5-2 6-5c1-4-4-5-6-2z" class="tp-route__heart"></path>
                    <path d="${pawPath}" transform="translate(70 22) scale(.3) rotate(70 32 32)" class="tp-route__paw"></path>
                    <path d="${pawPath}" transform="translate(104 38) scale(.3) rotate(100 32 32)" class="tp-route__paw"></path>
                  </svg>
                </div>
              </div>
            </div>
            <p class="tp-typing" data-show="false" aria-hidden="true"><span></span><span></span><span></span></p>
          </div>
          <a class="tp-phone__compose" href="${whatsApp()}" target="_blank" rel="noopener noreferrer"><span>Say hello on WhatsApp</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20l18-8L3 4v6l12 2-12 2z"></path></svg></a>
        </div>
        <div class="pup-stop tp-chat__teddy" data-pup-stop="journey" data-pose="sit" data-facing="right">${teddy(base, 'teddy', 'Teddy by the chat')}</div>
      </div>
    </div>
  </section>

  <section class="scene tp-scene tp-passport" data-pup-scene="true" data-tone="light" style="--sky-top:#f0b866;--sky-bottom:#e08c54" aria-labelledby="trust-title">
    <div class="gutter mx-auto max-w-[96rem]">
      <div class="tp-book">
        <div class="tp-book__page tp-book__page--left">
          <p aria-hidden="true" class="tp-book__kicker font-scrawl">puppy passport</p>
          <h2 id="trust-title" class="font-plush tp-book__title">Why families trust TeddyPups</h2>
          <div class="pup-stop tp-book__teddy" data-pup-stop="passport" data-pose="sit" data-facing="right">${teddy(base, 'teddy', 'Teddy on passport')}</div>
        </div>
        <ul class="tp-book__page tp-book__page--right">
          ${stamps.map(([variant, color, tilt, iconPath, title, copy], i) => `<li class="tp-entry" style="--ink-stamp:${color};--tilt:${tilt}deg;--i:${i}">
            <span class="stamp tp-stamp tp-stamp--${variant}"><svg viewBox="0 0 64 64" class="tp-stamp__icon" aria-hidden="true">${iconPath}</svg><span class="tp-stamp__title font-plush">${title}</span></span>
            <p class="tp-entry__text">${copy}</p>
          </li>`).join('')}
        </ul>
      </div>
    </div>
    <div aria-hidden="true" class="tp-horizon sunset"><span class="tp-horizon__sun"></span>${horizonCitySvg}</div>
  </section>

  <section class="scene tp-scene tp-dusk dusk" data-pup-scene="true" data-tone="dark" style="--sky-top:#a65a30;--sky-bottom:#4d2b19" aria-labelledby="dusk-title">
    <div class="tp-dusk__sky gutter">
      <div class="tp-dusk__head"><h2 id="dusk-title" class="font-plush text-huge">Happy families &amp; puppies</h2><p class="text-lede mt-5 max-w-[50ch] text-[var(--ink-soft)]">We are truly honored to see our puppies become cherished members of loving families. These heartwarming moments have been shared by our valued clients who welcomed a Teddy Pup into their homes and hearts.</p></div>
      ${testimonial('tp-dusk__note')}
    </div>
    <div class="tp-photowall" data-wall>
      <div class="tp-photowall__wall">
        <ul class="tp-photowall__prints" aria-label="Photos from TeddyPups families">
          ${data.featuredFamilies.map((item, i) => `<li data-reveal="true" data-pup-look="${i === 1 || i === 4 ? 'true' : ''}" style="--d:${110 * duskDelayIdx[i]}ms">
            <button type="button" class="tp-photowall__print" data-photo="${i}" aria-label="Open photo ${i + 1} of ${allFamilies.length}">
              ${polaroidMarkup(base, item, i, allFamilies.length, false, true)}
            </button>
          </li>`).join('')}
        </ul>
        <div class="tp-facade__ground">
          <span aria-hidden="true" class="tp-facade__door"></span>
          <span aria-hidden="true" class="tp-lamp"><span class="tp-lamp__light"></span></span>
          ${link('See every happy family', `${base}happy-families/`, 'primary', 'tp-facade__cta')}
          <div class="pup-stop tp-dusk__teddy" data-pup-stop="dusk" data-pose="sit" data-facing="right">${teddy(base, 'teddy', 'Teddy outside the family wall')}</div>
        </div>
      </div>
      <div aria-hidden="true" class="tp-street__pavement"></div>
      ${json(allFamilies.map(({ image, caption }) => ({ src: `${base}assets/${image}`, alt: caption })))}
    </div>
  </section>

  <section class="scene tp-scene tp-night night" data-pup-scene="true" data-tone="dark" style="--sky-top:#4d2b19;--sky-bottom:#351c10" aria-labelledby="night-faq-title">
    <div aria-hidden="true" class="tp-night__stars">${nightStars.map(([l, t, w, d]) => starSvg('tp-twinkle', `left:${l}%;top:${t}%;width:${w}px;animation-delay:${d.toFixed(2)}s`)).join('')}</div>
    <div class="tp-night__grid gutter">
      <header>
        <h2 id="night-faq-title" class="font-plush text-huge">Questions,<br>answered</h2>
        ${link('Read all questions', `${base}faq/`, 'outline', 'tp-night__cta')}
        <div class="tp-night__pup"><span aria-hidden="true" class="tp-night__wonder font-plush">?</span>
          <div class="pup-stop tp-night__teddy" data-pup-stop="night" data-pose="sit" data-facing="right" data-act="tilt">${teddy(base, 'teddy', 'Teddy listening')}</div>
        </div>
      </header>
      <ul class="tp-night__list">${data.questions.slice(0, 3).map(({ question, answer }) => `<li><h3 class="tp-qa__q font-plush">${starSvg('tp-qa__star')}<span>${escape(question)}</span></h3><p class="tp-qa__a">${escape(answer)}</p></li>`).join('')}</ul>
    </div>
  </section>

  <section class="scene tp-scene tp-home welcome" data-pup-scene="true" data-tone="dark" style="--sky-top:#351c10;--sky-bottom:#24130b" aria-labelledby="welcome-home-title">
    <div class="tp-home__copy gutter">
      <h2 id="welcome-home-title" class="font-plush text-huge">Ready to meet your<br>new best friend?</h2>
      <p class="tp-home__lede">We’ll help you choose a puppy and arrange a visit, collection or delivery.</p>
    </div>
    <div class="tp-house welcome-house">
      <span aria-hidden="true" class="tp-house__plant tp-house__plant--left"></span>
      <span aria-hidden="true" class="tp-house__lamp"></span>
      <div class="tp-house__doorway">
        <a class="tp-house__inside" href="${profileUrl(base, puppies[0])}" aria-label="Meet ${escape(puppies[0].name)}">${img(base, puppies[0].image, `${puppies[0].name}, waiting inside`)}</a>
        <span aria-hidden="true" class="tp-house__door"><span class="tp-house__peep"></span><span class="tp-house__knob"></span></span>
      </div>
      <span aria-hidden="true" class="tp-house__plant tp-house__plant--right"></span>
      <span aria-hidden="true" class="tp-house__mat font-scrawl">welcome home</span>
      <div class="pup-stop tp-house__teddy" data-pup-stop="welcome" data-pose="bow" data-facing="right">${teddy(base, 'teddy', 'Teddy bowing at the door')}</div>
    </div>
    <div class="tp-home__actions gutter">${link('Enquire on WhatsApp', whatsApp(), 'green')}${link('Visit &amp; contact', `${base}contact/`, 'outline')}</div>
  </section>
  </div>`;
}

function card(base, p, small = false, index = 0) {
  const breed = p.details.Breed || p.meta;
  const keys = breeds.filter(([, label]) => breed.toLowerCase().includes(label.toLowerCase())).map(([key]) => key).join(' ');
  const sex = (p.details['Boy or girl'] || '').toLowerCase();
  const origin = p.details.Where === 'Imported for you' ? 'imported' : 'local';
  return `<li${small ? '' : ` data-puppy data-breeds="${keys}" data-sex="${sex.includes('boy') ? 'male ' : ''}${sex.includes('girl') ? 'female' : ''}" data-origin="${origin}" data-korean="${breed.includes('Korean Teacup')}"`}><a class="sketch tp-sketch${small ? ' small tp-sketch--small' : ''}" data-reveal="true" data-slug="${escape(p.slug)}" style="--d:${(index % 8) * 70}ms" href="${profileUrl(base, p)}">
    <span class="sketch-frame tp-sketch__frame">
      <span class="tp-sketch__photo">${img(base, p.image, p.alt || `${p.name} puppy`)}</span>
      <span class="tp-sketch__sticker font-scrawl${small ? ' tp-sketch__sticker--home' : ''}">${small ? 'gone home ♥' : 'Available'}</span>
      ${p.media.some((m) => m.video) && !small ? '<span class="video-badge tp-sketch__video">▶ video</span>' : ''}
    </span>
    <span class="tp-sketch__name font-plush">${escape(p.name)}</span>
    ${small ? '' : `<span class="tp-sketch__meta">${escape(p.meta)}</span>`}
  </a></li>`;
}

function catalog(base, data) {
  const puppies = available(data);
  return `<div class="tp-page" data-page="pups">
  <section class="catalog subpage tp-sketchbook" aria-labelledby="pups-title">
    <div class="gutter mx-auto max-w-[110rem]">
      <header class="tp-sketchbook__head">
        <div class="tp-sketchbook__words">
          <p class="font-scrawl text-lg text-toffee-ink" data-reveal="true">from Teddy’s sketchbook</p>
          <h1 id="pups-title" class="font-plush text-giant tp-sketchbook__title" data-reveal="true">Available puppies<svg aria-hidden="true" viewBox="0 0 400 24" preserveAspectRatio="none" class="tp-sketchbook__underline"><path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" pathLength="1"></path></svg></h1>
          <p class="tp-sketchbook__lede text-lede mt-6 max-w-[46ch] text-cocoa-soft" data-reveal="true">Browse real photos of each puppy. Open a profile for more pictures and ask us about your favorites on WhatsApp.</p>
        </div>
        <figure class="tp-sketchbook__self" data-reveal="true">
          <div data-pup-buddy="sit" data-facing="left">${teddy(base, 'teddy', 'Teddy, the TeddyPups puppy')}</div>
          <figcaption class="font-scrawl tp-sketchbook__caption">self-portrait</figcaption>
        </figure>
      </header>
      <div class="tp-sketchpad filters mt-10" data-filters aria-label="Filter puppies">
        ${options.map(([label, key, values]) => `<div class="filter-row" role="group" aria-label="${label}"><span class="hand font-scrawl">${label}</span>
          <div>${values.map(([value, name]) => `<button class="tp-sticker-chip" type="button" data-key="${key}" data-value="${value}" aria-pressed="${value === ''}">${name}</button>`).join('')}</div></div>`).join('')}
        <button class="text-button" type="button" data-reset hidden>Clear filters</button>
      </div>
      <p class="result-count hand font-scrawl" aria-live="polite" data-result>${puppies.length} puppies looking for a home</p>
      <ul class="tp-sketches sketch-grid">${puppies.map((p, i) => card(base, p, false, i)).join('')}</ul>
      <div class="tp-board empty center" data-empty hidden>${heading('No puppies match just now.', 'h2', 'font-plush text-big')}<p>Let us know what you’re looking for and we can help with your search.</p>${link('Ask us on WhatsApp', whatsApp(), 'green')}</div>
    </div>
  </section>
  <section class="tp-gone-strip">
    <div class="gutter mx-auto max-w-[110rem]">
      <div class="section-heading"><div><h2 class="font-plush text-big">Already gone home</h2><p>These puppies have found their families.</p></div>${link('See the puppies who’ve gone home', `${base}gone-home/`, 'outline')}</div>
      <ul class="tp-gone-strip__row archive-preview">${adopted(data).slice(0, 5).map((p, i) => card(base, p, true, i)).join('')}</ul>
    </div>
  </section>
  </div>`;
}

const ticketTilts = [-1.4, 0.9, -0.6, 1.5, -1.1, 0.7, -1.6, 1.1];

function goneHome(base, data) {
  return `<div class="tp-page" data-page="gone"><section class="subpage gone"><div class="gutter mx-auto max-w-[110rem]">
    <header class="tp-boothhead">
      <div class="max-w-3xl"><h1 class="font-plush text-giant">Gone home${heartOutlineSvg('ml-3 inline-block tp-memories__heart')}</h1>
        <p class="text-lede mt-6 text-cocoa-soft">Every puppy here has already joined their loving family. Looking for one just like them? Tell us — we’ll help you find your match.</p>
        ${link('See available puppies', `${base}puppies/`, 'primary', 'mt-8')}
      </div>
      <div aria-hidden="true" class="tp-booth">
        <div class="tp-booth__teddy" data-pup-buddy="peek" data-facing="left" data-act="peekaboo">${teddy(base, 'teddy-peek')}</div>
        <div class="tp-booth__counter"><span class="font-plush">tickets home</span></div>
      </div>
    </header>
    <ul class="tp-tickets">${adopted(data).map((p, i) => `<li class="tp-ticket ticket" data-reveal="true" style="--tilt:${ticketTilts[i % ticketTilts.length]}deg;--i:${i % 6}">
      <a class="tp-ticket__link" href="${profileUrl(base, p)}">
        <span class="tp-ticket__main">
          <span class="tp-ticket__photo">${img(base, p.image, p.alt || p.name)}</span>
          <span class="tp-ticket__body">
            <span class="tp-ticket__kicker font-scrawl">one ticket home</span>
            <span class="tp-ticket__name font-plush">${escape(p.name)}</span>
            <span class="tp-ticket__meta">${escape(p.meta)}</span>
            <span class="tp-ticket__route">TEDDYPUPS<svg viewBox="0 0 36 20" aria-hidden="true"><path d="M2 10h28"/><path d="M26 5l6 5-6 5"/></svg>HOME ♥</span>
          </span>
        </span>
        <span class="tp-ticket__stub"><span class="font-plush">admit one</span></span>
      </a>
    </li>`).join('')}</ul>
  </div></section></div>`;
}

function families(base, data) {
  return `<div class="tp-page" data-page="families"><section class="subpage tp-memories"><div class="gutter mx-auto max-w-[110rem]">
    <div class="tp-memories__head">
      <div>
        <p class="font-scrawl text-lg text-toffee-ink" data-reveal="true">our wall of happy endings</p>
        <h1 class="font-plush text-giant tp-memories__title" data-reveal="true">Happy<br>families${heartOutlineSvg()}</h1>
        <p class="text-lede mt-6 max-w-[50ch] text-cocoa-soft" data-reveal="true">Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful moments shared by our amazing clients after welcoming their furry friends.</p>
        <p class="font-scrawl mt-5 text-lg text-toffee-ink" data-reveal="true">${data.families.length} moments and counting</p>
      </div>
      ${testimonial('tp-memories__note')}
    </div>
    <div class="mt-16">${photoWall(base, data.families, false, data.families)}</div>
    <div class="tp-memories__foot">${link('Meet available puppies', `${base}puppies/`)}</div>
  </div></section></div>`;
}

const noteTilts = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.7, -1.9, 1.4];
const notePins = ['#c2622b', '#2f6e9e', '#d9a13c', '#c45a6a'];

function faq(base, data) {
  return `<div class="tp-page" data-page="faq"><section class="subpage tp-faqroom"><div class="gutter mx-auto max-w-[110rem]">
    <header><h1 class="font-plush text-giant">Questions<br>&amp; answers</h1><p class="text-lede mt-4 max-w-[44ch] text-milk-soft">Can’t find what you’re looking for? Search below or ask us on WhatsApp — our team is available 24/7.</p></header>
    <div class="tp-notes">
      <aside class="tp-notes__side" aria-label="Find a question">
        <label class="font-scrawl tp-notes__label" for="faq-search">sniff out a question</label>
        <div class="tp-notes__search">
          <svg viewBox="0 0 24 24" aria-hidden="true" class="tp-notes__lens"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m15.5 15.5 5 5"></path></svg>
          <input type="search" id="faq-search" placeholder="delivery, Korea, vaccinated…" autocomplete="off">
        </div>
        <p class="tp-notes__count" data-faq-count aria-live="polite">${data.questions.length} notes on the board</p>
        <div class="tp-notes__teddy">
          <span aria-hidden="true" class="tp-notes__bubble font-plush"><span class="tp-notes__q">?</span><span class="tp-notes__a">!</span></span>
          <div data-pup-buddy="sit" data-act="tilt" data-facing="right">${teddy(base, 'teddy', 'Teddy, reading the notes')}</div>
        </div>
        ${link('Ask your own question', whatsApp(), 'green', 'tp-notes__ask')}
      </aside>
      <div class="tp-notes__board">
        <ul class="tp-notes__list">
          ${data.questions.map(({ question, answer }, i) => `<li class="tp-note" data-reveal="true" style="--tilt:${noteTilts[i % noteTilts.length]}deg;--pin:${notePins[i % notePins.length]};--i:${i}">
            <span aria-hidden="true" class="tp-note__pin"></span>
            <details class="faq-note">
              <summary class="tp-note__q"><span class="font-plush-text">${escape(question)}</span><span aria-hidden="true" class="tp-note__chevron"></span></summary>
              <div class="tp-note__answer"><div class="tp-note__flap"><p>${escape(answer)}</p></div></div>
            </details>
          </li>`).join('')}
        </ul>
        <div class="tp-note tp-note--empty" data-no-faq hidden><span aria-hidden="true" class="tp-note__pin"></span><p class="font-plush-text text-big">No matching notes.</p><p class="mt-2">Try another word or <a class="link-ink" href="${whatsApp()}" target="_blank" rel="noopener noreferrer">ask us on WhatsApp</a> and we’ll answer.</p></div>
      </div>
    </div>
  </div></section></div>`;
}

const journeyTabs = [
  { label: 'In Dubai', note: 'meet in person', title: 'Meet your puppy in person', summary: 'Visit the Downtown Dubai showroom to spend time with a puppy and discuss its health, temperament, and care.', cards: ['Talk to us', 'Visit the showroom', 'Meet your puppy', 'Bring them home'] },
  { label: 'Imported', note: 'order upon request', title: 'Order upon request', summary: 'Ask about puppies from overseas. We’ll help you review photos and veterinary details and talk through travel and arrival.', cards: ['Reserve your puppy', 'Personal consultation', 'Import and arrival', 'Welcome home'] },
];

const stepIcons = [
  '<path d="M10 14h44v28H30l-12 10v-10h-8z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>',
  '<path d="M16 48V24l16-12 16 12v24H16z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M27 48V34h10v14" fill="none" stroke="currentColor" stroke-width="3"/>',
  '<path d="M32 54C16 43 8 34 8 24c0-7 5.4-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 6.6 0 12 5 12 12 0 10-8 19-24 30z" fill="none" stroke="currentColor" stroke-width="3"/>',
  '<path d="M14 44h36M22 30l10-12 10 12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
];
const stepTints = ['#fbe3b4', '#f9cdbf', '#bfddf5', '#e5f1e0'];

function howItWorks(base) {
  const sections = [['two-ways', 'Two ways home'], ['promise', 'Our premium puppy promise'], ['delivery', 'Delivery & collection'], ['why', 'Why choose us']];
  const delivery = [
    ['Take your puppy home the same day', 'Confirm availability and collection when you book your visit.'],
    ['Delivery within Dubai', 'Ask the team about delivery to your area.'],
    ['Safe international cargo', 'Get help with travel arrangements and paperwork.'],
    ['Worldwide delivery', 'Ask about options for your destination.'],
  ];
  const postcardSvg = [
    `<figure class="tp-postcard" aria-hidden="true"><span class="tp-postcard__sun"></span><span class="font-scrawl tp-postcard__to tp-postcard__to--left">Downtown Dubai</span><svg viewBox="0 0 300 120" class="tp-postcard__city"><path d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></figure>`,
    `<figure class="tp-postcard tp-postcard--sky" aria-hidden="true"><svg viewBox="0 0 260 120" class="tp-postcard__route"><path d="M12 96 C78 16, 174 14, 246 72"/></svg><svg viewBox="0 0 64 40" class="tp-postcard__plane"><path d="M4 22l18-2 10-14h6l-4 14 14-1 5-6h3l-2 9 2 9h-3l-5-6-14-1 4 14h-6L22 24z" fill="currentColor" stroke="#2a170e" stroke-width="2" stroke-linejoin="round"/></svg><span class="font-scrawl tp-postcard__from">Korea</span><span class="font-scrawl tp-postcard__to">Dubai</span></figure>`,
  ];
  return `<div class="tp-page" data-page="how"><section class="tp-scene subpage process" data-pup-scene="true" data-tone="light" style="--sky-top:#fffbf3;--sky-bottom:#f6cc85" aria-labelledby="how-title">
    <div class="gutter mx-auto max-w-[110rem]">
      <header class="split-intro"><h1 id="how-title" class="font-plush text-giant">How it works</h1><p class="text-lede text-[var(--ink-soft)]">Whether you choose to visit us locally or order a premium breed from overseas, TeddyPups is here to make the experience unforgettable.</p></header>
      <nav class="jump-links" aria-label="On this page">${sections.map(([id, label], i) => `<a href="#${id}" class="chip"><span class="font-plush text-toffee">${i + 1}</span> ${label}</a>`).join('')}</nav>
      <section class="tp-journeys" id="two-ways" data-ready="true" aria-labelledby="two-ways-title">
        <div class="tp-journeys__top">
          <div><p class="font-scrawl tp-journeys__kicker">choose your way</p><h2 id="two-ways-title" class="font-plush text-big">Two ways home</h2></div>
          <div class="tp-journeys__pick">
            <div class="journey-tabs tp-switch" role="tablist" aria-label="Puppy journeys" style="--at:0;--n:2">
              <span aria-hidden="true" class="tp-switch__thumb"></span>
              ${journeyTabs.map(({ label, note }, i) => `<button type="button" class="tp-switch__tab" role="tab" id="way-tab-${i}" aria-controls="way-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><strong class="tp-switch__label font-plush">${label}</strong><small class="tp-switch__hint">${note}</small></button>`).join('')}
            </div>
            <div class="tp-journeys__teddy" data-pup-buddy="sit" data-facing="left">${teddy(base)}</div>
          </div>
        </div>
        ${journeyTabs.map(({ title, summary, cards }, i) => `<div class="journey-panel tp-journey" id="way-${i}" role="tabpanel" aria-labelledby="way-tab-${i}"${i === 0 ? '' : ' hidden'}>
          <div class="tp-journey__head"><div><h3 class="tp-journey__title font-plush">${title}</h3><p class="text-lede mt-4 text-[var(--ink-soft)]">${summary}</p></div>${postcardSvg[i]}</div>
          <ol class="tp-steps">${cards.map((titleText, index) => `<li class="tp-step" style="--i:${index};--tint:${stepTints[index % stepTints.length]}"><span class="tp-step__icon"><svg viewBox="0 0 64 64" aria-hidden="true">${stepIcons[index % stepIcons.length]}</svg></span><span class="tp-step__num font-scrawl">step ${index + 1}</span><h4 class="tp-step__title font-plush">${titleText}</h4></li>`).join('')}</ol>
        </div>`).join('')}
      </section>
      <section class="process-section tp-paper mt-16" id="promise"><p class="font-scrawl text-toffee-ink">care from day one</p><h2 class="font-plush text-big mt-2">Our premium puppy promise</h2><p class="mt-3 max-w-[54ch] text-cocoa-soft">Ask us for a puppy’s medical records, photos and care instructions. We’re here to help you plan for their first days at home.</p></section>
      <section class="process-section mt-16" id="delivery"><h2 class="font-plush text-big">Delivery &amp; collection</h2><div class="info-grid mt-6">${delivery.map(([title, copy]) => `<article class="tp-paper"><h3 class="font-plush text-xl">${title}</h3><p class="mt-2 text-cocoa-soft">${copy}</p></article>`).join('')}</div></section>
      <section class="process-section mt-16" id="why"><h2 class="font-plush text-big">Why choose us</h2><div class="info-grid three mt-6">${['International cargo', 'Support 24/7', 'Health guarantee'].map((title) => `<article class="tp-paper"><h3 class="font-plush text-xl">${title}</h3></article>`).join('')}</div></section>
      <section class="process-section section-heading tp-paper mt-16"><div><h2 class="font-plush text-big">Unique and high quality puppies</h2><p class="mt-2 text-cocoa-soft">Browse available puppies and see photos of each one.</p></div>${link('View available puppies', `${base}puppies/`)}</section>
    </div>
  </section></div>`;
}

const envelopeSvg = `<svg viewBox="0 0 160 112" class="tp-post__envelope"><rect x="4" y="18" width="152" height="90" rx="6" fill="#fffdf8" stroke="#2a170e" stroke-width="4"></rect><path d="M6 104 64 62M154 104 96 62" fill="none" stroke="#2a170e" stroke-width="3" stroke-linecap="round"></path><path class="tp-post__flap" d="M6 22 80 74 154 22" fill="#fbe3b4" stroke="#2a170e" stroke-width="4" stroke-linejoin="round"></path><circle cx="80" cy="72" r="11" fill="#a24a1a" stroke="#2a170e" stroke-width="3"></circle></svg>`;
const mailboxSvg = `<svg viewBox="0 0 200 260" class="tp-post__box"><rect x="86" y="170" width="28" height="86" fill="#5a3a28" stroke="#2a170e" stroke-width="4"></rect><path d="M30 70a70 54 0 0 1 140 0v104H30z" fill="#c2622b" stroke="#2a170e" stroke-width="5" stroke-linejoin="round"></path><rect x="58" y="86" width="84" height="14" rx="7" fill="#2a170e"></rect><path d="M44 128h112" stroke="#2a170e" stroke-width="3" stroke-linecap="round" opacity=".35"></path><g class="tp-post__flag"><path d="M170 120V64" stroke="#2a170e" stroke-width="5" stroke-linecap="round"></path><path d="M170 64h22v16h-22" fill="#f2be6b" stroke="#2a170e" stroke-width="4" stroke-linejoin="round"></path></g></svg>`;
const sentBoxSvg = `<svg viewBox="0 0 200 150" aria-hidden="true" class="tp-post__box tp-post__box--sent"><rect x="86" y="96" width="28" height="52" fill="#5a3a28" stroke="#2a170e" stroke-width="4"></rect><path d="M30 50a70 44 0 0 1 140 0v52H30z" fill="#c2622b" stroke="#2a170e" stroke-width="5" stroke-linejoin="round"></path><rect x="58" y="58" width="84" height="12" rx="6" fill="#2a170e"></rect><path d="M170 92V22" stroke="#2a170e" stroke-width="5" stroke-linecap="round"></path><path d="M170 22h22v16h-22" fill="#f2be6b" stroke="#2a170e" stroke-width="4" stroke-linejoin="round"></path></svg>`;

function form(data, puppy) {
  const select = `<span class="tp-blank tp-blank--select"><select name="puppy" aria-label="Puppy you’re interested in"><option value="">any puppy (not sure yet)</option>${available(data).map((p) => `<option value="${escape(`${p.name} (${p.meta})`)}">${escape(`${p.name} (${p.meta})`)}</option>`).join('')}</select></span>`;
  return `<div class="tp-post" data-phase="writing">
    <form class="letter tp-letterform" data-enquiry data-phone="${contactNumber}"${puppy ? ` data-puppy-name="${escape(puppy.name)}"` : ''}>
      <span aria-hidden="true" class="tp-letter__stamp">${pawSvg('size-9')}</span>
      <p class="font-scrawl tp-letterform__greeting">Dear TeddyPups,</p>
      <p class="tp-letterform__line">my name is <span class="tp-blank" style="--size:16ch"><input name="name" aria-label="Your name" autocomplete="name" minlength="2" maxlength="100" required></span>, and you can reach me on <span class="tp-blank" style="--size:15ch"><input name="phone" type="tel" aria-label="Phone or WhatsApp number with country code" autocomplete="tel" maxlength="24" placeholder="+971 50 123 4567" required></span> or by email at <span class="tp-blank" style="--size:20ch"><input name="email" type="email" aria-label="Your email" autocomplete="email" maxlength="160" placeholder="optional"></span>.</p>
      <p class="tp-letterform__line">I live in <span class="tp-blank" style="--size:13ch"><input name="area" aria-label="Your area" autocomplete="address-level2" maxlength="120" placeholder="e.g. Dubai Marina"></span>, and I’m curious about ${puppy ? `<b>${escape(puppy.name)}</b>` : select}.</p>
      <textarea class="tp-letterform__note" name="message" aria-label="Your message" maxlength="900" rows="4" placeholder="Anything else you’d like to tell us…"></textarea>
      <div class="tp-letterform__sign"><span class="font-scrawl">with love, a future puppy parent</span><button class="pill primary btn btn-primary" type="submit">${puppy ? 'Send enquiry' : 'Post my letter'}</button></div>
      <p class="form-hint">This opens a WhatsApp draft for you to review and send.</p>
    </form>
    <div aria-hidden="true" class="tp-post__scene" hidden>${envelopeSvg}${mailboxSvg}</div>
    <div class="tp-post__sent" data-sent-panel hidden>${sentBoxSvg}<p class="font-plush text-big mt-4">Draft ready for WhatsApp</p><p class="mt-2 text-cocoa-soft">Your message was composed for you to review and send directly to TeddyPups.</p></div>
    <p class="form-status" role="status" hidden></p>
  </div>`;
}

function contact(base, data) {
  return `<div class="tp-page" data-page="contact"><section class="tp-scene subpage contact-page" data-pup-scene="true" data-tone="light" style="--sky-top:#fff9ee;--sky-bottom:#f9dca4" aria-labelledby="contact-title">
    <div class="gutter mx-auto max-w-[110rem]">
      <header class="split-intro"><h1 id="contact-title" class="font-plush text-giant">Get in touch<br>with us</h1><p class="text-lede text-[var(--ink-soft)]">Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly.</p></header>
      <div class="contact-layout mt-12">
        <aside>${link(`WhatsApp ${displayPhone}`, whatsApp(), 'green')}
          <p class="mt-6"><span class="font-scrawl block text-toffee-ink">call us</span><a class="link-ink font-semibold" href="${call}">${displayPhone}</a></p>
          <p class="mt-4"><span class="font-scrawl block text-toffee-ink">email</span><a class="link-ink font-semibold" href="mailto:info@instabizweb.com">info@instabizweb.com</a></p>
          <div class="tp-shopfront storefront mt-8"><div class="p-6 tp-visit"><div><h2 class="font-plush text-big">Visit us in<br>Downtown Dubai</h2><p class="mt-2 text-cocoa-soft">Book a time to meet available puppies and ask about next steps.</p>${link('Arrange a visit', whatsApp('Hello! Can I arrange a showroom visit?'), 'outline', 'mt-4')}</div><span class="tp-visit__photo">${img(base, data.showroom, 'Puppy at the Dubai showroom')}</span></div></div>
        </aside>
        <div>${form(data)}</div>
      </div>
    </div>
  </section></div>`;
}

function profile(base, data, puppy) {
  const isAvailable = puppy.status === 'available';
  const media = [{ image: puppy.image, alt: puppy.alt || `${puppy.name} puppy` }, ...puppy.media].map((m) => ({
    src: `${base}assets/${m.video || m.image}`, video: Boolean(m.video), alt: m.alt || `${puppy.name} puppy`,
    ...(m.video ? { poster: `${base}assets/${puppy.image}` } : {}),
  }));
  const name = escape(puppy.name);
  return `<div class="tp-page" data-page="pup"><article class="tp-storybook subpage profile">
    <div aria-hidden="true" class="tp-ribbon"><div class="tp-ribbon__track"><span class="tp-ribbon__band"></span></div></div>
    <div class="gutter mx-auto max-w-[110rem]">
      <nav aria-label="Breadcrumb" class="backlink"><a class="link-ink" href="${base}${isAvailable ? 'puppies/' : 'gone-home/'}">‹ ${isAvailable ? 'Available puppies' : 'Gone home'}</a> / <span>${name}</span></nav>
      <p class="tp-chapter"><span aria-hidden="true" class="tp-chapter__n font-plush">1</span><span class="font-scrawl">hello, it’s me</span></p>
      <div class="profile-layout mt-4">
        <div class="storybook" data-story>
          <div class="tp-storypage story-frame">
            <div class="story-media">${img(base, puppy.image, puppy.alt || `${puppy.name} puppy`, true)}</div>
            <button class="story-expand" type="button" data-expand aria-label="Open ${name} media full screen"></button>
            ${media.length > 1 ? `<div class="story-controls"><button type="button" data-prev aria-label="Previous media">‹</button>
              <span data-story-count>1 / ${media.length}</span><button type="button" data-next aria-label="Next media">›</button></div>` : ''}
          </div>
          ${media.length > 1 ? `<div class="thumbnails" aria-label="Profile media">${media.map((m, index) => `<button type="button" data-thumb="${index}" aria-label="${m.video ? 'Video' : 'Photo'} ${index + 1}" aria-pressed="${index === 0}"><img src="${m.poster || m.src}" alt="" loading="lazy">${m.video ? '<span>▶</span>' : ''}</button>`).join('')}</div>` : ''}
          ${json(media)}
        </div>
        <div class="profile-side">
          <section class="tp-tag tp-board puppy-tag" data-reveal="true">
            <span aria-hidden="true" class="tp-tag__ring"></span>
            <div class="tag-teddy" data-pup-buddy="peek" data-facing="right" data-act="peekaboo">${teddy(base, 'teddy-peek')}</div>
            <span class="status chip">${pawSvg('paw')}${isAvailable ? 'Available' : 'Gone home'}</span>
            <h1 class="font-plush text-huge mt-2">${name}</h1>
            <p class="text-cocoa-soft">${escape(puppy.details.Breed || puppy.meta)}</p>
            ${Object.keys(puppy.details).length ? `<dl class="mt-4">${Object.entries(puppy.details).map(([term, value]) => `<div><dt class="font-scrawl">${escape(term)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>` : ''}
            ${isAvailable ? '' : '<p class="mt-4 text-cocoa-soft">This puppy has already joined a family.</p>'}
            <div class="profile-tag-actions mt-6">
              ${isAvailable ? `${link(`Ask about ${name} on WhatsApp`, whatsApp(`Hello! I'd like to ask about ${puppy.name}.`), 'green')}${link('Send an enquiry', '#enquiry', 'outline')}` : `${link('See available puppies', `${base}puppies/`)}${link('Ask about similar puppies', whatsApp(`Hello! Can I ask about puppies similar to ${puppy.name}?`), 'outline')}`}
            </div>
          </section>
          ${isAvailable ? `<section class="tp-poster puppy-includes mt-8"><p class="font-scrawl text-toffee-ink">what comes with ${name}</p><h2 class="font-plush text-big mt-1">Every Teddy Pup comes</h2><ul class="tp-poster__tabs mt-4"><li class="tp-poster__tab" data-reveal="true" style="--i:0">Vaccinated</li><li class="tp-poster__tab" data-reveal="true" style="--i:1">Dewormed</li><li class="tp-poster__tab" data-reveal="true" style="--i:2">Health certificate from a licensed vet</li></ul></section>` : ''}
        </div>
      </div>
      ${isAvailable ? `<section class="process-section mt-16"><h2 class="font-plush text-big">${puppy.details.Where === 'Imported for you' ? 'Coming home from abroad' : 'Bringing your puppy home'}</h2>
        <ol class="tp-trail tp-trail--row tp-trail--paws mt-8">${journeyTabs[puppy.details.Where === 'Imported for you' ? 1 : 0].cards.map((title, index) => `<li><span class="tp-trail__num font-plush">${index + 1}</span><h3 class="font-plush text-xl">${title}</h3></li>`).join('')}</ol></section>
        <section class="profile-enquiry mt-16" id="enquiry"><header><p class="font-scrawl text-toffee-ink">dear TeddyPups…</p><h2 class="font-plush text-big mt-1">Ask about ${name}</h2><p class="mt-2 text-cocoa-soft">Tell us a little about yourself and what you’d like to know.</p></header>${form(data, puppy)}</section>` : ''}
    </div>
  </article></div>`;
}

const lightbox = `<dialog class="lightbox" aria-label="Media viewer" data-lenis-prevent><button class="light-close" type="button" aria-label="Close media">×</button>
  <button class="light-prev" type="button" aria-label="Previous image">‹</button><figure><div data-light-media></div><figcaption aria-live="polite"></figcaption></figure>
  <button class="light-next" type="button" aria-label="Next image">›</button></dialog>`;

const curtainPrints = [[18, 6, 14, 0.16], [27, -4, 6, 0.28], [36, 7, 18, 0.4], [45, -3, 4, 0.52], [54, 6, 16, 0.64]];
const runnerLeg = (mod, x, y, wTop, wMid, wBot, hMid, hBot, fill, clawY) => {
  const body = `M-${wTop} -14 C-${wTop} 4 -${wMid} ${hMid} -${wMid} ${hBot} C-${wMid} ${hBot + 7} -7 ${hBot + 9} 0 ${hBot + 9} C9 ${hBot + 9} ${wBot} ${hBot + 6} ${wBot} ${hBot} C${wBot} ${hMid} ${wTop} 4 ${wTop} -14`;
  return `<g class="tp-runner__leg tp-runner__leg--${mod}" style="transform-origin:${x}px ${y}px"><g transform="translate(${x} ${y})"><path d="${body}Z" fill="${fill}"></path><path d="${body}" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" fill="none"></path><path d="M-3.5 ${clawY} v5 M4.5 ${clawY} v5" stroke="#2a170e" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" fill="none"></path></g></g>`;
};
const curtain = () => `<div class="tp-curtain" data-state="intro" aria-hidden="true"><div class="tp-curtain__blanket"><svg class="tp-curtain__edge tp-curtain__edge--top" width="100%" height="40" preserveAspectRatio="none"><defs><pattern id="tp-curtain-scallop" width="76" height="40" patternUnits="userSpaceOnUse"><path d="M0 40V27A38 25 0 0 1 76 27V40Z" fill="#fbe3b4"></path><path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" stroke-width="3"></path><path d="M11 33A27 19 0 0 1 65 33" fill="none" stroke="#2a170e" stroke-width="1.6" stroke-dasharray="3.5 5.5" stroke-linecap="round" opacity=".42"></path></pattern></defs><rect width="100%" height="40" fill="url(#tp-curtain-scallop)"></rect></svg><div class="tp-curtain__stage"><div class="tp-curtain__prints">${curtainPrints.map(([left, top, rotate, delay]) => `<svg viewBox="0 0 64 64" class="tp-curtain__print" style="left:${left}%;top:${top}px;rotate:${rotate}deg;animation-delay:${delay}s"><path d="${pawPath}"></path></svg>`).join('')}</div><div class="tp-curtain__runner"><svg viewBox="0 0 300 240" class="tp-runner" aria-hidden="true" focusable="false" style="overflow:visible"><ellipse cx="150" cy="230" rx="86" ry="7" fill="#2a170e" opacity="0.12" class="tp-runner__shadow"></ellipse><g class="tp-runner__body">${runnerLeg('bf', 94, 192, 14, 12, 13, 18, 27, '#e4a352', 29)}${runnerLeg('ff', 168, 192, 11, 12, 13, 18, 27, '#e4a352', 29)}<g class="tp-runner__tail" style="transform-origin:84px 150px"><path d="M86 152 C80 146 76 140 74 136" stroke="#2a170e" stroke-width="9" stroke-linejoin="round" stroke-linecap="round" fill="none"></path><path d="M86 152 C80 146 76 140 74 136" stroke="#f2be6b" stroke-width="4" fill="none" stroke-linecap="round"></path><path d="M70.0 110.0Q78.1 105.0 80.9 113.7Q90.5 114.8 86.7 123.2Q93.4 129.9 84.7 134.0Q85.2 143.1 75.8 141.0Q70.0 148.3 64.2 141.0Q54.8 143.1 55.3 134.0Q46.6 129.9 53.3 123.2Q49.5 114.8 59.1 113.7Q61.9 105.0 70.0 110.0Z" fill="#f2be6b" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"></path></g>${runnerLeg('bn', 110, 194, 15, 12, 13, 16, 25, '#f2be6b', 27)}<path d="M76.8 175.6Q69.0 167.9 78.2 160.7Q76.6 151.8 90.3 147.3Q95.2 138.9 110.9 137.9Q121.6 131.3 136.7 134.0Q151.1 130.5 162.9 136.4Q178.7 136.4 185.3 144.5Q199.7 148.2 199.7 157.1Q210.3 163.7 203.9 171.9Q208.7 180.4 197.0 186.3Q195.3 195.2 180.3 198.0Q172.3 205.7 156.6 204.8Q143.7 210.0 130.0 205.6Q114.5 207.4 105.1 200.2Q89.7 198.3 86.3 189.6Q73.6 184.3 76.8 175.6Z" fill="#f2be6b" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"></path><path d="M182.7 196.4Q169.4 196.9 166.6 183.0Q156.1 174.1 162.3 161.5Q159.6 147.6 171.9 142.2Q178.2 129.7 191.0 134.0Q203.3 128.7 210.5 140.8Q223.1 145.2 221.3 159.3Q228.4 171.5 218.5 181.0Q216.6 195.1 203.2 195.7Q193.3 205.1 182.7 196.4Z" fill="#f2be6b" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"></path>${runnerLeg('fn', 186, 194, 12, 12, 13, 16, 25, '#f2be6b', 27)}<g class="tp-runner__head"><path d="M178 146 Q212 162 246 146 L246 154 Q212 170 178 154 Z" fill="#a24a1a" stroke="#2a170e" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"></path><path d="M212 160 C212 156 206 155 206 159.4 C206 163 212 166.6 212 168.4 C212 166.6 218 163 218 159.4 C218 155 212 156 212 160 Z" fill="#fbe3b4" stroke="#2a170e" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"></path><path d="M177.1 78.7Q186.9 70.8 186.6 87.4Q196.0 89.9 189.9 105.5Q195.2 117.3 185.5 126.0Q184.7 142.8 175.2 141.2Q168.7 156.5 162.9 145.3Q153.1 153.2 153.4 136.6Q144.0 134.1 150.1 118.5Q144.8 106.7 154.5 98.0Q155.3 81.2 164.8 82.8Q171.3 67.5 177.1 78.7Z" fill="#e4a352" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" class="tp-runner__ear" style="transform-origin:174px 82px"></path><path d="M246.9 78.7Q252.7 67.5 259.2 82.8Q268.7 81.2 269.5 98.0Q279.2 106.7 273.9 118.5Q280.0 134.1 270.6 136.6Q270.9 153.2 261.1 145.3Q255.3 156.5 248.8 141.2Q239.3 142.8 238.5 126.0Q228.8 117.3 234.1 105.5Q228.0 89.9 237.4 87.4Q237.1 70.8 246.9 78.7Z" fill="#e4a352" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" class="tp-runner__ear tp-runner__ear--r" style="transform-origin:250px 82px"></path><path d="M212.0 54.0Q223.4 48.2 231.5 57.5Q244.5 56.1 248.1 67.5Q260.7 70.7 259.1 82.4Q269.4 89.7 263.0 100.0Q269.4 110.3 259.1 117.6Q260.7 129.3 248.1 132.5Q244.5 143.9 231.5 142.5Q223.4 151.8 212.0 146.0Q200.6 151.8 192.5 142.5Q179.5 143.9 175.9 132.5Q163.3 129.3 164.9 117.6Q154.6 110.3 161.0 100.0Q154.6 89.7 164.9 82.4Q163.3 70.7 175.9 67.5Q179.5 56.1 192.5 57.5Q200.6 48.2 212.0 54.0Z" fill="#f2be6b" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"></path><path d="M195.0 52.0Q190.7 45.8 200.0 43.5Q203.2 36.9 212.0 40.0Q220.8 36.9 224.0 43.5Q233.3 45.8 229.0 52.0Q233.3 58.2 224.0 60.5Q220.8 67.1 212.0 64.0Q203.2 67.1 200.0 60.5Q190.7 58.2 195.0 52.0Z" fill="#f2be6b" stroke="#2a170e" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"></path><path d="M188 120 C188 106 200 100 212 100 C224 100 236 106 236 120 C236 133 225 140 212 140 C199 140 188 133 188 120 Z" fill="#fbe3b4"></path><circle cx="181" cy="116" r="7" fill="#f9b9a6" opacity="0.85"></circle><circle cx="243" cy="116" r="7" fill="#f9b9a6" opacity="0.85"></circle><path d="M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101" stroke="#2a170e" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" fill="none"></path><path d="M204.5 111.5 Q212 107.2 219.5 111.5 Q218.2 118.4 212 120 Q205.8 118.4 204.5 111.5 Z" fill="#2a170e"></path><path d="M212 120 V124.5 M212 124.5 Q207.2 129.6 202.8 125.2 M212 124.5 Q216.8 129.6 221.2 125.2" stroke="#2a170e" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" fill="none"></path><path d="M207.6 127.4 Q212 136.6 216.4 127.4 Z" fill="#e98c8c" stroke="#2a170e" stroke-width="2.2" stroke-linejoin="round"></path></g></g></svg></div><p class="tp-curtain__note hand font-scrawl">every puppy is family</p></div><svg class="tp-curtain__edge tp-curtain__edge--bottom" width="100%" height="40" preserveAspectRatio="none"><rect width="100%" height="40" fill="url(#tp-curtain-scallop)"></rect></svg></div></div>`;

export function pages(data) {
  return [
    { type: 'home', path: [], title: 'Premium teacup puppies in Dubai' },
    { type: 'puppies', path: ['puppies'], title: 'Available puppies' },
    { type: 'happy-families', path: ['happy-families'], title: 'Happy families' },
    { type: 'how-it-works', path: ['how-it-works'], title: 'How it works' },
    { type: 'faq', path: ['faq'], title: 'Questions & answers' },
    { type: 'contact', path: ['contact'], title: 'Get in touch with us' },
    { type: 'gone-home', path: ['gone-home'], title: 'Gone home' },
    ...data.puppies.map((puppy) => ({ type: 'profile', path: ['puppies', puppy.slug], title: puppy.name, puppy })),
  ];
}

export function page(route, data) {
  const base = '../'.repeat(route.path.length) || './';
  const views = {
    home,
    puppies: catalog,
    'happy-families': families,
    'how-it-works': howItWorks,
    faq,
    contact,
    'gone-home': goneHome,
    profile,
    missing: (root) => `<section class="wrap subpage center">${heading('Page unavailable', 'h1', 'font-plush text-giant')}${link('Go home', root)}</section>`,
  };
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>${escape(route.title)} | TeddyPups U.A.E.</title><meta name="description" content="Browse TeddyPups, explore puppy photos and learn about visiting the Dubai showroom."><meta name="theme-color" content="#fffdf8">
  <link rel="icon" href="${base}assets/${data.logo}" type="image/webp"><link rel="stylesheet" href="${base}styles.css">
  <script src="${base}site.js" defer></script></head><body data-page="${route.type}">
  ${curtain()}${header(base, route.type, data)}<main id="main" tabindex="-1">${views[route.type](base, data, route.puppy)}</main>
  ${footer(base, data)}${lightbox}</body></html>`;
}

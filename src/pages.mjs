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
const paw = `<svg class="paw" viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="7" cy="11" rx="3.1" ry="4.5" transform="rotate(-26 7 11)"/><ellipse cx="13" cy="6" rx="3" ry="4.4" transform="rotate(-10 13 6)"/><ellipse cx="20" cy="6" rx="3" ry="4.4" transform="rotate(10 20 6)"/><ellipse cx="26" cy="11" rx="3.1" ry="4.5" transform="rotate(26 26 11)"/><path d="M16 13c-5 0-11 7-11 12 0 3 3 5 6 5 2 0 4-1 5-1s3 1 5 1c3 0 6-2 6-5 0-5-6-12-11-12z"/></svg>`;
const underline = `<svg class="underline" viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 12 Q28 2 73 11 T148 11 T235 10 T331 10 T397 10" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`;
const heading = (text, level = 'h2') => `<${level} class="display">${text}</${level}>`;
const link = (text, url, style = 'primary') => `<a class="pill ${style}" href="${escape(url)}"${url.startsWith('https://wa.me') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
const img = (base, filename, alt = '', eager = false) =>
  `<img src="${base}assets/${escape(filename)}" alt="${escape(alt)}" ${eager ? 'loading="eager"' : 'loading="lazy"'} decoding="async">`;
const teddy = (base, variant = 'teddy', label = '') => img(base, `${variant}.svg`, label, variant === 'teddy-peek');
const profileUrl = (base, puppy) => `${base}puppies/${puppy.slug}/`;
const available = (data) => data.puppies.filter(({ status }) => status === 'available');
const adopted = (data) => data.puppies.filter(({ status }) => status === 'gone');

function header(base, type, data) {
  const selected = type === 'profile' ? 'puppies' : type;
  const navigation = nav.map(([label, path]) => {
    const active = selected === (path.split('/')[0] || 'home');
    return `<a href="${base}${path}"${active ? ' aria-current="page"' : ''}>${label}${active ? paw : ''}</a>`;
  }).join('');
  return `<a class="skip" href="#main">Skip to content</a>
    <header class="site-header${type === 'home' ? ' home-header' : ''}">
      <div class="wrap header-row">
        <a class="brand" href="${base}">${img(base, data.logo, '', true)}<span>TeddyPups</span></a>
        <nav class="desktop-nav" aria-label="Main navigation">${navigation}</nav>
        <div class="desktop-contact">${link('WhatsApp us', whatsApp(), 'green')}</div>
        <button class="pill outline menu-toggle" type="button" data-menu aria-controls="mobile-menu" aria-expanded="false">${paw} Menu</button>
      </div>
    </header>
    <dialog class="mobile-menu" id="mobile-menu" aria-label="Site menu">
      <div class="menu-top"><a class="brand" href="${base}">${img(base, data.logo, '')}TeddyPups</a>
        <button class="pill outline" type="button" data-close-menu>Close</button></div>
      <nav aria-label="Mobile navigation">${navigation}</nav>
      ${link('WhatsApp us', whatsApp(), 'green')}
    </dialog>
    <aside class="mobile-contact" aria-label="Quick contact">${link('WhatsApp us', whatsApp(), 'green')}${link('Call', call, 'outline')}</aside>`;
}

function footer(base, data) {
  return `<footer class="footer">
    <div class="wrap footer-grid">
      <div class="footer-brand"><a class="brand" href="${base}">${img(base, data.logo)}TeddyPups U.A.E.</a>
        <p>Find your new companion in Dubai or ask about a puppy from abroad.</p>
        ${link('WhatsApp us', whatsApp(), 'green')}</div>
      <nav aria-label="Footer navigation"><h2>Explore</h2>
        <a href="${base}puppies/">Available puppies</a><a href="${base}gone-home/">Gone home</a>
        <a href="${base}happy-families/">Happy families</a><a href="${base}how-it-works/#delivery">Delivery &amp; collection</a>
        <a href="${base}faq/">FAQ</a><a href="${base}contact/">Visit &amp; contact</a></nav>
      <div><h2>Say hello</h2><a href="${whatsApp()}" target="_blank" rel="noopener noreferrer">WhatsApp ${displayPhone}</a>
        <a href="mailto:info@instabizweb.com">info@instabizweb.com</a><p>Downtown Dubai, U.A.E.</p>
        <div class="socials"><a href="https://www.instabizweb.com/">Instagram</a><a href="https://www.instabizweb.com/">TikTok</a><a href="https://www.instabizweb.com/">Facebook</a></div></div>
    </div>
    <div class="wrap footer-end"><span>© TeddyPups U.A.E.</span><span>Reference site recreation</span></div>
  </footer>`;
}

function photoWall(base, items, captions = false, expanded = items) {
  const media = expanded.map(({ image, caption }) => ({ src: `${base}assets/${image}`, alt: caption }));
  return `<div class="photo-wall" data-wall>
    ${items.map(({ image, caption }, i) => `<button class="polaroid" type="button" data-photo="${i}" aria-label="Open photo ${i + 1} of ${expanded.length}">
      ${img(base, image, caption)}${captions ? `<span>${escape(caption)}</span>` : ''}</button>`).join('')}
    ${json(media)}
  </div>`;
}

function json(data) {
  return `<script type="application/json" data-media>${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function testimonial() {
  return `<blockquote class="testimonial"><p>“Our Maltipoo arrived healthy, cheerful, and absolutely perfect.”</p>
    <cite class="hand">Sarah M., Dubai, UAE</cite></blockquote>`;
}

function home(base, data) {
  const puppies = available(data);
  const homes = [
    ['Choose your breed', 'Tell us what you’re looking for and we’ll help you find a puppy suited to your home.'],
    ['Get photos &amp; details', 'We’ll send you recent photos, health information and videos when available.'],
    ['Secure &amp; safe delivery', 'Once you’ve chosen, we’ll help arrange collection or travel and keep you updated.'],
  ];
  const stamps = [
    ['♡', 'Vet-checked &amp; healthy', 'Ask for vaccination, deworming and veterinary paperwork.'],
    ['✈', 'Korea to Dubai, safely', 'We coordinate travel arrangements for imported puppies.'],
    ['☏', 'Support 24/7', 'Get help as you choose a puppy and after they come home.'],
    ['◎', 'Families worldwide', 'Explore photos shared by families after bringing their puppies home.'],
  ];
  return `<section class="hero scene">
    <div class="hero-copy"><p class="hand accent eyebrow">every puppy is family${underline}</p>
      ${heading('Premium teacup<br>puppies in Dubai', 'h1')}
      <p>Meet your new best friend in our Dubai showroom, or ask about a miniature breed from trusted breeders overseas.</p>
      <div class="actions">${link('View available puppies', `${base}puppies/`)}${link('Enquire on WhatsApp', whatsApp(), 'outline')}</div>
    </div>
    <div class="lineup" aria-label="Featured puppies"><div class="lineup-inner">
      ${puppies.slice(0, 6).map((p, i) => `<a class="portrait portrait-${i + 1}" href="${profileUrl(base, p)}" aria-label="Meet ${escape(p.name)}">${img(base, p.image, '', true)}<span class="hand">${escape(p.name)}</span></a>`).join('')}
      <div class="peek">${teddy(base, 'teddy-peek', 'Teddy the puppy mascot')}</div></div>
      <div class="quilt" aria-hidden="true"></div>
    </div>
  </section>
  <section class="scene meet">
    <header class="wrap section-heading"> <div>${heading('Meet the pups')}<p>Meet the puppies currently looking for their families.</p></div>
      ${link('See all available puppies', `${base}puppies/`)}</header>
    <div class="hallway">
      ${Array.from({ length: 5 }, (_, row) => `<div class="door-row"><div class="wrap door-grid">
        ${row === 0 ? `<div class="hall-teddy">${teddy(base)}</div>` : ''}
        ${puppies.slice(row * 3, row * 3 + 3).map((p, i) => `<a class="door-card" href="${profileUrl(base, p)}">
          ${heading(escape(p.name), 'h3')}<p>${escape(p.meta.replaceAll(' · ', ', '))}${p.media.some((m) => m.video) ? ', with video' : ''}</p>
          <span class="arched-door tone-${(row + i) % 3}">${img(base, p.image, p.alt)}<span class="door-panel" aria-hidden="true">${paw}<i></i></span><span class="badge hand">Available</span></span>
        </a>`).join('')}
      </div><div class="floor" aria-hidden="true"></div></div>`).join('')}
    </div><div class="center">${link('Meet them all', `${base}puppies/`)}</div>
  </section>
  <section class="scene paths"><div class="wrap"><header class="center narrow">${heading('Two ways to<br>meet your puppy')}</header>
    <div class="path-split">
      <article><h3 class="display sign">Puppies in Dubai</h3><div class="path-art skyline-art">${img(base, 'skyline.svg')}<figure class="showroom-mini">${img(base, data.showroom, 'Apricot puppy in the showroom')}<figcaption class="hand">In our showroom</figcaption></figure></div>
        <p>Spend time with a puppy at the Dubai showroom before choosing.</p>${link('Meet local puppies', `${base}puppies/?origin=local`)}</article>
      <article><h3 class="display sign">Imported for you</h3><div class="path-art flight-art" aria-hidden="true"><div class="flight-line"></div><span class="plane">✈</span><span class="hand korea">Korea</span><span class="hand dubai">Dubai</span></div>
        <p>Ask about Korean teacup breeds and get help arranging their journey to Dubai.</p>${link('See imported puppies', `${base}puppies/?origin=imported`)}</article>
      <div class="signpost" aria-hidden="true">${teddy(base)}</div>
    </div></div></section>
  <section class="scene journey"><div class="wrap journey-grid"><div>
    ${heading('Your puppy<br>journey')}<p class="intro">From choosing a breed to bringing your puppy home, here’s what to expect.</p>
    <ol class="steps">${homes.map(([title, copy]) => `<li>${heading(title, 'h3')}<p>${copy}</p></li>`).join('')}</ol>
    ${link('How it works', `${base}how-it-works/`, 'outline')}</div>
    <div class="journey-right"><div class="phone" data-chat>
      <header>${img(base, data.logo)}<div><b>TeddyPups U.A.E.</b><small>online</small></div></header>
      <div class="phone-screen"><div class="phone-message">Hi TeddyPups! I’d love to know more about your puppies.</div>
        <div class="phone-response" hidden><p>Which breed are you interested in?</p><div class="breed-links">${breeds.map(([key, label]) => `<a href="${base}puppies/?breed=${key}">${label}</a>`).join('')}</div>
        <button class="chat-video" type="button" data-showroom-video="${base}assets/${data.showroomVideo}" aria-label="Play showroom video">${img(base, data.chat, 'Apricot puppy in the showroom')}<span>▶</span></button></div></div>
      <a class="phone-input" href="${whatsApp()}" target="_blank" rel="noopener noreferrer">Say hello on WhatsApp <span aria-hidden="true">➤</span></a>
    </div><div class="journey-teddy">${teddy(base)}</div></div>
  </div></section>
  <section class="scene passport-scene"><div class="wrap passport"><header><p class="hand accent">puppy passport</p>${heading('Why families trust TeddyPups')}${teddy(base)}</header>
    <div class="stamp-grid">${stamps.map(([icon, title, copy]) => `<div><div class="stamp"><b aria-hidden="true">${icon}</b><strong>${title}</strong></div><p>${copy}</p></div>`).join('')}</div></div>
    <div class="sunset" aria-hidden="true"><div></div>${img(base, 'skyline.svg')}</div>
  </section>
  <section class="scene dusk"><div class="wrap"><div class="family-intro"><header>${heading('Happy families<br>&amp; puppies')}<p class="intro">See the moments families shared after welcoming their TeddyPups home.</p></header>${testimonial()}</div>
    <div class="photo-board">${photoWall(base, data.featuredFamilies, true, [...data.featuredFamilies, ...data.families.filter(({ image }) => !data.featuredFamilies.some(({ match }) => match === image))])}</div>
    <div class="center">${link('See every happy family', `${base}happy-families/`, 'light')}</div></div></section>
  <section class="scene night"><div class="wrap night-grid"><header>${heading('Questions,<br>answered')}${link('Read all questions', `${base}faq/`, 'light')}${teddy(base)}</header>
    <div>${data.questions.slice(0, 3).map(({ question, answer }) => `<article>${heading(escape(question), 'h3')}<p>${escape(answer)}</p></article>`).join('')}</div></div></section>
  <section class="scene welcome"><div class="wrap center">${heading('Ready to meet your<br>new best friend?')}<p class="intro">We’ll help you choose a puppy and arrange a visit, collection or delivery.</p>
    <div class="welcome-house"><a href="${profileUrl(base, puppies[0])}" aria-label="Meet Max">${img(base, puppies[0].image, 'Max the Maltipoo')}</a>${teddy(base, 'teddy-basket')}<div class="hand doormat">welcome home</div></div>
    <div class="actions">${link('Enquire on WhatsApp', whatsApp(), 'green')}${link('Visit & contact', `${base}contact/`, 'light')}</div>
  </div></section>`;
}

const breeds = [['maltipoo', 'Maltipoo'], ['pomeranian', 'Pomeranian'], ['poodle', 'Poodle'], ['cavapoo', 'Cavapoo'], ['shih-tzu', 'Shih Tzu']];
const options = [
  ['where', 'origin', [['', 'Everywhere'], ['imported', 'Imported'], ['korean-teacup', 'Korean Teacup']]],
  ['breed', 'breed', breeds],
  ['boy or girl', 'gender', [['male', 'Boys'], ['female', 'Girls']]],
];

function card(base, p, small = false) {
  const breed = p.details.Breed || p.meta;
  const keys = breeds.filter(([, label]) => breed.toLowerCase().includes(label.toLowerCase())).map(([key]) => key).join(' ');
  const sex = (p.details['Boy or girl'] || '').toLowerCase();
  const origin = p.details.Where === 'Imported for you' ? 'imported' : 'local';
  return `<a class="sketch${small ? ' small' : ''}" href="${profileUrl(base, p)}" ${small ? '' : `data-puppy data-breeds="${keys}" data-sex="${sex.includes('boy') ? 'male ' : ''}${sex.includes('girl') ? 'female' : ''}" data-origin="${origin}" data-korean="${breed.includes('Korean Teacup')}"`}>
    <span class="sketch-frame">${img(base, p.image, p.alt || `${p.name} puppy`)}<span class="badge hand">${small ? 'gone home ♥' : 'Available'}</span>
      ${p.media.some((m) => m.video) ? '<span class="video-badge">▶ video</span>' : ''}</span>
    ${heading(escape(p.name), 'h3')}${small ? '' : `<span>${escape(p.meta)}</span>`}</a>`;
}

function catalog(base, data) {
  const puppies = available(data);
  return `<section class="catalog subpage"><div class="wrap">
    <header class="catalog-head"><div><p class="hand accent">from Teddy’s sketchbook</p>
      <div class="title-underline">${heading('Available puppies', 'h1')}${underline}</div>
      <p class="intro">Browse real photos of each puppy. Open a profile for more pictures and ask us about your favorites on WhatsApp.</p></div>
      <figure class="self-portrait">${teddy(base)}<figcaption class="hand">self-portrait</figcaption></figure></header>
    <div class="filters paper" data-filters aria-label="Filter puppies">
      ${options.map(([label, key, values]) => `<div class="filter-row" role="group" aria-label="${label}"><span class="hand">${label}</span>
        <div>${values.map(([value, name]) => `<button class="pill outline filter" type="button" data-key="${key}" data-value="${value}" aria-pressed="${value === ''}">${name}</button>`).join('')}</div></div>`).join('')}
      <button class="text-button" type="button" data-reset hidden>Clear filters</button>
    </div>
    <p class="result-count hand" aria-live="polite" data-result>${puppies.length} puppies looking for a home</p>
    <div class="sketch-grid">${puppies.map((p) => card(base, p)).join('')}</div>
    <div class="empty paper center" data-empty hidden>${heading('No puppies match just now.', 'h2')}<p>Let us know what you’re looking for and we can help with your search.</p>${link('Ask us on WhatsApp', whatsApp(), 'green')}</div>
  </div></section>
  <section class="gone-strip"><div class="wrap"><div class="section-heading"><div>${heading('Already gone home')}<p>These puppies have found their families.</p></div>${link('See the puppies who’ve gone home', `${base}gone-home/`, 'outline')}</div>
    <div class="sketch-grid archive-preview">${adopted(data).slice(0, 5).map((p) => card(base, p, true)).join('')}</div></div></section>`;
}

function goneHome(base, data) {
  return `<section class="subpage gone"><div class="wrap"><header class="section-heading"><div>
    ${heading('Gone home <span class="heart" aria-hidden="true">♡</span>', 'h1')}<p class="intro">These puppies have already joined their families. We can help you find a similar puppy.</p>
    ${link('See available puppies', `${base}puppies/`)}</div><div class="ticket-booth">${teddy(base, 'teddy-peek')}<b class="display awning">tickets home</b></div></header>
    <div class="tickets">${adopted(data).map((p) => `<a class="ticket" href="${profileUrl(base, p)}">
      ${img(base, p.image, p.alt)}<div><span class="hand accent">one ticket home</span>${heading(escape(p.name), 'h2')}
      <p>${escape(p.meta)}</p><small>TEDDYPUPS <span aria-hidden="true">⤏</span> HOME ♥</small></div><strong class="display">admit one</strong></a>`).join('')}</div>
  </div></section>`;
}

function families(base, data) {
  return `<section class="subpage family-page"><div class="wrap"><div class="family-intro"><header>
    <p class="hand accent">our wall of happy endings</p>${heading('Happy<br>families <span class="heart" aria-hidden="true">♡</span>', 'h1')}
    <p class="intro">Photos shared by families after welcoming their puppies into their homes.</p><p class="hand accent">${data.families.length} moments and counting</p>
    </header>${testimonial()}</div>${photoWall(base, data.families)}
    <div class="center">${link('Meet available puppies', `${base}puppies/`)}</div></div></section>`;
}

function faq(base, data) {
  return `<section class="subpage faq-page"><div class="wrap"><header>
    ${heading('Questions<br>&amp; answers', 'h1')}<p class="intro">Looking for something specific? Search below or ask us on WhatsApp.</p></header>
    <div class="faq-layout"><aside><label class="hand" for="faq-search">sniff out a question</label>
      <div class="faq-search"><input type="search" id="faq-search" placeholder="delivery, Korea, vaccinated..." autocomplete="off"></div>
      <p data-faq-count aria-live="polite">${data.questions.length} notes on the board</p><div class="faq-teddy">${teddy(base)}</div>
      ${link('Ask your own question', whatsApp(), 'green')}</aside>
      <div class="corkboard">${data.questions.map(({ question, answer }) => `<details class="faq-note"><summary>${escape(question)}</summary><p>${escape(answer)}</p></details>`).join('')}
      <p class="empty center" data-no-faq hidden>No matching notes. Try another word or ask us directly.</p></div>
    </div></div></section>`;
}

const journeyTabs = [
  { label: 'In Dubai', note: 'meet in person', title: 'Meet your puppy in person', summary: 'Visit the Downtown Dubai showroom to spend time with a puppy and discuss its health, temperament, and care.', cards: ['Talk to us', 'Visit the showroom', 'Meet your puppy', 'Bring them home'] },
  { label: 'Imported', note: 'order upon request', title: 'Order upon request', summary: 'Ask about puppies from overseas. We’ll help you review photos and veterinary details and talk through travel and arrival.', cards: ['Reserve your puppy', 'Personal consultation', 'Import and arrival', 'Welcome home'] },
];

function howItWorks(base) {
  const sections = [['two-ways', 'Two ways home'], ['promise', 'Our premium puppy promise'], ['delivery', 'Delivery & collection'], ['why-us', 'Why choose us']];
  const delivery = [['Take your puppy home the same day', 'Confirm availability and collection when you book your visit.'], ['Delivery within Dubai', 'Ask the team about delivery to your area.'], ['Safe international cargo', 'Get help with travel arrangements and paperwork.'], ['Worldwide delivery', 'Ask about options for your destination.']];
  return `<section class="subpage process"><div class="wrap"><header class="split-intro">${heading('How it works', 'h1')}
    <p class="intro">Visit us in Dubai or ask us to help you choose a puppy from overseas.</p></header>
    <nav class="jump-links" aria-label="On this page">${sections.map(([id, label], i) => link(`<b>${i + 1}</b> ${label}`, `#${id}`, 'outline')).join('')}</nav>
    <section class="process-section" id="two-ways"><div class="section-heading"><header><p class="hand accent">choose your way</p>${heading('Two ways home')}</header>
      <div class="journey-tabs" role="tablist" aria-label="Puppy journeys">${journeyTabs.map(({ label, note }, i) => `<button type="button" role="tab" id="way-tab-${i}" aria-controls="way-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><strong class="display">${label}</strong><small>${note}</small></button>`).join('')}</div>${teddy(base)}</div>
      ${journeyTabs.map(({ title, summary, cards }, i) => `<div class="journey-panel" id="way-${i}" role="tabpanel" aria-labelledby="way-tab-${i}"${i === 0 ? '' : ' hidden'}>
        <div class="journey-panel-lead"><div>${heading(title, 'h3')}<p class="intro">${summary}</p></div>
        <div class="journey-art paper ${i ? 'flight-art' : 'city-card'}">${i ? '<span class="plane" aria-hidden="true">✈</span><span class="hand korea">Korea</span><span class="hand dubai">Dubai</span>' : `<span class="hand accent">Downtown Dubai</span><div aria-hidden="true"></div>${img(base, 'skyline.svg')}`}</div></div>
        <div class="info-grid">${cards.map((card, index) => `<article class="paper"><span class="hand accent">step ${index + 1}</span>${heading(card, 'h3')}</article>`).join('')}</div></div>`).join('')}
    </section>
    <section class="process-section paper promise" id="promise"><p class="hand accent">care from day one</p>${heading('Our premium puppy promise')}<p>Ask us for a puppy’s medical records, photos and care instructions. We’re here to help you plan for their first days at home.</p></section>
    <section class="process-section" id="delivery">${heading('Delivery &amp; collection')}<div class="info-grid">${delivery.map(([title, copy]) => `<article class="paper">${heading(title, 'h3')}<p>${copy}</p></article>`).join('')}</div></section>
    <section class="process-section" id="why-us">${heading('Why choose us')}<div class="info-grid three">${['International cargo', 'Support 24/7', 'Health guarantee'].map((title) => `<article class="paper">${heading(title, 'h3')}</article>`).join('')}</div></section>
    <section class="process-section section-heading paper"><div>${heading('Unique and high quality puppies')}<p>Browse available puppies and see photos of each one.</p></div>${link('View available puppies', `${base}puppies/`)}</section>
  </div></section>`;
}

function form(data, puppy) {
  const select = `<select name="puppy" aria-label="Puppy you’re interested in"><option value="">any puppy (not sure yet)</option>${available(data).map((p) => `<option value="${escape(`${p.name} (${p.meta})`)}">${escape(`${p.name} (${p.meta})`)}</option>`).join('')}</select>`;
  return `<form class="letter paper" data-enquiry data-phone="${contactNumber}"${puppy ? ` data-puppy-name="${escape(puppy.name)}"` : ''}>
    <div class="letter-stamp">${paw}</div><p class="hand accent salutation">Dear TeddyPups,</p>
    <div class="letter-fields">my name is <input name="name" aria-label="Your name" autocomplete="name" maxlength="100" required>, and you can reach me on
    <input name="phone" type="tel" aria-label="Phone or WhatsApp number with country code" autocomplete="tel" maxlength="24" placeholder="+971 50 123 4567" required> or by email at
    <input name="email" type="email" aria-label="Your email" autocomplete="email" maxlength="160" placeholder="optional">.
    <div>I live in <input name="area" aria-label="Your area" autocomplete="address-level2" maxlength="120" placeholder="e.g. Dubai Marina">, and I’m curious about ${puppy ? `<b>${escape(puppy.name)}</b>` : select}.</div></div>
    <textarea name="message" aria-label="Your message" maxlength="900" rows="4" placeholder="Anything else you’d like to tell us..."></textarea>
    <div class="letter-end"><span class="hand">with love, a future puppy parent</span><button class="pill primary" type="submit">${puppy ? 'Send enquiry' : 'Post my letter'}</button></div>
    <p class="form-hint">This opens a WhatsApp draft for you to review and send.</p><p class="form-status" role="status" hidden></p>
  </form>`;
}

function contact(base, data) {
  return `<section class="subpage contact-page"><div class="wrap"><header class="split-intro">
      ${heading('Get in touch<br>with us', 'h1')}<p class="intro">Have a question about a puppy, the adoption process, or visiting our Dubai showroom? We’d love to hear from you.</p></header>
    <div class="contact-layout"><aside>${link(`WhatsApp ${displayPhone}`, whatsApp(), 'green')}
      <p><span class="hand">call us</span><a href="${call}">${displayPhone}</a></p><p><span class="hand">email</span><a href="mailto:info@instabizweb.com">info@instabizweb.com</a></p>
      <div class="storefront awning paper"><div>${heading('Visit us in<br>Downtown Dubai')}<p>Book a time to meet available puppies and ask about next steps.</p>${link('Arrange a visit', whatsApp('Hello! Can I arrange a showroom visit?'), 'outline')}</div>${img(base, data.showroom, 'Puppy at the Dubai showroom')}</div></aside>
    ${form(data)}</div></div></section>`;
}

function profile(base, data, puppy) {
  const isAvailable = puppy.status === 'available';
  const media = [{ image: puppy.image, alt: puppy.alt || `${puppy.name} puppy` }, ...puppy.media].map((m) => ({
    src: `${base}assets/${m.video || m.image}`, video: Boolean(m.video), alt: m.alt || `${puppy.name} puppy`,
    ...(m.video ? { poster: `${base}assets/${puppy.image}` } : {}),
  }));
  const name = escape(puppy.name);
  return `<section class="subpage profile"><div class="wrap"><p class="backlink"><a href="${base}${isAvailable ? 'puppies/' : 'gone-home/'}">‹ ${isAvailable ? 'Available puppies' : 'Gone home'}</a> / ${name}</p>
    <div class="profile-layout"><div class="storybook" data-story>
      <div class="story-frame"><div class="story-media">${img(base, puppy.image, puppy.alt || `${puppy.name} puppy`, true)}</div>
        <button class="story-expand" type="button" data-expand aria-label="Open ${name} media full screen"></button>
        ${media.length > 1 ? `<div class="story-controls"><button type="button" data-prev aria-label="Previous media">‹</button>
        <span data-story-count>1 / ${media.length}</span><button type="button" data-next aria-label="Next media">›</button></div>` : ''}</div>
      ${media.length > 1 ? `<div class="thumbnails" aria-label="Profile media">${media.map((m, index) => `<button type="button" data-thumb="${index}" aria-label="${m.video ? 'Video' : 'Photo'} ${index + 1}" aria-pressed="${index === 0}"><img src="${m.poster || m.src}" alt="" loading="lazy">${m.video ? '<span>▶</span>' : ''}</button>`).join('')}</div>` : ''}
      ${json(media)}
    </div>
    <div><section class="puppy-tag paper">${teddy(base, 'teddy-peek')}<span class="status">${paw}${isAvailable ? 'Available' : 'Gone home'}</span>${heading(name, 'h1')}
      <p>${escape(puppy.details.Breed || puppy.meta)}</p>
      ${Object.keys(puppy.details).length ? `<dl>${Object.entries(puppy.details).map(([term, value]) => `<div><dt class="hand">${escape(term)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>` : ''}
      ${isAvailable ? '' : '<p>This puppy has already joined a family.</p>'}
      ${isAvailable ? `${link(`Ask about ${name} on WhatsApp`, whatsApp(`Hello! I'd like to ask about ${puppy.name}.`), 'green')}${link('Send an enquiry', '#enquiry', 'outline')}` : `${link('See available puppies', `${base}puppies/`)}${link('Ask about similar puppies', whatsApp(`Hello! Can I ask about puppies similar to ${puppy.name}?`), 'outline')}`}
    </section>
    ${isAvailable ? `<section class="puppy-includes paper"><p class="hand accent">what comes with ${name}</p>${heading('Every Teddy Pup comes')}<ul><li>Vaccinated</li><li>Dewormed</li><li>Health certificate from a licensed vet</li></ul></section>` : ''}</div></div>
    ${isAvailable ? `<section class="process-section">${heading(puppy.details.Where === 'Imported for you' ? 'Coming home from abroad' : 'Bringing your puppy home')}
      <div class="info-grid">${journeyTabs[puppy.details.Where === 'Imported for you' ? 1 : 0].cards.map((title, index) => `<div class="paper"><span class="hand accent">step ${index + 1}</span>${heading(title, 'h3')}</div>`).join('')}</div></section>
      <section class="profile-enquiry" id="enquiry"><header><p class="hand accent">dear TeddyPups…</p>${heading(`Ask about ${name}`)}<p>Tell us a little about yourself and what you’d like to know.</p></header>${form(data, puppy)}</section>` : ''}
  </div></section>`;
}

const lightbox = `<dialog class="lightbox" aria-label="Media viewer"><button class="light-close" type="button" aria-label="Close media">×</button>
  <button class="light-prev" type="button" aria-label="Previous image">‹</button><figure><div data-light-media></div><figcaption aria-live="polite"></figcaption></figure>
  <button class="light-next" type="button" aria-label="Next image">›</button></dialog>`;

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
  const views = { home, puppies: catalog, 'happy-families': families, 'how-it-works': howItWorks, faq, contact, 'gone-home': goneHome, profile,
    missing: (root) => `<section class="wrap subpage center">${heading('Page unavailable', 'h1')}${link('Go home', root)}</section>`,
  };
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>${escape(route.title)} | TeddyPups U.A.E.</title><meta name="description" content="Browse TeddyPups, explore puppy photos and learn about visiting the Dubai showroom."><meta name="theme-color" content="#fffdf8">
  <link rel="icon" href="${base}assets/${data.logo}" type="image/webp"><link rel="stylesheet" href="${base}styles.css">
  <script src="${base}site.js" defer></script></head><body data-page="${route.type}">
  ${header(base, route.type, data)}<main id="main" tabindex="-1">${views[route.type](base, data, route.puppy)}</main>
  ${footer(base, data)}${lightbox}</body></html>`;
}

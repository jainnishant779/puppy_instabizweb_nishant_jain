# TeddyPups reference audit

Inspected the public [TeddyPups demo](https://puppy.instabizweb.com/) on November 25, 2026. Compared rendered layouts at 1440 × 1000 and 390 × 844 and inspected public markup and assets for internal pages and profiles. The reference is a Next.js site with client-side enhancements. This project independently recreates its public visitor experience from static templates.

| Route | Layout and components | Interaction |
| --- | --- | --- |
| `/` | Centered cream hero with a handwritten eyebrow, heavy two-line title, two pills, six arched portraits and a Teddy mascot behind a scalloped quilt. The rest of the page follows a continuous honey-to-espresso gradient. | Links to profiles, an arched-door lineup, origin cards, breed links, showroom video, family gallery overlay, FAQ link, and enquiry links. |
| `/puppies` | Dotted sketchbook, oversized underlined title, mascot badge, paper filter panel, circular ink-and-wash portraits, archive strip. | Origin, breed and sex filters with query URLs, result count, clear action, and zero-results message. The current snapshot has 15 available listings and no local matches. |
| `/puppies/{slug}` | Tall framed media panel, thumbnails, available or gone-home tag, details, health inclusions, process, and enquiry letter. | Photo and video switching, lightbox, WhatsApp, enquiry anchor and form. |
| `/happy-families` | Warm striped background, title and handwritten subheading, ruled testimonial note, 64 taped photos. | Lightbox, previous and next, keyboard navigation and close. |
| `/how-it-works` | Oversized headline, jump links, two-state journey, illustrated Dubai skyline and travel panel, care promise and delivery cards. | Dubai/imported tabs, section hash links and catalogue CTAs. |
| `/faq` | Cinnamon-to-brown gradient, white heading, search on the left, nine corkboard notes on the right. | Live search over questions and answers, count, expandable notes and WhatsApp CTA. |
| `/contact` | Two-column page, storefront card and a lined letter with stamp and handwritten fields. | Required name and phone, optional email, area, puppy and message, plus direct contact links. |
| `/gone-home` | Cream background, ticket booth and a grid of 27 illustrated archive tickets. | Each ticket opens its profile. |

## Visual tokens

| Element | Observation |
| --- | --- |
| Display typography | Fraunces, weight 800, soft axis 100, wonky axis 1, optical size 144. Headings are closely tracked. Desktop home title is about 110 px at the captured size. |
| Supporting type | Figtree for body and controls. Shantell Sans for notes, captions, counts and labels. |
| Colors | Ink `#2a170e`, milk `#fffdf8`, honey `#f2be6b`, toffee `#c2622b`, green `#1e774e`. Home gradients follow `#fffdf8`, `#fff1d8`, `#fbe3b4`, `#f7d18d`, `#f0b866`, `#a65a30`, `#4d2b19`, `#2f1a10`, `#24130b`. |
| Shape and depth | Scallops, stitch marks, 2–3 px dark outlines, offset shadows, slightly tilted paper, corner folds and hand-drawn underline shapes. |
| Responsive navigation | Six centered links and a green WhatsApp pill on desktop. Menu and stacked hero buttons on mobile, with a fixed WhatsApp and Call bar. |

## Home scene order

1. Cream hero and quilt edge.
2. Meet the pups hallway, with one door for each available puppy.
3. Local showroom and imported-puppy travel signposts.
4. Three-step concierge journey and WhatsApp phone mockup.
5. Two-page puppy passport and Dubai sunset.
6. Family photo wall and testimonial.
7. Frequently asked questions on a starry dark background.
8. Welcome-home doorway, final contact links and footer.

The source phone link displays a placeholder Dubai number while WhatsApp targets a different number. The replica keeps the supplied destinations, and form submission opens a WhatsApp draft with the visitor’s details. The build uses static profile pages in place of the reference’s in-page profile overlay and approximates its scroll-driven mascot animation with CSS. Photos, mascot artwork, and fonts are indexed in [media-sources.json](media-sources.json).

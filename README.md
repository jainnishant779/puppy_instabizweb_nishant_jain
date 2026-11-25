# TeddyPups UAE reference recreation

A responsive recreation of the [TeddyPups reference site](https://puppy.instabizweb.com/), including 49 static pages, catalog filters, profile media, a family gallery, FAQ search, and enquiries.

[Live website](https://jainnishant779.github.io/puppy_instabizweb_nishant_jain/) · [Master prompt](docs/MASTER-PROMPT.md) · [Reference audit](docs/REFERENCE-AUDIT.md) · [Exact user brief](docs/AI-PROMPTS.md)

## Run locally

Use Node.js 22 or later.

```sh
npm run build
npm run check
npm start
```

Open `http://127.0.0.1:4173/`. The build only uses Node’s standard library.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/pages.mjs` | Shared layouts and server-free HTML templates |
| `src/data.json` | Puppy listings, profile media, family galleries and FAQ content |
| `public/styles.css` | Responsive storybook design and reduced-motion styles |
| `public/site.js` | Filters, mobile menu, media viewer, process tabs, FAQ and enquiry drafts |
| `public/assets/` | Local optimized media and self-hosted fonts |
| `scripts/` | Static build, local server and output verification |
| `docs/` | Reference observations, prompt, and asset provenance |

## Deployment and scope

GitHub Pages serves the generated `dist/` contents. Each route has its own HTML file, and page-relative links keep the site working under the repository URL on GitHub Pages.

Enquiry forms validate locally and open a WhatsApp draft. The visitor reviews and sends the message in WhatsApp. Contact links follow the reference, including its displayed sample call number. Puppy profiles use full pages and the mascot motion uses CSS and viewport-triggered effects.

Puppy and gallery photography and mascot artwork came from the public reference for this recreation. See [asset provenance](docs/media-sources.json). Font license files are included in `public/assets/`.

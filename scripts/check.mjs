import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { pages } from '../src/pages.mjs';

const data = JSON.parse(await readFile('src/data.json', 'utf8'));
const routes = pages(data);
assert.equal(new Set(routes.map(({ path }) => path.join('/'))).size, routes.length);
assert.equal(data.puppies.filter(({ status }) => status === 'available').length, 15);
assert.equal(data.puppies.filter(({ status }) => status === 'gone').length, 27);
assert.equal(data.families.length, 64);
assert.equal(data.questions.length, 9);
assert.equal(new Set(data.featuredFamilies.map(({ match }) => match)).size, 8);

const references = new Set();
for (const route of routes) {
  const file = resolve('dist', ...route.path, 'index.html');
  const html = await readFile(file, 'utf8');
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `Expected one h1 in ${file}`);
  assert.match(html, /<main id="main"/);
  const src = [...html.matchAll(/\b(?:href|src|poster|data-showroom-video)="([^"]+)"/g)].map(([, value]) => value);
  for (const [, json] of html.matchAll(/<script type="application\/json" data-media>(.*?)<\/script>/g)) {
    for (const item of JSON.parse(json)) src.push(item.src, ...(item.poster ? [item.poster] : []));
  }
  for (const href of src) {
    if (href.startsWith('#') || /^[a-z]+:/i.test(href)) continue;
    const url = new URL(href.replaceAll('&amp;', '&'), pathToFileURL(file));
    const path = fileURLToPath(url);
    references.add(url.pathname.endsWith('/') ? join(path, 'index.html') : path);
    if (url.hash && url.pathname.endsWith('/')) {
      const destination = await readFile(join(path, 'index.html'), 'utf8');
      assert.ok(destination.includes(`id="${url.hash.slice(1)}"`), `${href} points to a missing section`);
    }
  }
  assert.ok(file.startsWith(dirname(resolve('dist/index.html'))));
}
await Promise.all([...references].map(async (file) => {
  try { await access(file); }
  catch { assert.fail(`Missing linked file ${file}`); }
}));
console.log(`PASS: ${routes.length} HTML routes and ${references.size} unique local link targets and assets`);

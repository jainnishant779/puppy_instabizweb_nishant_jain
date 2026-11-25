import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { page, pages } from '../src/pages.mjs';

const data = JSON.parse(await readFile(new URL('../src/data.json', import.meta.url), 'utf8'));
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });

for (const route of pages(data)) {
  const directory = join('dist', ...route.path);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, 'index.html'), page(route, data));
}

await writeFile('dist/.nojekyll', '');
await writeFile('dist/404.html', page({ path: [], type: 'missing', title: 'Page unavailable' }, data));
console.log(`Built ${pages(data).length} pages in dist/`);

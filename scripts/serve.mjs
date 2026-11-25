import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = resolve('dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.txt': 'text/plain; charset=utf-8' };

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    let file = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) {
      return response.writeHead(403).end();
    }
    if ((await stat(file)).isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        return response.writeHead(308, { Location: `${url.pathname}/${url.search}` }).end();
      }
      file = resolve(file, 'index.html');
    }
    response.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    createReadStream(file).on('error', () => response.end()).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': types['.html'] });
    createReadStream(resolve(root, '404.html')).on('error', () => response.end()).pipe(response);
  }
}).listen(Number(process.env.PORT || 4173), '127.0.0.1', () => {
  console.log(`Local: http://127.0.0.1:${process.env.PORT || 4173}/`);
});

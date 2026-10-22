import { createReadStream, statSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { extname, join, normalize } from 'node:path';

const ROOT = join(import.meta.dirname, '..', 'fixtures');
const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.wav': 'audio/wav',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

// A YouTube-szerű útvonal: a www.youtube.com/watch ide fut be a --host-resolver-rules miatt.
const ROUTES: Record<string, string> = { '/watch': 'youtube-watch.html' };

/** Kis statikus szerver a `tests/fixtures/` mappára, Range-kéréssel (a médiaugráshoz). */
export async function startFixtureServer(): Promise<{ server: Server; port: number; url: (path: string) => string }> {
  const server = createServer((request, response) => {
    let { pathname } = new URL(request.url ?? '/', 'http://localhost');
    // Hotlink-védelem utánzása: a `/vedett/` alatti fájl csak weboldalról jövő (Referer-es) kérésre jön.
    if (pathname.startsWith('/vedett/')) {
      if (!request.headers.referer?.startsWith('http')) {
        response.writeHead(403).end('hotlink');
        return;
      }
      pathname = pathname.slice('/vedett'.length);
    }
    const file = normalize(join(ROOT, ROUTES[pathname] ?? pathname));
    let size: number;
    try {
      if (!file.startsWith(ROOT)) throw new Error('kívül esik');
      size = statSync(file).size;
    } catch {
      response.writeHead(404).end('nincs ilyen');
      return;
    }
    const headers = { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream', 'accept-ranges': 'bytes' };
    const range = /bytes=(\d*)-(\d*)/.exec(request.headers.range ?? '');
    if (range) {
      const start = range[1] ? Number(range[1]) : 0;
      const end = range[2] ? Number(range[2]) : size - 1;
      response.writeHead(206, { ...headers, 'content-range': `bytes ${start}-${end}/${size}`, 'content-length': end - start + 1 });
      createReadStream(file, { start, end }).pipe(response);
      return;
    }
    response.writeHead(200, { ...headers, 'content-length': size });
    createReadStream(file).pipe(response);
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  return { server, port, url: (path) => `http://127.0.0.1:${port}${path}` };
}

#!/usr/bin/env node
// Hamis native messaging host az e2e-hez: 4 bájtos (little-endian) hosszelőtag + JSON, stdio-n.
//   ping  → { type: 'pong', pid }
//   start → 200 ms-onként { type: 'tick', n }
let buffer = Buffer.alloc(0);
let ticks = 0;

function send(message) {
  const body = Buffer.from(JSON.stringify(message));
  const header = Buffer.alloc(4);
  header.writeUInt32LE(body.length);
  process.stdout.write(Buffer.concat([header, body]));
}

function handle(message) {
  if (message.type === 'ping') send({ type: 'pong', pid: process.pid });
  if (message.type === 'start') setInterval(() => send({ type: 'tick', n: ++ticks }), 200);
}

process.stdin.on('data', (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  while (buffer.length >= 4) {
    const length = buffer.readUInt32LE(0);
    if (buffer.length < 4 + length) break;
    handle(JSON.parse(buffer.subarray(4, 4 + length).toString('utf8')));
    buffer = buffer.subarray(4 + length);
  }
});
process.stdin.on('end', () => process.exit(0));

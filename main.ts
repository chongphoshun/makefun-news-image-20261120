// news-image-20261120 — Friday 20 November 2026.
//
// Entry program (Node 22, standard library only). The entry is the
// front page in entry.png beside this file: 42 verified stories from
// Friday 20 November 2026 — 3 leads, 12 main stories, a numbered
// world map, a BY THE NUMBERS strip and 27 one-line briefs — drawn
// as a newspaper front page. This program writes those exact bytes
// to /output/entry.png.
//
// Deterministic: no network, no clock, no randomness. Every run
// writes the same bytes, so the grader's two runs agree.
//
// Local check:
//   mkdir -p out
//   MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const IMAGE = new URL('./entry.png', import.meta.url);
const bytes = readFileSync(IMAGE);

// A whole PNG, 1024 by 1024: the IHDR chunk carries the width at
// byte 16 and the height at byte 20, each a big-endian uint32.
// Refuse anything else loudly instead of handing the judge a
// broken file.
if (bytes.length < 33 || bytes.readUInt32BE(16) !== 1024
    || bytes.readUInt32BE(20) !== 1024) {
  throw new Error('entry.png is not a 1024 by 1024 PNG');
}
// The gate caps the file at 1 MiB: refuse an oversized image here
// rather than letting the entry be rejected as invalid.
if (bytes.length > 1048576) {
  throw new Error('entry.png is over the 1 MiB cap');
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, 'entry.png');
writeFileSync(dest, bytes);

// The judge sees exactly these bytes: confirm the copy is whole.
if (statSync(dest).size !== bytes.length) {
  throw new Error('entry.png copy is incomplete');
}

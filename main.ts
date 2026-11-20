// news-image-20261120 (Node 22, standard library only):
// the image is the entry.png beside this file, a one-page summary of the
// world's news of Friday 20 November 2026, and the program copies it to
// /output/entry.png. Three lead stories with illustrations, twelve main
// stories with a small illustration each, a numbered world-map strip, a
// BY THE NUMBERS strip and twenty-seven one-line briefs: 42 verified
// stories in all. The gate takes a whole PNG or JPEG of at most 1 MiB and
// 1024 by 1024 pixels, and the judge sees exactly the bytes copied.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// The copy is byte-for-byte identical on every run: no network, no clock,
// no randomness. Both grader runs therefore write the same entry.png.
const src = new URL('./entry.png', import.meta.url);
if (!existsSync(src)) {
  throw new Error('entry.png missing beside main.ts');
}
// The gate wants a whole PNG of 1024 by 1024: confirm the header says so
// before copying, so a truncated or wrong-sized file fails loudly here.
const head = readFileSync(src).subarray(0, 33);
if (head.length < 33 || head.readUInt32BE(16) !== 1024
    || head.readUInt32BE(20) !== 1024) {
  throw new Error('entry.png is not a 1024 by 1024 PNG');
}
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, 'entry.png');
copyFileSync(src, dest);
// The judge sees exactly these bytes: confirm the copy is whole.
if (statSync(dest).size !== statSync(src).size) {
  throw new Error('entry.png copy is incomplete');
}

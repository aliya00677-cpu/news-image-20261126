// Entry for make.fun's news-image-20261126 contest.
// The artwork lives in entry.png next to this file; running the program
// validates that image and copies it to the output directory (default
// /output, override with MAKEFUN_OUTPUT_DIR), creating the directory
// first when it does not exist yet. Any problem — a missing source, an
// unrecognized image format, or a copy whose bytes do not match — is
// reported on stderr and exits non-zero instead of failing silently.

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

function fail(message: string): never {
  console.error(`main.ts: error: ${message}`);
  process.exit(1);
}

// PNG files start with this 8-byte signature; JPEG files with FF D8 FF.
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function imageKind(bytes: Buffer): string | null {
  if (PNG_SIGNATURE.every((b, i) => bytes[i] === b)) return 'PNG';
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'JPEG';
  return null;
}

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const destination = join(outDir, 'entry.png');

if (!existsSync(source)) {
  fail(`source image not found: ${source}`);
}

let image: Buffer;
try {
  image = readFileSync(source);
} catch (err) {
  fail(`cannot read source image ${source}: ${(err as Error).message}`);
}

if (image.length === 0) {
  fail(`source image is empty: ${source}`);
}

const kind = imageKind(image);
if (kind === null) {
  fail(`source image ${source} has no PNG or JPEG signature; refusing to copy it`);
}

try {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(destination, image);
} catch (err) {
  fail(`cannot write output image ${destination}: ${(err as Error).message}`);
}

const sourceBytes = statSync(source).size;
const outputBytes = statSync(destination).size;
console.log(`source: ${source} (${kind}, ${sourceBytes} bytes)`);
console.log(`output: ${destination} (${outputBytes} bytes)`);

if (outputBytes !== sourceBytes || !readFileSync(destination).equals(image)) {
  fail(`copy verification failed: output does not match source (${outputBytes} vs ${sourceBytes} bytes)`);
}
console.log('copy verified: output matches source byte for byte');

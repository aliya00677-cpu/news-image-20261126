// Entry for make.fun's news-image-20261126 contest.
// The artwork lives in entry.png next to this file; running the program
// copies that image to /output/entry.png, creating the directory first
// when it does not exist yet. Set MAKEFUN_OUTPUT_DIR to redirect the
// destination (handy for a local dry run outside the grader).

import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, 'entry.png'));

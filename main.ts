// Leonida Legend — GTA VI trophy guide, make.fun gta6-trophy-guide-01 entry.
// Node 22, standard library only. The guide is this directory's app/ folder:
// plain static files (index.html, CSS, ES modules, data/trophies.json), offline,
// no build step, no network requests at run time. This program hands it in:
// it copies app/ and screenshots/ from beside this file to /output and writes
// /output/dossier.json with the vendored make.fun library, so the judge can
// read the screenshots and the source outline. Leave vendor/makefun-frontend.ts
// as it is: the scorer rebuilds the dossier with its own copy and compares
// the two byte for byte.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);

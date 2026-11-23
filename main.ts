// Ember Duel — the hand-in program (Node 22, standard library only).
// The game is this directory's game/ folder: plain static files a desktop
// browser loads offline (game/index.html and its scripts, no library and no
// network request). This program copies game/ and screenshots/ from beside
// this file to /output and writes /output/dossier.json, the summary the
// judge reads, with the vendored make.fun library.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (from the kit): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse — more than 4
// screenshots or one over 256 KiB; more than 993 files in game/ or 48 MiB
// of game files in all, or a path under game/ over 1000 bytes.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

// Verify the hand-in before reporting it: the dossier must parse, and the
// output must hold the game, its screenshots and the dossier itself, so a
// broken copy fails here instead of at the scorer.
const dossier = JSON.parse(readFileSync(join(out, 'dossier.json'), 'utf8'));
function countFiles(dir) {
  let n = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    n += entry.isDirectory() ? countFiles(join(dir, entry.name)) : 1;
  }
  return n;
}
const gameFiles = countFiles(join(out, 'game'));
const shotFiles = readdirSync(join(out, 'screenshots')).filter((f) => !f.startsWith('.')).length;
if (!existsSync(join(out, 'game', 'index.html'))) throw new Error('game/index.html missing from output');
if (shotFiles < 3 || shotFiles > 4) throw new Error('expected 3 or 4 screenshots, found ' + shotFiles);
console.log(
  'Ember Duel handed in: ' + gameFiles + ' game files, ' + shotFiles + ' screenshots, '
  + 'dossier ' + statSync(join(out, 'dossier.json')).size + ' bytes.',
);

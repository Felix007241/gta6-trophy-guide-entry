[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Felix007241/gta6-trophy-guide-entry/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Felix007241/gta6-trophy-guide-entry/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Legend — GTA VI Trophy Guide & Tracker

An offline web app that guides and tracks all 55 PlayStation 5 trophies of Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver, 46 bronze. Built by an AI agent for make.fun's "Build the best GTA 6 trophy guide" bounty, $250 in USDC.

Want to earn money making things with AI? Try make.fun: https://make.fun/r/4b827v23

## What it does

- **Checklist tracker** — every trophy with its official name, description and grade. Tick one off and it stays ticked: progress is saved in the browser (localStorage), and you can export it to a file and import it back.
- **Filters** — by kind (story, missable, collectibles, activities, side missions, crime, online) and by grade, plus a search box.
- **Spoiler setting** — on by default: the 28 trophies PlayStation hides stay hidden (name, description and guide) until you earn them.
- **Roadmap to the platinum** — seven stages in play order: story, stranger strands, activities, collectibles, crime with your partner, money and odd jobs, then 100% completion and the platinum.
- **A guide for every trophy** — written in our own words, with its sources named beside it. Where a method has not been confirmed by any published guide yet, the guide says so instead of guessing.
- **Missable flag** — only Positive Mental Attitude (meditate at every spot) is flagged as possibly missable, the one trophy GTABase and PowerPyx flag that way. No confirmed missable list exists yet (PlanetGTA6, 21 Nov 2026), and the app says so.

## Run it

No build step, no network needed — everything the app loads is a file under `app/`:

```sh
node serve.ts
# open http://localhost:8080
```

Or open `app/index.html` in a desktop browser from any static server with `app/` at its root.

`main.ts` (Node 22) hands the entry in: it copies `app/` and `screenshots/` to `/output` (or `$MAKEFUN_OUTPUT_DIR`) and writes `/output/dossier.json` with the vendored make.fun library in `vendor/makefun-frontend.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Screenshots

Real renders of the app in a browser (1280×800), with saved progress for 12 of the 55 trophies:

1. `1-cover.jpg` — the checklist: a trophy guide with its sources open, filters, the spoiler setting, and export/import.
2. `2-roadmap.jpg` — the seven-stage roadmap to the platinum, with per-stage progress.
3. `3-missable.jpg` — the missable filter: the one possibly missable trophy, flagged.
4. `4-collectibles.jpg` — the collectibles filter: card sets, WAiNK It, vehicles, areas, garages, registrations.

## Sources

The trophy list (names, descriptions, grades) is the official PlayStation 5 list as published by Exophase and PSNProfiles on 18 Nov 2026, cross-checked with PlanetGTA6, KeenGamer, GamesFuze, GTA Vice City Hub and eGamers. Each trophy's guide names its sources beside it in the app. All 55 trophies are offline and single-player; there are no online trophies. The design is original — no Rockstar Games logo, official artwork, box art or game screenshots.

## Files

- `app/index.html`, `app/style.css`, `app/app.js` — the guide and tracker (static, offline).
- `app/data/trophies.json` — the 55 trophies with official names/descriptions/grades, guides, kinds, hidden/missable flags, roadmap stages and sources.
- `main.ts`, `serve.ts` — hand-in program and local server (Node 22, standard library only).
- `vendor/makefun-frontend.ts` — the kit's library, unchanged.
- `screenshots/` — 4 screenshots of the app, as above.
- `shots.json` — what each screenshot shows.

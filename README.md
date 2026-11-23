# Ember Duel — a card battler in three depths

[![make.fun](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/bounty/best-card-game-20261122-1826)
[![rank](https://make.fun/badge/best-card-game-20261122-1826/nilz13x/best-card-game-20261122-1826/rank.svg)](https://make.fun/bounty/best-card-game-20261122-1826)
[![reward](https://make.fun/badge/best-card-game-20261122-1826/nilz13x/best-card-game-20261122-1826/reward.svg)](https://make.fun/bounty/best-card-game-20261122-1826)

**Ember Duel** is a single-player card battler that plays offline in a desktop browser from its own static files. You are an ember knight descending through three dungeon depths — the Cinder Rat, the Ash Wisp, and the Magma Warden — armed with a 13-card deck of strikes, guards, embers, mends and focuses.

## How it plays

- Each turn you gain **3 energy**. Play cards with the mouse or keys **1–5**; **E** ends your turn.
- Cards are told apart by colour and shape: red triangle attacks, blue square blocks, orange flame burns, green heart heals, purple star focuses.
- The foe's hand is face up, and its leftmost card — marked **NEXT** — is what it plays when your turn ends, so you can read it and answer: guard before a slam, mend after a burn.
- Burn ticks at the start of the afflicted side's turn and ignores block. Clear all three depths to win; if your health reaches 0, the ember fades.

## Play it

Open `game/index.html` in a desktop browser, or serve the folder with any static server:

```sh
python3 -m http.server --directory game 8080   # then open http://localhost:8080
```

No network requests, no build step, no dependencies. Screenshots live in `screenshots/` (cover first); `main.ts` hands the game in by copying `game/` and `screenshots/` to the output directory and writing `dossier.json`.

Built by an AI agent for make.fun's "Make the best card game" bounty, $50 in USDC.

Play with your own AI agent and earn money making games: https://make.fun/r/wez2e129

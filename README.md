# ՈԼՈՐ — an Armenian daily word game

A 5×5 word-path puzzle in Armenian. Four words are hidden on the board — one of
3, 4, 5 and 6 letters. Each word is written along a winding path that steps
up/down/left/right (never diagonally) around the walls, and **every open tile
belongs to exactly one word**, so the four paths must tile the whole board.

**Play:** https://narekyan.github.io/olor/

Drag across tiles, or tap them one at a time and tap the last tile again to
submit. A word counts in either direction. `ու` is a single Armenian letter and
occupies a single tile — `լույս` is a 4-letter word.

## Modes

| mode | what it does |
|---|---|
| `daily` (default, `main`) | One deterministic puzzle per day, the same for everyone, seeded from the date in Yerevan time. Progress, streak and stats are kept in `localStorage`. No reroll and no reveal button. |
| `random` (`random` branch) | A fresh puzzle on every click, nothing saved, plus "new game" and "reveal answer" buttons. For testing and for playing more than once a day. |

You don't need to switch branches to test: append `?mode=random` to the URL on
any deploy. The `random` branch only differs by the `DEFAULT_MODE` constant, so
it can be deployed separately if you ever want a permanent unlimited version.

## Run it locally

No build step, no dependencies, no server needed:

```sh
open index.html          # macOS — or just double-click it
```

Service workers don't run over `file://`, so for PWA/install testing serve it:

```sh
npx serve .              # then open the printed http://localhost:… URL
```

## Install on a phone

It's a PWA. On Android, Chrome shows an "Install app" prompt (the in-page
`Տեղադրել հեռախոսում` button triggers it). On iPhone, Safari → Share → *Add to
Home Screen*. It then launches fullscreen with its own icon and works offline.

## The word list

`words.js` holds 692 words bucketed by letter count (135 / 186 / 205 / 166).
Every word:

- is a base form in the Eastern Armenian Hunspell dictionary
  ([wooorm/dictionaries → `hy`](https://github.com/wooorm/dictionaries), 67k entries),
- appears at least twice in an Armenian frequency list
  ([hermitdave/FrequencyWords → `2018/hy`](https://github.com/hermitdave/FrequencyWords)),
- is written only in lowercase Armenian letters, so no proper nouns.

Words are ordered most-frequent-first and each bucket has a marker comment where
the rarer tail begins — delete from a marker down to the end of that bucket to
keep only everyday words. Adding words is just as safe: any word of the right
letter count works, since the generator picks paths first and letters second.

## How puzzles are generated

1. Carve four disjoint self-avoiding paths of 6, 5, 4 and 3 cells out of the
   5×5 grid; the 7 leftover cells become walls.
2. Fill each path with a random word of that letter count.
3. Keep the puzzle only if **every word has exactly one possible path** on the
   finished board (checked in both directions). That makes the solution unique,
   so a player can never lock a word into a wrong position and get stuck.
4. Of the valid candidates, keep the twistiest (most direction changes).

In `daily` mode step 2's randomness comes from a `mulberry32` PRNG seeded with
the date, so everyone gets the same board and it can be replayed identically.

## Sharing

The result sheet copies a spoiler-free summary — score, time, and an emoji grid
of the paths you found — and can also render a 1080×1080 PNG card for
image-only networks via the Web Share API, falling back to a download on
desktop.

## Files

```
index.html              game, UI and generator (no dependencies)
words.js                the Armenian word pool
manifest.webmanifest    PWA metadata
sw.js                   service worker — offline shell, network-first
icon*.png               app icons, rasterized from icon.svg
```

## License

MIT, except `words.js`, which is a derivative of a GPL2/LGPL2.1/MPL1.1
tri-licensed dictionary and is distributed under the MPL 1.1 arm — see
[LICENSE-words](LICENSE-words).

The gameplay is inspired by LinkedIn's *Wend*. Game mechanics aren't
copyrightable, but the name, look and code here are original; this project is
not affiliated with or endorsed by LinkedIn.

# A birthday site for her 🤍

Everything you need to personalize is in **`config.js`** — you shouldn't need to touch any other file.

## 1. Add your photos
Drop your photos into these folders, named to match `config.js`:
- `assets/images/memories/` — `memory-1.jpg` through `memory-6.jpg` (or however many you use)
- `assets/images/game/` — `game-1.jpg` through `game-8.jpg` (exactly 8 photos, each becomes a matching pair — 16 cards total)

Any size works — they'll be cropped to fit. Until a photo is added, that spot shows a friendly "Add memory-1.jpg" placeholder instead of breaking.

## 2. Add your songs
Drop MP3 files into `assets/audio/`, named to match `config.js` (`song-1.mp3`, `letter-song.mp3`, `game-song.mp3`, etc).
Keep files reasonably small (under ~8MB each is safe for GitHub) — export at 128–192kbps if a song is long.

**Important — copyright:** GitHub Pages is a public host, so uploading copyrighted commercial songs technically isn't allowed by their terms, even for a private gift. It'll almost always work fine in practice for a small personal page like this, but if you want to be fully safe, two options: keep the repo **private** and only share the live link with her (GitHub Pages can still serve from a private repo on paid plans), or use short 20–30 second clips instead of full tracks.

## 3. Write the letter
Edit `letter.body` in `config.js`. It's a list of paragraphs, one per line, like this:

```js
body: [
  "My love,",
  "This is the first paragraph.",
  "This is the second paragraph.",
  "— Your name"
]
```

Just add or remove lines — each one becomes its own paragraph. **One rule:** don't type a `"` (double quote) or a backtick `` ` `` character inside your text, since those characters have a special meaning in code and will break the page. Apostrophes like in "don't" are totally fine.

## 4. Edit the memory captions
Each entry in the `memories` array in `config.js` is one stop on the timeline: a date label, title, caption, photo, and song. Add or delete entries freely.

## 5. Preview it locally
Just open `index.html` in a browser — no build step, no install needed. (Note: audio may not play from a plain double-clicked file in some browsers due to security rules — it'll work correctly once hosted, see below.)

## 6. Host it on GitHub Pages
1. Create a new repository on GitHub (e.g. `for-her`).
2. Upload all these files, keeping the folder structure intact.
3. Go to the repo's **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**, branch: `main`, folder: `/ (root)`. Save.
5. Wait a minute, then your site is live at `https://yourusername.github.io/for-her/`.

If you'd rather keep it private until her birthday, make the repo private first and only flip it public (or share the Pages link) on the day.

## Troubleshooting: something looks blank
If a section of the page seems empty, right-click anywhere on the page → **Inspect** → click the **Console** tab. If you see a red line starting with `[site error]`, that tells you exactly which part broke (usually a typo in `config.js`, like a missing comma or a stray quote mark) — feel free to paste that error back to me and I'll help you fix it. The page is now built so one broken section can't blank out the rest of it.

## Files
```
index.html      — page structure
style.css       — all the visual design
script.js       — the logic (envelope, game, audio) — no need to edit
config.js       — YOUR CONTENT — edit this one
assets/images/  — your photos go here
assets/audio/   — your songs go here
```

Happy birthday to her. 🤍

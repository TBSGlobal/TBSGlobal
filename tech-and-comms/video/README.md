# Tech & Comms reels (3 × 31 s, 1080×1920, 30 fps)

One reel per key topic, same structure, timing, soundtrack and ending, so they run as a series on Instagram Reels, TikTok, WhatsApp Status and YouTube Shorts.

| File | Topic | Hook |
|---|---|---|
| `tech-and-comms-reel-topic01.mp4` | 01 · Communication: school vs reality | An exam question answered for full marks → an 11:47 pm crisis on the phone → "School taught you the model. Nobody taught you the reality." |
| `tech-and-comms-reel-topic02.mp4` | 02 · Media monitoring & intelligence | See below |
| `tech-and-comms-reel-topic03.mp4` | 03 · Professional presence | A recruiter scrolls past a blank profile ("SKIPPED") → the profile builds itself → "Start telling the story of who you're becoming." |

Topic 02 story: a live "mentions tracked" counter climbs to 12,480 → "You just watched a brand get talked about 12,480 times." → "Someone's job is to measure every one." (media-intelligence dashboard) → "Most Mass Comm students graduate without ever seeing this." → "Let's change that." → TECH & COMMS title → date, venue, TCBR and partners.

The mention cards, notifications and candidate profiles are illustrative, not real people or posts.

## Rebuild

`src/reel-01.html`, `src/reel-02.html` and `src/reel-03.html` (topic scenes in `topic01.js` / `topic03.js` / `topics.css`; `reel.html` is the base) each draw any frame with `render(seconds)`. It expects the fonts from `@fontsource/archivo-black`, `@fontsource/montserrat` and `@fontsource/dm-serif-display` unpacked to `src/fonts/x/package/files/` (`npm pack` each one, then untar).

```bash
node src/frames2.js "$PWD/src" reel-01.html frames   # writes src/frames/0000.jpg … 0929.jpg
python3 src/audio.py src/sound.wav       # synthesised soundtrack
ffmpeg -framerate 30 -i src/frames/%04d.jpg -i src/sound.wav -c:v libx264 -crf 20 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 160k -shortest tech-and-comms-reel-topic01.mp4
```

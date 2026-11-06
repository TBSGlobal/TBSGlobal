# Tech & Comms reel (31 s, 1080×1920, 30 fps)

`tech-and-comms-reel.mp4` is ready for Instagram Reels, TikTok, WhatsApp Status and YouTube Shorts.

Story: a live "mentions tracked" counter climbs to 12,480 → "You just watched a brand get talked about 12,480 times." → "Someone's job is to measure every one." (media-intelligence dashboard) → "Most Mass Comm students graduate without ever seeing this." → "Let's change that." → TECH & COMMS title → date, venue, TCBR and partners.

The mention cards are illustrative, not real posts.

## Rebuild

`src/reel.html` draws any frame with `render(seconds)`. It expects the fonts from `@fontsource/archivo-black`, `@fontsource/montserrat` and `@fontsource/dm-serif-display` unpacked to `src/fonts/x/package/files/` (`npm pack` each one, then untar).

```bash
node src/frames.js "$PWD/src"            # writes src/frames/0000.jpg … 0929.jpg
python3 src/audio.py src/sound.wav       # synthesised soundtrack
ffmpeg -framerate 30 -i src/frames/%04d.jpg -i src/sound.wav -c:v libx264 -crf 20 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 160k -shortest tech-and-comms-reel.mp4
```

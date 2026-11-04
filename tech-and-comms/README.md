# Tech & Comms — campus seminar series site

Landing page for The Comms Boardroom's **Tech & Comms** tour (first stop: Crawford University, 26 Nov 2026).

- `index.html` — the built, self-contained page (images inlined). Open it directly or host it on any static host (e.g. GitHub Pages).
- `src/template.html` — page source.
- `src/calendar.json` — the tour calendar (university, date, venue, city, status, note). Status is one of `confirmed`, `talks`, `planned`, `done`.
- `src/photos.json` — optional stock photos (hero, topic panels, photo band). Put files in `assets/photos/`, list them with alt text and credit, and rebuild. Slots without a photo use built-in illustrations.
- `assets/` — speaker photos and partner crests taken from the campaign design kit.

To change the calendar in this repo, edit `src/calendar.json` and run:

```bash
python3 tech-and-comms/src/build.py
```

On the published claude.ai version, the owner can press **Edit calendar** on the page itself.

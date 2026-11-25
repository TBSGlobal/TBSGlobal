# Samuel Ogundeji: Talk 2 deck + TC Live

- `index.html`: the presentation (arrow keys or click; N = speaker notes, F = fullscreen). Works offline by opening the file.
- `join.html`: TC Live, the student app (feed + blog) students reach from the QR code.
- `dashboard.html`: live social listening dashboard (embedded on slide 14). Add `?key=MODKEY` to moderate (hide posts), refresh the AI brief and reset the demo. Press S for practice data.
- Data: Supabase project "PRTech & CommsTech Daily Digest", tables `tc_*`, bucket `tc-live`, edge function `tc-brief` (Gemini; secret `GEMINI_API_KEY`).

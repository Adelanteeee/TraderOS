# Icons

Place two PNG icons here before your first build so the PWA is installable:

- `icon-192.png` — 192×192
- `icon-512.png` — 512×512 (also used as the maskable icon)

Any square logo works for now — swap in the real Trader OS mark later.
The service worker itself (`sw.js`) is generated automatically at build time
by `vite-plugin-pwa` — you don't need to write it by hand.

# Pudado Hero Motion

Diese Struktur trennt Produktionsmaterial und Web-Exporte:

- `source/hero-wool-blue-source.png` – unverändertes blau/weißes Wollmotiv
- `poster/hero-poster.png` – sofort sichtbarer Fallback und Video-Poster
- `export/hero-loop.webm` – bevorzugter Browser-Export
- `export/hero-loop.mp4` – H.264-Fallback für Safari und ältere Geräte

## Exportvorgaben

- Bildformat: 1916 × 821 px (oder exakt gleiches Seitenverhältnis)
- Dauer: 8–12 Sekunden, nahtloser Loop
- Bildrate: 24 oder 30 fps, konstante Framerate
- WebM: VP9, ohne Audiospur
- MP4: H.264 High Profile, `yuv420p`, Fast Start, ohne Audiospur
- Zielgröße: zusammen möglichst unter 6 MB; visuelle Qualität vor aggressiver Kompression
- Erster und letzter Frame müssen in Bewegung, Belichtung und Kameraposition nahtlos anschließen

Text, Navigation, Buttons und Produktkarte bleiben HTML. Im Film liegen ausschließlich das Wollmotiv, subtile Tiefenbewegung, Textur-Drift und eine sehr langsame virtuelle Kamerafahrt.

Die Website aktiviert die Videoquellen nur, wenn `prefers-reduced-motion` nicht gesetzt ist und kein Data-Saver aktiv ist. Solange kein valider Export vorliegt oder das Video noch lädt, bleibt `hero-poster.png` sichtbar.

Nach dem Ablegen und Prüfen beider Exporte muss in `index.html` nur
`data-video-ready="false"` auf `data-video-ready="true"` gesetzt werden.
Bis dahin entstehen keine Requests auf noch nicht vorhandene Dateien.

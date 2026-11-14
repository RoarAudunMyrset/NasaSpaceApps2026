# NasaSpaceApps2026

## Ocean tones

A dependency-free temperature image sonifier for NASA Space Apps.

### Run

With Python 3 and Node.js 18+ installed:

```sh
npm start
```

Open <http://localhost:8000>. No package installation is needed. Alternatively,
serve this directory using any static HTTP server (opening `index.html` directly
does not support JavaScript modules in all browsers).

### Explore

- The initial **synthetic demo is not NASA data**. It works offline and includes
  a dark missing-data region to demonstrate silence.
- Choose a date and select **Load NASA map** for the global GHRSST MUR sea surface
  temperature image. The initial date is a historical example, not a live feed.
  NASA GIBS must be reachable and permit cross-origin image and palette requests.
  An unavailable date or service leaves the previous image intact.
- Click **Enable sound**, then move your mouse or drag across the image.
  Cold water produces low pitches (110 Hz); warm water produces high pitches
  (880 Hz). Volume starts low; leaving the image silences the tone.
- Keyboard: focus the image with Tab, then use arrow keys (Shift for larger
  steps). Escape, switching tabs, or leaving the browser window disables sound.
  Temperatures are also displayed without requiring audio.

NASA mode reads the published GIBS palette to estimate temperature from PNG
colors; it does not fetch raw scientific temperature measurements. Transparent
or unmatched pixels are silent. Palette bins limit temperature precision.
The [Worldview example](https://worldview.earthdata.nasa.gov/?l=GHRSST_L4_MUR_Sea_Surface_Temperature)
uses the same dataset, but this app uses its **default GIBS palette**, not
Worldview's optional `divergent_1` palette. It cannot sonify a cross-origin
Worldview iframe or track the mouse on that separate website.

### Test

```sh
npm test
```

Tests use Node's built-in runner and cover temperature-to-pitch mapping,
palette/no-data decoding, and scaled pointer coordinates. There is no build step.

Source: [NASA GIBS API](https://nasa-gibs.github.io/gibs-api-docs/),
`GHRSST_L4_MUR_Sea_Surface_Temperature`.

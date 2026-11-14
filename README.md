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

### Deploy privately on Azure

The app can run on the **Free** Azure Static Web Apps plan without an API or
other Azure services. `staticwebapp.config.json` restricts every site route to
the custom `owner` role; merely signing in does not grant access. This protection
is enforced by Azure Static Web Apps, not by a generic local HTTP server.

1. In the Azure portal, check that your subscription is still an Azure free
   account with its spending limit enabled. Do not upgrade to pay-as-you-go if
   you want to avoid charges after the credit runs out. Confirm the plan and
   current pricing before creating anything.
2. Create a **Static Web App**, select the **Free** plan, and connect this
   private GitHub repository and the branch containing this configuration.
   Under build details, choose **Custom**, set app location to `/`, and leave
   API and output locations empty. No build step is required. Azure creates a
   GitHub Actions workflow to deploy the site.
3. In the new Static Web App, go to **Settings > Role Management > Invite**.
   Select **Microsoft Entra ID**, enter your Microsoft account email, choose
   the site's domain, enter `owner` as the role, set a short expiration, and
   generate an invitation. Open the invitation yourself and sign in with that
   account. Keep the invitation link private.
4. Open the site's HTTPS URL. Verify in a private browser window that an
   anonymous visitor is redirected to sign in, and that a different signed-in
   account cannot access the app or its files. If either check fails, delete
   the Static Web App until the access rules are corrected.

The Free plan has a bandwidth quota with no paid bandwidth overage. GitHub
Actions has separate usage limits, and Azure budgets send alerts rather than
stopping spending. NASA images are requested directly from NASA by the browser.
See [Azure Static Web Apps quotas](https://learn.microsoft.com/en-us/azure/static-web-apps/quotas),
[role invitations](https://learn.microsoft.com/en-us/azure/static-web-apps/authentication-custom),
and [Azure free account terms](https://azure.microsoft.com/en-us/pricing/purchase-options/azure-account).

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

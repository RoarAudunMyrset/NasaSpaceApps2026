# NasaSpaceApps2026

## Ocean tones

A dependency-free temperature image sonifier for NASA Space Apps.

### Presentation

The [AimForTheStars presentation](docs/presentation.md) explains the project
journey, the two listening modes, and GitHub Copilot's role in creating the app.
It includes slide content and speaker notes.

### Run

With Python 3 and Node.js 18+ installed:

```sh
npm start
```

Open <http://localhost:8000>. No package installation is needed. Alternatively,
serve this directory using any static HTTP server (opening `index.html` directly
does not support JavaScript modules in all browsers). The static server does not
run the Azure Functions API, so map descriptions require the deployed service.

### Deploy privately on Azure

The app can run on the **Free** Azure Static Web Apps plan; spoken map descriptions
additionally require a separately provisioned Azure OpenAI vision deployment.
`staticwebapp.config.json` restricts every site route, including the API, to
the custom `owner` role; merely signing in does not grant access. This protection
is enforced by Azure Static Web Apps, not by a generic local HTTP server.
The checked-in workflow deploys pushes to `main` to production and pull requests
targeting `main` to preview environments.

1. In the Azure portal, check that your subscription is still an Azure free
   account with its spending limit enabled. Do not upgrade to pay-as-you-go if
   you want to avoid charges after the credit runs out. Confirm the plan and
   current pricing before creating anything.
2. Create a **Static Web App**, select the **Free** plan, and connect this
   private GitHub repository and the branch containing this configuration.
   Under build details, choose **Custom**, set app location to `/`, and leave
   API location to `api` and output location empty. No app build step is required. Azure creates a
   GitHub Actions workflow to deploy the site. In its deploy step, set
   `skip_app_build: true` and `api_location: "api"` as in the checked-in
   workflow. Wait for the first successful deployment before
   creating your invitation; Azure disables invitations until then.
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

### Configure Azure map descriptions

1. Provision an Azure OpenAI resource and deploy a vision-capable chat model that
   supports image inputs and the `2024-02-15-preview` chat completions API.
   Check availability, data handling, and pricing before enabling it: image
   requests can incur charges independently of the Static Web Apps Free plan.
   Budgets are alerts, not hard spending limits.
2. In the Static Web App's **Settings > Configuration**, add application settings
   `OPENAI_ENDPOINT` (the resource's `https://...openai.azure.com/` endpoint),
   `OPENAI_DEPLOYMENT` (deployment name), and `OPENAI_API_KEY` (resource key).
   These settings are used by the managed API, not the browser; never commit the
   key or put it in static files. Configure settings for the environment being
   used, including previews if applicable.
3. Verify that an anonymous visitor and a signed-in user without `owner` cannot
   call `/api/describe`, and that an owner can describe a map. The API relies on
   Static Web Apps route authorization; do not expose the function separately.
   The plain `npm start` server cannot run or protect this API.

Each request sends the displayed map, its color legend, and its source/date to
Azure OpenAI. The generated description is an AI interpretation of rendered
colors, not a scientific analysis; it can miss or misidentify features such as
the Gulf Stream. Check important claims against the source data. Stopping a
request may not prevent a charge once Azure has received it.

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
- Select **Describe current map** to request a short description of the current
  demo or NASA map. The result appears as text and is spoken at the selected
  volume when browser speech synthesis is available. Uncheck **Speak
  description** to read it with a screen reader instead. **Stop description**,
  Escape, changing maps, starting year playback, switching tabs, or leaving the
  browser window stops the request or speech. The previous map remains available
  if a NASA load fails.

### Listen through a year

The separate **Listen through a year** section holds one latitude/longitude fixed
while playing 12 NASA samples, from January to December. Enter coordinates and a
completed year (2003 onward), or explore the map and select **Use current map
position**. North/east are positive; south/west are negative. The default
30°N, 40°W is in the Atlantic. Try 30°S, 40°W with the same year to compare
seasonal timing across the equator.

Select **Listen through year** to enable sound and load all 12 observations.
Each sample is from the **first day of the month**, not a monthly average.
Spoken month/temperature labels precede two-second tones, using a fixed NASA
palette-to-pitch scale so changes remain comparable. Missing data is announced
and silent, not treated as cold water. You can turn off spoken labels to use
your screen reader with the live text status instead. Speech requires browser
speech synthesis support; failures are reported rather than silently skipped.

**Stop year playback**, Escape, muting, switching tabs, or leaving the browser
window stops loading/playback and speech. Loading another map or choosing the
demo also stops year playback. The existing map is not replaced; map exploration
is paused during playback and available again afterward. A failed monthly
request reports its date without playing a partial year or substituting demo
data. Loading requires an internet connection and can take a while.

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
palette/no-data decoding, scaled pointer coordinates, geographic sampling, and
monthly date sequencing, plus description API validation and Azure request
handling with a mocked service. There is no app build step.

Source: [NASA GIBS API](https://nasa-gibs.github.io/gibs-api-docs/),
`GHRSST_L4_MUR_Sea_Surface_Temperature`.

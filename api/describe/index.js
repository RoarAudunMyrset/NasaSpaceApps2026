module.exports = async function (context, req) {
  const { image, source, date } = req.body || {};
  const validImage = typeof image === 'string' && image.length <= 4000000 &&
    /^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(image);
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers?.['content-type'] || '') ||
      !validImage || !['demo', 'nasa'].includes(source) ||
      (source === 'nasa' && (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)))) {
    context.res = { status: 400, body: { error: 'Invalid map image or source.' } };
    return;
  }

  const { OPENAI_ENDPOINT, OPENAI_DEPLOYMENT, OPENAI_API_KEY } = process.env;
  let endpoint;
  try {
    endpoint = new URL(OPENAI_ENDPOINT);
    if (endpoint.protocol !== 'https:' || !endpoint.hostname.endsWith('.openai.azure.com') ||
        endpoint.username || endpoint.password || endpoint.port || endpoint.pathname !== '/' ||
        endpoint.search || endpoint.hash || !OPENAI_API_KEY || !OPENAI_DEPLOYMENT) throw new Error();
  } catch {
    context.res = { status: 503, body: { error: 'Image description service is not configured.' } };
    return;
  }

  const url = new URL(`/openai/deployments/${encodeURIComponent(OPENAI_DEPLOYMENT)}/chat/completions?api-version=2024-10-21`, endpoint);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': OPENAI_API_KEY },
      signal: AbortSignal.timeout(30000),
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'Describe a sea surface temperature map for someone who cannot see it. Give a short, plain-language summary of visible broad patterns and one notable feature if supported by the image. Use the legend and map orientation. Do not invent exact temperatures, geographic features, currents, causes, or trends; express uncertainty and do not claim a current is visible unless the image supports it. Dark or transparent areas may be land or missing data. AI interpretations can be mistaken.' },
          { role: 'user', content: [
            { type: 'text', text: `${source === 'demo' ? 'This is a synthetic demonstration, not observations.' : `This is a NASA GHRSST MUR observation for ${date}.`} The map is global, with north at the top, the equator in the middle, and longitude from 180° west to 180° east. The color legend is below the map.` },
            { type: 'image_url', image_url: { url: image, detail: 'high' } },
          ] },
        ],
        max_tokens: 250,
      }),
    });
    if (!response.ok) throw new Error();
    const result = await response.json();
    const summary = result.choices?.[0]?.message?.content;
    if (typeof summary !== 'string' || !summary.trim()) throw new Error();
    context.res = { status: 200, body: { summary: summary.trim().slice(0, 2000) } };
  } catch {
    context.res = { status: 502, body: { error: 'Image description is unavailable. Please try again.' } };
  }
};

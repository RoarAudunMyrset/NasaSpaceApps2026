import test from 'node:test';
import assert from 'node:assert/strict';
import describe from './api/describe/index.js';

const request = {
  headers: { 'content-type': 'application/json' },
  body: { image: 'data:image/png;base64,YQ==', source: 'nasa', date: '2025-01-01' },
};

test('description API validates requests before contacting Azure', async () => {
  for (const req of [
    { ...request, headers: { 'content-type': 'text/plain' } },
    { ...request, body: { ...request.body, image: 'https://example.com/image.png' } },
    { ...request, body: { ...request.body, image: `data:image/png;base64,${'a'.repeat(4000000)}` } },
    { ...request, body: { ...request.body, source: 'nasa', date: 'invalid' } },
  ]) {
    const context = {};
    await describe(context, req);
    assert.equal(context.res.status, 400);
  }
});

test('description API sends the map and context to configured Azure vision deployment', async () => {
  const saved = { ...process.env };
  const originalFetch = globalThis.fetch;
  try {
    Object.assign(process.env, {
      OPENAI_ENDPOINT: 'https://example.openai.azure.com/',
      OPENAI_DEPLOYMENT: 'vision-model',
      OPENAI_API_KEY: 'test-key',
    });
    globalThis.fetch = async (url, options) => {
      assert.equal(url.hostname, 'example.openai.azure.com');
      assert.equal(url.pathname, '/openai/deployments/vision-model/chat/completions');
      assert.equal(options.headers['api-key'], 'test-key');
      const body = JSON.parse(options.body);
      assert.match(body.messages[1].content[0].text, /2025-01-01/);
      assert.equal(body.messages[1].content[1].image_url.url, request.body.image);
      return { ok: true, json: async () => ({ choices: [{ message: { content: '  Warm near the equator.  ' } }] }) };
    };
    const context = {};
    await describe(context, request);
    assert.deepEqual(context.res, { status: 200, body: { summary: 'Warm near the equator.' } });
    globalThis.fetch = async () => ({ ok: false });
    await describe(context, request);
    assert.equal(context.res.status, 502);
    process.env.OPENAI_ENDPOINT = 'https://example.com/';
    await describe(context, request);
    assert.equal(context.res.status, 503);
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of ['OPENAI_ENDPOINT', 'OPENAI_DEPLOYMENT', 'OPENAI_API_KEY']) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
});

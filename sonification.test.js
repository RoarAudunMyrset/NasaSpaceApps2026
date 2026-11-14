import test from 'node:test';
import assert from 'node:assert/strict';
import { formatTemperatureRange, imagePoint, temperatureFromPixel, temperatureFromRange, temperatureToFrequency } from './sonification.js';

test('colder temperatures have lower pitches over three octaves', () => {
  assert.equal(temperatureToFrequency(-2), 110);
  assert.equal(temperatureToFrequency(35), 880);
  assert.ok(temperatureToFrequency(0) < temperatureToFrequency(20));
  assert.equal(temperatureToFrequency(-20), 110);
  assert.equal(temperatureToFrequency(100), 880);
  assert.equal(temperatureToFrequency(null), null);
  assert.equal(temperatureToFrequency(NaN), null);
  assert.equal(temperatureToFrequency(10, 5, 5), null);
});

test('pixels use the nearest palette temperature, not brightness', () => {
  const palette = [
    { rgb: [0, 0, 255], temperature: -2 },
    { rgb: [255, 0, 0], temperature: 35 },
  ];
  assert.equal(temperatureFromPixel([0, 0, 255, 255], palette), -2);
  assert.equal(temperatureFromPixel([253, 2, 0, 255], palette), 35);
  assert.equal(temperatureFromPixel([0, 0, 255, 0], palette), null);
  assert.equal(temperatureFromPixel([14, 38, 54, 255], palette), null);
  assert.equal(temperatureFromPixel([255, 255, 255, 255], palette), null);
  assert.equal(temperatureFromPixel([0, 0, 0, 255], []), null);
});

test('NASA palette ranges use their midpoint and tolerate open bounds', () => {
  assert.equal(temperatureFromRange('[-2.0,-1.8)'), -1.9);
  assert.equal(temperatureFromRange('(-INF,-2)'), -2);
  assert.equal(temperatureFromRange('[35,INF)'), 35);
  assert.equal(temperatureFromRange('0'), 0);
  assert.equal(temperatureFromRange(null), null);
  assert.equal(temperatureFromRange('not data'), null);
  assert.equal(temperatureFromRange('[32,+INF)'), 32);
  assert.equal(formatTemperatureRange('(-INF,0)'), '< 0 °C');
  assert.equal(formatTemperatureRange('[32,+INF)'), '≥ 32 °C');
  assert.equal(formatTemperatureRange('[24,24.15)'), '≈ 24.1 °C');
  assert.equal(formatTemperatureRange(null), null);
});

test('pointer coordinates account for image scaling and clamp edges', () => {
  const rect = { left: 10, top: 20, width: 720, height: 360 };
  assert.deepEqual(imagePoint(370, 200, rect, 1440, 720), { x: 720, y: 360 });
  assert.deepEqual(imagePoint(730, 380, rect, 1440, 720), { x: 1439, y: 719 });
  assert.deepEqual(imagePoint(0, 0, rect, 1440, 720), { x: 0, y: 0 });
});

export function temperatureToFrequency(temperature, min = -2, max = 35) {
  if (!Number.isFinite(temperature) || !Number.isFinite(min) ||
      !Number.isFinite(max) || max <= min) return null;
  const fraction = Math.max(0, Math.min(1, (temperature - min) / (max - min)));
  return 110 * 2 ** (fraction * 3);
}

export function temperatureFromPixel(pixel, palette) {
  if (pixel[3] < 128) return null;
  let closest = null;
  let distance = Infinity;
  for (const entry of palette) {
    const difference = entry.rgb.reduce((sum, channel, i) => sum + (channel - pixel[i]) ** 2, 0);
    if (difference < distance) {
      closest = entry.temperature;
      distance = difference;
    }
  }
  return distance <= 24 ** 2 ? closest : null;
}

export function temperatureFromRange(value) {
  const numbers = (value ?? '').replace(/[[\]()]/g, '').split(',')
    .map(part => part.trim()).filter(Boolean).map(Number).filter(Number.isFinite);
  return numbers.length ? numbers.reduce((a, b) => a + b, 0) / numbers.length : null;
}

export function formatTemperatureRange(value) {
  const temperature = temperatureFromRange(value);
  if (temperature === null) return null;
  if (/-INF/i.test(value)) return `< ${temperature} °C`;
  if (/\+?INF/i.test(value)) return `≥ ${temperature} °C`;
  return `≈ ${temperature.toFixed(1)} °C`;
}

export function imagePoint(clientX, clientY, rect, width, height) {
  return {
    x: Math.max(0, Math.min(width - 1, Math.floor((clientX - rect.left) / rect.width * width))),
    y: Math.max(0, Math.min(height - 1, Math.floor((clientY - rect.top) / rect.height * height))),
  };
}

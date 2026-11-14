import { formatTemperatureRange, imagePoint, temperatureFromPixel, temperatureFromRange, temperatureToFrequency } from './sonification.js';

const canvas = document.querySelector('#map');
const context = canvas.getContext('2d', { willReadFrequently: true });
const status = document.querySelector('#status');
const soundButton = document.querySelector('#sound');
const loadButton = document.querySelector('#load');
const volume = document.querySelector('#volume');
const temperatureLabel = document.querySelector('#temperature');
const toneLabel = document.querySelector('#tone');
let palette = [];
let pixels;
let minimum = -2;
let maximum = 35;
let position = { x: 720, y: 360 };
let active = false;
let enabled = false;
let audio;
let oscillator;
let gain;
let request;
let soundRequest = 0;

function silence() {
  if (audio) gain.gain.setTargetAtTime(0, audio.currentTime, 0.03);
}

function setSoundOff() {
  soundRequest++;
  enabled = false;
  soundButton.textContent = 'Enable sound';
  soundButton.setAttribute('aria-pressed', 'false');
  toneLabel.textContent = 'Sound off';
  silence();
}

function sample() {
  const offset = (position.y * canvas.width + position.x) * 4;
  const temperature = temperatureFromPixel(pixels.subarray(offset, offset + 4), palette);
  const frequency = temperatureToFrequency(temperature, minimum, maximum);
  temperatureLabel.textContent = temperature === null ? 'Land / no temperature data' :
    (palette.find(entry => entry.temperature === temperature)?.label ?? `≈ ${temperature.toFixed(1)} °C`);
  toneLabel.textContent = enabled ? (frequency === null ? 'Silent · no data' : `${Math.round(frequency)} Hz · ${temperature < (minimum + maximum) / 2 ? 'cooler' : 'warmer'}`) : 'Sound off';
  if (!enabled || !active || frequency === null) {
    silence();
    return;
  }
  oscillator.frequency.setTargetAtTime(frequency, audio.currentTime, 0.04);
  gain.gain.setTargetAtTime(Number(volume.value) / 100 * 0.2, audio.currentTime, 0.03);
}

function updateImage(nextPalette, image) {
  silence();
  active = false;
  palette = nextPalette;
  minimum = Math.min(...palette.map(entry => entry.temperature));
  maximum = Math.max(...palette.map(entry => entry.temperature));
  context.putImageData(image, 0, 0);
  pixels = image.data;
  const legend = document.querySelector('#legend');
  legend.style.setProperty('--palette', `linear-gradient(to right, ${palette.map(entry => `rgb(${entry.rgb.join(',')})`).join(',')})`);
  legend.replaceChildren(...[`${minimum.toFixed(1)} °C · lower pitch`, `${maximum.toFixed(1)} °C · higher pitch`].map(text => {
    const span = document.createElement('span');
    span.textContent = text;
    return span;
  }));
  temperatureLabel.textContent = 'Explore the image';
  toneLabel.textContent = enabled ? 'Sound ready' : 'Sound off';
}

function showDemo() {
  request?.abort();
  request = null;
  loadButton.disabled = false;
  const stops = [[40, 40, 150], [35, 115, 220], [30, 210, 220], [80, 210, 115], [245, 225, 65], [245, 125, 35], [180, 25, 45]];
  const demoPalette = Array.from({ length: 256 }, (_, i) => {
    const p = i / 255 * (stops.length - 1);
    const low = Math.min(Math.floor(p), stops.length - 2);
    return {
      rgb: stops[low].map((channel, j) => Math.round(channel + (stops[low + 1][j] - channel) * (p - low))),
      temperature: -2 + i / 255 * 37,
    };
  });
  const image = context.createImageData(canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const field = Math.max(0, Math.min(1, 1 - Math.abs(y / canvas.height * 2 - 1) + 0.12 * Math.sin(x / 130 + y / 95)));
      const rgb = demoPalette[Math.round(field * 255)].rgb;
      const missing = x > 630 && x < 800 && y > 230 && y < 470;
      image.data.set(missing ? [14, 38, 54, 255] : [...rgb, 255], (y * canvas.width + x) * 4);
    }
  }
  updateImage(demoPalette, image);
  status.textContent = 'Synthetic temperature demo — not satellite observations. The dark rectangle demonstrates missing data.';
}

async function loadNASA() {
  const date = document.querySelector('#date');
  if (!date.reportValidity()) return;
  const selectedDate = date.value;
  request?.abort();
  const controller = new AbortController();
  request = controller;
  const timeout = setTimeout(() => controller.abort(), 30000);
  loadButton.disabled = true;
  status.textContent = 'Loading NASA image and temperature palette…';
  const layer = 'GHRSST_L4_MUR_Sea_Surface_Temperature';
  const url = new URL('https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi');
  url.search = new URLSearchParams({
    SERVICE: 'WMS', VERSION: '1.3.0', REQUEST: 'GetMap', LAYERS: layer, STYLES: '',
    CRS: 'EPSG:4326', BBOX: '-90,-180,90,180', WIDTH: canvas.width,
    HEIGHT: canvas.height, FORMAT: 'image/png', TRANSPARENT: 'TRUE', TIME: selectedDate,
  });
  try {
    const [imageResponse, paletteResponse] = await Promise.all([
      fetch(url, { signal: controller.signal }),
      fetch('https://gibs.earthdata.nasa.gov/colormaps/v1.3/GHRSST_Sea_Surface_Temperature.xml', { signal: controller.signal }),
    ]);
    if (!imageResponse.ok || !paletteResponse.ok) throw new Error('NASA service unavailable');
    const xml = new DOMParser().parseFromString(await paletteResponse.text(), 'application/xml');
    const nextPalette = [...xml.querySelectorAll('ColorMapEntry')]
      .filter(entry => entry.getAttribute('nodata') !== 'true' && entry.getAttribute('transparent') !== 'true')
      .map(entry => ({
        rgb: (entry.getAttribute('rgb') ?? '').split(',').map(Number),
        temperature: temperatureFromRange(entry.getAttribute('value')),
        label: formatTemperatureRange(entry.getAttribute('value')),
      }))
      .filter(entry => entry.temperature !== null && entry.rgb.length === 3 && entry.rgb.every(channel => Number.isFinite(channel) && channel >= 0 && channel <= 255))
      .sort((a, b) => a.temperature - b.temperature);
    if (nextPalette.length < 2) throw new Error('Temperature palette unavailable');
    const bitmap = await createImageBitmap(await imageResponse.blob());
    try {
      if (controller.signal.aborted) return;
      const buffer = document.createElement('canvas');
      buffer.width = canvas.width;
      buffer.height = canvas.height;
      const bufferContext = buffer.getContext('2d');
      bufferContext.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const image = bufferContext.getImageData(0, 0, canvas.width, canvas.height);
      const colors = new Set(nextPalette.map(entry => entry.rgb.join(',')));
      let hasData = false;
      for (let i = 0; i < image.data.length; i += 4) {
        if (image.data[i + 3] >= 128 && colors.has(image.data.subarray(i, i + 3).join(','))) {
          hasData = true;
          break;
        }
      }
      if (!hasData) throw new Error('No temperature data');
      updateImage(nextPalette, image);
      status.textContent = `NASA GHRSST MUR sea surface temperature · ${selectedDate} · geographic world map (180°W to 180°E).`;
    } finally {
      bitmap.close();
    }
  } catch {
    if (request === controller) status.textContent = 'Could not load NASA data for this date. Check your connection or try an earlier date. The previous image is unchanged; the demo is available offline.';
  } finally {
    clearTimeout(timeout);
    if (request === controller) loadButton.disabled = false;
  }
}

soundButton.addEventListener('click', async () => {
  if (enabled) {
    setSoundOff();
    return;
  }
  const attempt = ++soundRequest;
  try {
    if (!audio) {
      audio = new AudioContext();
      oscillator = audio.createOscillator();
      gain = audio.createGain();
      gain.gain.value = 0;
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start();
    }
    await audio.resume();
    if (attempt !== soundRequest) return;
    enabled = true;
    soundButton.textContent = 'Disable sound';
    soundButton.setAttribute('aria-pressed', 'true');
    toneLabel.textContent = 'Sound ready · explore the image';
  } catch {
    setSoundOff();
    status.textContent = 'Audio is unavailable in this browser. You can still explore temperatures visually.';
  }
});

canvas.addEventListener('pointermove', event => {
  position = imagePoint(event.clientX, event.clientY, canvas.getBoundingClientRect(), canvas.width, canvas.height);
  active = true;
  sample();
});
function stopExploring() {
  active = false;
  silence();
  toneLabel.textContent = enabled ? 'Sound ready' : 'Sound off';
}
canvas.addEventListener('pointerleave', stopExploring);
canvas.addEventListener('pointerup', event => { if (event.pointerType !== 'mouse') stopExploring(); });
canvas.addEventListener('pointercancel', stopExploring);
canvas.addEventListener('blur', stopExploring);
canvas.addEventListener('keydown', event => {
  const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
  const direction = directions[event.key];
  if (!direction) return;
  event.preventDefault();
  const step = event.shiftKey ? 30 : 5;
  position = {
    x: Math.max(0, Math.min(canvas.width - 1, position.x + direction[0] * step)),
    y: Math.max(0, Math.min(canvas.height - 1, position.y + direction[1] * step)),
  };
  active = true;
  sample();
});
volume.addEventListener('input', () => { if (active) sample(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') setSoundOff(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) setSoundOff(); });
window.addEventListener('blur', setSoundOff);
loadButton.addEventListener('click', loadNASA);
document.querySelector('#demo').addEventListener('click', showDemo);
showDemo();

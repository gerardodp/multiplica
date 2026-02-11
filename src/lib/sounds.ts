let audioCtx: AudioContext | null = null;
let enabled = true;

export function setSoundEnabled(on: boolean) {
  enabled = on;
}

export function isSoundEnabled() {
  return enabled;
}

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.3
) {
  if (!enabled) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function playCorrect() {
  if (!enabled) return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  // Two quick ascending notes
  [523, 659].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.25, now + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.15);
  });
}

export function playIncorrect() {
  playTone(200, 0.3, "square", 0.15);
}

export function playTick() {
  playTone(880, 0.08, "sine", 0.15);
}

export function playGo() {
  if (!enabled) return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  [523, 659, 784].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.25, now + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.2);
  });
}

export function playTimeUp() {
  if (!enabled) return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  [440, 370, 311].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.2, now + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 0.25);
  });
}

export function playRecord() {
  if (!enabled) return;
  const ctx = getCtx();
  const now = ctx.currentTime;
  [523, 659, 784, 1047].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.25, now + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.3);
  });
}

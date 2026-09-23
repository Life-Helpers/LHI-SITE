/**
 * Synthesised page-turn sound (Web Audio API, no audio file): a short burst of
 * filtered noise whose band sweeps downward like paper sliding, ending in a soft
 * "slap" as the page lands.
 */
let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (!noise) {
    const length = Math.floor(ctx.sampleRate * 0.6);
    noise = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = noise.getChannelData(0);
    // Pink-ish noise: smoother than white noise, closer to paper.
    let b0 = 0,
      b1 = 0,
      b2 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.099046;
      b1 = 0.963 * b1 + white * 0.2965164;
      b2 = 0.57 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.2;
    }
  }
  return ctx;
}

export function playFlipSound(volume = 0.6) {
  const ac = audio();
  if (!ac || !noise) return;
  if (ac.state === "suspended") void ac.resume();
  const now = ac.currentTime;
  const rate = 0.9 + Math.random() * 0.25;

  // Swoosh: noise through a band-pass sweeping from high to low.
  const swoosh = ac.createBufferSource();
  swoosh.buffer = noise;
  swoosh.playbackRate.value = rate;
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 0.8;
  band.frequency.setValueAtTime(4200, now);
  band.frequency.exponentialRampToValueAtTime(900, now + 0.38);
  const swooshGain = ac.createGain();
  swooshGain.gain.setValueAtTime(0.0001, now);
  swooshGain.gain.exponentialRampToValueAtTime(volume, now + 0.06);
  swooshGain.gain.exponentialRampToValueAtTime(volume * 0.35, now + 0.25);
  swooshGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
  swoosh.connect(band).connect(swooshGain).connect(ac.destination);
  swoosh.start(now);
  swoosh.stop(now + 0.45);

  // Landing: a short low-passed tap as the page settles.
  const tap = ac.createBufferSource();
  tap.buffer = noise;
  const low = ac.createBiquadFilter();
  low.type = "lowpass";
  low.frequency.value = 700;
  const tapGain = ac.createGain();
  const t = now + 0.36;
  tapGain.gain.setValueAtTime(0.0001, t);
  tapGain.gain.exponentialRampToValueAtTime(volume * 0.9, t + 0.012);
  tapGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  tap.connect(low).connect(tapGain).connect(ac.destination);
  tap.start(t);
  tap.stop(t + 0.14);
}

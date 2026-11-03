const SFX = {
  ctx: null,
  on: localStorage.getItem("pxd-sound") !== "off",
  noiseBuf: null,
};

function audio() {
  if (!SFX.on) return null;
  if (!SFX.ctx) {
    const A = window.AudioContext || window.webkitAudioContext;
    if (!A) return null;
    SFX.ctx = new A();
    const n = SFX.ctx.sampleRate;
    SFX.noiseBuf = SFX.ctx.createBuffer(1, n, n);
    const d = SFX.noiseBuf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  }
  if (SFX.ctx.state === "suspended") SFX.ctx.resume();
  return SFX.ctx;
}

function env(ctx, t, dur, vol) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  g.connect(ctx.destination);
  return g;
}

function tone(freq, dur, { type = "sine", vol = 0.2, to = null, delay = 0 } = {}) {
  const ctx = audio();
  if (!ctx) return;
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  o.connect(env(ctx, t, dur, vol));
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(dur, { freq = 1000, q = 1, type = "bandpass", vol = 0.2, to = null, delay = 0 } = {}) {
  const ctx = audio();
  if (!ctx) return;
  const t = ctx.currentTime + delay;
  const s = ctx.createBufferSource();
  s.buffer = SFX.noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.Q.value = q;
  f.frequency.setValueAtTime(freq, t);
  if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
  s.connect(f);
  f.connect(env(ctx, t, dur, vol));
  s.start(t, Math.random() * 0.5);
  s.stop(t + dur + 0.02);
}

const SOUNDS = {
  throw: () => noise(0.09, { freq: 1800, to: 900, q: 0.8, vol: 0.12 }),
  place: () => {
    tone(170, 0.09, { type: "triangle", to: 80, vol: 0.32 });
    noise(0.05, { freq: 700, type: "lowpass", vol: 0.22 });
    tone(1400, 0.025, { type: "square", vol: 0.03, delay: 0.004 });
  },
  glue: () => {
    tone(240, 0.16, { to: 110, vol: 0.25 });
    noise(0.14, { freq: 500, to: 180, type: "lowpass", vol: 0.25 });
  },
  remove: () => {
    tone(260, 0.12, { to: 640, vol: 0.14 });
    noise(0.12, { freq: 600, to: 2600, q: 0.7, vol: 0.1 });
  },
  catch: () => tone(520, 0.06, { type: "triangle", to: 700, vol: 0.16 }),
  bad: () => {
    tone(120, 0.12, { type: "square", vol: 0.05 });
    tone(95, 0.14, { type: "square", vol: 0.05, delay: 0.05 });
  },
  click: () => tone(900, 0.03, { type: "triangle", vol: 0.08, to: 700 }),
  hop: () => tone(330, 0.16, { to: 880, vol: 0.16 }),
  solve: () => [523, 659, 784, 1047].forEach((f, k) => tone(f, 0.22, { type: "triangle", vol: 0.18, delay: k * 0.09 })),
  reveal: () => {
    for (let k = 0; k < 10; k++) tone(1400 + Math.random() * 1800, 0.12, { vol: 0.05, delay: 0.1 + k * 0.08 });
  },
};

function sfx(name) {
  if (!SFX.on) return;
  try {
    SOUNDS[name] && SOUNDS[name]();
  } catch {}
}

function soundToggle() {
  const icon = () =>
    `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/>` +
    (SFX.on
      ? `<path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`
      : `<path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`) +
    `</svg>`;
  const b = document.createElement("button");
  b.className = "sound-btn";
  b.type = "button";
  const sync = () => {
    b.innerHTML = icon();
    b.title = SFX.on ? "Sound on (click to mute)" : "Sound off (click to unmute)";
    b.setAttribute("aria-pressed", String(SFX.on));
  };
  b.addEventListener("click", (e) => {
    e.stopPropagation();
    SFX.on = !SFX.on;
    localStorage.setItem("pxd-sound", SFX.on ? "on" : "off");
    sync();
    sfx("click");
  });
  sync();
  return b;
}

document.addEventListener("click", (e) => {
  const t = e.target.closest && e.target.closest("button, a");
  if (!t || t.classList.contains("sound-btn") || t.classList.contains("cast-pic")) return;
  sfx("click");
});

document.querySelector(".masthead").append(soundToggle());

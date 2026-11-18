// Sound for the opening film, made entirely in the browser with the Web Audio API: no recordings, no voices, no chant.
// A drone on D and A (the tonic and fifth a tanpura holds), slow tanpura-like plucks, a soft pad that swells when the orbits gather,
// a little wind, and metal bells at the scene changes. Everything follows the film's own clock, so it stays in sync
// even if the sound is switched on halfway through.

type Key = [number, number][];
const clamp = (x: number) => Math.min(1, Math.max(0, x));
function at(k: Key, t: number) {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) {
    if (t <= k[i][0]) { const [t0, v0] = k[i - 1], [t1, v1] = k[i]; return v0 + (v1 - v0) * clamp((t - t0) / (t1 - t0)); }
  }
  return k[k.length - 1][1];
}

const DRONE: Key = [[0, 0], [5, 0.45], [15, 0.5], [27, 0.72], [31, 0.5], [39, 0.38], [44, 0.28]];
const PAD: Key = [[0, 0], [14, 0], [18, 0.22], [27.5, 0.55], [31, 0.3], [38, 0.22], [42, 0.3], [46, 0.16]];
const WIND: Key = [[0, 0], [2, 0.28], [7, 0.2], [11, 0.12], [15, 0.04], [31, 0.05], [33, 0.22], [38.5, 0.2], [40, 0.03]];
const TAN: Key = [[0, 0], [7, 0], [9, 0.5], [30, 0.5], [33, 0.3], [38, 0.25], [40, 0]];
// Pa, Sa, Sa, low Sa: the usual order of a four-string tanpura tuned to D.
const TAN_NOTES = [110, 146.83, 146.83, 73.42];
const TAN_GAPS = [0.55, 0.55, 0.55, 1.2];

interface Ev { t: number; kind: "bell" | "boom"; f?: number; amp?: number }
const EVENTS: Ev[] = [
  { t: 0.8, kind: "bell", f: 1174.7, amp: 0.1 },
  { t: 7.0, kind: "bell", f: 587.33, amp: 0.22 },
  { t: 15.2, kind: "bell", f: 440, amp: 0.22 },
  { t: 23.2, kind: "bell", f: 293.66, amp: 0.26 },
  { t: 31.0, kind: "bell", f: 587.33, amp: 0.18 },
  { t: 40.6, kind: "boom" },
  { t: 40.65, kind: "bell", f: 293.66, amp: 0.3 },
  { t: 44.3, kind: "bell", f: 1174.7, amp: 0.08 },
];

export class IntroAudio {
  private ac: AudioContext | null = null;
  private master!: GainNode;
  private dry!: GainNode;
  private wet!: GainNode;
  private drone!: GainNode;
  private pad!: GainNode;
  private wind!: GainNode;
  private tan!: GainNode;
  private sources: AudioScheduledSourceNode[] = [];
  private lastT = 0;
  private nextPluck = 0;
  private pluckI = 0;
  private muted = true;

  /** False when the browser has no Web Audio. */
  get available() { return typeof window !== "undefined" && !!(window.AudioContext || (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext); }

  private build(t: number) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ac = new AC();
    this.ac = ac;
    this.master = ac.createGain(); this.master.gain.value = 0;
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3;
    this.master.connect(comp).connect(ac.destination);
    this.dry = ac.createGain(); this.dry.gain.value = 0.8; this.dry.connect(this.master);
    const verb = ac.createConvolver(); verb.buffer = this.impulse(4.5);
    this.wet = ac.createGain(); this.wet.gain.value = 0.5; this.wet.connect(verb).connect(this.master);
    const bus = (g: GainNode, wet = 0.4) => { g.connect(this.dry); const s = ac.createGain(); s.gain.value = wet; g.connect(s).connect(this.wet); };

    // drone: tonic, fifth, octave and a sub, through a slowly breathing low-pass filter
    this.drone = ac.createGain(); this.drone.gain.value = 0;
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 380; lp.Q.value = 0.6;
    lp.connect(this.drone); bus(this.drone, 0.35);
    for (const [f, type, g] of [[73.42, "sawtooth", 0.22], [110.2, "sawtooth", 0.14], [146.83, "sine", 0.3], [36.71, "sine", 0.4]] as const) {
      const o = ac.createOscillator(); o.type = type; o.frequency.value = f;
      const gg = ac.createGain(); gg.gain.value = g; o.connect(gg).connect(lp); o.start(); this.sources.push(o);
    }
    const lfo = ac.createOscillator(); lfo.frequency.value = 0.06; const lg = ac.createGain(); lg.gain.value = 140;
    lfo.connect(lg).connect(lp.frequency); lfo.start(); this.sources.push(lfo);

    // pad: soft sines a little above, each with its own slow vibrato
    this.pad = ac.createGain(); this.pad.gain.value = 0; bus(this.pad, 0.8);
    [293.66, 440, 587.33, 659.25].forEach((f, i) => {
      const o = ac.createOscillator(); o.type = "sine"; o.frequency.value = f;
      const v = ac.createOscillator(); v.frequency.value = 0.11 + i * 0.03; const vg = ac.createGain(); vg.gain.value = f * 0.0025;
      v.connect(vg).connect(o.frequency);
      const g = ac.createGain(); g.gain.value = [0.16, 0.12, 0.08, 0.04][i];
      o.connect(g).connect(this.pad); o.start(); v.start(); this.sources.push(o, v);
    });

    // wind: filtered noise
    this.wind = ac.createGain(); this.wind.gain.value = 0; bus(this.wind, 0.2);
    const nb = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate); const nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const ns = ac.createBufferSource(); ns.buffer = nb; ns.loop = true;
    const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 520; bp.Q.value = 0.5;
    const wl = ac.createOscillator(); wl.frequency.value = 0.08; const wg = ac.createGain(); wg.gain.value = 260;
    wl.connect(wg).connect(bp.frequency);
    const nv = ac.createGain(); nv.gain.value = 0.18;
    ns.connect(bp).connect(nv).connect(this.wind); ns.start(); wl.start(); this.sources.push(ns, wl);

    this.tan = ac.createGain(); this.tan.gain.value = 0; bus(this.tan, 0.5);
    this.lastT = t;
    this.nextPluck = ac.currentTime + 0.2;
  }

  private impulse(sec: number) {
    const ac = this.ac!;
    const len = Math.floor(ac.sampleRate * sec);
    const b = ac.createBuffer(2, len, ac.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    return b;
  }

  private pluck(when: number, f: number) {
    const ac = this.ac!;
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 1.2;
    lp.frequency.setValueAtTime(2600, when); lp.frequency.exponentialRampToValueAtTime(650, when + 1.6);
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.16, when + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, when + 3.2);
    lp.connect(g).connect(this.tan);
    for (const m of [1, 1.0035]) {
      const o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.value = f * m;
      o.connect(lp); o.start(when); o.stop(when + 3.3);
    }
  }

  private bell(when: number, f: number, amp: number) {
    const ac = this.ac!;
    [[1, 1, 4.2], [2.76, 0.5, 2.6], [5.4, 0.25, 1.6], [8.93, 0.12, 1.0]].forEach(([m, a, d]) => {
      const o = ac.createOscillator(); o.type = "sine"; o.frequency.value = f * m;
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(amp * a, when + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, when + d);
      o.connect(g); g.connect(this.dry); const s = ac.createGain(); s.gain.value = 0.9; g.connect(s).connect(this.wet);
      o.start(when); o.stop(when + d + 0.1);
    });
  }

  private boom(when: number) {
    const ac = this.ac!;
    const o = ac.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(62, when); o.frequency.exponentialRampToValueAtTime(40, when + 2.6);
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.5, when + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, when + 3.8);
    o.connect(g).connect(this.dry); o.start(when); o.stop(when + 4);
  }

  /** Call every frame with the film clock (seconds). */
  tick(t: number) {
    const ac = this.ac;
    if (!ac || this.muted) { this.lastT = t; return; }
    const now = ac.currentTime;
    this.drone.gain.setTargetAtTime(at(DRONE, t) * 0.5, now, 0.6);
    this.pad.gain.setTargetAtTime(at(PAD, t) * 0.55, now, 0.8);
    this.wind.gain.setTargetAtTime(at(WIND, t), now, 0.8);
    const tg = at(TAN, t);
    this.tan.gain.setTargetAtTime(tg * 0.6, now, 0.5);
    if (tg > 0.05 && now + 0.15 >= this.nextPluck) {
      const when = Math.max(now + 0.02, this.nextPluck);
      this.pluck(when, TAN_NOTES[this.pluckI % 4]);
      this.nextPluck = when + TAN_GAPS[this.pluckI % 4];
      this.pluckI++;
    } else if (tg <= 0.05) this.nextPluck = now + 0.3;
    for (const e of EVENTS) {
      if (this.lastT < e.t && e.t <= t) {
        if (e.kind === "bell") this.bell(now + 0.02, e.f!, e.amp!);
        else this.boom(now + 0.02);
      }
    }
    this.lastT = t;
  }

  /** Switching the sound on must happen inside a click, because browsers only allow sound after the person acts. */
  setMuted(m: boolean, t: number) {
    this.muted = m;
    try {
      if (!m && !this.ac) this.build(t);
      const ac = this.ac;
      if (!ac) return;
      if (!m) { void ac.resume(); this.lastT = t; }
      this.master.gain.setTargetAtTime(m ? 0 : 0.85, ac.currentTime, m ? 0.15 : 0.5);
    } catch { /* no sound is fine: the film still plays with captions */ }
  }

  pause() { try { void this.ac?.suspend(); } catch { /* ignore */ } }
  resume() { try { if (!this.muted) void this.ac?.resume(); } catch { /* ignore */ } }

  /** Fade out and release everything. */
  dispose() {
    const ac = this.ac;
    if (!ac) return;
    this.ac = null;
    try {
      this.master.gain.setTargetAtTime(0, ac.currentTime, 0.2);
      setTimeout(() => { for (const s of this.sources) { try { s.stop(); } catch { /* already stopped */ } } void ac.close(); }, 700);
    } catch { /* ignore */ }
  }
}

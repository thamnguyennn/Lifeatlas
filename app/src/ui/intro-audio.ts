// Sound for the opening film, made entirely in the browser with the Web Audio API: no recordings, no chant (the voice-over lives in intro-voice.ts).
// Besides the drone, tanpura, pad, wind and bells there are sound effects that follow each scene: star twinkles, whooshes between scenes,
// crickets and a lamp under the temple, the rustle of palm leaves, a chime for every planet that joins its orbit, a heartbeat when the
// chart is born, water drops in the quiet scene, a riser into the last scene and a gong for the title.
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

interface Ev { t: number; kind: "bell" | "boom" | "whoosh" | "ping" | "rustle" | "gong" | "riser" | "bowl" | "sparkle"; f?: number; amp?: number; dur?: number; up?: boolean }
// Pentatonic on D, so every chime and ping agrees with the drone.
const PENTA = [293.66, 329.63, 369.99, 440, 493.88, 587.33, 659.25, 739.99, 880, 987.77];
const EVENTS: Ev[] = [
  { t: 0.8, kind: "bell", f: 1174.7, amp: 0.1 },
  { t: 0.9, kind: "sparkle", amp: 0.5 },
  { t: 3.6, kind: "sparkle", amp: 0.4 },
  { t: 6.55, kind: "whoosh", dur: 1.3, amp: 0.5, up: true },
  { t: 7.0, kind: "bell", f: 587.33, amp: 0.22 },
  { t: 8.4, kind: "bell", f: 880, amp: 0.07 },
  { t: 11.2, kind: "rustle", dur: 1.6, amp: 0.6 },
  { t: 12.0, kind: "ping", f: PENTA[3], amp: 0.12 }, { t: 12.9, kind: "ping", f: PENTA[5], amp: 0.12 }, { t: 13.8, kind: "ping", f: PENTA[8], amp: 0.12 },
  { t: 14.5, kind: "whoosh", dur: 1.2, amp: 0.55, up: true },
  { t: 15.2, kind: "bell", f: 440, amp: 0.22 },
  // seven planets join their orbits, one soft chime each
  { t: 16.0, kind: "ping", f: PENTA[0], amp: 0.13 }, { t: 16.9, kind: "ping", f: PENTA[1], amp: 0.13 }, { t: 17.8, kind: "ping", f: PENTA[2], amp: 0.13 },
  { t: 18.7, kind: "ping", f: PENTA[3], amp: 0.14 }, { t: 19.6, kind: "ping", f: PENTA[4], amp: 0.14 }, { t: 20.5, kind: "ping", f: PENTA[5], amp: 0.14 },
  { t: 21.4, kind: "ping", f: PENTA[6], amp: 0.14 },
  { t: 22.5, kind: "whoosh", dur: 1.1, amp: 0.6, up: false },
  { t: 23.2, kind: "bell", f: 293.66, amp: 0.26 },
  { t: 23.3, kind: "bowl", f: 146.83, amp: 0.2, dur: 6 },
  { t: 30.4, kind: "whoosh", dur: 1.2, amp: 0.5, up: true },
  { t: 31.0, kind: "bell", f: 587.33, amp: 0.18 },
  { t: 31.1, kind: "bowl", f: 220, amp: 0.16, dur: 7 },
  { t: 38.1, kind: "riser", dur: 2.5, amp: 0.55 },
  { t: 40.6, kind: "boom" },
  { t: 40.65, kind: "gong", f: 98, amp: 0.34 },
  { t: 40.7, kind: "bell", f: 293.66, amp: 0.3 },
  { t: 41.1, kind: "sparkle", amp: 0.9 },
  { t: 42.9, kind: "ping", f: PENTA[5], amp: 0.1 },
  { t: 44.3, kind: "bell", f: 1174.7, amp: 0.1 },
  { t: 44.35, kind: "ping", f: PENTA[8], amp: 0.1 },
];
// Slow background layers that come and go with the scenes.
const TWINKLE: Key = [[0, 0], [1, 0.5], [5.5, 0.9], [7, 0.1], [14, 0], [31, 0], [33, 0.6], [38, 0.6], [39, 0]];
const CRICKET: Key = [[0, 0], [7.4, 0], [9, 0.5], [14.5, 0.35], [15.5, 0], [44, 0]];
const LAMP: Key = [[0, 0], [7.5, 0], [9, 0.6], [14.5, 0.5], [15.5, 0]];
const HEART: Key = [[0, 0], [23.2, 0], [24, 0.9], [29.5, 0.9], [31, 0.2], [32, 0]];
const WATER: Key = [[0, 0], [31.5, 0], [33, 0.8], [38.5, 0.8], [39.5, 0]];
const CHART_TICKS: [number, number][] = [[24.2, 1], [24.5, 2], [24.8, 3], [25.1, 4], [25.4, 5], [25.7, 6], [26.0, 7], [26.3, 8], [26.6, 9], [26.9, 10], [27.2, 11], [27.5, 12]];

export class IntroAudio {
  private ac: AudioContext | null = null;
  private master!: GainNode;
  private dry!: GainNode;
  private wet!: GainNode;
  private drone!: GainNode;
  private pad!: GainNode;
  private wind!: GainNode;
  private tan!: GainNode;
  private fx!: GainNode;
  private cricket!: GainNode;
  private noise!: AudioBuffer;
  private ducked = false;
  private nextTwinkle = 0;
  private nextDrip = 0;
  private nextBeat = 0;
  private nextLamp = 0;
  private tickDone = new Set<number>();
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
    // effects bus (also ducked under the voice) and a shared noise buffer
    this.fx = ac.createGain(); this.fx.gain.value = 1; bus(this.fx, 0.45);
    this.noise = nb;
    // crickets: a high tone chopped fast, very quiet
    this.cricket = ac.createGain(); this.cricket.gain.value = 0; bus(this.cricket, 0.25);
    const co = ac.createOscillator(); co.type = "sine"; co.frequency.value = 4300;
    const cg = ac.createGain(); cg.gain.value = 0.02;
    const cl = ac.createOscillator(); cl.type = "square"; cl.frequency.value = 22;
    const clg = ac.createGain(); clg.gain.value = 0.02; cl.connect(clg).connect(cg.gain);
    co.connect(cg).connect(this.cricket); co.start(); cl.start(); this.sources.push(co, cl);
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

  private env(g: GainNode, when: number, peak: number, attack: number, hold: number, decay: number) {
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), when + attack);
    g.gain.setValueAtTime(Math.max(0.0002, peak), when + attack + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, when + attack + hold + decay);
  }

  /** A soft glassy chime, used for twinkles, orbits and the letters written in light. */
  private ping(when: number, f: number, amp: number) {
    const ac = this.ac!;
    for (const [m, a, d] of [[1, 1, 2.4], [2.01, 0.28, 1.4], [3.0, 0.1, 0.8]] as const) {
      const o = ac.createOscillator(); o.type = "sine"; o.frequency.value = f * m;
      const g = ac.createGain(); this.env(g, when, amp * a, 0.008, 0, d);
      o.connect(g).connect(this.fx); o.start(when); o.stop(when + d + 0.1);
    }
  }

  /** A burst of tiny high chimes, like stars waking. */
  private sparkle(when: number, amp: number) {
    for (let i = 0; i < 5; i++) this.ping(when + i * 0.07 + Math.random() * 0.05, PENTA[5 + Math.floor(Math.random() * 5)] * (Math.random() < 0.3 ? 2 : 1), 0.05 * amp);
  }

  /** Air moving between two scenes. */
  private whoosh(when: number, dur: number, amp: number, up: boolean) {
    const ac = this.ac!;
    const src = ac.createBufferSource(); src.buffer = this.noise; src.loop = true;
    const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.1;
    const lo = up ? 260 : 3200, hi = up ? 3200 : 260;
    bp.frequency.setValueAtTime(lo, when); bp.frequency.exponentialRampToValueAtTime(hi, when + dur);
    const g = ac.createGain(); this.env(g, when, 0.11 * amp, dur * (up ? 0.8 : 0.25), 0, dur * (up ? 0.2 : 0.75));
    src.connect(bp).connect(g).connect(this.fx); src.start(when, Math.random()); src.stop(when + dur + 0.2);
  }

  /** Dry palm leaves and paper. */
  private rustle(when: number, dur: number, amp: number) {
    const ac = this.ac!;
    const src = ac.createBufferSource(); src.buffer = this.noise; src.loop = true;
    const hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2400;
    const g = ac.createGain(); g.gain.setValueAtTime(0.0001, when);
    for (let i = 0; i < Math.round(dur * 9); i++) g.gain.linearRampToValueAtTime(0.03 * amp * (0.2 + Math.random()), when + i * (dur / (dur * 9)));
    g.gain.linearRampToValueAtTime(0.0001, when + dur);
    src.connect(hp).connect(g).connect(this.fx); src.start(when, Math.random()); src.stop(when + dur + 0.1);
  }

  /** The two soft beats of a heart. */
  private heartbeat(when: number, amp: number) {
    const ac = this.ac!;
    for (const [dt, f, a] of [[0, 62, 1], [0.27, 54, 0.7]] as const) {
      const o = ac.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(f * 1.6, when + dt); o.frequency.exponentialRampToValueAtTime(f, when + dt + 0.12);
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 160;
      const g = ac.createGain(); this.env(g, when + dt, 0.34 * amp * a, 0.015, 0.02, 0.28);
      o.connect(lp).connect(g).connect(this.dry); o.start(when + dt); o.stop(when + dt + 0.5);
    }
  }

  /** A single drop of water on still water. */
  private drip(when: number) {
    const ac = this.ac!;
    const o = ac.createOscillator(); o.type = "sine";
    const f = 900 + Math.random() * 500;
    o.frequency.setValueAtTime(f, when); o.frequency.exponentialRampToValueAtTime(f * 0.45, when + 0.16);
    const g = ac.createGain(); this.env(g, when, 0.07, 0.004, 0, 0.5);
    o.connect(g).connect(this.fx); o.start(when); o.stop(when + 0.7);
  }

  /** A tiny wooden tick, as each house of the chart is drawn. */
  private tick1(when: number, k: number) {
    const ac = this.ac!;
    const o = ac.createOscillator(); o.type = "triangle"; o.frequency.value = 520 + k * 38;
    const g = ac.createGain(); this.env(g, when, 0.06, 0.002, 0, 0.14);
    o.connect(g).connect(this.fx); o.start(when); o.stop(when + 0.2);
  }

  /** A singing bowl: two close partials that beat slowly. */
  private bowl(when: number, f: number, amp: number, dur: number) {
    const ac = this.ac!;
    for (const [m, a] of [[1, 1], [1.006, 0.9], [2.71, 0.25]] as const) {
      const o = ac.createOscillator(); o.type = "sine"; o.frequency.value = f * m;
      const g = ac.createGain(); this.env(g, when, amp * a, 0.5, 0.2, dur);
      o.connect(g); g.connect(this.dry); const s = ac.createGain(); s.gain.value = 0.7; g.connect(s).connect(this.wet);
      o.start(when); o.stop(when + dur + 1);
    }
  }

  /** Low metal, long tail: the title arrives. */
  private gong(when: number, f: number, amp: number) {
    const ac = this.ac!;
    [[1, 1, 7], [1.52, 0.55, 5.5], [2.31, 0.4, 4.2], [3.1, 0.25, 3], [4.4, 0.12, 2.2]].forEach(([m, a, d]) => {
      const o = ac.createOscillator(); o.type = "sine"; o.frequency.value = f * m;
      const g = ac.createGain(); this.env(g, when, amp * a, 0.015, 0, d);
      o.connect(g); g.connect(this.dry); const s = ac.createGain(); s.gain.value = 1; g.connect(s).connect(this.wet);
      o.start(when); o.stop(when + d + 0.2);
    });
  }

  /** Air and tone rising into the last scene. */
  private riser(when: number, dur: number, amp: number) {
    const ac = this.ac!;
    this.whoosh(when, dur, amp * 1.3, true);
    const o = ac.createOscillator(); o.type = "sawtooth";
    o.frequency.setValueAtTime(146.83, when); o.frequency.exponentialRampToValueAtTime(587.33, when + dur);
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(300, when); lp.frequency.exponentialRampToValueAtTime(2400, when + dur);
    const g = ac.createGain(); this.env(g, when, 0.05 * amp, dur * 0.9, 0, 0.2);
    o.connect(lp).connect(g).connect(this.fx); o.start(when); o.stop(when + dur + 0.3);
  }

  /** Let the music and effects step back while a voice is speaking. */
  duck(on: boolean) { this.ducked = on; }

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
    // layers that follow the scenes
    this.cricket.gain.setTargetAtTime(at(CRICKET, t), now, 0.8);
    const duck = this.ducked ? 0.45 : 1;
    this.fx.gain.setTargetAtTime(duck, now, 0.25);
    this.dry.gain.setTargetAtTime(0.8 * (this.ducked ? 0.62 : 1), now, 0.25);
    const sparkle = at(TWINKLE, t);
    if (sparkle > 0.05 && now >= this.nextTwinkle) {
      this.ping(now + 0.02, PENTA[Math.floor(Math.random() * PENTA.length)] * (Math.random() < 0.5 ? 2 : 1), 0.045 * sparkle);
      this.nextTwinkle = now + 0.45 + Math.random() * (1.8 - sparkle);
    }
    if (at(LAMP, t) > 0.05 && now >= this.nextLamp) { this.rustle(now + 0.01, 0.12, 0.35); this.nextLamp = now + 0.35 + Math.random() * 1.6; }
    const water = at(WATER, t);
    if (water > 0.05 && now >= this.nextDrip) { this.drip(now + 0.02); this.nextDrip = now + 1.1 + Math.random() * 1.9; }
    const beat = at(HEART, t);
    if (beat > 0.05 && now >= this.nextBeat) { this.heartbeat(now + 0.02, beat); this.nextBeat = now + 0.92; }
    for (const [ct, k] of CHART_TICKS) if (this.lastT < ct && ct <= t && !this.tickDone.has(k)) { this.tickDone.add(k); this.tick1(now + 0.02, k); }
    for (const e of EVENTS) {
      if (this.lastT < e.t && e.t <= t) {
        const w = now + 0.02;
        switch (e.kind) {
          case "bell": this.bell(w, e.f!, e.amp!); break;
          case "boom": this.boom(w); break;
          case "whoosh": this.whoosh(w, e.dur ?? 1.2, e.amp ?? 0.5, e.up ?? true); break;
          case "ping": this.ping(w, e.f!, e.amp!); break;
          case "rustle": this.rustle(w, e.dur ?? 1.4, e.amp ?? 0.6); break;
          case "gong": this.gong(w, e.f!, e.amp!); break;
          case "riser": this.riser(w, e.dur ?? 2.4, e.amp ?? 0.5); break;
          case "bowl": this.bowl(w, e.f!, e.amp!, e.dur ?? 6); break;
          case "sparkle": this.sparkle(w, e.amp ?? 0.5); break;
        }
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
      if (!m) { void ac.resume(); this.lastT = t; this.tickDone.clear(); }
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

// The voice-over of the opening film. Two sources, tried in this order:
//   1. a recording the owner drops next to index.html as "voiceover.mp3" (a deep male voice recorded or generated anywhere; the file
//      follows the film's real clock, see docs/VOICE-SCRIPT.md for the lines and the seconds they start);
//   2. the voice the visitor's own device offers for Vietnamese (speechSynthesis). A male voice is preferred and the pitch is lowered
//      so the voice sits low. Devices without a Vietnamese voice simply play the film with music and captions.
// Nothing is sent anywhere: the lines are spoken by the browser itself.

export interface VoiceLine { id: string; a: number; text: string; /** seconds the caption stays, used to pick a rate that fits */ win: number }

/** The lines, on the film clock (seconds). The first ten are the captions; the last two are the closing lines. */
export const VOICE_LINES: VoiceLine[] = [
  { id: "c0", a: 1.2, win: 2.7, text: "Hàng nghìn năm trước, khi con người ngước nhìn bầu trời đêm" },
  { id: "c1", a: 4.1, win: 2.5, text: "họ đã bắt đầu đặt những câu hỏi về các vì sao." },
  { id: "c2", a: 7.6, win: 3.6, text: "Trên vùng đất Ấn Độ cổ, những quan sát ấy dần trở thành một truyền thống tri thức" },
  { id: "c3", a: 11.4, win: 3.2, text: "được gìn giữ và tiếp nối qua nhiều thế hệ." },
  { id: "c4", a: 15.6, win: 3.6, text: "Trong Jyotish, mỗi chuyển động trên bầu trời trở thành một phần của ngôn ngữ biểu tượng" },
  { id: "c5", a: 19.5, win: 3.1, text: "một cách để con người suy ngẫm về cuộc sống." },
  { id: "c6", a: 23.4, win: 4.1, text: "Và từ khoảnh khắc một người chào đời, Jyotish dựng nên một tấm bản đồ bầu trời riêng." },
  { id: "c7", a: 27.8, win: 3.0, text: "Mình muốn bạn xem tấm bản đồ ấy như một món quà của vũ trụ" },
  { id: "c8", a: 31.7, win: 2.9, text: "Để đôi khi, giữa những ngày vội vã" },
  { id: "c9", a: 34.9, win: 3.7, text: "bạn có thể dừng lại, nhìn về chính mình bằng một góc nhìn khác." },
  { id: "e0", a: 41.2, win: 1.6, text: "Life Atlas. Bản đồ cuộc đời." },
  { id: "e1", a: 42.8, win: 2.6, text: "Để mình kể cho bạn nghe câu chuyện về chính bạn." },
];

const MALE_HINT = /(nam\s?minh|\bnam\b|male|\bman\b|hùng|hung|đức|duc|khoa|tuấn|tuan)/i;

/** Best Vietnamese voice the device has: a male one when it can be told apart, otherwise any Vietnamese voice. */
export function pickVoice(list: SpeechSynthesisVoice[]): { voice: SpeechSynthesisVoice | null; male: boolean } {
  // Only natural (neural / online) Vietnamese voices are used; the compact local voices sound robotic, so without a natural
  // voice the film plays with captions, music and sound effects only.
  const vi = list.filter((v) => (/^vi\b|^vi[-_]/i.test(v.lang) || /vietnam|tiếng việt/i.test(v.name)) && /natural|online|neural|google/i.test(v.name));
  if (!vi.length) return { voice: null, male: false };
  const male = vi.find((v) => MALE_HINT.test(v.name));
  return male ? { voice: male, male: true } : { voice: vi[0], male: false };
}

const words = (s: string) => s.replace(/[.,…]/g, " ").split(/\s+/).filter(Boolean).length;

export class IntroVoice {
  status: "idle" | "file" | "browser" | "none" = "idle";
  private muted = true;
  private lastT = 0;
  private file: HTMLAudioElement | null = null;
  private fileOk = false;
  private voice: SpeechSynthesisVoice | null = null;
  private male = false;
  private speakingUntil = 0;

  constructor() {
    // Is there a recording next to the page? Opening the page from a plain file or without the file is fine: it just stays unused.
    try {
      const a = new Audio();
      a.preload = "auto";
      a.src = "voiceover.mp3";
      a.addEventListener("canplaythrough", () => { this.fileOk = true; }, { once: true });
      a.addEventListener("error", () => { this.fileOk = false; }, { once: true });
      this.file = a;
    } catch { this.file = null; }
  }

  get available() { return this.fileOk || (typeof window !== "undefined" && "speechSynthesis" in window); }
  /** True while a line is being spoken, so the music can step back. */
  get speaking() { return !this.muted && performance.now() < this.speakingUntil; }

  private loadVoice() {
    try {
      const { voice, male } = pickVoice(window.speechSynthesis.getVoices());
      this.voice = voice; this.male = male;
    } catch { this.voice = null; }
  }

  /** Must be called from the click that turns the sound on: some browsers only allow speech after a click. */
  setMuted(m: boolean, t: number, real: number) {
    this.muted = m; this.lastT = t;
    if (m) { this.stop(); return; }
    if (this.fileOk && this.file) {
      this.status = "file";
      try { this.file.currentTime = Math.max(0, real); void this.file.play(); } catch { this.status = "none"; }
      return;
    }
    try {
      const ss = window.speechSynthesis;
      this.loadVoice();
      ss.onvoiceschanged = () => this.loadVoice();
      const unlock = new SpeechSynthesisUtterance(" "); unlock.volume = 0; ss.speak(unlock);
      this.status = this.voice || ss.getVoices().length === 0 ? "browser" : "none";
    } catch { this.status = "none"; }
  }

  private say(line: VoiceLine) {
    try {
      const ss = window.speechSynthesis;
      if (!this.voice) this.loadVoice();
      if (!this.voice) { if (ss.getVoices().length) this.status = "none"; return; }
      this.status = "browser";
      ss.cancel();
      const u = new SpeechSynthesisUtterance(line.text);
      u.voice = this.voice; u.lang = this.voice.lang || "vi-VN";
      // about 4.4 words a second at the normal rate; slow it down for the long lines only as far as the caption allows
      const rate = Math.min(1.12, Math.max(0.8, words(line.text) / (Math.max(1.2, line.win - 0.35) * 4.4)));
      u.rate = rate * 0.94;
      u.pitch = this.male ? 0.72 : 0.5;   // a low, unhurried voice; a female voice is dropped further
      u.volume = 1;
      const est = words(line.text) / (4.4 * u.rate) + 0.3;
      this.speakingUntil = performance.now() + est * 1000;
      u.onend = () => { this.speakingUntil = 0; };
      ss.speak(u);
    } catch { /* the film plays on without a voice */ }
  }

  /** Call every frame with the film clock and the real clock (seconds since the film began). */
  tick(t: number, real: number) {
    if (this.muted) { this.lastT = t; return; }
    if (this.status === "file" && this.file) {
      // keep the recording on the film's real clock, correcting a drift of more than a third of a second
      if (Math.abs(this.file.currentTime - real) > 0.35 && real < (this.file.duration || 1e9)) { try { this.file.currentTime = real; } catch { /* ignore */ } }
      this.lastT = t; this.speakingUntil = performance.now() + 1500;
      return;
    }
    for (const l of VOICE_LINES) if (this.lastT < l.a && l.a <= t) this.say(l);
    this.lastT = t;
  }

  pause() { try { window.speechSynthesis.pause(); this.file?.pause(); } catch { /* ignore */ } }
  resume() { try { if (!this.muted) { window.speechSynthesis.resume(); if (this.status === "file") void this.file?.play(); } } catch { /* ignore */ } }

  private stop() { try { window.speechSynthesis.cancel(); this.file?.pause(); } catch { /* ignore */ } this.speakingUntil = 0; }
  dispose() { this.muted = true; this.stop(); }
}

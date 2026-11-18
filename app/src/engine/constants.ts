// Shared names and classical tables. Everything here is plain data.

export const SIGNS = [
  "Bạch Dương", "Kim Ngưu", "Song Tử", "Cự Giải", "Sư Tử", "Xử Nữ",
  "Thiên Bình", "Thiên Yết", "Nhân Mã", "Ma Kết", "Bảo Bình", "Song Ngư",
] as const;

export const SIGN_EN = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

export type GrahaId = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "rahu" | "ketu";

export const GRAHAS: GrahaId[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"];
export const SEVEN: GrahaId[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];

export const GRAHA_VI: Record<GrahaId, string> = {
  sun: "Mặt Trời", moon: "Mặt Trăng", mars: "Sao Hỏa", mercury: "Sao Thủy", jupiter: "Sao Mộc",
  venus: "Sao Kim", saturn: "Sao Thổ", rahu: "Rahu", ketu: "Ketu",
};
export const GRAHA_SA: Record<GrahaId, string> = {
  sun: "Surya", moon: "Chandra", mars: "Mangala", mercury: "Budha", jupiter: "Guru",
  venus: "Shukra", saturn: "Shani", rahu: "Rahu", ketu: "Ketu",
};
/** Two-letter chart labels (the traditional Jyotish abbreviations). */
export const GRAHA_ABBR: Record<GrahaId, string> = {
  sun: "Su", moon: "Mo", mars: "Ma", mercury: "Me", jupiter: "Ju", venus: "Ve", saturn: "Sa", rahu: "Ra", ketu: "Ke",
};

/** Ruler of each sign (0 = Aries). */
export const SIGN_LORD: GrahaId[] = [
  "mars", "venus", "mercury", "moon", "sun", "mercury",
  "venus", "mars", "jupiter", "saturn", "saturn", "jupiter",
];

/** Signs each planet owns. */
export const OWN_SIGNS: Partial<Record<GrahaId, number[]>> = {
  sun: [4], moon: [3], mars: [0, 7], mercury: [2, 5], jupiter: [8, 11], venus: [1, 6], saturn: [9, 10],
};

/** Exaltation sign and exact degree. Debilitation is the opposite sign. */
export const EXALT: Partial<Record<GrahaId, { sign: number; deg: number }>> = {
  sun: { sign: 0, deg: 10 }, moon: { sign: 1, deg: 3 }, mars: { sign: 9, deg: 28 },
  mercury: { sign: 5, deg: 15 }, jupiter: { sign: 3, deg: 5 }, venus: { sign: 11, deg: 27 }, saturn: { sign: 6, deg: 20 },
};

/** Moolatrikona sign and degree range. */
export const MOOLATRIKONA: Partial<Record<GrahaId, { sign: number; from: number; to: number }>> = {
  sun: { sign: 4, from: 0, to: 20 }, moon: { sign: 1, from: 3, to: 30 }, mars: { sign: 0, from: 0, to: 12 },
  mercury: { sign: 5, from: 15, to: 20 }, jupiter: { sign: 8, from: 0, to: 10 },
  venus: { sign: 6, from: 0, to: 15 }, saturn: { sign: 10, from: 0, to: 20 },
};

/** Natural friendship (Parashara). Anything not listed is neutral. */
export const FRIENDS: Partial<Record<GrahaId, GrahaId[]>> = {
  sun: ["moon", "mars", "jupiter"], moon: ["sun", "mercury"], mars: ["sun", "moon", "jupiter"],
  mercury: ["sun", "venus"], jupiter: ["sun", "moon", "mars"], venus: ["mercury", "saturn"], saturn: ["mercury", "venus"],
};
export const ENEMIES: Partial<Record<GrahaId, GrahaId[]>> = {
  sun: ["venus", "saturn"], moon: [], mars: ["mercury"], mercury: ["moon"],
  jupiter: ["mercury", "venus"], venus: ["sun", "moon"], saturn: ["sun", "moon", "mars"],
};

/** Combustion orbs in degrees from the Sun. */
export const COMBUST_ORB: Partial<Record<GrahaId, number>> = {
  moon: 12, mars: 17, mercury: 14, jupiter: 11, venus: 10, saturn: 15,
};

/** House in which each planet gains directional strength (Dig Bala). */
export const DIG_HOUSE: Partial<Record<GrahaId, number>> = {
  jupiter: 1, mercury: 1, sun: 10, mars: 10, saturn: 7, moon: 4, venus: 4,
};

/** Extra full aspects besides the 7th (house offsets counted from the planet). */
export const SPECIAL_ASPECTS: Partial<Record<GrahaId, number[]>> = {
  mars: [4, 8], jupiter: [5, 9], saturn: [3, 10],
};

export const NATURAL_BENEFICS: GrahaId[] = ["jupiter", "venus", "mercury", "moon"];
export const NATURAL_MALEFICS: GrahaId[] = ["sun", "mars", "saturn", "rahu", "ketu"];

export const KENDRA = [1, 4, 7, 10];
export const TRIKONA = [1, 5, 9];
export const DUSTHANA = [6, 8, 12];

export const NAKSHATRA_VI: Record<string, string> = {
  Ashwini: "Ashwini", Bharani: "Bharani", Krittika: "Krittika", Rohini: "Rohini", Mrigashira: "Mrigashira",
  Ardra: "Ardra", Punarvasu: "Punarvasu", Pushya: "Pushya", Ashlesha: "Ashlesha", Magha: "Magha",
  "Purva Phalguni": "Purva Phalguni", "Uttara Phalguni": "Uttara Phalguni", Hasta: "Hasta", Chitra: "Chitra",
  Swati: "Swati", Vishakha: "Vishakha", Anuradha: "Anuradha", Jyeshtha: "Jyeshtha", Mula: "Mula",
  "Purva Ashadha": "Purva Ashadha", "Uttara Ashadha": "Uttara Ashadha", Shravana: "Shravana",
  Dhanishta: "Dhanishta", Shatabhisha: "Shatabhisha", "Purva Bhadrapada": "Purva Bhadrapada",
  "Uttara Bhadrapada": "Uttara Bhadrapada", Revati: "Revati",
};

/** Vimshottari lord names as the engine returns them -> our ids. */
export function asGraha(name: string): GrahaId {
  const k = name.toLowerCase();
  if (k === "true_node" || k === "rahu" || k === "mean_node") return "rahu";
  return k as GrahaId;
}

export const signIndex = (name: string) => (SIGNS as readonly string[]).indexOf(name);
export const mod = (a: number, n: number) => ((a % n) + n) % n;
export const signOf = (lon: number) => Math.floor(mod(lon, 360) / 30);
export const degInSign = (lon: number) => mod(lon, 360) % 30;

/** "23°40′" style label for a degree inside a sign. */
export function fmtDeg(d: number): string {
  let deg = Math.floor(d);
  let min = Math.round((d - deg) * 60);
  if (min === 60) { deg += 1; min = 0; }
  return `${deg}°${String(min).padStart(2, "0")}′`;
}

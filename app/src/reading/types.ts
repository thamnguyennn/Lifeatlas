// The shape of a finished reading in Life Atlas v3.0.
// Everything the UI shows is in here; the UI writes no astrology of its own.
import type { GrahaId } from "../engine/constants.ts";
import type { Tone } from "./shared.ts";

export type { Tone };
export type Trust = "chắc" | "gần đúng" | "chỉ tham khảo";

// ---------------------------------------------------------------- letter and overview

export type OpeningPathway =
  | "harmony"
  | "contrast"
  | "stellium"
  | "retro_depth"
  | "dusthana_forge"
  | "quiet_horizon";

export interface Letter {
  line: string;
  paragraphs: string[];
}

export interface Keystone {
  id: "lagna" | "sun" | "moon";
  /** "Cung mọc", "Mặt Trời", "Mặt Trăng". */
  title: string;
  /** What this point stands for, in four or five words. */
  role: string;
  sign: string;
  paragraphs: string[];
}

export interface StrengthRow {
  id: GrahaId;
  name: string;
  /** Strength as a percentage of the minimum the planet needs. */
  pct: number;
  band: "rất mạnh" | "mạnh" | "vừa" | "yếu";
  rank: number;
}

export interface PlanetRow {
  id: GrahaId;
  name: string;
  sanskrit: string;
  sign: string;
  deg: string;
  house: number | null;
  nakshatra: string;
  pada: number;
  nakLord: string;
  nakText: string;
  dignity: string;
  flags: string[];
  navamsa: string;
  /** Shadbala, Ishta and Kashta in two plain sentences. Null for Rahu and Ketu, and when there is no birth time. */
  strengthNote: string | null;
}

export interface OverviewSynthesis {
  paragraphs: string[];
  anchors: string[];
}

export interface Overview {
  intro: string;
  synthesis: OverviewSynthesis;
  keystones: Keystone[];
  /** How the three keystones talk to each other. */
  link: { title: string; paragraphs: string[] };
  common: { id: string; title: string; paragraphs: string[] }[];
  strength: null | { intro: string; rows: StrengthRow[]; best: string; worst: string };
  planets: PlanetRow[];
}

// ---------------------------------------------------------------- houses

export type HousePathway =
  | "strength_lead"
  | "tension_contrast"
  | "lord_bridge"
  | "care_condition"
  | "domain_steady";

export type ExpressiveLevel = "sôi động" | "vừa phải" | "yên tĩnh";
export type SupportLevel = "thuận lợi" | "pha trộn" | "cần rèn giũa";

export interface SectionBlock { label: string; paragraphs: string[] }

export interface Section {
  id: "open" | "summary" | "sign" | "lord" | "inside" | "aspects" | "support" | "yoga" | "turn";
  /** Evidence layers: the page shows them folded under "Vì sao mình nói điều này?". */
  fold?: boolean;
  title: string;
  paragraphs: string[];
  blocks?: SectionBlock[];
  /** Yoga ids this section talks about, so the UI can link them. */
  yogaIds?: string[];
}

export interface HouseReading {
  n: number;
  /** Two or three words, used in menus. */
  tag: string;
  theme: string;
  ask: string;
  plain: string;
  signName: string;
  lordName: string;
  lordHouse: number;
  occupants: string[];
  sav: number;
  savLabel: string;
  rank: number | null;
  tone: Tone;
  score: number;
  pathway: HousePathway;
  pathwayLabel: string;
  expressiveLevel: ExpressiveLevel;
  supportLevel: SupportLevel;
  /** How the colour and narrative pathway of the house were worked out, one line per part. */
  why: string[];
  sections: Section[];
  facts: { label: string; value: string }[];
  yogaIds: string[];
  words: number;
}

export interface YogaReading {
  id: string;
  name: string;
  tone: Tone;
  strength: string;
  chips: string[];
  text: string;
  recognise: string;
  detail: string;
  houses: number[];
}

// ---------------------------------------------------------------- lessons of this life

export interface AxisReading {
  intro: string;
  headline: string;
  lesson: string | null;
  pull: string | null;
  ketu: { title: string; paragraphs: string[] };
  rahu: { title: string; paragraphs: string[] };
  bridge: string | null;
  ask: string | null;
  facts: { label: string; value: string }[];
}

export interface KarakaCard {
  role: string;
  sa: string;
  meaning: string;
  planetId: GrahaId;
  planet: string;
  deg: string;
  house: number | null;
  paragraphs: string[];
}

export interface SoulReading {
  intro: string;
  ak: { planet: string; title: string; paragraphs: string[]; ask: string };
  karakamsa: { title: string; paragraphs: string[] };
  karakas: KarakaCard[];
}

export interface Lessons {
  axis: AxisReading;
  soul: SoulReading | null;
}

export interface VargaHouseRead {
  house: number;
  sign: string;
  topic: string;
  /** The three beats: what it is, what it costs, how others see it. */
  text: string;
  /** Where the lord sits and who is inside. */
  notes: string[];
}

export interface VargaReading {
  n: 2 | 9 | 10;
  code: string;
  name: string;
  short: string;
  lead: string;
  how: string;
  paragraphs: string[];
  /** D1-to-Varga structural bridge & technical explanation lines. */
  why?: string[];
  /** D9 and D10 are read house by house. */
  houses?: VargaHouseRead[];
  housesTitle?: string;
  housesIntro?: string;
  note?: string;
  chart?: { lagnaSign: number; planets: Record<GrahaId, number> };
  hora?: { sun: GrahaId[]; moon: GrahaId[]; lagna: "sun" | "moon" };
}

// ---------------------------------------------------------------- time: dasha, sky, today

export interface PeriodRead {
  level: 1 | 2 | 3 | 4 | 5;
  lord: GrahaId;
  lordName: string;
  /** "Đại vận", "Tiểu vận", ... */
  name: string;
  sanskrit: string;
  from: string;
  to: string;
  fromMs: number;
  toMs: number;
  /** Rough length, e.g. "khoảng 19 năm", "khoảng 3 tuần". */
  span: string;
  trust: Trust;
  /** The path of lords down to here, as names, and as ids (so the UI can walk down to the next level). */
  path: string[];
  pathIds: GrahaId[];
  title: string;
  paragraphs: string[];
  /** Natal houses activated by this period (owned, occupied, aspected). */
  litHouses?: number[];
  state: "past" | "now" | "future";
  /** The colour of the period (levels 1 to 3). */
  tone?: Tone;
}

export interface MahaRow {
  lord: GrahaId;
  name: string;
  from: string;
  to: string;
  startYear: number;
  endYear: number;
  ageFrom: number;
  ageTo: number;
  state: "past" | "now" | "future";
  tone: Tone;
  why: string[];
  /** The chapter title, e.g. "Ham muốn và làm lại". */
  title: string;
  theme: string;
  litHouses: number[];
  read: PeriodRead;
  /** The nine antardashas of this chapter, each already read. */
  antars: PeriodRead[];
}

export interface HouseWindowSummary {
  n: number;
  tag: string;
  lordName: string;
  windows: string[];
}

export interface Timeline {
  intro: string;
  birth: string;
  mahas: MahaRow[];
  houseWindows: HouseWindowSummary[];
  reliability: { windowMin: number; stableLevels: number; note: string };
}

export interface LadderReading {
  ms: number;
  dateLabel: string;
  levels: PeriodRead[];
  blend: string[];
  trustNote: string;
}

export interface SkyPlanet {
  id: GrahaId;
  name: string;
  sign: string;
  deg: string;
  retro: boolean;
  fromLagna: number | null;
  fromMoon: number;
  bindus: number | null;
  support: "tốt" | "vừa" | "khó";
  stay: string | null;
  moonText: string;
  lagnaText: string | null;
  divergenceNote: string | null;
  text: string;
}

export interface SkyReading {
  ms: number;
  dateLabel: string;
  intro: string;
  moonLensIntro: string;
  lagnaLensIntro: string | null;
  planets: SkyPlanet[];
  sade: { phase: "none" | "rising" | "peak" | "setting"; title: string; text: string };
  specials: { title: string; text: string }[];
  day: { title: string; paragraphs: string[]; chandra: boolean; tara: { n: number; kind: "tốt" | "vừa" | "khó" } };
  hits: { title: string; text: string }[];
  why: string[];
}

export interface TodayReading {
  ms: number;
  monthLabel: string;
  title: string;
  /** A short letter: the season the person is in, the sky meeting it, one small thing to do. */
  paragraphs: string[];
  ask: string;
  /** What the message was built from, shown collapsed. */
  why: string[];
  trustNote: string;
}

// ---------------------------------------------------------------- everything

export interface Reading {
  meta: { lagna: string; moon: string; sun: string; moonNak: string; lagnaNak: string; ayanamsa: string; noTime: boolean };
  letter: Letter;
  overview: Overview;
  /** The page that opens the twelve houses. Null when the birth time is unknown. */
  houseMap: { intro: string[]; layers: { title: string; text: string }[] } | null;
  houses: HouseReading[];
  yogas: { intro: string; list: YogaReading[] };
  lessons: Lessons;
  vargas: VargaReading[] | null;
  timeline: Timeline;
  ladder: LadderReading;
  sky: SkyReading;
  today: TodayReading;
}

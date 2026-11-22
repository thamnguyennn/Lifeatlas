// The shape of a finished reading in Life Atlas v3.0.
// Everything the UI shows is in here; the UI writes no astrology of its own.
import type { Forecast } from "./forecast.ts";
import type { ExploreGroup } from "./explore.ts";
import type { GrahaId } from "../engine/constants.ts";
import type { Tone } from "./shared.ts";
import type { Letter, Overview } from "./overview3.ts";
import type { NodesReading } from "./nodes.ts";
export type { NodesReading } from "./nodes.ts";
export type { Letter, Overview, OverviewBlock } from "./overview3.ts";

export type { Tone };
export type Trust = "chắc" | "gần đúng" | "chỉ tham khảo";

// ---------------------------------------------------------------- letter and overview

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

// ---------------------------------------------------------------- houses

export type HousePathway = "strength" | "contrast" | "bridge" | "care" | "life" | "occupant" | "yoga" | "quiet";

export type ExpressiveLevel = "sôi động" | "vừa phải" | "yên tĩnh";
export type SupportLevel = "thuận lợi" | "có thuận có khó" | "cần rèn giũa";

export interface SectionBlock { label: string; paragraphs: string[]; /** Shown as paragraphs instead of a list. */ prose?: boolean }

export interface Section {
  id: "open" | "summary" | "sign" | "lord" | "inside" | "aspects" | "support" | "yoga";
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

export interface VargaPoint { title: string; paragraphs: string[] }

export interface VargaReading {
  n: 2 | 3 | 4 | 7 | 9 | 10;
  about: string;
  code: string;
  name: string;
  short: string;
  /** The one question the chart answers. */
  question: string;
  trust: { level: "chắc" | "một phần" | "thấp" | "không"; note: string };
  /** Part 1: the judgement, with D1 and the divisional chart read together. */
  summary: string[];
  /** Part 2: the two or three features that stand out in this chart. */
  points: VargaPoint[];
  /** Part 3: the facts behind it ("Vì sao mình nói điều này?"). */
  why: string[];
  how: string;
  chart: { lagnaSign: number; planets: Record<GrahaId, number> };
  hora?: { sun: GrahaId[]; moon: GrahaId[] };
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
  /** A Mahadasha is read in six layers (levels below it use paragraphs). */
  layers?: { title: string; text: string }[];
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

// ---------------------------------------------------------------- everything

export interface Reading {
  meta: { lagna: string; moon: string; sun: string; moonNak: string; lagnaNak: string; ayanamsa: string; noTime: boolean; windowMin: number; lagnaShift: string[] };
  letter: Letter;
  overview: Overview;
  /** The page that opens the twelve houses. Null when the birth time is unknown. */
  houseMap: { intro: string[]; layers: { title: string; text: string }[] } | null;
  houses: HouseReading[];
  yogas: { intro: string; list: YogaReading[] };
  nodes: NodesReading;
  vargas: VargaReading[] | null;
  forecast: Forecast;
  explore: ExploreGroup[];
  timeline: Timeline;
  ladder: LadderReading;
  sky: SkyReading;
}

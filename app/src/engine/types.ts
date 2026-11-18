import type { GrahaId } from "./constants.ts";

export type Dignity =
  | "exalted" | "moolatrikona" | "own" | "friend" | "neutral" | "enemy" | "debilitated" | "none";

export interface NakshatraInfo {
  index: number; // 0..26
  name: string;
  pada: number; // 1..4
  lord: GrahaId;
  pos: number; // degrees into the nakshatra
}

export interface Graha {
  id: GrahaId;
  lon: number; // sidereal longitude, 0..360
  sign: number; // 0 = Aries
  deg: number; // degrees inside the sign
  speed: number;
  retro: boolean;
  nak: NakshatraInfo;
  house: number; // Whole Sign house from the Lagna, 1..12
  dignity: Dignity;
  combust: boolean;
  digBala: boolean; // sits in the house where it gains directional strength
  navamsaSign: number;
  vargottama: boolean;
}

export interface HouseInfo {
  n: number; // 1..12
  sign: number;
  lord: GrahaId;
  lordHouse: number;
  occupants: GrahaId[];
  aspectedBy: GrahaId[]; // planets casting a full aspect onto this house (not occupants)
  sav: number; // Sarvashtakavarga points of this house's sign
}

export interface DashaSub { lord: GrahaId; startMs: number; endMs: number }
export interface DashaPeriod { lord: GrahaId; startMs: number; endMs: number; sub: DashaSub[] }

export type YogaTone = "good" | "mixed" | "challenge";
export interface Yoga {
  id: string;
  name: string; // Vietnamese display name
  sanskrit: string;
  grahas: GrahaId[];
  houses: number[];
  tone: YogaTone;
  strength: "strong" | "normal" | "weak";
  /** Short machine-readable detail used by the composer (e.g. "maha", "dainya"). */
  kind?: string;
}

export interface Natal {
  utcMs: number;
  jd: number;
  lat: number;
  lon: number;
  ayanamsa: number;
  lagna: { lon: number; sign: number; deg: number; nak: NakshatraInfo };
  grahas: Record<GrahaId, Graha>;
  houses: HouseInfo[]; // index 0 = house 1
  /** Bhinnashtakavarga bindus per planet per SIGN (index 0 = Aries). */
  bav: Record<string, number[]>;
  /** Sarvashtakavarga per SIGN (sums to 337). */
  sav: number[];
  dasha: DashaPeriod[];
  dashaStartLord: GrahaId;
  dashaBalanceYears: number;
  yogas: Yoga[];
  warnings: string[];
}

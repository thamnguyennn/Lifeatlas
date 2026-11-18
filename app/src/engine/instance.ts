// One shared engine. Caelus is MIT-licensed, ships its own embedded ephemeris
// (VSOP87 + analytic Moon) and runs in the browser with no network access.
import { Engine } from "caelus";
import { embeddedData } from "caelus/data-embedded";

export const engine = new Engine(embeddedData);

/** The conventions this app fixes on purpose (see the Method page). */
export const ZODIAC = "sidereal:lahiri" as const; // Lahiri / Chitrapaksha ayanamsa
export const HOUSE_SYSTEM = "whole_sign" as const; // Whole Sign houses
export const DASHA_YEAR_DAYS = 365.25; // Vimshottari year length

export const jdFromMs = (ms: number) => ms / 86_400_000 + 2_440_587.5;
export const msFromJd = (jd: number) => (jd - 2_440_587.5) * 86_400_000;

// Check a draft against the voice rules.  Usage: node --experimental-strip-types --no-warnings scripts/voice-check.ts draft.txt
import { readFileSync } from "node:fs";
import { BANNED, softRules } from "./voice-rules.ts";

const text = readFileSync(process.argv[2], "utf8");
const sentences = text.split(/(?<=[.!?])\s+|\n+/).map((x) => x.trim()).filter((x) => x.length > 12);
let flagged = 0;
for (const s of sentences) {
  const low = s.toLowerCase();
  const hits = [...BANNED.filter((b) => low.includes(b)).map((b) => `banned "${b}"`), ...softRules(s)];
  if (hits.length) { flagged++; console.log(`- ${s.slice(0, 130)}\n    ${hits.join("; ")}`); }
}
console.log(flagged ? `${flagged} sentence(s) flagged of ${sentences.length}` : `clean: ${sentences.length} sentences`);

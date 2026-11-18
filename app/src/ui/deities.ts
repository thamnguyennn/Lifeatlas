// The presiding gods of the nine grahas (Navagraha), as one traditional listing gives them.
// Source for every line here: Indian Divinity, "Navagraha" (webonautics.com/mythology/navagraha.html), table of Adhi Devata (presiding deity) and Pratyadhi Devata.
// Lists differ between temples and texts (for example some give Ganesha for Ketu), so the Method page says this is one common listing and not the only one.
import type { GrahaId } from "../engine/constants.ts";

export interface Deity {
  /** The presiding deity (adhi devata) and how the source describes them, in plain Vietnamese. */
  name: string;
  epithet: string;
  /** The second deity (pratyadhi devata) of the same listing. */
  second: string;
}

export const DEITY: Record<GrahaId, Deity> = {
  sun: { name: "Agni", epithet: "thần Lửa", second: "Shiva" },
  moon: { name: "Apas", epithet: "nữ thần Nước", second: "Parvati" },
  mars: { name: "Bhumi", epithet: "nữ thần Đất", second: "Skanda" },
  mercury: { name: "Vishnu", epithet: "đấng gìn giữ", second: "Vishnu" },
  jupiter: { name: "Indra", epithet: "vua của các vị thần", second: "Brahma" },
  venus: { name: "Indrani", epithet: "hoàng hậu của các vị thần", second: "Indra" },
  saturn: { name: "Yama", epithet: "thần của cái chết", second: "Prajapati" },
  rahu: { name: "Durga", epithet: "nữ thần của sức mạnh", second: "Sarpa" },
  ketu: { name: "Chitragupta", epithet: "thần của nghiệp (karma)", second: "Brahma" },
};

/** Day of the week named after each of the seven visible grahas (Wikipedia, "Navagraha"). */
export const DAY_OF: Partial<Record<GrahaId, string>> = {
  sun: "Chủ nhật", moon: "Thứ hai", mars: "Thứ ba", mercury: "Thứ tư", jupiter: "Thứ năm", venus: "Thứ sáu", saturn: "Thứ bảy",
};

/** The gem the same listing pairs with each graha. */
export const GEM_OF: Record<GrahaId, string> = {
  sun: "hồng ngọc", moon: "ngọc trai và đá mặt trăng", mars: "san hô đỏ", mercury: "ngọc lục bảo", jupiter: "sapphire vàng và topaz vàng",
  venus: "kim cương", saturn: "sapphire xanh và đá đen", rahu: "đá hessonite màu mật ong", ketu: "mắt mèo",
};

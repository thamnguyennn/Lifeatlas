// Hand-written reading atoms, part 14: the summary that opens every house page.
// The summary is made from atoms that already exist (the verdict line, the sign, where the lord stands, who sits inside) plus
// the lines below: one sentence that says what the two numbers mean together. Voice rules are in STYLE.md.
//
// Sources for the support lines: Bhava Bala measures the inner strength of the house itself; Ashtakavarga (SAV) measures how much
// the other planets lend it, which matters most when planets pass through it (P.V.R. Narasimha Rao, "Vedic Astrology: An Integrated
// Approach", ch. 12 and 15; P.S. Sastri, "Text Book of Scientific Hindu Astrology", ch. 28 and 31).

export type Strength = "strong" | "mid" | "weak";
export type Support = "low" | "mid" | "high";

/** What the two numbers say together. {dH} is the house in plain words. */
export const SUPPORT_SUMMARY: Record<Strength, Record<Support, string>> = {
  strong: {
    high: "Nhà này tự nó mạnh, lại được nhiều hành tinh hỗ trợ mỗi khi chúng đi qua, nên chuyện {dH} là chỗ bạn có thể dựa vào.",
    mid: "Nhà này tự nó mạnh và được hỗ trợ ở mức vừa phải, nên chuyện {dH} khá vững.",
    low: "Nhà này tự nó mạnh nhưng ít được hành tinh hỗ trợ khi chúng đi qua, nên nền thì vững, còn chuyện {dH} phần lớn do chính bạn tạo ra.",
  },
  mid: {
    high: "Nhà này tự nó ở mức trung bình, nhưng được nhiều hành tinh hỗ trợ khi chúng đi qua, nên chuyện {dH} dễ tiến triển khi gặp đúng thời điểm.",
    mid: "Nhà này ở mức trung bình cả về sức của chính nhà lẫn sự hỗ trợ, nên chuyện {dH} đi theo công sức bạn bỏ ra.",
    low: "Nhà này tự nó ở mức trung bình và ít được hành tinh hỗ trợ khi chúng đi qua, nên chuyện {dH} cần bạn bỏ công đều đặn và kiên nhẫn.",
  },
  weak: {
    high: "Nhà này tự nó không nổi bật, nhưng được nhiều hành tinh hỗ trợ khi chúng đi qua, nên chuyện {dH} thường khá lên khi hoàn cảnh giúp bạn.",
    mid: "Nhà này tự nó còn yếu và sự hỗ trợ chỉ vừa phải, nên chuyện {dH} cần bạn chủ động hơn.",
    low: "Nhà này vừa yếu vừa ít được hỗ trợ, nên chuyện {dH} là chỗ cần bạn bỏ công đều đặn và đừng vội.",
  },
};

/** Houses 6, 8 and 12 are read the other way round for SAV: fewer points means fewer troubles. */
export const SUPPORT_SUMMARY_DUST: Record<Support, string> = {
  low: "Nhà này ít điểm hỗ trợ, và với một nhà khó thì điều đó là nhẹ nhõm: chuyện {dH} ít khi gây rắc rối lớn.",
  mid: "Nhà này có số điểm trung bình, nên chuyện {dH} có lúc nặng lúc nhẹ và phần nhiều tùy cách bạn đón nó.",
  high: "Nhà này nhiều điểm hỗ trợ, và với một nhà khó thì điều đó nghĩa là chuyện {dH} dễ kéo bạn vào nhiều việc hơn, nên hãy chia sức cho đều.",
};

/** A house with nobody in it and nobody looking at it: one line for the summary. */
export const SUMMARY_EMPTY = "Chưa có hành tinh nào ngồi trong nhà này, nên chuyện {dH} chạy theo {lord}.";

/** When several planets sit in the house, the summary reads one in full and only names the rest. */
export const SUMMARY_OTHERS = "Cùng ngồi ở nhà này còn có {list}; mỗi hành tinh được nói riêng ở phần bên dưới.";

// Sign-on-house texts and the short titles live in house-voice.ts (new voice, house by house); house pages import them from here.
export { SIGN_ON_HOUSE_DEEP, LORD_IN_TITLE } from "./house-voice.ts";

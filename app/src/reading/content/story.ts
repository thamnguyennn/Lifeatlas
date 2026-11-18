// Hand-written reading atoms, part 16: the connecting sentences of a house told as one story.
// The three-beat atoms (cung, hành tinh cai quản, hành tinh trong nhà) are cut into their beats and put together by the composer in src/reading/story.ts.
// These are the joints between them: how the planet that rules the house is placed, how it stands to the planet inside, who is strong or weak.
// Sources: Parashara's rules for the five-fold friendship, dignity and combustion (see SOURCES.md, "Luận nhà thành một câu chuyện").

/** Opens the paragraph about the lord. {lord} {p} house where it sits, {tagP} what that house is about, {text} the lord's first beat. */
export const STORY_LORD_LINK = "{lord} cai quản nhà này và đang đứng ở nhà {p} ({tagP}), nên {text}";
export const STORY_LORD_HOME = "{lord} cai quản nhà này và đang ngồi ngay trong nhà của mình, nên {text}";

/** The state of a planet that matters for the story. {x} planet. */
export const STORY_STATE = {
  strong: "{x} đang ở vị trí mạnh của nó, nên điều trên đi khá thẳng.",
  enemy: "{x} đang ở cung của một hành tinh không thân, nên điều trên hay gặp cản trở.",
  weak: "{x} đang ở vị trí yếu nhất của nó, nên điều trên cần thêm công sức và sự kiên trì.",
  combust: "{x} đứng quá gần Mặt Trời nên tiếng nói riêng của nó bị lấn át, và phần thực tế của điều trên dễ yếu đi.",
  retro: "{x} đang nghịch hành, nên điều trên hay quay lại nhiều lần rồi mới đi tới.",
};

/** How the lord of the house regards a planet that sits inside it. {lord} {x}. */
export const STORY_REL = {
  great: "{lord} xem {x} là bạn thân, nên hai bên chạy cùng hướng và đỡ nhau.",
  friend: "{lord} xem {x} là bạn, nên hai bên làm việc cùng hướng.",
  neutral: "{lord} và {x} không thân cũng không thù, nên mỗi bên làm phần của mình.",
  enemy: "{lord} xem {x} là không thân, nên màu của hai bên dễ kéo về hai hướng.",
  great_enemy: "{lord} xem {x} là đối nghịch cả về bản chất lẫn vị trí, nên hai bên dễ giằng co.",
};

/** Two planets in the same house. {a} {b}. */
export const STORY_TOGETHER = "{a} và {b} cùng ngồi trong nhà này, nên màu của hai sao trộn vào nhau: những gì một sao mang đến, sao kia cũng chạm vào.";
export const STORY_MANY = "Trong nhà còn có {list}; mỗi sao được nói riêng ở phần bên dưới.";

/** An empty house. {dH} {lord} {sign}. */
export const STORY_EMPTY =
  "Chưa có hành tinh nào ngồi trong nhà này, nên chuyện {dH} chạy theo {lord}, và màu của nó đến chủ yếu từ cung {sign} cùng vị trí của {lord}.";

/** What the person looks for in this part of life, gathered from the sign, the ruling planet and the planets inside. {list}. */
export const STORY_SEEK = "Điều bạn đang tìm ở đây là {list}.";

/** The price and how others see it, which the beats of sign, lord and planet inside are put together into. */
export const STORY_COST_ONE = "Cái giá là {a}.";
export const STORY_COST_MANY = "Cái giá là {a}. Thêm nữa, {b}.";
export const STORY_VIEW_ONE = "Người ngoài thấy {a}.";
export const STORY_VIEW_MANY = "Người ngoài thấy {first}, mà cũng thấy {rest}.";

/** Who looks at the house, one clause, then what the numbers add. */
export const STORY_LOOK_LEAD = "Về những ánh nhìn đổ vào nhà này:";

// ---------------------------------------------------------------- when the house lights up

export const STORY_NEXT_INTRO = "Nhà này sáng lên rõ nhất khi hành tinh cai quản hoặc hành tinh ngồi trong nó nắm quyền. Các mốc sắp tới:";
export const STORY_NEXT_MAHA = "Đại vận {p} ({why}), từ {from} đến {to}, tuổi {a} đến {b}.";
export const STORY_NEXT_ANTAR = "Tiểu vận {p} ({why}), từ {from} đến {to}, trong đại vận {m}.";
export const STORY_NEXT_NOW = " Giai đoạn này đang chạy.";
export const STORY_NEXT_APPROX = " Mốc gần đúng.";
/** What tends to happen then, in the planet's own events, tied to the house. */
export const STORY_NEXT_HINT = " Lúc đó, chuyện như {e1} hay {e2} dễ gắn với chuyện {dH}.";
export const STORY_NEXT_NONE =
  "Trong hai mươi năm tới, hành tinh cai quản và các hành tinh trong nhà này không nắm giai đoạn nào đủ chắc để nói. Chuyện {dH} khi đó đi theo nhịp của các sao chậm đi qua nhà.";

/**
 * What the old texts say each house shows in daily life when it is strong and when it is weak.
 * Source: the notebook "Chiêm tinh học", answer of 17/11/2026 (Brihat Parashara Hora Shastra; Light on Life; Hindu Predictive Astrology;
 * Astrology of the Seers; the notebook's house-lord notes). Retold gently; illness, accidents and legal trouble are left out on purpose.
 */
export const HOUSE_CLASSIC: { up: string; down: string }[] = [
  { up: "bạn tự tin, đàng hoàng và đi đâu cũng dễ tạo được thiện cảm", down: "những năm trẻ dễ phải bôn ba và cần thời gian mới vững lòng tin vào mình" },
  { up: "tiền tích lũy vững, ăn nói có duyên và gia đình là chỗ dựa", down: "tiền khó giữ, lời nói dễ bị hiểu lầm và người nhà hay xa cách" },
  { up: "bạn dám làm, khéo tay hoặc viết giỏi, tự lực đi lên và anh chị em giúp nhau", down: "dễ nản khi gặp khó và quan hệ với anh chị em, hàng xóm hay lạnh nhạt" },
  { up: "lòng an, nhà cửa khang trang, được mẹ thương và dễ có nhà đất, xe cộ", down: "trong lòng hay bồn chồn, nhà cửa hay xáo trộn và chuyện nhà đất cần cẩn thận" },
  { up: "học hành, thi cử thuận, con cái ngoan và đầu tư nhạy", down: "tình duyên dễ vỡ mộng, hay lo vì con cái và đầu cơ dễ thua" },
  { up: "bạn tháo vát, xử lý khủng hoảng giỏi, trả dần được nợ và vượt qua đối thủ", down: "công việc chèn ép, nợ nần làm đau đầu và dễ gặp người chơi xấu" },
  { up: "bạn đời thấu hiểu, hôn nhân hòa thuận và hợp tác làm ăn suôn sẻ", down: "vợ chồng hay bất đồng và đối tác dễ thất hứa" },
  { up: "bạn vững vàng sau biến cố, trực giác nhạy và có thể được hưởng tài sản chung hay thừa kế", down: "đời sống có những cú sốc bất ngờ và chuyện tiền chung dễ căng" },
  { up: "may mắn đến đúng lúc, được cha và thầy nâng đỡ, học cao và đi xa đều thuận", down: "làm gì cũng thiếu chút may, dễ bất đồng với cha và việc học cao, đi xa gặp trắc trở" },
  { up: "sự nghiệp lên vững, có tiếng trong nghề và được giao trách nhiệm lớn", down: "công việc bấp bênh, hay đổi việc và công sức chưa được ghi nhận" },
  { up: "tiền đến từ nhiều hướng, bạn bè tốt giúp đỡ và những dự định lớn dần thành", down: "thu nhập lên xuống, bạn bè có khi làm hao tiền và ước mơ khó thành" },
  { up: "chi tiêu có chừng mực, thấy bình yên khi ở một mình và có thể thành công khi sống ở nước ngoài", down: "tiền ra ngoài tầm tay, giấc ngủ không yên và hay thấy cô đơn" },
];
export const HOUSE_CLASSIC_LINE = {
  good: "Sách cổ tả nhà này khi mạnh: {up}.",
  hard: "Sách cổ nhắc rằng khi nhà này yếu, {down}; biết trước để chủ động là cách sách khuyên.",
  mixed: "Sách cổ tả hai mặt của nhà này: khi mạnh thì {up}; khi yếu thì {down}.",
};

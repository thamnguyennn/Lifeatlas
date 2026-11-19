// Hand-written reading atoms, part 15: a period of the dasha told as one story instead of a list of facts.
// A period is read in five steps, the way a Jyotishi reads a sub-period (Parashari method, see SOURCES.md "Đại vận và tiểu vận"):
//   1. what the planet stands for (its life events);  2. where it sits and which houses it rules;
//   3. how strong it is and who sits with it or looks at it;  4. how it stands to the period that holds it;  5. what to watch and what to do.
// Every sentence says one thing and uses plain words. {a} = the planet of this period, {m} = the planet of the period that holds it.
import type { GrahaId } from "../../engine/constants.ts";

export interface DashaPlanet {
  /** One sentence: what this planet brings into a period. */
  about: string;
  /** Things that tend to happen, as short phrases that follow "hay gặp: ". */
  events: string[];
  /** Where people usually stumble in this planet's period. */
  watch: string;
  /** One small thing to do. */
  doing: string;
}

export const DASHA_PLANET: Record<GrahaId, DashaPlanet> = {
  sun: {
    about: "Mặt Trời là sao của vị thế, uy tín và quyền hạn, nên giai đoạn của nó đặt bạn vào chỗ phải đứng ra, được nhìn thấy và chịu trách nhiệm.",
    events: ["được giao hoặc tự nhận một vai trò lớn hơn", "làm việc với cấp trên, cơ quan nhà nước hay người có quyền", "chuyện của cha hoặc người đàn ông lớn tuổi trong nhà", "được ghi nhận, hoặc bị soi kỹ về việc mình làm"],
    watch: "cái tôi bị chạm đến và những cuộc tranh quyền; tim và mắt cũng nên được để ý",
    doing: "nhận một việc bạn chịu trách nhiệm trọn vẹn, và nghe ý kiến trái chiều trước khi quyết.",
  },
  moon: {
    about: "Mặt Trăng là sao của cảm xúc, của mẹ và của cảm giác an toàn, nên giai đoạn của nó kéo chuyện lòng và chuyện nhà lên trước chuyện công việc.",
    events: ["tâm trạng lên xuống rõ hơn", "chuyện của mẹ hoặc người từng chăm sóc bạn", "đổi chỗ ở, sửa nhà hoặc đi lại nhiều", "làm việc với đám đông, khách hàng hay công chúng"],
    watch: "để tâm trạng kéo theo quyết định và ngủ thất thường",
    doing: "giữ giờ ngủ và giờ ăn đều, và đợi cảm xúc lắng xuống rồi mới quyết việc lớn.",
  },
  mars: {
    about: "Sao Hỏa là sao của hành động, sức bật và sự tranh đấu, nên giai đoạn của nó thúc bạn làm ngay thay vì chờ.",
    events: ["bắt đầu một việc cần sức và quyết tâm", "chuyện nhà đất, xây dựng hoặc sửa chữa", "tranh chấp hay cạnh tranh với người khác", "chuyện của anh chị em", "việc kỹ thuật hoặc việc cần tay nghề"],
    watch: "nóng nảy, liều và va chạm; cẩn thận chấn thương",
    doing: "dồn sức vào một việc đáng làm, và vận động cơ thể để xả bớt cái nóng.",
  },
  mercury: {
    about: "Sao Thủy là sao của trí óc, lời nói và việc buôn bán, nên giai đoạn của nó rộn lên chuyện học, chuyện trao đổi và giấy tờ.",
    events: ["học thêm hoặc theo một khóa mới", "viết, nói, dạy hay trình bày trước người khác", "buôn bán, thương lượng, ký hợp đồng", "những chuyến đi để học hoặc để làm việc", "chuyện của anh chị em hoặc người trẻ hơn bạn"],
    watch: "phân tán, đầu óc quá tải và ngủ ít",
    doing: "chọn một hai việc có điểm kết rõ ràng, thay vì nhiều việc nhỏ cùng lúc.",
  },
  jupiter: {
    about: "Sao Mộc là sao của hiểu biết, niềm tin và cơ hội mở ra, nên giai đoạn của nó thường rộng đường hơn các giai đoạn khác.",
    events: ["học lên cao hoặc gặp một người thầy", "chuyện con cái hoặc việc dạy người khác", "tiền và cơ hội tăng thêm", "chuyện pháp lý hoặc giấy tờ lớn", "điều bạn tin, hay cách bạn nhìn đời, đổi đi"],
    watch: "ôm quá nhiều, hứa quá tay và tăng cân",
    doing: "chọn điều bạn thật sự muốn cam kết rồi mới nhận thêm.",
  },
  venus: {
    about: "Sao Kim là sao của tình cảm, sự hòa hợp và cái đẹp, nên giai đoạn của nó kéo chuyện người với người và chuyện thoải mái lên cao.",
    events: ["một mối quan hệ mới hoặc sâu hơn", "chuyện hôn nhân và hợp tác", "chi tiền cho nhà cửa, xe cộ hay làm đẹp", "việc liên quan đến nghệ thuật hoặc thẩm mỹ", "thu nhập đến từ quan hệ hoặc dịch vụ"],
    watch: "ham thoải mái, chiều bản thân và né điều khó",
    doing: "dành thời gian cho người bạn thật sự quý, và để ý những khoản chi theo cảm giác.",
  },
  saturn: {
    about: "Sao Thổ là sao của kỷ luật, thời gian và trách nhiệm, nên giai đoạn của nó đòi làm việc đều và kiên nhẫn, kết quả đến chậm nhưng bền.",
    events: ["gánh thêm trách nhiệm hoặc một công việc nặng hơn", "xây một thứ phải làm lâu mới thành", "bị thử độ bền trong công việc", "chuyện sức khỏe kéo dài như xương khớp", "những việc bị chậm lại để bạn làm cho chắc"],
    watch: "khắt khe với mình, lạnh lùng và kiệt sức",
    doing: "chia việc lớn thành những bước nhỏ đều đặn, và dành chỗ để nghỉ.",
  },
  rahu: {
    about: "Rahu là sao của khao khát, của cái lạ và những lối đi chưa có sẵn, nên giai đoạn của nó kéo bạn ra khỏi khuôn quen.",
    events: ["cơ hội đến nhanh và bất ngờ", "chuyện nước ngoài, người ở xa hoặc người khác văn hóa", "công nghệ hoặc một cách làm mới", "tham vọng lớn lên", "lúc lên nhanh rồi lúc chênh vênh"],
    watch: "mơ hồ và bị cuốn theo điều sáng lóa",
    doing: "kiểm chứng điều hấp dẫn trước khi dấn sâu, và giữ một chỗ neo quen thuộc.",
  },
  ketu: {
    about: "Ketu là sao của buông bỏ và quay về với chính mình, nên giai đoạn của nó làm nhiều thứ từng quan trọng nhạt đi.",
    events: ["chán điều từng say mê", "một cuộc chia xa hoặc một lần buông", "thích ở một mình, nghiên cứu hoặc tĩnh tâm", "thay đổi đến bất ngờ"],
    watch: "rút lui quá nhiều và mất phương hướng",
    doing: "buông từng thứ một, và giữ lại một người để nói thật.",
  },
};

// ---------------------------------------------------------------- how the planet stands in the chart

/** Sign dignity, in the words of a period. {a} planet. */
export const DASHA_DIGNITY = {
  strong: "{a} đang ở vị trí mạnh của nó, nên những chuyện trên đi khá thẳng.",
  enemy: "{a} đang ở cung của một hành tinh không thân, nên chuyện của nó đến chậm và hay gặp cản trở.",
  weak: "{a} đang ở vị trí yếu nhất của nó, nên kết quả đến chậm, cần thêm công sức và sự kiên trì, đôi khi phải đi đường vòng hoặc nhờ người khác.",
  combust: "{a} đứng quá gần Mặt Trời nên tiếng nói riêng của nó bị lấn át; phần thực tế của những chuyện trên dễ yếu đi.",
  retro: "{a} đang nghịch hành, nên chuyện của nó hay quay lại nhiều lần rồi mới đi tới.",
};

/** The house the planet sits in, as a place to act from. {p} house number. */
export const DASHA_SEAT = {
  dusthana: "{a} đứng ở nhà {p}, nên chuyện của nó thiên về phía kín đáo: nhiều nghĩa vụ, hao tổn và việc làm phía sau hơn là ra mặt.",
  trikona: "{a} đứng ở nhà {p}, một nhà được đỡ, nên chuyện của nó có chỗ dựa.",
  kendra: "{a} đứng ở nhà {p}, một trụ cột của lá số, nên có đủ chỗ đứng để hành động.",
  upachaya: "Ở nhà {p}, {a} đi theo kiểu làm lâu mới thấy kết quả: công sức bỏ ra được đền dần theo thời gian.",
};

/** Sitting in the same sign as another planet. {a} this planet, {x} the other, {gift} what it adds, {shadow} what it costs. */
export const DASHA_COMPANY = {
  benefic: "{a} ngồi cùng {x}, nên giai đoạn này mang thêm màu của {x}: {gift}.",
  malefic: "{a} ngồi cùng {x}, nên giai đoạn này mang thêm màu của {x}: {gift}, kèm cái giá là {shadow}.",
};

/** Being looked at by another planet. */
export const DASHA_LOOK = {
  benefic: "{x} nhìn vào {a}, nên giai đoạn này được nâng đỡ thêm.",
  malefic: "{x} nhìn vào {a}, nên giai đoạn này bị thử thách thêm và cần bạn kiên nhẫn hơn.",
};

/** A planet with no sign of its own (Rahu, Ketu) is read through the planet that rules the sign it stands in. {a} node, {ref} ruler, {refRules} houses. */
export const DASHA_NODE =
  "{a} không cai quản nhà nào, nên mình đọc nó qua {ref}, hành tinh cai quản cung nó đang đứng. {ref} cai quản {refRules}, nên những chuyện đó cũng được kéo vào.";

/** After "{a} còn cai quản nhà {h} ({tag}), nên ..." */
export const DASHA_RULES_LEAD = "{a} cai quản {rules}, nên";
export const DASHA_SIT_LEAD = "Vì {a} ngồi ở nhà {p},";

// ---------------------------------------------------------------- how the period stands to the one that holds it

/** The five-fold friendship of the planet that holds the period toward the planet held. Natural and temporary friendship are added. */
export const DASHA_FRIEND = {
  great: "{m} xem {a} là bạn thân, cả theo bản chất lẫn theo vị trí trong lá số của bạn, nên {a} đẩy việc của {m} đi tiếp.",
  friend: "{m} xem {a} là bạn, nên {a} thường đẩy việc của {m} đi tiếp.",
  neutral: "{m} và {a} không thân cũng không thù, nên kết quả còn tùy vào phần còn lại của lá số.",
  enemy: "{m} xem {a} là không thân, nên {a} dễ cắt ngang việc của {m}.",
  great_enemy: "{m} xem {a} là đối nghịch cả về bản chất lẫn vị trí trong lá số của bạn, nên {a} dễ làm gián đoạn việc của {m}, và hai việc hay kéo bạn về hai hướng.",
};

export type PairClass = "same" | "best" | "good" | "dharma" | "facing" | "limited" | "limited12" | "hard" | "hard8";

/** Where the sub-period planet stands counted from the planet that holds it (1 = same sign), in plain words. */
export const DASHA_PAIR: Record<PairClass, string> = {
  same: "{a} và {m} cùng ngồi một cung, nên chủ đề của hai sao chồng lên nhau và được nhấn đậm.",
  best: "Về vị trí, {a} đứng ở thế phát triển so với {m}: thường có thêm thu nhập và tiến bộ, nhưng kết quả đi theo công sức bạn bỏ ra, nên giai đoạn này đòi bạn chủ động và chịu khó.",
  good: "Về vị trí, {a} và {m} đứng ở thế thuận: giai đoạn này thường mang lại sự hài lòng và tiếng tốt, theo đúng những chuyện hai sao phụ trách.",
  dharma: "Về vị trí, {a} và {m} đứng ở thế trung tính: kết quả không đến nhanh, và chỉ tốt khi bạn làm việc chăm chỉ và sống đúng nguyên tắc của mình.",
  facing: "Về vị trí, {a} và {m} đứng đối diện nhau: hai bên cần cùng cố gắng, và nếu một bên không đáp lại thì kết quả kém. Giai đoạn này dạy bạn cân bằng giữa cho đi và nhận lại.",
  limited: "Về vị trí, {a} và {m} đứng ở thế bị giới hạn: {a} chỉ giúp được trong mức {m} cho phép. Dễ lưỡng lự và khó giữ lời hứa, nên đừng cam kết lớn vội, kể cả chuyện hôn nhân hay hợp tác dài hạn.",
  limited12: "Về vị trí, {a} và {m} đứng ở thế bị giới hạn: {a} chỉ giúp được trong mức {m} cho phép. Dễ lưỡng lự và khó giữ lời hứa, nên đừng cam kết lớn vội. Thế này cũng có thể là việc ở nước ngoài, việc làm phía sau hoặc chủ động rút lui, bên cạnh những lúc hao tổn.",
  hard: "Về vị trí, {a} và {m} đứng ở thế khó: hai sao như kéo nhau về hai hướng, nên có thể gặp cạnh tranh và phản đối. Kết quả đến chậm và mới được một phần, kiên trì thì phần còn lại đến về sau.",
  hard8: "Về vị trí, {a} và {m} đứng ở thế khó nhất: hai sao như kéo nhau về hai hướng, nên có thể gặp cạnh tranh, phản đối và những thay đổi đột ngột. Kết quả đến chậm và mới được một phần; giữ tinh thần vững thì phần còn lại đến về sau.",
};

/** A period of the same planet as the one that holds it. */
export const DASHA_SELF = "{a} vừa giữ giai đoạn lớn vừa giữ giai đoạn nhỏ này, nên mọi điều đã nói ở trên được nhấn đậm: đây là phần cốt lõi của cả giai đoạn lớn.";

// ---------------------------------------------------------------- the rest

export const DASHA_EVENTS_LEAD = "Những chuyện hay gặp: {list}.";
export const DASHA_WATCH = "Điều dễ vấp: {watch}. Việc nên làm: {doing}";

/** The overall colour of the period and which way it goes, as one line each. Trend is worked out when the reader opens the period. */
export const DASHA_TONE_LINE: Record<"good" | "mixed" | "hard", string> = {
  good: "Nhìn chung, đây là khoảng thời gian nhiều thuận lợi.",
  mixed: "Nhìn chung, khoảng thời gian này có thuận có khó.",
  hard: "Nhìn chung, khoảng thời gian này đòi nhiều kiên nhẫn hơn.",
};

export const DASHA_TREND: Record<"up" | "flat" | "down", string> = {
  up: "Càng về cuối, các sao chậm (Sao Mộc, Sao Thổ) càng đi qua những chỗ hợp với bạn, nên mọi việc nhẹ dần, nửa sau dễ hơn nửa đầu.",
  flat: "Từ đầu đến cuối, các sao chậm (Sao Mộc, Sao Thổ) đi qua những chỗ ngang nhau, nên nhịp chung khá đều.",
  down: "Càng về cuối, các sao chậm (Sao Mộc, Sao Thổ) càng đi vào những chỗ khó, nên nửa sau cần nhiều kiên nhẫn hơn nửa đầu.",
};
export const DASHA_TREND_LABEL: Record<"up" | "flat" | "down", string> = { up: "tốt dần", flat: "khá đều", down: "nặng dần" };

/**
 * What the old texts say a planet's period brings when the planet stands well (up) and when it is weak or hurt (down).
 * Source: the notebook "Chiêm tinh học", answer of 17/11/2026 drawing on Brihat Parashara Hora Shastra and
 * "Hindu Predictive Astrology" (B. V. Raman). Retold in plain words; health items are left out on purpose.
 */
export const DASHA_CLASSIC: Record<GrahaId, { up: string; down: string }> = {
  sun: { up: "được cấp trên nâng đỡ, dễ lên vị trí hoặc được biết tên hơn; tiền bạc khá lên, có khi thu lại được khoản đã mất; chuyến đi công tác có ích, gặp người có quyền", down: "dễ va chạm với cấp trên hay cơ quan; kế hoạch chững lại, hao tiền; cha hoặc người lớn trong nhà cần được quan tâm hơn, nội bộ dễ bất hòa vì cái tôi" },
  moon: { up: "buôn bán và việc phục vụ người khác thuận; được mọi người ủng hộ; nhà cửa êm, mẹ khỏe, tình cảm gia đình gần lại; những chuyến đi xa, nhất là gần sông nước hay nơi yên tĩnh", down: "tiền vào ra thất thường, tâm trạng lên xuống; chuyện với mẹ hay với người thân dễ căng; hay đổi chỗ ở hoặc đi lại trong lúc lòng chưa yên" },
  mars: { up: "ý chí mạnh, dám làm và thắng việc khó; thuận với đất đai, nhà cửa, kỹ thuật hay vị trí quản lý; anh chị em giúp sức", down: "nóng vội dễ thiệt, có thể vướng tranh chấp hay chuyện đất đai, tài sản; cãi nhau với anh em hay người bạn đời; đi đường nên cẩn thận hơn" },
  mercury: { up: "buôn bán, ký kết, viết lách và ăn nói đều có lợi; học nhanh, thi tốt; những chuyến đi ngắn ngày đem lại việc; bạn bè hiểu biết giúp đỡ", down: "tính sai, giấy tờ hay hợp đồng dễ rắc rối; nói chưa kỹ mà mất lòng; học dễ dở dang, đi lại dễ thất lạc đồ, giấy tờ" },
  jupiter: { up: "công việc lên, tiền dồi dào, được thầy hoặc người trên trọng dụng; nhà có tin vui như cưới hỏi, con cái; học lên cao, có thể đi học xa hoặc đi đến nơi tôn nghiêm", down: "phán đoán chưa trúng nên hao tiền, dự án mở rộng không như ý; lo nghĩ vì con cái hoặc bất đồng với thầy, với cha; học hành gián đoạn, đi xa tốn mà ít kết quả" },
  venus: { up: "tiền vào từ cái đẹp, nghệ thuật, dịch vụ; mua được đồ giá trị, xe cộ; tình duyên nở, có thể cưới hỏi, vợ chồng hòa thuận; đi chơi, nghỉ ngơi nhiều niềm vui", down: "tiêu nhiều cho thú vui, dễ dính chuyện tiền trong tình cảm; thất vọng hay ghen tuông trong quan hệ; mải vui mà bỏ dở việc học, việc làm" },
  saturn: { up: "sự nghiệp xây chắc từng bước, quản người giỏi, tích lũy bền; nhận thêm trách nhiệm với gia đình; học sâu một nghề, đi xa làm việc có mục tiêu rõ", down: "việc chậm, áp lực nặng, làm nhiều mà nhận ít; xa người thân hoặc gánh nợ nần chung của gia đình; phải đi xa trong cảnh vất vả" },
  rahu: { up: "đột phá bất ngờ, tiếng tăm ra tới nước ngoài; kiếm tiền nhanh từ cái mới, công nghệ, giao thương xa; quen người có thế; học nhanh cái lạ, đi nước ngoài thuận", down: "dễ ảo tưởng hoặc bị lừa trong chuyện tiền; dính thị phi; trong nhà bất an, nghi ngờ trong tình cảm; đi xa gặp trục trặc giấy tờ" },
  ketu: { up: "thành tựu bất ngờ ở việc nghiên cứu riêng hay việc cần đào sâu; tiền tự đến mà không phải giành; trực giác mở; những chuyến đi đến nơi vắng, nơi tu tập", down: "chán, muốn bỏ việc đang làm; mất đồ vì sơ ý; thấy cô đơn, xa người thân; đi lại dễ lạc hướng hay ngã xe" },
};

/** How the classic picture is introduced; {p} is the planet. */
export const DASHA_CLASSIC_LINE = {
  up: "Sách cổ tả giai đoạn của {p} khi nó đứng vững như trong lá số này: {up}.",
  down: "Sách cổ nhắc rằng khi {p} yếu, giai đoạn của nó dễ có: {down}.",
  mixed: "Sách cổ tả hai mặt của giai đoạn {p}, và lá số của bạn có cả hai. Mặt thuận: {up}. Mặt khó: {down}.",
};

/** The houses the planet of the period looks at also come alive (notebook, 17/11/2026: Astrology of the Seers; Light on Life; mahadasha.pdf). */
export const DASHA_LOOKS = "{a} còn nhìn tới {list}, nên những chuyện đó cũng hay được động tới trong giai đoạn này.";

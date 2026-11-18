// Hand-written reading atoms, part 15: the sky as it stands on a given day, read from the person's own Moon (Chandra Lagna) and Lagna (Udaya Lagna).
// Life Atlas v3.0 — Explicitly separates and compares Chandra Lagna vs. Udaya Lagna Gochara.

export const SKY_INTRO =
  "Nếu Đại vận là mùa lớn của cuộc đời, thì chuyển động của các hành tinh trên bầu trời hiện tại (Gochara) là thời tiết từng ngày trong mùa đó. Truyền thống Parashara đọc Gochara qua hai thấu kính song song: tính từ Mặt Trăng lúc sinh (Chandra Lagna) để hiểu cảm nhận nội tâm, và tính từ Cung mọc (Udaya Lagna) để biết mảng đời sống thực tế nào đang chuyển động.";

export const MOON_LENS_INTRO =
  "Góc nhìn từ Mặt Trăng (Chandra Lagna) đo cách tâm trí và cảm xúc của bạn đón nhận thời cuộc, kết hợp cùng bảng điểm Ashtakavarga (0–8 điểm) của riêng từng hành tinh.";

export const LAGNA_LENS_INTRO =
  "Góc nhìn từ Cung mọc (Udaya Lagna) chỉ ra ngôi nhà thực tế nào trong 12 lĩnh vực đời sống đang đón hành tinh đi qua và đòi hỏi hành động cụ thể.";

/** Saturn counted from the natal Moon. Index = house - 1. */
export const SATURN_FROM_MOON: string[] = [
  "Sao Thổ đang đi qua đúng cung Mặt Trăng của bạn. Cảm xúc lắng sâu hơn thường lệ và cuộc sống mời gọi bạn bước sang một ngưỡng trưởng thành vững chãi hơn.",
  "Sao Thổ đang ở cung thứ hai tính từ Mặt Trăng của bạn. Tiền bạc, lời ăn tiếng nói và nếp sinh hoạt gia đình cần sự thu xếp chặt chẽ, chừng mực.",
  "Sao Thổ đang ở cung thứ ba tính từ Mặt Trăng, một vị trí thuận lợi cổ điển. Bạn có sức bền rõ rệt, dám bắt tay vào việc khó và tiến lên chắc chắn bằng nỗ lực.",
  "Sao Thổ đang ở cung thứ tư tính từ Mặt Trăng (truyền thống gọi là Kantaka Shani). Nhịp bình yên trong lòng và chuyện nhà cửa cần được chăm sóc kỹ, ưu tiên giữ nhịp nghỉ ngơi đều đặn.",
  "Sao Thổ đang ở cung thứ năm tính từ Mặt Trăng. Chuyện sáng tạo, tình cảm và các dự định cá nhân cần sự kiên nhẫn vun đắp thay vì thúc ép kết quả sớm.",
  "Sao Thổ đang ở cung thứ sáu tính từ Mặt Trăng, một vị trí thuận lợi cổ điển. Bạn đủ sức giải quyết dứt điểm những việc tồn đọng và vượt qua sức ép cạnh tranh bằng kỷ luật.",
  "Sao Thổ đang ở cung thứ bảy tính từ Mặt Trăng. Các mối quan hệ gắn kết và hợp tác đòi hỏi chữ tín cùng sự cam kết rõ ràng từ cả hai phía.",
  "Sao Thổ đang ở cung thứ tám tính từ Mặt Trăng (truyền thống gọi là Ashtama Shani). Đây là giai đoạn có những chuyển dịch sâu đòi hỏi bạn chăm sóc sức khỏe, giữ quỹ dự phòng và đi từng bước thận trọng.",
  "Sao Thổ đang ở cung thứ chín tính từ Mặt Trăng. Việc học hỏi và các kế hoạch đường dài tiến triển theo nhịp chậm mà chắc, rất hợp để củng cố nền tảng chuyên môn.",
  "Sao Thổ đang ở cung thứ mười tính từ Mặt Trăng. Khối lượng công việc và trách nhiệm tăng lên, giúp bạn khẳng định uy tín bền vững nếu giữ nhịp làm việc đều tay.",
  "Sao Thổ đang ở cung thứ mười một tính từ Mặt Trăng, một vị trí thuận lợi cổ điển. Công sức bạn bền bỉ gieo trồng trước đây bắt đầu kết trái thành thành quả và thu nhập ổn định.",
  "Sao Thổ đang ở cung thứ mười hai tính từ Mặt Trăng. Tâm trí cần nhiều khoảng lặng để nghỉ ngơi, dọn bớt những bận tâm cũ và chăm sóc giấc ngủ.",
];

/** Jupiter counted from the natal Moon. Index = house - 1. */
export const JUPITER_FROM_MOON: string[] = [
  "Sao Mộc đang đi qua đúng cung Mặt Trăng của bạn. Theo truyền thống, vị trí này làm tâm trí dễ ôm nhiều suy tính lớn; bạn nên chọn lọc mục tiêu trọng tâm trước khi nhận thêm trách nhiệm.",
  "Sao Mộc đang ở cung thứ hai tính từ Mặt Trăng, một vị trí thuận lợi cổ điển. Tài chính, lời nói và không khí gia đình có thêm sự nâng đỡ ấm áp.",
  "Sao Mộc đang ở cung thứ ba tính từ Mặt Trăng. Nhiều ý tưởng và việc đi lại cùng mở ra, vì vậy chọn một hướng ưu tiên sẽ giúp bạn tránh phân tán sức lực.",
  "Sao Mộc đang ở cung thứ tư tính từ Mặt Trăng. Tâm trí hướng nhiều về việc chăm chút mái ấm, củng cố chỗ dựa tinh thần và người thân trong nhà.",
  "Sao Mộc đang ở cung thứ năm tính từ Mặt Trăng, một vị trí thuận lợi cổ điển. Trí sáng tạo, việc học hỏi, tình cảm và con cái đón nhận luồng sinh khí tươi mới.",
  "Sao Mộc đang ở cung thứ sáu tính từ Mặt Trăng. Công việc thường nhật và nhịp sinh hoạt bận rộn hơn, hợp để bạn sắp xếp lại quy trình làm việc và chăm sóc cơ thể.",
  "Sao Mộc đang ở cung thứ bảy tính từ Mặt Trăng, một vị trí thuận lợi cổ điển. Các mối quan hệ đôi lứa và đối tác đồng hành trở nên cởi mở, tin cậy và giàu thiện chí.",
  "Sao Mộc đang ở cung thứ tám tính từ Mặt Trăng. Những câu hỏi chiều sâu hoặc chuyện tài chính chung cần được xem xét kỹ lưỡng và minh bạch.",
  "Sao Mộc đang ở cung thứ chín tính từ Mặt Trăng, một vị trí thuận lợi cổ điển. Tầm nhìn, việc học cao, người dẫn đường và những cơ hội mới mở rộng rõ rệt.",
  "Sao Mộc đang ở cung thứ mười tính từ Mặt Trăng. Công việc có thêm lời mời và trọng trách mới; giữ sự tập trung vào thế mạnh cốt lõi sẽ giúp bạn đứng vững.",
  "Sao Mộc đang ở cung thứ mười một tính từ Mặt Trăng, một vị trí thuận lợi cổ điển. Thành quả công việc, mạng lưới bạn bè và các dự định dài hạn được tiếp thêm lực đẩy.",
  "Sao Mộc đang ở cung thứ mười hai tính từ Mặt Trăng. Tâm hồn hướng về sự tĩnh lặng, nghiên cứu chuyên sâu hoặc những chuyến đi xa, đồng thời cần quản lý chi tiêu hợp lý.",
];

export const FAST_FROM_MOON: Record<"mars" | "rahu" | "ketu", { good: string; hard: string }> = {
  mars: {
    good: "Sao Hỏa đang {pos}, một vị trí thuận lợi tính từ Mặt Trăng. Sức bật và lòng quyết tâm của bạn có đất dụng võ để giải quyết gọn các việc khó.",
    hard: "Sao Hỏa đang {pos} tính từ Mặt Trăng. Nhịp cảm xúc dễ gấp gáp hơn thường lệ, nên hướng nguồn nhiệt lượng này vào vận động hoặc công việc cụ thể sẽ rất tốt.",
  },
  rahu: {
    good: "Rahu đang {pos}, một vị trí thuận lợi tính từ Mặt Trăng. Sự nhạy bén với cái mới giúp bạn nắm bắt được những cơ hội mở rộng đáng chú ý.",
    hard: "Rahu đang {pos} tính từ Mặt Trăng. Tâm trí dễ bị cuốn theo nhiều luồng thông tin hoặc kỳ vọng lớn, nên bạn hãy giữ nhịp kiểm chứng thực tế trước mỗi quyết định.",
  },
  ketu: {
    good: "Ketu đang {pos}, một vị trí thuận lợi tính từ Mặt Trăng. Trực giác của bạn sáng rõ và bạn dễ dàng buông nhẹ những việc đã hết giá trị.",
    hard: "Ketu đang {pos} tính từ Mặt Trăng. Đôi lúc bạn thấy hơi tách biệt hoặc giảm hứng thú với những ồn ào chung quanh, rất hợp để lắng lại quan sát.",
  },
};

export const VI_ORDINAL = ["", "nhất", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín", "mười", "mười một", "mười hai"];
export const FROM_MOON_POS = (h: number) => (h === 1 ? "đi qua ngay cung Mặt Trăng của bạn" : `đi qua cung thứ ${VI_ORDINAL[h]} tính từ Mặt Trăng`);

export const SADE_SATI = {
  what: "Sade Sati là chu kỳ khoảng bảy năm rưỡi khi Sao Thổ lần lượt đi qua cung liền trước, cung chứa Mặt Trăng và cung liền sau Mặt Trăng lúc sinh. Truyền thống Jyotish xem đây là giai đoạn rèn luyện độ chín nội tâm, giúp bạn gạn lọc những gì bền vững nhất cho đường dài.",
  rising: {
    title: "Sade Sati: chặng mở đầu (cung thứ 12 từ Mặt Trăng)",
    text: "Sao Thổ đang đi qua cung liền trước Mặt Trăng lúc sinh của bạn, mở đầu chu kỳ Sade Sati. Nhịp sống bắt đầu nhắc bạn dọn dẹp lại những thói quen gây hao sức, thu xếp tài chính gọn gàng và chuẩn bị nền tảng cho chặng trưởng thành kế tiếp.",
  },
  peak: {
    title: "Sade Sati: chặng trọng tâm (ngay trên cung Mặt Trăng)",
    text: "Sao Thổ đang đi qua đúng cung Mặt Trăng lúc sinh của bạn — chặng sâu nhất của Sade Sati. Cảm xúc và trách nhiệm cá nhân đều đòi hỏi sự nghiêm túc; giữ nhịp sinh hoạt đều đặn, chia sẻ với người tin cậy và đi từng bước nhỏ đều đặn sẽ giúp bạn vững vàng.",
  },
  setting: {
    title: "Sade Sati: chặng khép lại (cung thứ 2 từ Mặt Trăng)",
    text: "Sao Thổ đang đi qua cung liền sau Mặt Trăng lúc sinh, đưa chu kỳ Sade Sati về chặng cuối. Sức ép tâm lý dịu dần để nhường chỗ cho việc củng cố tài chính, gia đình và giữ lại những giá trị thực chất bạn đã rèn được.",
  },
  none: {
    title: "Sade Sati: hiện nằm ngoài chu kỳ",
    text: "Sao Thổ hiện đứng ngoài ba cung quanh Mặt Trăng lúc sinh của bạn, nên tâm trí không chịu sức ép của Sade Sati. Chu kỳ kế tiếp chỉ bắt đầu khi Sao Thổ bước vào cung {sign}.",
  },
};

export const SPECIALS = {
  ashtama: { title: "Ashtama Shani: Sao Thổ ở cung thứ tám từ Mặt Trăng", text: "Theo góc nhìn từ Mặt Trăng, Sao Thổ đang đi qua cung thứ tám (Ashtama Shani), nhắc bạn ưu tiên chăm sóc sức khỏe, giữ khoản dự phòng và làm việc thận trọng." },
  kantaka: { title: "Kantaka Shani: Sao Thổ ở cung thứ tư từ Mặt Trăng", text: "Theo góc nhìn từ Mặt Trăng, Sao Thổ đang đi qua cung thứ tư (Kantaka Shani), hướng sự chú ý của bạn về việc giữ gìn sự bình yên trong nhà và chăm sóc người thân." },
  jupiterGood: { title: "Gochara Sao Mộc thuận chiều từ Mặt Trăng", text: "Sao Mộc đang đứng ở vị trí thuận lợi so với Mặt Trăng lúc sinh, tạo thêm khoảng sáng tinh thần, sự lạc quan và duyên gặp được người nâng đỡ." },
};

export const HIT_EFFECT: Record<"saturn" | "jupiter" | "rahu" | "ketu" | "mars", string> = {
  saturn: "kiểm nghiệm độ bền và đòi hỏi sự chín chắn thực chất",
  jupiter: "mở rộng tầm nhìn và tiếp thêm sự nâng đỡ",
  rahu: "khuếch đại khát vọng và thúc đẩy sự đổi mới",
  ketu: "tinh giản những điều rườm rà để chạm tới chiều sâu",
  mars: "tiếp thêm sức bật và thúc giục hành động nhanh",
};

export const HIT_TEXT =
  "{t} trên bầu trời hiện tại đang {kind} với {n} trong lá số gốc của bạn (độ lệch khoảng {orb} độ). Vì {n} gắn với {role}, sự tiếp xúc này đang {effect}.";
export const HIT_LAGNA_ROLE = "chính bản thân bạn và phong thái bước vào đời";

export const DAY_THEME: string[] = [
  "Hôm nay Mặt Trăng đi qua nhà 1 (tính từ cung mọc), nên tâm trí hướng về việc chăm sóc bản thân và lắng nghe cảm nhận trực tiếp của cơ thể.",
  "Hôm nay Mặt Trăng đi qua nhà 2 (tính từ cung mọc), rất hợp để thu xếp tài chính, thưởng thức bữa cơm ấm và nói những lời chân thành.",
  "Hôm nay Mặt Trăng đi qua nhà 3 (tính từ cung mọc), thuận lợi cho việc viết lách, trao đổi công việc, đi lại ngắn và bắt tay vào các kỹ năng thực hành.",
  "Hôm nay Mặt Trăng đi qua nhà 4 (tính từ cung mọc), lòng dễ hướng về mái nhà, sự tĩnh lặng riêng tư và những người thân thiết.",
  "Hôm nay Mặt Trăng đi qua nhà 5 (tính từ cung mọc), mang lại cảm hứng cho sáng tạo, học tập, niềm vui tình cảm và sự gắn kết với con trẻ.",
  "Hôm nay Mặt Trăng đi qua nhà 6 (tính từ cung mọc), hợp để giải quyết gọn các đầu việc thường nhật, dọn dẹp không gian và giữ nếp rèn luyện sức khỏe.",
  "Hôm nay Mặt Trăng đi qua nhà 7 (tính từ cung mọc), làm nổi bật các cuộc trò chuyện đôi lứa, sự hợp tác và lắng nghe người đối diện.",
  "Hôm nay Mặt Trăng đi qua nhà 8 (tính từ cung mọc), trực giác nhạy hơn thường lệ; bạn nên ưu tiên việc nghiên cứu sâu và nghỉ ngơi hợp lý.",
  "Hôm nay Mặt Trăng đi qua nhà 9 (tính từ cung mọc), mở ra khoảng thoáng cho việc đọc sách, học hỏi điều mới và nhìn lại định hướng dài hạn.",
  "Hôm nay Mặt Trăng đi qua nhà 10 (tính từ cung mọc), hướng sự tập trung vào công việc chuyên môn, trách nhiệm và các mục tiêu ngoài xã hội.",
  "Hôm nay Mặt Trăng đi qua nhà 11 (tính từ cung mọc), thuận lợi cho việc kết nối bạn bè, làm việc nhóm và đón nhận thành quả.",
  "Hôm nay Mặt Trăng đi qua nhà 12 (tính từ cung mọc), nhắc bạn dành thời gian tĩnh tâm, ngủ sớm và buông bớt những lo toan vụn vặt.",
];

export const DAY_THEME_NOTIME =
  "Hôm nay Mặt Trăng đi qua cung {sign}, tức cung thứ {h} tính từ Mặt Trăng lúc bạn sinh.";

export const TARA_NAME = ["", "Janma", "Sampat", "Vipat", "Kshema", "Pratyak", "Sadhana", "Naidhana", "Mitra", "Parama Mitra"];

export const TARA_TEXT: string[] = [
  "",
  "Chòm sao Mặt Trăng hôm nay trùng với nhịp Janma (chòm sao gốc): cảm xúc nhạy bén, hợp để quan sát bản thân và làm những việc quen thuộc.",
  "Chòm sao Mặt Trăng hôm nay thuộc nhịp Sampat (sung túc): thuận lợi cho việc thu xếp nguồn lực và bồi đắp công việc.",
  "Chòm sao Mặt Trăng hôm nay thuộc nhịp Vipat (trắc trở nhỏ): bạn nên thong thả và chừa thêm thời gian dự phòng cho lịch trình.",
  "Chòm sao Mặt Trăng hôm nay thuộc nhịp Kshema (an ổn): mang lại cảm giác bình tâm, rất hợp để củng cố những việc đang làm.",
  "Chòm sao Mặt Trăng hôm nay thuộc nhịp Pratyak (chậm nhịp): khi gặp vướng mắc nhỏ, sự kiên nhẫn đối thoại sẽ giúp mọi việc êm xuôi.",
  "Chòm sao Mặt Trăng hôm nay thuộc nhịp Sadhana (thành tựu): công sức bỏ ra dễ kết thành kết quả cụ thể.",
  "Chòm sao Mặt Trăng hôm nay thuộc nhịp Naidhana (cần dưỡng sức): hãy ưu tiên việc nhẹ nhàng và nghỉ ngơi đúng giờ.",
  "Chòm sao Mặt Trăng hôm nay thuộc nhịp Mitra (bằng hữu): thuận lợi cho sự trao đổi, hợp tác và nhờ cậy người đồng hành.",
  "Chòm sao Mặt Trăng hôm nay thuộc nhịp Parama Mitra (tương trợ sâu): ngày có nhịp tâm lý hài hòa, hợp cho các việc quan trọng.",
];

export const CHANDRA = {
  good: "Xét theo Chandra Bala (khoảng cách từ Mặt Trăng lúc sinh), Mặt Trăng hôm nay đứng ở vị trí thuận (1, 3, 6, 7, 10 hoặc 11), giúp tâm trí bạn sáng rõ và dễ chịu.",
  hard: "Xét theo Chandra Bala, Mặt Trăng hôm nay đứng ở vị trí cần sự điềm tĩnh, vì vậy giải quyết từng việc nhỏ theo thứ tự sẽ giúp lòng bạn nhẹ nhàng hơn.",
};

export const BINDU_LINE = {
  tốt: "Bảng điểm Ashtakavarga cá nhân của bạn trao cho hành tinh này {b}/8 điểm tại cung đang đi qua, tiếp thêm lực nâng đỡ thực tế rất rõ.",
  vừa: "Bảng điểm Ashtakavarga cá nhân của bạn trao cho hành tinh này {b}/8 điểm tại cung đang đi qua, giữ mức cân bằng vừa phải.",
  khó: "Bảng điểm Ashtakavarga cá nhân của bạn chỉ có {b}/8 điểm tại cung đang đi qua, nên bạn cần chủ động chuẩn bị kỹ hơn.",
};

export const RETRO_NOW = "Hành tinh này hiện đang ở pha nghịch hành trên bầu trời, khiến các chủ đề liên quan thường được rà soát kỹ lại thêm một nhịp.";
export const STAY_LABEL = "Đi qua cung này từ {from} đến {to}";

export const SKY_LAGNA = {
  lead: "Xét từ Cung mọc (Udaya Lagna), {name} đang đi qua nhà {h} ({tag}), ",
  saturn: "đặt trọng tâm kỷ luật, trách nhiệm và việc xây nền dài hạn vào lĩnh vực này.",
  jupiter: "mở rộng cơ hội phát triển, sự học hỏi và quý nhân nâng đỡ cho lĩnh vực này.",
  rahu: "thúc đẩy khát vọng đổi mới mạnh mẽ nhưng cũng đòi hỏi sự tỉnh táo tại lĩnh vực này.",
  ketu: "mời gọi bạn tinh giản những điều hình thức để giữ lại phần cốt lõi nhất của lĩnh vực này.",
  mars: "đưa nhịp độ hành động khẩn trương và quyết liệt vào lĩnh vực này trong vài tuần.",
};

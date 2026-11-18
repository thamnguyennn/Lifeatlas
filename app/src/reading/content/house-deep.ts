// Hand-written reading atoms, part 13: the twelve deep house pages (Life Atlas v3.0).
// Voice: "mình" và "bạn" — một người bạn đọc sao điềm tĩnh, sâu sắc, giải thích thuật ngữ tự nhiên.

/** What each house is in lived terms. Opens every house page. Index 0 = nhà 1. */
export const HOUSE_OPEN: string[] = [
  "Nhà 1 là chính bạn: gương mặt, dáng đứng, sức khỏe nền và cảm giác đầu tiên người đối diện nhận được khi bạn bước vào căn phòng. Mọi ngôi nhà khác trên lá số đều quy chiếu về đây, bởi dù cuộc đời mở ra bao nhiêu sự kiện thì người trực tiếp đi qua tất cả vẫn là bạn.",
  "Nhà 2 là những gì bạn tích lũy và gìn giữ: tiền bạc trong tay, bữa cơm gia đình thuở nhỏ, giọng nói và cách bạn trao đi lời hứa. Ngôi nhà này phản chiếu cảm giác đủ đầy tự nhiên cũng như những giá trị thực tế mà bạn dùng làm chỗ dựa.",
  "Nhà 3 là đôi bàn tay chủ động và lòng can đảm: những việc bạn dám tự mình khởi sự, kỹ năng rèn qua thực hành, cách bạn viết, trò chuyện, trao đổi và mối gắn kết với anh chị em hay những người bạn đồng trang lứa.",
  "Nhà 4 là chốn bạn quay về khi khép cánh cửa sau lưng: mái nhà, người mẹ hoặc người nuôi dưỡng thuở đầu đời, cùng sự bình yên sâu kín trong lồng ngực. Đây cũng là nền tảng học vấn căn bản giúp bạn đứng vững giữa cuộc đời.",
  "Nhà 5 là khoảng trời của niềm vui sáng tạo và những gì nảy nở từ tấm lòng: tình yêu chớm nở, con cái, trí thông minh ứng biến và cả những phước lành tích lũy từ trước nay trở lại nâng đỡ bạn.",
  "Nhà 6 là nhịp công việc và sự rèn giũa mỗi ngày: thói quen sinh hoạt, sức khỏe thể chất, những khoản vay trả và cách bạn đối diện với va chạm hay cạnh tranh. Ngôi nhà này đòi hỏi sự bền bỉ nhưng cũng là nơi rèn nên tay nghề vững chắc nhất.",
  "Nhà 7 là người đứng đối diện bạn trên đường đời: người bạn đời, người thương, đối tác đồng hành và những cam kết đường dài. Qua tấm gương của nhà 7, bạn nhận ra mình đang tìm kiếm điều gì và sẵn lòng trao đi điều gì trong một mối quan hệ.",
  "Nhà 8 là miền đất của những chuyển hóa thầm lặng: những bước ngoặt bất ngờ, chiều sâu tâm lý, nguồn lực chung với người khác và khả năng tự tái tạo sau mỗi lần sóng gió.",
  "Nhà 9 là chân trời của niềm tin và tầm nhìn rộng: triết lý sống, người thầy dẫn đường, mối liên hệ với người cha, việc học lên cao và những chuyến đi xa mở mang tâm trí.",
  "Nhà 10 là chỗ đứng và đóng góp của bạn giữa xã hội: sự nghiệp, trách nhiệm bạn gánh vác và dấu ấn công việc mà mọi người nhìn thấy rõ nhất ở bạn.",
  "Nhà 11 là mùa gặt của những nỗ lực đường dài: thành quả thu về từ công việc, mạng lưới bạn bè, cộng đồng cùng chí hướng và những ước vọng lớn bạn ấp ủ qua nhiều năm.",
  "Nhà 12 là khoảng lặng phía sau sân khấu: những giờ phút ở một mình, giấc ngủ và những giấc mơ, các khoản chi tiêu hoặc cho đi, duyên gắn kết với những miền đất xa và khả năng buông nhẹ những gánh nặng đã cũ.",
];

export const SIGN_ON_HOUSE =
  "Trên nhà này là cung {sign}. Cung hoàng đạo nằm trên một ngôi nhà tạo nên chất liệu và bầu không khí tự nhiên của căn phòng đó.";

export const LORD_INTRO =
  "Mỗi cung hoàng đạo có một hành tinh cai quản, giữ vai trò như người cầm chìa khóa của ngôi nhà. Hành tinh ấy đi về đâu thì mạch chuyện của ngôi nhà sẽ chảy về đó. Nhà {n} do {lord} cai quản.";

export const SIGN_ON_HOUSE_SHORT = "Cung {sign} đặt nền cho ngôi nhà này.";
export const LORD_INTRO_SHORT = "Nhà {n} do {lord} cai quản.";

export const LORD_SELF =
  "Hành tinh cai quản đang ở ngay trong chính ngôi nhà của mình, nên chuyện {dH} được trông nom trực tiếp và giữ được sự tự chủ cao.";

export const NAK_SENTENCE = "{p} đứng trong chòm sao {nak} (pada {pada}), nên hành tinh này {style}";

export const NAK_EXPLAIN =
  "Chòm sao định vị (nakshatra) là cách Jyotish chia vòng hoàng đạo thành 27 cung sao nhỏ để đọc kỹ sắc thái hành động của từng hành tinh.";

/** How a planet acts when it stands in each of the 27 nakshatras. Read after "nên hành tinh này". Index 0 = Ashwini. */
export const NAK_STYLE: string[] = [
  "ra tay nhanh, thích mở đường và phát huy tốt nhất ở những việc cần sự nhạy bén ban đầu.",
  "chịu thương chịu khó, gánh được việc nặng mà ít than phiền, chỉ cần tránh ôm hết trách nhiệm về một mình.",
  "làm việc sắc gọn và thẳng thắn, trọng sự rõ ràng minh bạch trong từng quyết định.",
  "làm việc có duyên và giàu sức nuôi dưỡng, muốn mọi thứ nảy nở đẹp đẽ và bền vững theo thời gian.",
  "luôn tò mò tìm tòi, thích đặt câu hỏi và khám phá những ngóc ngách mới mẻ của vấn đề.",
  "đi qua từng đợt sóng cảm xúc mạnh để gạn đục khơi trong, sau mỗi lần thử thách lại nhìn thấu đáo hơn.",
  "biết cách tự phục hồi và làm mới mình, nên sau mỗi khúc quanh đều đứng dậy nhẹ nhàng, ấm áp.",
  "vận hành theo lối vun bồi kiên nhẫn, đáng tin cậy và rất hợp với việc chăm sóc những giá trị đường dài.",
  "quan sát sắc sảo và kín kẽ, đọc nhanh tâm ý người đối diện nhưng cần giữ lòng tin để tránh phòng vệ quá mức.",
  "coi trọng chữ tín, phẩm giá và nền tảng gia truyền, luôn muốn làm việc một cách đàng hoàng, mẫu mực.",
  "mang lại sự ấm áp, hào phóng và niềm vui gắn kết, giúp không khí quanh mình trở nên nhẹ nhõm hơn.",
  "làm việc bằng sự cam kết và giữ trọn lời hứa, thích nâng đỡ và đồng hành lâu dài cùng người mình tin cậy.",
  "khéo léo và tháo vát, giỏi biến những ý tưởng trên giấy thành sản phẩm cụ thể trong tầm tay.",
  "chăm chút từng đường nét như một người nghệ nhân, muốn công việc của mình vừa chuẩn xác vừa có thẩm mỹ riêng.",
  "mềm mại nhưng độc lập như ngọn gió, cần không gian tự chủ và rất nhạy trong việc thích nghi với hoàn cảnh mới.",
  "bền bỉ hướng tới mục tiêu đã chọn, sẵn sàng đi chặng đường dài và hiếm khi bỏ cuộc giữa chừng.",
  "giỏi kết nối và giữ gìn tình bằng hữu, biết đi cùng tập thể ngay cả trong những giai đoạn nhiều sức ép.",
  "quen đứng mũi chịu sào như người anh cả, sẵn lòng bảo vệ người khác nhưng cần tránh tự tạo áp lực quá lớn.",
  "ưa tìm hiểu đến tận cội rễ của sự việc và sẵn sàng dọn bỏ phần cũ kỹ để xây lại từ nền móng.",
  "mang sức thuyết phục tự nhiên và tinh thần lạc quan, giữ vững niềm tin ngay cả khi đường đi chưa bằng phẳng.",
  "làm việc có nguyên tắc và chiều sâu, thường gặt hái thành quả muộn hơn nhưng rất chắc chắn.",
  "biết lắng nghe và tiếp thu tinh tế, giỏi chắt lọc tri thức rồi truyền đạt lại một cách dễ hiểu.",
  "làm việc có nhịp điệu và tầm nhìn thực tế, nhạy với việc tổ chức nguồn lực và tạo ra thành quả hữu hình.",
  "độc lập và kín đáo, hợp với việc nghiên cứu chuyên sâu, tháo gỡ nút thắt hoặc chữa lành những phần tổn thương.",
  "mang nhiệt huyết lớn và lý tưởng mạnh mẽ, có khả năng thúc đẩy những bước chuyển dịch sâu sắc.",
  "điềm tĩnh và sâu lắng, có sức bền nội tâm lớn để chuyển hóa những trải nghiệm khó thành sự từng trải.",
  "hiền hòa và giàu lòng trắc ẩn, luôn muốn khép lại mọi việc một cách êm đẹp và trọn vẹn.",
];

export const EMPTY_HOUSE =
  "Ngôi nhà này hiện để trống trên bản đồ sao — một điều hết sức tự nhiên vì chín hành tinh chia nhau mười hai nhà. Khi nhà không có hành tinh đóng, nhịp điệu của chuyện {dH} sẽ chảy êm theo vị trí và phẩm chất của {lord}, hành tinh giữ chìa khóa ngôi nhà.";
export const EMPTY_HOUSE_SHORT: string[] = [
  "Ngôi nhà này cũng để trống, nên mạch chuyện {dH} vận hành trực tiếp qua vị trí của {lord}.",
  "Không có hành tinh nào đóng trực tiếp tại đây; vì thế chuyện {dH} giữ được nét thuần nhất của cung hoàng đạo và đi theo nhịp của {lord}.",
  "Đây là một khoảng sân yên tĩnh không có hành tinh cư ngụ, và điểm tựa chính của chuyện {dH} nằm ở nơi {lord} đang đứng.",
];

export const OCCUPANT_INTRO_SHORT = "Đang đứng trong ngôi nhà này có {list}.";
export const OCCUPANT_INTRO_ONE = "Đóng trực tiếp trong nhà này có {list}. Hành tinh cư ngụ tại đây sẽ đưa thẳng tính chất và mối bận tâm của nó vào chuyện {dH}.";
export const OCCUPANT_INTRO_MANY = "Cùng cư ngụ trong nhà này có {list}. Nhiều hành tinh tụ hội khiến chuyện {dH} trở nên sôi động, đa diện và thu hút nhiều sự chú ý của bạn.";

export const ASPECT_INTRO =
  "Theo quy tắc góc chiếu Parashara (Graha Drishti), các hành tinh từ nhà khác có thể hướng ánh nhìn vào đây, gửi thêm sự nâng đỡ hoặc đặt thêm bài toán rèn luyện cho chuyện {dH}.";
export const ASPECT_INTRO_SHORT = "Các hành tinh dưới đây đang hướng góc chiếu vào ngôi nhà này.";
export const ASPECT_NONE =
  "Không có hành tinh nào từ xa chiếu thẳng vào nhà này, nên chuyện {dH} ít chịu tác động ngoại lai và vận hành thuần theo cấu trúc nội tại của nó.";

// ------------------------------------------------------------------ strength (Shadbala, Bhava Bala)

export const BAND_LINE: Record<"rất mạnh" | "mạnh" | "vừa" | "yếu", string> = {
  "rất mạnh": "Xét về lực Shadbala, {p} rất dồi dào: đạt {pct}% ngưỡng chuẩn và {rankPhrase}. Nhờ vậy, phần việc hành tinh này đảm nhận có sẵn độ vững tự nhiên.",
  mạnh: "Xét về lực Shadbala, {p} đạt {pct}% ngưỡng chuẩn và {rankPhrase}, đủ đầy năng lực để quán xuyến vai trò của mình.",
  vừa: "Xét về lực Shadbala, {p} đạt {pct}% ngưỡng chuẩn ({rankPhrase}). Hành tinh này làm tròn vai khi bạn duy trì nhịp độ làm việc ổn định.",
  yếu: "Xét về lực Shadbala, {p} đạt {pct}% ngưỡng chuẩn ({rankPhrase}). Những việc thuộc về hành tinh này cần bạn bồi đắp từng bước bằng kỷ luật đều đặn.",
};

export type PartKey = "sthana" | "dig" | "kala" | "cheshta" | "drik";

export const PART_TEXT: Record<PartKey, { name: string; high: string; low: string }> = {
  sthana: {
    name: "chỗ đứng",
    high: "Điểm tựa lớn nhất của hành tinh này nằm ở vị thế cung và phân cung (Sthana Bala), giúp nó đứng vững vàng.",
    low: "Phần vị thế cung (Sthana Bala) còn khiêm tốn, nên nó cần thêm thời gian để tạo dựng chỗ đứng quen thuộc.",
  },
  dig: {
    name: "hướng đứng",
    high: "Nó nằm gần phương hướng đắc lực nhất của mình trên bầu trời (Dig Bala), nên có thêm độ sáng và sức hướng dẫn.",
    low: "Nó đứng khá xa phương hướng sở trường (Dig Bala), nên cách thể hiện thiên về chiều sâu kín đáo hơn là phô bày.",
  },
  kala: {
    name: "thời điểm sinh",
    high: "Thời điểm bạn sinh ra (Kala Bala: ngày/đêm và pha trăng) tiếp thêm sinh khí tự nhiên cho hành tinh này.",
    low: "Thời điểm sinh (Kala Bala) ít thuận chiều với nhịp tự nhiên của nó, nên nó khởi động chậm rãi và chắc chắn hơn.",
  },
  cheshta: {
    name: "chuyển động",
    high: "Lúc bạn chào đời, chuyển động biểu kiến của nó trên bầu trời (Cheshta Bala) rất rõ nét, tạo nên phản xạ chủ động.",
    low: "Lúc bạn chào đời, nhịp chuyển động của nó (Cheshta Bala) khá êm và chậm, nên tác động thường thấm dần qua thời gian.",
  },
  drik: {
    name: "ánh nhìn nhận được",
    high: "Nó nhận được các góc chiếu nâng đỡ (Drik Bala) từ những hành tinh lành, tạo thêm sự hậu thuẫn.",
    low: "Nó nhận góc chiếu thử thách (Drik Bala) từ các hành tinh nghiêm cẩn, nên trưởng thành qua áp lực thực tế.",
  },
};

export const PART_SPREAD: Record<string, Partial<Record<PartKey, [number, number, number]>>> = {
  sun: { sthana: [148.1, 182.4, 219], dig: [10.8, 28.8, 47.3], kala: [91.5, 152.1, 208.8], drik: [-13.3, -3.9, 5.5] },
  moon: { sthana: [143.6, 184.2, 221.8], dig: [11.3, 29.4, 47.6], kala: [101.8, 152.7, 203], drik: [-16.1, -4.7, 4.7] },
  mars: { sthana: [148.7, 183.6, 220.3], dig: [10.9, 28.7, 47.6], kala: [80.4, 119.7, 164], cheshta: [10.1, 24.8, 41.8], drik: [-9.7, 0.5, 11.5] },
  mercury: { sthana: [151.7, 186.1, 224.9], dig: [11.2, 30.4, 48.3], kala: [132, 162.9, 204.4], cheshta: [10.3, 26.5, 45], drik: [-14, -4.1, 6.1] },
  jupiter: { sthana: [145.2, 181.6, 218.3], dig: [13, 30.2, 48.9], kala: [132.5, 168.2, 206], cheshta: [11.3, 28.3, 45.9], drik: [-23.3, -11.7, -1.7] },
  venus: { sthana: [147.3, 182.6, 216.2], dig: [12.2, 30.6, 48.8], kala: [83.8, 117.8, 156.4], cheshta: [9.1, 23.5, 40.2], drik: [-15.1, -5.2, 5.6] },
  saturn: { sthana: [138.9, 174.5, 209.2], dig: [11.3, 30.1, 48.6], kala: [85, 120, 163.4], cheshta: [10.8, 28.1, 47.5], drik: [-10.7, 1.3, 12.3] },
};

export const BHAVA_LINE = {
  top: "Xét về độ vững nội tại (Bhava Bala), ngôi nhà này {rankClause}, cho thấy nền móng cấu trúc của chuyện {dH} rất cứng cáp.",
  mid: "Xét về độ vững nội tại (Bhava Bala), ngôi nhà này {rankClause}, giữ mức cân bằng ổn định và càng đắp bồi càng chắc chắn.",
  low: "Xét về độ vững nội tại (Bhava Bala), ngôi nhà này {rankClause}, đòi hỏi bạn chủ động chăm chút và xây từng viên gạch nền cho chuyện {dH}.",
};

export const BHAVA_DIVERGE = {
  strongLowSupport: "Đáng chú ý là hai chỉ số của nhà này đi theo hai chiều khác nhau: độ vững nội tại (Bhava Bala) cao nhưng điểm hỗ trợ ngoại cảnh (SAV) lại thấp. Nền nhà của bạn rất chắc, song thành quả chủ yếu do chính tay bạn gây dựng thay vì nhờ may mắn từ hoàn cảnh.",
  weakHighSupport: "Đáng chú ý là điểm hỗ trợ ngoại cảnh (SAV) của nhà này cao trong khi độ vững nội tại (Bhava Bala) ở nhóm khiêm tốn. Hoàn cảnh thường mang cơ hội và người giúp đến cho bạn, và việc của bạn là rèn nội lực thật kỹ để giữ được lâu dài những gì tìm đến.",
};

export const SAV_INTRO_SHORT = "Nhà này nhận được {sav} điểm hỗ trợ (SAV), ở mức {label}.";
export const SAV_INTRO =
  "Điểm hỗ trợ tổng hợp (Sarvashtakavarga - SAV) đo mức độ tương trợ mà bảy hành tinh và cung mọc đóng góp cho ngôi nhà này, với ngưỡng trung bình là 28 điểm.";

export const SAV_REVERSE: Record<6 | 8 | 12, string> = {
  6: "Vì nhà 6 là nơi của công việc nặng và va chạm, số điểm SAV vừa phải hoặc thấp tại đây lại giúp bạn nhẹ gánh hơn trong đời sống thường nhật.",
  8: "Vì nhà 8 gắn với những biến chuyển bất ngờ, điểm SAV thấp ở đây giúp nhịp sống của bạn đỡ gặp những cơn xáo trộn đột ngột.",
  12: "Vì nhà 12 là nơi của sự tiêu hao và lắng đọng, điểm SAV thấp tại đây giúp bạn dễ giữ gìn nguồn lực và sự yên tĩnh của mình hơn.",
};

// ------------------------------------------------------------------ yoga

export const YOGA_INTRO_ONE = "Có một tổ hợp cổ điển (Yoga) kết nối trực tiếp vào ngôi nhà này.";
export const YOGA_INTRO_MANY = "Có {k} tổ hợp cổ điển (Yoga) cùng kết nối vào ngôi nhà này.";
export const YOGA_SHORT_ONE = "Có một tổ hợp Yoga chạm vào ngôi nhà này.";
export const YOGA_SHORT_MANY = "Có {k} tổ hợp Yoga cùng chạm vào ngôi nhà này.";

export const WHY_CAI_QUAN = "cai quản nhà này";
export const WHY_O_TRONG = "ngồi trong nhà này";
export const WHY_CA_HAI = "cai quản nhà này và cũng ngồi trong nhà";

export const HOUSE_SECTION_TITLES = {
  open: "Ý nghĩa của ngôi nhà này trong đời sống",
  summary: "Câu chuyện cấu trúc của nhà này",
  layers: "Vì sao mình nói điều này?",
  sign: (sign: string) => `Cung ${sign}: chất liệu nền của nhà`,
  lord: (lord: string) => `${lord}: hành tinh giữ chìa khóa nhà`,
  inside: "Hành tinh cư ngụ trong nhà",
  aspects: "Các góc chiếu hướng vào nhà",
  support: "Độ vững nội tại (Bhava Bala) và điểm nâng đỡ (SAV)",
  yoga: "Tổ hợp Yoga liên kết với nhà",
  turn: "Một gợi ý nhỏ để bạn tự quan sát và ứng dụng",
};

/** The page that opens the twelve houses: 6 natal structural layers (timing consolidated in Đại vận chapter per Section II.2). */
export const HOUSE_MAP = {
  intro: [
    "Cuộc đời mỗi người mở ra qua mười hai lĩnh vực, mà truyền thống Parashara Jyotish gọi là mười hai “nhà” (Bhava): từ bản thân, tài chính, kỹ năng, mái ấm, sáng tạo, công việc thường nhật cho tới người đồng hành, chiều sâu biến chuyển, niềm tin, sự nghiệp, bạn bè và khoảng lặng tâm hồn.",
    "Trên từng trang nhà, mình tập trung đọc sâu cấu trúc lá số gốc qua sáu lớp nền tảng, phân biệt rõ giữa mức độ biểu hiện sôi động hay yên tĩnh với mức độ nâng đỡ thuận lợi hay cần rèn giũa. Toàn bộ dòng chảy thời gian (Đại vận, Tiểu vận và Bầu trời hiện tại) được tập trung trọn vẹn tại chương Đại vận và tiểu vận để bạn theo dõi liền mạch mà không bị lặp lại ở từng trang.",
    "Một ngôi nhà để trống hay có điểm số khiêm tốn hoàn toàn bình thường trong Jyotish: nhà yên tĩnh giúp bạn thảnh thơi, còn nhà nhiều thử thách chính là nơi rèn nên bản lĩnh sắc sảo nhất của bạn.",
  ],
  layers: [
    { title: "Cung trên nhà", text: "Cung hoàng đạo nằm trên nhà tạo nên chất liệu và bầu không khí tự nhiên cho lĩnh vực đời sống đó." },
    { title: "Hành tinh cai quản", text: "Hành tinh giữ chìa khóa của cung đó đang đi về nhà nào, đứng ở vị thế mạnh hay yếu, cho thấy mạch chuyện của nhà chảy về đâu." },
    { title: "Hành tinh cư ngụ", text: "Những hành tinh đóng trực tiếp trong nhà (kèm chòm sao Nakshatra và lực Shadbala) làm tăng mức độ biểu hiện của ngôi nhà." },
    { title: "Góc chiếu (Graha Drishti)", text: "Ánh nhìn từ các hành tinh ở nhà khác chiếu vào, mang theo sự nâng đỡ của cát tinh hoặc sức rèn luyện của hung tinh." },
    { title: "Độ vững & Điểm nâng đỡ", text: "Đối chiếu giữa độ vững nội tại (Bhava Bala) và điểm hỗ trợ ngoại cảnh (Sarvashtakavarga - SAV) để tách bạch độ sôi động và độ thuận lợi." },
    { title: "Tổ hợp Yoga", text: "Những tổ hợp hành tinh cổ điển kết nối ngôi nhà này với các mảng khác trên bản đồ sao." },
  ],
};

// Hand-written reading atoms for Life Atlas v3.0: Opening (Mở lá số) and Overview (Tổng quan).
// Concise, evocative literary voice ("mình" và "bạn") — ~50% more compact while preserving all core Parashara insights.


/** Mặt Trời ở từng cung: bản ngã và định hướng sống (cô đọng). Index 0 = Bạch Dương. */
export const SUN_SIGN: string[] = [
  "Mặt Trời Bạch Dương trao cho bạn ngọn lửa mở đường: bạn sống trọn nhất khi được tự quyết và bắt đầu điều mới. Qua năm tháng, bạn rèn được bản lĩnh dẫn dắt điềm tĩnh và dám chịu trách nhiệm đến cùng.",
  "Mặt Trời Kim Ngưu cần một nền đất thật vững: công việc tạo kết quả hữu hình và những giá trị bền lâu. Bạn kiên định, trọng chữ tín và biết trân trọng giá trị bản thân ngay cả khi mọi thứ còn đang thành hình.",
  "Mặt Trời Song Tử sáng lên khi được tìm hiểu, học hỏi và đối thoại. Càng trưởng thành, bạn càng biết neo sự linh hoạt của trí óc vào những chủ đề có chiều sâu thay vì chỉ lướt qua bề mặt.",
  "Mặt Trời Cự Giải gắn liền định hướng sống với gia đình, ký ức và sự chở che. Bạn thấy cuộc đời có ý nghĩa khi giữ được nhịp bình yên cho người mình thương mà vẫn không quên chăm sóc chính mình.",
  "Mặt Trời Sư Tử mang lòng tự trọng cao, ấm áp và ngay thẳng. Bạn tỏa sáng tự nhiên khi đứng ở vị trí dẫn dắt, biết nâng đỡ người khác bằng sự rộng lượng mà không cần chờ tiếng vỗ tay đáp lại.",
  "Mặt Trời Xử Nữ tìm thấy giá trị qua sự chỉn chu, chuẩn xác và hữu ích mỗi ngày. Càng từng trải, bạn càng dịu lại với bản thân, giữ lấy chuẩn mực cao mà bớt đi sự cầu toàn tự làm mình mỏi.",
  "Mặt Trời Thiên Bình soi chiếu bản ngã qua sự hài hòa, lịch thiệp và công bằng giữa người với người. Đi qua nhiều chặng đường, bạn học được cách giữ tiếng nói riêng quyết đoán ngay giữa những mối quan hệ.",
  "Mặt Trời Thiên Yết ưa đi thẳng vào bản chất sự việc và giữ trọn chữ tín. Qua những lần chuyển hóa âm thầm, bạn dần buông bớt nhu cầu kiểm soát để đặt niềm tin vào những người xứng đáng.",
  "Mặt Trời Nhân Mã luôn hướng về một chân trời rộng mở: tri thức, niềm tin và những chặng đường dài. Sức mạnh của bạn chín nhất khi biết đem lý tưởng lớn đặt vào từng việc làm cụ thể mỗi ngày.",
  "Mặt Trời Ma Kết dựng nên lòng tự trọng từ những thành tựu bền bỉ và trách nhiệm thực tế. Khi đã đi qua nhiều dốc cao, bạn biết cho phép đôi vai mình nghỉ ngơi và trân trọng cả những khoảng lặng.",
  "Mặt Trời Bảo Bình giữ một khoảng trời độc lập, dám đi lệch lối mòn và hướng về lợi ích chung. Theo thời gian, bạn dung hòa được tư duy khác biệt ấy với hơi ấm gần gũi của đời sống thường nhật.",
  "Mặt Trời Song Ngư giàu trực giác, lòng trắc ẩn và rung cảm nghệ thuật tinh tế. Trưởng thành giúp bạn dựng được bờ đê vững chãi để lòng tốt chảy đúng chỗ mà không làm vơi cạn sức mình.",
];

export const SUN_DIGNITY = {
  strong: "Mặt Trời đứng vững trên bầu trời lúc sinh, giữ cho trục tự trọng và hướng đi dài hạn của bạn luôn sáng rõ.",
  weak: "Mặt Trời ở vị trí cần thời gian bồi đắp, nên sự tự tin của bạn được dựng lên chắc chắn nhất qua từng thành quả thực tế.",
};

export type Element = "fire" | "earth" | "air" | "water";
export const ELEMENT_OF = (sign: number): Element => (["fire", "earth", "air", "water"] as const)[sign % 4];
export const ELEMENT_VI: Record<Element, string> = { fire: "Lửa", earth: "Đất", air: "Khí", water: "Nước" };

export const ELEMENT_LINES: Record<Element, { more: string; none: string }> = {
  fire: {
    more: "Lửa chiếm ưu thế: bạn giàu nhiệt huyết, khởi động nhanh và chỉ cần giữ nhịp đều khi bước vào chặng đường dài.",
    none: "Vắng nguyên tố Lửa: bạn ít bốc đồng mà thường cần một lý do rõ ràng hoặc mục tiêu đủ thuyết phục để bắt đầu.",
  },
  earth: {
    more: "Đất chiếm ưu thế: bạn thực tế, bền sức và trọng kết quả hữu hình, chỉ cần mở thêm khoảng trống cho cái mới.",
    none: "Vắng nguyên tố Đất: tâm trí bạn bay nhanh, nên những nếp sinh hoạt đều đặn sẽ là chiếc neo rất quý.",
  },
  air: {
    more: "Khí chiếm ưu thế: đầu óc bạn nhạy bén, giàu liên tưởng và tiếp cận cuộc sống qua sự trao đổi, suy ngẫm.",
    none: "Vắng nguyên tố Khí: bạn ít nói lời xã giao mà thích lắng lại làm việc cụ thể để tự gỡ những mối tơ lòng.",
  },
  water: {
    more: "Nước chiếm ưu thế: bạn cảm nhận sâu, nhớ lâu và giàu lòng trắc ẩn; những khoảng lặng riêng giúp bạn lọc lại cảm xúc.",
    none: "Vắng nguyên tố Nước: khi xao động, bạn thường dùng lý trí thu xếp công việc trước rồi mới chậm rãi nghe lại lòng mình.",
  },
};

export const ELEMENT_BALANCED =
  "Bốn nguyên tố Lửa, Đất, Khí, Nước phân bổ hài hòa, giúp bạn vừa có sức bật khởi sự, độ chắc giữ nền, vừa có sự minh mẫn và thấu cảm.";

export const RETRO_LINE =
  "Lúc sinh, {list} đang nghịch hành. Những chủ đề gắn với {it} thường đi theo nhịp lắng sâu: bạn tự trải nghiệm, chiêm nghiệm kỹ rồi mới đúc kết thành bản lĩnh riêng.";

export const STELLIUM_LINE =
  "Có {k} hành tinh cùng tụ hội tại nhà {n} ({tag}), dồn trọng lực lá số về chuyện {domain} như một tâm điểm thu hút các quyết định lớn.";

export const STRONG_LINE = "{list} đứng rất vững trong lá số, tạo thành trụ cột tự nhiên nâng đỡ lâu dài cho các mảng thuộc về {it}.";
export const WEAK_LINE =
  "{list} đứng ở cung suy (hãm), đòi hỏi sự kiên nhẫn: chính những lần tự tay tháo gỡ ở mảng của {it} lại rèn nên độ chín sâu sắc nhất cho bạn.";

export const SHADBALA_INTRO =
  "Hệ Parashara đo sức mạnh 7 hành tinh qua sáu nguồn lực Shadbala (vị trí, hướng, thời điểm, chuyển động, độ sáng và góc chiếu). Đạt từ 100% trở lên là hành tinh đủ lực tự nâng đỡ công việc của nó.";

export const SHADBALA_BEST = "Hành tinh dồi dào lực nhất là {p} ({pct}% ngưỡng chuẩn), làm điểm tựa vững vàng nhất mỗi khi bạn cần xoay xở chuyện {role}.";
export const SHADBALA_WORST = "Hành tinh có lực khiêm tốn nhất là {p} ({pct}% ngưỡng chuẩn); với chuyện {role}, bạn nên chia nhỏ từng bước và giữ nhịp đều đặn.";
export const SHADBALA_ALL_FINE = "Cả bảy hành tinh đều đạt hoặc vượt ngưỡng sức mạnh chuẩn, tạo nên dàn lực khá đồng đều.";

export const SECTION_INTROS = {
  threeKeys: "Cung mọc, Mặt Trời và Mặt Trăng là ba trụ cột định hình cách bạn bước ra đời, định hướng tự trọng và thế giới cảm xúc.",
  lagna: "Dáng vẻ tự nhiên và phản xạ đầu tiên khi bạn bước vào cuộc sống.",
  sun: "Hạt nhân tự trọng và định hướng sống cốt lõi của bạn.",
  moon: "Nhịp điệu tâm trí, đời sống cảm xúc và điều làm lòng bạn an lại.",
  noTime: "Vì chưa có giờ sinh chính xác, mình đọc trục cốt lõi của bạn qua sự kết hợp giữa Mặt Trời, Mặt Trăng và chòm sao lúc sinh.",
};

/** Mặt Trăng ở từng cung: cảm xúc và tâm trí (cô đọng). Index 0 = Bạch Dương. */
export const MOON_SIGN: string[] = [
  "Mặt Trăng Bạch Dương có nhịp cảm xúc nhanh, thẳng và rõ ràng: bạn dễ chịu nhất khi được chủ động hành động và có khoảng không tự quyết.",
  "Mặt Trăng Kim Ngưu lắng sâu và bền bỉ: lòng bạn tìm thấy sự bình yên từ những điều quen thuộc, vững chãi và những lời hứa được giữ trọn.",
  "Mặt Trăng Song Tử nhạy bén và giàu suy ngẫm: bạn làm dịu cảm xúc bằng cách trò chuyện, đọc viết hoặc gọi đúng tên điều đang diễn ra trong lòng.",
  "Mặt Trăng Cự Giải giàu tình cảm và giữ ký ức rất lâu: bạn cần một chốn đi về thật sự an toàn để tháo bỏ lớp phòng vệ và chăm sóc người mình thương.",
  "Mặt Trăng Sư Tử ấm áp, rộng lượng và trọng danh dự: bạn trao tình cảm trọn vẹn và luôn cần sự trân trọng ngay thẳng, chân thành từ người đối diện.",
  "Mặt Trăng Xử Nữ tinh tế và chu toàn: tâm trí bạn chỉ thực sự thả lỏng khi công việc đã ngăn nắp, rõ ràng và bạn bớt khắt khe với chính mình.",
  "Mặt Trăng Thiên Bình nhạy cảm với sự hài hòa: lòng bạn dịu lại khi có người đồng hành biết lắng nghe và không gian quanh mình giữ được vẻ êm ấm.",
  "Mặt Trăng Thiên Yết trầm sâu và kín tiếng: bạn nhìn thấu những điều ẩn sau lời nói và chỉ thực sự nghỉ ngơi khi có được niềm tin trọn vẹn.",
  "Mặt Trăng Nhân Mã khoáng đạt và giàu niềm tin: những lúc lòng chùng xuống, một góc nhìn rộng hay một chân trời mới sẽ giúp bạn lấy lại nhịp thở tự do.",
  "Mặt Trăng Ma Kết điềm tĩnh và tự chủ: bạn quen trấn an lòng mình bằng trách nhiệm thực tế, nhưng cũng cần tập cho đôi vai được nghỉ ngơi.",
  "Mặt Trăng Bảo Bình tỉnh táo và cần khoảng thở riêng: khi gặp xao động, bạn thường lùi lại một bước để quan sát thấu đáo rồi mới tìm lại sự cân bằng.",
  "Mặt Trăng Song Ngư dịu dàng, giàu trực giác và dễ thấu cảm: bạn rất cần những khoảng lặng tĩnh mịch mỗi ngày để tâm hồn lắng trong trở lại.",
];

export const MOON_NAK_LEAD = "Tại chòm sao {nak}, nhịp cảm xúc ấy mang thêm nét riêng:";

export const LETTER_FACE: string[] = [
  "năng nổ và thẳng thắn",
  "điềm đạm và vững chãi",
  "linh hoạt và cởi mở",
  "dịu dàng và chu đáo",
  "tự tin và ấm áp",
  "chỉn chu và tinh tế",
  "ôn hòa và lịch thiệp",
  "trầm tĩnh và sâu sắc",
  "phóng khoáng và chân thành",
  "chín chắn và điềm tĩnh",
  "độc lập và khác biệt",
  "hiền hòa và nhạy cảm",
];

export const LETTER_NEED: string[] = [
  "khoảng không tự do để tự mình hành động",
  "nhịp sống êm đềm và một chỗ dựa thật vững",
  "sự sẻ chia và những điều mới mẻ để suy ngẫm",
  "một chốn về an toàn và cảm giác được chở che",
  "sự trân trọng và ghi nhận chân thành",
  "sự ngăn nắp, rõ ràng để tâm trí thả lỏng",
  "sự êm ấm, công bằng và người đồng hành biết lắng nghe",
  "niềm tin trọn vẹn nơi người mình gắn bó",
  "một chân trời rộng mở và lẽ sống có ý nghĩa",
  "những thành quả vững chắc làm điểm tựa an tâm",
  "khoảng trời tự chủ mà vẫn gắn kết với mọi người",
  "những khoảng lặng bình yên để tâm hồn lắng lại",
];

export const LETTER_LINES = {
  same: "Người ta gặp ở bạn phong thái {face}, và sâu trong lòng, bạn cũng cần {need}.",
  friend: "Dáng vẻ {face} lúc bạn bước ra đời hòa nhịp tự nhiên với một tâm hồn cần {need}.",
  tension: "Khi mới gặp, bạn mang nét {face}, nhưng khoảng lặng sâu nhất trong lòng lại cần {need}.",
  noTime: "Giữa nhịp sống thường ngày, lòng bạn luôn giữ một nhu cầu thầm kín: {need}.",
};

// ------------------------------------------------------------------ 6 concise literary pathways for Mở Lá Số (~50% shorter)

export const OVERVIEW_INTRO =
  "Phần Tổng quan phác họa sơ bộ ba trụ cột quan trọng nhất của bạn — Cung mọc, Mặt Trời và Mặt Trăng — rồi đặt chúng cạnh nhau để bạn nhìn nhanh cách mình bước ra đời, định hướng sống và đời sống cảm xúc.";

export const ELEMENT_COUNT = "Tính trên bảy hành tinh chính và cung mọc, cấu trúc nguyên tố của bạn gồm {parts}.";

export const LETTER_NOTE =
  "Lá số tính theo hoàng đạo sao thực tế (Sidereal Lahiri) của Jyotish, nên vị trí cung thường lùi khoảng 24 độ so với lịch phương Tây.";

export const KEY_LINK_TITLE = "Sự đối thoại giữa Cung mọc, Mặt Trời và Mặt Trăng";
export const KEY_LINK = {
  sunMoon: {
    same: "Mặt Trời và Mặt Trăng cùng thuộc nguyên tố {a}, giúp ý chí và cảm xúc của bạn dễ đồng thuận ngay từ đầu.",
    friend: "Mặt Trời ({a}) và Mặt Trăng ({b}) nâng đỡ nhau tự nhiên, kết hợp giữa định hướng rõ ràng và cảm xúc hài hòa.",
    tension: "Mặt Trời ({a}) và Mặt Trăng ({b}) khác nhịp nguyên tố: lý trí muốn đi một hướng nhưng lòng lại cần khoảng an toàn riêng.",
  },
  lagnaSun: {
    same: "Cung mọc cũng thuộc nguyên tố {b}, nối thẳng phong thái ngoài đời với định hướng cốt lõi.",
    friend: "Cung mọc ({a}) tương trợ cho Mặt Trời ({b}), giúp cách bạn hành xử mở đường tốt cho mục tiêu lớn.",
    tension: "Cung mọc ({a}) khác nhịp với Mặt Trời ({b}): ấn tượng ban đầu bạn tạo ra khác với định hướng sâu trong lòng.",
  },
  lagnaMoon: {
    same: "Cung mọc và Mặt Trăng cùng nguyên tố {a}, nên cảm xúc trong lòng và biểu hiện ra ngoài khá đồng nhất.",
    friend: "Cung mọc ({a}) và Mặt Trăng ({b}) hòa hợp, giúp bạn bộc lộ đời sống tình cảm một cách tự nhiên.",
    tension: "Cung mọc ({a}) và Mặt Trăng ({b}) có độ chênh: dáng vẻ vững vàng nhưng trong lòng lại nhạy cảm và cần được lắng nghe.",
  },
};

export const YOGA_COUNT_LINE = "Sách cổ Jyotish gọi những tổ hợp hành tinh đặc biệt là Yoga. Trong lá số của bạn có {k} tổ hợp như vậy, làm đậm thêm những mảng đời mà chúng chạm tới.";
export const YOGA_NONE_LINE = "Lá số của bạn không tạo thành các Yoga cổ điển trong danh sách tra cứu; sức nặng nằm trực tiếp ở vị trí từng hành tinh và mười hai nhà.";

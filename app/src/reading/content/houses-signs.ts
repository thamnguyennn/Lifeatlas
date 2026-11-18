// Hand-written reading atoms, part 1: the 12 houses and the 12 signs.
// Voice rules live in STYLE.md. Every entry is a complete sentence that can stand alone.

export interface HouseText {
  short: string; // subtitle, a list of themes
  domain: string; // noun phrase, used after "chuyện …"
  plain: string; // what the house is, in plain words
  ask: string; // the one question this house answers
}

export const HOUSES: HouseText[] = [
  { short: "bản thân, cơ thể, khí chất, hướng đi cá nhân", domain: "bản thân và cách bạn xuất hiện trước người khác", ask: "Tôi là ai khi chưa nói gì?",
    plain: "Nhà 1 là gương mặt bạn đưa ra đời: vóc dáng, sức khỏe nền, tính khí người ta thấy đầu tiên và hướng bạn tự đi trong cuộc sống." },
  { short: "tiền bạc, lời nói, gia đình gốc, cảm giác đủ đầy", domain: "tiền bạc, lời nói và gia đình gốc", ask: "Tôi giữ được gì?",
    plain: "Nhà 2 nói về những gì bạn giữ được: tiền trong tay, cách bạn nói chuyện, bữa cơm gia đình và cảm giác mình đã đủ hay chưa." },
  { short: "việc tự tay làm, kỹ năng, giao tiếp, anh chị em, lòng can đảm", domain: "bắt tay vào làm, kỹ năng và anh chị em", ask: "Tôi dám làm gì?",
    plain: "Nhà 3 là đôi tay của bạn: bạn dám bắt tay vào việc gì, học kỹ năng nào, trao đổi với người xung quanh ra sao và quan hệ với anh chị em thế nào." },
  { short: "bình yên trong lòng, mẹ, nhà cửa, nền tảng học vấn", domain: "nhà cửa, mẹ và sự bình yên trong lòng", ask: "Tôi thấy bình yên ở đâu?",
    plain: "Nhà 4 là nền móng: nơi bạn thấy an toàn, quan hệ với mẹ, chỗ ở và nền học vấn đầu đời giúp bạn đứng vững." },
  { short: "sáng tạo, tình yêu, con cái, trí tuệ, vốn tốt đã gieo từ trước", domain: "sáng tạo, tình yêu và con cái", ask: "Tôi vui và sáng tạo ở đâu?",
    plain: "Nhà 5 là chỗ bạn chơi, sáng tạo và yêu: óc thông minh, tình cảm lãng mạn, con cái, cùng những cơ hội tốt tự tìm đến như một món quà." },
  { short: "công việc hằng ngày, sức khỏe, nợ nần, đối thủ", domain: "công việc hằng ngày, sức khỏe và đối thủ", ask: "Tôi phải vượt qua điều gì?",
    plain: "Nhà 6 là phần việc phải làm mỗi ngày: nghĩa vụ, thói quen, bệnh vặt, nợ nần và những người cạnh tranh với bạn. Nhà này khó chịu nhưng thường thưởng công cho người chịu rèn." },
  { short: "hôn nhân, đối tác, hợp tác, bài học từ người khác", domain: "hôn nhân và các mối hợp tác", ask: "Ai đi cùng tôi?",
    plain: "Nhà 7 là người đứng đối diện bạn: vợ chồng, bạn đời, đối tác làm ăn và cách bạn hiểu mình hơn qua người khác." },
  { short: "biến cố, mất mát, thay đổi lớn, tài sản chung, điều ẩn sâu", domain: "biến cố, tài sản chung và những điều ẩn sâu", ask: "Tôi đổi thay thế nào?",
    plain: "Nhà 8 là phần khuất của đời người: thay đổi đột ngột, khủng hoảng, tài sản chung với người khác (như thừa kế) và việc bạn tự làm mới mình sau mỗi lần đổ vỡ." },
  { short: "niềm tin, vận may, tri thức, thầy học, cha, phước đức", domain: "niềm tin, thầy học, cha và vận may", ask: "Tôi tin vào điều gì?",
    plain: "Nhà 9 là tầm nhìn xa: điều bạn tin, người thầy bạn gặp, quan hệ với cha, học vấn cao và vận may đến theo cách bạn sống." },
  { short: "sự nghiệp, vị trí xã hội, danh tiếng", domain: "sự nghiệp và vị thế xã hội", ask: "Tôi được biết đến vì điều gì?",
    plain: "Nhà 10 là đỉnh của lá số: công việc bạn được biết đến, trách nhiệm bạn gánh và hình ảnh xã hội bạn xây dần qua năm tháng." },
  { short: "thành quả, mạng lưới bạn bè, mục tiêu dài hạn, sự mở rộng", domain: "thành quả, bạn bè và mục tiêu dài hạn", ask: "Tôi gặt được gì?",
    plain: "Nhà 11 là mùa gặt: điều bạn thu về từ công sức, vòng bạn bè và các nhóm bạn thuộc về, cùng những mong ước lớn dần thành hiện thực." },
  { short: "những lúc ở một mình, giấc mơ, tâm linh, sự buông bỏ, nơi xa", domain: "những lúc ở một mình, giấc ngủ và sự buông bỏ", ask: "Tôi buông điều gì?",
    plain: "Nhà 12 là hậu trường: những khoản hao tốn, giấc ngủ và giấc mơ, thời gian ở một mình, chuyện xa xứ và sự buông thư nhẹ lòng." },
];

/** Very short names for the houses, used in running text where the long "domain" phrase would be heavy. */
export const HOUSE_TAG: string[] = [
  "bản thân", "tiền bạc và lời nói", "kỹ năng và sự chủ động", "nhà cửa và bình yên", "sáng tạo và tình yêu", "công việc hằng ngày",
  "hôn nhân và hợp tác", "biến cố và làm mới mình", "niềm tin và vận may", "sự nghiệp", "thành quả và bạn bè", "yên tĩnh và buông bỏ",
];

export type Faculty = "self" | "money" | "mind" | "love" | "work" | "pressure";

/** Which two faculties of the sign speak in each house (index 0 = house 1). */
export const HOUSE_FACULTIES: Faculty[][] = [
  ["self"], ["money", "mind"], ["mind", "work"], ["pressure", "love"], ["love", "mind"], ["work", "pressure"],
  ["love", "pressure"], ["pressure", "money"], ["mind", "pressure"], ["work", "self"], ["money", "work"], ["pressure", "mind"],
];

/** SIGN_FACULTY[sign][faculty]: how the sign behaves in one area of life. */
export const SIGN_FACULTY: Record<Faculty, string>[] = [
  { // Bạch Dương
    self: "Bạch Dương cho bạn dáng vẻ thẳng thắn, nhanh nhẹn và hơi nóng vội; bạn thường là người bước vào trước khi người khác kịp suy nghĩ.",
    money: "Với tiền bạc, Bạch Dương hào hứng kiếm nhanh và tiêu cũng nhanh; bạn dễ xuống tiền theo cảm hứng nên cần một khoản dự phòng tách riêng.",
    mind: "Bạch Dương nghĩ nhanh, nói gọn và ghét vòng vo; bạn học tốt qua việc thử làm, nhưng dễ bỏ ngang khi thấy chậm.",
    love: "Trong tình cảm, Bạch Dương chủ động và nồng nhiệt; bạn thích sự rõ ràng, dễ nổi nóng và cũng nguôi nhanh.",
    work: "Về công việc, Bạch Dương hợp những việc cần xung phong, khởi đầu và cạnh tranh; điểm yếu là chán khi chỉ còn phần việc lặp lại.",
    pressure: "Khi gặp áp lực, Bạch Dương phản ứng bằng hành động ngay; sức bật tốt, nhưng bạn cần dừng một nhịp để khỏi làm đau người gần mình.",
  },
  { // Kim Ngưu
    self: "Kim Ngưu cho bạn dáng vẻ điềm đạm, chắc chắn và dễ chịu; bạn chậm rãi và ít khi bị cuốn theo đám đông.",
    money: "Kim Ngưu yêu sự đủ đầy và an toàn; bạn tích lũy đều đặn, thích những thứ bền và có giá trị thật như đất đai, vàng hay đồ dùng tốt.",
    mind: "Kim Ngưu học chậm nhưng nhớ lâu; bạn nghĩ thực tế, cần thời gian để đổi ý và một khi đã tin thì rất khó lay chuyển.",
    love: "Trong tình cảm, Kim Ngưu trung thành và thích gần gũi bằng những việc nhỏ hằng ngày hơn lời nói; ghen và muốn giữ chặt là điều cần để ý.",
    work: "Kim Ngưu làm việc bền bỉ, hợp công việc tạo ra sản phẩm nhìn thấy được hoặc gắn với cái đẹp, ăn uống, tiền bạc; bạn ngại thay đổi đột ngột.",
    pressure: "Dưới áp lực, Kim Ngưu cố thủ và chịu đựng lâu; khi bị dồn quá mức bạn có thể bướng, nên chủ động nghỉ ngơi, ăn ngủ đủ.",
  },
  { // Song Tử
    self: "Song Tử cho bạn vẻ lanh lợi, tò mò và nói chuyện có duyên; bạn dễ thích nghi và thường trông trẻ hơn tuổi.",
    money: "Song Tử kiếm tiền bằng nhiều nguồn nhỏ nhờ nói, viết và kết nối; dòng tiền linh hoạt nhưng dễ rải rác nếu thiếu kế hoạch.",
    mind: "Song Tử nghĩ nhanh, học rộng và thích nhiều thứ cùng lúc; điều cần để ý là hay dở dang và phân tán sự chú ý.",
    love: "Trong tình cảm, Song Tử cần người nói chuyện được và làm mình bớt chán; bạn thích sự vui vẻ nhẹ nhàng hơn những cảm xúc nặng nề.",
    work: "Song Tử hợp việc truyền thông, giảng dạy, bán hàng, công nghệ; bạn làm tốt khi có nhiều thay đổi và không bị trói vào một việc.",
    pressure: "Khi căng thẳng, Song Tử nghĩ quá nhiều và khó ngủ; viết ra giấy hoặc nói với người tin cậy giúp đầu óc gọn lại.",
  },
  { // Cự Giải
    self: "Cự Giải cho bạn vẻ mềm mại, nhạy cảm và hay quan tâm; bạn có lớp vỏ dè dặt, quen nhìn trước ngó sau khi gặp người lạ.",
    money: "Cự Giải coi tiền là sự an toàn cho gia đình; bạn tiết kiệm có ý thức, thích có nhà và khoản dự phòng, và dễ chi cho người thân.",
    mind: "Cự Giải nghĩ bằng cảm xúc và ký ức; bạn nhớ rất lâu điều từng làm mình vui hay buồn, và học tốt khi thấy an toàn.",
    love: "Trong tình cảm, Cự Giải chăm sóc và gắn bó sâu; bạn cần cảm giác được che chở và dễ tổn thương khi bị phớt lờ.",
    work: "Cự Giải hợp việc chăm sóc, giáo dục, ẩm thực, bất động sản hoặc những nghề cần lòng tin của người khác.",
    pressure: "Khi áp lực, Cự Giải rút vào vỏ và nghĩ ngợi nhiều; một nơi an toàn để về và một người chịu nghe là liều thuốc quan trọng.",
  },
  { // Sư Tử
    self: "Sư Tử cho bạn phong thái tự tin, ấm áp và dễ được chú ý; bạn có sức hút tự nhiên và cần được ghi nhận.",
    money: "Sư Tử thích chi cho thể diện, quà tặng và đồ chất lượng; bạn kiếm tiền tốt khi ở vị trí dẫn dắt, nhưng nên dè chừng chuyện sĩ diện.",
    mind: "Sư Tử nghĩ theo bức tranh lớn và nói có sức thuyết phục; bạn học tốt khi được tin tưởng và ghét bị chê trước đám đông.",
    love: "Trong tình cảm, Sư Tử rộng lượng, trung thành và cần được yêu thương rõ ràng; lòng tự trọng cao là điều nên nhẹ tay.",
    work: "Sư Tử hợp vai trò quản lý, biểu diễn, giáo dục, chính quyền; bạn làm tốt nhất khi có quyền quyết định và đội nhóm tin mình.",
    pressure: "Dưới áp lực, Sư Tử giữ dáng vẻ mạnh mẽ dù trong lòng đã mệt; chịu nói ra điều mình cần sẽ nhẹ hơn nhiều so với tự gồng.",
  },
  { // Xử Nữ
    self: "Xử Nữ cho bạn vẻ gọn gàng, chu đáo và kín đáo; bạn nhìn ra chi tiết người khác bỏ sót và thường khắt khe với chính mình.",
    money: "Xử Nữ quản tiền cẩn thận, biết tính từng khoản; điều cần để ý là lo xa quá mức và tiếc chi cho bản thân.",
    mind: "Xử Nữ phân tích sắc, học có hệ thống và thích hoàn thiện; bạn hay nghĩ quá chi tiết nên dễ mệt đầu.",
    love: "Trong tình cảm, Xử Nữ thể hiện bằng việc làm thiết thực như lo ăn uống, lo sức khỏe cho người kia; đôi khi bạn soi lỗi nhiều hơn khen.",
    work: "Xử Nữ hợp việc cần độ chính xác như kế toán, y tế, kỹ thuật, biên tập; bạn là người khiến mọi thứ vận hành trơn tru.",
    pressure: "Khi áp lực, Xử Nữ lo lắng và tự trách; một danh sách việc rõ ràng, giấc ngủ đều và vận động nhẹ giúp bạn bình tĩnh lại.",
  },
  { // Thiên Bình
    self: "Thiên Bình cho bạn vẻ hòa nhã, dễ mến và biết cân nhắc; bạn có gu thẩm mỹ và ghét sự thô lỗ, xung đột.",
    money: "Thiên Bình kiếm tiền nhờ quan hệ và gu thẩm mỹ; bạn dễ chi cho cái đẹp và sự dễ chịu nên cần đặt ngân sách rõ ràng.",
    mind: "Thiên Bình nhìn được cả hai phía của mọi vấn đề; điều cần để ý là sự chần chừ mỗi khi phải chọn.",
    love: "Trong tình cảm, Thiên Bình cần sự hài hòa và công bằng; bạn thật lòng muốn gắn bó nhưng ngại nói điều khó nghe.",
    work: "Thiên Bình hợp việc đàm phán, thiết kế, luật, tư vấn, quan hệ công chúng; bạn làm tốt trong cặp đôi hoặc nhóm nhỏ.",
    pressure: "Khi áp lực, Thiên Bình tránh đối đầu và mong người khác dàn xếp; tập nói rõ nhu cầu của mình là bước rèn luyện quan trọng.",
  },
  { // Thiên Yết
    self: "Thiên Yết cho bạn vẻ trầm, sâu và kín đáo; người khác khó đoán bạn nghĩ gì nhưng cảm nhận được sức mạnh ngầm.",
    money: "Thiên Yết quản tiền kín đáo, thích kiểm soát và nhìn ra cơ hội ở chỗ người khác bỏ qua; chuyện tiền chung với người khác cần minh bạch.",
    mind: "Thiên Yết nghĩ sâu, thích đào tận gốc và nghi ngờ lời nói bề mặt; trực giác của bạn về con người thường khá chính xác.",
    love: "Trong tình cảm, Thiên Yết yêu mãnh liệt và đòi hỏi sự trung thực trọn vẹn; ghen và giữ vết thương lâu là điều cần để ý.",
    work: "Thiên Yết hợp việc nghiên cứu, điều tra, tâm lý, tài chính, y khoa; bạn bền gan và ít khi bỏ cuộc giữa chừng.",
    pressure: "Dưới áp lực, Thiên Yết im lặng và dồn nén; bạn hồi phục mạnh sau khủng hoảng nhưng nên có chỗ để nói ra thay vì tự gánh.",
  },
  { // Nhân Mã
    self: "Nhân Mã cho bạn vẻ lạc quan, cởi mở và thích tự do; bạn nói thẳng, thích đi và thích khám phá.",
    money: "Nhân Mã tin rằng tiền rồi sẽ đến nên hay lạc quan quá mức; bạn hào phóng và may mắn ở những thứ liên quan đến học tập, du lịch.",
    mind: "Nhân Mã nghĩ rộng, thích triết lý, đạo lý và bức tranh toàn cảnh; chi tiết nhỏ đôi khi bị bỏ qua.",
    love: "Trong tình cảm, Nhân Mã cần không gian và sự thẳng thắn; bạn yêu chân thành nhưng ngại bị ràng buộc.",
    work: "Nhân Mã hợp việc giảng dạy, xuất bản, luật, du lịch, tư vấn; bạn làm tốt khi công việc có ý nghĩa lớn hơn đồng lương.",
    pressure: "Khi áp lực, Nhân Mã tìm lối thoát bằng việc di chuyển hoặc niềm tin; niềm tin giúp bạn đứng dậy, nhưng đừng bỏ qua việc thực tế.",
  },
  { // Ma Kết
    self: "Ma Kết cho bạn vẻ nghiêm túc, chín chắn và kiệm lời; bạn thường già dặn hơn tuổi và sớm quen với việc tự gánh.",
    money: "Với tiền bạc, Ma Kết xây từng viên gạch: kiên nhẫn, tiết kiệm và nghĩ dài hơi; bạn ngại rủi ro và ghét mắc nợ.",
    mind: "Ma Kết nghĩ có cấu trúc, thực tế và có kế hoạch; bạn học chậm mà chắc, và tôn trọng kinh nghiệm hơn lý thuyết.",
    love: "Trong tình cảm, Ma Kết chậm mở lòng nhưng một khi đã chọn thì rất bền; bạn ít nói lời hoa mỹ, thể hiện qua trách nhiệm.",
    work: "Ma Kết hợp quản trị, xây dựng, tài chính, hành chính; bạn leo từng bậc, thành quả đến muộn nhưng ít khi sụp.",
    pressure: "Khi áp lực, Ma Kết làm việc nhiều hơn và nói ít lại; điều cần học là cho phép mình nghỉ và nhờ người khác giúp.",
  },
  { // Bảo Bình
    self: "Bảo Bình cho bạn vẻ độc lập, khác biệt và hơi xa cách; bạn có cách nghĩ riêng và không thích bị gò vào khuôn.",
    money: "Bảo Bình kiếm tiền từ ý tưởng, công nghệ, cộng đồng; bạn không quá gắn bó với vật chất nhưng nên có hệ thống theo dõi chi tiêu.",
    mind: "Bảo Bình nghĩ sáng tạo, nhìn xa và thích ý tưởng mới lạ; bạn có thể cứng đầu khi đã tin vào một nguyên tắc.",
    love: "Trong tình cảm, Bảo Bình cần tình bạn và sự tôn trọng tự do; bạn thương người bằng lý trí nhiều hơn là những biểu lộ nồng nhiệt.",
    work: "Bảo Bình hợp công nghệ, khoa học, tổ chức xã hội, thiết kế hệ thống; bạn làm tốt khi mục tiêu phục vụ được nhiều người.",
    pressure: "Dưới áp lực, Bảo Bình lùi lại để quan sát; bạn bình tĩnh nhưng đôi khi lạnh, nên chủ động chia sẻ cảm xúc với người thân.",
  },
  { // Song Ngư
    self: "Song Ngư cho bạn vẻ dịu dàng, giàu cảm xúc và dễ cảm thông; bạn thấm bầu không khí xung quanh rất nhanh.",
    money: "Song Ngư dễ cho đi và ít thích tính toán; bạn cần một cách tiết kiệm tự động để tiền không trôi theo cảm xúc.",
    mind: "Song Ngư nghĩ bằng hình ảnh và trực giác; bạn sáng tạo, giàu tưởng tượng nhưng khó chịu với những việc quá khô khan.",
    love: "Trong tình cảm, Song Ngư lãng mạn và sẵn sàng hy sinh; hãy cẩn thận đừng lý tưởng hóa người kia mà quên nhu cầu của mình.",
    work: "Song Ngư hợp nghệ thuật, chữa lành, giáo dục, tâm lý, từ thiện; bạn làm tốt khi công việc chạm vào con người.",
    pressure: "Khi áp lực, Song Ngư dễ trốn vào mơ mộng hoặc thu mình; thiền, âm nhạc, thiên nhiên và nhịp sinh hoạt đều là chỗ dựa.",
  },
];

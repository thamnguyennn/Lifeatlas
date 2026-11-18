// Hand-written reading atoms, part 5: the Lagna (rising sign), where its lord sits, the 27 nakshatras,
// and the Moon's phase at birth. Concise v3.0 edition.

/** One concise paragraph per rising sign (index 0 = Bạch Dương). */
export const LAGNA_SIGN: string[] = [
  "Cung mọc Bạch Dương cho bạn phong thái thẳng thắn, nhanh nhẹn và giàu sức bật. Bạn dám mở đường và không thích vòng vo; bài toán lớn là rèn thêm sự kiên nhẫn để giữ sức bền trên chặng đường dài.",
  "Cung mọc Kim Ngưu tạo dáng vẻ điềm đạm, vững chãi và đáng tin cậy. Bạn thích bước chậm mà chắc, có gu thẩm mỹ và trọng thực tế; chỉ cần lưu tâm giữ sự linh hoạt trước những thay đổi mới.",
  "Cung mọc Song Tử mang nét lanh lợi, cởi mở và giàu trí tò mò. Bạn tiếp thu nhanh, trò chuyện có duyên và dễ thích nghi; điều quan trọng là chọn một hướng trọng tâm để theo đuổi tới cùng.",
  "Cung mọc Cự Giải cho bạn vẻ hiền hòa, chu đáo và giàu sự thấu cảm. Bạn gắn bó sâu với gia đình và người thân, luôn cần một điểm tựa an toàn trong lòng trước khi vươn rộng ra thế giới.",
  "Cung mọc Sư Tử tạo phong thái đĩnh đạc, ấm áp và có sức hút tự nhiên. Bạn sống trọng danh dự, thích làm việc có ý nghĩa và phát huy tốt nhất khi dùng sự tự tin để nâng đỡ người xung quanh.",
  "Cung mọc Xử Nữ mang vẻ chỉn chu, tinh tế và cẩn trọng trong từng chi tiết. Bạn có óc phân tích sắc bén và làm việc có trách nhiệm, chỉ cần bớt khắt khe với những điều chưa thật hoàn hảo.",
  "Cung mọc Thiên Bình cho bạn phong thái ôn hòa, lịch thiệp và biết lắng nghe. Bạn có khiếu kết nối và giữ nhịp cân bằng, nhưng cần tập nói rõ chính kiến riêng ngay cả khi sợ làm mất lòng ai đó.",
  "Cung mọc Thiên Yết tạo nét trầm tĩnh, kín đáo và ánh nhìn thấu suốt. Bạn có nội lực bền bỉ và khả năng tái tạo mạnh mẽ sau thử thách, chỉ cần tập buông nhẹ những chuyện đã qua.",
  "Cung mọc Nhân Mã mang vẻ phóng khoáng, chân thành và luôn nhìn về phía trước. Bạn yêu tự do, có tầm nhìn rộng và phát triển mạnh nhất khi gắn lý tưởng của mình vào kỷ luật thực tế.",
  "Cung mọc Ma Kết cho bạn dáng vẻ chín chắn, điềm tĩnh và đáng cậy nhờ. Bạn quen tự lập và bền bỉ gánh vác việc khó, nhưng đừng quên cho phép bản thân được nghỉ ngơi và sẻ chia gánh nặng.",
  "Cung mọc Bảo Bình tạo phong thái độc lập, tỉnh táo và có góc nhìn rất riêng. Bạn trọng sự công bằng, giàu ý tưởng mới mẻ và chạm tới chiều sâu nhất khi nối kết tư duy ấy với tình cảm con người.",
  "Cung mọc Song Ngư mang vẻ dịu dàng, nhạy cảm và giàu trực giác. Bạn dễ đồng cảm và giàu sức sáng tạo, chỉ cần giữ cho mình những ranh giới rõ ràng để không bị cuốn theo cảm xúc xung quanh.",
];

/** One short paragraph per nakshatra (index 0 = Ashwini). */
export const NAKSHATRA_TEXT: string[] = [
  "Ashwini là ngôi sao của khởi đầu và tốc độ: bạn nhanh nhẹn, thích mở lối mới và có khả năng chữa lành, chỉ cần tránh nóng vội.",
  "Bharani là ngôi sao của sức chịu đựng và sáng tạo: bạn gánh vác được việc lớn nhưng cần biết chia sẻ thay vì ôm hết một mình.",
  "Krittika là ngôi sao của ngọn lửa sắc bén: bạn thẳng thắn, chuẩn mực cao và ghét sự giả dối, chỉ cần mềm mỏng hơn khi góp ý.",
  "Rohini là ngôi sao của sự sinh sôi: bạn có duyên, yêu cái đẹp và làm gì cũng muốn vun bồi cho đầy đặn, bền vững.",
  "Mrigashira là ngôi sao của người tìm kiếm: bạn tò mò, nhạy bén và nên chọn một lĩnh vực cốt lõi để đào thật sâu.",
  "Ardra là ngôi sao của cơn mưa lớn chuyển hóa: những lần vượt qua xáo trộn giúp bạn thấu hiểu sâu sắc và bản lĩnh hơn.",
  "Punarvasu là ngôi sao của sự hồi sinh: bạn lạc quan, hiền hòa và luôn biết cách đứng dậy nhẹ nhàng sau mỗi thử thách.",
  "Pushya là ngôi sao của sự nuôi dưỡng: bạn sống có kỷ luật, biết chăm lo cho tập thể và thường là chỗ dựa đáng tin cậy.",
  "Ashlesha là ngôi sao của trực giác sắc sảo: bạn nhìn thấu động cơ ẩn giấu và cần giữ sự cởi mở để lòng nhẹ nhõm hơn.",
  "Magha là ngôi sao của vị thế và truyền thống: bạn trọng danh dự, có phong thái dẫn dắt và luôn nhớ về cội nguồn.",
  "Purva Phalguni là ngôi sao của niềm vui và nghệ thuật: bạn ấm áp, hào phóng và cần cân bằng giữa tận hưởng với kỷ luật.",
  "Uttara Phalguni là ngôi sao của cam kết bền vững: bạn trọng chữ tín, hay giúp người và rất hợp những mối hợp tác dài lâu.",
  "Hasta là ngôi sao của đôi tay khéo léo: bạn tháo vát, thực tế và biết biến ý tưởng thành sản phẩm tinh gọn, rõ ràng.",
  "Chitra là ngôi sao của người nghệ nhân: bạn có thẩm mỹ sắc sảo và luôn muốn tạo nên những công trình có dấu ấn riêng.",
  "Swati là ngôi sao của ngọn gió tự chủ: bạn mềm dẻo, độc lập và phát triển rất tốt trong môi trường cần sự linh hoạt.",
  "Vishakha là ngôi sao của mục tiêu: bạn bền chí, tập trung cao độ và sẵn sàng đi đường dài để chạm tới đích đã chọn.",
  "Anuradha là ngôi sao của sự gắn kết: bạn trọng tình nghĩa, có tài tổ chức và giữ được những mối quan hệ bền chặt.",
  "Jyeshtha là ngôi sao của người gánh vác: bạn sắc sảo, có bản lĩnh bảo bọc người khác nhưng cần tránh tự gây áp lực quá mức.",
  "Mula là ngôi sao của gốc rễ: bạn luôn muốn đi tới tận cùng bản chất sự việc và không ngại làm mới từ nền tảng.",
  "Purva Ashadha là ngôi sao của dòng nước mở đường: bạn giàu sức thuyết phục, kiên định với niềm tin và khó bị khuất phục.",
  "Uttara Ashadha là ngôi sao của thành tựu bền vững: bạn sống có nguyên tắc và thường gặt hái quả ngọt chắc chắn về sau.",
  "Shravana là ngôi sao của sự lắng nghe: bạn thấu hiểu nhanh, học sâu và có tài kết nối tri thức với con người.",
  "Dhanishta là ngôi sao của nhịp điệu và sung túc: bạn nhạy bén thời cuộc, giỏi phối hợp tập thể và làm việc có nhịp độ rõ ràng.",
  "Shatabhisha là ngôi sao của trăm vị thuốc: bạn độc lập, thích nghiên cứu sâu và có khả năng tháo gỡ những bài toán hóc búa.",
  "Purva Bhadrapada là ngôi sao của ngọn lửa lý tưởng: bạn quyết liệt, sâu sắc và luôn muốn cuộc sống mình hướng về một giá trị lớn.",
  "Uttara Bhadrapada là ngôi sao của đại dương tĩnh tại: bạn điềm đạm, chín chắn và có nội lực chịu đựng rất sâu.",
  "Revati là ngôi sao của sự viên mãn và che chở: bạn giàu lòng nhân ái, tinh tế và cần giữ ranh giới để bảo vệ sức lực của mình.",
];

export const MOON_PHASE_AT_BIRTH = {
  new: "Bạn sinh vào kỳ trăng non tĩnh lặng (Mặt Trăng đứng gần Mặt Trời), nên ý chí và cảm xúc chụm về một hướng, tạo sự tập trung nội tâm rất cao.",
  waxing: "Bạn sinh vào kỳ trăng thượng huyền đang tròn dần (Shukla Paksha), mang lại nguồn cảm xúc hướng về sự bồi đắp, học hỏi và mở rộng.",
  full: "Bạn sinh vào kỳ trăng tròn viên mãn (Purnima), khi Mặt Trăng đối diện Mặt Trời: đời sống tình cảm và nhận thức đều sáng rõ, nhạy bén.",
  waning: "Bạn sinh vào kỳ trăng hạ huyền đang vơi dần (Krishna Paksha), trao cho bạn độ lắng chiêm nghiệm, biết chắt lọc những gì thực sự cốt lõi.",
};

// Hand-written reading atoms, part 6: the 27 nakshatras seen from four places.
// soul   = the Moon here: what it is like inside you
// face   = the Lagna here: what people sense first
// quest  = Rahu here: what the hunger looks like
// memory = Ketu here: what you already know how to do, and what no longer excites you
// Index 0 = Ashwini. Voice rules are in STYLE.md.

export interface NakshatraRoles { soul: string; face: string; quest: string; memory: string }

export const NAK: NakshatraRoles[] = [
  { // 0 Ashwini
    soul: "Bên trong bạn phản ứng nhanh, thương nhanh và quên nhanh. Thấy ai đau, bạn muốn làm gì đó ngay, và dễ bứt rứt khi phải chờ. Ashwini là thầy thuốc đầu tiên chạy đến nơi; điều cần tập là kiên nhẫn đi hết một ca khó chứ không chỉ ca cấp cứu.",
    face: "Người ta thấy ở bạn sự nhanh nhẹn và dễ bắt đầu, đôi khi hơi vội, như người lúc nào cũng sẵn sàng chạy.",
    quest: "Rahu ở chòm sao Ashwini cho thấy bạn khao khát được là người đến trước, mở đường, xử lý việc gấp. Bạn hay khởi động nhiều việc và hụt hơi ở đoạn giữa.",
    memory: "Ketu ở chòm sao Ashwini mang theo bản năng chữa lành và khởi xướng. Bắt đầu cái mới dễ như thở nên khởi đầu không còn làm bạn hứng.",
  },
  { // 1 Bharani
    soul: "Bạn mang nhiều hơn những gì người ta thấy. Bạn nhận về mình những gánh người khác né, và nhạy với chuyện cam kết, giới hạn, kết thúc. Bharani thuộc về Yama, người giữ cán cân, nên bạn hay chịu lâu rồi quyết một lần dứt khoát. Điều cần tập là cho phép mình nhẹ lại.",
    face: "Người ta cảm nhận ở bạn sức nặng và sự đáng tin, một người giữ lời và chịu được chuyện khó.",
    quest: "Rahu ở chòm sao Bharani cho thấy bạn khao khát trải nghiệm sâu và cực đoan: yêu hết mình, chịu hết mình. Bài học là biết giới hạn của chính mình.",
    memory: "Ketu ở Bharani mang kinh nghiệm gánh vác và đi qua những chu kỳ kết thúc. Bạn ít sợ chuyện nặng nề, và dễ nhận thêm phần của người khác.",
  },
  { // 2 Krittika
    soul: "Bên trong bạn có một lưỡi dao sáng: thấy ngay chỗ sai, chỗ giả, chỗ lỏng. Nó giúp bạn gọt bỏ cái thừa, và cũng làm bạn khắt khe với mình và người khác hơn mức cần. Krittika là ngọn lửa tinh luyện; hãy dùng nó để lọc cho trong chứ đừng dùng để cắt người.",
    face: "Người ta thấy ở bạn sự thẳng, sắc và có chính kiến, đôi khi hơi gắt khi chưa đồng ý.",
    quest: "Rahu ở chòm sao Krittika cho thấy bạn khao khát sự rõ ràng và được công nhận là người đúng. Bài học là sắc mà không làm người khác tổn thương.",
    memory: "Ketu ở chòm sao Krittika mang theo khả năng phân định đúng sai và thanh lọc. Bạn phê bình nhanh, và đã thôi thấy hào hứng với việc phán xét.",
  },
  { // 3 Rohini
    soul: "Bên trong bạn cần đẹp, đủ và êm: một chỗ ngồi thoải mái, bữa ăn ngon, người dễ thương. Bạn nuôi lớn mọi thứ mình chạm vào, từ cái cây đến một mối quan hệ. Rohini là sao Mặt Trăng yêu nhất, nên cảm xúc của bạn phong phú và dễ bám. Điều cần tập là buông khi thứ mình yêu cần đi tiếp.",
    face: "Người ta thấy ở bạn sự dễ mến, vẻ quyến rũ tự nhiên và một chút thích hưởng thụ.",
    quest: "Rahu ở chòm sao Rohini cho thấy bạn khao khát sự thỏa mãn giác quan và sung túc. Càng có càng thèm, nên bài học là phân biệt đủ với thừa.",
    memory: "Ketu ở chòm sao Rohini mang theo vẻ quyến rũ và một đời sống đủ đầy từ trước. Bạn ít bị vật chất cuốn hơn người ngoài tưởng.",
  },
  { // 4 Mrigashira
    soul: "Bên trong bạn là người tìm kiếm: luôn có điều gì chưa tìm thấy, một câu hỏi khẽ vẫn để ngỏ. Bạn tò mò, nhạy, hay dè dặt như con nai ngửi gió trước khi bước. Mrigashira là sao của cuộc tìm; điều cần tập là dừng lại ăn khi đã tới đồng cỏ.",
    face: "Người ta thấy ở bạn sự dịu, tò mò và hơi khó nắm, như người lúc nào cũng đang nhìn về một nơi khác.",
    quest: "Rahu ở chòm sao Mrigashira cho thấy bạn khao khát cuộc tìm không dứt. Bài học là chọn một nơi để ở lại thay vì mãi dò đường.",
    memory: "Ketu ở chòm sao Mrigashira mang theo thói quen tìm tòi và thám hiểm. Bạn đã đi qua nhiều ngã nên không còn say mê việc tìm.",
  },
  { // 5 Ardra
    soul: "Bên trong bạn có thời tiết: bão cảm xúc đến, bạn khóc, rồi trời quang. Bạn hiểu nỗi đau vì từng đi qua nó, và đầu óc sắc nhất vào lúc khó nhất. Ardra thuộc Rudra, vị thần của giông; sau mỗi trận bạn thường đổi hẳn một phần cách sống. Điều cần tập là đừng tự gây bão để thấy mình đang sống.",
    face: "Người ta thấy ở bạn sự sắc sảo, hơi khó đoán, và một chiều sâu cảm xúc đến bất ngờ.",
    quest: "Rahu ở chòm sao Ardra cho thấy bạn khao khát cường độ: những chuyển động lớn, những chuyện dữ dội. Bài học là học từ biến cố mà không đi tìm biến cố.",
    memory: "Ketu ở chòm sao Ardra mang theo trí tuệ sinh ra từ đau khổ và kinh nghiệm phá bỏ để làm mới. Bạn quen những chuyện dữ dội nên ít hoảng khi có biến.",
  },
  { // 6 Punarvasu
    soul: "Bên trong bạn có xu hướng trở về: sau mỗi lần đổ vỡ, bạn đứng dậy, tin lại, bắt đầu lại. Bạn cần một nơi để về, và đối xử tốt với người từng làm mình đau hơn người ta nghĩ. Punarvasu thuộc Aditi, mẹ của sự vô hạn; điều cần tập là đừng tha thứ nhanh đến mức bỏ qua nhu cầu của mình.",
    face: "Người ta thấy ở bạn sự lạc quan, gần gũi và dễ tin, như người lúc nào cũng có sẵn kế hoạch B.",
    quest: "Rahu ở chòm sao Punarvasu cho thấy bạn khao khát sự làm lại và một chốn thuộc về. Bài học là ở lại và xây một chỗ ổn định thay vì mãi dọn đi.",
    memory: "Ketu ở chòm sao Punarvasu mang theo khả năng hồi phục và tin tưởng trở lại. Bạn đã bắt đầu lại nhiều lần nên không ngại thay đổi.",
  },
  { // 7 Pushya
    soul: "Bên trong bạn là người nuôi dưỡng: hễ ai bên cạnh cần ăn, cần nghe, cần chỗ dựa, bạn tự đứng ra. Pushya được coi là sao lành nhất, và cũng dễ biến thành người luôn cho đi rồi quên mình. Điều cần tập là để mình cũng được chăm.",
    face: "Người ta thấy ở bạn sự đáng tin, hiền, hơi nghiêm túc, đúng người họ tìm đến khi cần lời khuyên.",
    quest: "Rahu ở chòm sao Pushya cho thấy bạn khao khát vai người chăm sóc và người thầy. Bài học là cho mà không để người khác sinh ra phụ thuộc.",
    memory: "Ketu ở chòm sao Pushya mang theo bản năng nuôi dưỡng và dạy dỗ. Bạn thạo chăm người khác và hay quên chăm mình.",
  },
  { // 8 Ashlesha
    soul: "Bên trong bạn là người đọc được tâm lý: nghe ra điều người ta chưa nói, thấy động cơ sau lời hay. Vì thế bạn cẩn trọng, đôi khi nghi, và giữ khoảng cách để tự bảo vệ. Ashlesha là con rắn cuộn mình, vừa chữa lành vừa có thể cắn. Điều cần tập là tin thêm một người mà không kiểm tra họ trước.",
    face: "Người ta thấy ở bạn sự kín đáo, tinh nhạy và một chút bí ẩn; khó biết bạn đang nghĩ gì.",
    quest: "Rahu ở chòm sao Ashlesha cho thấy bạn khao khát sự hiểu thấu và nắm được tâm lý người khác. Bài học là dùng trực giác để thương, không để giữ thế trên.",
    memory: "Ketu ở chòm sao Ashlesha mang theo năng lực nhìn thấu động cơ và kiến thức kín. Bạn không còn dễ bị lừa, và cũng khó tin.",
  },
  { // 9 Magha
    soul: "Bên trong bạn có cảm giác về dòng họ và vị thế: mình thuộc về một điều có trước mình, và phải xứng với nó. Bạn có phẩm cách và dễ tổn thương khi bị coi nhẹ. Magha là chiếc ngai của tổ tiên; điều cần tập là bước ra khỏi cái bóng của người đi trước để có chỗ ngồi của riêng mình.",
    face: "Người ta thấy ở bạn phong thái có uy, ấm mà hơi cao, như người quen được tôn trọng.",
    quest: "Rahu ở chòm sao Magha cho thấy bạn khao khát địa vị và sự công nhận của dòng họ. Bài học là tự dựng vị thế bằng giá trị của riêng mình.",
    memory: "Ketu ở chòm sao Magha mang theo quyền uy và điều tốt thừa hưởng từ dòng họ. Bạn từng có địa vị nên ít còn say mê danh hiệu.",
  },
  { // 10 Purva Phalguni
    soul: "Bên trong bạn cần được nghỉ, được vui, được yêu theo cách thoải mái. Bạn giỏi tạo không khí thân mật, và hay lỡ việc vì lúc đó chưa có hứng. Purva Phalguni thuộc Bhaga, vị thần của phước và sự thưởng thức. Điều cần tập là để niềm vui nuôi công việc chứ không thay nó.",
    face: "Người ta thấy ở bạn sự duyên dáng, ấm áp, dễ chịu, và một chút lười đáng yêu.",
    quest: "Rahu ở chòm sao Purva Phalguni cho thấy bạn khao khát được yêu mến và được nghỉ ngơi xứng đáng. Bạn dễ được lòng người nên dễ gặp thuận lợi, và bài học là biến sức hút của mình thành việc làm có kết quả.",
    memory: "Ketu ở chòm sao Purva Phalguni mang theo duyên và nghệ thuật thưởng thức. Bạn từng sống nhiều trong vui chơi nên ít bị chúng lôi cuốn.",
  },
  { // 11 Uttara Phalguni
    soul: "Bên trong bạn đáng tin theo cách rất lặng: đã hứa thì giữ, đã nhận giúp thì giúp đến nơi. Bạn muốn một quan hệ bền, có giao ước ngầm hiểu, và nặng lòng khi người kia không giữ phần mình. Uttara Phalguni là sao của giao ước; điều cần tập là đòi lại phần công bằng cho mình.",
    face: "Người ta thấy ở bạn sự tử tế, chắc chắn và sẵn lòng giúp, đúng người để nhờ vả.",
    quest: "Rahu ở chòm sao Uttara Phalguni cho thấy bạn khao khát một mối gắn bó bền và vai người hỗ trợ được trân trọng. Bài học là giúp mà có ranh giới.",
    memory: "Ketu ở chòm sao Uttara Phalguni mang theo tinh thần giữ ước và giúp đỡ. Bạn quen làm người đáng tin, và dễ mệt vì thế.",
  },
  { // 12 Hasta
    soul: "Bên trong bạn có đôi tay thông minh: học nhanh bằng cách làm, xoay xở khéo, hóm hỉnh. Bạn cần việc cho tay hoặc cho đầu mới thấy yên, và hay sửa mọi thứ, kể cả chuyện chưa ai nhờ. Hasta là bàn tay của Savitar, vị thần mặt trời tạo tác. Điều cần tập là đừng chỉ giữ mình bận.",
    face: "Người ta thấy ở bạn sự khéo, nhanh trí, có duyên hài hước và hay để ý chi tiết.",
    quest: "Rahu ở chòm sao Hasta cho thấy bạn khao khát tay nghề và khả năng xoay xở hoàn hảo. Bài học là làm tốt mà không kiểm soát mọi thứ.",
    memory: "Ketu ở chòm sao Hasta mang theo tay nghề và sự khéo léo. Bạn làm được nhiều thứ nên ít thấy thử thách trong chúng.",
  },
  { // 13 Chitra
    soul: "Bên trong bạn muốn tạo ra thứ lộng lẫy và đúng khẩu vị: không chỉ tốt mà phải có hình, có gu, có dấu ấn. Bạn tinh về thẩm mỹ và thích nhìn một thứ trở thành tác phẩm. Chitra thuộc người thợ của các vị thần; điều cần tập là cho phép mình đưa ra thứ chưa hoàn mỹ.",
    face: "Người ta thấy ở bạn sức thu hút, gu rõ ràng, một vẻ hoàn chỉnh khiến họ nhìn lâu.",
    quest: "Rahu ở chòm sao Chitra cho thấy bạn khao khát sự xuất sắc và hình ảnh đẹp. Bài học là để giá trị nằm ở phần thật, đừng chỉ ở phần đẹp.",
    memory: "Ketu ở chòm sao Chitra mang theo năng khiếu thiết kế và thẩm mỹ. Bạn dễ tạo ra cái đẹp nên ít bị vẻ hào nhoáng lôi cuốn.",
  },
  { // 14 Swati
    soul: "Bên trong bạn cần gió: không gian, quyền tự chọn, được đi theo nhịp của mình. Bạn mềm dẻo khi bị ép và vững hơn khi được tự do. Swati là cây non lay theo gió mà vẫn bén rễ. Điều cần tập là chọn một nơi để bén rễ, thay vì chỉ thích nghi.",
    face: "Người ta thấy ở bạn sự linh hoạt, độc lập, hơi xa và rất khó ép.",
    quest: "Rahu ở chòm sao Swati cho thấy bạn khao khát tự do và độc lập. Bài học là tự do trong cam kết, thay vì tự do nhờ tránh cam kết.",
    memory: "Ketu ở chòm sao Swati mang theo sự độc lập và thói quen đi theo gió. Bạn quen đi một mình và ít cần ai giữ.",
  },
  { // 15 Vishakha
    soul: "Bên trong bạn có một mục tiêu không chịu buông: đã nhắm là đi đến cùng, bỏ qua nhiều thứ dọc đường. Bạn kiên quyết, và có chút ganh thầm với người đến đích trước. Vishakha là cổng chiến thắng nơi nhiều con đường gặp nhau. Điều cần tập là nhìn người đồng hành, không chỉ nhìn đích.",
    face: "Người ta thấy ở bạn sự quyết tâm, tập trung và đôi khi mãnh liệt.",
    quest: "Rahu ở chòm sao Vishakha cho thấy bạn khao khát chiến thắng và đích đến. Bài học là biết hưởng cả quãng đường.",
    memory: "Ketu ở chòm sao Vishakha mang theo sức kiên trì đạt mục tiêu. Bạn từng thắng nhiều nên thành công ít còn làm bạn rạo rực.",
  },
  { // 16 Anuradha
    soul: "Bên trong bạn là người bạn trung thành: nhớ ngày quan trọng, ở lại khi người khác đi, giữ tình bạn qua nhiều năm. Bạn cũng hay có nỗi buồn lặng khi xa nhà hoặc xa người thương. Anuradha là hoa sen nở trong bùn, và bạn thường lớn lên ở nơi không phải quê. Điều cần tập là nói ra khi mình cô đơn.",
    face: "Người ta thấy ở bạn sự thân thiện, kỷ luật và một chiều sâu cảm xúc kín đáo.",
    quest: "Rahu ở chòm sao Anuradha cho thấy bạn khao khát tình bạn sâu và một cộng đồng đúng. Bài học là kết nối mà không bám.",
    memory: "Ketu ở chòm sao Anuradha mang theo lòng trung thành và khả năng hợp tác. Bạn từng có nhiều bạn nhiều thầy nên ít cần thêm.",
  },
  { // 17 Jyeshtha
    soul: "Bên trong bạn là người anh cả, dù thứ tự sinh của bạn thế nào: hay đứng ra bảo vệ, gánh trách nhiệm và hơi cô đơn ở vị trí đó. Bạn muốn được công nhận là người giỏi nhất và âm thầm sợ bị qua mặt. Jyeshtha thuộc Indra, vị vua có nhiều đối thủ. Điều cần tập là để người khác phụ giúp.",
    face: "Người ta thấy ở bạn sự mạnh mẽ, có thế đứng, đôi khi hơi áp đảo.",
    quest: "Rahu ở chòm sao Jyeshtha cho thấy bạn khao khát quyền lực và sự công nhận là người đứng đầu. Bài học là bảo vệ mà không kiểm soát.",
    memory: "Ketu ở chòm sao Jyeshtha mang theo quyền lực và tính bảo vệ. Bạn từng dẫn đầu nên ít còn say mê chức vị.",
  },
  { // 18 Mula
    soul: "Bên trong bạn muốn tìm tận gốc: đào xuống dưới lớp lời lẽ để thấy sự thật, kể cả khi nó làm đổ thứ đang đứng. Bạn có thể trải qua những lần mọi thứ bị nhổ lên để dựng lại. Mula là cái rễ, và rễ chỉ lộ khi đất bị xới. Điều cần tập là tin rằng mình vẫn đứng được khi mất chỗ dựa.",
    face: "Người ta thấy ở bạn sự thẳng, sâu, và hơi khó lường khi bạn đã quyết thay đổi.",
    quest: "Rahu ở chòm sao Mula cho thấy bạn khao khát sự thật tận gốc và làm lại từ đầu. Bài học là phá bỏ có chọn lọc.",
    memory: "Ketu ở chòm sao Mula mang theo năng lực đào tận gốc và buông bỏ. Bạn quen mất mát nên khá bình tĩnh khi mọi thứ đổi thay.",
  },
  { // 19 Purva Ashadha
    soul: "Bên trong bạn có niềm tin như nước: bền, lôi cuốn, khó dập. Bạn nói điều mình tin một cách thuyết phục và ghét bị cắt ngang. Purva Ashadha là sao của sự bất bại; điều cần tập là lắng nghe thêm trước khi tuyên bố.",
    face: "Người ta thấy ở bạn sự tự tin, nhiệt tình và sức thuyết phục.",
    quest: "Rahu ở chòm sao Purva Ashadha cho thấy bạn khao khát niềm tin vào chiến thắng và sức thuyết phục. Bài học là thắng mà vẫn dịu với người khác.",
    memory: "Ketu ở chòm sao Purva Ashadha mang theo niềm tin khó bị đánh bại. Bạn quen sức mạnh của lời nói nên ít cần chứng tỏ.",
  },
  { // 20 Uttara Ashadha
    soul: "Bên trong bạn chậm mà chắc: không vội nhận công, nhưng việc đã nhận thì không bỏ. Bạn có nguyên tắc rõ và thường phải chờ lâu mới được ghi nhận. Uttara Ashadha là chiến thắng muộn của người giữ đạo lý. Điều cần tập là tin rằng chậm chưa phải là thua.",
    face: "Người ta thấy ở bạn sự nghiêm túc, đáng kính và kiên nhẫn.",
    quest: "Rahu ở chòm sao Uttara Ashadha cho thấy bạn khao khát sự công nhận chính đáng và danh tiếng bền. Bài học là kiên nhẫn mà không so sánh.",
    memory: "Ketu ở chòm sao Uttara Ashadha mang theo tính chính trực và kiên nhẫn. Bạn từng giữ đạo lý nên ít bị đường tắt cám dỗ.",
  },
  { // 21 Shravana
    soul: "Bên trong bạn là người nghe: học bằng tai, nhớ lâu điều ai đó từng nói, nhạy với giọng điệu hơn với nội dung. Bạn kết nối bằng việc lắng nghe, và cũng dễ gom nỗi niềm của người khác về mình. Shravana là sao của tri thức truyền miệng; điều cần tập là chọn điều đáng giữ lại để nghe.",
    face: "Người ta thấy ở bạn sự chăm chú, lịch sự, một người nghe thật.",
    quest: "Rahu ở chòm sao Shravana cho thấy bạn khao khát tri thức và một tiếng nói được lắng nghe. Bài học là biết điều gì đáng nhớ.",
    memory: "Ketu ở chòm sao Shravana mang theo trí nhớ và khả năng lắng nghe. Bạn từng học từ nhiều thầy nên ít say mê thông tin mới.",
  },
  { // 22 Dhanishta
    soul: "Bên trong bạn có nhịp điệu: nhạy với âm thanh, thời điểm và sự ăn ý giữa người với người. Bạn muốn có đủ đầy và thành tựu, thích làm việc trong một nhóm có nhịp. Dhanishta là chiếc trống của các vị thần giàu có. Điều cần tập là nhận ra khi nào đã đủ để dừng nhịp.",
    face: "Người ta thấy ở bạn sự năng động, tự tin về mặt vật chất và nhịp nhàng.",
    quest: "Rahu ở chòm sao Dhanishta cho thấy bạn khao khát sự giàu có và thành công trong nhóm. Bài học là lớn lên mà không chỉ thêm vào.",
    memory: "Ketu ở chòm sao Dhanishta mang theo năng khiếu tạo của cải và hòa nhịp. Bạn từng đủ đầy nên ít coi tiền là đích.",
  },
  { // 23 Shatabhisha
    soul: "Bên trong bạn là người chữa lành kín đáo: cần khoảng trống để nạp lại, và thường cảm nhiều hơn nói. Bạn có thể ở một mình rất lâu với những câu hỏi lớn, một bí mật, hoặc thứ kiến thức ít người biết. Shatabhisha là trăm thầy thuốc dưới quyền Varuna, thần của nước sâu. Điều cần tập là quay về với người khác sau khi đã hồi phục.",
    face: "Người ta thấy ở bạn sự điềm đạm, hơi xa, kín đáo và khó đoán.",
    quest: "Rahu ở chòm sao Shatabhisha cho thấy bạn khao khát sự thật kín và năng lực chữa lành. Bài học là mang kiến thức riêng ra để phục vụ người khác.",
    memory: "Ketu ở chòm sao Shatabhisha mang theo năng lực chữa lành và thói quen ở một mình. Bạn quen tĩnh lặng nên không sợ cô độc.",
  },
  { // 24 Purva Bhadrapada
    soul: "Bên trong bạn có ngọn lửa của sự thật cực đoan: tin điều gì thì tin hết, và có thể rẽ sang hướng ngược lại với cùng độ mãnh liệt. Bạn thường mang một chiều sâu u tối và một lý tưởng cao cùng lúc. Purva Bhadrapada là lửa thiêu để tái sinh. Điều cần tập là chọn mức vừa.",
    face: "Người ta thấy ở bạn sự mãnh liệt, đôi khi lập dị, người không đi theo đường thường.",
    quest: "Rahu ở chòm sao Purva Bhadrapada cho thấy bạn khao khát trải nghiệm tột bậc và lý tưởng. Bài học là thay đổi mà không phá hết những gì mình có.",
    memory: "Ketu ở chòm sao Purva Bhadrapada mang theo kinh nghiệm hy sinh và chuyển hóa. Bạn quen hy sinh và thay đổi lớn nên ít sợ những lúc khó.",
  },
  { // 25 Uttara Bhadrapada
    soul: "Bên trong bạn sâu và yên như nước đáy hồ: ít bị chuyện nhỏ lay, kiên nhẫn dài, đôi khi lặng đến mức người ta tưởng bạn không để ý. Bạn chịu được nhiều và cho đi mà không đòi. Uttara Bhadrapada là sao của sự bình tĩnh sâu. Điều cần tập là nói ra khi mình đã chịu quá nhiều.",
    face: "Người ta thấy ở bạn sự điềm tĩnh, ôn hòa và vững.",
    quest: "Rahu ở chòm sao Uttara Bhadrapada cho thấy bạn khao khát sự bình thản và trí tuệ sâu. Bài học là bình tĩnh mà vẫn tham gia.",
    memory: "Ketu ở chòm sao Uttara Bhadrapada mang theo sự thấu suốt và nhẫn nại. Bạn từng thấy nhiều nên ít bị cuốn vào thị phi.",
  },
  { // 26 Revati
    soul: "Bên trong bạn là người dẫn đường dịu dàng: thấy ai lạc thì chỉ lối, thấy ai mệt thì ngồi cùng. Bạn dễ tin người và dễ buồn thay cho thế giới. Revati là sao cuối của vòng hoàng đạo, sao của sự hoàn tất và đi bình an. Điều cần tập là cho lòng tốt có hàng rào.",
    face: "Người ta thấy ở bạn sự hiền, dễ gần và hơi mơ.",
    quest: "Rahu ở chòm sao Revati cho thấy bạn khao khát sự hợp nhất và lòng nhân ái trọn vẹn. Bài học là tử tế mà vẫn tỉnh táo.",
    memory: "Ketu ở chòm sao Revati mang theo lòng từ bi và khả năng dẫn dắt. Bạn từng giúp rất nhiều người đến nơi nên đã bớt bận tâm đến kết quả.",
  },
];


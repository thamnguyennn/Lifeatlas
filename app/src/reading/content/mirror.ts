// Hand-written reading atoms, part 11: one mirror per house and tone.
// scene = a pattern the reader can recognise in daily life; turn = one concrete thing to try.
// Index 0 = house 1. Voice rules are in STYLE.md.

export interface Mirror { scene: string; turn: string }
export type MirrorSet = { good: Mirror; mixed: Mirror; hard: Mirror };

export const MIRROR: MirrorSet[] = [
  { // 1: bản thân
    good: { scene: "Bạn có nền tốt để sống đúng là mình: tính cách rõ, sức khỏe khá và người khác dễ tin bạn. Khi bạn đã quyết làm điều gì, thường có người đứng về phía bạn.",
      turn: "Dùng nền tốt này để chọn một hướng và đi đủ lâu, thay vì thử mãi." },
    mixed: { scene: "Có chuyện bạn biết rất rõ về mình, và có chuyện bạn còn phân vân. Những ngày mọi việc suôn sẻ bạn tự tin, còn những ngày không ai khen thì bạn dễ hoài nghi bản thân.",
      turn: "Viết ra ba điều bạn chắc chắn về mình, để đọc lại những lúc hoài nghi." },
    hard: { scene: "Sống đúng là mình tốn sức hơn với bạn: bạn dễ mệt, hoặc hay tự hỏi mình có đủ tốt không. Nhiều khi bạn phải đi vòng khá lâu mới biết mình muốn gì.",
      turn: "Giữ giờ ngủ, bữa ăn và vận động đều đặn trước khi đòi mình làm nhiều. Thân thể ổn thì tinh thần cũng khá lên." },
  },
  { // 2: tiền, lời nói, gia đình gốc
    good: { scene: "Bạn có nền tốt để giữ được thứ mình kiếm: tiền đến đều, lời nói có trọng lượng và gia đình gốc là chỗ dựa. Bạn hay thấy mình đủ dùng vào lúc người khác còn lo.",
      turn: "Đặt một mục tiêu tiền bạc rõ ràng, để nền tốt này không bị tiêu đi lúc nào không hay." },
    mixed: { scene: "Chuyện tiền và lời nói của bạn lúc thuận, lúc khó. Thu nhập hoặc cảm giác đủ dùng thay đổi theo việc bạn đang làm và người bạn đang ở cạnh.",
      turn: "Một khoản dự phòng nhỏ mà đều đặn sẽ làm bạn yên tâm hơn một lần kiếm được nhiều." },
    hard: { scene: "Giữ tiền, giữ lời và giữ hòa thuận với gia đình gốc là những việc bạn phải học bằng cách làm. Có thể bạn lớn lên với cảm giác không bao giờ đủ, và cảm giác đó vẫn ảnh hưởng đến cách bạn tiêu tiền.",
      turn: "Ghi lại tiền đi đâu trong một tháng. Nhìn rõ thường làm bớt lo hơn mọi lời trấn an." },
  },
  { // 3: nỗ lực, kỹ năng, anh chị em
    good: { scene: "Bạn dễ bắt tay vào việc: dám nói, dám viết, dám thử và học kỹ năng nhanh. Công sức của bạn hay được đền đáp.",
      turn: "Chọn một kỹ năng và làm nó đến mức người khác phải nhờ bạn." },
    mixed: { scene: "Sự can đảm và kỹ năng của bạn đến theo từng đợt: có lúc lao vào làm rất nhanh, có lúc hoãn mãi một việc nhỏ.",
      turn: "Chia việc lớn thành những bước hai mươi phút. Bước đầu tiên thường là bước khó nhất." },
    hard: { scene: "Bắt đầu và làm cho xong là chỗ bạn cần rèn. Có thể bạn hay đắn đo, ngại nói ra, hoặc quan hệ với anh chị em còn chỗ chưa thuận.",
      turn: "Mỗi ngày nói to một điều bạn hay giữ trong đầu, với một người bạn thấy an toàn." },
  },
  { // 4: nhà, mẹ, bình yên
    good: { scene: "Bạn có một chỗ về vững chắc: một nơi ở yên ổn, mẹ hoặc cảm giác thuộc về nâng bạn dậy sau những ngày mệt.",
      turn: "Giữ vài thói quen nhỏ trong nhà như bữa cơm hay giờ ngủ, vì chúng là chỗ dựa của mọi việc khác." },
    mixed: { scene: "Chuyện nhà và sự bình yên của bạn có chỗ ổn và chỗ chưa. Có thể bạn có một nơi ở tốt mà lòng chưa yên, hoặc ngược lại.",
      turn: "Tách điều thuộc về nơi ở khỏi điều thuộc về cảm xúc, rồi chỉnh từng phần một." },
    hard: { scene: "Cảm giác có một chỗ để về là thứ bạn phải tự dựng. Có thể thuở nhỏ bạn chưa được yên ổn, quan hệ với mẹ có khoảng cách, hoặc bạn đổi chỗ ở nhiều lần.",
      turn: "Làm một góc thật sự của riêng mình, dù nhỏ. Góc đó nhắc lòng bạn rằng có một chỗ để về." },
  },
  { // 5: sáng tạo, tình yêu, con cái
    good: { scene: "Bạn có may mắn trong sáng tạo và tình cảm: ý tưởng đến dễ, tình cảm có chỗ phát triển, và những gì bạn bắt đầu thường có kết quả.",
      turn: "Làm ra một thứ cụ thể mỗi tháng, vì may mắn chỉ thành thật khi có sản phẩm." },
    mixed: { scene: "Sáng tạo và tình cảm của bạn có lúc dồi dào, có lúc khô cạn. Bạn vui khi làm điều mình mê, và nhanh chán khi bị buộc làm đúng giờ.",
      turn: "Giữ một việc làm chỉ vì vui, không cần kết quả." },
    hard: { scene: "Niềm vui, tình yêu hay chuyện nuôi dạy người nhỏ hơn đòi bạn kiên nhẫn hơn bình thường. Có thể bạn ngại sáng tạo vì sợ bị chê, hoặc từng thất vọng trong chuyện tình cảm.",
      turn: "Làm một điều nhỏ mà không cần ai thấy. Sự tự tin ở đây đến từ số lần thử, không đến từ một lần giỏi." },
  },
  { // 6: việc hằng ngày, sức khỏe, đối thủ
    good: { scene: "Bạn đủ bền để vượt những khó khăn hằng ngày: làm việc đều, thắng người cạnh tranh bằng sự khéo, và hồi sức tốt khi chịu chăm bản thân.",
      turn: "Dùng sức bền này để giữ một thói quen tốt cho sức khỏe và trả dứt một khoản nợ." },
    mixed: { scene: "Việc hằng ngày vừa nuôi bạn vừa làm bạn mệt: có người cạnh tranh, có khoản phải trả, có ngày kiệt sức rồi lại đứng dậy.",
      turn: "Chọn một việc để làm cho vững, giấc ngủ hoặc khoản tiền hằng tháng, rồi mới lo thêm." },
    hard: { scene: "Công việc, sức khỏe và người cạnh tranh là chỗ bạn hay thấy áp lực. Cơ thể thường báo mệt trước khi đầu óc chịu thừa nhận.",
      turn: "Coi những dấu hiệu nhỏ của cơ thể là thông tin. Ngủ đủ và đi khám sớm là việc cụ thể nhất bạn làm được." },
  },
  { // 7: hôn nhân, đối tác
    good: { scene: "Bạn có nền tốt cho các mối quan hệ: dễ gặp người hợp, hợp tác có kết quả, và người đối diện thường là chỗ dựa.",
      turn: "Nói rõ điều mình cần từ sớm, vì nền tốt vẫn cần lời nói thật." },
    mixed: { scene: "Các mối quan hệ vừa nâng đỡ vừa dạy bạn nhiều điều: có lúc ấm áp và hợp, có lúc mỗi người muốn một kiểu.",
      turn: "Mỗi tuần dành một cuộc trò chuyện không bàn việc, chỉ hỏi nhau dạo này thế nào." },
    hard: { scene: "Quan hệ đối tác và hôn nhân là nơi bạn học được nhiều nhất và cũng mệt nhất: khó chọn đúng người, khó giữ ranh giới, hoặc quen đặt nhu cầu của mình ra sau.",
      turn: "Nhìn một người qua việc họ làm trong ba tháng, không chỉ qua lời nói, và nói ra một điều bạn cần." },
  },
  { // 8: biến cố, chuyển hóa
    good: { scene: "Bạn hồi phục tốt: qua khủng hoảng bạn thường đứng dậy khôn hơn, và những thay đổi lớn hay đến cùng với một sự chuẩn bị sẵn.",
      turn: "Đừng sợ buông bỏ. Những lần làm lại của bạn thường tốt hơn bạn tưởng." },
    mixed: { scene: "Đời bạn có những khúc rẽ bất ngờ: có chuyện làm bạn chao đảo, có chuyện mở ra một hướng mới.",
      turn: "Chuẩn bị một khoản tiền dự phòng và một người có thể gọi vào lúc rối." },
    hard: { scene: "Mất mát, thay đổi lớn và những chuyện khó nói có thể đến mạnh hơn mức bạn mong. Bạn có xu hướng im lặng khi đau.",
      turn: "Tìm một người hoặc một nơi để nói điều khó. Điều đã nói ra thường nhẹ hơn điều giữ lại." },
  },
  { // 9: niềm tin, thầy, vận may
    good: { scene: "Bạn có may mắn đi cùng: gặp thầy, gặp cơ hội đúng lúc, và niềm tin vào cuộc sống giúp bạn qua những chỗ khó.",
      turn: "Làm điều bạn tin bằng một việc cụ thể, vì may mắn chỉ có ích khi được dùng." },
    mixed: { scene: "Niềm tin và vận may của bạn có lúc nhiều, có lúc ít: có giai đoạn mọi thứ như có người dẫn đường, có giai đoạn bạn thấy hoài nghi.",
      turn: "Chọn một người thầy hay một thói quen thực hành và ở lại với nó đủ lâu." },
    hard: { scene: "Tìm ý nghĩa sống, tìm một người thầy hay dựa vào vận may là việc bạn phải tự làm. Quan hệ với cha có thể có khoảng cách.",
      turn: "Tự đặt ra ba điều bạn tin dù không ai bảo. Niềm tin của riêng bạn sẽ vững hơn niềm tin mượn của người khác." },
  },
  { // 10: sự nghiệp
    good: { scene: "Bạn có nền tốt cho sự nghiệp: được nhìn thấy, được tin giao việc, và công sức hay được ghi nhận đúng lúc.",
      turn: "Chọn điều bạn muốn được nhớ đến, vì nền tốt cho bạn nhiều lựa chọn." },
    mixed: { scene: "Sự nghiệp của bạn đi theo từng đợt: có giai đoạn nổi bật, có giai đoạn lặng, và đôi khi bạn làm trước rồi mới được ghi nhận.",
      turn: "Giữ một sản phẩm công việc mà bạn tự hào, để nó nói thay bạn vào lúc lặng." },
    hard: { scene: "Đứng vững trong công việc là điều bạn phải xây dần: sự công nhận đến chậm, hoặc bạn nghi ngờ chính lựa chọn nghề của mình.",
      turn: "Mỗi tuần làm tốt một việc nhỏ cho đến cùng. Uy tín được gom từ những việc nhỏ." },
  },
  { // 11: thành quả, bạn bè
    good: { scene: "Bạn có nền tốt để gặt hái: công sức thường có kết quả, bạn bè hợp với mình và mục tiêu lớn dần theo năm tháng.",
      turn: "Đặt mục tiêu theo điều bạn thật sự muốn, vì nhà này hay cho bạn đúng điều bạn xin." },
    mixed: { scene: "Thành quả và bạn bè của bạn đến không đều: có người bạn thật, có người chỉ đi cùng một đoạn.",
      turn: "Chọn hai ba người bạn thật và giữ liên lạc với họ đều đặn." },
    hard: { scene: "Đạt được mục tiêu và có người đồng hành là việc phải bền bỉ: kết quả đến muộn hơn bạn mong, hoặc nhóm bạn hay thay đổi.",
      turn: "Viết ra một mục tiêu dài hạn và một việc nhỏ làm hằng tuần cho nó." },
  },
  { // 12: nội tâm, hao tốn, nơi xa
    good: { scene: "Bạn có đời sống nội tâm phong phú và biết nghỉ: ngủ đủ, ở một mình và những chuyến đi xa giúp bạn lấy lại sức.",
      turn: "Giữ một khoảng riêng đều đặn, đừng đợi đến lúc kiệt sức." },
    mixed: { scene: "Lúc ở một mình của bạn vừa là lúc nạp lại sức vừa có lúc thành chỗ trốn. Tiền và sức có lúc hao đi mà bạn không rõ lý do.",
      turn: "Phân biệt nghỉ để hồi sức với nghỉ để né việc, và nghỉ xong thì quay lại một việc." },
    hard: { scene: "Giấc ngủ, những khoản hao và cảm giác lạc lõng có thể là chỗ bạn hay vấp. Bạn mang nhiều điều trong lòng mà ít nói.",
      turn: "Có một thói quen tĩnh tâm ngắn và một người để nói thật. Những khoản hao nhỏ nên được ghi lại." },
  },
];

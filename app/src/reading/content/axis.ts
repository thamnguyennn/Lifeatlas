// Hand-written reading atoms, part 7: the Rahu-Ketu axis, written for a reader who knows nothing about astrology.
// The 12 axes are indexed by the house of RAHU (Ketu always sits in the opposite house).
// lesson = one plain sentence, used as the headline of the personal letter
// pull   = two or three plain sentences about the tug between the two ends
// ketu   = what you already know how to do (from the Ketu house)
// rahu   = what you came to learn and where you stumble (from the Rahu house)
// bridge = how the old strength can help with the new lesson
// ask    = one question to carry away
// Rule: no metaphors that need decoding. Say what a person does, feels and pays for it.

export interface AxisText { lesson: string; pull: string; ketu: string; rahu: string; bridge: string; ask: string }

export const AXIS_INTRO =
  "Rahu chỉ về phía bạn bị cuốn hút và muốn với tới, dù chưa thạo. Ketu chỉ về phía bạn đã quen tay, dễ dàng, nhưng cũng dễ thấy nhàm. Hai phía ấy luôn đối nhau, và đời bạn thường đi qua lại giữa chúng.";

export const AXIS: AxisText[] = [
  { // Rahu 1, Ketu 7
    lesson: "Bài học của bạn là dám làm chính mình và nói ra điều mình muốn, trước khi xem người đối diện muốn gì.",
    pull: "Một bên kéo bạn về phía người khác: hòa hợp, nhường nhịn, được cần đến. Bên kia thúc bạn đứng ra và nói “đây là tôi”. Hai lực này hay giằng co đúng lúc bạn cần tự quyết định.",
    ketu: "Ketu ở vùng hôn nhân và hợp tác cho thấy bạn vốn quen sống bằng các mối quan hệ. Bạn đọc người rất nhanh, là người đồng hành dễ chịu, biết nhường để giữ hòa khí. Cái giá là bạn quen xếp mong muốn của mình xuống sau, và đôi lúc chán chính cái vòng “lúc nào cũng có hai người” mà bạn đã thuộc lòng.",
    rahu: "Rahu ở vùng bản thân cho thấy bạn bị cuốn về phía học làm một người rõ nét: có gương mặt riêng, tiếng nói riêng, con đường riêng. Vì chưa quen, bạn hay thử nhiều vai, đổi hình ảnh, hoặc quá để ý người ta nhìn mình thế nào. Đứng một mình ở giữa sẽ thấy lạ và hơi sợ. Cảm giác đó cho thấy bạn đang đi vào chỗ mới.",
    bridge: "Hãy tập tự quyết định trước, rồi mới mời người khác vào. Thử một việc nhỏ: trước khi hỏi ý ai, ghi ra mình muốn gì. Quan hệ của bạn sẽ tốt hơn khi người kia gặp một bạn rõ ràng, thay vì một bạn dễ chịu.",
    ask: "Nếu không ai cần phải hài lòng, bạn sẽ chọn gì?",
  },
  { // Rahu 2, Ketu 8
    lesson: "Bài học của bạn là xây những thứ bình thường mà bền: thu nhập đều, lời nói đáng tin, một chỗ đứng vững, thay vì quen sống giữa biến động.",
    pull: "Một bên quen với sức mạnh của khủng hoảng, của những chuyện kín đáo và dữ dội. Bên kia đòi bạn làm chuyện giản dị: kiếm tiền đều, nói điều thật, giữ một bữa cơm gia đình. Với bạn, sự giản dị đôi khi khó hơn cả khủng hoảng.",
    ketu: "Ketu ở vùng biến cố và làm mới mình cho thấy bạn vốn quen đi qua mất mát rồi làm lại. Bạn bình tĩnh khi người khác hoảng, nhạy với điều bị giấu kín, hiểu thế nào là buông ra. Cái giá là bạn hơi lạnh trước những thứ “thường thường” như lương tháng hay thói quen sinh hoạt, vì so với khủng hoảng thì chúng quá nhẹ.",
    rahu: "Rahu ở vùng tiền bạc và lời nói cho thấy bạn bị cuốn về phía học về tiền bạc, giá trị và lời nói của mình. Càng có càng thấy thiếu, nên bạn dễ chạy theo con số, hoặc dùng lời nói để gây ấn tượng thay vì để gần người ta hơn. Gia đình gốc và cách bạn được nuôi lớn là chỗ bài học bắt đầu. Điều bạn đang học là cảm giác “vậy là đủ”.",
    bridge: "Hãy dùng sự sâu sắc có từ trải nghiệm cũ để giữ gìn những thứ mới. Nhìn tiền như người đã học được từ mất mát: tiết kiệm có lý do, nói ít mà đúng. Thử lập một khoản dự phòng nhỏ và giữ đều mỗi tháng, vì sự đều đặn chính là điều bạn chưa quen.",
    ask: "Với bạn, bao nhiêu là đủ, và ai đã đặt ra con số đó?",
  },
  { // Rahu 3, Ketu 9
    lesson: "Bài học của bạn là biến những điều mình tin và hiểu thành việc nhỏ làm đều mỗi ngày, thay vì chỉ giữ chúng trong đầu.",
    pull: "Một bên kéo bạn lên cao, về phía ý nghĩa lớn, niềm tin, người thầy. Bên kia kéo bạn xuống bàn làm việc: viết, nói, làm, thử. Khoảng cách giữa hai bên là chỗ bạn hay trì hoãn.",
    ketu: "Ketu ở vùng niềm tin và vận may cho thấy bạn vốn quen nghĩ về những câu hỏi lớn: đạo lý, lẽ sống, chuyện thầy và trò. Bạn có cảm giác “mình biết rồi”, nên dễ nhạt với lời khuyên sáo rỗng và khó nghe lời một người thầy chỉ vì họ có danh. Cái giá là bàn chuyện lớn thì giỏi, còn làm từng việc chi tiết lại thấy phiền.",
    rahu: "Rahu ở vùng kỹ năng và sự chủ động cho thấy bạn bị cuốn về phía rèn sự chủ động bắt tay vào làm, nói ra và thử. Bạn hay lao vào nhiều dự án, nhiều kênh, nhiều cuộc trò chuyện cùng lúc, và thấy mình sống nhất khi mọi thứ chuyển nhanh. Bài học là dám bắt đầu khi chưa chắc chắn, và làm xong thay vì chỉ mở đầu.",
    bridge: "Hãy cho niềm tin của bạn một chỗ đứng trong việc nhỏ: viết ra, kể cho một người, làm thử trong một tuần. Điều bạn hiểu chỉ thành hình khi có một sản phẩm hay một việc cụ thể mang tên bạn.",
    ask: "Điều bạn hiểu rõ nhất mà chưa từng làm ra thành thứ gì là gì?",
  },
  { // Rahu 4, Ketu 10
    lesson: "Bài học của bạn là dựng một nơi bình yên thật sự cho mình, trước khi dựng thêm tên tuổi ngoài xã hội.",
    pull: "Một bên quen đứng trước người khác, gánh vai trò và trách nhiệm. Bên kia thì thầm “về nhà chưa?”. Cả hai đều thật, nên chúng hay thay phiên nhau làm bạn mệt.",
    ketu: "Ketu ở vùng sự nghiệp cho thấy bạn vốn quen đảm nhận vai trò lớn ngoài xã hội: đứng đầu, đứng mũi chịu sào, được nhìn thấy. Bạn làm việc có trách nhiệm gần như theo phản xạ, và vì từng ở trên cao nên danh vị ít còn làm bạn hào hứng. Cái giá là đôi khi thấy sự nghiệp hơi trống, hoặc làm rất tốt mà không biết để làm gì.",
    rahu: "Rahu ở vùng nhà cửa và bình yên cho thấy bạn bị cuốn về phía xây dựng một nơi thuộc về mình: mái nhà, mẹ, cảm giác an toàn trong lòng. Bạn có thể chuyển nhà nhiều lần, hoặc ở nhà rồi mà vẫn thấy chưa “về”. Bài học là tự tạo bình yên cho mình, thay vì tìm nó ở một địa chỉ.",
    bridge: "Hãy để sự nghiệp phục vụ một cuộc sống bình yên, thay vì ngược lại. Lập vài thói quen nhỏ cho nhà: bữa cơm chung, giờ ngủ đều, một góc riêng, rồi mới nhận thêm việc.",
    ask: "Nếu mai không ai biết tên bạn, bạn còn thích ngôi nhà này không?",
  },
  { // Rahu 5, Ketu 11
    lesson: "Bài học của bạn là tạo ra một điều của riêng mình và dám để nó được nhìn thấy, thay vì chỉ là một người đáng tin trong nhóm.",
    pull: "Một bên kéo bạn về phía nhóm và bạn bè, nơi bạn quen và được chấp nhận. Bên kia đòi bạn đứng ra với một ý tưởng, một tình yêu, một tác phẩm mang tên mình.",
    ketu: "Ketu ở vùng thành quả và bạn bè cho thấy bạn vốn quen với đám đông và đã đạt nhiều mong ước: biết ai là ai, biết cách vào nhóm, biết điều gì đáng theo đuổi. Bạn không còn mê việc kết bạn rộng hay đi hội nhóm. Cái giá là đôi lúc thấy mình đứng ngoài, dù đang ở giữa mọi người.",
    rahu: "Rahu ở vùng sáng tạo và tình yêu cho thấy bạn bị cuốn về phía học về sáng tạo, tình yêu, con cái, và để được công nhận là thông minh theo cách của riêng mình. Bạn dễ đặt cược cảm xúc mạnh vào một mối tình, một dự án hay một đứa trẻ, rồi thất vọng nếu kết quả không rực rỡ như mong. Bài học là dám chịu rủi ro của trái tim mà không đòi tiếng vỗ tay.",
    bridge: "Hãy dùng nhóm bạn cũ làm chỗ dựa, rồi đưa ra một thứ riêng: một dự án nhỏ mang tên bạn, một lời mời, một bài viết. Đừng hỏi nhóm có đồng ý không. Hãy hỏi mình có muốn nó tồn tại không.",
    ask: "Điều gì bạn muốn tạo ra mà đang chờ ai đó cho phép?",
  },
  { // Rahu 6, Ketu 12
    lesson: "Bài học của bạn là mang sự yên tĩnh vốn có vào việc đời thường, và giải quyết những chỗ khó bằng sự khéo léo, đều đặn của mình.",
    pull: "Một bên kéo bạn về phía yên lặng: ở một mình, rút lui, nghỉ cho lại sức. Bên kia đẩy bạn vào đời sống hằng ngày: việc cụ thể, người khó chiều, cạnh tranh. Hai lực này giằng mạnh nhất vào những ngày bạn kiệt sức.",
    ketu: "Ketu ở vùng yên tĩnh và buông bỏ cho thấy bạn vốn quen với những nơi yên tĩnh, xa ồn ào: như tu viện, bệnh viện, một nơi xa, hoặc vai trò người chữa lành, người sống kín đáo. Bạn ở một mình không thấy trống, nhạy với nỗi đau không lời, và quen buông. Cái giá là khi việc đời nặng lên, bạn hay rút về chỗ yên tĩnh quen thuộc trước khi thử hết cách.",
    rahu: "Rahu ở vùng công việc hằng ngày cho thấy bạn bị cuốn về phía rèn bản lĩnh xử lý việc đời thường: công việc cụ thể, sức khỏe, người cạnh tranh, những khoản phải trả. Đây là chỗ Rahu thường làm ăn khá, vì nó thưởng cho người chịu rèn mỗi ngày. Bạn đi tới thành quả bằng sự khéo léo và đều đặn, hiếm khi bằng đối đầu.",
    bridge: "Hãy mang sự điềm tĩnh và chất chữa lành vốn có vào việc đời thường: làm một việc phục vụ người khác, giữ một thói quen sức khỏe đều, xử lý người khó bằng sự bình tĩnh. Mệt thì nghỉ, nhưng nghỉ xong thì quay lại làm việc.",
    ask: "Lần gần nhất bạn hoãn một việc, bạn đang nghỉ ngơi hay đang né nó?",
  },
  { // Rahu 7, Ketu 1
    lesson: "Bài học của bạn là học nhờ cậy, nhận giúp đỡ và cùng làm với người khác, thay vì quen tự lo hết mọi thứ.",
    pull: "Một bên quen đứng một mình: tự quyết, tự gánh, không muốn nợ ai. Bên kia kéo bạn về phía một người đối diện, một mối hợp tác, một cuộc hôn nhân thật sự.",
    ketu: "Ketu ở vùng bản thân cho thấy bạn vốn quen dựa vào chính mình. Bạn biết mình là ai, tự xoay xở giỏi, và hơi xa cách nên người khác khó đoán. Cái giá là bạn ít khi nói “tôi cần”, và sự rõ ràng của bạn đôi khi khiến người bên cạnh thấy mình thừa.",
    rahu: "Rahu ở vùng hôn nhân và hợp tác cho thấy bạn bị cuốn về phía học về việc có một người đồng hành: một tình yêu lớn, một đối tác hợp, một cuộc hôn nhân khiến mình thấy đủ. Vì chưa quen chia quyền quyết định, bạn dễ tô vẽ người kia quá đẹp rồi thất vọng, hoặc gặp những người khác mình rất nhiều. Mỗi mối quan hệ lớn là một tấm gương, và nó hay soi đúng chỗ bạn né.",
    bridge: "Hãy giữ sự độc lập vốn có nhưng tập nói ra điều mình cần. Mỗi tuần thử nhờ một việc nhỏ, và để người kia làm theo cách của họ. Hợp tác chỉ chạy khi cả hai bên đều thấy có chỗ cho mình.",
    ask: "Điều bạn đang tự gánh một mình mà thật ra có thể chia là gì?",
  },
  { // Rahu 8, Ketu 2
    lesson: "Bài học của bạn là dám để một điều cũ kết thúc và làm lại từ đầu, thay vì bám vào thứ đã quen giữ và quen nói.",
    pull: "Một phía quen giữ: của cải, nếp nhà, những câu chuyện quen thuộc. Bên kia kéo bạn vào những chuyện sâu, nơi mọi thứ bị xáo trộn để được làm mới.",
    ketu: "Ketu ở vùng tiền bạc và lời nói cho thấy bạn vốn quen sống đủ đầy theo cách của mình: của cải, giọng nói, dòng họ, bữa ăn ngon. Bạn có gu, biết giá trị của thứ vừa tay, và thấy yên khi mọi thứ được giữ nguyên. Cái giá là bám vào cái đã quen đến mức ngại những thay đổi lớn, kể cả khi chúng đang cần thiết.",
    rahu: "Rahu ở vùng biến cố và làm mới mình cho thấy bạn bị hút về những chuyện sâu và nhạy cảm: thay đổi lớn, mất mát, bí mật, tiền chung với người khác, những điều người ta thường né nói. Bạn hay rơi vào tình huống căng, và các cuộc khủng hoảng dạy bạn nhiều hơn bạn muốn. Bài học là chịu được thay đổi mà không bấu víu vào cái cũ.",
    bridge: "Hãy dùng gu và sự ổn định cũ làm chỗ đứng khi đi vào những chuyện sâu. Có một khoản dự phòng, một người đáng tin, rồi mới đón thay đổi lớn. Làm mới có thể diễn ra từng bước, không nhất thiết phải đổ vỡ mới thấy.",
    ask: "Điều gì trong đời bạn đã hết hạn mà bạn vẫn đang giữ?",
  },
  { // Rahu 9, Ketu 3
    lesson: "Bài học của bạn là ngẩng lên tìm ý nghĩa, người thầy và niềm tin của riêng mình, thay vì chỉ xoay xở với việc trước mắt.",
    pull: "Một bên quen làm: nhanh tay, khéo léo, nói chuyện tốt, xử lý việc vặt giỏi. Bên kia hỏi “để làm gì?” và kéo bạn đi xa, đi học, đi tìm.",
    ketu: "Ketu ở vùng kỹ năng và sự chủ động cho thấy bạn vốn đã luyện tay nghề rất nhiều: viết, nói, làm đồ thủ công, đi lại, làm anh chị em của nhiều người. Bạn thạo kỹ năng và giao tiếp mà ít cần học bài bản. Cái giá là bạn hơi chán những cuộc trò chuyện và thông tin vụn vặt, và có lúc giỏi việc đến mức quên hỏi mình có đang làm điều đáng làm không.",
    rahu: "Rahu ở vùng niềm tin và vận may cho thấy bạn bị cuốn về phía học về ý nghĩa: một người thầy, một niềm tin, một vùng đất xa, một tầm nhìn lớn hơn đời sống hằng ngày. Bạn có thể đổi nhiều quan điểm, theo nhiều thầy, hoặc quá tin vào một cách hiểu rồi thấy hụt hẫng. Bài học là dựng niềm tin bằng trải nghiệm của chính mình.",
    bridge: "Hãy dùng tay nghề cũ để phục vụ một mục đích lớn hơn: dạy lại điều mình biết, viết để người khác hiểu, làm một việc có ý nghĩa với người ở xa. Chọn một người thầy hay một cách tu tập và ở lại đủ lâu để thấy kết quả.",
    ask: "Điều bạn làm giỏi nhất đang phục vụ điều gì lớn hơn chính nó?",
  },
  { // Rahu 10, Ketu 4
    lesson: "Bài học của bạn là bước ra khỏi vùng an toàn của nhà và cảm xúc, để nhận một vai trò, một trách nhiệm mang tên bạn ngoài xã hội.",
    pull: "Một bên quen sự ấm áp và an toàn: mẹ, nhà, ký ức, cảm giác thuộc về. Bên kia kéo bạn ra phía trước: vai trò, thành tích, bị nhìn thấy và bị đánh giá.",
    ketu: "Ketu ở vùng nhà cửa và bình yên cho thấy bạn vốn quen có một mái nhà: sống bằng cảm xúc, gia đình và sự bình yên trong lòng. Bạn không cần nhiều thứ để thấy đủ, hơi lặng lẽ, và hay nhớ nhà dù đang ở nhà. Cái giá là khi cần bước ra nhận trách nhiệm, bạn do dự vì đã quen an toàn.",
    rahu: "Rahu ở vùng sự nghiệp cho thấy bạn bị cuốn về phía học về công việc và vị trí ngoài xã hội: được ghi nhận, có dấu ấn riêng. Bạn có tham vọng lớn, hay đặt mục tiêu cao, và dễ thất vọng khi sự công nhận đến chậm. Đây là vị trí của người leo cao, và bài học nằm ở chỗ leo bằng những việc có giá trị thật.",
    bridge: "Hãy mang sự ấm áp vốn có vào vai trò ngoài xã hội: dẫn dắt bằng sự quan tâm, chọn một việc có tính chăm sóc. Giữ một chỗ cảm xúc ổn định để quay về, rồi hãy đi xa vì tham vọng.",
    ask: "Bạn muốn được nhớ đến vì điều gì khi rời khỏi công việc này?",
  },
  { // Rahu 11, Ketu 5
    lesson: "Bài học của bạn là dùng tài năng cho một cộng đồng và một mục tiêu chung, thay vì giữ nó riêng cho mình.",
    pull: "Một bên quen với tài năng riêng, trực giác riêng, niềm vui sáng tạo ngay tại chỗ. Bên kia kéo bạn vào một nhóm người, một mục tiêu dài hạn, những người đang cần đến bạn.",
    ketu: "Ketu ở vùng sáng tạo và tình yêu cho thấy bạn vốn đã có tài và có trí, đã yêu và sáng tạo rất sâu. Bạn có trực giác, óc sáng tạo hoặc sự thông minh tự nhiên từ rất sớm, và đôi khi thấy chuyện tình cảm, con cái hay giải trí không còn hấp dẫn như người khác nghĩ. Cái giá là giữ tài năng cho riêng mình, hoặc ngại đưa nó ra trước người khác.",
    rahu: "Rahu ở vùng thành quả và bạn bè cho thấy bạn bị cuốn về phía mở lòng thuộc về một tập thể, có những người bạn đúng, và đạt những mục tiêu lớn. Bạn dễ chạy theo những vòng quan hệ mới hoặc những con số thành tựu, và dễ thấy chưa đủ dù đã đạt nhiều. Nhà này thường trao điều bạn mong, miễn là bạn biết mình mong gì.",
    bridge: "Hãy mang tài năng riêng vào một cộng đồng đang cần nó: dạy, chia sẻ, dẫn dắt một nhóm nhỏ. Chọn mục tiêu theo điều mình thật sự muốn, vì Rahu ở đây hay trao cho bạn thứ bạn chưa kịp hỏi xem mình có thật sự cần không.",
    ask: "Nếu mọi mục tiêu đều đạt được, bạn sẽ ở cạnh ai?",
  },
  { // Rahu 12, Ketu 6
    lesson: "Bài học của bạn là tập buông tay, cho phép mình nghỉ, và tin rằng có những việc cuộc đời sẽ tự sắp xếp mà chẳng cần bạn ôm hết.",
    pull: "Một bên là thói quen làm cho xong, sửa cho đúng, hoàn thành bổn phận. Bên kia kéo bạn ra khỏi bàn làm việc: ngủ, mơ, đi xa, ở một mình, tìm điều không nằm trong danh sách việc cần làm.",
    ketu: "Ketu ở vùng công việc hằng ngày cho thấy bạn vốn đã rèn rất kỹ tính kỷ luật và tinh thần giúp đỡ người khác. Bạn giải quyết vấn đề giỏi, chịu khó, vượt khó gần như theo phản xạ, và ít sợ việc nặng. Cái giá là bạn quen sống bằng danh sách việc, nên nghỉ ngơi hay “không làm gì” khiến bạn bứt rứt.",
    rahu: "Rahu ở vùng yên tĩnh và buông bỏ cho thấy bạn bị cuốn về phía học về sự buông: giấc ngủ sâu, giấc mơ, những nơi xa, đời sống tinh thần, cảm giác được hòa vào một điều lớn hơn mình. Bạn có thể trốn vào mơ mộng, đi xa hay giải trí, và cũng có thể tìm được sự yên tĩnh thật. Bài học là phân biệt nghỉ để hồi sức với chạy trốn việc.",
    bridge: "Hãy dùng chính tính kỷ luật của bạn để nuôi thói quen buông: giờ ngủ đều, một thói quen yên tĩnh mỗi ngày, một khoảng thời gian không có mục tiêu. Ở đây kỷ luật là để phục vụ sự thả lỏng.",
    ask: "Điều gì sẽ xảy ra nếu một ngày bạn không làm gì cả?",
  },
];

/** Clauses that finish “Rahu đứng ở cung X, nên điều bạn khao khát …”. Index = sign of Rahu (0 = Bạch Dương). */
export const RAHU_SIGN: string[] = [
  "mang kiểu mở đường: bạn muốn đi trước, tự thử, và ghét phải xin phép.",
  "mang kiểu muốn thứ chạm được: tiền, đất đai, bữa ăn ngon, cảm giác chắc chân. Bạn dễ ôm giữ.",
  "mang kiểu muốn biết và muốn kết nối: hỏi nhiều, đọc nhiều. Bạn dễ lướt qua nhiều thứ mà chưa đào sâu.",
  "mang kiểu muốn được thuộc về: một mái ấm, một người chăm sóc. Bạn dễ bám vào một người hoặc một nơi.",
  "mang kiểu muốn được nhìn thấy và được yêu khi mình tỏa sáng. Bạn dễ phụ thuộc vào tiếng vỗ tay.",
  "mang kiểu muốn làm cho đúng và cho tốt, chăm từng chi tiết. Bạn dễ tự chê mình.",
  "mang kiểu muốn hòa hợp, công bằng và có người đồng hành. Bạn dễ nhường mình quá nhiều.",
  "mang kiểu muốn biết tận cùng sự thật và những chuyện nằm sau hậu trường. Bạn dễ nghi ngờ và muốn kiểm soát.",
  "mang kiểu muốn ý nghĩa, tự do và những chân trời xa. Bạn dễ rao giảng, hoặc bỏ đi khi chán.",
  "mang kiểu muốn thành tựu thấy được, có vị trí và kỷ luật. Bạn dễ cứng nhắc và thấy cô đơn trên cao.",
  "mang kiểu muốn khác biệt, muốn một cộng đồng và những ý tưởng mới. Bạn dễ đứng ngoài mà nhìn.",
  "mang kiểu muốn hòa vào một điều lớn hơn mình và thoát khỏi chi tiết. Bạn dễ trốn vào mơ mộng.",
];

/** Clauses that finish “Ketu đứng ở cung X, nên cái bạn đã thạo …”. Index = sign of Ketu. */
export const KETU_SIGN: string[] = [
  "mang kiểu người tiên phong: bắt đầu việc mới là chuyện nhẹ, và điều làm bạn mệt là phải chứng tỏ mình nhanh nhất.",
  "mang kiểu người biết giữ và biết hưởng: bạn có gu và sự vững, và điều làm bạn mệt là cứ phải lo cho đủ.",
  "mang kiểu người trao đổi giỏi: học và nói đều dễ, và điều làm bạn mệt là quá nhiều thông tin vụn.",
  "mang kiểu người biết nuôi dưỡng: bạn hiểu và chăm cảm xúc từ lâu, và điều làm bạn mệt là phải gánh cảm xúc của người khác.",
  "mang kiểu người từng tỏa sáng: bạn có phong thái, và điều làm bạn mệt là phải lúc nào cũng làm trung tâm.",
  "mang kiểu người làm việc tỉ mỉ: sắp xếp và sửa chữa đều dễ, và điều làm bạn mệt là sự cầu toàn không dứt.",
  "mang kiểu người hòa giải: bạn cân bằng được nhiều bên, và điều làm bạn mệt là chuyện phải nhường.",
  "mang kiểu người đã đi qua nhiều chuyện sâu: bạn bình tĩnh trước khủng hoảng, và điều làm bạn mệt là những cuộc chơi quyền lực và bí mật.",
  "mang kiểu người tìm lẽ phải: bạn hiểu đạo lý và niềm tin từ lâu, và điều làm bạn mệt là phải rao giảng.",
  "mang kiểu người gánh trách nhiệm: bạn kỷ luật và đáng tin, và điều làm bạn mệt là lúc nào cũng phải gánh.",
  "mang kiểu người đứng ngoài mà nhìn: bạn thấy rõ nhóm và hệ thống, và điều làm bạn mệt là cảm giác mình lạc loài.",
  "mang kiểu người biết buông và biết cảm: bạn quen hòa vào điều lớn hơn mình, và điều làm bạn mệt là ranh giới luôn mờ.",
];

/** A planet standing in the same sign as a node. Keys: planet id. */
export const WITH_RAHU: Record<string, string> = {
  sun: "Mặt Trời cùng cung với Rahu: ý chí và nhu cầu được công nhận của bạn bị khuếch đại. Bạn vừa khao khát nổi bật vừa ngờ vực người có quyền, nhất là chuyện liên quan đến cha.",
  moon: "Mặt Trăng cùng cung với Rahu: đầu óc bạn hay bị cuốn đi, nhiều ý nghĩ chồng lên nhau, và bạn nhạy hơn mức bình thường. Giấc ngủ và nhịp sinh hoạt đều đặn là chỗ dựa quan trọng của bạn.",
  mars: "Sao Hỏa cùng cung với Rahu: sức bật mạnh và liều, dễ lao vào trước khi cân nhắc. Nếu có kỷ luật, đây là sức xông pha khác thường.",
  mercury: "Sao Thủy cùng cung với Rahu: đầu óc nhanh, lạ, hay có ý tưởng ngoài lề. Bạn giỏi công nghệ và ngôn từ, và dễ nghĩ quá, nói quá.",
  jupiter: "Sao Mộc cùng cung với Rahu: niềm tin và hiểu biết của bạn bị khuếch đại, muốn vượt khỏi khuôn truyền thống. Bạn có thể là người thầy khác lối, và cũng dễ cả tin hoặc nói quá lên.",
  venus: "Sao Kim cùng cung với Rahu: ham muốn và gu thẩm mỹ đều mạnh, sức hút khác thường. Bài học ở đây là phân biệt điều mình thích với điều mình cần.",
  saturn: "Sao Thổ cùng cung với Rahu: kỷ luật đi cùng tham vọng, gánh nặng lớn, hay lo về địa vị và sự an toàn. Khi đã chọn con đường, bạn bền bỉ, và thành công đến muộn nhưng chắc.",
};
export const WITH_KETU: Record<string, string> = {
  sun: "Mặt Trời cùng cung với Ketu: ý chí của bạn hướng vào trong, không mặn mà với danh vị. Cảm giác “mình là ai” hơi mờ, và bạn hiểu cha hoặc người có quyền theo cách lặng lẽ.",
  moon: "Mặt Trăng cùng cung với Ketu: cảm xúc sâu và hơi tách khỏi người xung quanh, dễ thấy mình lệch nhịp với số đông. Trực giác mạnh, và một thói quen tĩnh tâm sẽ giúp bạn nhiều.",
  mars: "Sao Hỏa cùng cung với Ketu: bản năng tranh đấu vốn có sẵn trong bạn. Giận ít lộ ra nhưng bùng lên bất chợt, và bạn dễ thờ ơ trước tranh giành rồi mới nổi lên.",
  mercury: "Sao Thủy cùng cung với Ketu: trực giác nhạy, thấy nhanh mà khó giải thích. Bạn có năng khiếu nghiên cứu, và đôi lúc khó nói ra điều mình biết.",
  jupiter: "Sao Mộc cùng cung với Ketu: hiểu biết về đời sống tinh thần sâu, ít cần thầy. Bạn nghi ngờ giáo điều, và có lúc chán chính những hệ thống niềm tin.",
  venus: "Sao Kim cùng cung với Ketu: tình cảm sâu nhưng hơi tách, dễ nhàm trước cái đẹp thông thường. Bạn cần một tình yêu có chiều sâu.",
  saturn: "Sao Thổ cùng cung với Ketu: nghiêm khắc với chính mình, hay cô độc, quen hy sinh. Bạn đã quen gánh nặng, và bài tập là giữ được sự điềm tĩnh mà không lạnh lùng.",
};

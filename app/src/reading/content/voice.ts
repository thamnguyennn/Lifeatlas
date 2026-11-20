// The voice of Life Atlas: plain life language, concrete "if you … then …" examples and one short message.
// Modelled on the author's own notes ("9 Đại Vận Chiêm Tinh – Phiên Bản Đời Sống"): no period is good or bad, each one teaches
// in its own way; no area of life is good or bad, each one asks something different of you.
import type { GrahaId } from "../../engine/constants.ts";

export interface Teacher { lesson: string; how: string; examples: string[]; gift: string; message: string }

/** The nine periods as nine teachers. */
export const TEACHER: Record<GrahaId, Teacher> = {
  sun: {
    lesson: "tự tin, chính trực và sống đúng với mình",
    how: "Giai đoạn này bắt bạn trưởng thành và đứng thẳng lưng.",
    examples: [
      "Nếu bạn đang sống dựa vào người khác, giai đoạn này dễ lấy đi chỗ dựa ấy: đổi việc, mất người che chở, bị thử bản lĩnh.",
      "Nếu bạn đang cố tỏ ra là một người khác, điều đó thường bị lộ ra rất nhanh.",
      "Nếu bạn dám đứng ra nhận trách nhiệm, bạn được trao quyền, được cấp trên và người xung quanh công nhận.",
    ],
    gift: "vị thế, sự công nhận và quyền tự quyết",
    message: "Sống thật với mình, rồi ánh sáng sẽ tự tìm đến.",
  },
  moon: {
    lesson: "cảm xúc, gia đình và sự bình ổn trong lòng",
    how: "Giai đoạn này nắn lại trái tim bạn trước khi cho bạn hạnh phúc.",
    examples: [
      "Nếu bạn quen kìm nén, giai đoạn này dễ làm bạn mệt, dễ khóc, dễ tổn thương hơn thường lệ.",
      "Nếu bạn mải kiếm tiền mà quên gia đình, cuộc sống sẽ kéo bạn về nhà, qua chuyện cha mẹ, con cái hay sức khỏe.",
      "Nếu bạn vốn cứng rắn quá mức, bạn sẽ phải học cách mềm ra, lắng nghe và kết nối.",
    ],
    gift: "một mái ấm, những mối quan hệ gần gũi và sự bình yên trong lòng",
    message: "Không ai mạnh mãi được; học cách sống cùng cảm xúc là một kiểu mạnh khác.",
  },
  mars: {
    lesson: "hành động, quyết đoán và dám đối mặt",
    how: "Giai đoạn này dạy bằng sự gấp gáp, áp lực và va chạm.",
    examples: [
      "Nếu bạn hay trì hoãn, cuộc sống sẽ đẩy bạn vào những tình huống phải làm ngay, không né được.",
      "Nếu bạn chưa có mục tiêu rõ, bạn dễ thấy mình bị cuốn từ việc này sang việc khác như trả nợ.",
      "Nếu bạn hiền và nhịn quá lâu, sẽ có ngày bạn phải đứng lên bảo vệ chính mình.",
    ],
    gift: "sức bật, tài sản tự tay gây dựng và bản lĩnh",
    message: "Đừng chạy nữa, hãy đối mặt.",
  },
  rahu: {
    lesson: "tham vọng, ảo ảnh và những trải nghiệm vượt khuôn",
    how: "Giai đoạn này cho bạn điều bạn muốn, rồi hỏi: “Rồi sao nữa? Đã đủ chưa?”.",
    examples: [
      "Nếu bạn ham tiền, bạn có thể có tiền thật, nhưng đi kèm áp lực và cảm giác mãi chưa đủ.",
      "Nếu bạn mê danh tiếng, bạn có thể được biết đến, nhưng phải trả bằng tự do hoặc một mối quan hệ.",
      "Nếu bạn thích trải nghiệm, bạn được đi nhiều, làm nhiều, mà đôi khi vẫn thấy trống.",
    ],
    gift: "những cơ hội lớn, những cánh cửa lạ và tầm nhìn rộng hơn",
    message: "Đỉnh cao cũng có thể cô đơn; điều đáng giữ là biết mình thật sự cần gì.",
  },
  jupiter: {
    lesson: "trí tuệ, niềm tin và đạo lý sống",
    how: "Giai đoạn này dạy bằng cách mở cửa, rồi để bạn tự bước vào.",
    examples: [
      "Nếu bạn ngại học hỏi, cơ hội đến mà không giữ được, trôi qua trong tiếc nuối.",
      "Nếu bạn tự mãn, bạn dễ bỏ lỡ người giúp mình vì nghĩ mình đã biết hết.",
      "Nếu bạn thật sự cầu thị, bạn bật lên như diều gặp gió.",
    ],
    gift: "người thầy, sự mở rộng, con cái hoặc học trò, và tài lộc đến từ hiểu biết",
    message: "Quà lớn chỉ trao cho người giữ được tâm sáng.",
  },
  saturn: {
    lesson: "kỷ luật, trách nhiệm và nền móng cuộc đời",
    how: "Giai đoạn này không dạy bằng lời, mà bằng sức nặng của thực tế.",
    examples: [
      "Nếu bạn làm ăn gian dối, hậu quả đến rất nhanh.",
      "Nếu bạn lười, bạn sẽ bị buộc phải làm việc chăm hơn người khác.",
      "Nếu bạn bỏ bê sức khỏe, cơ thể sẽ bắt bạn chậm lại.",
      "Nếu bạn tìm đường tắt, bạn thất bại hết lần này đến lần khác cho tới khi chịu đi đường dài.",
    ],
    gift: "một vị trí vững, sự tin cậy và những thành quả không dễ mất",
    message: "Ai chịu khó, giai đoạn này biến người đó thành trụ cột.",
  },
  mercury: {
    lesson: "trí thông minh, giao tiếp và khả năng thích nghi",
    how: "Giai đoạn này dạy nhẹ nhàng nhưng xoay chuyển rất nhanh.",
    examples: [
      "Nếu bạn chậm thay đổi, bạn dễ rơi khỏi cuộc chơi và lỡ cơ hội.",
      "Nếu bạn giao tiếp chưa khéo, hiểu lầm và tranh cãi sẽ đến để bạn học lại cách nói.",
      "Nếu bạn cứng nhắc, bạn liên tục gặp những tình huống buộc phải đổi hướng.",
    ],
    gift: "thu nhập từ kỹ năng, ngôn ngữ và đầu óc",
    message: "Linh hoạt là cách giai đoạn này trả lương cho bạn.",
  },
  ketu: {
    lesson: "buông bỏ, thức tỉnh và đổi lại thứ tự ưu tiên",
    how: "Giai đoạn này cắt, gọt và rửa đi những gì không còn phù hợp.",
    examples: [
      "Nếu bạn quá tham công tiếc việc, có thể có lúc bạn mất việc để thấy sự nghiệp không phải là tất cả.",
      "Nếu bạn sống buông thả, cơ thể sẽ buộc bạn tiết chế.",
      "Nếu bạn bám vào một mối quan hệ làm mình kiệt sức, giai đoạn này thường cắt nó đi.",
    ],
    gift: "sự nhẹ lòng, trực giác sâu và tự do khỏi những gì không còn cần",
    message: "Giai đoạn này không trừng phạt, mà giải phóng; chỉ là cách giải phóng đôi khi đau.",
  },
  venus: {
    lesson: "tình yêu, vật chất và hưởng thụ có chừng mực",
    how: "Giai đoạn này dạy bằng sự ngọt ngào và những cám dỗ.",
    examples: [
      "Bạn được ăn ngon, mặc đẹp, sống tiện nghi hơn; nếu quá đà, bạn dễ trả giá bằng sức khỏe hoặc nợ nần.",
      "Bạn có nhiều mối quan hệ mới; nếu chúng không đủ sâu, bạn có thể đánh mất những người thật sự quan trọng.",
      "Nếu bạn biết thưởng thức có chừng mực, đây là quãng đời đẹp nhất để yêu, để tạo dựng và để tận hưởng.",
    ],
    gift: "tình yêu, cái đẹp, tiện nghi và các mối quan hệ dễ chịu",
    message: "Quà luôn đẹp, nhưng bạn phải biết giữ mình.",
  },
};

export interface AreaVoice { lesson: string; plus: string[]; minus: string[]; message: string }

/** The twelve areas of life, each with what it asks of you, concrete examples when it is easy and when it is hard, and a message. */
export const AREA_VOICE: AreaVoice[] = [
  { lesson: "biết mình là ai và giữ được sức sống của chính mình",
    plus: ["Bạn bước vào một căn phòng lạ và chỉ sau vài phút đã có người quay sang hỏi ý bạn. Sự hiện diện của bạn tự nó đã là một lời giới thiệu.", "Sau một tuần kiệt sức, chỉ cần hai đêm ngủ đủ và một buổi làm điều mình thích, bạn đã đứng dậy được như chưa có gì xảy ra."],
    minus: ["Những đêm quá tải, câu đầu tiên bạn tự hỏi là \"mình có đủ giỏi không\", trước cả khi hỏi \"việc này có quá sức không\". Sự tự tin của bạn lên xuống theo nhịp sống nhiều hơn bạn muốn thừa nhận.", "Sống theo kỳ vọng của người khác lâu ngày, bạn có lúc soi gương và thấy một người hơi lạ: mọi thứ vẫn ổn, chỉ có bạn là mờ đi."],
    message: "Chăm mình trước, rồi mọi thứ khác mới có chỗ để đứng." },
  { lesson: "biết giữ những gì mình có: tiền, lời nói và nếp nhà",
    plus: ["Bạn có thói quen để riêng một khoản mỗi tháng, và vài năm sau tự mình cũng ngạc nhiên vì nó đã lớn đến vậy. Bạn giữ tiền giỏi hơn kiếm tiền, và đó là một tài năng thật.", "Trong một bữa cơm đang căng thẳng, một câu nói đúng lúc của bạn làm cả nhà dịu xuống. Người ta nhớ lời bạn rất lâu."],
    minus: ["Tiền vào cửa trước rồi ra cửa sau: một món đồ mua vì buồn, một khoản cho vay vì nể. Cuối tháng bạn ngồi nhìn tài khoản mà không nhớ nó đã đi đâu.", "Một câu nói vội lúc nóng giận có thể làm bạn mất nhiều hơn một khoản tiền, và người nghe nhớ nó lâu hơn bạn tưởng."],
    message: "Giữ được mới là của mình." },
  { lesson: "dám tự tay làm, tự học và tự nói ra điều mình nghĩ",
    plus: ["Bạn xem một video hướng dẫn tối hôm trước, sáng hôm sau đã tự sửa được cái mà người khác định gọi thợ. Bạn học nhanh nhất khi thấy nó dùng được ngay.", "Khi cả nhóm im lặng chờ ai đó đứng ra, bạn thường là người giơ tay trước, dù trong lòng cũng run."],
    minus: ["Bạn chờ đủ chắc chắn mới bắt đầu, và cái đủ chắc chắn ấy cứ lùi dần. Ý tưởng hay nằm mãi trong ghi chú điện thoại.", "Với anh chị em hay bạn đồng lứa, có một khoảng cách mà bạn đã thử lấp nhiều lần. Có khi chấp nhận nó lại nhẹ lòng hơn cố sửa."],
    message: "Cứ bắt đầu, sự tự tin sẽ theo sau." },
  { lesson: "có một chỗ để về, cả trong nhà lẫn trong lòng",
    plus: ["Một góc phòng quen, ấm trà quen, tấm chăn quen có tác dụng với bạn hơn cả một chuyến du lịch đắt tiền. Nhà là nơi bạn thật sự nạp lại sức.", "Bạn bè hay tìm đến nhà bạn ngồi lâu hơn dự định, vì ở đó có một thứ không khí làm người ta muốn ở lại."],
    minus: ["Khi chỗ ở còn chưa yên, như đang thuê tạm hay trong nhà có chuyện chưa nói ra, mọi việc ở cơ quan cũng khó trôi. Bạn mang cái bất an ấy đi khắp nơi mà không biết.", "Chuyện chuyển nhà, hay những khác biệt với mẹ và người thân, cứ lặp lại theo nhiều hình thức, cho tới khi bạn tự dựng được một chỗ đứng của riêng mình."],
    message: "Bình yên không ở địa chỉ, mà ở cách bạn sống trong đó." },
  { lesson: "sống bằng niềm vui, sáng tạo và yêu một cách thật lòng",
    plus: ["Một việc bạn làm chỉ vì thích, như vẽ, viết, nấu một món mới, lại là thứ người khác nhớ đến bạn nhiều nhất. Niềm vui của bạn có sức lan.", "Khi được tự do thử, bạn làm ra những thứ mang dấu tay riêng, nhìn là biết của bạn."],
    minus: ["Những năm chỉ làm vì phải làm, bạn thấy đời mình nhạt như một bữa cơm không muối, dù mọi thứ trên giấy đều ổn.", "Chuyện yêu đương hoặc con cái có thể đến chậm hơn bạn mong, hoặc đi kèm nhiều đêm lo lắng. Điều giúp bạn nhất là cho phép mình vui mà không cần lý do."],
    message: "Đừng để niềm vui phải xin phép." },
  { lesson: "giữ nhịp mỗi ngày: công việc, sức khỏe và cách xử lý va chạm",
    plus: ["Một ngày có mười việc dồn tới, người khác hoảng, còn bạn lấy giấy ra viết danh sách và gạch dần từng dòng. Bạn mạnh nhất khi có một vấn đề thật để giải quyết.", "Trong cạnh tranh, bạn ít khi thắng nhờ nhanh hơn, mà nhờ vẫn còn đứng đó khi người khác đã bỏ cuộc."],
    minus: ["Bạn làm liền mấy tháng không có một ngày nghỉ thật, rồi một sáng cơ thể tự bắt bạn dừng lại. Nó luôn đòi lại phần của nó.", "Một va chạm nhỏ với đồng nghiệp mà bạn im lặng cho qua, sau vài tháng thành một cục nặng trong ngực mỗi khi bước vào cơ quan."],
    message: "Nghỉ ngơi cũng là một phần của công việc." },
  { lesson: "đứng cạnh một người khác mà vẫn là chính mình",
    plus: ["Những việc bạn làm cùng một người hợp ý thường đi xa gấp đôi khi bạn làm một mình. Người đồng hành đúng mở thêm cho bạn những cánh cửa bạn không tự gõ được.", "Bạn đời hay đối tác của bạn thường là người kéo bạn ra khỏi vùng quen, và nhiều năm sau bạn biết ơn chính những lần bị kéo ấy."],
    minus: ["Một buổi tối, hai người cãi nhau vì một chuyện rất nhỏ, rồi nó thành một cuộc tranh luận ai đúng ai sai. Cả hai đều không muốn làm đau nhau, nhưng không ai chịu dừng trước.", "Nếu chọn người vội, bạn sẽ phải học bài học về ranh giới. Một mối gắn bó với bạn thường phải qua một chặng điều chỉnh khá dài trước khi thật sự yên."],
    message: "Tìm người cùng đi, không phải người để dựa hẳn vào." },
  { lesson: "đi qua thay đổi và làm mới mình sau mất mát",
    plus: ["Sau mỗi lần đời lật một trang khó, bạn đứng dậy với cái nhìn sâu hơn, như người đã đi qua đêm tối và biết rằng trời sẽ sáng.", "Khi ai đó gặp chuyện không dám kể với ai, họ thường kể với bạn. Bạn không sợ những chuyện người khác né tránh."],
    minus: ["Thay đổi lớn có thể đến không báo trước: một cú điện thoại, một quyết định của người khác. Một khoản dự phòng và một người để gọi lúc nửa đêm giúp bạn đỡ chao đảo.", "Tiền chung, tài sản chung, những lời hứa miệng với người nhà là chuyện nên rõ ràng từ đầu, vì với bạn chúng dễ thành nút thắt về sau."],
    message: "Cái gì phải đi thì để nó đi; bạn sẽ còn lại phần thật nhất." },
  { lesson: "có một niềm tin để sống theo và một người thầy để học",
    plus: ["Ở những ngã rẽ lớn, bạn hay gặp đúng một người nói đúng một câu, và câu ấy đổi hướng cả một chặng đời.", "Một chuyến đi xa hay một lần học lên cao thường mở cho bạn một cánh cửa mà ở lại chỗ cũ bạn sẽ không bao giờ thấy."],
    minus: ["Bạn khó tin điều gì chỉ vì được dạy. Niềm tin của bạn phải qua nhiều đêm nghi ngờ, tự đọc, tự hỏi, rồi mới đứng vững.", "Với cha hoặc người lớn trong nhà, có những bữa cơm mà chỉ cần nói tới chuyện cách sống là không khí đổi khác."],
    message: "Tin vào điều bạn đã tự kiểm chứng." },
  { lesson: "đảm nhận trách nhiệm và để lại dấu ấn trong công việc",
    plus: ["Bạn hay là người cuối cùng tắt đèn ở cơ quan, và khi đã ngồi vào một vị trí thì rất khó ai thay được bạn. Người ta nhớ bạn qua việc làm hơn là lời nói.", "Những năm đầu có thể chậm, nhưng mỗi năm qua đi, tiếng nói của bạn trong nghề lại nặng thêm một chút."],
    minus: ["Có những năm bạn làm gấp đôi người khác mà tên mình không xuất hiện ở đâu. Cảm giác không được ghi nhận ấy âm ỉ hơn bạn nghĩ.", "Con đường nghề có thể đổi hướng vài lần. Nếu chỉ ngồi chờ thời cơ, bạn sẽ chờ rất lâu; tay nghề thật mới là chìa khóa mở cửa."],
    message: "Làm cho tử tế, tên tuổi sẽ tự đến sau." },
  { lesson: "gặt hái thành quả và giữ những người bạn đúng",
    plus: ["Một người bạn cũ gọi điện giới thiệu một việc, và việc ấy mở ra cả một hướng mới. Mạng lưới của bạn hay làm việc thay bạn.", "Công sức của bạn thường ra kết quả, dù có khi nó đến vào đúng lúc bạn đã thôi chờ."],
    minus: ["Bạn đặt một mục tiêu rất xa mà không có cột mốc nhỏ nào ở giữa, rồi đến tháng thứ ba thì nản. Thứ bạn thiếu là những bậc thang, còn ý chí thì vẫn đủ.", "Không phải ai ngồi cùng bàn lúc vui cũng ở lại lúc khó. Có một lần bạn sẽ nhận ra điều đó, và từ đó bạn chọn bạn kỹ hơn."],
    message: "Thành quả lớn được ghép từ nhiều thành quả nhỏ." },
  { lesson: "biết lùi lại, buông bớt và nghỉ ngơi thật sự",
    plus: ["Những buổi sáng sớm một mình, chưa ai thức, là lúc bạn hiểu mình rõ nhất. Bạn nạp lại sức trong im lặng chứ không phải trong đám đông.", "Những gì bạn cho đi lặng lẽ, không ai biết, thường quay về với bạn theo một đường khác, vào lúc bạn không ngờ."],
    minus: ["Nằm trằn trọc lúc hai giờ sáng, những khoản chi không rõ tên, cảm giác hao sức dù chẳng làm gì nặng: đó là dấu hiệu bạn đang cho đi nhiều hơn mình còn.", "Nếu không có một khoảng riêng mỗi ngày, bạn dễ kiệt mà không biết vì sao, rồi trách mình yếu trong khi chỉ là thiếu chỗ để thở."],
    message: "Buông bớt để chừa chỗ cho điều đáng giữ." },
];

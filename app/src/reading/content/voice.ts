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
    plus: ["Khi bước vào một nơi mới, bạn thường được để ý mà không cần cố gắng.", "Sau một giai đoạn mệt, bạn hồi lại khá nhanh nếu được ngủ đủ và làm điều mình thích."],
    minus: ["Khi quá tải, bạn dễ nghi ngờ chính mình trước khi nghi ngờ hoàn cảnh.", "Nếu sống theo kỳ vọng của người khác quá lâu, bạn thấy mình mờ dần đi."],
    message: "Chăm mình trước, rồi mọi thứ khác mới có chỗ để đứng." },
  { lesson: "biết giữ những gì mình có: tiền, lời nói và nếp nhà",
    plus: ["Bạn biết cách để dành, và khoản để dành thường lớn dần dù thu nhập không quá cao.", "Lời bạn nói có trọng lượng; người khác nhớ bạn vì những câu bạn nói đúng lúc."],
    minus: ["Nếu chi tiêu theo cảm xúc, tiền đến bao nhiêu cũng thấy thiếu.", "Một câu nói vội có thể làm bạn mất nhiều hơn một khoản tiền."],
    message: "Giữ được mới là của mình." },
  { lesson: "dám tự tay làm, tự học và tự nói ra điều mình nghĩ",
    plus: ["Bạn học một kỹ năng mới khá nhanh khi thấy nó dùng được ngay.", "Khi có việc cần người đứng ra, bạn thường là người giơ tay trước."],
    minus: ["Nếu chờ đủ chắc chắn mới bắt đầu, bạn sẽ chờ rất lâu.", "Khoảng cách với anh chị em hoặc bạn bè đồng lứa có thể là điều bạn phải chấp nhận hơn là sửa."],
    message: "Cứ bắt đầu, sự tự tin sẽ theo sau." },
  { lesson: "có một chỗ để về, cả trong nhà lẫn trong lòng",
    plus: ["Nhà là nơi bạn nạp lại sức thật sự; một góc riêng yên tĩnh có tác dụng với bạn hơn mọi kỳ nghỉ.", "Bạn thường tạo được một mái ấm mà người khác muốn ghé lại."],
    minus: ["Nếu nơi ở không yên, mọi việc bên ngoài cũng khó trôi.", "Chuyện chuyển nhà hoặc khác biệt với người thân có thể lặp lại cho tới khi bạn tự dựng được chỗ đứng riêng."],
    message: "Bình yên không ở địa chỉ, mà ở cách bạn sống trong đó." },
  { lesson: "sống bằng niềm vui, sáng tạo và yêu một cách thật lòng",
    plus: ["Bạn làm tốt nhất những việc mình thấy vui, và niềm vui ấy lan sang người khác.", "Khi được tự do thử, bạn tạo ra những thứ có dấu ấn riêng."],
    minus: ["Nếu chỉ làm việc vì phải làm, bạn dễ thấy đời mình nhạt đi.", "Chuyện tình cảm hoặc con cái có thể đến chậm hoặc kèm nhiều lo lắng hơn bạn mong."],
    message: "Đừng để niềm vui phải xin phép." },
  { lesson: "giữ nhịp mỗi ngày: công việc, sức khỏe và cách xử lý va chạm",
    plus: ["Bạn xử lý được khối lượng việc mà người khác thấy ngợp.", "Trong cạnh tranh, bạn thường thắng nhờ bền hơn chứ không phải nhanh hơn."],
    minus: ["Nếu không có ngày nghỉ thật, cơ thể sẽ tự đòi lại.", "Những va chạm nhỏ ở nơi làm việc dễ tích lại thành mệt mỏi lớn nếu bạn im lặng quá lâu."],
    message: "Nghỉ ngơi cũng là một phần của công việc." },
  { lesson: "đứng cạnh một người khác mà vẫn là chính mình",
    plus: ["Những lần hợp tác thường mở ra cho bạn nhiều cơ hội hơn khi làm một mình.", "Đối tác hoặc bạn đời thường là người mở thêm cánh cửa cho bạn."],
    minus: ["Nếu chọn người vội, bạn dễ phải học bài học về ranh giới.", "Một mối quan hệ gắn bó với bạn thường cần qua một chặng điều chỉnh trước khi ổn định."],
    message: "Tìm người cùng đi, không phải người để dựa hẳn vào." },
  { lesson: "đi qua thay đổi và làm mới mình sau mất mát",
    plus: ["Sau mỗi biến cố, bạn đứng dậy với một cái nhìn sâu hơn.", "Bạn hiểu những chuyện người khác né tránh, và người ta hay tìm đến bạn lúc khó."],
    minus: ["Thay đổi lớn có thể đến không báo trước; một khoản dự phòng giúp bạn đỡ chao đảo.", "Tiền chung, tài sản chung là chuyện nên rõ ràng từ đầu."],
    message: "Cái gì phải đi thì để nó đi; bạn sẽ còn lại phần thật nhất." },
  { lesson: "có một niềm tin để sống theo và một người thầy để học",
    plus: ["Bạn thường gặp đúng người dẫn đường vào lúc cần.", "Những chuyến đi xa, những lần học lên cao hay mở ra cho bạn một chặng mới."],
    minus: ["Niềm tin của bạn hình thành qua nghi ngờ, nên bạn khó tin điều gì chỉ vì được dạy.", "Khác biệt quan điểm với cha hoặc người lớn có thể là chuyện quen thuộc."],
    message: "Tin vào điều bạn đã tự kiểm chứng." },
  { lesson: "đảm nhận trách nhiệm và để lại dấu ấn trong công việc",
    plus: ["Bạn hay được giao việc quan trọng, và khi đã ngồi vào vị trí thì giữ được.", "Người ta nhớ đến bạn qua việc bạn làm hơn là qua lời bạn nói."],
    minus: ["Con đường nghề có thể nhiều lần đổi hướng hoặc chậm được ghi nhận.", "Nếu chỉ chờ thời cơ, bạn sẽ chờ lâu; kỹ năng thật mới là thứ mở cửa."],
    message: "Làm cho tử tế, tên tuổi sẽ tự đến sau." },
  { lesson: "gặt hái thành quả và giữ những người bạn đúng",
    plus: ["Công sức của bạn thường ra kết quả, dù đôi khi đến muộn hơn mong đợi.", "Bạn bè và các mối quan hệ rộng hay mang cơ hội đến cho bạn."],
    minus: ["Nếu đặt mục tiêu quá xa mà không có cột mốc nhỏ, bạn dễ nản giữa chừng.", "Không phải ai đứng cạnh lúc vui cũng ở lại lúc khó; bạn sẽ học cách chọn bạn."],
    message: "Thành quả lớn được ghép từ nhiều thành quả nhỏ." },
  { lesson: "biết lùi lại, buông bớt và nghỉ ngơi thật sự",
    plus: ["Những lúc ở một mình là lúc bạn hiểu mình rõ nhất.", "Những gì bạn cho đi thường quay về theo một cách khác."],
    minus: ["Mất ngủ, chi tiêu vô hình hoặc cảm giác hao sức là dấu hiệu bạn đang cho đi quá nhiều.", "Nếu không có khoảng riêng, bạn dễ kiệt mà không biết vì sao."],
    message: "Buông bớt để chừa chỗ cho điều đáng giữ." },
];

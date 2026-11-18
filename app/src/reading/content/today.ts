// Hand-written reading atoms, part 16: the message for a given month, and the seven Jaimini roles.
// Voice: a short letter from a friend who has read your chart and looked at this month's sky.
import type { GrahaId } from "../../engine/constants.ts";

export const TODAY_TITLE = "Lời nhắn cho tháng {month}";

/** Where the person stands inside the running chapter decides the first words of the letter. */
export const TODAY_SEASON = {
  early: "Bạn mới bước vào giai đoạn “{title}” (đến {to}): {now}",
  middle: "Bạn đang ở giữa giai đoạn “{title}” (đến {to}): {now}",
  late: "Bạn đang ở cuối giai đoạn “{title}” (đến {to}): {now}",
};

export const TODAY_PARTS = {
  antar: "Trong giai đoạn này, giai đoạn nhỏ bạn đang đi qua thuộc về {antar}, nên {clause}.",
  antarPrat: "Trong giai đoạn này, giai đoạn nhỏ bạn đang đi qua thuộc về {antar}, nên {clause}. Đến {to} là chặng của {prat}, nên {clause2}.",
  fine: "Trong những tuần này, nhịp đang chạy thuộc về {fine}, nên {clause}.",
  next: "Giai đoạn này sắp khép lại, và giai đoạn “{title}” mở ra từ {from}.",
};

export const TODAY_SKY = {
  sadeRising: "Sao Thổ đang ở chặng đầu của Sade Sati, nên hãy chăm giấc ngủ, bữa ăn và những việc nền.",
  sadePeak: "Sao Thổ đang đứng trên cung Mặt Trăng của bạn (Sade Sati chặng giữa), nên nếu thấy nặng thì đó là thật, và nhịp sống đều là chỗ dựa tốt nhất.",
  sadeSetting: "Sao Thổ đang khép lại Sade Sati, nên điều bạn đã làm chắc mấy năm qua bắt đầu cho kết quả.",
  ashtama: "Sao Thổ đang ở cung thứ tám tính từ Mặt Trăng của bạn, nên hãy tránh quyết định liều và giữ một khoản dự phòng.",
  hit: "{t} đang {kind} với {n} trong lá số lúc bạn sinh, nên chuyện {role} {effect}.",
  jupiter: "Sao Mộc đang ở vị trí thuận so với Mặt Trăng của bạn, nên cơ hội và người giúp dễ đến hơn thường lệ.",
};

/** What a slow planet standing on a natal point does to that point's subject, as the end of one sentence in today's letter. */
export const HIT_TODAY: Record<"saturn" | "jupiter" | "rahu" | "ketu", string> = {
  saturn: "đang bị thử độ bền và đòi bạn nghiêm túc hơn thường lệ",
  jupiter: "đang được mở rộng và nâng đỡ",
  rahu: "đang bị phóng lớn lên và trông khác đi",
  ketu: "đang nhạt bớt và gọn lại",
};

/** One small action, by the lord of the current sub-period and by how the month looks. */
export const ACTION: Record<GrahaId, { good: string; mixed: string; hard: string }> = {
  sun: {
    good: "Tháng này hợp để nói rõ điều bạn muốn và đứng ra nhận việc.",
    mixed: "Hãy làm phần việc của mình cho đàng hoàng, và đừng cần được khen ngay.",
    hard: "Nếu lòng tự trọng bị chạm vào, hãy chờ một đêm rồi mới trả lời.",
  },
  moon: {
    good: "Tháng này hợp để về sớm, nấu một bữa tử tế và nói chuyện với người thân.",
    mixed: "Hãy giữ nhịp ăn ngủ đều, và ghi lại điều mình đang cảm trước khi quyết định chuyện gì.",
    hard: "Cảm xúc dễ nhạy hơn thường lệ, nên hãy dời cuộc nói chuyện nặng sang lúc khác.",
  },
  mars: {
    good: "Tháng này hợp để bắt tay vào việc đã hoãn, và dùng sức cho một việc cụ thể.",
    mixed: "Hãy vận động cơ thể trước khi làm việc cần đầu óc, để sức nóng có chỗ đi.",
    hard: "Tháng này dễ nóng nảy, nên trước khi phản ứng hãy đếm đến mười, và đừng ký gì trong cơn giận.",
  },
  mercury: {
    good: "Tháng này hợp để viết, học, hoặc chốt một thỏa thuận còn dở.",
    mixed: "Làm từng việc một và ghi ra giấy, vì đầu óc dễ chạy nhiều hướng.",
    hard: "Tháng này dễ hiểu nhầm nhau, nên hãy đọc lại tin nhắn một lần trước khi gửi.",
  },
  jupiter: {
    good: "Tháng này hợp để xin lời khuyên, học thêm, hoặc nhận một lời giúp.",
    mixed: "Hãy nói lời cảm ơn với một người đã giúp bạn, vì điều tốt đang chờ ở chỗ đó.",
    hard: "Đừng hứa quá tay hoặc nhận quá nhiều, vì tháng này lòng tốt dễ vượt sức.",
  },
  venus: {
    good: "Tháng này hợp để gặp người bạn quý và dành cho mình một điều dễ chịu.",
    mixed: "Làm một điều nhỏ cho mối quan hệ gần nhất, như một tin nhắn hay một bữa ăn.",
    hard: "Đừng chi tiêu cho một cảm giác nhất thời, và đừng nói lời mềm để tránh một việc cần nói thẳng.",
  },
  saturn: {
    good: "Tháng này hợp để làm việc đều tay và hoàn thành một việc còn tồn.",
    mixed: "Chọn một việc nặng và làm xong phần đầu tiên của nó.",
    hard: "Cảm giác nặng là có thật, nên hãy làm ít hơn nhưng làm trọn, và ngủ đủ.",
  },
  rahu: {
    good: "Tháng này hợp để thử một điều mới, miễn là bạn giữ một chân trên mặt đất.",
    mixed: "Cẩn thận với điều nghe quá tốt, và hỏi thêm một người đáng tin.",
    hard: "Tháng này dễ bị cuốn theo điều lạ hoặc một nỗi lo không tên, nên hãy chậm lại trước khi quyết định.",
  },
  ketu: {
    good: "Tháng này hợp để dọn bớt, đóng một việc đã cũ, hoặc ngồi yên một lúc.",
    mixed: "Cho phép mình rút khỏi một việc không còn làm bạn thấy sống.",
    hard: "Nếu thấy mọi thứ vô vị thì đừng quyết định chuyện gì lớn, vì đó chỉ là một nhịp.",
  },
};

/**
 * What the Sun does in each house of the chart for about a month: what is stressed, what suits, what to watch.
 * Sources: "Sun Gochar: Transit Effects in the 12 Houses" (DiAstrologer), "Surya: The Sun" (jyotish.info), "Gocara: Results of Transits
 * from the Moon" (E. Wilhelm), "Light on Life"; notebook answer of 16/11/2026, see SOURCES.md. Index = house - 1.
 */
export const MONTH_THEME: { main: string; good: string; care: string }[] = [
  { main: "sức sống và cái tôi của bạn được nhấn mạnh", good: "rèn sức khỏe và làm mới diện mạo", care: "cái tôi quá cao và sự nóng nảy" },
  { main: "tiền bạc và gia đình được nhấn mạnh", good: "rà ngân sách và quản lý nguồn lực", care: "lời nói gay gắt làm mất hòa khí hoặc hao tiền" },
  { main: "dũng khí và kỹ năng được nhấn mạnh", good: "khởi sự dự án, viết, truyền thông và giao thiệp", care: "tranh cãi với anh chị em và những chuyến đi vội" },
  { main: "tổ ấm và nhà cửa được nhấn mạnh", good: "sắp xếp và sửa sang chỗ ở", care: "căng thẳng trong gia đình" },
  { main: "sáng tạo và học tập được nhấn mạnh", good: "nghiên cứu sâu và phát triển ý tưởng", care: "đầu cơ mạo hiểm và áp đặt cái tôi lên con cái" },
  { main: "công việc và sức khỏe được nhấn mạnh", good: "giải quyết nợ nần và vượt trở ngại ở nơi làm", care: "kiệt sức và đối đầu gay gắt" },
  { main: "đối tác và hôn nhân được nhấn mạnh", good: "đàm phán hợp đồng và gặp khách hàng", care: "áp ý mình lên người kia và tranh chấp pháp lý" },
  { main: "những biến động và tài sản chung được nhấn mạnh", good: "nghiên cứu sâu và sắp xếp lại tài chính chung", care: "tranh chấp quyền lợi và những lo âu giữ kín" },
  { main: "đạo lý và tri thức cao được nhấn mạnh", good: "học thêm và tìm người dẫn dắt", care: "bảo thủ quan điểm và bất đồng với bề trên" },
  { main: "sự nghiệp và danh tiếng được nhấn mạnh", good: "nhận nhiệm vụ mới và làm việc với người lãnh đạo", care: "thói độc đoán và lạm quyền gây thị phi" },
  { main: "thu nhập, bạn bè và mục tiêu được nhấn mạnh", good: "mở rộng mạng lưới và đón dòng tiền", care: "áp ý chí của mình lên cả nhóm" },
  { main: "sự tĩnh lặng và những nơi xa được nhấn mạnh", good: "làm việc thiện, tĩnh tâm và nghỉ ngơi", care: "chi tiêu thất thoát và giấc ngủ xáo trộn" },
];

export const MONTH_SUN = {
  one: "Cả tháng này Mặt Trời đi qua nhà {h} của bạn, nên {main}: hợp để {good}, và nên cẩn thận với {care}.",
  two: "Đầu tháng Mặt Trời ở nhà {h1} của bạn, nên {main1}: hợp để {good1}, và nên cẩn thận với {care1}. Từ khoảng giữa tháng nó sang nhà {h2}, nên {main2}: hợp để {good2}, và nên cẩn thận với {care2}.",
  oneNoTime: "Cả tháng này Mặt Trời đi qua cung {sign}, tức cung thứ {h} tính từ Mặt Trăng lúc bạn sinh.",
  twoNoTime: "Đầu tháng Mặt Trời ở cung {s1}, rồi từ khoảng giữa tháng sang cung {s2}, tức cung thứ {h1} rồi thứ {h2} tính từ Mặt Trăng lúc bạn sinh.",
  good: "Tính từ Mặt Trăng lúc bạn sinh, vị trí này của Mặt Trời được coi là thuận, nên những việc trên dễ thành.",
  hard: "Tính từ Mặt Trăng lúc bạn sinh, vị trí này của Mặt Trời được coi là chưa thuận, nên hãy làm chậm và chắc.",
};

/** The one question to carry, by where the Sun stands for most of the month, counted from the Lagna. Index = house - 1. */
export const MONTH_ASK: string[] = [
  "Tháng này điều gì cho bạn cảm giác mình đang sống đúng với mình?",
  "Tháng này bạn đang giữ điều gì chặt hơn mức cần?",
  "Việc nhỏ nào bạn đã hoãn lâu và có thể bắt đầu trong tháng này?",
  "Lúc nào trong tuần bạn thấy mình về đến nhà, dù đang ở đâu?",
  "Điều gì làm bạn vui mà đã lâu bạn không cho phép mình làm?",
  "Thói quen nhỏ nào đang âm thầm làm bạn mệt?",
  "Có người nào bạn đang nợ một lời nói thẳng, hoặc một lời cảm ơn?",
  "Điều gì bạn đang giữ im lặng vì sợ nó làm mọi thứ thay đổi?",
  "Tháng này bạn đang tin vào điều gì, và nó còn đúng không?",
  "Nếu cuối tháng người ta chỉ nhớ một việc bạn làm, bạn muốn đó là việc nào?",
  "Ai trong vòng bạn bè xứng đáng nhận một tin nhắn của bạn trong tháng này?",
  "Điều gì bạn có thể buông trong tháng này mà không ai mất gì?",
];

export const TODAY_NOTIME_NOTE =
  "Vì chưa có giờ sinh, lời nhắn này chỉ dựa vào đại vận và vị trí của các hành tinh so với Mặt Trăng của bạn. Có giờ sinh, nó sẽ nói được chuyện ở từng nhà.";

// ------------------------------------------------------------------ the seven roles of Jaimini

export const KARAKA_FRAME: Record<string, { intro: string; line: string }> = {
  AK: {
    intro: "Đây là hành tinh dẫn đường của bạn, phần sâu nhất của lá số. Trang trước đã nói kỹ về nó.",
    line: "{p} giữ vai trò này, nên bài học của bạn mang màu {gift}. Điều cần để ý là {shadow}.",
  },
  AmK: {
    intro: "Người cố vấn nói về cách bạn kiếm sống và vai trò hợp với bạn nhất trong công việc.",
    line: "Với bạn, người cố vấn là {p}: {gift}. Cách bạn làm việc hay mang màu đó.{where} Điều cần để ý là {shadow}.",
  },
  BK: {
    intro: "Người anh em nói về anh chị em, người cùng lứa và khả năng tự tay làm việc.",
    line: "{p} giữ vai này, nên chuyện anh chị em và việc tự mình bắt tay làm mang màu {gift}.{where} Điều cần để ý là {shadow}.",
  },
  MK: {
    intro: "Người mẹ nói về mẹ hoặc người từng nuôi bạn, và về nơi chốn khiến bạn thấy thuộc về.",
    line: "{p} giữ vai này, nên chuyện mẹ, nhà và cảm giác thuộc về mang màu {gift}.{where} Điều cần để ý là {shadow}.",
  },
  PK: {
    intro: "Người con nói về con cái, học trò và những gì bạn sáng tạo ra để lại.",
    line: "{p} giữ vai này, nên cách bạn sáng tạo, dạy và nuôi lớn một điều gì đó mang màu {gift}.{where} Điều cần để ý là {shadow}.",
  },
  GK: {
    intro: "Người thử thách nói về đối thủ, người làm bạn mệt và những mối quan hệ khó.",
    line: "{p} giữ vai này, nên những chỗ bạn phải đấu tranh hoặc chịu thử thách mang màu {gift}.{where} Điều cần để ý là {shadow}.",
  },
  DK: {
    intro: "Người đối diện nói về bạn đời và người cùng bạn đi một đoạn dài.",
    line: "{p} giữ vai này, nên người bạn đời hay mang màu {gift}.{where} Điều cần để ý là {shadow}.",
  },
};

export const KARAKA_WHERE = " Nó đang ngồi ở nhà {h}, nên chuyện này gắn với chuyện {tag}.";

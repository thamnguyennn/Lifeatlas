// Hand-written reading atoms, part 9: the nine Vimshottari periods as chapters of a life.
// title = a short name; asks = what the chapter asks of you; scene = a pattern that tends to show up;
// trap = where people usually stumble; ask = a question; now = one sentence used when the chapter is the current one.

import type { GrahaId } from "../../engine/constants.ts";

export interface Chapter { title: string; asks: string; scene: string; trap: string; ask: string; now: string }

export const CHAPTER: Record<GrahaId, Chapter> = {
  sun: {
    title: "tự đứng lên",
    asks: "Giai đoạn này đòi bạn xác định mình là ai và đứng trên đôi chân của mình. Công việc, vị thế, chuyện với cha và với những người có quyền đều được soi lại.",
    scene: "Điều hay gặp là bạn không còn chịu ở dưới người khác khi thấy mình làm được tốt hơn, và muốn được ghi nhận rõ ràng.",
    trap: "Cái bẫy là cái tôi bị đụng đến và những cuộc tranh quyền. Tim, mắt và xương cũng nên được để ý.",
    ask: "Bạn muốn đứng lên vì điều gì, ngoài việc để không ai sai bảo mình?",
    now: "Điều đang được hỏi là bạn muốn đứng ở đâu và đứng vì điều gì.",
  },
  moon: {
    title: "về với cảm xúc và nơi chốn",
    asks: "Giai đoạn này đưa cảm xúc, gia đình, nơi ở và sự an toàn trong lòng lên hàng đầu. Mẹ, những người chăm sóc và việc chăm sóc người khác dễ trở thành chủ đề.",
    scene: "Điều hay gặp là bạn nhạy hơn, nhớ nhà hơn, và muốn một nhịp sống êm dưới chân.",
    trap: "Cái bẫy là để tâm trạng lên xuống kéo theo quyết định. Giấc ngủ và giờ ăn đều đặn quan trọng hơn bình thường.",
    ask: "Điều gì đang làm bạn thấy an toàn, và điều gì chỉ trông giống an toàn?",
    now: "Những năm này, chuyện nhà và chuyện lòng đòi được ưu tiên hơn lịch làm việc.",
  },
  mars: {
    title: "hành động",
    asks: "Giai đoạn này đòi bạn hành động: khởi sự, tranh đấu cho điều mình muốn, vượt qua nỗi sợ.",
    scene: "Điều hay gặp là bạn có sức bật, nóng hơn thường lệ, và sốt ruột với mọi thứ chậm.",
    trap: "Cái bẫy là nóng nảy, liều và va chạm, kể cả với người thân. Vận động cơ thể giúp bạn xả bớt.",
    ask: "Điều gì bạn sẽ dám làm nếu thôi chờ đến khi chắc chắn?",
    now: "Những năm này, việc chờ thêm thường tốn hơn việc thử sớm.",
  },
  mercury: {
    title: "học và trao đổi",
    asks: "Giai đoạn này đẩy trí óc, giao tiếp, buôn bán, học hành và kỹ năng lên phía trước.",
    scene: "Điều hay gặp là bạn học nhiều thứ, gặp nhiều người, và đổi hướng nghề ít nhất một lần.",
    trap: "Cái bẫy là phân tán và nghĩ ngợi nhiều. Thần kinh và giấc ngủ cần được để ý.",
    ask: "Trong tất cả những gì bạn đang học, điều nào bạn sẽ thật sự dùng?",
    now: "Những năm này, điều bạn học và người bạn trò chuyện cùng định hướng nhiều hơn bạn nghĩ.",
  },
  jupiter: {
    title: "mở rộng và tìm ý nghĩa",
    asks: "Giai đoạn này mở rộng đời sống: học vấn cao, người thầy, niềm tin, con cái và vận may. Nó hay mang đến những cơ hội đến từ điều bạn đã gieo từ trước.",
    scene: "Điều hay gặp là bạn nhìn xa hơn, rộng lượng hơn, và gặp một người hoặc một ý tưởng đổi cách bạn nghĩ.",
    trap: "Cái bẫy là ôm quá nhiều, lạc quan quá mức, và tăng cân hay tăng nợ mà không để ý.",
    ask: "Khi cơ hội mở ra, bạn sẵn lòng cam kết với điều gì?",
    now: "Những năm này, một lời mời hay một người thầy đến đúng lúc có thể mở cả một hướng mới.",
  },
  venus: {
    title: "yêu, thưởng thức và gắn kết",
    asks: "Giai đoạn này đưa tình yêu, hôn nhân, tiền bạc, thẩm mỹ và sự thoải mái lên cao.",
    scene: "Điều hay gặp là bạn chăm diện mạo và không gian sống hơn, quan hệ lãng mạn nặng ký hơn, và bạn chi cho điều làm mình dễ chịu.",
    trap: "Cái bẫy là mê sự thoải mái, tiêu theo cảm giác, và yêu bằng cách lý tưởng hóa.",
    ask: "Điều gì khiến bạn thật sự thấy được yêu, ngoài những thứ làm bạn thấy dễ chịu?",
    now: "Những năm này, bạn hợp với những gì làm lòng mềm ra: người, nơi chốn, cái đẹp.",
  },
  saturn: {
    title: "trách nhiệm và bền bỉ",
    asks: "Giai đoạn này đòi sự nghiêm túc: gánh trách nhiệm, làm việc đều, xây thứ lâu dài và chịu cô đơn khi cần.",
    scene: "Điều hay gặp là thời gian nặng hơn và kết quả chậm hơn, nhưng thứ bạn dựng ở đây thường đứng rất lâu.",
    trap: "Cái bẫy là khắt khe với mình, lạnh lùng và kiệt sức. Xương khớp và tâm trạng thấp cần được để ý.",
    ask: "Điều gì đáng để bạn kiên nhẫn xây trong giai đoạn này?",
    now: "Những năm này, thứ gì xây chậm mà chắc thì đáng để giữ.",
  },
  rahu: {
    title: "khao khát và đổi hướng",
    asks: "Giai đoạn này kéo bạn ra khỏi khuôn quen: tham vọng, cơ hội lạ, nước ngoài, công nghệ, những người khác lối. Bạn muốn nhiều hơn mức cũ cho phép.",
    scene: "Điều hay gặp là cuộc sống đổi hướng nhanh, có cảm giác không bao giờ đủ, và những người, nơi chốn bất ngờ bước vào.",
    trap: "Cái bẫy là chạy theo cái lạ, ảo tưởng, nghi ngờ và nghĩ quá nhiều. Tâm trí cần một chỗ neo.",
    ask: "Điều bạn đang đuổi theo là điều bạn cần, hay điều bạn tưởng mình thiếu?",
    now: "Những năm này, điều mới lạ hấp dẫn bạn hơn thường lệ.",
  },
  ketu: {
    title: "buông và quay vào trong",
    asks: "Giai đoạn này bóc dần những thứ bạn từng bám: vai trò, mối quan hệ, mục tiêu đã hết sức hút. Nó mời bạn quay về với chính mình.",
    scene: "Điều hay gặp là bạn thấy chán điều từng say mê, muốn ít người xung quanh hơn, và có những quyết định buông bất ngờ.",
    trap: "Cái bẫy là rút lui quá nhiều và thấy mất phương hướng. Bạn cần một thực hành tĩnh tâm và một người để nói thật.",
    ask: "Điều gì đã xong với bạn mà bạn chưa cho phép mình rời đi?",
    now: "Những năm này, bớt đi một thứ thường nhẹ hơn thêm một thứ.",
  },
};

// ---------------------------------------------------------------- what a chapter lights up
// A Dasha chapter pulls forward the houses its lord rules (DASHA_LIT) and plays out through the house where that lord sits (DASHA_STAGE).
// These are written for the chapter frame, so they never repeat the sentences of the "Mười hai nhà" section.

/** DASHA_LIT[h - 1]: the chapter lights up house h. */
export const DASHA_LIT: string[] = [
  "Chuyện của chính bạn lên trước: cách bạn nhìn mình, sức khỏe và hình ảnh bạn mang ra ngoài đều được hỏi lại. Giai đoạn này hay đến cùng cảm giác muốn sống đúng với mình hơn là đúng với kỳ vọng.",
  "Tiền, lời nói và gia đình gốc lên tiếng. Bạn thấy rõ mình đang giữ gì, tiêu vào đâu, và những câu nói trong nhà đã định giá bạn ra sao.",
  "Chuyện tự tay làm lên tiếng: điều bạn dám bắt đầu, kỹ năng bạn luyện, anh chị em hay người đồng trang lứa. Giai đoạn này thưởng cho người chịu làm và chịu nói ra.",
  "Chuyện nhà lên tiếng: nơi ở, mẹ, cảm giác có chỗ về. Nhiều người trong giai đoạn này dọn nhà, sửa nhà, hoặc cuối cùng cũng hỏi mình đâu là nơi thấy yên.",
  "Niềm vui và sáng tạo lên tiếng: tình yêu mới, con cái, thứ bạn làm vì thích. Giai đoạn này hỏi lần cuối cùng bạn chơi thật là khi nào.",
  "Việc hằng ngày, sức khỏe và những cuộc cạnh tranh lên tiếng. Giai đoạn này đòi kỷ luật, và cơ thể báo sớm nếu bạn gồng quá.",
  "Hôn nhân và hợp tác lên tiếng: ai ở cạnh bạn, ai đứng đối diện, ai đáng để cam kết. Quan hệ gần nhất trở thành tấm gương rõ nhất.",
  "Những chuyện sâu lên tiếng: biến cố, tiền chung, điều giấu kín, những lần phải bỏ cái cũ. Giai đoạn này thường khó chịu lúc đầu và để lại thứ vững nhất về sau.",
  "Niềm tin, người thầy, việc học cao và những chuyến đi xa lên tiếng. Giai đoạn này hay mang đến một người hoặc một ý tưởng đổi cách bạn hiểu đời.",
  "Sự nghiệp và vị thế lên tiếng: điều bạn được biết đến, trách nhiệm bạn gánh, người nhìn vào việc bạn làm. Công việc có xu hướng đòi bạn nhiều hơn và trả lại nhiều hơn.",
  "Thành quả, bạn bè và mục tiêu lớn lên tiếng. Giai đoạn này hay đưa bạn vào những vòng người mới, và điều bạn gieo từ trước bắt đầu có kết quả.",
  "Đời sống nội tâm lên tiếng: giấc ngủ, nơi xa, thời gian một mình, những chi phí âm thầm. Giai đoạn này cần khoảng lặng, và bạn đỡ mệt khi có chỗ để rút lui.",
];

/** DASHA_STAGE[p - 1]: the lord of the chapter sits in house p, so the chapter plays out there. */

/** DASHA_STAGE[p - 1]: the lord of the chapter sits in house p, so the chapter plays out there. Read after: Giai đoạn “…” diễn ra */
export const DASHA_STAGE: string[] = [
  "ngay trên con người bạn: bạn là người đứng ra làm, và người ngoài thấy sự đổi thay ở bạn trước khi thấy kết quả.",
  "qua tiền bạc và lời nói: thu nhập, cách bạn định giá mình, những cuộc nói chuyện trong gia đình.",
  "qua việc tự tay làm: bạn phải tự bắt đầu, tự luyện, và hay làm cùng anh chị em hoặc bạn đồng trang lứa.",
  "qua nhà cửa và đời sống nội tâm: nơi ở, mẹ, và cảm giác yên hay không yên khi về đến cửa.",
  "qua sáng tạo, tình yêu và con cái: bạn học bằng niềm vui nhiều hơn bằng nghĩa vụ.",
  "qua công việc hằng ngày và sức khỏe: thay đổi nằm ở thói quen, nhịp làm việc và cách bạn chăm cơ thể.",
  "qua người đối diện: bạn đời, đối tác, khách hàng. Bạn hiểu mình hơn qua cách họ phản hồi.",
  "qua những chuyển đổi sâu: một mất mát, một cuộc khủng hoảng hay một lần nhìn thẳng vào điều ẩn. Nó khó chịu lúc đầu và làm bạn chắc hơn về sau.",
  "qua niềm tin và những chuyến đi: học thêm, gặp người thầy, đi xa hoặc đổi cách nhìn đời.",
  "qua công việc và vị thế: người ta thấy bạn làm gì, và bạn thấy rõ mình muốn đi đến đâu.",
  "qua bạn bè, mạng lưới và thu nhập: người quen mở cửa, mục tiêu lớn dần rõ hơn.",
  "khá kín: trong giấc ngủ, ở những nơi xa, trong những lúc một mình. Ít ai thấy, nhưng bạn thấy rất rõ.",
];

// ---------------------------------------------------------------- the nine periods told in the notebook's voice (bản 3)
// One opening scene, then work and money, people and the mood of an ordinary morning, then the trade-off, the temptation,
// and what is usually left in your hands at the end. Material from the reference notebook, "Đại vận" (see SOURCES.md).

export interface ChapterDeep { open: string; work: string; money: string; people: string; morning: string; cost: string; trap: string; harvest: string }

export const CHAPTER_DEEP: Record<GrahaId, ChapterDeep> = {
  sun: {
    open: "Đây là những năm bạn bước ra chỗ sáng. Người ta bắt đầu hỏi \"việc này ai chịu trách nhiệm\", và câu trả lời ngày càng hay là bạn.",
    work: "Bạn được giao, hoặc tự nhận, phần việc chính; làm việc trực tiếp với cấp trên, với cơ quan nhà nước hay người có quyền. Lời bạn nói có trọng lượng hơn trước, và đi kèm là việc phải quyết dứt khoát.",
    money: "Tiền đến theo chức vụ và uy tín. Nhưng tiền cũng đi ra cho việc giữ thể diện và đỡ đần người trong họ, nhiều hơn bạn dự tính.",
    people: "Chuyện với cha hoặc người bề trên trở thành tâm điểm. Trong nhà, bạn dễ muốn chỉ đạo người bạn đời, và cái tôi của hai người hay va nhau.",
    morning: "Bạn thức dậy với cảm giác phải chứng minh mình, phải là người dẫn đầu, không được phép yếu.",
    cost: "Sự thảnh thơi vô tư. Đứng ở chỗ sáng nghĩa là bị nhìn kỹ, bị soi từng việc.",
    trap: "Kiêu ngạo, độc đoán, gạt lời khuyên của người khác, và dùng quyền để xoa cái tự ái của mình.",
    harvest: "Một vị trí rõ ràng mà người khác thừa nhận, và sự tự tin vào năng lực của chính mình.",
  },
  moon: {
    open: "Đây là những năm lòng bạn được đặt lên trước lịch làm việc. Nhà cửa, người thân và cảm giác an toàn trở thành câu hỏi chính.",
    work: "Bạn hợp với việc hướng về con người: chăm sóc khách hàng, bán hàng, dịch vụ, làm việc với đám đông. Công việc lên xuống theo nhịp cảm xúc và trực giác của bạn.",
    money: "Tiền vào ra như con nước. Bạn kiếm được nhờ người ta quý mình, và cũng tiêu theo cảm xúc cho nhà cửa, đồ dùng, những thứ làm tổ ấm dễ chịu hơn.",
    people: "Mẹ và những người phụ nữ trong đời giữ vai trò lớn. Gia đình có thể đón tin vui, có thêm người, nhưng bạn cũng nhạy hơn với từng lời nói của người bạn đời.",
    morning: "Có sáng thức dậy thấy yêu đời lạ thường, có sáng lại bồn chồn, nhớ chuyện cũ, lo một điều không rõ tên.",
    cost: "Vỏ bọc lý trí. Bạn phải sống thật với những lúc mềm yếu thay vì giả vờ là mình ổn.",
    trap: "Để cảm xúc nhất thời quyết thay những việc lớn, níu kéo quá khứ, và cả nể để làm vừa lòng người khác.",
    harvest: "Một mái nhà gắn bó hơn, sự hiểu người sâu hơn, và một sự bình yên có được sau nhiều lần lên xuống.",
  },
  mars: {
    open: "Đây là những năm bạn xắn tay áo. Mọi thứ đòi được làm ngay, và bạn là người không chịu ngồi chờ.",
    work: "Nhịp làm việc tăng hẳn: cạnh tranh để giành việc, đi lại nhiều, xử lý chuyện kỹ thuật, máy móc hoặc đất đai. Bạn giỏi nhất khi có một mục tiêu rõ để lao tới.",
    money: "Tiền dễ được dồn vào tài sản cố định như nhà, đất. Bạn dám bỏ vốn lớn, nhưng cũng dễ mất vì một quyết định vội.",
    people: "Dễ va chạm với anh chị em hoặc đồng nghiệp vì nói thẳng và nóng. Trong tình cảm, bạn muốn mọi thứ rõ ràng ngay và ít kiên nhẫn để nghe hết.",
    morning: "Bạn thức dậy muốn bắt tay vào việc liền, và thấy mọi người xung quanh sao mà chậm.",
    cost: "Sự êm ấm dĩ hòa vi quý. Muốn tiến lên, bạn phải chấp nhận va chạm và giữ ranh giới của mình.",
    trap: "Bốc đồng, dùng lời cay hoặc sức ép để áp đảo người khác, và hiếu thắng đến mức kéo nhau vào tranh chấp không đáng.",
    harvest: "Một tài sản cụ thể, một bản lĩnh không ngại khó, và khả năng biến ý định thành việc làm.",
  },
  rahu: {
    open: "Đây là những năm bạn bị cuốn ra khỏi khuôn quen. Cơ hội đến nhanh, lạ, và thường lớn hơn bạn tưởng mình đủ sức nhận.",
    work: "Bạn bước vào những lĩnh vực mới: công nghệ, làm ăn với nước ngoài, môi trường nhiều văn hóa. Sự nghiệp có những cú nhảy bất ngờ, và cả những lúc chênh vênh không biết đứng ở đâu.",
    money: "Tiền đến nhanh từ những cơ hội không theo lối cũ, nhưng túi như không có đáy. Những khoản lớn đến rồi đi trong các kế hoạch táo bạo.",
    people: "Vòng bạn bè thay đổi liên tục, bạn quen nhiều kiểu người khác hẳn mình. Dễ có những mối quan hệ cuốn hút đến mờ mắt, và cảm giác không ai thật sự hiểu mình.",
    morning: "Bạn thức dậy bồn chồn, thấy mình chưa đủ, đầu óc chạy đua với cả trăm ý tưởng và nỗi sợ bị bỏ lại phía sau.",
    cost: "Sự giản dị của nếp sống quen. Bạn lao vào một nhịp sống cạnh tranh hơn, và phải tự tìm chỗ neo cho mình.",
    trap: "Đi đường tắt, những vụ làm ăn mập mờ, và ảo tưởng rằng quyền lực hay danh tiếng nhất thời là của mình mãi.",
    harvest: "Một tầm nhìn rộng hơn nhiều, sự nhạy bén trong làm ăn, và một bài học rất sâu về điều gì là thật, điều gì chỉ sáng lóa.",
  },
  jupiter: {
    open: "Đây là những năm cửa mở rộng hơn. Người ta tìm đến bạn để hỏi ý, và bạn cũng gặp được những người thầy của riêng mình.",
    work: "Bạn hợp vai cố vấn, quản lý, đào tạo, giảng dạy. Công việc đi lên nhờ uy tín chuyên môn và sự đàng hoàng của bạn, hơn là nhờ quan hệ.",
    money: "Tài chính đi lên đều và bền, từ những việc chính đáng, tư vấn hay đầu tư dài hạn. Bạn sẵn lòng chi cho việc học và việc giúp người.",
    people: "Bạn gần những người hiểu biết và tử tế. Trong nhà có nhiều tin vui, nhất là chuyện học hành của người trẻ, và bạn được người xung quanh kính trọng hơn.",
    morning: "Bạn thức dậy lạc quan, rộng lòng hơn, và thấy cuộc sống có một ý nghĩa đáng để theo.",
    cost: "Sự xông xáo tự do của tuổi trẻ. Bạn khoác lên mình vai trò người có trách nhiệm, người làm gương.",
    trap: "Tự mãn, coi nhẹ rủi ro, hứa nhiều làm ít, và có lúc giảng đạo lý cho người khác.",
    harvest: "Hiểu biết sâu hơn, một gia đình ấm, những người bạn đã dìu dắt nay đứng được, và sự kính trọng có thật.",
  },
  saturn: {
    open: "Đây là những năm bạn bị kéo từ trên mây xuống đất. Không còn may mắn từ trời rơi xuống; mỗi bước tiến đều phải đổi bằng công sức và thời gian.",
    work: "Việc tăng lên gấp bội, và bạn phải tự tay làm cả những phần nhỏ nhất. Có những ngày ngồi lì trước bàn làm việc rất lâu, xử lý từng con số, từng tờ giấy. Kết quả đến chậm, nhưng đến.",
    money: "Tiền bị siết lại. Phần lớn đi vào những nghĩa vụ không thể bỏ: trả nợ, lo cho cha mẹ, cho người thân. Bạn quen kiểm tra tài khoản mỗi sáng và đắn đo trước một món đồ đắt.",
    people: "Những quan hệ xã giao hời hợt rơi rụng dần. Bạn chỉ giữ lại vài người thật sự nghiêm túc và cùng chịu khó. Trong nhà bạn gánh phần nặng, mà lời nói lại hay bị cho là khô khan, khắt khe.",
    morning: "Thức dậy, điều đầu tiên trong đầu không còn là sự hào hứng, mà là danh sách những việc phải làm, những khoản phải trả. Bạn trầm hơn, ít đùa hơn, nhưng có một ý chí rất lì, không cho phép mình gục.",
    cost: "Sự thảnh thơi, những cuộc vui, và cả sự ngây thơ. Bạn già dặn trước tuổi trong cách nghĩ, đổi niềm vui tức thời lấy sự an toàn lâu dài.",
    trap: "Than thân, bi quan rồi buông xuôi; cay nghiệt với người xung quanh; hoặc nôn nóng làm giàu nhanh, bỏ ngang giữa chừng để rồi mất hết những gì đang xây.",
    harvest: "Một nền móng vật chất rất vững, tay nghề ở mức người ta phải nể, và sự tự do của người không còn sợ khó khăn.",
  },
  mercury: {
    open: "Đây là những năm đầu óc bạn được làm mới. Mọi thứ chạy nhanh hơn: tin nhắn, hợp đồng, những cuộc hẹn bàn công việc.",
    work: "Giấy tờ, máy tính, thương lượng diễn ra liên tục. Bạn bắt nhịp thị trường rất nhanh, và hợp với buôn bán, viết lách, làm nội dung hay những nghề cần nói và nghĩ nhanh.",
    money: "Tiền đến từ nhiều nguồn linh hoạt. Đầu óc tính toán nhạy giúp bạn gia tăng tài sản qua việc mua bán và dịch vụ.",
    people: "Bạn quen thêm nhiều người trẻ, vui tính; giao thiệp rộng, gần gũi hơn với họ hàng bên ngoại và với đối tác làm ăn.",
    morning: "Bạn thức dậy nhẹ nhõm, lanh lợi, muốn mở điện thoại xem tin tức và nói chuyện với mọi người ngay.",
    cost: "Những khoảng lặng sâu. Bạn hòa vào một nhịp sống hối hả, tính toán thiệt hơn từng chút.",
    trap: "Nói dối hay dùng mánh khóe để có lợi trước mắt, ôm quá nhiều việc cùng lúc đến mức chỉ chạm được bề mặt của mỗi việc.",
    harvest: "Khả năng giao tiếp và làm ăn ở mức thành thạo, một mạng lưới quan hệ đa dạng, và những tài sản dễ xoay chuyển.",
  },
  ketu: {
    open: "Đây là những năm nhiều thứ từng quan trọng bỗng nhạt đi. Bạn không còn muốn chen chân vào những chỗ đông người.",
    work: "Bạn chán sự bon chen, muốn làm việc độc lập, nghiên cứu sâu một lĩnh vực, hoặc lui về phía hậu trường. Việc âm thầm hợp với bạn hơn việc phô bày.",
    money: "Bạn ít màng làm giàu. Tiền đến vừa đủ theo nhu cầu, nhưng nếu cố níu giữ hay tham thêm, nó lại dễ trôi tuột đi.",
    people: "Bạn thấy lạc lõng giữa bạn bè cũ, xa người thân hơn một chút, bớt những cuộc xã giao, và tìm được tiếng nói chung với vài người có chiều sâu.",
    morning: "Bạn thức dậy trong một sự yên lặng lạ. Có lúc trống trải vì mục tiêu cũ không còn kéo được mình, có lúc lại nhẹ vì không còn bị ràng buộc.",
    cost: "Vị trí trung tâm, những mối quan hệ ồn ào và những tham vọng từng có. Đổi lại là sự tự do của lòng mình.",
    trap: "Tự cô lập quá mức, trốn tránh những bổn phận đời thường, và thái độ mặc kệ tất cả.",
    harvest: "Một trực giác rất nhạy, khả năng nhìn ra bản chất của mọi chuyện, và một tâm hồn nhẹ, ít sợ mất mát.",
  },
  venus: {
    open: "Đây là những năm cuộc sống mềm lại và đẹp lên. Chuyện người với người, chuyện thoải mái và cái đẹp được kéo lên trước.",
    work: "Bạn hợp với việc liên quan đến cái đẹp, nghệ thuật, thiết kế, giải trí, hay chăm sóc đời sống con người. Công việc trôi chảy nhờ sự khéo léo trong giao tiếp.",
    money: "Tiền đến dễ hơn, nhiều khi qua hôn nhân hoặc qua người cùng làm. Bạn cũng chi mạnh tay cho xe, đồ đẹp, trang trí nhà cửa.",
    people: "Tình yêu và hôn nhân được chú ý nhiều nhất. Đời sống lứa đôi dễ hòa hợp, bạn có sức hút với người khác, và bạn bè mang đến nhiều niềm vui.",
    morning: "Bạn thức dậy thư thái, muốn chăm chút cho mình, ăn một bữa sáng ngon và nhìn những thứ đẹp quanh mình.",
    cost: "Sự rèn luyện khắt khe. Bạn dễ chiều mình hơn và sống theo nhịp hưởng thụ nhiều hơn.",
    trap: "Sa đà vào những thú vui tốn kém, lăng nhăng trong chuyện tình cảm, và né tránh những việc khó.",
    harvest: "Một đời sống lứa đôi đầy đặn, nhiều kỷ niệm đẹp, những tiện nghi đã có, và một con mắt thẩm mỹ tinh tế.",
  },
};

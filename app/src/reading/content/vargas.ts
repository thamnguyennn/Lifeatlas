// Hand-written reading atoms, part 13: the three divisional charts (D2, D9, D10).
// A divisional chart is an extra lens on the main chart, never a replacement. Voice rules are in STYLE.md.
// Index 0 = Bạch Dương for every 12-line list.

export const VARGA_META = {
  2: {
    code: "D2", name: "Hora", short: "Tiền bạc",
    lead: "D2 trả lời một câu hỏi hẹp: bạn kiếm và giữ tiền theo kiểu nào. Nó chia các hành tinh của bạn thành hai nhóm: nhóm Mặt Trời (tự mình chủ động, tự nắm) và nhóm Mặt Trăng (kiếm qua người khác, qua quan hệ và thị trường).",
    how: "D2 (Hora) chia mỗi cung làm hai nửa 15 độ. Ở cung lẻ (Bạch Dương, Song Tử, Sư Tử, Thiên Bình, Nhân Mã, Bảo Bình), nửa đầu thuộc Mặt Trời và nửa sau thuộc Mặt Trăng; ở cung chẵn thì ngược lại. Mỗi hành tinh vào nhóm Mặt Trời hoặc Mặt Trăng theo nửa cung nó đứng. Theo Parashara, Mặt Trời, Sao Hỏa và Sao Mộc hợp nhóm Mặt Trời; Mặt Trăng, Sao Kim và Sao Thổ hợp nhóm Mặt Trăng; Sao Thủy hợp cả hai (các nguồn không hoàn toàn thống nhất về Sao Thổ). D2 là lớp phụ của nhà 2 và nhà 11.",
  },
  9: {
    code: "D9", name: "Navamsa", short: "Đời sau tuổi trưởng thành",
    lead: "D9 là lá số của bạn khi đã trưởng thành. Lá số chính cho thấy bạn bắt đầu từ đâu và điều người ta thấy ở bạn từ nhỏ; D9 cho thấy phần chín của nó: bạn khi đã trải đời, cách bạn thương và ở cạnh một người, điều bạn thật sự đứng về, và hành tinh nào có sức thật. Truyền thống xem nó như phần quả của cây mà lá số chính là phần gốc.",
    how: "D9 (Navamsa) chia mỗi cung làm chín phần, mỗi phần 3 độ 20 phút. D9 là lớp phụ của nhà 7 và của cả lá số. Hành tinh nằm cùng một cung ở lá số chính và ở D9 được gọi là Vargottama.",
  },
  10: {
    code: "D10", name: "Dasamsa", short: "Công việc",
    lead: "D10 là lá số về công việc: bạn làm việc theo kiểu nào trước mặt xã hội, loại việc nào nuôi được bạn, và thành tựu nào người ta nhìn thấy. Nó đọc như một lá số riêng, từ cung mọc của D10 đến đủ mười hai nhà.",
    how: "D10 (Dasamsa) chia mỗi cung làm mười phần 3 độ. Ở cung lẻ, phần đầu bắt đầu từ chính cung đó; ở cung chẵn, phần đầu bắt đầu từ cung thứ chín tính từ nó. D10 là lớp phụ của nhà 10.",
  },
} as const;

/** One closing line per divisional chart, pointing at the houses of the main chart it should be read beside. */
export const VARGA_NOTE: Record<number, string> = {
  2: "D2 chỉ bổ sung cho lá số chính. Đọc nó cạnh nhà 2 và nhà 11, vì hai nhà đó mới cho biết bạn có nhiều hay ít.",
  9: "D9 bổ sung cho lá số chính chứ không thay thế nó. Đọc nó cạnh nhà 7 và phần hành tinh dẫn đường, vì đó là hai chỗ D9 nói rõ nhất.",
  10: "D10 chỉ bổ sung cho lá số chính. Đọc nó cạnh nhà 10, nơi nói về sự nghiệp của bạn.",
};

// ---------------------------------------------------------------- D2

export const D2_BALANCE = {
  sun: "Phần lớn hành tinh của bạn nằm ở nhóm Mặt Trời. Chuyện tiền của bạn thiên về tự mình làm và vị thế: bạn kiếm tốt khi được tự quyết, và dễ bứt rứt khi thu nhập hoàn toàn phụ thuộc người khác.",
  moon: "Phần lớn hành tinh của bạn nằm ở nhóm Mặt Trăng. Chuyện tiền của bạn thiên về quan hệ và trao đổi: bạn kiếm tốt khi hiểu người, và nên có một khoản dự phòng vì thu nhập hay lên xuống theo quan hệ và thị trường.",
  even: "Hành tinh của bạn chia gần đều giữa hai nhóm. Bạn có thể kiếm theo cả hai lối, tự mình làm và qua người khác, nên hợp với nguồn thu pha trộn hơn là dồn vào một chỗ.",
};

export const D2_LAGNA = {
  sun: "Cách bạn bước vào chuyện tiền bạc thuộc nhóm Mặt Trời: chủ động, muốn tự nắm lấy.",
  moon: "Cách bạn bước vào chuyện tiền bạc thuộc nhóm Mặt Trăng: qua người khác, nhạy với nhu cầu và với thời điểm.",
};

/**
 * A planet that stands in the hora it likes (Parashara: Sun, Mars, Jupiter like the Sun's hora; Moon, Venus, Saturn like the Moon's;
 * Mercury likes both), told in three beats. Key = "planet-hora". Sources: Brihat Parasara Hora Sastra; Conjunctions @ The Speed of Light.
 */
export const D2_FIT: Record<string, string> = {
  "sun-sun": "Mặt Trời đứng đúng hora của mình: bạn kiếm tiền một cách chính trực, tự chủ, và tiền có thể đến từ chính quyền hoặc một vị trí dẫn dắt. Cái giá là hay chi tiêu vì sĩ diện. Người ngoài thấy bạn có uy và đàng hoàng.",
  "moon-moon": "Mặt Trăng đứng đúng hora của mình: tiền đến khá tự nhiên từ gia đình và cộng đồng. Cái giá là tâm trạng lên xuống ảnh hưởng đến chuyện tích lũy. Người ngoài thấy bạn hào phóng và nhân hậu.",
  "mars-sun": "Sao Hỏa đứng đúng hora của nó: bạn kiếm tiền quyết liệt, dám kinh doanh và đầu tư vào đất đai. Cái giá là bốc đồng và dễ hao tiền khi nóng nảy. Người ngoài thấy bạn mạnh mẽ và dễ va chạm.",
  "mercury-sun": "Sao Thủy ở hora Mặt Trời: bạn nhạy với việc kinh doanh và đàm phán nhanh. Cái giá là hay tính thiệt hơn đến mức bồn chồn. Người ngoài thấy bạn thông minh, lanh lợi và thực tế.",
  "mercury-moon": "Sao Thủy ở hora Mặt Trăng: bạn khéo tay và kiếm tiền linh hoạt từ dịch vụ và các mối quan hệ. Cái giá là hay đổi hướng tích lũy. Người ngoài thấy bạn khéo léo và dễ thích ứng.",
  "jupiter-sun": "Sao Mộc đứng đúng hora của nó: bạn có thể thịnh vượng bền nhờ tri thức, tư vấn và sự đàng hoàng. Cái giá là dễ chủ quan. Người ngoài thấy bạn hào phóng và đáng kính.",
  "venus-moon": "Sao Kim đứng đúng hora của nó: tiền đến qua nghệ thuật, hợp tác và sự duyên dáng. Cái giá là dễ tiêu xài và hưởng thụ quá mức. Người ngoài thấy bạn phong lưu.",
  "saturn-moon": "Sao Thổ đứng đúng hora của nó: bạn tích lũy chậm mà chắc, kỷ luật trong chi tiêu và giữ tiền cẩn thận. Cái giá là sống kham khổ, hay cô đơn và sợ thiếu. Người ngoài thấy bạn thực tế.",
};

/** A planet in the hora Parashara counts as the wrong one for it. Only what the books actually say; where they disagree, it is said. */
export const D2_UNFIT: Record<string, string> = {
  "sun-moon": "Mặt Trời đứng ở hora Mặt Trăng, thế ít hợp theo Parashara: phần tiền gắn với vị thế và quyền chủ động cần thêm công sức mới thành.",
  "moon-sun": "Mặt Trăng đứng ở hora Mặt Trời, thế ít hợp theo Parashara: phần tiền gắn với quan hệ và chăm sóc cần thêm công sức mới thành.",
  "saturn-sun": "Sao Thổ đứng ở hora Mặt Trời, thế ít hợp theo Parashara: tiền bạc dễ bị kiềm lại và may mắn tài chính đến chậm hơn.",
  "mars-moon": "Sao Hỏa đứng ở hora Mặt Trăng: sách của Parashara coi là ít hợp, nhưng các nguồn hiện đại lại coi là hợp với người sinh đêm. Nguồn không thống nhất nên mình coi là mức trung bình.",
  "venus-sun": "Sao Kim đứng ở hora Mặt Trời: sách của Parashara coi là ít hợp, nhưng các nguồn hiện đại coi là hợp với người sinh ban ngày hoặc ở cung lẻ. Nguồn không thống nhất nên mình coi là mức trung bình.",
  "jupiter-moon": "Sao Mộc đứng ở hora Mặt Trăng, thế ít hợp theo Parashara: phần tiền gắn với tri thức và lời khuyên cần thêm công sức mới thành.",
};

export const D2_HOUSES = {
  intro: "Nhà 2 là chỗ tiền được giữ lại, còn nhà 11 là tiền thực nhận. D2 chỉ bổ sung: muốn biết mình nhiều hay ít, hãy xem hai nhà này và hành tinh cai quản chúng.",
  lord: "Nhà {h} ({what}) do {lord} cai quản, và trong D2 {lord} {state}.",
  fit: "đứng ở nhóm hợp với nó, nên dòng tiền này có nền tốt",
  unfit: "đứng ở nhóm ít hợp với nó, nên dòng tiền này cần thêm công sức",
  mid: "đứng ở mức trung bình",
  what2: "tiền giữ lại",
  what11: "tiền thực nhận",
};

export const D2_NOTE =
  "D2 chỉ nói về lối kiếm và giữ tiền, không cho biết bạn sẽ có nhiều hay ít. Nhà 2 và nhà 11 trong lá số chính mới là chỗ đọc điều đó.";

// ---------------------------------------------------------------- D9

/** After “Trong lá số D9, cung mọc của bạn là {sign}.” */
export const D9_LAGNA: string[] = [
  "Khi trưởng thành, bạn trở nên thẳng và chủ động hơn. Càng lớn tuổi, bạn càng dám nói “tôi muốn” và tự đứng ra làm.",
  "Khi trưởng thành, bạn trở nên điềm đạm và chắc chắn hơn. Càng lớn tuổi, bạn càng biết mình cần gì để thấy đủ, và ít để ai hối thúc.",
  "Khi trưởng thành, bạn trở nên linh hoạt và tò mò hơn. Càng lớn tuổi, bạn càng giỏi nối người này với người kia, và biết chọn điều đáng nói.",
  "Khi trưởng thành, bạn trở nên ấm áp và biết che chở hơn. Càng lớn tuổi, bạn càng hiểu nhà là thứ mình tự dựng, chứ không chỉ là nơi mình sinh ra.",
  "Khi trưởng thành, bạn trở nên hào phóng và có lòng tự trọng hơn. Càng lớn tuổi, bạn càng thấy mình đáng được trân trọng mà không cần chứng minh nhiều.",
  "Khi trưởng thành, bạn trở nên tinh tế và biết giúp đúng chỗ hơn. Càng lớn tuổi, bạn càng làm ít mà đúng, và bớt khắt khe với chính mình.",
  "Khi trưởng thành, bạn trở nên cân bằng hơn trong các mối quan hệ. Càng lớn tuổi, bạn càng biết nói điều thật mà vẫn giữ được hòa khí.",
  "Khi trưởng thành, bạn trở nên sâu sắc và bền lòng hơn. Càng lớn tuổi, bạn càng ít cần che giấu, và càng biết ai thật sự đáng tin.",
  "Khi trưởng thành, bạn trở nên rộng lượng và vững niềm tin vào điều mình chọn. Càng lớn tuổi, bạn càng biết mình đứng về điều gì và dám nói thẳng.",
  "Khi trưởng thành, bạn trở nên chắc chắn và có trách nhiệm hơn. Càng lớn tuổi, bạn càng được tin cậy, và càng nên nhớ dành thời gian cho mình nghỉ ngơi.",
  "Khi trưởng thành, bạn trở nên độc lập trong suy nghĩ và quan tâm đến số đông hơn. Càng lớn tuổi, bạn càng giữ được cách nghĩ riêng mà vẫn gần người.",
  "Khi trưởng thành, bạn trở nên dịu dàng và nhạy trực giác hơn. Càng lớn tuổi, bạn càng nghe được điều không ai nói ra, và càng cần ranh giới rõ hơn.",
];

/** After “Nhà của người bạn đời (nhà 7) trong lá số D9 là cung {sign}.” */
export const D9_SEVENTH: string[] = [
  "Trong chuyện đôi lứa, bạn hợp với người chủ động, thẳng và có sức sống. Điều cần giữ là đừng biến quan hệ thành cuộc đua xem ai dẫn.",
  "Trong chuyện đôi lứa, bạn cần một người ổn định, chân thật và biết hưởng những điều giản dị. Điều cần giữ là đừng bám vào sự quen thuộc khi nó đã nhàm.",
  "Trong chuyện đôi lứa, bạn cần một người để trò chuyện cả đời, nhanh ý và vui. Điều cần giữ là đối thoại thật, không chỉ nói cho vui.",
  "Trong chuyện đôi lứa, bạn cần sự thân tình, chăm nhau và cảm giác có một mái nhà chung. Điều cần giữ là đừng dùng cảm xúc để níu người kia.",
  "Trong chuyện đôi lứa, bạn cần một người ấm, tự trọng và biết trân trọng bạn cho rõ. Điều cần giữ là chia sân khấu, đừng để một người luôn đứng sau.",
  "Trong chuyện đôi lứa, bạn cần một người đáng tin, chu đáo và thực tế. Điều cần giữ là bớt soi lỗi nhau, vì thương cũng cần chỗ cho sự không hoàn hảo.",
  "Trong chuyện đôi lứa, bạn cần một người đồng hành ngang hàng, lịch thiệp và công bằng. Điều cần giữ là nói điều mình thật sự muốn, thay vì chiều cho êm.",
  "Trong chuyện đôi lứa, bạn cần chiều sâu và sự trung thành, và khó chịu với quan hệ nửa vời. Điều cần giữ là tin dần, đừng thử lòng người kia quá lâu.",
  "Trong chuyện đôi lứa, bạn cần một người cùng đi, cùng tin vào điều gì đó và để nhau tự do. Điều cần giữ là giữ lời hứa nhỏ, vì tự do không có nghĩa là vắng mặt.",
  "Trong chuyện đôi lứa, bạn cần một người nghiêm túc, có trách nhiệm và cùng xây điều lâu dài. Điều cần giữ là đừng để công việc và bổn phận ăn mất sự dịu dàng.",
  "Trong chuyện đôi lứa, bạn cần một người bạn trước khi là người tình, và tôn trọng sự riêng tư của nhau. Điều cần giữ là đừng lùi xa mỗi khi cảm xúc đến gần.",
  "Trong chuyện đôi lứa, bạn cần sự dịu dàng và cảm giác hiểu nhau không cần lời. Điều cần giữ là ranh giới, để thương không biến thành cứu người kia mãi.",
];

export const D9_HOUSES_INTRO =
  "D9 đọc như một lá số riêng, và nó là lá số của bạn khi đã trưởng thành: lúc bạn đã trải đời, có người đồng hành và biết mình đứng về điều gì. Lá số chính cho thấy bạn bắt đầu từ đâu; D9 cho thấy phần chín của nó. Mười hai nhà dưới đây đọc theo cùng ba bước: điều nhà đó nói, cái giá của nó, và người ngoài thấy gì ở bạn.";

export const D10_HOUSES_INTRO =
  "D10 đọc như một lá số riêng về công việc. Mười hai nhà dưới đây là mười hai mặt của nghề: cách bạn hiện ra, tiền từ việc, kỹ năng, nơi làm, quyền chỉ huy, làm thuê hay kinh doanh, biến cố, người đỡ đầu, đỉnh cao, thu nhập thêm và việc hậu trường. Mỗi nhà đọc theo ba bước: điều nhà đó nói, cái giá của nó, và người ngoài thấy gì ở bạn.";

export const D9_SHIFT = {
  up: "Trong D9, {list} mạnh hơn so với lá số chính. Những chủ đề mà {it} đại diện trông khiêm tốn lúc đầu, nhưng càng về sau càng chắc và đáng tin.",
  down: "Trong D9, {list} yếu hơn so với lá số chính. Những chủ đề mà {it} đại diện trông tốt hơn sức thật của chúng, nên cần được chăm thêm bằng việc làm đều.",
  none: "Không hành tinh nào đổi hẳn sức mạnh giữa lá số chính và D9, nên điều bạn thể hiện và điều bạn thật sự có khá khớp nhau.",
  vargottama: "{list} đứng cùng một cung ở cả lá số chính và D9. Điều chúng nói về bạn khớp nhau ở cả hai lá số, nên rất rõ nét và khó thay đổi.",
};

// ---------------------------------------------------------------- D10

/** After “Trong lá số D10, cung mọc của bạn là {sign}.” */
export const D10_LAGNA: string[] = [
  "Ở nơi làm việc, bạn là người khởi sự: nhận việc mới nhanh, quyết nhanh và không ngồi chờ lệnh. Việc cần bạn đi đầu hợp với bạn hơn việc cần ngồi kiểm.",
  "Ở nơi làm việc, bạn là người giữ nhịp chắc: làm đều, đáng tin và không dễ cuốn theo phong trào. Việc có thành phẩm cụ thể, có giá trị chạm được, hợp với bạn.",
  "Ở nơi làm việc, bạn là người nối và truyền: nói, viết, hỏi, kết nối. Việc có nhiều người, nhiều thông tin và đủ biến đổi để đầu óc không chán hợp với bạn.",
  "Ở nơi làm việc, bạn là người chăm cho cả nhóm: nhớ ai cần gì và giữ không khí chung. Việc có yếu tố nuôi dưỡng, chăm sóc, gia đình hay cộng đồng hợp với bạn.",
  "Ở nơi làm việc, bạn là người được nhìn vào: có phong thái dẫn dắt và thích được ghi nhận rõ. Việc cho bạn quyền quyết định và có tên tuổi hợp với bạn.",
  "Ở nơi làm việc, bạn là người làm cho mọi thứ chạy trơn tru: chi tiết, quy trình, sửa lỗi. Việc cần độ chính xác, phân tích hay phục vụ trực tiếp hợp với bạn.",
  "Ở nơi làm việc, bạn là người cân bằng: hòa giải, thương lượng, giữ thẩm mỹ. Việc làm cùng người khác và có chuẩn mực về cái đẹp hay sự công bằng hợp với bạn.",
  "Ở nơi làm việc, bạn là người đào sâu: điều tra, nghiên cứu, xử lý chuyện khó và kín. Việc cần tập trung dài và dám đi vào chỗ người khác né hợp với bạn.",
  "Ở nơi làm việc, bạn là người mở đường và truyền cảm hứng: dạy, hướng dẫn, nhìn xa. Việc có tầm nhìn, đi lại hay liên quan đến học và niềm tin hợp với bạn.",
  "Ở nơi làm việc, bạn là người gánh và xây: có kế hoạch dài, chịu trách nhiệm, leo từng bậc. Việc có cấu trúc rõ và con đường thăng tiến hợp với bạn.",
  "Ở nơi làm việc, bạn là người đem đến cách nghĩ khác: hệ thống, công nghệ, việc vì số đông. Việc có chỗ cho ý tưởng mới và làm theo nhóm lớn hợp với bạn.",
  "Ở nơi làm việc, bạn là người cảm: trực giác tốt và thấm vào cả người lẫn việc. Việc có yếu tố sáng tạo, chữa lành, phục vụ hay làm phía sau hợp với bạn.",
];

/** The tenth lord of D10 and where it stands in D10 (index = that house - 1). Source: "How to Read the D10 (Dashamsha) Chart", Moon Dasha. */
export const D10_LORD_IN: string[] = [
  "Bạn làm nghề bằng sự hiểu biết rộng và có thể kiếm tốt. Cái giá là dễ nảy sinh toan tính khi gặp ảnh hưởng xấu. Người ngoài thấy bạn danh giá, tài giỏi.",
  "Bạn khéo ăn nói và hợp kinh doanh liên quan đến ăn uống hoặc gia đình. Cái giá là dễ hao tiền. Người ngoài thấy bạn miệt mài kiếm tiền.",
  "Bạn tự lập, viết giỏi và hay đi lại vì công việc. Cái giá là hay đổi chỗ làm. Người ngoài thấy bạn tháo vát, năng động.",
  "Bạn lập nghiệp vững và có tiếng nói ở quê hương. Cái giá là phải gánh những chuyện quyền lực, chính trị quanh mình. Người ngoài thấy bạn danh giá, an định.",
  "Bạn có trí tuệ và nổi tiếng trong nghề. Cái giá là sự nghiệp kém ổn định, dễ đổi việc. Người ngoài thấy bạn thông thái, uyên bác.",
  "Bạn tận tụy phục vụ, hợp với việc giải quyết khó khăn của người khác như tiền nong hay sức khỏe. Cái giá là tiến bộ hay phụ thuộc may rủi. Người ngoài thấy bạn cần mẫn.",
  "Bạn giỏi kinh doanh, hợp liên kết với công ty và đối tác nước ngoài. Cái giá là rủi ro thương trường. Người ngoài thấy bạn nhạy bén.",
  "Bạn vượt khó để lên cao. Cái giá là sự nghiệp nhiều biến động. Người ngoài thấy bạn kiên cường và trầm lặng.",
  "Bạn lên vị trí cao nhờ may mắn. Cái giá là hay bị điều đi nơi khác. Người ngoài thấy bạn danh giá, mẫu mực.",
  "Bạn có chuyên môn xuất sắc và danh tiếng rực rỡ. Cái giá là dễ mang tiếng nếu mắc sai. Người ngoài thấy bạn tài ba, vẻ vang.",
  "Bạn thành công khá dễ, làm được nhiều nghề và tạo việc làm cho người khác. Cái giá là hay toan tính. Người ngoài thấy bạn giàu có.",
  "Bạn hợp làm việc ở xứ xa, bệnh viện hoặc nơi biệt lập. Cái giá là con đường nghề gian truân và cô đơn. Người ngoài thấy bạn kín tiếng.",
];

export const D10_LORD = {
  line: "Hành tinh cai quản sự nghiệp (nhà 10) trong lá số D10 là {planet}, và nó đứng ở nhà {k} của D10.",
  strong: "{planet} đang mạnh ở {sign}, nên nghề của bạn có nền chắc để lớn dần.",
  weak: "{planet} đang yếu ở {sign}, nên con đường nghề cần kiên nhẫn hơn và cần chọn nơi hợp để làm.",
};

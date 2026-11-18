// Hand-written reading atoms, part 17: the twelve houses of D9 (the chart of grown-up life) and of D10 (the chart of work).
// Every house is told in the same three beats as the main chart: what it is, what it costs, what other people see.
// Sources: NotebookLM notebook "Chiêm tinh học", answers on D9 (vedic_astro_textbook.pdf; "DARAKARAKA Soulmate PART 2";
// Astrology of the Seers; Light on Life) and on D10 (crux-of-astrology.pdf; vedic_astro_textbook.pdf; mahadasha.pdf);
// see SOURCES.md. Voice rules are in STYLE.md. Index 0 = house 1.

export interface VargaHouse {
  /** A few words: what this house is about in this chart. */
  topic: string;
  /** Three short sentences: the nature, the cost, how others see it. */
  text: string;
}

export const D9_HOUSE: VargaHouse[] = [
  { topic: "Con người thật của bạn khi trưởng thành",
    text: "Càng lớn bạn càng tự chủ và sống đúng bổn phận mình đã chọn; điều bạn đi tìm là con người thật của mình. Cái giá là bạn hay khắt khe với chính mình. Người ngoài thấy bạn trưởng thành, đàng hoàng, đôi khi hơi xa cách." },
  { topic: "Tiền và giá trị của gia đình",
    text: "Bạn lo chuyện tiền và giá trị của gia đình mình một cách thực tế; điều bạn tìm là cảm giác an toàn về vật chất. Cái giá là hay chấp nhặt chuyện tiền bạc. Người ngoài thấy bạn thực tế và biết lo toan." },
  { topic: "Lời nói và nỗ lực vì tổ ấm",
    text: "Bạn nói thẳng và dám cố gắng vì người thân; điều bạn tìm là một tiếng nói chung với người đi cùng. Cái giá là cái tôi lớn dễ biến một cuộc nói chuyện thành tranh cãi. Người ngoài thấy bạn bộc trực, đôi lúc hơi hiếu thắng." },
  { topic: "Nơi ở và sự bình yên",
    text: "Bạn vun vén chỗ ở và giữ cho tổ ấm bình yên; điều bạn tìm là cảm giác an toàn trong lòng. Cái giá là hay bám vào những gì quen thuộc. Người ngoài thấy bạn chu đáo và giàu tình cảm." },
  { topic: "Sáng tạo, niềm vui và con cái",
    text: "Bạn có trí tuệ sáng tạo và dạy dỗ người nhỏ hơn rất chu đáo; điều bạn tìm là một niềm vui chính đáng. Cái giá là kỳ vọng quá nhiều vào con cái hoặc vào sản phẩm của mình. Người ngoài thấy bạn thông tuệ và hiểu biết." },
  { topic: "Phục vụ và vượt khó",
    text: "Bạn tận tụy giúp người và kiên cường vượt khó; điều bạn tìm là sự hoàn thiện. Cái giá là hay soi lỗi, nhất là lỗi của người bạn đời. Người ngoài thấy bạn khắt khe, đôi khi hay cằn nhằn." },
  { topic: "Hôn nhân và người đồng hành",
    text: "Bạn đồng hành chung thủy và muốn một quan hệ công bằng hai bên; điều bạn tìm là sự gắn kết bền chặt. Cái giá là dễ phụ thuộc vào cảm xúc của người kia. Người ngoài thấy bạn hết lòng vì gia đình." },
  { topic: "Biến cố và chiều sâu",
    text: "Bạn có trực giác sâu và đủ bản lĩnh đi qua những biến cố chung với người thân; điều bạn tìm là một lần đổi mới thật sự. Cái giá là hay lo âu và đa nghi. Người ngoài thấy bạn trầm lặng, khó đoán." },
  { topic: "Đạo lý và niềm tin",
    text: "Bạn trọng đạo lý, cởi mở với điều mới và cùng người bạn đời mở rộng niềm tin; điều bạn tìm là lẽ phải. Cái giá là dễ cứng nhắc và tranh đúng sai. Người ngoài thấy bạn đức độ, đáng kính." },
  { topic: "Trách nhiệm và vị thế",
    text: "Bạn nhận trách nhiệm với xã hội và cố gắng vì sự nghiệp, vị thế chung của gia đình; điều bạn tìm là được công nhận. Cái giá là mê việc đến mức lạnh với đời sống riêng. Người ngoài thấy bạn mẫu mực, nhiều tham vọng." },
  { topic: "Thành quả và bạn bè",
    text: "Bạn cùng người thân gây dựng của cải, và nhóm bạn giúp bạn sau khi có gia đình; điều bạn tìm là sự đủ đầy. Cái giá là hay tính toán vật chất. Người ngoài thấy bạn quảng giao và thực tế." },
  { topic: "Nghỉ ngơi và buông bỏ",
    text: "Bạn biết buông và hướng về một đời sống yên tĩnh; điều bạn tìm là bình an trong lòng. Cái giá là dễ cô độc và xa chuyện đời thường. Người ngoài thấy bạn trầm lặng, khó hiểu." },
];

export const D10_HOUSE: VargaHouse[] = [
  { topic: "Cách bạn hiện ra trong công việc",
    text: "Bạn làm việc bằng bản lĩnh và năng lực thực thi; điều bạn tìm là được tự chủ. Cái giá là áp lực phải chứng tỏ mình. Người ngoài thấy bạn có bản lĩnh và trách nhiệm." },
  { topic: "Thu nhập từ công việc",
    text: "Công việc nuôi bạn bằng thu nhập đều và tiếng nói chuyên môn; điều bạn tìm là sự tích lũy an toàn. Cái giá là hay bận tâm chuyện tiền. Người ngoài thấy bạn thực tế." },
  { topic: "Kỹ năng và dám đổi mới",
    text: "Bạn làm tốt việc cần viết, nói, giao tiếp, các hợp đồng ngắn hạn và dám đổi mới; điều bạn tìm là một bước bứt lên. Cái giá là hay bồn chồn và đi lại nhiều. Người ngoài thấy bạn tháo vát, năng động." },
  { topic: "Nơi làm việc",
    text: "Nơi làm việc, văn phòng (kể cả làm tại nhà) và việc giữ hồ sơ là chỗ bạn thấy an ổn; điều bạn tìm là sự ổn định. Cái giá là dễ an phận và ngại đổi mới. Người ngoài thấy bạn ngăn nắp, cẩn trọng." },
  { topic: "Quyền chỉ huy và người theo sau",
    text: "Bạn có uy với người dưới tay, và nhà này cũng nói về thời điểm nhận việc mới; điều bạn tìm là quyền chỉ huy. Cái giá là gánh trách nhiệm nặng. Người ngoài thấy bạn có uy, có tài." },
  { topic: "Làm trong một tổ chức và cạnh tranh",
    text: "Bạn hợp làm trong một tổ chức, phục vụ, hoặc việc có tính kỹ thuật và y tế; điều bạn tìm là kỷ luật. Cái giá là cạnh tranh gay gắt và áp lực gấp. Người ngoài thấy bạn cần cù, kiên cường." },
  { topic: "Kinh doanh và đối tác",
    text: "Bạn có đường làm kinh doanh tự do, buôn bán và làm việc với đối tác; điều bạn tìm là sự độc lập. Cái giá là rủi ro tiền bạc cao. Người ngoài thấy bạn nhạy bén chuyện buôn bán." },
  { topic: "Biến cố trong nghề",
    text: "Nhà này nói về vay vốn, nghiên cứu kín, xử lý khủng hoảng và nghỉ hưu; điều bạn tìm là một bước chuyển. Cái giá là áp lực nợ và những lần công việc gián đoạn. Người ngoài thấy bạn trầm lặng, khó đoán." },
  { topic: "Cấp trên, người đỡ đầu và muốn tự làm chủ",
    text: "Quan hệ với cấp trên và người đỡ đầu nằm ở đây, cùng với xu hướng muốn tự làm chủ; điều bạn tìm là một lý tưởng để dẫn dắt. Cái giá là hay bất đồng quan điểm với cấp trên. Người ngoài thấy bạn độc lập." },
  { topic: "Trọng tâm của sự nghiệp",
    text: "Đây là nhà trung tâm của sự nghiệp: đỉnh cao quyền lực và thành tựu được nhìn thấy; điều bạn tìm là thăng tiến. Cái giá là mê việc. Người ngoài thấy bạn có uy, đáng làm gương." },
  { topic: "Thu nhập thêm và đồng nghiệp",
    text: "Lợi nhuận, tiền thưởng và mạng lưới đồng nghiệp hỗ trợ đến từ đây; điều bạn tìm là thành quả về tiền bạc. Cái giá là hay tính toán lợi ích. Người ngoài thấy bạn thành đạt, quảng giao." },
  { topic: "Việc ở hậu trường",
    text: "Nhà này nói về công việc hậu trường, tổ chức lớn, bệnh viện, liên kết với nước ngoài và những kỳ nghỉ dài; điều bạn tìm là sự tĩnh lặng. Cái giá là cô độc và nỗi lo giữ được việc hay không. Người ngoài thấy bạn kín đáo." },
];

/** One line each for the four planets the notebook reads when they are strong in D9. */
export const D9_STRONG: Partial<Record<string, string>> = {
  sun: "Mặt Trời mạnh trong D9: bạn có bản lĩnh tự chủ, giàu lòng tự trọng và chí hướng dẫn dắt. Cái giá là cái tôi lớn dễ làm mất hòa khí lứa đôi. Người ngoài thấy bạn kiêu hãnh và có uy.",
  moon: "Mặt Trăng mạnh trong D9: lòng bạn yên ổn, thấu hiểu người khác sâu và giữ được một tình cảm bền lâu. Cái giá là quá nhạy với lời nói của người khác. Người ngoài thấy bạn nhân hậu, dịu dàng.",
  venus: "Sao Kim mạnh trong D9: chuyện đôi lứa dễ hòa thuận, ấm và có duyên, người đi cạnh bạn thường thanh lịch và chung thủy. Cái giá là dễ nuông chiều bản thân. Người ngoài thấy bạn lãng mạn, viên mãn.",
  jupiter: "Sao Mộc mạnh trong D9: bạn có trí tuệ rộng và đức độ, mang lại sự nâng đỡ về đạo lý trong hôn nhân. Cái giá là hay lý tưởng hóa. Người ngoài thấy bạn đạo mạo, hiểu biết.",
};

export const D9_LAGNA_SAME =
  "Cung mọc của D9 trùng với cung mọc của lá số chính (Vargottama), nên con người bạn trưởng thành khớp với con người bạn thể hiện từ nhỏ: vững, nhất quán và đáng tin. Cái giá là bạn khó đổi ý khi đã quyết. Người ngoài thấy bạn kiên định.";

export const VARGA_HOUSE_LORD = {
  line: "Hành tinh cai quản nhà này là {lord}, đứng ở nhà {k} của lá số {code}, nên chuyện này gắn với chuyện {domain}.",
  strong: "{lord} đứng vững trong lá số này, nên đây là chỗ bạn có nền tốt.",
  weak: "{lord} đứng yếu trong lá số này, nên đây là chỗ bạn cần bỏ nhiều công hơn.",
};

export const VARGA_HOUSE_OCC = {
  one: "{p} ngồi trong nhà này{state}: nó thêm vào đây {gift}, và điều cần để ý là {shadow}.",
  strongState: ", đang đứng vững",
  weakState: ", đang đứng yếu",
  empty: "Chưa có hành tinh nào ngồi trong nhà này, nên chuyện này đi theo hành tinh cai quản nó.",
};

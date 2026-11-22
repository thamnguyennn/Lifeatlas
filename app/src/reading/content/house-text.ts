// Life Atlas v4.3 — the house essay, rewritten.
// LEAD[n]: the opening statement of a house, by the overall balance of evidence (plus = mostly supported, mixed, minus = needs work).
// ADVICE[n]: one practical closing line, by the same balance.
// LINK[n][p]: the lord of house n standing in house p, after the classical meanings (BPHS, ch. 24, bhavesha phala), said plainly.
//   gift = what the placement gives; care = what to keep in mind (said only when the house or its lord needs it).
// No planet names, no house numbers, no labels that judge a person. The technical facts live in the folded "Xem chi tiết thông số".

type Bal = { plus: string; mixed: string; minus: string };

export const LEAD: Bal[] = [
  { plus: "", mixed: "", minus: "" }, // house 1 has its own reading
  {
    plus: "Tiền bạc và lời nói là mảng có nền khá tốt trong lá số của bạn: bạn biết kiếm, biết giữ, và lời bạn nói ra thường có trọng lượng.",
    mixed: "Tiền bạc và lời nói ở bạn vừa có điểm tựa vừa có chỗ phải để ý: thu nhập không thiếu cơ hội, nhưng giữ lại được bao nhiêu thì tùy vào nếp chi tiêu của bạn.",
    minus: "Tiền bạc và lời nói là mảng bạn phải tự tay vun lên: không có sẵn một nền dày, nhưng những gì bạn giữ được đều do chính bạn làm ra.",
  },
  {
    plus: "Sự chủ động là một điểm mạnh rõ của bạn: bạn dám bắt đầu, học kỹ năng nhanh và không ngại tự mình làm.",
    mixed: "Bạn có sự chủ động, nhưng nó bật lên theo từng đợt: lúc rất hăng, lúc lại cần một lý do rõ ràng mới bắt tay vào.",
    minus: "Sự chủ động của bạn cần được rèn: bạn thường cân nhắc lâu trước khi bước, và kỹ năng đến qua tập luyện nhiều hơn là có sẵn.",
  },
  {
    plus: "Nhà cửa và gia đình là chỗ dựa thật trong đời bạn: bạn có xu hướng có một nơi ở yên ổn và một tổ ấm để về.",
    mixed: "Nhà cửa và gia đình vừa là nơi bạn nạp lại sức, vừa là nơi có những chuyện phải lo; cảm giác yên ổn đến khi bạn chủ động vun nó.",
    minus: "Cảm giác có chỗ để về là điều bạn phải tự xây: nơi ở, chuyện gia đình hay sự bình yên trong lòng thường cần nhiều công sức hơn ở người khác.",
  },
  {
    plus: "Trí tuệ và sự sáng tạo là phần sáng trong lá số của bạn: bạn học tốt khi có hứng, có ý tưởng riêng, và niềm vui đến dễ từ những việc mình tự chọn.",
    mixed: "Sáng tạo, chuyện yêu đương và con cái ở bạn có cả niềm vui lẫn những lo lắng; điều đẹp nhất ở mảng này thường đến khi bạn bớt kỳ vọng.",
    minus: "Niềm vui, chuyện yêu đương và con cái là mảng cần nhiều kiên nhẫn: chúng có thể đến chậm hoặc kèm lo lắng, nhưng khi đã đến thì rất có giá trị.",
  },
  {
    plus: "Bạn mạnh trong việc giải quyết vấn đề hằng ngày: chịu được áp lực, làm việc gọn và thường thắng nhờ bền hơn người.",
    mixed: "Công việc hằng ngày và sức khỏe ở bạn có lúc rất ổn, có lúc dồn dập; nhịp nghỉ đều là thứ giữ cho mảng này cân bằng.",
    minus: "Công việc hằng ngày và sức khỏe là nơi bạn dễ bị dồn sức: việc nhiều, áp lực lớn, và cơ thể phản ánh khá rõ mức căng thẳng.",
  },
  {
    plus: "Người đồng hành là một điểm tựa trong đời bạn: bạn có xu hướng gặp người tử tế, và làm cùng người khác thường đi xa hơn làm một mình.",
    mixed: "Hôn nhân và hợp tác ở bạn vừa có duyên vừa cần điều chỉnh: bạn gặp được người, nhưng giữ được lâu là nhờ cả hai chịu nói rõ với nhau.",
    minus: "Các mối quan hệ gắn bó đòi bạn nhiều điều chỉnh: duyên có thể đến muộn hoặc qua thử thách, và chọn người chậm sẽ giúp bạn tránh nhiều hiểu lầm.",
  },
  {
    plus: "Bạn có sức đứng dậy sau biến cố tốt hơn nhiều người, và hiểu sâu những chuyện người khác thường né.",
    mixed: "Đời bạn có những bước ngoặt bất ngờ; có lần là khó khăn, có lần lại mở ra một nguồn lực mới, và bạn thường hiểu ra ý nghĩa của chúng về sau.",
    minus: "Những thay đổi lớn và chuyện tiền chung là mảng cần thận trọng: biến động có thể đến không báo trước, nên sự chuẩn bị giúp bạn nhiều hơn may mắn.",
  },
  {
    plus: "Bạn có một phần may mắn rõ ràng: hay gặp người dẫn đường đúng lúc, và niềm tin của bạn là chỗ dựa thật trong những ngã rẽ.",
    mixed: "Niềm tin và may mắn ở bạn đến theo từng chặng: có lúc được giúp rất đúng lúc, có lúc phải tự tìm đường.",
    minus: "Niềm tin của bạn hình thành qua nghi ngờ và tự kiểm chứng; may mắn ít khi có sẵn, nhưng điều bạn tin được là điều bạn đã tự trải qua.",
  },
  {
    plus: "Sự nghiệp là nơi bạn có nhiều điều kiện tốt: bạn dễ được giao trách nhiệm, và khi đã đứng vào một vị trí thì giữ được lâu.",
    mixed: "Sự nghiệp của bạn có cả cơ hội lẫn những đoạn phải tự xoay xở; con đường thường rõ dần theo thời gian chứ không thẳng ngay từ đầu.",
    minus: "Con đường nghề nghiệp của bạn cần được xây từng bước: có thể nhiều lần đổi hướng hoặc chậm được ghi nhận, nên tay nghề thật và sự bền bỉ quan trọng hơn thời cơ.",
  },
  {
    plus: "Công sức của bạn thường ra kết quả: thu nhập, cơ hội và bạn bè đến khá đều, và mục tiêu dài hạn có xu hướng thành.",
    mixed: "Thu nhập và các mối quan hệ của bạn có lúc rất thuận, có lúc chững lại; kết quả có đến, nhưng không phải lúc nào cũng đúng nhịp bạn muốn.",
    minus: "Kết quả thường đến muộn hơn công sức; vài mục tiêu rõ ràng và vài người bạn thật sẽ giúp bạn nhiều hơn một mạng lưới rộng.",
  },
  {
    plus: "Bạn biết lấy lại sức bằng khoảng yên tĩnh, và những gì bạn cho đi thường quay về theo cách khác.",
    mixed: "Chi tiêu, giấc ngủ và những lúc ở một mình là mảng bạn cần giữ nhịp: đúng cách thì nó nạp lại sức cho bạn, sai cách thì nó lấy đi.",
    minus: "Chi tiêu, giấc ngủ và cảm giác hao sức là điều cần để ý: những khoản chi không định trước hay những đêm ngủ không sâu thường là dấu hiệu bạn đang cho đi nhiều hơn mình có.",
  },
];

export const ADVICE: { plus: string; minus: string }[] = [
  { plus: "Hãy tin vào nhịp phát triển của mình và giữ cho thân thể một nếp sống đều; đó là vốn để mọi mảng khác dựa vào.", minus: "Hãy chăm phần nền trước: giấc ngủ, vận động và một vài thói quen nhỏ giữ đều mỗi ngày làm bạn vững hơn bất kỳ cú hích nào." },
  { plus: "Giữ một nếp tích lũy đều đặn, dù nhỏ, là cách để nền tài chính của bạn dày lên theo năm.", minus: "Một kế hoạch chi tiêu cụ thể, cùng thói quen dừng lại một nhịp trước khi nói lúc nóng giận, giúp bạn nhiều hơn là trông chờ thu nhập tăng." },
  { plus: "Hãy chọn một kỹ năng để đi thật sâu; sự chủ động của bạn sẽ có chỗ để thành tay nghề.", minus: "Đặt một mục tiêu nhỏ, cụ thể và có hạn chót là cách tốt nhất để sự chủ động của bạn bật lên." },
  { plus: "Dành thời gian cho nhà và người thân là cách bạn nạp lại sức hiệu quả nhất.", minus: "Hãy tạo một góc thật sự của riêng mình, dù nhỏ; cảm giác yên ổn bắt đầu từ đó." },
  { plus: "Cho mình thời gian để học và làm những việc chỉ vì thích; đó là nơi ý tưởng tốt nhất của bạn ra đời.", minus: "Cho phép mình làm một việc chỉ vì vui, không cần kết quả; niềm vui ở bạn cần được mời vào, đừng chờ nó gõ cửa." },
  { plus: "Giữ nhịp nghỉ đều, vì sức bền là vốn lớn nhất của bạn ở mảng này.", minus: "Hãy coi giấc ngủ và nếp nghỉ là một phần của công việc; khi cơ thể báo mệt, đừng gắng thêm." },
  { plus: "Chọn người cùng nhìn về một hướng, rồi để họ là chính họ; mối quan hệ của bạn mạnh nhất khi cả hai đều thấy tự do.", minus: "Chọn người chậm và nói rõ kỳ vọng từ đầu; với bạn, rõ ràng là cách giữ hòa khí tốt nhất." },
  { plus: "Khi biến cố đến, hãy tin vào sức hồi phục của mình; bạn đã có nó sẵn.", minus: "Giữ một quỹ dự phòng và rõ ràng trong mọi khoản tiền chung; những điều đơn giản ấy làm biến động bớt chao đảo." },
  { plus: "Hãy giữ những người thầy và những điều bạn tin; chúng là la bàn của bạn ở các ngã rẽ.", minus: "Hãy tự đi, tự học và tự kiểm chứng; niềm tin bạn tự xây sẽ vững hơn bất kỳ lời dạy nào." },
  { plus: "Hãy nhận trách nhiệm khi được trao; bạn lớn lên nhanh nhất ở những vị trí có việc thật để gánh.", minus: "Đầu tư vào một kỹ năng cụ thể và bền bỉ với nó; với bạn, sự ghi nhận đến sau tay nghề." },
  { plus: "Hãy giữ những mối quan hệ tốt và đặt mục tiêu dài hạn rõ ràng; kết quả sẽ tích lại theo năm.", minus: "Chia mục tiêu thành những bước nhỏ, đo được, để thấy mình đang tiến dù kết quả chưa đến." },
  { plus: "Hãy giữ những khoảng yên tĩnh của riêng mình; đó là nơi bạn hồi sức.", minus: "Hãy đặt ranh giới rõ với thời gian, tiền bạc và sức lực của mình; nói “không” đúng lúc cũng là một cách giữ sức." },
];

/** "gift | care" for the lord of house n (row) in house p (column). */
const L = (rows: string[]) => rows.map((r) => { const [gift, care] = r.split(" | "); return { gift, care }; });

export const LINK: { gift: string; care: string }[][] = [
  L([ // lord of 1: where your effort and growth go
    "Bạn tự đứng trên đôi chân mình, tự quyết hướng đi và ít bị hoàn cảnh kéo lệch. | dễ chỉ tin vào cách của mình",
    "Sức lực của bạn đổ nhiều vào việc kiếm tiền, lo cho gia đình, và lời bạn nói có trọng lượng. | dễ đo giá trị bản thân bằng tiền",
    "Bạn tự lập bằng kỹ năng và sự chủ động, dám thử và dám đi. | dễ ôm quá nhiều việc cùng lúc",
    "Bạn gắn bó với nhà cửa, gia đình, và lớn lên vững nhất khi có một chỗ để về. | dễ ngại rời vùng quen",
    "Bạn sống bằng trí tuệ và sự sáng tạo, học giỏi khi có hứng và có duyên với trẻ nhỏ. | dễ tự hào quá về cái tài của mình",
    "Bạn trưởng thành qua công việc nặng và những lần phải vượt khó; càng áp lực bạn càng bền. | dễ quên nghỉ và tự tạo sức ép cho mình",
    "Bạn hiểu mình rõ nhất qua người đồng hành; đối tác và hôn nhân là nơi bạn lớn lên. | dễ để người khác quyết thay mình",
    "Bạn có sức đứng dậy sau biến cố và hiểu sâu những chuyện người khác né tránh. | dễ bất an và giữ nhiều điều trong lòng",
    "Bạn có may mắn từ người đi trước và một niềm tin dẫn đường, thường được giúp đúng lúc. | dễ cứng nhắc khi cho rằng mình đúng",
    "Bạn tự dựng vị thế bằng công việc, và được nhìn nhận qua những gì mình làm ra. | dễ để công việc chiếm hết thời gian riêng",
    "Bạn giỏi kết nối, có nhiều bạn và hay biến mối quan hệ thành cơ hội. | dễ để các mối quan hệ nghiêng về lợi ích",
    "Bạn hợp với nơi xa quê, những việc phía sau hậu trường hoặc mang tính phục vụ. | dễ thấy hao sức nếu thiếu khoảng yên tĩnh",
  ]),
  L([ // lord of 2: money, speech, family of origin
    "Bạn tự kiếm ra tiền bằng chính năng lực và tên tuổi của mình, và lời bạn nói có sức nặng. | dễ coi tiền là thước đo bản thân",
    "Tiền bạc của bạn khá tự chủ: bạn biết giữ, biết tích, và gia đình là chỗ dựa. | dễ chặt chẽ quá với chi tiêu",
    "Thu nhập đến nhiều từ kỹ năng, giao tiếp, viết lách hoặc buôn bán do bạn tự làm. | tiền dễ ra vào theo những việc ngắn hạn",
    "Tiền của bạn hay đổ vào nhà cửa, đất đai, xe cộ, và gia đình là nơi tích lũy. | dễ để tài sản đứng yên mà thiếu tiền mặt",
    "Bạn kiếm tiền bằng trí tuệ, chuyên môn hoặc sáng tạo, và có duyên với đầu tư dài hạn. | dễ mạo hiểm khi quá tự tin",
    "Tiền đến qua công việc làm thuê, dịch vụ hoặc cạnh tranh; khoản vay và chi phí cần quản chặt. | dễ vướng nợ hoặc tốn tiền cho sức khỏe",
    "Tiền bạc gắn với người bạn đời hoặc đối tác; làm chung thường sinh lời hơn làm một mình. | dễ lẫn lộn tiền riêng và tiền chung",
    "Tiền bạc hay đến rồi đi bất ngờ, có thể từ nguồn chung, bảo hiểm hoặc thừa kế. | thu chi khó đoán, nên cần quỹ dự phòng",
    "Tiền đến thuận khi bạn làm điều mình tin, và thường có may mắn hoặc người đi trước giúp. | dễ rộng tay quá với người khác",
    "Thu nhập gắn với nghề nghiệp và vị thế; làm tốt việc chính thì tiền theo sau. | dễ để thu nhập phụ thuộc vào một chỗ làm",
    "Tiền đến từ nhiều nguồn và qua các mối quan hệ; khả năng sinh lời của bạn khá tốt. | dễ chi theo bạn bè",
    "Tiền dễ chảy ra: cho đi, đi xa, chi cho người khác hoặc cho đời sống tinh thần. | cần một kế hoạch tiết kiệm cụ thể",
  ]),
  L([ // lord of 3: initiative, skills, siblings, short journeys
    "Bạn tự lập bằng sự can đảm và kỹ năng của chính mình, dám bắt đầu mà không chờ ai. | dễ liều khi chưa tính kỹ",
    "Kỹ năng giao tiếp và tay nghề giúp bạn kiếm tiền; lời bạn nói có sức thuyết phục. | dễ nói thẳng làm mất lòng",
    "Bạn chủ động, dũng cảm, và kỹ năng của bạn tự lớn lên theo thời gian. | dễ mải chạy nhiều việc nhỏ",
    "Sự chủ động của bạn gắn với nhà cửa: hay tự tay sửa sang, dời chỗ ở hoặc làm việc tại nhà. | dễ bận rộn mà nhà vẫn chưa yên",
    "Bạn có tài viết, nói hoặc sáng tạo; sự chủ động của bạn đi vào những việc mình thích. | dễ bỏ dở khi hết hứng",
    "Bạn có sức chiến đấu, không ngại cạnh tranh hay việc khó. | dễ va chạm với anh chị em hoặc đồng nghiệp",
    "Kỹ năng và sự chủ động của bạn mở ra nhiều mối hợp tác và những chuyến đi vì việc chung. | dễ để đối tác cuốn theo nhịp của họ",
    "Sự chủ động của bạn hay bị thử bởi những thay đổi bất ngờ, và bạn học được can đảm qua chính những lúc ấy. | dễ lo lắng và tiêu hao sức",
    "Bạn dũng cảm theo niềm tin, thích đi xa học hỏi, và anh chị em hay bạn bè thường giúp bạn. | dễ tranh luận về quan điểm",
    "Kỹ năng và sự chủ động là nền của sự nghiệp; truyền thông, viết lách, kỹ thuật hay kinh doanh hợp với bạn. | dễ đổi việc nhiều lần",
    "Sự chủ động của bạn thường sinh lời; anh chị em và bạn bè là nguồn cơ hội. | dễ đặt quá nhiều mục tiêu một lúc",
    "Sức lực và kỹ năng của bạn hợp với việc ở xa hoặc phía sau hậu trường. | dễ thấy công sức của mình không được nhìn thấy",
  ]),
  L([ // lord of 4: home, mother, inner peace, property
    "Gia đình và nhà cửa là gốc của con người bạn; bạn mang sự ấm áp của gia đình đi theo khắp nơi. | dễ gắn hạnh phúc với cảm giác được ở nhà",
    "Gia đình là nơi bạn tích lũy; nhà cửa, đất đai thường là tài sản của bạn. | dễ để chuyện tiền ảnh hưởng không khí trong nhà",
    "Bạn hay dời chỗ ở hoặc tự tay vun lại tổ ấm; sự yên ổn đến từ việc bạn chủ động. | dễ thấy không yên khi ở một chỗ quá lâu",
    "Nhà cửa và sự bình yên của bạn khá tự chủ; bạn có xu hướng có một nơi ở vững vàng. | dễ ngại thay đổi chỗ ở",
    "Nhà là nơi vui và nơi sáng tạo; con cái và việc học gắn chặt với tổ ấm của bạn. | dễ đặt nhiều kỳ vọng vào con cái",
    "Sự yên ổn trong nhà phải đi qua nhiều việc phải lo: sửa chữa, khoản vay nhà hoặc bất đồng trong gia đình. | dễ mang áp lực công việc về nhà",
    "Tổ ấm gắn với người bạn đời; sau khi có người đồng hành, nơi ở thường ổn định hơn. | dễ dựa vào người kia cho cảm giác yên",
    "Nơi ở có thể đổi thay bất ngờ, nên cảm giác yên ổn của bạn phải được xây từ bên trong. | dễ thấy bất an dù đã có nhà",
    "Gia đình nâng đỡ niềm tin của bạn; nhà cửa thường đến nhờ may mắn hoặc người đi trước. | dễ phải xa nhà vì học hành hoặc lý tưởng",
    "Nhà và nghề gắn với nhau: bạn có thể làm việc tại nhà, làm nghề liên quan nhà đất, hoặc theo nghề của gia đình. | dễ để công việc lấn vào tổ ấm",
    "Nhà cửa và gia đình đem lại lợi ích, và bạn có thể sinh lời từ tài sản. | dễ để quan hệ trong nhà thiên về lợi ích",
    "Bạn có thể sống xa quê hoặc đổi chỗ ở nhiều lần; sự bình yên đến từ những khoảng lặng. | dễ thấy thiếu một chỗ thật sự thuộc về",
  ]),
  L([ // lord of 5: intelligence, creativity, children, romance
    "Trí tuệ và sự sáng tạo là nét nổi bật của chính bạn; bạn học nhanh và có duyên với trẻ nhỏ. | dễ tự tin quá vào cái tài",
    "Bạn kiếm tiền bằng trí óc và lời nói; con cái và gia đình là niềm tự hào. | dễ đặt kỳ vọng tiền bạc vào con cái",
    "Bạn sáng tạo qua viết, nói hoặc làm bằng tay; ý tưởng của bạn đi thành việc cụ thể. | dễ tản ra nhiều sở thích",
    "Nhà là nơi bạn học và sáng tạo tốt nhất; gia đình nuôi dưỡng trí tuệ của bạn. | dễ ngại ra ngoài thử sức",
    "Trí tuệ và sự sáng tạo của bạn khá tự chủ; bạn có duyên với học thuật, nghệ thuật và con cái. | dễ sống nhiều trong thế giới ý tưởng",
    "Trí óc của bạn sắc trong việc giải quyết vấn đề, nhưng chuyện con cái hoặc yêu đương có thể phải qua thử thách. | dễ lo âu nghĩ ngợi",
    "Tình yêu dễ dẫn tới gắn bó lâu dài; người bạn chọn thường thông minh hoặc có óc sáng tạo. | dễ lý tưởng hóa người mình thương",
    "Bạn hứng thú với những điều sâu kín như nghiên cứu hay tâm lý; chuyện con cái hoặc đầu tư có thể lên xuống. | tránh mạo hiểm tiền bạc theo cảm hứng",
    "Trí tuệ, việc học và niềm tin nâng đỡ nhau; con cái thường mang lại may mắn. | dễ cho rằng may mắn sẽ luôn có",
    "Trí tuệ và sáng tạo đi thẳng vào nghề nghiệp; bạn hợp giảng dạy, tư vấn, sáng tạo hoặc quản lý. | dễ đặt cái tôi vào công việc",
    "Ý tưởng của bạn dễ sinh lời; con cái và bạn bè mang lại niềm vui. | dễ ham lời nhanh",
    "Trí tuệ của bạn hướng vào bên trong, như thiền, đời sống tinh thần hay nghệ thuật lặng lẽ; chuyện con cái có thể ở xa. | dễ để niềm vui riêng bị đẩy xuống sau",
  ]),
  L([ // lord of 6: daily work, health, debts, rivals
    "Bạn có tinh thần chiến đấu và sức chịu áp lực; công việc nặng không làm bạn ngại. | dễ để căng thẳng ảnh hưởng sức khỏe",
    "Tiền bạc gắn với việc làm thuê, dịch vụ hoặc vay mượn; lời nói cần cẩn trọng khi có tranh chấp. | dễ vướng chuyện nợ nần",
    "Bạn thắng đối thủ nhờ sự chủ động và can đảm. | dễ va chạm với người gần gũi",
    "Sự bình yên trong nhà có thể bị xáo trộn bởi công việc, sửa chữa hoặc sức khỏe người thân. | dễ mang việc về nhà",
    "Con cái hoặc chuyện học có thể cần nhiều công sức; bạn giỏi giải những bài toán khó. | dễ lo quá xa",
    "Bạn mạnh trong cạnh tranh và xử lý việc hằng ngày gọn gàng; khó khăn thường bị bạn đẩy lùi. | dễ ôm việc quá sức",
    "Các mối quan hệ gắn bó có thể nhiều va chạm; hợp tác cần thỏa thuận rõ ràng. | dễ cãi nhau vì chuyện nhỏ",
    "Khó khăn ở mảng này thường tự gỡ theo thời gian, và bạn có sức hồi phục tốt. | cần để ý những vấn đề sức khỏe kéo dài",
    "Bạn có thể khác quan điểm với thầy hoặc cha; công việc phục vụ người khác đem lại cho bạn ý nghĩa. | dễ hoài nghi",
    "Nghề nghiệp gắn với phục vụ, y tế, luật, kỹ thuật hoặc giải quyết vấn đề, và bạn làm việc rất chăm. | dễ gặp cạnh tranh gay gắt nơi làm việc",
    "Bạn thắng trong cạnh tranh và có lợi từ công việc; đối thủ khó làm bạn lùi bước. | dễ vay mượn để đạt mục tiêu",
    "Rắc rối ở mảng này có xu hướng tự lui đi, nhưng chi phí và sức khỏe cần được giữ. | dễ hao tiền cho những chuyện không đâu",
  ]),
  L([ // lord of 7: spouse, partners, contracts
    "Người đồng hành có vai trò lớn trong đời bạn, và bạn thường tự chủ động tìm và chọn người. | dễ muốn quyết thay cả hai",
    "Hôn nhân hoặc hợp tác gắn với tiền bạc và gia đình; người bạn đời có thể giúp bạn tích lũy. | dễ để chuyện tiền xen vào tình cảm",
    "Người bạn đời hoặc đối tác thường năng động, hay đi lại; mối quan hệ cần nhiều trò chuyện. | dễ thiếu ổn định nếu ít gặp nhau",
    "Người đồng hành mang lại cảm giác có nhà; hôn nhân thường gắn với tổ ấm và gia đình. | dễ để chuyện nhà hai bên xen vào",
    "Tình yêu và hôn nhân dễ đi chung; người bạn chọn thường có học, có duyên. | dễ mơ mộng về mối quan hệ",
    "Các mối gắn bó cần nhiều điều chỉnh; hợp tác có thể kèm tranh chấp nếu không rõ ràng từ đầu. | dễ có bất đồng kéo dài",
    "Người đồng hành có chỗ đứng vững trong đời bạn; hôn nhân và hợp tác có xu hướng ổn định. | dễ chờ một người hoàn hảo",
    "Mối quan hệ gắn bó mang nhiều chiều sâu và biến chuyển; người bạn đời có thể đem lại nguồn lực chung. | dễ ghen hoặc giấu cảm xúc",
    "Người đồng hành thường tử tế, có niềm tin, có thể đến từ nơi xa; hôn nhân mở rộng tầm nhìn của bạn. | dễ đặt người kia lên quá cao",
    "Hôn nhân và sự nghiệp gắn nhau: bạn có thể làm việc cùng người bạn đời hoặc gặp người qua công việc. | dễ để công việc lấn vào tình cảm",
    "Người bạn đời và đối tác mang lại lợi ích; bạn hay gặp người qua bạn bè hoặc những nhóm chung. | dễ để quan hệ nghiêng về lợi ích",
    "Người đồng hành có thể ở xa hoặc khác văn hóa, hoặc mối quan hệ cần nhiều hy sinh. | dễ thấy xa cách dù ở gần",
  ]),
  L([ // lord of 8: upheaval, shared resources, hidden matters
    "Đời bạn có những bước ngoặt lớn, và chính chúng làm nên con người bạn; bạn có trực giác mạnh. | dễ lo những điều chưa xảy ra",
    "Tiền bạc có thể đến rồi đi bất ngờ, và lời bạn nói đôi khi quá thẳng. | cần giữ một quỹ dự phòng",
    "Bạn có sức chịu đựng và can đảm khi gặp biến cố, và thích tìm hiểu những chuyện sâu. | dễ tiêu hao sức vì lo lắng",
    "Sự yên ổn trong nhà có thể trải qua những thay đổi lớn, và bạn học cách tìm bình yên từ bên trong. | dễ thấy nhà chưa thật yên",
    "Bạn có hứng thú với nghiên cứu và tâm lý; chuyện đầu tư cần nhiều thận trọng. | tránh đầu cơ",
    "Khó khăn có xu hướng tự lui, và đối thủ khó làm hại bạn. | cần để ý sức khỏe khi căng thẳng kéo dài",
    "Mối quan hệ gắn bó có chiều sâu và có thể trải qua thử thách; nguồn lực chung cần minh bạch. | dễ có những điều chưa nói giữa hai người",
    "Bạn có sức sống bền và khả năng đứng dậy sau biến cố; bạn hiểu sâu những chuyện ít ai thấy. | dễ giữ quá nhiều trong lòng",
    "Niềm tin của bạn có thể thay đổi qua những trải nghiệm lớn; bạn tìm ý nghĩa ở những điều sâu xa. | dễ hoài nghi người dẫn đường",
    "Nghề nghiệp có thể nhiều biến động, hoặc hợp nghiên cứu, tài chính, bảo hiểm, y khoa. | dễ đổi hướng bất ngờ",
    "Lợi nhuận có thể đến bất ngờ, từ nguồn chung hoặc thừa kế; bạn có những người bạn sâu sắc. | thu nhập khó đều đặn",
    "Những điều nặng nề có xu hướng nhẹ dần theo thời gian; bạn có đời sống nội tâm sâu. | cần giấc ngủ và khoảng yên tĩnh",
  ]),
  L([ // lord of 9: fortune, father, teachers, belief, long journeys
    "Bạn có một phần may mắn bẩm sinh: thường gặp người giúp đúng lúc và có một niềm tin dẫn đường. | dễ cho rằng mình luôn đúng",
    "May mắn đến qua tiền bạc và gia đình, và lời bạn nói có sức dạy dỗ. | dễ rộng tay quá mức",
    "Bạn tìm may mắn bằng hành động: tự học, đi lại, viết lách; anh chị em có thể giúp bạn. | dễ mải đi mà ít dừng lại",
    "May mắn gắn với nhà cửa và gia đình; bạn có nền học vấn và tổ ấm tốt. | dễ ngại rời nơi quen",
    "Trí tuệ, việc học và con cái mang lại may mắn cho bạn. | dễ chủ quan với vận may",
    "May mắn phải qua công sức và thử thách; bạn có thể phải tự vượt khó nhiều hơn người. | dễ hoài nghi niềm tin của chính mình",
    "Người đồng hành mang lại may mắn; hôn nhân hoặc hợp tác mở rộng tầm nhìn của bạn. | dễ trông chờ vào người kia",
    "Niềm tin của bạn được rèn qua biến cố; may mắn thường đến muộn hoặc theo đường vòng. | dễ thấy thiếu người dẫn đường",
    "May mắn và niềm tin của bạn khá vững; bạn có duyên với học vấn cao và những chuyến đi xa. | dễ giáo điều",
    "May mắn đi thẳng vào sự nghiệp: bạn dễ có vị thế và được người trên nâng đỡ. | dễ đặt nặng danh tiếng",
    "May mắn đến qua bạn bè và các mối quan hệ; mục tiêu của bạn thường đạt được. | dễ dựa vào người khác",
    "Bạn có duyên với nơi xa, đời sống tinh thần và những chuyến đi dài; may mắn đến khi bạn cho đi. | dễ ở xa cha hoặc thầy",
  ]),
  L([ // lord of 10: career, status
    "Sự nghiệp gắn chặt với chính con người bạn: bạn tự dựng tên tuổi và thường làm chủ hướng đi của mình. | dễ đặt công việc lên trên hết",
    "Nghề nghiệp gắn với tiền bạc, tài chính, lời nói hoặc việc làm ăn của gia đình. | dễ đo thành công bằng thu nhập",
    "Sự nghiệp dựa vào kỹ năng, truyền thông, viết lách hoặc đi lại; bạn tự mở đường. | dễ đổi việc nhiều lần",
    "Sự nghiệp có chỗ dựa chắc, có thể gắn với nhà cửa, đất đai, giáo dục hoặc làm việc tại nhà. | dễ để công việc lấn vào gia đình",
    "Nghề nghiệp hợp với giảng dạy, sáng tạo, tư vấn hoặc quản lý; trí tuệ là vốn của bạn. | dễ cần được ghi nhận quá nhiều",
    "Sự nghiệp gắn với phục vụ, y tế, luật, kỹ thuật hoặc cạnh tranh; bạn làm việc rất chăm. | dễ quá tải",
    "Sự nghiệp đi qua hợp tác, khách hàng, đối tác hoặc làm việc với công chúng. | dễ phụ thuộc vào người khác",
    "Con đường nghề nghiệp có thể nhiều biến động, hoặc hợp nghiên cứu, tài chính, bảo hiểm. | dễ đổi hướng bất ngờ",
    "Sự nghiệp được may mắn và người đi trước nâng đỡ; hợp giáo dục, luật, tôn giáo hoặc làm việc với nước ngoài. | dễ quá lý tưởng",
    "Sự nghiệp của bạn có chỗ đứng vững; khi đã vào một vị trí, bạn thường giữ được lâu. | dễ lấy công việc làm toàn bộ con người mình",
    "Công việc dễ mang lại thu nhập và mạng lưới quan hệ; mục tiêu nghề nghiệp thường đạt. | dễ chạy theo kết quả",
    "Sự nghiệp hợp với nơi xa, nước ngoài, bệnh viện, tổ chức lớn hoặc việc sau hậu trường. | dễ thấy công sức chưa được nhìn nhận",
  ]),
  L([ // lord of 11: gains, friends, aspirations
    "Thu nhập và cơ hội đến nhờ chính năng lực và sự chủ động của bạn; bạn có nhiều bạn. | dễ đặt mục tiêu quá cao",
    "Thu nhập dễ tích lại thành tài sản; gia đình và lời nói giúp bạn có lợi. | dễ ham giữ",
    "Lợi nhuận đến từ kỹ năng, giao tiếp hoặc buôn bán nhỏ; anh chị em và bạn bè giúp bạn. | dễ chạy theo nhiều nguồn nhỏ",
    "Lợi ích đến qua nhà cửa, đất đai hoặc gia đình. | dễ để tiền bạc chi phối không khí trong nhà",
    "Lợi nhuận đến từ trí tuệ, sáng tạo hoặc đầu tư; con cái mang lại niềm vui. | dễ ham lời nhanh",
    "Thu nhập phải qua cạnh tranh, công việc nặng hoặc vay mượn. | dễ bất hòa với bạn bè vì tiền",
    "Lợi ích đến qua người bạn đời, đối tác và các mối hợp tác. | dễ đặt quan hệ lên bàn cân lợi ích",
    "Thu nhập có lúc đến bất ngờ, có lúc gián đoạn; nguồn lực chung hoặc thừa kế có thể đóng vai trò. | thu nhập khó đều",
    "Lợi ích đến nhờ may mắn, người đi trước hoặc những chuyến đi xa. | dễ trông chờ vận may",
    "Thu nhập gắn với nghề nghiệp và vị thế; công việc chính là nguồn lợi lớn nhất. | dễ chạy theo thành tích",
    "Thu nhập và mạng lưới quan hệ của bạn khá vững; mục tiêu dài hạn thường thành. | dễ coi bạn bè là phương tiện",
    "Tiền kiếm được dễ chảy ra; lợi ích có thể đến từ nơi xa hoặc từ việc giúp người. | cần kiểm soát chi tiêu",
  ]),
  L([ // lord of 12: expenses, sleep, solitude, distant lands, letting go
    "Bạn có đời sống nội tâm sâu, hợp với nơi xa quê hoặc những việc thầm lặng. | dễ hao sức nếu không biết dừng",
    "Tiền bạc dễ ra nhiều cho gia đình hoặc cho những việc không định trước. | cần một kế hoạch chi tiêu",
    "Sức lực và kỹ năng của bạn hợp với việc ở xa, làm qua mạng hoặc sau hậu trường. | dễ thấy công sức trôi đi",
    "Bạn có thể sống xa quê hoặc đổi chỗ ở; nhà cũng là nơi bạn tìm sự tĩnh lặng. | dễ thấy thiếu chỗ thuộc về",
    "Niềm vui của bạn hướng vào bên trong, như thiền hay nghệ thuật lặng lẽ; chi tiêu cho con cái hoặc sở thích có thể cao. | dễ đầu tư theo cảm hứng",
    "Chi tiêu và rắc rối có xu hướng tự lui; bạn vượt qua đối thủ một cách lặng lẽ. | cần giữ sức khỏe",
    "Người đồng hành có thể ở xa hoặc khác văn hóa; mối quan hệ cần sự hy sinh và thấu hiểu. | dễ thấy xa cách",
    "Những mất mát có xu hướng chuyển thành chiều sâu; bạn hợp nghiên cứu và đời sống tinh thần. | cần giấc ngủ đủ",
    "Bạn có duyên với nơi xa, những chuyến đi dài và đời sống tinh thần. | dễ chi nhiều cho học hành, đi lại",
    "Sự nghiệp hợp với nước ngoài, tổ chức lớn, bệnh viện, từ thiện hoặc việc sau hậu trường. | dễ thấy công việc tiêu tốn quá nhiều",
    "Lợi ích có thể đến từ nơi xa, nhưng tiền cũng dễ chi cho bạn bè hoặc nhóm. | cần ranh giới với tiền của mình",
    "Bạn biết buông và biết lấy lại sức bằng khoảng yên tĩnh; đời sống tinh thần là chỗ dựa. | dễ thu mình quá lâu",
  ]),
];

/** What a planet looking at the house adds, said without naming it. `up` = the house grows with effort (3, 6, 10, 11).
 *  `seed` (the house number) picks one of a few wordings, so two houses of the same chart do not repeat a sentence. */
export function lookLines(id: string, up: boolean): string[] {
  const v = (xs: string[]) => xs;
  switch (id) {
    case "jupiter": return v(["Mảng này còn được che chở: khi gặp khó, bạn thường có người giúp hoặc tự tìm ra lối ra.", "Ở đây bạn có một lớp bảo vệ: những lúc chênh vênh thường có người hiểu chuyện đứng bên cạnh.", "Mảng này có thêm sự rộng rãi và hiểu biết, nên chuyện khó thường được nhìn theo hướng tích cực hơn."]);
    case "saturn": return up ? v(["Mảng này được rèn bởi kỷ luật: càng làm lâu, bạn càng vững.", "Ở đây sự bền bỉ là vũ khí của bạn: chậm lúc đầu, nhưng càng về sau càng chắc."])
      : v(["Mảng này cũng chịu một sức ép chậm: mọi thứ thường đến muộn hơn bạn muốn, nhưng đã đến thì bền.", "Ở đây có một lực kéo chậm lại: bạn thường phải chờ lâu hơn người khác, đổi lại là thứ có được ít khi mất đi.", "Mảng này đòi hỏi sự kiên nhẫn: kết quả đến theo năm tháng, không theo mong muốn."]);
    case "mars": return up ? v(["Bạn có thêm sức bật và tinh thần cạnh tranh ở mảng này.", "Ở đây bạn có thêm lửa: dám làm, dám giành, và không dễ lùi bước."])
      : v(["Ở đây cũng dễ có va chạm hoặc nóng vội; bình tĩnh thêm một nhịp sẽ đỡ được nhiều chuyện.", "Mảng này dễ có lúc căng thẳng hoặc quyết định vội; chậm lại một chút trước khi phản ứng sẽ giúp bạn nhiều.", "Ở đây có một chút nóng: tranh cãi nhỏ dễ thành to nếu không ai chịu dừng trước."]);
    case "venus": return v(["Mảng này cũng có sự êm ái: cách bạn cư xử nhẹ nhàng thường mở được nhiều cánh cửa.", "Ở đây có thêm sự dễ chịu và duyên dáng, giúp mọi chuyện trôi mềm hơn."]);
    case "mercury": return v(["Đầu óc linh hoạt và khả năng trao đổi giúp bạn xử lý mảng này khéo léo.", "Ở đây bạn được lợi nhờ sự nhanh trí và biết cách nói chuyện."]);
    case "moon": return ["Bạn đặt nhiều cảm xúc vào mảng này, nên tâm trạng có lúc lên xuống theo nó.", "Ở đây cảm xúc của bạn tham gia nhiều, nên một ngày vui hay buồn cũng ảnh hưởng tới nó."];
    case "sun": return ["Bạn muốn làm chủ mảng này theo cách của riêng mình.", "Ở đây bạn muốn được tự quyết và được ghi nhận."];
    default: return [];
  }
}

/** Said when the lord of the house is weak: how the promise of the house is slowed, in the words of each area. */
export const SLOW: string[] = [
  "Có điều, sự phát triển này thường chậm hơn bạn mong và đến qua nhiều lần tự rèn.",
  "Có điều, tiền ở đây thường đến chậm và phải giữ bằng kỷ luật hơn là may mắn.",
  "Có điều, sự chủ động này phải được hâm nóng nhiều lần mới thành thói quen.",
  "Có điều, sự yên ổn này thường đến muộn và cần bạn vun nhiều.",
  "Có điều, những niềm vui ở đây thường đến muộn hơn bạn mong.",
  "Có điều, sức bền này dễ bị vắt kiệt nếu bạn không biết dừng.",
  "Có điều, duyên ở đây thường đến chậm và cần cả hai cùng vun.",
  "Có điều, những biến chuyển ở đây thường kéo dài hơn bạn nghĩ.",
  "Có điều, sự nâng đỡ ở đây thường đến muộn hoặc theo đường vòng.",
  "Có điều, con đường này thường chậm được ghi nhận.",
  "Có điều, kết quả ở đây thường đến chậm hơn công sức bỏ ra.",
  "Có điều, việc lấy lại sức ở đây cần được tập, không đến một cách tự nhiên.",
];

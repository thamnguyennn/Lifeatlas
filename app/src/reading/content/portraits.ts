// Hand-written reading atoms, part 16: the three keystones (cung mọc, Mặt Trời, Mặt Trăng) as full portraits.
// Voice: the reference notebook's voice (see STYLE.md, bản 3). A named motif, five beats that go from what the person needs
// to what it costs them and what the people close to them see, then a short "Vì sao".
// Material for each sign comes from the notebook (sources listed in SOURCES.md, "Ba mốc gốc"). Illness is left out on purpose.

export interface Beat { h: string; p: string }
export interface Portrait { motif: string; beats: Beat[]; why: string }

/** Mặt Trăng ở từng cung. Index 0 = Bạch Dương. */
export const MOON_PORTRAIT: Portrait[] = [
  {
    motif: "Trái tim muốn tự cầm lái",
    beats: [
      { h: "Điều lòng bạn cần nhất", p: "Bạn chỉ thấy yên khi được tự quyết. Một việc do chính tay bạn khởi động, dù nhỏ như tự đặt vé hay tự sửa cái kệ, làm bạn dễ chịu hơn mười lời an ủi. Cảm xúc của bạn đi theo đường thẳng: thấy gì nói nấy, muốn gì làm nấy." },
      { h: "Nỗi sợ ít khi nói ra", p: "Bạn sợ bị đặt vào thế bị động, phải ngồi chờ người khác quyết thay mình, và sợ bị nhìn như người yếu, người chậm. Cảm giác bị trói tay làm bạn bứt rứt hơn bất kỳ khó khăn nào." },
      { h: "Khi bị tổn thương", p: "Bạn nổi nóng ngay tại chỗ, nói một câu thật gắt, rồi đứng dậy đi thẳng. Bạn thà tự làm một mình cho xong còn hơn nhận sự giúp đỡ của người vừa làm bạn tổn thương. Cơn giận đến nhanh và cũng tan nhanh, có khi chỉ sau một buổi tối." },
      { h: "Người thân nhìn thấy", p: "Một người bộc trực, nhiều sức sống, sẵn sàng xông lên trước khi có chuyện. Họ cũng thấy bạn nóng tính, hiếu thắng và rất khó chờ đợi, nhất là khi người khác làm chậm hơn bạn." },
      { h: "Bài học để lớn lên", p: "Dừng lại ba nhịp trước khi phản ứng. Nhường một bước để giữ một người không phải là thua. Khi bạn nghe hết câu của người kia rồi mới nói, sức mạnh của bạn trở thành thứ người ta tin cậy chứ không còn là thứ người ta né." },
    ],
    why: "Mặt Trăng là cảm xúc và tâm trí. Bạch Dương là cung lửa đầu tiên, do Sao Hỏa cai quản, nên cảm xúc của bạn nhanh, nóng và cần hành động ngay.",
  },
  {
    motif: "Người giữ nhịp đều cho cả nhà",
    beats: [
      { h: "Điều lòng bạn cần nhất", p: "Bạn cần những thứ đều đặn và có thể đoán trước: bữa cơm đúng giờ, căn phòng quen mùi, một khoản để dành biết rõ là còn đó. Bạn yêu những niềm vui chạm được bằng tay: món ăn ngon, tấm chăn mềm, một góc nhà sạch sẽ. Cảm xúc của bạn chậm nóng, nhưng đã thương thì thương rất lâu." },
      { h: "Nỗi sợ ít khi nói ra", p: "Bạn sợ những thay đổi đến bất ngờ, sợ cảnh thiếu thốn, và sợ mất đi những điều thân quen mình đã mất nhiều năm vun đắp. Chỉ một tin xấu về tiền bạc hay chỗ ở cũng đủ làm bạn mất ngủ mấy đêm." },
      { h: "Khi bị tổn thương", p: "Bạn không cãi. Bạn lặng đi, cứng lại, và nhất định không nói thêm câu nào về chuyện đó. Rồi bạn tự dỗ mình bằng một món thật ngon, hoặc ngồi xem lại sổ tiết kiệm, sắp lại đồ đạc, cho tới khi thấy mọi thứ vẫn còn nằm yên chỗ cũ." },
      { h: "Người thân nhìn thấy", p: "Một chỗ dựa điềm đạm, đáng tin, ai hoảng thì đến ngồi cạnh bạn là thấy lòng lắng lại. Họ cũng thấy bạn bảo thủ, chậm đổi ý, và có những lúc rất khó lay chuyển dù họ đã nói đủ lý lẽ." },
      { h: "Bài học để lớn lên", p: "Để cho cuộc đời được thay đổi mà không coi đó là mất mát. Nắm lỏng tay hơn với đồ vật và cả với người mình thương. Sự an toàn thật nằm ở chỗ bạn biết mình đứng vững được, kể cả khi căn phòng quen không còn như cũ." },
    ],
    why: "Mặt Trăng là cảm xúc và tâm trí. Kim Ngưu là cung đất do Sao Kim cai quản, và là vị trí Mặt Trăng mạnh nhất, nên cảm xúc của bạn vững, bền và tìm sự chắc chắn.",
  },
  {
    motif: "Cái đầu nói thay trái tim",
    beats: [
      { h: "Điều lòng bạn cần nhất", p: "Bạn cần được trò chuyện, được hỏi han, được có điều mới để nghĩ. Một tối nói chuyện hợp ý, một cuốn sách hay, một tin nhắn qua lại thật lâu là cách bạn tự nuôi lòng mình. Bạn hiểu cảm xúc của mình bằng cách gọi tên nó thành lời." },
      { h: "Nỗi sợ ít khi nói ra", p: "Bạn sợ buồn chán, sợ bị nhốt trong một việc lặp lại ngày này qua ngày khác, và sợ bị người khác cho là ngây ngô hay kém hiểu biết. Im lặng kéo dài làm bạn bồn chồn hơn cả một trận cãi nhau." },
      { h: "Khi bị tổn thương", p: "Bạn chuyển nỗi buồn thành lời: một câu đùa hơi cay, một tin nhắn dài giải thích đâu là đúng đâu là sai, hoặc gọi ngay cho một người bạn khác để nói chuyện cho quên. Bạn phân tích chuyện vừa xảy ra rất kỹ, chỉ có điều ít khi để mình thật sự cảm nó." },
      { h: "Người thân nhìn thấy", p: "Một người vui, lanh lợi, nói chuyện có duyên và biết rất nhiều thứ. Họ cũng thấy bạn hay đổi tâm trạng, khó ngồi yên, và rất khó đoán điều bạn thật sự cảm thấy đằng sau nụ cười." },
      { h: "Bài học để lớn lên", p: "Ở lại với một cảm xúc đủ lâu trước khi giải thích nó. Chọn vài điều để theo đến cùng thay vì chạm vào mọi thứ. Khi bạn dám nói câu đơn giản nhất, như \"mình đang buồn\", người ta mới thật sự đến gần được bạn." },
    ],
    why: "Mặt Trăng là cảm xúc và tâm trí. Song Tử là cung khí do Sao Thủy, hành tinh của lời nói và trí óc, cai quản, nên cảm xúc của bạn đi qua suy nghĩ và lời nói trước.",
  },
  {
    motif: "Mái nhà ai cũng muốn về",
    beats: [
      { h: "Điều lòng bạn cần nhất", p: "Bạn cần cảm giác thuộc về một nơi và một nhóm người: một mái nhà để về, vài người để chăm và được chăm lại. Bạn nhớ rất lâu những bữa cơm, những món quà nhỏ, cả giọng nói của người đã từng dỗ dành mình." },
      { h: "Nỗi sợ ít khi nói ra", p: "Bạn sợ bị bỏ lại, sợ người thân lạnh nhạt dần mà không nói lý do, và sợ tấm lòng thật của mình bị đem ra chê cười. Một câu nói vô tình có thể theo bạn nhiều năm." },
      { h: "Khi bị tổn thương", p: "Bạn rút vào phòng, ôm gối và khóc một mình, hoặc im lặng dỗi để người kia tự nhận ra lỗi. Bạn hiếm khi nói thẳng \"bạn làm mình đau\", nhưng bạn nhớ rất kỹ, và nỗi buồn cũ có thể quay lại vào một ngày tưởng như không liên quan." },
      { h: "Người thân nhìn thấy", p: "Một người dịu dàng, chu đáo, nhớ sinh nhật của từng người và luôn hỏi \"ăn gì chưa\". Họ cũng thấy tâm trạng của bạn lên xuống như con nước, và bạn để bụng những lời mà họ nói xong đã quên." },
      { h: "Bài học để lớn lên", p: "Thương mà không giữ chặt. Chăm sóc người khác nhưng không buộc họ phải ở lại vì món nợ tình cảm. Khi bạn đặt được ranh giới cho lòng mình và buông được những oán giận cũ, sự ấm áp của bạn mới không còn làm chính bạn kiệt sức." },
    ],
    why: "Mặt Trăng là cảm xúc và tâm trí. Cự Giải là cung nước do chính Mặt Trăng cai quản, nên cảm xúc của bạn sâu, nhớ lâu, và gắn chặt với gia đình.",
  },
  {
    motif: "Trái tim rộng mở cần được nhìn thấy",
    beats: [
      { h: "Điều lòng bạn cần nhất", p: "Bạn cần được trân trọng, và cần biết mình có một chỗ đặc biệt trong lòng người mình thương. Bạn cho đi rất hào phóng: bao cả bàn, lo trọn một việc, đứng ra che cho người nhà. Đổi lại bạn chỉ mong một lời ghi nhận thật lòng." },
      { h: "Nỗi sợ ít khi nói ra", p: "Bạn sợ bị ngó lơ. Bạn sợ một ngày nhận ra mình chỉ là người bình thường, không ai cần đến. Cảm giác bị coi nhẹ trước mặt nhiều người là điều bạn khó nuốt nhất." },
      { h: "Khi bị tổn thương", p: "Bạn ngẩng cao đầu, giữ giọng lạnh và bước đi rất thẳng. Không ai được thấy bạn khóc hay suy sụp. Bạn có thể rút lại sự hào phóng của mình một thời gian, như một cách nói rằng người kia đã đánh mất điều quý." },
      { h: "Người thân nhìn thấy", p: "Một người ấm áp, hào sảng, che chở cả nhà như một người đứng đầu. Họ cũng thấy bạn dễ tự ái, cần được khen nhiều hơn mức bạn chịu thừa nhận, và khó chịu khi không được hỏi ý trước." },
      { h: "Bài học để lớn lên", p: "Biết giá trị của mình mà không cần tiếng vỗ tay. Khiêm nhường một cách thật lòng, nhận lỗi trước khi được yêu cầu. Khi lòng tự trọng của bạn không còn phụ thuộc vào ánh mắt người khác, sự ấm áp ấy mới tỏa ra mà không đòi lại gì." },
    ],
    why: "Mặt Trăng là cảm xúc và tâm trí. Sư Tử là cung lửa do Mặt Trời, hành tinh của bản ngã và lòng tự trọng, cai quản, nên cảm xúc của bạn gắn với danh dự và sự ghi nhận.",
  },
  {
    motif: "Người dọn dẹp để lòng được yên",
    beats: [
      { h: "Điều lòng bạn cần nhất", p: "Bạn cần mọi thứ có trật tự, và cần thấy mình đang làm được việc có ích. Một danh sách việc được gạch hết, một ngăn tủ gọn gàng, một lời cảm ơn vì bạn đã nhắc đúng lúc là những thứ làm bạn thấy nhẹ người." },
      { h: "Nỗi sợ ít khi nói ra", p: "Bạn sợ hỗn loạn, sợ chính mình mắc lỗi, và sợ bị người khác chê là cẩu thả hay thiếu trách nhiệm. Bạn có thể nằm nghĩ lại một câu nói sai suốt cả buổi tối." },
      { h: "Khi bị tổn thương", p: "Bạn không nói mình buồn. Bạn lao vào lau nhà, sắp lại từng góc tủ, làm thêm việc, và trong lúc đó cằn nhằn về những lỗi rất nhỏ của người vừa làm bạn buồn. Cảm xúc không được nói ra thường biến thành sự soi xét." },
      { h: "Người thân nhìn thấy", p: "Một người chăm chỉ, tỉ mỉ, lo cho cả nhà đâu ra đấy, việc gì giao cho bạn là yên tâm. Họ cũng thấy bạn khắt khe, hay lo xa, và đôi khi nhắc lỗi nhiều hơn khen." },
      { h: "Bài học để lớn lên", p: "Chấp nhận rằng con người và cuộc sống không bao giờ hoàn hảo, kể cả chính bạn. Bớt chấm điểm mình và người khác mỗi ngày. Khi bạn cho phép một việc chỉ cần đủ tốt, tâm trí bạn mới có chỗ để nghỉ." },
    ],
    why: "Mặt Trăng là cảm xúc và tâm trí. Xử Nữ là cung đất do Sao Thủy cai quản, cung của sự phân tích và phục vụ, nên cảm xúc của bạn tìm sự yên ổn qua trật tự và việc có ích.",
  },
  {
    motif: "Người giữ hòa khí bằng mọi giá",
    beats: [
      { h: "Điều lòng bạn cần nhất", p: "Bạn cần sự hài hòa và một người đồng hành hiểu mình để chia sẻ từng chuyện nhỏ trong ngày. Một căn phòng đẹp, một bữa tối không ai to tiếng, một cuộc nói chuyện có qua có lại là thứ làm lòng bạn dịu xuống." },
      { h: "Nỗi sợ ít khi nói ra", p: "Bạn sợ xung đột gay gắt, sợ phải ở một mình, và sợ phải đưa ra một quyết định dứt khoát làm mất lòng ai đó. Bạn có thể mất cả tuần để cân nhắc một lời từ chối." },
      { h: "Khi bị tổn thương", p: "Bạn mỉm cười cho qua, nói \"không sao đâu\", rồi lặng lẽ lùi ra. Sau đó bạn tìm đến một người bạn khác để kể lại, cần nghe ai đó nói rằng bạn không sai. Điều chưa nói được với người trong cuộc cứ thế tích lại." },
      { h: "Người thân nhìn thấy", p: "Một người duyên dáng, lịch thiệp, biết cách làm cho mọi người cùng vui. Họ cũng thấy bạn hay do dự, ít khi nói rõ mình muốn gì, và dễ nhường để giữ hòa khí rồi về sau lại thấy thiệt." },
      { h: "Bài học để lớn lên", p: "Dám nói thẳng điều mình nghĩ, dám từ chối một cách rõ ràng. Một cuộc nói chuyện khó mà thật lòng giữ quan hệ lâu hơn nhiều năm êm đẹp mà không ai nói thật. Sự công bằng bạn dành cho người khác, bạn cũng nên dành cho chính mình." },
    ],
    why: "Mặt Trăng là cảm xúc và tâm trí. Thiên Bình là cung khí do Sao Kim cai quản, cung của cái cân và quan hệ đôi lứa, nên cảm xúc của bạn tìm sự cân bằng giữa mình và người kia.",
  },
  {
    motif: "Mặt hồ phẳng, đáy hồ sâu",
    beats: [
      { h: "Điều lòng bạn cần nhất", p: "Bạn cần một sự gắn bó trọn vẹn, không nửa vời. Bạn cần biết người bên cạnh trung thành với mình, và cần nắm được tình hình để không bị bất ngờ. Bạn không thương nhiều người, nhưng đã thương thì thương đến tận cùng." },
      { h: "Nỗi sợ ít khi nói ra", p: "Bạn sợ bị phản bội, sợ bị người khác điều khiển, và sợ để lộ chỗ mềm yếu nhất của lòng mình. Bạn hay đoán trước điều xấu nhất để không bao giờ bị nó làm cho bất ngờ." },
      { h: "Khi bị tổn thương", p: "Mặt bạn lạnh lại, ánh mắt sắc hơn, và bạn bắt đầu ghi nhớ từng chi tiết. Rồi có thể một ngày bạn cắt liên lạc hẳn, không một lời giải thích. Người kia thường chỉ biết mình đã mất bạn khi mọi chuyện đã xong." },
      { h: "Người thân nhìn thấy", p: "Một người sâu sắc, mạnh mẽ, sẵn sàng đứng ra bảo vệ gia đình đến cùng. Họ cũng thấy bạn kín như bưng, đa nghi, và luôn giữ một khoảng cách mà họ không biết làm sao vượt qua." },
      { h: "Bài học để lớn lên", p: "Tha thứ thật lòng, và buông bớt nhu cầu phải kiểm soát mọi thứ. Trao niềm tin cho người đã chứng minh họ xứng đáng, dù việc đó làm bạn thấy hở sườn. Khi bạn thôi phòng thủ, chiều sâu của bạn trở thành nơi người khác được chữa lành." },
    ],
    why: "Mặt Trăng là cảm xúc và tâm trí. Bọ Cạp là cung nước do Sao Hỏa cai quản, và là vị trí Mặt Trăng yếu nhất, nên cảm xúc của bạn mạnh, kín, và luôn cảnh giác.",
  },
  {
    motif: "Người cần một chân trời để thở",
    beats: [
      { h: "Điều lòng bạn cần nhất", p: "Bạn cần tự do, cần một điều để tin và một lý do để sống cho đáng. Một chuyến đi, một khóa học mới, một cuộc nói chuyện về ý nghĩa cuộc sống có thể làm bạn khỏe lại sau cả tháng mệt mỏi." },
      { h: "Nỗi sợ ít khi nói ra", p: "Bạn sợ bị giam trong những trách nhiệm vụn vặt, sợ mất quyền đi lại, và sợ một ngày nhìn về tương lai mà không thấy lối ra. Cảm giác bế tắc làm bạn sợ hơn cả nghèo." },
      { h: "Khi bị tổn thương", p: "Bạn buông một câu triết lý hoặc một câu đùa, cười xòa như không có gì, rồi xách túi ra đường. Một chuyến đi, dù chỉ là chạy xe quanh thành phố, là cách bạn gỡ rối. Bạn hiếm khi ngồi lại để nói hết chuyện với người vừa làm mình buồn." },
      { h: "Người thân nhìn thấy", p: "Một người vui tính, rộng lượng, lạc quan và hay động viên người khác. Họ cũng thấy bạn có lúc vô tâm, nói thẳng đến mức làm người khác đau, và chưa thật sự gánh hết phần việc nhà." },
      { h: "Bài học để lớn lên", p: "Trân trọng những trách nhiệm ngay trước mắt, vì đó cũng là một phần ý nghĩa. Ngồi lại với nỗi buồn của người thân thay vì giảng cho họ một bài học. Lý tưởng của bạn có giá trị nhất khi nó hiện ra trong cách bạn đối xử với người ở gần." },
    ],
    why: "Mặt Trăng là cảm xúc và tâm trí. Nhân Mã là cung lửa do Sao Mộc, hành tinh của niềm tin và hiểu biết, cai quản, nên cảm xúc của bạn cần ý nghĩa và khoảng trời rộng.",
  },
  {
    motif: "Đôi vai quen gánh trước khi được hỏi",
    beats: [
      { h: "Điều lòng bạn cần nhất", p: "Bạn cần một nền móng chắc: công việc ổn định, thành quả cụ thể, và cảm giác mình đủ sức gánh mọi chuyện. Bạn yên lòng nhất khi đã lo xong phần của mình và biết ngày mai còn có gì để dựa vào." },
      { h: "Nỗi sợ ít khi nói ra", p: "Bạn sợ thiếu thốn, sợ bị nhìn như người thất bại, và sợ rằng nếu để lộ lúc yếu lòng thì vị trí của mình sẽ bị lung lay. Bạn quen tự giải quyết trước khi ai kịp biết có chuyện." },
      { h: "Khi bị tổn thương", p: "Bạn khóa cảm xúc lại và siết chặt kỷ luật hơn. Bạn ngồi làm việc tới khuya, dậy sớm hơn, làm nhiều hơn để chứng minh mình vẫn ổn. Không ai thấy bạn rơi nước mắt, và chính bạn cũng ít khi cho phép mình buồn trọn vẹn." },
      { h: "Người thân nhìn thấy", p: "Một trụ cột già dặn, vững như bàn thạch, việc lớn việc nhỏ đều có bạn lo. Họ cũng thấy bạn khô khan, khắt khe, rất ít nói lời thương, và đôi khi họ ước được bạn ôm hơn là được bạn lo." },
      { h: "Bài học để lớn lên", p: "Dịu dàng với chính mình. Cho phép mình được mệt, được nghỉ, được nhờ người khác. Tình thương không cần đong bằng việc bạn đã gánh được bao nhiêu, và người thân của bạn cần nghe bạn nói thương nhiều hơn bạn nghĩ." },
    ],
    why: "Mặt Trăng là cảm xúc và tâm trí. Ma Kết là cung đất do Sao Thổ, hành tinh của trách nhiệm và thời gian, cai quản, nên cảm xúc của bạn tìm sự an toàn trong việc gánh vác.",
  },
  {
    motif: "Người bạn tốt của cả thế giới, người lạ của chính mình",
    beats: [
      { h: "Điều lòng bạn cần nhất", p: "Bạn cần một khoảng riêng thật độc lập, được sống theo cách của mình, và được góp sức cho một điều tốt chung. Một nhóm bạn cùng chí hướng, một dự án giúp được nhiều người làm bạn thấy mình đang sống đúng." },
      { h: "Nỗi sợ ít khi nói ra", p: "Bạn sợ bị ép vào khuôn, sợ những ràng buộc tình cảm quá ủy mị, và sợ mất quyền nghĩ khác. Sự gần gũi quá mức làm bạn thấy ngột ngạt dù người kia rất tốt với bạn." },
      { h: "Khi bị tổn thương", p: "Bạn lạnh đi rất nhanh, nhìn chuyện vừa xảy ra như một người quan sát đứng ngoài, phân tích nó cho thật hợp lý, rồi quay sang dồn sức cho công việc nhóm hay sở thích riêng. Người kia thấy bạn bình thường, nhưng thật ra bạn đã khép lại." },
      { h: "Người thân nhìn thấy", p: "Một người thân thiện, công bằng, tốt với tất cả mọi người. Họ cũng thấy bạn hơi lạ, hơi xa, và rất khó chạm đến những gì bạn thật sự cảm thấy, kể cả khi đã sống cùng nhau nhiều năm." },
      { h: "Bài học để lớn lên", p: "Sưởi ấm người ở gần bằng trái tim, không chỉ bằng lý lẽ. Gần gũi không lấy mất tự do của bạn. Khi bạn dám để một người thấy mình yếu, bạn mới biết được thương là thế nào." },
    ],
    why: "Mặt Trăng là cảm xúc và tâm trí. Bảo Bình là cung khí do Sao Thổ cai quản, cung của tập thể và lối nghĩ khác thường, nên cảm xúc của bạn cần khoảng cách và lý tưởng chung.",
  },
  {
    motif: "Tấm lòng không có bờ rào",
    beats: [
      { h: "Điều lòng bạn cần nhất", p: "Bạn cần được hiểu mà không phải giải thích, cần những khoảng lặng để lòng lắng lại, và cần một chỗ dựa tinh thần, có thể là niềm tin, âm nhạc hay một người rất hiền. Bạn cảm được nỗi buồn của người khác trước khi họ kịp nói." },
      { h: "Nỗi sợ ít khi nói ra", p: "Bạn sợ sự thô ráp của đời thực, sợ bị bỏ rơi một mình, và sợ những tính toán vụ lợi của lòng người. Một lời nói nặng có thể làm bạn chao đảo cả ngày." },
      { h: "Khi bị tổn thương", p: "Bạn tắt đèn, nằm nghe nhạc một mình, chìm vào mơ mộng hoặc tự trách mình cả đêm. Bạn thường nhận phần thiệt về mình cho xong chuyện, rồi lặng lẽ buồn rất lâu mà không ai biết." },
      { h: "Người thân nhìn thấy", p: "Một người hiền lành, nhân hậu, hay hy sinh, và có trực giác nhạy đến bất ngờ. Họ cũng thấy bạn hay mơ, dễ tin người, và không biết tự bảo vệ mình trước những người không tốt." },
      { h: "Bài học để lớn lên", p: "Dựng một hàng rào rõ ràng giữa lòng tốt và sự nhẹ dạ. Nhìn thẳng vào chuyện thật thay vì trốn vào thế giới riêng. Giữ bình yên cho chính mình trước, rồi bạn mới đủ sức giúp người khác mà không bị cuốn theo họ." },
    ],
    why: "Mặt Trăng là cảm xúc và tâm trí. Song Ngư là cung nước cuối cùng, do Sao Mộc cai quản, cung của lòng trắc ẩn và sự buông bỏ, nên cảm xúc của bạn mềm, rộng và dễ hòa vào người khác.",
  },
];

/** Mặt Trời ở từng cung. Index 0 = Bạch Dương. */
export const SUN_PORTRAIT: Portrait[] = [
  {
    motif: "Người đứng dậy đầu tiên trong phòng họp",
    beats: [
      { h: "Điều làm bạn thấy mình sống có ý nghĩa", p: "Được mở đường, tự tay vạch lối đi riêng và thắng một thử thách khó bằng chính sức mình. Bạn thấy mình có giá trị nhất khi chuyện đã bế tắc và cần một người dám nhận phần khó." },
      { h: "Lúc bạn sáng nhất", p: "Cuộc họp đang dậm chân tại chỗ, bạn đứng dậy, chia việc cho từng người và nhận về mình phần rủi ro nhất. Mọi người thở phào vì cuối cùng cũng có người quyết." },
      { h: "Khi lòng tự ái bị chạm", p: "Bạn dễ trở nên độc đoán, gắt gỏng, gạt phăng ý kiến người khác, và có thể cắt đứt một mối quan hệ chỉ để giữ thể diện. Sau đó bạn thường tiếc, nhưng hiếm khi nói ra." },
      { h: "Với cha, cấp trên và người có quyền", p: "Bạn học được rất nhiều từ họ, nhưng cũng hay va chạm vì không chịu cúi đầu. Bạn tôn trọng người giỏi thật, còn với người chỉ có chức danh thì rất khó giữ im lặng." },
      { h: "Bài học để lớn lên", p: "Giữ được cơn giận, hạ cái tôi xuống một bậc để nghe người cùng làm. Người dẫn dắt giỏi là người khiến đội của mình mạnh lên, không phải người luôn đứng trước tất cả." },
    ],
    why: "Mặt Trời là bản ngã và linh hồn. Ở Bạch Dương, cung lửa đầu tiên, Mặt Trời mạnh nhất, nên ý chí của bạn rõ, nhanh và muốn dẫn đầu.",
  },
  {
    motif: "Người xây thứ còn lại sau mình",
    beats: [
      { h: "Điều làm bạn thấy mình sống có ý nghĩa", p: "Gây dựng được một thứ cụ thể: một khoản tích lũy, một căn nhà, một công việc làm ăn bền. Bạn thấy mình sống đáng khi gia đình được an toàn nhờ những gì bạn bỏ công vun đắp." },
      { h: "Lúc bạn sáng nhất", p: "Giữa lúc mọi người hoảng vì giá cả tăng hay công việc chững lại, bạn ngồi xem từng dòng chi tiêu, bình tĩnh cắt chỗ lãng phí và chỉ ra con đường đi qua được. Sự điềm tĩnh của bạn làm người khác yên lòng." },
      { h: "Khi lòng tự ái bị chạm", p: "Bạn đóng cửa lại, lì ra, nhất định không nghe thêm. Bạn có thể từ chối mọi điều mới chỉ vì người đề xuất đã làm bạn phật lòng, và bám chặt vào quan điểm cũ lâu hơn cần thiết." },
      { h: "Với cha, cấp trên và người có quyền", p: "Bạn tôn trọng trật tự và người làm việc có quy củ, nhưng ngấm ngầm khó chịu khi cấp trên thay đổi liên tục. Người cha trong lá số này thường thực tế và kỹ tính chuyện tiền." },
      { h: "Bài học để lớn lên", p: "Mềm lại trước những thay đổi không báo trước. Giá trị của một người không đo bằng số dư tài khoản hay món đồ đang sở hữu, và chính bạn cũng không cần chứng minh mình bằng chúng." },
    ],
    why: "Mặt Trời là bản ngã và linh hồn. Kim Ngưu là cung đất do Sao Kim cai quản, nên bạn tìm ý nghĩa sống trong những thứ có thật và bền lâu.",
  },
  {
    motif: "Người biến con số khô thành câu chuyện",
    beats: [
      { h: "Điều làm bạn thấy mình sống có ý nghĩa", p: "Được nói, được viết, được nối người với người và ý với ý. Bạn thấy mình có giá trị khi một bế tắc được gỡ ra nhờ một câu hỏi đúng hoặc một cách giải thích dễ hiểu của bạn." },
      { h: "Lúc bạn sáng nhất", p: "Đứng trước một nhóm người, bạn lấy một bản báo cáo đầy số liệu và kể nó thành một câu chuyện có duyên, có ví dụ, có cả tiếng cười. Người nghe nhớ điều bạn nói lâu hơn họ tưởng." },
      { h: "Khi lòng tự ái bị chạm", p: "Lời nói thành vũ khí: một câu mỉa mai, một lập luận vòng vèo để chứng minh mình đúng. Bạn có thể thắng cuộc tranh luận nhưng để lại một người không muốn nói chuyện với bạn nữa." },
      { h: "Với cha, cấp trên và người có quyền", p: "Bạn muốn nói chuyện với họ như hai người ngang hàng. Gặp người bảo thủ, chỉ muốn ra lệnh, bạn dễ chán và dễ tìm đường đi nơi khác." },
      { h: "Bài học để lớn lên", p: "Nói ít hơn một chút và giữ lời nhiều hơn. Chọn một hướng chính để theo đến cùng. Trí thông minh của bạn quý nhất khi nó đi sâu, chứ không chỉ đi nhanh." },
    ],
    why: "Mặt Trời là bản ngã và linh hồn. Song Tử là cung khí do Sao Thủy, hành tinh của lời nói và trí óc, cai quản, nên bạn khẳng định mình qua hiểu biết và cách truyền đạt.",
  },
  {
    motif: "Người giữ lửa cho mái nhà",
    beats: [
      { h: "Điều làm bạn thấy mình sống có ý nghĩa", p: "Làm chỗ dựa cho người thân, giữ cho mái nhà đủ đầy và cảm thấy mình gắn bó với gốc rễ. Bạn thấy đời mình có ý nghĩa nhất khi người mình thương được yên ổn." },
      { h: "Lúc bạn sáng nhất", p: "Tự tay nấu một bữa cơm cho cả nhà, kéo ghế mời từng người, rồi ngồi nghe một người vừa trải qua một ngày tệ. Bạn biết cách làm người khác thấy mình được chăm sóc." },
      { h: "Khi lòng tự ái bị chạm", p: "Bạn đóng cửa lòng, im lặng dỗi rất lâu, rồi có lúc nhắc lại những gì mình đã làm cho người kia để họ thấy có lỗi. Đó là cách bạn đòi lại sự quan tâm mà không phải nói thẳng." },
      { h: "Với cha, cấp trên và người có quyền", p: "Quan hệ nhiều cảm xúc. Bạn mong cấp trên che chở mình như người nhà, nên một lời phê bình công việc thẳng thắn cũng dễ làm bạn tự ái." },
      { h: "Bài học để lớn lên", p: "Tự tin bằng chính mình, không đợi phản ứng của người khác mới biết mình ổn. Tách bạch chuyện tình cảm với chuyện công việc. Bạn vẫn là người ấm áp, chỉ là không còn bị tổn thương vì mọi lời nói." },
    ],
    why: "Mặt Trời là bản ngã và linh hồn. Cự Giải là cung nước do Mặt Trăng cai quản, nên ý chí của bạn gắn chặt với gia đình và cảm xúc.",
  },
  {
    motif: "Người che cho cả đội",
    beats: [
      { h: "Điều làm bạn thấy mình sống có ý nghĩa", p: "Đứng ở vị trí trung tâm, được tôn trọng, và làm người khác tự tin hơn khi ở cạnh mình. Bạn thấy mình sống đúng khi được che chở và nâng đỡ những người đi theo bạn." },
      { h: "Lúc bạn sáng nhất", p: "Bạn bước vào phòng đàng hoàng, khen đúng công từng người, và khi có sự cố thì đứng ra nhận trách nhiệm về mình. Người dưới quyền nhớ bạn vì cảm giác được bảo vệ." },
      { h: "Khi lòng tự ái bị chạm", p: "Bạn dễ trở nên trịch thượng, coi nhẹ người khác, và không chịu nổi việc có ai làm lu mờ mình. Kiêu hãnh lúc này biến thành khoảng cách." },
      { h: "Với cha, cấp trên và người có quyền", p: "Người cha thường mạnh mẽ hoặc có uy. Bạn rất khó làm dưới quyền người khác, trừ khi người đó thật sự có tâm và có tầm để bạn nể." },
      { h: "Bài học để lớn lên", p: "Khiêm nhường một cách thật lòng. Sự lớn lao không nằm ở ánh mắt ngưỡng mộ của người khác, mà ở việc bạn phục vụ họ tử tế mà không cần ai ghi công." },
    ],
    why: "Mặt Trời là bản ngã và linh hồn. Sư Tử là cung của chính Mặt Trời, nên bản ngã của bạn mạnh, ấm và tự nhiên muốn dẫn dắt.",
  },
  {
    motif: "Người tìm ra lỗi trước khi nó thành chuyện",
    beats: [
      { h: "Điều làm bạn thấy mình sống có ý nghĩa", p: "Giải được bài toán khó, làm cho một quy trình chạy trơn tru, và giúp được một việc cụ thể cho người khác. Bạn thấy mình có giá trị khi công việc tốt hơn nhờ sự kỹ lưỡng của bạn." },
      { h: "Lúc bạn sáng nhất", p: "Bạn ngồi đọc lại từng điều khoản đến khuya, và tìm ra đúng một chỗ sai có thể làm cả nhóm mất rất nhiều. Không ai để ý cho đến khi bạn chỉ ra, và từ đó người ta tin giao việc khó cho bạn." },
      { h: "Khi lòng tự ái bị chạm", p: "Bạn trở nên cay, soi từng lỗi nhỏ của người khác và nhắc đi nhắc lại, như một cách chứng minh mình luôn cẩn thận và đúng. Người nghe thấy bị chấm điểm hơn là được góp ý." },
      { h: "Với cha, cấp trên và người có quyền", p: "Bạn làm việc rất đến nơi đến chốn, nhưng hay có khoảng cách với cấp trên vì tính hay góp ý. Người cha thường kỹ tính, nghiêm khắc và hay nhận xét." },
      { h: "Bài học để lớn lên", p: "Nhìn cả bức tranh trước khi nhìn vết xước. Bao dung với sự vụng về của người khác và bớt trách mình. Người ta nhớ bạn vì bạn đã giúp họ, hơn là vì bạn đã sửa lỗi cho họ." },
    ],
    why: "Mặt Trời là bản ngã và linh hồn. Xử Nữ là cung đất do Sao Thủy cai quản, cung của phân tích và phục vụ, nên bạn khẳng định mình qua sự chuẩn xác và hữu ích.",
  },
  {
    motif: "Người gỡ nút giữa hai phía",
    beats: [
      { h: "Điều làm bạn thấy mình sống có ý nghĩa", p: "Làm cho mọi người hòa thuận, giữ được sự công bằng, nối được những người tưởng không thể ngồi chung bàn. Bạn thấy mình sống đẹp khi xung quanh có trật tự và có thẩm mỹ." },
      { h: "Lúc bạn sáng nhất", p: "Hai bên đang to tiếng, bạn ngồi giữa, nói chậm, tôn trọng cả hai, và gỡ từng chỗ vướng cho tới khi họ chịu bắt tay. Đó là việc ít người làm được." },
      { h: "Khi lòng tự ái bị chạm", p: "Bạn dễ nhượng bộ quá mức để giữ thể diện, ngoài mặt vui vẻ mà trong lòng không vui, rồi kể lại chuyện ở chỗ khác. Bạn tránh được một cuộc cãi nhưng mang theo một nỗi ấm ức." },
      { h: "Với cha, cấp trên và người có quyền", p: "Bạn hay thiếu tự tin trước người có quyền, dễ bị lấn hoặc bị nhờ vả quá sức. Quan hệ với cha thường có khoảng cách, hoặc thiếu một sự nâng đỡ vững vàng." },
      { h: "Bài học để lớn lên", p: "Đặt ranh giới cho mình, nói \"không\" rõ ràng, và tự trọng mà không cần ai xác nhận. Bạn vẫn giỏi giữ hòa khí, chỉ là không còn phải trả giá bằng chính tiếng nói của mình." },
    ],
    why: "Mặt Trời là bản ngã và linh hồn. Ở Thiên Bình, cung của Sao Kim, Mặt Trời ở vị trí yếu nhất, nên bạn dễ đặt người khác trước mình và cần thời gian để vững tiếng nói riêng.",
  },
  {
    motif: "Người giữ bình tĩnh giữa cơn bão",
    beats: [
      { h: "Điều làm bạn thấy mình sống có ý nghĩa", p: "Đi đến tận gốc của sự việc, vượt qua những lần phải làm lại cuộc đời, và nắm được thực quyền để không ai điều khiển mình. Bạn sống có ý nghĩa khi hiểu được điều người khác không dám nhìn." },
      { h: "Lúc bạn sáng nhất", p: "Giữa một cuộc khủng hoảng, bạn giữ mặt lạnh, lặng lẽ tìm hiểu, rồi đưa ra một quyết định đúng lúc làm xoay cả tình thế. Người ta không biết bạn đã nghĩ bao nhiêu đêm." },
      { h: "Khi lòng tự ái bị chạm", p: "Bạn trở nên đa nghi, nhớ rất lâu, và có thể lặng lẽ tính chuyện đáp trả. Với người đã làm tổn thương danh dự của mình, bạn rất khó tha thứ." },
      { h: "Với cha, cấp trên và người có quyền", p: "Bạn luôn giữ thế phòng thủ với cấp trên. Quan hệ với cha có thể có những chuyện khó nói, hoặc một sự giằng co ngầm về việc ai có tiếng nói." },
      { h: "Bài học để lớn lên", p: "Buông nhu cầu kiểm soát, và tha thứ để chính mình được nhẹ. Sức mạnh của bạn lớn nhất khi dùng để giúp người khác đứng dậy, không phải để phòng thủ hay để đáp trả." },
    ],
    why: "Mặt Trời là bản ngã và linh hồn. Bọ Cạp là cung nước do Sao Hỏa cai quản, cung của những điều ẩn kín và biến đổi, nên ý chí của bạn sâu, bền và khó lay.",
  },
  {
    motif: "Người thắp lửa cho người đang lạc hướng",
    beats: [
      { h: "Điều làm bạn thấy mình sống có ý nghĩa", p: "Theo đuổi một lý tưởng, chia sẻ điều mình hiểu, và sống tự do không bị trói bởi những khuôn hẹp. Bạn thấy đời mình đáng khi giúp được ai đó tìm ra hướng đi." },
      { h: "Lúc bạn sáng nhất", p: "Trong buổi gặp người mới, bạn say sưa kể về một tầm nhìn, và những người đang hoang mang bỗng thấy có lý do để cố gắng. Bạn truyền niềm tin như người khác truyền lửa." },
      { h: "Khi lòng tự ái bị chạm", p: "Bạn dễ trở nên giáo điều, giảng đạo lý, và coi nhẹ người nghĩ khác mình. Niềm tin lúc này biến thành sự cố chấp." },
      { h: "Với cha, cấp trên và người có quyền", p: "Thường tốt, nhất là khi họ là người có đức và có tầm nhìn. Người cha hay đóng vai một người thầy, dạy bạn về lẽ phải và cách sống." },
      { h: "Bài học để lớn lên", p: "Tôn trọng những chuyện rất đời thường. Không dùng lý tưởng để phán xét người khác. Lắng nghe góc nhìn trái chiều bằng sự khiêm tốn, vì đó cũng là cách bạn học thêm." },
    ],
    why: "Mặt Trời là bản ngã và linh hồn. Nhân Mã là cung lửa do Sao Mộc, hành tinh của hiểu biết và niềm tin, cai quản, nên bạn khẳng định mình qua lý tưởng và việc dẫn đường.",
  },
  {
    motif: "Người đến sớm nhất, về muộn nhất",
    beats: [
      { h: "Điều làm bạn thấy mình sống có ý nghĩa", p: "Leo lên từng bậc bằng kỷ luật của mình, có một vị trí vững trong xã hội, và gánh được trách nhiệm của một trụ cột. Bạn thấy mình có giá trị khi người khác dựa được vào bạn." },
      { h: "Lúc bạn sáng nhất", p: "Khi công ty khó khăn, bạn là người đến sớm nhất, về muộn nhất, giữ cho mọi người làm đúng nề nếp và đưa cả nhóm qua được giai đoạn khó. Không ồn ào, nhưng ai cũng biết có bạn thì yên tâm." },
      { h: "Khi lòng tự ái bị chạm", p: "Bạn lạnh đi, tính toán từng chút, và có thể dùng vị trí của mình để đè người khác. Bạn dễ coi thường những ai bạn cho là yếu hay không cố gắng." },
      { h: "Với cha, cấp trên và người có quyền", p: "Bạn rất tôn trọng thứ bậc, nhưng quan hệ thường nặng phần bổn phận. Người cha hay xa cách, nghiêm khắc và ít khi khen." },
      { h: "Bài học để lớn lên", p: "Để trái tim được ấm. Vị trí và thành tích là phương tiện để làm điều tốt, không phải thước đo duy nhất của một con người, kể cả của chính bạn." },
    ],
    why: "Mặt Trời là bản ngã và linh hồn. Ma Kết là cung đất do Sao Thổ, hành tinh của thời gian và trách nhiệm, cai quản, nên bạn khẳng định mình qua công sức bền bỉ.",
  },
  {
    motif: "Người nối những người xa lạ thành một nhóm",
    beats: [
      { h: "Điều làm bạn thấy mình sống có ý nghĩa", p: "Phá bỏ những lề lối cũ không công bằng, góp sức cho cộng đồng, và tạo ra một nơi mọi người được nghĩ khác mà không bị chê. Bạn sống có ý nghĩa khi làm được điều có ích cho nhiều người." },
      { h: "Lúc bạn sáng nhất", p: "Bạn khởi xướng một việc chung, một chuyến thiện nguyện hay một dự án mới, và nối được hàng chục người không quen biết thành một nhóm cùng làm. Bạn giỏi nhìn thấy cái chung giữa những người rất khác nhau." },
      { h: "Khi lòng tự ái bị chạm", p: "Bạn trở nên bướng, tỏ ra mình hiểu biết hơn, và cố tình làm ngược lại số đông để chứng tỏ mình khác. Bạn cũng có thể lạnh hẳn đi và rút khỏi nhóm." },
      { h: "Với cha, cấp trên và người có quyền", p: "Bạn dễ phản kháng người có quyền nếu họ độc đoán. Với cha thường có những khác biệt rất sâu về cách sống và cách nghĩ." },
      { h: "Bài học để lớn lên", p: "Dung hòa cái riêng của mình với cái chung, và đừng để sự khác biệt thành khoảng cách với người thân. Bạn có thể vừa nghĩ khác vừa ở gần." },
    ],
    why: "Mặt Trời là bản ngã và linh hồn. Bảo Bình là cung khí do Sao Thổ cai quản, cung của tập thể và lối nghĩ mới, nên bạn khẳng định mình qua lý tưởng chung và sự khác biệt.",
  },
  {
    motif: "Người ở lại khi buổi lễ đã tan",
    beats: [
      { h: "Điều làm bạn thấy mình sống có ý nghĩa", p: "Sống tử tế mà không cần ai biết, cảm được nỗi đau của người khác, và có một đời sống tinh thần sâu. Bạn không thích bon chen, và thấy đời mình đáng khi đã giúp ai đó nhẹ lòng." },
      { h: "Lúc bạn sáng nhất", p: "Khi sự kiện đã xong và mọi người ra về, bạn ở lại ngồi nghe một người đang gặp chuyện buồn, không cần ai chụp ảnh hay ghi tên. Những điều tốt nhất bạn làm thường không có người chứng kiến." },
      { h: "Khi lòng tự ái bị chạm", p: "Bạn dễ thấy mình là người thiệt thòi, than thở, rồi trốn vào thế giới riêng và buông xuôi. Bạn không đáp trả, nhưng cũng không đứng lên." },
      { h: "Với cha, cấp trên và người có quyền", p: "Bạn kính trọng người có phẩm chất tốt, nhưng thất vọng nhanh khi thấy họ thực dụng. Người cha thường hiền, mơ mộng, hoặc hy sinh lặng lẽ." },
      { h: "Bài học để lớn lên", p: "Đặt chân xuống mặt đất. Dựng ranh giới để bảo vệ mình, và biến lòng thương thành việc làm cụ thể. Bạn giúp được nhiều người hơn khi chính mình đứng vững." },
    ],
    why: "Mặt Trời là bản ngã và linh hồn. Song Ngư là cung nước do Sao Mộc cai quản, cung của lòng trắc ẩn và sự buông bỏ, nên bản ngã của bạn mềm, ít tranh giành, và hướng về điều thiện.",
  },
];

/** Cung mọc. Index 0 = Bạch Dương. */
export const LAGNA_PORTRAIT: Portrait[] = [
  {
    motif: "Bước vào đời như người chạy trước",
    beats: [
      { h: "Ấn tượng đầu tiên", p: "Dáng đi nhanh, ánh mắt sáng và thẳng. Người ta gặp bạn là thấy ngay một người tự tin, bộc trực, lúc nào cũng sẵn sàng làm." },
      { h: "Cách bạn bắt đầu một việc", p: "Bạn lao vào làm trước rồi mới tính chi tiết sau. Những ngày đầu bạn hăng hái hơn bất kỳ ai, và chính bạn là người kéo cả nhóm ra khỏi vạch xuất phát." },
      { h: "Khi bị dồn vào góc", p: "Bạn phản công ngay, nói to, đối đầu thẳng mặt, và nhất định không lùi. Áp lực càng lớn, bạn càng cứng." },
      { h: "Điều bạn hay phải trả giá", p: "Những mối quan hệ sứt mẻ vì một lúc nóng vội, những việc lớn hỏng giữa chừng vì thiếu kiên nhẫn, và những rủi ro đến từ một quyết định quá liều." },
      { h: "Bài học để lớn lên", p: "Giữ sức cho đường dài, và nghĩ đến hậu quả trước khi bấm nút. Sự can đảm của bạn đáng quý nhất khi nó đi cùng sự bền bỉ." },
    ],
    why: "Cung mọc là thân thể và cách bạn bước vào đời. Bạch Dương do Sao Hỏa cai quản, nên bạn bước vào mọi chuyện bằng hành động và sự quyết đoán.",
  },
  {
    motif: "Vững như một tảng đá có hơi ấm",
    beats: [
      { h: "Ấn tượng đầu tiên", p: "Dáng người chắc, ánh nhìn điềm đạm, nói chậm. Người ta gặp bạn là thấy một người thực tế, đáng tin, khó bị lay." },
      { h: "Cách bạn bắt đầu một việc", p: "Bạn dò từng bước, tính kỹ lợi ích và độ an toàn rồi mới khởi động. Bạn làm chậm nhưng đều, như con ong không ngừng tay, và hiếm khi bỏ dở." },
      { h: "Khi bị dồn vào góc", p: "Bạn đứng yên, lì ra, không phản ứng. Người kia giục hay dọa thế nào bạn cũng không nhúc nhích, và kiên quyết giữ nguyên như cũ." },
      { h: "Điều bạn hay phải trả giá", p: "Những cơ hội đến nhanh mà bạn để vuột vì quá thận trọng, và những năm ở lại vùng quen thuộc lâu hơn mức cần." },
      { h: "Bài học để lớn lên", p: "Mở lòng với điều mới, bỏ được những thứ đã cũ, và không để nỗi sợ mất an toàn giữ chân mình. Sự vững vàng của bạn không mất đi khi bạn thay đổi." },
    ],
    why: "Cung mọc là thân thể và cách bạn bước vào đời. Kim Ngưu là cung đất do Sao Kim cai quản, nên bạn bước vào đời chậm, chắc và thích sự dễ chịu.",
  },
  {
    motif: "Người mở lời bằng một câu hỏi",
    beats: [
      { h: "Ấn tượng đầu tiên", p: "Dáng người nhanh nhẹn, tay chân hoạt bát, mắt lúc nào cũng tò mò nhìn quanh. Người ta gặp bạn là thấy một người trẻ trung, thân thiện và rất dễ bắt chuyện." },
      { h: "Cách bạn bắt đầu một việc", p: "Bạn hỏi rất nhiều, tìm tài liệu, rủ vài người cùng bàn, và thường mở cùng lúc mấy hướng thú vị khác nhau." },
      { h: "Khi bị dồn vào góc", p: "Bạn dùng lời để đánh lạc hướng, biến chuyện nghiêm thành chuyện đùa, hoặc khéo léo rút đi trước khi phải đối đầu." },
      { h: "Điều bạn hay phải trả giá", p: "Nhiều việc dở dang, sức lực bị chia nhỏ cho quá nhiều thứ, và những lời hứa vội làm người khác bớt tin." },
      { h: "Bài học để lớn lên", p: "Chọn một điều và đi đến cùng. Nói ít lại, làm cho xong. Khi bạn theo được một việc tới kết quả, sự nhanh nhạy của bạn mới thành một tài năng thật." },
    ],
    why: "Cung mọc là thân thể và cách bạn bước vào đời. Song Tử do Sao Thủy cai quản, nên bạn bước vào đời bằng sự tò mò, lời nói và trí óc nhanh.",
  },
  {
    motif: "Lớp vỏ cứng, ruột rất mềm",
    beats: [
      { h: "Ấn tượng đầu tiên", p: "Gương mặt hiền, ánh mắt dịu, dáng người mềm mại. Người ta thấy bạn ấm áp và chu đáo, nhưng lúc đầu hơi dè dặt, phải quen một thời gian mới thật sự mở lòng." },
      { h: "Cách bạn bắt đầu một việc", p: "Bạn đi theo cảm giác. Bạn chỉ bắt tay vào làm khi thấy nơi đó an toàn, người ở đó thân thiện, và người nhà ủng hộ." },
      { h: "Khi bị dồn vào góc", p: "Bạn rút vào trong vỏ, im lặng, khóc một mình, hoặc dỗi để người kia phải mềm lại trước." },
      { h: "Điều bạn hay phải trả giá", p: "Những cơ hội lỡ mất vì tâm trạng lên xuống, những nỗi buồn kéo dài vì không buông được chuyện cũ, và những mối quan hệ không tốt mà bạn mãi chưa dứt được." },
      { h: "Bài học để lớn lên", p: "Đứng vững bằng chính mình, không để cảm xúc nhất thời quyết thay những việc lớn, và để quá khứ ở lại phía sau. Bạn vẫn là người biết thương, chỉ là thương mà không bị kéo đi." },
    ],
    why: "Cung mọc là thân thể và cách bạn bước vào đời. Cự Giải do Mặt Trăng cai quản, nên bạn bước vào đời bằng cảm xúc và nhu cầu được an toàn.",
  },
  {
    motif: "Bước vào phòng là người ta biết",
    beats: [
      { h: "Ấn tượng đầu tiên", p: "Dáng đứng thẳng, đầu ngẩng, phong thái tự tin và rộng rãi. Người ta gặp bạn là thấy một người có uy, có khí chất của người đứng đầu." },
      { h: "Cách bạn bắt đầu một việc", p: "Bạn bắt đầu với một bức tranh lớn, thích đứng ra làm trưởng nhóm, chia việc cho mọi người, và muốn mọi thứ phải làm cho ra dáng." },
      { h: "Khi bị dồn vào góc", p: "Bạn nổi giận rất có uy, gạt phăng lời chỉ trích để giữ thể diện, và có thể cắt đứt quan hệ nếu thấy danh dự bị xúc phạm." },
      { h: "Điều bạn hay phải trả giá", p: "Những khoản chi vì sĩ diện, cảm giác cô đơn khi đã đứng ở trên cao, và việc dễ tin những người chỉ giỏi khen." },
      { h: "Bài học để lớn lên", p: "Khiêm tốn thật lòng, và để ý đến những người góp sức lặng lẽ. Uy tín thật đến từ nhân cách, chức danh chỉ đi kèm theo nó." },
    ],
    why: "Cung mọc là thân thể và cách bạn bước vào đời. Sư Tử do Mặt Trời cai quản, nên bạn bước vào đời bằng sự tự tin và mong muốn dẫn dắt.",
  },
  {
    motif: "Người đã kiểm tra hai lần",
    beats: [
      { h: "Ấn tượng đầu tiên", p: "Ăn mặc gọn gàng, cử chỉ khiêm tốn, ánh mắt quan sát rất kỹ. Người ta thấy bạn lịch sự, thông minh, và để ý những chi tiết mà người khác bỏ qua." },
      { h: "Cách bạn bắt đầu một việc", p: "Bạn lập danh sách, tính các rủi ro, chuẩn bị cả phương án dự phòng rồi mới bắt tay vào. Với bạn, chuẩn bị kỹ đã là một nửa công việc." },
      { h: "Khi bị dồn vào góc", p: "Bạn đưa ra hàng loạt lý lẽ và số liệu để phản bác, chỉ ra lỗi của người kia, và nói rất chi tiết để đẩy áp lực ra xa." },
      { h: "Điều bạn hay phải trả giá", p: "Mệt mỏi vì cầu toàn, bỏ lỡ việc lớn vì mải sửa chỗ nhỏ, và một nỗi lo thường trực làm khổ cả mình lẫn người bên cạnh." },
      { h: "Bài học để lớn lên", p: "Chấp nhận rằng cuộc sống vốn lộn xộn, ngừng chấm điểm người khác, và hài lòng khi mình đã làm hết sức. Đủ tốt nhiều khi đã là tốt." },
    ],
    why: "Cung mọc là thân thể và cách bạn bước vào đời. Xử Nữ do Sao Thủy cai quản, nên bạn bước vào đời bằng sự quan sát, phân tích và chuẩn bị kỹ.",
  },
  {
    motif: "Nụ cười giữ cho căn phòng dịu lại",
    beats: [
      { h: "Ấn tượng đầu tiên", p: "Nụ cười duyên, phong thái thanh lịch, ăn mặc hài hòa. Người ta gặp bạn là thấy dễ chịu, thấy bạn nhã nhặn, hiếu khách và biết cách làm mọi người thoải mái." },
      { h: "Cách bạn bắt đầu một việc", p: "Bạn tìm người để cùng làm, hỏi ý nhiều người để có sự đồng thuận, và rất chú ý đến việc mọi thứ trông có đẹp và đàng hoàng không." },
      { h: "Khi bị dồn vào góc", p: "Bạn mỉm cười xoa dịu, đưa ra một giải pháp nước đôi để không ai phật lòng, hoặc lần lữa mãi không chốt." },
      { h: "Điều bạn hay phải trả giá", p: "Dựa vào người khác quá nhiều, mất chính kiến vì muốn ai cũng hài lòng, và mất thời gian trong những lần phân vân không dứt." },
      { h: "Bài học để lớn lên", p: "Đứng được một mình, quyết những việc khó, và chấp nhận mất lòng trước để được lòng sau. Sự duyên dáng của bạn càng có giá khi đi cùng một lập trường rõ." },
    ],
    why: "Cung mọc là thân thể và cách bạn bước vào đời. Thiên Bình do Sao Kim cai quản, nên bạn bước vào đời bằng sự hòa nhã và nhu cầu có người đồng hành.",
  },
  {
    motif: "Ánh mắt nhìn qua lời nói",
    beats: [
      { h: "Ấn tượng đầu tiên", p: "Ánh mắt sâu như nhìn thấu người đối diện, cử chỉ kín đáo, ít cười. Người ta thấy bạn trầm, bí ẩn và có một sức hút khó gọi tên." },
      { h: "Cách bạn bắt đầu một việc", p: "Bạn chuẩn bị âm thầm, không hé lộ với ai, và chỉ công bố khi mọi thứ đã nằm trong tay mình." },
      { h: "Khi bị dồn vào góc", p: "Bạn im lặng hoàn toàn, mặt không biểu lộ gì, quan sát điểm yếu của đối phương, và chờ đúng lúc mới phản ứng." },
      { h: "Điều bạn hay phải trả giá", p: "Sự cô độc vì nghi ngờ quá mức, những đêm tự giày vò vì chuyện cũ, và những mối quan hệ tốt bị chính bạn đẩy ra vì sợ bị phản bội." },
      { h: "Bài học để lớn lên", p: "Mở lòng tin người, buông nhu cầu kiểm soát, và dùng sức mạnh của mình để chữa lành chứ không để phòng thủ. Bạn mạnh nhất khi không còn phải đề phòng." },
    ],
    why: "Cung mọc là thân thể và cách bạn bước vào đời. Bọ Cạp do Sao Hỏa cai quản, cung của những điều ẩn kín, nên bạn bước vào đời bằng sự cảnh giác và chiều sâu.",
  },
  {
    motif: "Bước dài, trán rộng, lòng tin lớn",
    beats: [
      { h: "Ấn tượng đầu tiên", p: "Dáng người cao hoặc đầy đặn, bước đi dài và thoải mái. Người ta gặp bạn là thấy một người cởi mở, lạc quan, hào sảng và rất yêu tự do." },
      { h: "Cách bạn bắt đầu một việc", p: "Bạn bắt đầu rất hào hứng với một tầm nhìn xa, tin vào vận may của mình, và ít để tâm đến những trở ngại nhỏ trước mắt." },
      { h: "Khi bị dồn vào góc", p: "Bạn bỏ ngoài tai lời phàn nàn, cười xòa coi như chuyện nhỏ, rồi xách túi đi tìm một nơi thoáng hơn để khỏi thấy ngột ngạt." },
      { h: "Điều bạn hay phải trả giá", p: "Những cú vấp vì chủ quan, những rắc rối từ lời hứa quá tay, và những lần nói thẳng quá làm người thân buồn." },
      { h: "Bài học để lớn lên", p: "Cẩn thận với những chi tiết ngay trước mắt, và giữ chữ tín trong từng cam kết nhỏ. Tầm nhìn xa của bạn đi được xa nhất khi đôi chân bước chắc." },
    ],
    why: "Cung mọc là thân thể và cách bạn bước vào đời. Nhân Mã do Sao Mộc cai quản, nên bạn bước vào đời bằng niềm tin, sự lạc quan và nhu cầu đi xa.",
  },
  {
    motif: "Già dặn từ khi còn trẻ",
    beats: [
      { h: "Ấn tượng đầu tiên", p: "Gương mặt rắn rỏi, ánh nhìn nghiêm và già dặn, ăn mặc đơn giản. Người ta thấy bạn điềm tĩnh, cẩn trọng, và lúc đầu hơi xa cách." },
      { h: "Cách bạn bắt đầu một việc", p: "Bạn hỏi trước về trách nhiệm và luật lệ, lên kế hoạch từng bước, và sẵn sàng làm vất vả trong thời gian dài để đi đến nơi." },
      { h: "Khi bị dồn vào góc", p: "Bạn khóa cảm xúc lại, lầm lũi làm nhiều hơn, và để kết quả trả lời thay cho mình. Bạn nhất định không tỏ ra yếu." },
      { h: "Điều bạn hay phải trả giá", p: "Những niềm vui tuổi trẻ bị bỏ qua vì phải gánh việc quá sớm, một đời sống khô khan, và những khoảnh khắc gia đình lỡ mất vì mải làm." },
      { h: "Bài học để lớn lên", p: "Cho phép mình nghỉ và tận hưởng. Nói lời thương với người thân một cách trực tiếp, không chỉ qua việc lo cho họ. Sự vững vàng của bạn không mất đi khi bạn mềm lại." },
    ],
    why: "Cung mọc là thân thể và cách bạn bước vào đời. Ma Kết do Sao Thổ cai quản, nên bạn bước vào đời bằng trách nhiệm, sự kiên nhẫn và thói quen gánh vác.",
  },
  {
    motif: "Thân với mọi người, khó với riêng ai",
    beats: [
      { h: "Ấn tượng đầu tiên", p: "Ánh mắt xa xăm khó đoán, gu ăn mặc khác người. Người ta thấy bạn thân thiện nhưng lạ, cởi mở với tất cả mà khó gần với riêng một ai." },
      { h: "Cách bạn bắt đầu một việc", p: "Bạn nhìn vấn đề từ một góc chưa ai nghĩ tới, thích dùng công nghệ hay cách làm mới để vượt qua lối mòn." },
      { h: "Khi bị dồn vào góc", p: "Bạn tắt cảm xúc, nhìn người kia như một đối tượng để quan sát, trở nên bướng và tự tách mình khỏi nhóm." },
      { h: "Điều bạn hay phải trả giá", p: "Bị cho là lập dị, gặp khó trong chuyện tình cảm riêng vì sự lạnh nhạt, và khó tìm được một người bạn thật sự hiểu mình." },
      { h: "Bài học để lớn lên", p: "Gắn kết bằng hơi ấm, không chỉ bằng lý lẽ, và tôn trọng những cảm xúc rất bình thường của người bên cạnh. Bạn không cần bớt khác đi để được gần ai đó." },
    ],
    why: "Cung mọc là thân thể và cách bạn bước vào đời. Bảo Bình do Sao Thổ cai quản, cung của tập thể và lối nghĩ mới, nên bạn bước vào đời bằng sự độc lập và khác biệt.",
  },
  {
    motif: "Đôi mắt chứa cả một vùng nước",
    beats: [
      { h: "Ấn tượng đầu tiên", p: "Đôi mắt to, mơ màng, dáng đi nhẹ nhàng. Người ta thấy bạn hiền lành, nhân hậu, và có phần xa xôi như đang nghĩ về một điều gì khác." },
      { h: "Cách bạn bắt đầu một việc", p: "Bạn nghe theo trực giác, bắt đầu theo cảm hứng, hoặc vì muốn giúp ai đó hơn là vì tính chuyện lời lãi." },
      { h: "Khi bị dồn vào góc", p: "Bạn trốn vào một góc yên, buông xuôi để mọi chuyện tự trôi, hoặc tự an ủi bằng những giấc mơ đẹp để quên điều đang làm mình đau." },
      { h: "Điều bạn hay phải trả giá", p: "Bị lợi dụng lòng tốt và cả tiền bạc vì dễ tin người, làm việc thiếu nề nếp nên thất thoát, và có những năm trôi đi mà không rõ mình đang đi về đâu." },
      { h: "Bài học để lớn lên", p: "Dựng một ranh giới chắc để bảo vệ mình, giữ một nhịp làm việc có kỷ luật, và nhìn thẳng vào sự thật thay vì trốn tránh. Lòng tốt của bạn cần một đôi tay vững để đi được xa." },
    ],
    why: "Cung mọc là thân thể và cách bạn bước vào đời. Song Ngư do Sao Mộc cai quản, cung của lòng trắc ẩn và sự buông bỏ, nên bạn bước vào đời bằng trực giác và sự mềm mỏng.",
  },
];

/** How the three keystones sit together: one paragraph that names the tension or the agreement, in the same voice. */
export const TRIAD_LINE = {
  sunMoon: {
    same: "Điều bạn muốn trở thành và điều lòng bạn cần cùng một nhịp {a}. Vì vậy khi bạn đã chọn hướng, cảm xúc đi theo khá tự nhiên, ít khi bạn phải cãi nhau với chính mình. Mặt trái là bạn dễ dồn hết vào một kiểu sống và ít để chỗ cho những điều khác nhịp.",
    friend: "Mặt Trời ({a}) và Mặt Trăng ({b}) đỡ cho nhau. Điều bạn theo đuổi được cảm xúc nâng lên, và cảm xúc của bạn có một hướng để đi. Phần lớn thời gian, cái đầu và trái tim của bạn nói cùng một ngôn ngữ.",
    tension: "Mặt Trời ({a}) và Mặt Trăng ({b}) đi hai nhịp khác nhau. Có những ngày cái đầu muốn tiến tới mà lòng lại muốn ngồi yên, hoặc ngược lại. Đó là lý do bạn hay thấy mình vừa muốn điều này vừa cần điều kia, và cũng là lý do bạn hiểu người khác sâu hơn nhiều người.",
  },
  lagnaMoon: {
    same: "Cách bạn bước vào đời và cảm xúc của bạn cùng nhịp {a}, nên người ta nhìn bạn thế nào thì bạn cũng gần như thế ấy. Bạn ít phải đóng vai.",
    friend: "Cung mọc ({a}) và Mặt Trăng ({b}) hợp nhau, nên điều bạn cảm thấy thường hiện ra tự nhiên trong cách bạn cư xử. Người thân đọc được bạn khá dễ.",
    tension: "Cung mọc ({a}) và Mặt Trăng ({b}) lệch nhịp, nên người mới gặp thường đoán sai về bạn. Điều họ thấy lúc đầu và điều bạn thật sự cảm thấy có một khoảng cách, và chỉ người ở đủ lâu mới biết.",
  },
};

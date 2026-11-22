/**
 * Biên tập riêng cho Tổng quan. Mỗi câu diễn đạt sắc thái biểu tượng của
 * Nakshatra bằng tiếng Việt đời thường; tên chòm sao và căn cứ ở mục mở rộng.
 * Không dùng các câu này làm khẳng định về tâm lý hoặc tiểu sử có thật.
 * Thứ tự 0..26 khớp NAKSHATRA trong engine.
 */
export const LAGNA_NAK_TEXTURE: readonly string[] = [
  "Trong những tình huống mới, bạn có xu hướng nhận ra việc cần làm và bắt tay vào khá nhanh; sự chủ động ấy đôi khi khiến bạn phải nhắc mình xem xét kỹ trước khi quyết định.",
  "Bạn thường coi trọng những cam kết đã nhận và muốn hoàn thành công việc đến nơi đến chốn, kể cả khi quá trình thực hiện khó hơn dự tính.",
  "Khi tiếp xúc với một vấn đề, bạn dễ chú ý đến điều chưa hợp lý và muốn làm rõ ngay; cách nói thẳng có thể hiệu quả hơn khi đi cùng sự cân nhắc đến người nghe.",
  "Bạn có xu hướng tạo cảm giác dễ gần bằng sự điềm đạm và khả năng chăm chút những điều nhỏ trong sinh hoạt hoặc trong cách đối xử với người khác.",
  "Bạn thường tiếp cận người và việc bằng sự tò mò: thay vì kết luận ngay, bạn muốn đặt thêm câu hỏi và tìm hiểu điều còn bỏ ngỏ.",
  "Trước những vấn đề phức tạp, bạn có thể quan sát rất kỹ và đặt câu hỏi trực diện. Người mới gặp đôi khi chưa nhận ra mức độ tập trung của bạn vì bạn không luôn bộc lộ suy nghĩ ngay lập tức.",
  "Bạn dễ tìm được cách bắt đầu lại khi kế hoạch thay đổi. Trong giao tiếp, sự cởi mở thường đi cùng mong muốn tìm một phương án mà các bên còn có thể tiếp tục hợp tác.",
  "Bạn thường tạo sự tin cậy bằng cách lắng nghe và hỗ trợ một cách có trách nhiệm, nhất là khi người khác cần một lời giải thích rõ ràng hoặc một sự giúp đỡ thiết thực.",
  "Bạn có xu hướng quan sát trước khi chia sẻ quan điểm riêng. Sự kín đáo này giúp bạn nhận ra những chi tiết người khác bỏ qua, nhưng có thể khiến người mới gặp khó hiểu bạn ngay.",
  "Bạn thường chú ý đến sự tôn trọng và cách mỗi người giữ trách nhiệm của mình. Trong tập thể, bạn có thể thể hiện sự nghiêm túc ngay cả khi không muốn đứng ở vị trí nổi bật.",
  "Bạn có khả năng làm cho bầu không khí giao tiếp trở nên thoải mái và dễ chịu. Khi được chủ động sắp xếp công việc, bạn thường muốn có cả kết quả lẫn niềm vui trong quá trình thực hiện.",
  "Một nét dễ nhận thấy là sự nhất quán giữa lời nói và việc làm. Bạn có xu hướng suy nghĩ kỹ trước khi hứa và muốn người khác cũng coi trọng những thỏa thuận đã thống nhất.",
  "Khi gặp vấn đề thực tế, bạn thường tìm cách xử lý trực tiếp và linh hoạt. Việc chú ý đến chi tiết giúp bạn xoay xở tốt, dù đôi khi cũng khiến bạn muốn sửa cả những điều chưa thật sự cần thiết.",
  "Bạn thường có tiêu chuẩn riêng về cách tổ chức và trình bày một công việc. Bạn không chỉ quan tâm việc gì được làm xong, mà còn muốn kết quả có sự chỉn chu và dấu ấn cá nhân.",
  "Bạn có thể thích tự tìm cách giải quyết hơn là đi theo một hướng có sẵn. Trong giao tiếp, sự linh hoạt của bạn rõ nhất khi vẫn được giữ quyền lựa chọn và khoảng cách phù hợp.",
  "Khi đã xác định một mục tiêu quan trọng, bạn thường tập trung khá bền bỉ. Sự quyết tâm ấy có thể tạo cảm giác mạnh mẽ, nhưng bạn cũng cần khoảng trống để xem lại cách làm khi hoàn cảnh thay đổi.",
  "Bạn thường giữ nhịp làm việc tương đối ổn định và coi trọng những mối quan hệ có sự tin cậy. Sự thân thiện của bạn thường rõ hơn khi hai bên đã có thời gian hiểu nhau.",
  "Bạn có xu hướng nhận trách nhiệm khi công việc cần một người đứng ra xử lý. Thái độ quả quyết có thể là lợi thế, miễn là người khác vẫn có cơ hội trình bày cách nhìn của họ.",
  "Bạn không dễ bỏ qua những điều chưa rõ ràng và có thể dành nhiều thời gian để hiểu nguyên nhân của một thay đổi. Khi đã quyết định, cách hành động thường dứt khoát hơn vẻ ngoài ban đầu.",
  "Bạn có xu hướng tạo động lực cho người khác bằng sự nhiệt tình và niềm tin vào khả năng cải thiện tình hình. Cách bạn trình bày quan điểm thường có sức thuyết phục hơn khi đi kèm ví dụ cụ thể.",
  "Bạn thường muốn xây dựng sự tin cậy từng bước và có thể kiên trì với một công việc đòi hỏi thời gian. Người khác dễ nhận thấy ở bạn sự nghiêm túc hơn là những lời hứa vội vàng.",
  "Trong trò chuyện, bạn có xu hướng dành thời gian để nghe hết một vấn đề trước khi phản hồi. Điều này giúp bạn hiểu được nhiều góc nhìn và lựa chọn lời nói phù hợp hơn.",
  "Bạn thường quan tâm đến kết quả có thể kiểm chứng và cách sử dụng nguồn lực cho hợp lý. Khi làm việc nhóm, bạn dễ chú ý đến tính thực tế của kế hoạch.",
  "Bạn có thể giữ một khoảng cách nhất định khi mới quen và chỉ chia sẻ điều riêng tư sau khi cảm thấy đủ tin cậy. Sự điềm tĩnh bên ngoài không nhất thiết phản ánh toàn bộ suy nghĩ của bạn.",
  "Bạn thường có cách nhìn riêng và không ngại đặt câu hỏi với những thói quen đã tồn tại lâu. Sự độc lập này phát huy tốt khi được kết hợp với việc lắng nghe phản hồi thực tế.",
  "Bạn có xu hướng giữ thái độ ôn hòa khi tình huống phức tạp. Thay vì phản ứng ngay, bạn thường muốn hiểu rõ điều gì đang diễn ra rồi mới quyết định cách tham gia.",
  "Bạn thường để ý xem người khác có được hỗ trợ đầy đủ hay không và muốn giúp mọi việc tiến triển thuận lợi. Khi nhận trách nhiệm, bạn có xu hướng theo dõi cho đến khi công việc được hoàn thành.",
];

export const MOON_NAK_TEXTURE: readonly string[] = [
  "Khi có điều khiến mình bận lòng, bạn thường muốn làm ngay một việc cụ thể thay vì chờ cảm giác khó chịu tự qua đi.",
  "Những cam kết quan trọng có thể khiến bạn suy nghĩ khá lâu, bởi bạn không dễ xem nhẹ trách nhiệm đã nhận với người khác.",
  "Bạn thường muốn xác định rõ điều gì hợp lý và điều gì cần sửa; đôi khi sự rõ ràng quan trọng với bạn hơn việc giữ một câu trả lời dễ nghe.",
  "Bạn có xu hướng cảm thấy dễ chịu hơn khi môi trường xung quanh ổn định, được chăm chút và có những thói quen thân thuộc.",
  "Tâm trí bạn thường tiếp tục đặt câu hỏi ngay cả khi vấn đề đã có lời giải bước đầu, vì bạn muốn hiểu thêm những khả năng khác.",
  "Khi cảm xúc trở nên mạnh, việc nhận diện rõ nguyên nhân có thể giúp bạn xử lý chúng tốt hơn là cố làm như không có chuyện gì.",
  "Bạn dễ tìm lại sự bình tĩnh khi thấy còn cách để làm lại hoặc điều chỉnh một kế hoạch chưa thành công.",
  "Bạn có thể cảm thấy an tâm khi biết mình có thể chăm sóc và được người khác hỗ trợ qua những việc cụ thể, không chỉ bằng lời nói.",
  "Bạn thường để ý đến điều người khác chưa nói ra, nhưng cũng cần phân biệt giữa những gì mình cảm nhận và những gì đã được xác nhận.",
  "Sự tôn trọng có ý nghĩa lớn với bạn; một lời ghi nhận chân thành đôi khi quan trọng hơn những lời khen quá mức.",
  "Bạn cần những khoảng thời gian được nghỉ ngơi, tận hưởng và kết nối nhẹ nhàng để cân bằng với trách nhiệm hằng ngày.",
  "Bạn có xu hướng yên tâm hơn trong những mối quan hệ mà cả hai bên đều giữ lời và biết chia sẻ trách nhiệm.",
  "Khi phải suy nghĩ quá nhiều, một công việc cụ thể có thể giúp bạn sắp xếp lại cảm xúc và nhận ra vấn đề cần giải quyết trước.",
  "Bạn có thể nhạy với sự thiếu chỉn chu và mong muốn kết quả phản ánh đúng công sức đã bỏ ra, kể cả ở những chi tiết nhỏ.",
  "Khi thấy bị bó buộc, bạn có thể cần một khoảng thời gian riêng để xem lại mong muốn của mình trước khi trao đổi với người khác.",
  "Bạn thường muốn làm rõ điều quan trọng nhất trong một vấn đề, vì sự thiếu chắc chắn dễ chiếm nhiều sự chú ý của bạn.",
  "Bạn có thể coi trọng những mối quan hệ ổn định, trong đó sự tin cậy được xây dựng từ những việc làm lặp lại mỗi ngày.",
  "Bạn thường phản ứng mạnh hơn khi thấy người mình quan tâm bị đối xử thiếu công bằng; điều quan trọng là có thời gian suy xét trước khi hành động.",
  "Bạn có xu hướng muốn hiểu tận gốc sự thay đổi thay vì chỉ xử lý biểu hiện bên ngoài, nhất là khi sự việc liên quan đến một điều mình coi trọng.",
  "Bạn thường cảm thấy có động lực khi nhận ra một mục tiêu dài hạn có ý nghĩa, nhưng vẫn cần những bước thực hiện cụ thể để duy trì sự hứng khởi.",
  "Một môi trường có nguyên tắc rõ ràng có thể giúp bạn tập trung; khi đã tin vào mục tiêu, bạn thường sẵn sàng kiên nhẫn theo đuổi.",
  "Bạn dễ tìm thấy sự cân bằng qua việc trò chuyện chân thành, nhất là khi hai bên có đủ thời gian lắng nghe thay vì vội đưa ra kết luận.",
  "Cảm giác an toàn thường đến từ việc biết nguồn lực của mình đang được sử dụng ra sao và những kế hoạch có thể thực hiện đến đâu.",
  "Bạn có thể cần những khoảng lặng để tự xử lý cảm xúc trước khi chia sẻ, ngay cả với người mình tin tưởng.",
  "Bạn thường có nhiều suy nghĩ khác với số đông và muốn được nhìn nhận theo quan điểm riêng, không chỉ qua kỳ vọng của người khác.",
  "Bạn có xu hướng suy nghĩ kỹ trước khi nói ra điều khiến mình bận lòng; sự bình tĩnh bên ngoài không đồng nghĩa với việc bạn ít quan tâm.",
  "Bạn thường yên tâm hơn khi biết mọi việc đang được chăm sóc và từng bước hoàn tất; cảm giác có ích có thể đem lại sự ổn định tinh thần.",
];

if (LAGNA_NAK_TEXTURE.length !== 27 || MOON_NAK_TEXTURE.length !== 27) {
  throw new Error("Nakshatra overview texture must cover all 27 positions");
}

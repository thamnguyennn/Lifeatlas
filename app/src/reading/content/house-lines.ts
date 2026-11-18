// Hand-written reading atoms, part 4: SAV lines, closing summaries and headlines per house.
// Houses 6, 8 and 12 are read the other way round for SAV: fewer points means fewer troubles.

export interface SavLine { low: string; mid: string; high: string }

export const SAV_LINES: SavLine[] = [
  { low: "Nhà 1 ít điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ ít hơn, nên chuyện bản thân, thể lực và sự tự tin cần bạn xây bằng những thói quen đều đặn.",
    mid: "Nhà 1 ở mức trung bình: nền thể chất và sự tự tin của bạn đủ dùng, và sẽ tốt hơn khi bạn giữ nếp sinh hoạt đều.",
    high: "Nhà 1 nhiều điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ nhiều, nên bản thân bạn dễ giữ được sự vững vàng, và người khác cảm nhận được điều đó." },
  { low: "Nhà 2 ít điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ ít hơn, nên chuyện tiền bạc cần kế hoạch rõ ràng và bạn nên tránh chi theo cảm hứng.",
    mid: "Nhà 2 ở mức trung bình: dòng tiền và chuyện gia đình đủ ổn, và tốt hơn khi bạn có quỹ dự phòng.",
    high: "Nhà 2 nhiều điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ nhiều, nên chuyện giữ tiền và lời nói của bạn dễ có chỗ dựa." },
  { low: "Nhà 3 ít điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ ít hơn, nên chuyện kỹ năng và can đảm cần bạn tự mài, đi từng bước nhỏ.",
    mid: "Nhà 3 ở mức trung bình: sự chủ động và kỹ năng đủ dùng, và sẽ tăng khi bạn luyện đều.",
    high: "Nhà 3 nhiều điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ nhiều, nên bạn dễ bắt tay vào việc và học kỹ năng nhanh khi gặp đúng thời điểm." },
  { low: "Nhà 4 ít điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ ít hơn, nên cảm giác an toàn và nhà cửa cần bạn chủ động xây; một góc yên tĩnh riêng giúp được nhiều.",
    mid: "Nhà 4 ở mức trung bình: nền tảng gia đình và chỗ ở đủ ổn, và bình yên đến nhiều hơn khi bạn có thói quen nghỉ ngơi.",
    high: "Nhà 4 nhiều điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ nhiều, nên chỗ ở, sự bình yên và nền tảng học vấn dễ có người đỡ." },
  { low: "Nhà 5 ít điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ ít hơn, nên chuyện sáng tạo, tình cảm và con cái cần bạn kiên nhẫn hơn.",
    mid: "Nhà 5 ở mức trung bình: sáng tạo và tình cảm đủ nuôi bạn, và phát triển khi bạn dành thời gian cho sở thích.",
    high: "Nhà 5 nhiều điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ nhiều, nên chuyện sáng tạo, tình yêu và con cái dễ có cơ hội tìm đến." },
  { low: "Nhà 6 ít điểm: nợ nần, bệnh vặt và đối thủ ít có sức gây rắc rối lớn; bạn đỡ việc nặng nhưng vẫn nên giữ nhịp sống đều.",
    mid: "Nhà 6 ở mức trung bình: việc phải gánh và sức xử lý cân nhau, nên giữ thói quen khỏe là chính.",
    high: "Nhà 6 nhiều điểm: đối thủ, áp lực công việc và chuyện sức khỏe có nhiều chỗ để lộ ra, nhưng bạn cũng có nhiều sức để thắng; hãy sắp xếp việc có kỷ luật." },
  { low: "Nhà 7 ít điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ ít hơn, nên quan hệ đối tác và hôn nhân cần bạn chủ động vun đắp và nói rõ kỳ vọng.",
    mid: "Nhà 7 ở mức trung bình: các mối hợp tác đủ ổn, và bền hơn khi hai bên nói thật với nhau.",
    high: "Nhà 7 nhiều điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ nhiều, nên chuyện đồng hành và hợp tác dễ có người đỡ, và người khác dễ tin bạn." },
  { low: "Nhà 8 ít điểm: các biến cố đột ngột ít có sức lớn nên bạn thường vượt khó nhẹ nhàng hơn tưởng; vẫn nên có quỹ dự phòng.",
    mid: "Nhà 8 ở mức trung bình: thay đổi đến vừa phải và bạn đủ sức giữ thế chủ động khi có biến.",
    high: "Nhà 8 nhiều điểm: bạn có sức bền tâm lý khá tốt khi gặp nghịch cảnh, và các thay đổi lớn thường đem lại hiểu biết sâu dù đôi lúc khá dữ dội." },
  { low: "Nhà 9 ít điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ ít hơn, nên chuyện vận may và niềm tin cần bạn tự học, tự tìm thầy và kiên trì.",
    mid: "Nhà 9 ở mức trung bình: niềm tin và vận may đủ nâng đỡ, nhiều hơn khi bạn chịu học và chịu hỏi người đi trước.",
    high: "Nhà 9 nhiều điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ nhiều, nên chuyện thầy, vận may và niềm tin dễ có chỗ dựa." },
  { low: "Nhà 10 ít điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ ít hơn, nên sự nghiệp cần bạn tự mở đường và kiên nhẫn.",
    mid: "Nhà 10 ở mức trung bình: sự nghiệp đủ nền để phát triển, và tốt hơn khi bạn chọn một hướng rồi bám lâu.",
    high: "Nhà 10 nhiều điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ nhiều, nên sự nghiệp có nhiều lực đẩy khi hành tinh đi qua, và công sức của bạn dễ được ghi nhận." },
  { low: "Nhà 11 ít điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ ít hơn, nên chuyện thu nhập, bạn bè và mục tiêu cần bạn chủ động kết nối.",
    mid: "Nhà 11 ở mức trung bình: thành quả và bạn bè đủ nâng đỡ, nhiều hơn khi bạn chủ động kết nối.",
    high: "Nhà 11 nhiều điểm hỗ trợ: các hành tinh đi qua nhà này được nâng đỡ nhiều, nên thu nhập, bạn bè và mục tiêu dài hạn dễ có lực nâng đỡ." },
  { low: "Nhà 12 ít điểm: hao tốn, mất ngủ hay cảm giác cô lập khó có đủ sức gây hại, bạn dễ sống giản dị và thích nghi.",
    mid: "Nhà 12 ở mức trung bình: chi tiêu và thời gian một mình ở mức cân bằng; nên giữ giấc ngủ đều.",
    high: "Nhà 12 nhiều điểm: dễ có hao tốn, những lần xa nhà hoặc cần ở một mình khá lâu; nên đặt giới hạn chi tiêu và giữ giấc ngủ." },
];

export interface Advice { good: string; mixed: string; hard: string }


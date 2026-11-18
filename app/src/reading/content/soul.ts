// Hand-written reading atoms, part 10: the Jaimini soul layer (Atmakaraka and Karakamsa).

import type { GrahaId } from "../../engine/constants.ts";

export const SOUL_INTRO =
  "Jaimini là một hệ đọc lá số trong Jyotish, có cách riêng để tìm chủ đề sâu nhất của mỗi người. Cách làm là xem trong bảy hành tinh từ Mặt Trời đến Sao Thổ, hành tinh nào đã đi xa nhất trong cung của nó (tính bằng độ). Hành tinh đi xa nhất được gọi là Atmakaraka, nghĩa là “người mang linh hồn”, và mình gọi gọn là hành tinh dẫn đường của bạn. Nó cho thấy bài học lớn nhất bạn đến để học, và cũng là chỗ bạn hay bị thử thách nhiều nhất vì nó đòi hỏi nhiều nhất. Cung nó đứng trong lá số phụ D9 (một lá số chi tiết hơn, chia mỗi cung thành 9 phần nhỏ) được gọi là Karakamsa: nơi linh hồn bạn muốn thể hiện điều đó ra ngoài đời.";

export interface SoulPlanet { title: string; lesson: string; ask: string }

export const AK_PLANET: Partial<Record<GrahaId, SoulPlanet>> = {
  sun: {
    title: "Mặt Trời: học đứng vững trong chính mình",
    lesson: "Hành tinh dẫn đường của bạn là Mặt Trời, nên bài học lớn nhất xoay quanh việc là chính mình mà không cần ai cho phép. Bạn có một nhu cầu sâu là được tôn trọng như người có giá trị riêng, và chuyện với cha hoặc người có quyền thường là nơi bài học này lộ ra. Khi bạn đã đứng vững, bạn tỏa sáng mà không cần tiếng vỗ tay. Khi chưa, bạn dễ phụ thuộc vào cách người ta nhìn mình.",
    ask: "Bạn sẽ là ai nếu không ai nhìn?",
  },
  moon: {
    title: "Mặt Trăng: học về cảm xúc và sự gắn bó",
    lesson: "Hành tinh dẫn đường của bạn là Mặt Trăng, nên bài học lớn nhất đi qua cảm xúc và những mối gắn bó. Bạn nhạy, dễ thấm tâm trạng của người khác, và hay lớn lên qua những mối quan hệ chạm vào chỗ yếu nhất của mình. Mẹ, người chăm sóc và cảm giác được thuộc về là những chủ đề lặp lại. Khi bạn giữ được lòng mình ổn định mà vẫn mở, bạn trở thành chỗ nương thật sự cho người khác.",
    ask: "Có cảm giác nào bạn mang từ nhỏ mà chưa từng gọi tên?",
  },
  mars: {
    title: "Sao Hỏa: học về can đảm và cơn giận",
    lesson: "Hành tinh dẫn đường của bạn là Sao Hỏa, nên bài học lớn nhất xoay quanh hành động, can đảm và cách dùng sức mạnh. Bạn có một sức bật cần lối ra, như thể thao, đứng lên vì điều đúng, bảo vệ người yếu hơn. Cơn giận và sự sốt ruột chính là người thầy của bạn, vì chúng chỉ ra điều gì đang bị cản. Khi đã học được, bạn mạnh mà không làm ai tổn thương.",
    ask: "Điều gì bạn sẽ bảo vệ dù phải trả giá?",
  },
  mercury: {
    title: "Sao Thủy: học về trí óc và lời nói",
    lesson: "Hành tinh dẫn đường của bạn là Sao Thủy, nên bài học lớn nhất đi qua trí óc, lời nói và cách bạn hiểu thế giới. Bạn học nhanh, giỏi nối các ý với nhau, và hay bị chính đầu óc mình làm mệt. Bài học là biết điều gì đáng nói, điều gì nên bỏ, và dùng sự thông minh để giúp người thay vì chỉ để thắng một cuộc tranh luận.",
    ask: "Điều bạn biết rõ nhất đang giúp được ai?",
  },
  jupiter: {
    title: "Sao Mộc: học về niềm tin và sự khôn ngoan",
    lesson: "Hành tinh dẫn đường của bạn là Sao Mộc, nên bài học lớn nhất xoay quanh niềm tin, lẽ sống và việc truyền lại điều mình hiểu. Bạn hay tìm ý nghĩa trong mọi việc, nên hợp với dạy học, cố vấn hay chữa lành. Bài học là sống đúng điều mình tin, và khiêm tốn khi nhớ rằng điều mình hiểu chỉ là một góc của bức tranh.",
    ask: "Điều bạn tin nhất đã được thử bằng việc làm nào?",
  },
  venus: {
    title: "Sao Kim: học về tình yêu và giá trị",
    lesson: "Hành tinh dẫn đường của bạn là Sao Kim, nên bài học lớn nhất đi qua tình yêu, cái đẹp và việc biết mình đáng giá. Quan hệ, tiền bạc và thẩm mỹ là nơi bạn học. Bài học là yêu mà vẫn giữ được mình, hưởng thụ mà không trốn việc, và tự đặt giá trị cho mình mà không cần người khác xác nhận.",
    ask: "Điều gì khiến bạn thấy mình đáng được yêu, kể cả khi bạn không làm gì cả?",
  },
  saturn: {
    title: "Sao Thổ: học về kỷ luật và sự chịu đựng",
    lesson: "Hành tinh dẫn đường của bạn là Sao Thổ, nên bài học lớn nhất xoay quanh trách nhiệm, thời gian và sự kiên nhẫn. Bạn thường lớn sớm, gánh nhiều, và thấy thành quả đến chậm. Bài học là xây thứ bền mà không đánh mất sự mềm mại, và để người khác chia phần gánh với mình.",
    ask: "Điều bạn đang gánh mà thật ra có thể đặt xuống là gì?",
  },
};

/** Names of the seven chara karakas, for the reference table. */
export const KARAKA_ROLE: Record<string, { sa: string; vi: string }> = {
  AK: { sa: "Atmakaraka", vi: "linh hồn, bài học lớn nhất" },
  AmK: { sa: "Amatyakaraka", vi: "người cố vấn, nghề nghiệp" },
  BK: { sa: "Bhratrikaraka", vi: "anh chị em, việc tự tay làm" },
  MK: { sa: "Matrikaraka", vi: "mẹ, nơi chốn" },
  PK: { sa: "Putrakaraka", vi: "con cái, sáng tạo" },
  GK: { sa: "Gnatikaraka", vi: "đối thủ, bà con" },
  DK: { sa: "Darakaraka", vi: "bạn đời, đối tác" },
};

/** Index = house of the Atmakaraka minus 1. Each line says in plain words what the house is about. */
export const AK_HOUSE: string[] = [
  "Hành tinh dẫn đường đứng ở nhà 1 (chính con người bạn), nên bài học đi thẳng vào việc bạn là ai và xuất hiện trước người khác thế nào. Bạn lớn lên khi dám sống đúng với mình.",
  "Hành tinh dẫn đường đứng ở nhà 2 (tiền bạc, lời nói, gia đình gốc), nên bài học diễn ra quanh chuyện bạn tự định giá mình ra sao và dùng giọng nói của mình thế nào. Bạn lớn lên ở những chỗ đó.",
  "Hành tinh dẫn đường đứng ở nhà 3 (việc tự tay làm, kỹ năng, anh chị em), nên bài học diễn ra qua việc bạn dám bắt tay vào làm, qua kỹ năng, cách giao tiếp và quan hệ với anh chị em. Bạn lớn lên khi dám hành động.",
  "Hành tinh dẫn đường đứng ở nhà 4 (nhà cửa, mẹ, sự bình yên trong lòng), nên bài học diễn ra ở nhà, ở mẹ và ở cảm giác yên ổn trong lòng. Cảm giác thuộc về là thứ bạn tự tay vun đắp nên.",
  "Hành tinh dẫn đường đứng ở nhà 5 (sáng tạo, tình yêu, con cái), nên bài học diễn ra qua việc bạn dám tạo ra điều gì đó, qua tình yêu và con cái. Bạn lớn lên bằng những gì bạn gieo.",
  "Hành tinh dẫn đường đứng ở nhà 6 (công việc hằng ngày, sức khỏe), nên bài học diễn ra trong việc hằng ngày, sức khỏe, nợ nần và những lần phải cạnh tranh. Bạn lớn lên qua sự đều đặn và kỷ luật.",
  "Hành tinh dẫn đường đứng ở nhà 7 (bạn đời, đối tác), nên bài học diễn ra qua người đứng đối diện bạn. Quan hệ là tấm gương rõ nhất của bạn, và bạn lớn lên qua cách người kia phản hồi.",
  "Hành tinh dẫn đường đứng ở nhà 8 (biến cố, mất mát, điều ẩn sâu), nên bài học diễn ra qua mất mát, thay đổi lớn và những điều khó nói. Bạn lớn lên mỗi lần chịu để một thứ cũ đi.",
  "Hành tinh dẫn đường đứng ở nhà 9 (niềm tin, người thầy, chuyến đi xa), nên bài học diễn ra qua việc bạn tìm ra điều mình tin, qua người thầy, qua cha và những chuyến đi xa. Bạn lớn lên khi biết mình tin vào điều gì.",
  "Hành tinh dẫn đường đứng ở nhà 10 (công việc, vị thế), nên bài học diễn ra qua công việc và vị thế của bạn. Bạn lớn lên khi dám chịu trách nhiệm với điều mình làm trước mặt người khác.",
  "Hành tinh dẫn đường đứng ở nhà 11 (bạn bè, cộng đồng, mục tiêu dài hạn), nên bài học diễn ra qua bạn bè, cộng đồng và mục tiêu dài hạn. Bạn lớn lên khi biết mình thuộc về ai.",
  "Hành tinh dẫn đường đứng ở nhà 12 (những lúc ở một mình, giấc mơ, sự buông bỏ), nên bài học diễn ra trong yên tĩnh, trong giấc mơ và trong việc học buông. Bạn lớn lên khi dám ở một mình với chính mình.",
];

/** Index = Karakamsa sign (0 = Bạch Dương). Each line is a full sentence. */
export const KARAKAMSA_SIGN: string[] = [
  "Trong lá số phụ D9, hành tinh dẫn đường của bạn đứng ở Bạch Dương, nên nơi bạn muốn thể hiện điều sâu nhất là con đường tự mở: bạn dám đi trước và chịu trách nhiệm cho lựa chọn của mình.",
  "Trong lá số phụ D9, hành tinh dẫn đường của bạn đứng ở Kim Ngưu, nên nơi bạn muốn thể hiện điều sâu nhất là sự bền, vẻ đẹp và đủ đầy: những thứ chạm được mà bạn tạo ra bằng sự kiên nhẫn.",
  "Trong lá số phụ D9, hành tinh dẫn đường của bạn đứng ở Song Tử, nên nơi bạn muốn thể hiện điều sâu nhất là lời nói, tri thức và kết nối: bạn nối người với người và ý với ý.",
  "Trong lá số phụ D9, hành tinh dẫn đường của bạn đứng ở Cự Giải, nên nơi bạn muốn thể hiện điều sâu nhất là sự nuôi dưỡng: bạn chăm sóc người khác và tạo ra một mái ấm, một chỗ nương.",
  "Trong lá số phụ D9, hành tinh dẫn đường của bạn đứng ở Sư Tử, nên nơi bạn muốn thể hiện điều sâu nhất là sự tỏa sáng và dẫn dắt: bạn là một trái tim ấm để người khác đi theo.",
  "Trong lá số phụ D9, hành tinh dẫn đường của bạn đứng ở Xử Nữ, nên nơi bạn muốn thể hiện điều sâu nhất là sự phục vụ tinh tế: bạn làm cho mọi thứ tốt lên bằng những việc cụ thể.",
  "Trong lá số phụ D9, hành tinh dẫn đường của bạn đứng ở Thiên Bình, nên nơi bạn muốn thể hiện điều sâu nhất là sự hài hòa và công bằng: bạn nối và cân bằng các phía với nhau.",
  "Trong lá số phụ D9, hành tinh dẫn đường của bạn đứng ở Thiên Yết, nên nơi bạn muốn thể hiện điều sâu nhất là chiều sâu và sự thay đổi từ gốc: bạn bước vào điều người ta né để làm nó trong sáng hơn.",
  "Trong lá số phụ D9, hành tinh dẫn đường của bạn đứng ở Nhân Mã, nên nơi bạn muốn thể hiện điều sâu nhất là sự thật và ý nghĩa: bạn dạy, hướng dẫn hoặc đi xa để tìm điều đáng tin.",
  "Trong lá số phụ D9, hành tinh dẫn đường của bạn đứng ở Ma Kết, nên nơi bạn muốn thể hiện điều sâu nhất là sự xây dựng bền vững: bạn gánh trách nhiệm và để lại thứ đứng được lâu.",
  "Trong lá số phụ D9, hành tinh dẫn đường của bạn đứng ở Bảo Bình, nên nơi bạn muốn thể hiện điều sâu nhất là việc phục vụ số đông bằng ý tưởng mới: bạn làm điều khác biệt vì lợi ích chung.",
  "Trong lá số phụ D9, hành tinh dẫn đường của bạn đứng ở Song Ngư, nên nơi bạn muốn thể hiện điều sâu nhất là lòng từ bi và sự buông bỏ nhẹ nhàng: bạn chữa lành, sáng tạo hoặc dẫn người khác về phía yên tĩnh.",
];

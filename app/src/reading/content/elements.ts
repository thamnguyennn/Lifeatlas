// The four elements, said as everyday life (v4.3). Counted over the seven planets and the rising sign (eight points, two on average).
// MANY: the element leads the chart. NONE: the element is missing. FEW: only one point, said only when it stands out against the rest.
// Each text says what it looks like in a day, what it costs, and what helps — no "this element decides nothing".
import type { Element } from "./overview.ts";

export const EL_MANY: Record<Element, string> = {
  fire: "Lửa nhiều nên bạn có sẵn động lực: thấy việc là muốn bắt tay vào, dám làm trước khi chắc chắn, và thường là người kéo cả nhóm đi. Bạn mệt nhất khi phải chờ đợi hoặc làm mãi một việc không thấy tiến triển. Điều cần giữ là nhịp: bạn khởi đầu nhiều hơn hoàn thành, nên một người kỹ tính bên cạnh hay một lịch làm việc rõ ràng giúp bạn đi được tới cùng.",
  earth: "Đất nhiều nên bạn là người thực tế: tin vào cái làm ra được, tính trước rồi mới bước, giữ tiền và giữ nếp sinh hoạt khá tốt. Người khác thấy bạn đáng tin vì nói là làm. Điều cần giữ là sự cứng: bạn dễ bám vào cách cũ, và đôi khi lo an toàn quá mà để vuột một cơ hội cần quyết nhanh.",
  air: "Khí nhiều nên bạn sống nhiều bằng đầu óc: thích trao đổi, học nhanh, kết nối dễ, và thường hiểu một chuyện rõ nhất sau khi nói nó thành lời. Bạn dễ chán khi không có gì mới để nghĩ. Điều cần giữ là khoảng cách giữa nghĩ và làm: ý tưởng thì nhiều, nhưng cần một mốc cụ thể để biến nó thành việc.",
  water: "Nước nhiều nên bạn sống nhiều bằng cảm nhận: đọc được không khí trong phòng, đoán được người khác đang buồn hay vui, và thường hiểu một người trước khi họ kịp nói. Điều cần giữ là ranh giới: bạn dễ mang tâm trạng của người khác về nhà, nên cần những khoảng ở một mình để lòng lắng lại.",
};

export const EL_NONE: Record<Element, string> = {
  fire: "Lá số của bạn gần như không có Lửa. Ngoài đời, điều này thường hiện ra thành chuyện khó tự khởi động: bạn biết mình nên làm gì, nhưng để bắt đầu thì cần một cú hích, như một hạn chót, một người rủ hay một người tin mình. Vì vậy bạn làm tốt nhất khi có người đồng hành thúc đẩy, hoặc khi tự chia việc thành những mốc nhỏ để thấy mình đang tiến lên. Đừng chờ có hứng mới làm; với bạn, làm trước thì hứng mới đến.",
  earth: "Lá số của bạn gần như không có Đất. Bạn có ý tưởng và cảm hứng, nhưng phần biến chúng thành việc cụ thể, như lên kế hoạch, giữ tiền, giữ giờ giấc, lại là phần bạn thấy mệt nhất. Điều này hay lộ ra ở chuyện chi tiêu theo cảm xúc hoặc bỏ dở việc khi hết hứng. Bạn cần một cái khung: lịch cố định, vài thói quen nhỏ lặp lại mỗi ngày, hoặc một người thực tế để cùng tính toán.",
  air: "Lá số của bạn gần như không có Khí. Bạn hiểu mọi chuyện bằng cảm nhận và trải nghiệm hơn là bằng lý lẽ, nên đôi khi khó nói ra điều mình nghĩ, hoặc ngại tranh luận dù trong lòng không đồng ý. Người khác có thể hiểu lầm bạn chỉ vì bạn chưa nói. Viết ra trước khi nói, hoặc có một người bạn biết lắng nghe để trao đổi, sẽ giúp bạn rất nhiều; trước một quyết định lớn, hãy lùi lại một bước để nhìn nó khách quan hơn.",
  water: "Lá số của bạn gần như không có Nước. Bạn xử lý chuyện bằng lý trí và hành động nhiều hơn cảm xúc, nên lúc có biến bạn thường bình tĩnh và làm được việc. Mặt trái là bạn dễ bỏ qua cảm xúc của chính mình và của người khác; người thân có thể thấy bạn hơi xa cách dù bạn thật lòng quan tâm. Tập hỏi “mình đang thấy thế nào” và nói lời quan tâm thành tiếng sẽ làm các mối quan hệ của bạn ấm hơn nhiều.",
};

export const EL_FEW: Record<Element, string> = {
  fire: "Lửa trong lá số khá mỏng, nên động lực của bạn không tự bùng lên: bạn cần một lý do rõ ràng, một mục tiêu hoặc một người cùng làm thì mới vào guồng.",
  earth: "Đất trong lá số khá mỏng, nên sự đều đặn là thứ bạn phải tự dựng: kế hoạch chi tiêu và giờ giấc cố định giúp bạn nhiều hơn bạn nghĩ.",
  air: "Khí trong lá số khá mỏng, nên bạn hay giữ suy nghĩ trong đầu; nói ra sớm hơn một chút sẽ giúp người khác hiểu bạn đúng hơn.",
  water: "Nước trong lá số khá mỏng, nên cảm xúc của bạn hay đi qua lý trí trước khi được nói ra; người thân đôi khi cần nghe bạn nói thẳng là bạn quan tâm.",
};

export const EL_EVEN =
  "Bốn nguyên tố trong lá số của bạn chia khá đều, không cái nào lấn át. Nhờ vậy bạn linh hoạt: lúc cần thì hành động nhanh, lúc cần thì tính kỹ, nói chuyện được với nhiều kiểu người. Mặt trái là bạn đôi khi khó nhận ra mình mạnh nhất ở đâu, nên dễ dàn sức ra nhiều hướng; chọn một hai việc chính để dồn tâm sức sẽ giúp bạn đi xa hơn.";

/** One short clause for the closing picture, when an element is missing. */
export const EL_NONE_SHORT: Record<Element, string> = {
  fire: "bạn làm tốt nhất khi có người hoặc một mục tiêu rõ ràng thúc mình đi",
  earth: "bạn cần một cái khung đều đặn để ý tưởng thành việc",
  air: "bạn nên nói ra điều mình nghĩ sớm hơn một chút",
  water: "bạn nên cho phép mình nói ra cảm xúc nhiều hơn",
};

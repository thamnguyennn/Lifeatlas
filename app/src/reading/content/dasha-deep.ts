// Hand-written reading atoms, part 14: how the five levels of the dasha are read, one against the next.
// Voice: a friend explaining seasons. A big season holds smaller seasons, and each one has its own weather.

/** How the lord of a smaller period stands to the lord of the period that holds it. {a} holds, {b} is held, {d} the house count. */
export const PAIR_TONE = {
  same: "{a} và {b} cùng ngồi ở nhà {h}, nên hai bên làm một việc chung và chuyện của nhà {h} đang rất đậm.",
  good: "Tính từ chỗ {a} đang đứng, {b} nằm ở vị trí thứ {d}, một vị trí hợp, nên hai bên ăn khớp: việc này mở ra thì việc kia được đỡ.",
  mixed: "Tính từ chỗ {a} đang đứng, {b} nằm ở vị trí thứ {d}, khá gần, nên mỗi bên làm việc riêng nhưng vẫn biết nhau.",
  hard: "Tính từ chỗ {a} đang đứng, {b} nằm ở vị trí thứ {d}, một vị trí khó, nên hai bên hay kéo nhau về hai hướng. Giai đoạn này cần kiên nhẫn hơn bình thường.",
};

export const PAIR_FRIEND = {
  friend: "{b} vốn thân với {a}, nên chuyện của hai bên dễ nói chuyện với nhau.",
  enemy: "{b} vốn không thân với {a}, nên chuyện của hai bên dễ lệch nhịp.",
  neutral: "{b} và {a} không thân cũng không thù, nên kết quả còn tùy vào phần còn lại của lá số.",
};

/** One period, read for a lord that rules houses. {p} lord, {rules} "nhà 3 và nhà 10", {pos} house where it sits. */
export const PERIOD_RULES =
  "{p} cai quản {rules}, và đang ngồi ở nhà {pos} ({posTag}). Vì vậy trong giai đoạn này, {them} hiện ra qua chuyện {posTag}.";
export const PERIOD_RULES_HOME =
  "{p} cai quản {rules}, và đang ngồi ngay trong nhà {pos} của mình. Vì vậy trong giai đoạn này, chuyện {posTag} là chuyện đậm nhất.";
export const PERIOD_NODE =
  "{p} không cai quản nhà nào, nên mình đọc nó qua {ref}, hành tinh cai quản cung nó đang đứng. {ref} cai quản {refRules}, còn {p} đang ngồi ở nhà {pos}. Vì vậy trong giai đoạn này, chuyện {posTag} đi trước, rồi đến chuyện {others}.";
export const PERIOD_NODE_ONE =
  "{p} không cai quản nhà nào, nên mình đọc nó qua {ref}, hành tinh cai quản cung nó đang đứng. {ref} cai quản {refRules}, và {p} cũng đang ngồi ở nhà {pos}. Vì vậy trong giai đoạn này, chuyện {posTag} là chuyện đậm nhất.";

/** A period whose lord is the same planet as the period that holds it: the planet is simply counted twice. */
export const PERIOD_SELF = {
  two: "Giai đoạn nhỏ này cùng hành tinh với giai đoạn lớn chứa nó, nên những điều đã nói ở trên được nhấn đậm: đây là phần cốt lõi của cả giai đoạn lớn.",
  deeper: "Bậc này cùng tên với bậc chứa nó, nên chủ đề của hành tinh này được nhấn đậm thêm một lần.",
};

export const PERIOD_CLAUSE: Record<2 | 3 | 4 | 5, string> = {
  2: "Trong giai đoạn nhỏ này, {clause}.",
  3: "Trong chặng này, {clause}.",
  4: "Trong nhịp này, {clause}.",
  5: "Trong nhịp ngắn nhất này, {clause}.",
};

export const LADDER_INTRO =
  "Đại vận chia đời thành những giai đoạn lớn. Mỗi giai đoạn lớn chứa các giai đoạn nhỏ (tiểu vận), mỗi giai đoạn nhỏ chứa các chặng, và cứ thế đi xuống năm bậc. Càng xuống thấp, mốc thời gian càng nhạy với giờ sinh, nên mỗi bậc được gắn một nhãn cho biết bạn có thể tin nó đến đâu.";

export const TRUST_NOTE: Record<"chắc" | "gần đúng" | "chỉ tham khảo", string> = {
  chắc: "Bậc này chắc: dù giờ sinh lệch trong khoảng bạn cho phép, người dẫn đường của giai đoạn vẫn là cùng một hành tinh.",
  "gần đúng": "Bậc này gần đúng: người dẫn đường có thể đổi sang hành tinh kế bên nếu giờ sinh lệch, và mốc ngày có thể trượt vài ngày.",
  "chỉ tham khảo": "Bậc này chỉ để tham khảo: chỉ cần giờ sinh lệch vài phút là người dẫn đường đã khác, nên đừng dựa vào nó để quyết định chuyện gì.",
};

export const TRUST_SUMMARY = {
  exact: "Bạn nhập giờ sinh chính xác, nên các bậc đầu rất chắc chắn và các bậc sâu hơn dần chỉ còn mang tính tham khảo.",
  canh: "Bạn chỉ biết canh giờ sinh, nên các bậc đầu vẫn chắc nhưng các bậc nhỏ hơn có thể lệch. Nếu có giờ phút chính xác, bài đọc sẽ chắc hơn nhiều.",
  unknown: "Chưa có giờ sinh, nên chỉ bậc đầu (đại vận) là tạm tin được và các bậc nhỏ hơn chỉ để tham khảo.",
};

/** When two or more of the sources light the same house: the running periods and a slow planet passing through. */
export const OVERLAP =
  "Nhà {n} ({tag}) vừa được {who} bật sáng, vừa có {planet} đang đi qua. Đây là chỗ chuyện của bạn nóng nhất lúc này: {effect}";

export const OVERLAP_EFFECT: Record<"saturn" | "jupiter" | "rahu" | "ketu", string> = {
  saturn: "việc gì làm chắc sẽ đứng vững, việc gì làm qua loa sẽ lộ ra.",
  jupiter: "cơ hội và người giúp đang đến; hãy gieo khi đất còn mềm.",
  rahu: "mọi thứ bị phóng lớn lên, cả điều tốt lẫn điều dễ làm quá.",
  ketu: "bạn dễ thấy muốn buông, và có điều đang rút bớt để nhường chỗ cho điều khác.",
};

/** The same finding as one clause of today's message. */
export const OVERLAP_TODAY =
  "Nhà {n} ({tag}) đang được chạm từ hai phía: {who} bật sáng nó, còn {planet} đang đi qua nó, nên {effect}";

export const OVERLAP_NONE =
  "Lúc này các giai đoạn đang chạy và các hành tinh chậm đang đi qua không chồng lên cùng một nhà, nên không có một mảng nào bị dồn quá nhiều. Cuộc sống của bạn đang được kéo bởi nhiều việc nhỏ hơn là một việc lớn.";

export const BLEND_HEAD =
  "Gộp các bậc lại: giai đoạn hiện tại của bạn là “{maha}” (đến {mahaTo}), giai đoạn nhỏ thuộc {antar} (đến {antarTo}){prat}.";
export const BLEND_PRAT = ", và chặng thuộc {prat} (đến {pratTo})";

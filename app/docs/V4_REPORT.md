# Life Atlas v4: báo cáo thay đổi

## Đã thêm
- Lựa chọn thứ 6 cho sai số giờ sinh: "Không rõ giờ sinh chính xác" (cửa sổ ±120 phút). Độ ổn định được tính bằng cách lấy mẫu dày trong toàn bộ cửa sổ (tối đa 81 lần dựng lá số), không dùng ngưỡng phút cố định. Nếu cung mọc có thể đổi, đầu bài đọc có cảnh báo.
- Bộ máy 12 nhà mới (`reading/house4.ts`). Mỗi bằng chứng (chủ nhà, phẩm vị, hành tinh trong nhà, góc chiếu, Bhava Bala, SAV, karaka, yoga) là một trọng số có dấu và một câu nghĩa. Bài luận gồm nhận định trung tâm, các nhóm luận điểm, đoạn giải thích khi bằng chứng trái chiều, và mô tả biểu hiện thực tế. Toàn bộ bằng chứng nằm trong "Vì sao mình nói điều này?".
- Dự báo 2027 mới (`reading/forecast.ts`):
  - Lịch thiên văn thật được tính chính xác đến khoảng 10 phút, gồm đổi cung, nghịch hành và đi thẳng, nhật thực và nguyệt thực, chạm điểm gốc, đổi đại vận hoặc tiểu vận trong tháng, và những ngày Mặt Trăng qua cung thứ 8 tính từ Mặt Trăng gốc.
  - Gochara tính từ cung mọc và từ Mặt Trăng, có BAV và Vedha.
  - Mỗi tháng có nhận định trung tâm, 1–3 lĩnh vực, các mốc trong tháng và phần so với tháng trước. Người đọc chọn tháng bằng tab.
- Khám phá thêm (`reading/explore.ts`, `reading/compat.ts`) có 12 chức năng thật, mở từ một trang chủ đề tương tác:
  - Năng khiếu được phân tích theo 6 năng lực.
  - Nghề nghiệp gồm xu hướng làm việc, vai trò, nhóm nghề, môi trường, khó khăn và hướng nghề thay thế.
  - Tiền bạc gồm 4 mặt; lãnh đạo gồm 4 mặt; học tập có phương pháp học phù hợp.
  - Sức khỏe không đưa ra chẩn đoán.
  - Gia đình, Dharma, mâu thuẫn nội tâm chỉ nêu những giằng co có căn cứ trong lá số.
  - Phong cách yêu và hôn nhân không dự đoán ly hôn hay thời điểm.
  - Hòa hợp hai lá số dùng Ashtakoota cùng các mặt giao tiếp, giá trị, sức hút và cam kết.
- Giao diện:
  - Lớp thiết kế mới với bảng màu xanh đen và vàng champagne, có điểm nhấn đồng nhạt và tím nhạt.
  - Mỗi trang có khối "nhận định trung tâm"; hiệu ứng chuyển cảnh và hover; hỗ trợ `prefers-reduced-motion`.
  - Trên điện thoại: vùng chạm từ 44px, tab tháng gọn, không tràn ngang.

## Đã viết lại
- Câu mở đầu: không còn khung "Lá số của bạn cho thấy bạn là người …" thay tên cung. Câu được dựng từ hai dấu ấn nổi bật nhất (hành tinh trụ cột, nguyên tố trội, vùng tập trung, vị trí chủ cung mọc, độ lệch cung mọc–Mặt Trăng, Mặt Trăng nhạy) và quan hệ giữa chúng.
- Tổng quan:
  - Bỏ khối "Ba điểm gốc đặt cạnh nhau"; quan hệ Mặt Trời–Mặt Trăng được phân tích theo độ số và vị trí, lồng vào phần Mặt Trăng.
  - Bốn nguyên tố không còn suy diễn "thiếu là kém", và các con số chuyển xuống phần kỹ thuật.
  - Chu kỳ trăng xét Paksha Bala cùng các yếu tố bù.
  - Hành tinh trụ cột tách sức mạnh khỏi tính thuận lợi.
  - Đổi tên mục thành "Những lĩnh vực nổi bật trong lá số".
- Rahu–Ketu: viết lại phần mở đầu, bỏ cách nói tiền kiếp như sự thật; văn xuôi không còn số nhà; có liên hệ với đại vận và Rahu/Ketu đang chuyển vận.
- D-chart: mỗi biểu đồ mở bằng một nhận định đối chiếu D1 với lá số chia. Độ ổn định có ba mức: cấu trúc ổn định, cần thận trọng, chưa đủ dữ liệu.
- Đại vận:
  - Mỗi đại vận đọc qua 4 lớp: chủ đề bao trùm, điều kiện thuận, yếu tố trái chiều, các lĩnh vực liên kết. Văn xuôi không có số nhà.
  - Tiểu vận đọc qua quan hệ với chủ đại vận, những mảng cả hai cùng chạm và điều mới so với bối cảnh đại vận.
  - Có thẻ hiển thị đại vận và tiểu vận hiện tại kèm ngày.

## Đã loại bỏ
- Trang "Bạn đang ở đâu" và Gochara trong chương đại vận (Gochara nay nằm ở Dự báo 2027).
- Mục "Khi nào từng khía cạnh được đánh thức" trong chương đại vận.
- Các cụm "lên tiếng", "nền vững/nền mỏng", "chỗ mạnh nhất/chỗ cần chăm", "pha trộn" (linter chặn các cụm này).
- Các lớp gập dạng giáo trình trong trang nhà (cung, chủ nhà, Shadbala, SAV…), thay bằng danh sách bằng chứng thực sự được dùng.
- `housenarr.ts`, `deep.ts` và các test, lint cũ.

## Chưa làm được / hạn chế (nêu rõ)
- **Giọng thuyết minh nam trầm tự nhiên chưa có.** Môi trường này không có công cụ tạo giọng nói chất lượng cao: dịch vụ TTS bên ngoài bị chặn mạng, và giọng máy cục bộ nghe như robot. Đoạn phim hiện:
  - phát file `public/voiceover.mp3` nếu có (lời đọc nằm trong `VOICE_LINES`);
  - nếu không có file, chỉ dùng giọng tiếng Việt "tự nhiên" (neural/online) của trình duyệt nếu thiết bị có;
  - nếu không có giọng tự nhiên, chạy phụ đề cùng nhạc nền và hiệu ứng tổng hợp bằng Web Audio, đồng bộ theo cảnh và tự hạ nhạc khi có lời.
  Cần một bản thu thật (hoặc file từ dịch vụ TTS bạn chọn) để đạt yêu cầu này.
- **Ashtakoota:** Yoni và Vashya được chấm gọn; sáu koota còn lại theo bảng cổ điển.
- **Mức Vedha:** tính theo bảng Phaladeepika, gồm cả Rahu/Ketu theo Sao Thổ (một số trường phái không tính các điểm nút).
- **Sức khỏe:** chỉ đọc biểu tượng truyền thống, không chẩn đoán.

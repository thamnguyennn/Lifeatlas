# Life Atlas v3.x — báo cáo thay đổi

## Đã bỏ
- Dải 9 vị thần, "ba điều bạn nhớ", các khối "chín nhân vật".
- Trang chủ: đoạn "Cho mình ngày, giờ và nơi bạn sinh…", nút xem lá số mẫu, thẻ "Jyotish trong vài câu".
- Đại vận khỏi các trang 12 nhà. Phần "turn" cuối mỗi nhà.
- Các trang Jaimini (Atmakaraka/Karakamsa, "Linh hồn", các thẻ karaka), "Điểm chung" tách riêng.
- Trang "Bầu trời hiện tại" và "Lời nhắn tháng này" (Gochara nay nằm cuối trang "Bạn đang ở đâu").

## Viết lại
- Trang chủ: vào thẳng form; lời tự sự rút gọn xuống cuối trang (thu gọn).
- Mở lá số: "Gửi …," và đúng một câu, dựng từ quan hệ nguyên tố của cung mọc và Mặt Trăng, không dùng câu mẫu chung.
- Tổng quan: cung mọc, Mặt Trời, Mặt Trăng, ba điểm gốc, Bốn nguyên tố, Chu kỳ trăng, Hành tinh trụ cột, "Nơi cuộc đời bạn xoay quanh".
- 12 nhà: quy trình 5 bước, 8 hướng kể chọn theo dữ kiện, yoga lồng vào nhà, thông số trong "Vì sao mình nói điều này?".
- Bài học kiếp này: Rahu/Ketu theo khung 12 yếu tố, thông số ẩn.
- Biểu đồ chuyên sâu: D2, D3, D4, D7, D9, D10, mỗi biểu đồ có sơ đồ hình thoi và ba phần (nhìn chung, điểm nổi bật, độ chắc).
- Đại vận: sáu lớp; tiểu vận đọc qua quan hệ với chủ đại vận, không giải thích lại các nhà.

## Nâng cấp / mới
- Form: "Sai số giờ sinh có thể có" (±1/±5/±15/±30/>30 phút) đi vào độ chắc của đại vận và của các biểu đồ chia.
- Video mở đầu: giọng đọc (Web Speech, ưu tiên giọng nam trầm; có thể thả `voiceover.mp3`) và hiệu ứng âm thanh theo cảnh.
- Dự đoán 2027: lịch bầu trời thật (đổi cung, đổi chiều, chạm điểm lá số) + D1 + Vimshottari, 12 tháng.
- Khám phá thêm: 3 nhóm, 11 chủ đề + So sánh hai lá số (Ashtakoota 36 điểm).
- `scripts/quality-check.ts` (12 lá số: câu trùng, mở đầu nhà, cụm bị cấm, không giờ), `scripts/smoke.cjs` (trình duyệt, mobile).

## Giới hạn cần biết
- Giọng đọc phụ thuộc giọng tiếng Việt có sẵn trên thiết bị; nếu không có, trang báo và chạy phụ đề + âm thanh. Muốn giọng nam trầm đúng ý, hãy thu hoặc tạo file `public/voiceover.mp3` theo `VOICE_LINES`.
- Yoni và Vashya trong Ashtakoota chấm gọn; sáu koota còn lại theo bảng cổ điển.
- Không có giờ sinh: không đọc nhà, D-chart, cung mọc; dự đoán 2027 tính theo Mặt Trăng.

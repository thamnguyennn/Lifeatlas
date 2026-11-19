# Bộ máy tính toán và luận giải (v4)

## Phương pháp cố định
- Jyotish theo hệ Parashara; hoàng đạo sidereal, Lahiri; nhà Whole Sign; Rahu/Ketu theo true node; Vimshottari 365,25 ngày/năm.
- Ephemeris dùng caelus 0.25 cho cả lá số và chuyển vận. Giờ Việt Nam lịch sử được xử lý trong `engine/vn-time.ts`.
- Góc chiếu Graha Drishti: mọi hành tinh chiếu cung thứ 7; Sao Hỏa thêm 4, 8; Sao Mộc 5, 9; Sao Thổ 3, 10. Rahu/Ketu không được tính góc chiếu riêng.

| Varga | Quy tắc (`engine/vargas.ts`) |
|---|---|
| D2 Hora | Parashari: cung lẻ 0–15° → Sư Tử, 15–30° → Cự Giải; cung chẵn ngược lại. Đọc theo hai hora, không đọc 12 nhà |
| D3 Drekkana | 1-5-9 |
| D4 Chaturthamsha | 1-4-7-10 |
| D7 Saptamsha | cung lẻ từ chính nó, cung chẵn từ cung thứ 7 |
| D9 Navamsha | chuẩn 3°20′ |
| D10 Dashamsha | cung lẻ từ chính nó, cung chẵn từ cung thứ 9 |

## Hai lớp nội dung
- **Lớp đọc:** văn xuôi dựng từ `reading/facts.ts` (phẩm vị, Shadbala, vai trò chức năng, nhà, yoga). Hạn chế tên hành tinh và không dùng số nhà, trừ trang nhà và phần kỹ thuật.
- **Lớp bằng chứng:** mục "Vì sao mình nói điều này?" của mỗi khối chỉ liệt kê những dữ kiện đã dùng để viết khối đó.

## Các bộ máy
- `overview3.ts`: câu mở đầu ghép từ các dấu ấn (trait) có điểm nổi bật cao nhất. Gồm Mặt Trời–Mặt Trăng (độ số, thế cung), nguyên tố, Paksha Bala, trụ cột (phẩm vị, yogakaraka, yoga thuận; tách sức mạnh khỏi tính thuận), và lĩnh vực nổi bật (hành tinh cư trú, góc chiếu, chủ cung mọc, hoán đổi chủ nhà).
- `house4.ts`: quy trình 5 bước. Bằng chứng có trọng số (ví dụ chủ nhà ở kendra/trikona +0,7…+0,9; ở dusthana −0,9, nhưng chủ nhà khó gặp nhà khó +0,6; hành tinh ác ở upachaya được tính thuận). Cách kể chọn theo dữ kiện (contrast, yoga, strength, occupant, care, quiet, bridge, life) và không lặp cách kể của nhà liền trước.
- `nodes.ts`: Rahu–Ketu, bảng 12 yếu tố, thêm phần liên hệ thời gian.
- `vargas3.ts`, `stability.ts`: nhận định đối chiếu D1 với varga, điểm nổi bật chọn theo độ nổi bật, độ ổn định trong sai số giờ sinh.
- `timeline.ts`: đại vận gồm chủ đề, điều kiện thuận, yếu tố trái chiều, liên kết; tiểu vận đọc theo quan hệ với chủ đại vận và mảng chung hoặc mảng mới.
- `forecast.ts`:
  - Lịch năm: quét theo ngày, rồi chia đôi khoảng để chính xác đến khoảng 10 phút.
  - Thực: trăng non cách nút dưới 17°; trăng tròn dưới 11,5° là nguyệt thực, từ 11,5° đến 17° là nguyệt thực nửa tối.
  - Chạm điểm gốc trong 1,5°. Vedha theo Phaladeepika, có ngoại lệ Mặt Trời–Sao Thổ và Mặt Trăng–Sao Thủy.
  - Lĩnh vực của tháng: trọng số hành tinh đi qua (đọc ở ngày 3, 16 và ngày cuối tháng), góc chiếu của Mộc, Thổ, Hỏa, và các nhà của chủ đại vận, tiểu vận.
- `explore.ts`: mỗi chủ đề là một tập các mặt (facet) tự chấm điểm từ dữ kiện; chỉ hiện mặt có đủ căn cứ.
- `compat.ts`: Ashtakoota 36 điểm, cùng giao tiếp, giá trị, sức hút, cam kết và D9.

## Kiểm thử
- `npm test`: 38 test, gồm 4 test đối chiếu nguồn ngoài:
  - Lahiri ayanamsa J2000 đúng 23°51′11″ ±1′;
  - 5 lần thực năm 2027 khớp danh mục NASA;
  - ngày Sao Thổ vào Song Ngư 2025, Sao Mộc vào Song Tử 2025, Sao Thổ vào Bạch Dương 2027 khớp lịch Lahiri công bố;
  - ngoại lệ Vedha.
- `npm run lint:reading`: 12 lá số. Kiểm tra câu trùng trong cùng chương và giữa các chương, cách mở đầu các nhà, cụm từ bị cấm, số nhà trong văn xuôi, mục "Vì sao" rỗng, và lá số không có giờ sinh.
- `node --experimental-strip-types scripts/scenarios.ts`: 11 tình huống bắt buộc, kết quả ở `docs/TEST_SCENARIOS.md`.
- `node scripts/smoke.cjs`: trình duyệt thật trên desktop và điện thoại. Đi hết 24 trang, kiểm tra 6 biểu đồ kim cương, 12 tab tháng, 12 thẻ khám phá, trang hòa hợp, nút âm thanh, không lỗi console và không tràn ngang.

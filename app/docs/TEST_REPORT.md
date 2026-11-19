# Báo cáo kiểm thử (v4)

| Bộ kiểm thử | Kết quả |
|---|---|
| `npm test` (tính toán, tham chiếu ngoài, cấu trúc bài đọc) | 38/38 đạt |
| `npm run lint:reading` (12 lá số, văn phong và chống lặp) | 0 vấn đề |
| `scripts/scenarios.ts` (11 tình huống bắt buộc) | 11/11 đạt (xem TEST_SCENARIOS.md) |
| `scripts/smoke.cjs` (Chromium desktop 1280px + điện thoại 390px) | Tất cả đạt, không lỗi console, không tràn ngang |
| `npm run build` | Đạt (một file index.html khoảng 1,4 MB) |

## Tham chiếu ngoài đã dùng
- Ayanamsa Lahiri J2000.0 = 23°51′11″ (Indian Astronomical Ephemeris).
- Danh mục thực của NASA năm 2027: 6/2 nhật thực hình khuyên, 20/2 nguyệt thực nửa tối, 18/7 nguyệt thực nửa tối, 2/8 nhật thực toàn phần, 17/8 nguyệt thực nửa tối.
- Lịch chuyển cung Lahiri công bố rộng rãi: Sao Thổ vào Song Ngư 29/3/2025, Sao Mộc vào Song Tử 14/5/2025, Sao Thổ vào Bạch Dương 3/6/2027.
- Các test sẵn có từ trước: SAV đúng với bài đọc tham chiếu (9/9 nhà, tổng 337), Drik Bala đúng với ví dụ của B.V. Raman (sai số 0,03 virupa), giờ Việt Nam lịch sử, lịch âm Tết.

## Hạn chế còn tồn tại
- Giọng thuyết minh tự nhiên chưa có (xem V4_REPORT.md).
- Đọc liên tục như người không biết chiêm tinh: phần này mình tự đọc trên các bản trích (dump) của nhiều lá số. Văn bản vẫn là văn sinh theo quy tắc, nên một số câu ở các lá số khác nhau còn có cấu trúc giống nhau; linter chỉ bảo đảm không trùng trong cùng một lá số.
- Chưa đối chiếu Shadbala và D-chart với phần mềm thương mại (Jagannatha Hora). Kiểm tra hiện có là quy tắc chia cung đã biết và ví dụ của Raman.

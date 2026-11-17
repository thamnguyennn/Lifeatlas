# Life Atlas v3.0 — Kiểm thử và nghiệm thu nội bộ

Thực hiện: **17/11/2026** trên bản HTML tự chứa build từ `index.v2.html`.

## Kiểm thử tự động đã chạy

| Hạng mục | Phương pháp | Kết quả |
|---|---|---|
| Biên dịch | `python build_v3.py` | Đạt, sinh file HTML 1.599.936 byte |
| Cú pháp bundle | `node --check bundle.v3.mjs` | Đạt |
| 6 mẫu Jyotish khác nhau | `node tests/narrative.test.js` | Đạt 6/6 |
| 12 nhà không có Dasha | Kiểm `now/next/turn` trên 6 × 12 nhà giả lập | Đạt |
| Đa dạng 12 nhà | Không có hai nhà liền nhau trùng pattern | Đạt cả 6 bộ |
| Opening | 4 đoạn, thay đổi theo cấu trúc, kiểm tra khác biệt 5-gram | Đạt cả 6 bộ |
| Tổng quan | 5 lớp truyện và thông tin `evidence` | Đạt |
| D1/D9/D10 | Kiểm đối chiếu các chỉ dấu trên fixtures | Đạt |
| Gochara | Trục Mặt Trăng và cung mọc được đánh dấu riêng | Đạt |
| Không biết giờ sinh | Không bịa Lagna, không dựng varga cần giờ sinh | Đạt |
| Chromium mobile 390×844 | Playwright mở lá số mẫu, Tổng quan, Nhà 1, D9, D10, Dasha, Gochara | Đạt, không `pageerror` |
| Tràn ngang trên mobile | `scrollWidth` tại Mở lá số/Tổng quan = 390px | Đạt |
| Xóa ba mục yêu cầu | Tìm nội dung trên HTML sau build | Đạt |

## Mẫu nội dung thực tế trên trình duyệt

Đã kích hoạt **“Xem lá số mẫu”** với hồ sơ mẫu mà website cung cấp sẵn. Ghi nhận lá số mẫu có Lagna Song Tử, Sun Kim Ngưu, Moon Bạch Dương, nakshatra Bharani, pada 2; phần đầu diễn giải đúng các trường mà ứng dụng đã tính. Mở được D9/D10 và trang **Bầu trời hiện tại** tại ngày 17/11/2026. Đây là kiểm thử nhất quán giao diện–dữ liệu app, **không phải đối chiếu độc lập độ chính xác thiên văn**.

## Kiểm thử chưa khẳng định

1. Chưa chạy so sánh số học với phần mềm ephemeris độc lập hoặc phần mềm Jyotish chuyên dụng.
2. Chưa thực hiện kiểm thử thực tế trên Safari iOS, Firefox, Android thật; hiện mới kiểm tra Chromium di động giả lập.
3. Chưa thực hiện soát thủ công hàng trăm tổ hợp lá số theo chuyên gia Jyotish Parashara; bộ sáu fixtures hỗ trợ QA logic, chưa thể đại diện toàn bộ không gian dữ liệu.
4. Chưa thử in PDF vật lý trên từng hệ điều hành; nút in gốc được giữ.
5. Chưa merge vào `main`, chưa can thiệp GitHub Pages hay website công khai.

## Kiến nghị nghiệm thu

Đọc liên tục Mở lá số → Tổng quan của ít nhất 10 hồ sơ khác nhau bằng người đọc không biết Jyotish; rà những luận điểm quá giống nhau, kiểm tra cách giải thích và lập bảng đối chiếu D1/D9/D10 với hệ tham chiếu độc lập trước khi công bố. Chỉ merge sau khi có xác nhận nội dung và kiểm thử trên thiết bị thật.
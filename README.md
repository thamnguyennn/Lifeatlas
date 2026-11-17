# Life Atlas v3.0 — Bản duyệt trước

Phiên bản nâng cấp lớp luận giải Jyotish Parashara, hoàng đạo sao Lahiri, trên nền website Life Atlas v2. **Không tự động triển khai lên website công khai.** GitHub nhánh `lifeatlas-v3-review-20261117` dành riêng cho việc xem xét.

## Chạy thử

- Mở `index.html` trong trình duyệt hiện đại. Đây là bản HTML độc lập chứa sẵn CSS, ứng dụng đã biên dịch và mã luận giải v3; không cần cài NPM hay API key.
- Nhấn **Xem lá số mẫu** để kiểm tra phần Mở lá số, Tổng quan và các chương tiếp theo.
- Nếu một trình duyệt hạn chế mở file trực tiếp, từ thư mục dự án chạy `python -m http.server 8000`, sau đó truy cập `http://localhost:8000`. Không thay đổi dữ liệu người dùng.

## Các file và nguồn gốc

| Tệp | Vai trò |
|---|---|
| `index.html` | Bản Life Atlas v3 đã build, độc lập, sẵn sàng xét duyệt cho GitHub Pages |
| `index.v2.html` | Bản gốc v2 dùng làm dữ liệu đầu vào, không sửa |
| `v3-engine.js` | Mã nguồn đọc được của lớp luận giải mới; không cần React source map |
| `build_v3.py` | Áp các thay đổi xác định lên bản v2, sinh `index.v3.html` |
| `tests/narrative.test.js` | 6 kịch bản kiểm thử logic luận giải bằng Node.js |
| `tests/smoke_browser.py` | Kiểm thử điều hướng và mobile viewport bằng Playwright + Chromium |
| `docs/CHANGES.md` | Danh sách thay đổi đã làm |
| `docs/NARRATIVE_ENGINE.md` | Đặc tả bộ máy luận giải |
| `docs/TEST_REPORT.md` | Kết quả, phạm vi và giới hạn kiểm thử |

**Quan trọng:** Repository v2 chỉ cung cấp một `index.html` đã build, không có mã nguồn React/TypeScript chưa biên dịch, cấu hình NPM hay unit tests gốc. Vì vậy, lớp cải tiến được tách vào một file JavaScript dễ đọc và chèn vào bản build có sẵn, không tái tạo/chế lại thuật toán thiên văn từ giao diện. Bản HTML gốc được bảo toàn để đối chiếu và tái build.

## Tái build, kiểm thử

Yêu cầu Python 3, Node.js. Giả sử đang ở thư mục gốc:

```bash
python build_v3.py
node --check bundle.v3.mjs
node tests/narrative.test.js
# Tùy chọn: pip install playwright; cần Chromium cài sẵn
python tests/smoke_browser.py
```

Script xuất `index.v3.html`; nếu đạt kiểm thử, dùng bản này thay cho `index.html` trên nhánh thử nghiệm. **Không merge vào `main` khi chưa được chủ dự án duyệt.**

## Nguyên tắc sản phẩm

Luận giải v3 là cách diễn giải biểu tượng có điều kiện, không là một khẳng định khoa học về tính cách hay tương lai. Thông tin ngày/giờ/nơi sinh và độ chính xác của phương pháp đầu vào quyết định khả năng luận theo nhà. Nếu không có giờ sinh, không suy đoán cung mọc, D9/D10 theo các vị trí cần giờ sinh. Nội dung không dự đoán chắc chắn biến cố, bệnh tật hoặc hôn nhân.
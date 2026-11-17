# Life Atlas v3.0 — Báo cáo thay đổi

Ngày thực hiện: **17/11/2026**. Bản kiểm thử độc lập, chưa công bố chính thức.

## Đã xóa hẳn khỏi giao diện

- Khối **“Chín hành tinh, chín vị gìn giữ”** (bao gồm wrapper và phần không gian bố cục).
- Tiêu đề **“Bắt đầu từ ba điều bạn nhớ”** trong biểu mẫu nhập dữ liệu sinh.
- Phần **“Chín nhân vật trong lá số của bạn”** và giới thiệu nhân vật hành tinh tại Tổng quan; cập nhật cả bản sao chép bài đọc.
- Tại từng nhà, các section `now`, `next`, `turn` — tránh lặp Đại vận/Tiểu vận và lời khuyên ngắn mang tính khuôn mẫu.

## Đã viết lại và tổ chức lại

1. **Mở lá số:** 4 đoạn văn có nhịp chuyển, dùng Lagna (khi có giờ sinh), Sun, Moon, nakshatra, pada, hiện diện nhiều hành tinh hoặc phẩm chất hành tinh làm điểm mở. Chọn góc kể bằng quy tắc tất định, không dùng random.
2. **Tổng quan:** 5 lớp truyện liên kết D1, Sun–Moon–Lagna, chỉ báo hỗ trợ, nét khó dung hòa và câu hỏi tự suy ngẫm. Mỗi lớp có mục mở rộng **“Vì sao mình nói điều này?”** nêu dữ kiện.
3. **12 nhà:** dùng các cách nhập đề `strength`, `contrast`, `crowd`, `conditions`, `link`, `aspect`, `theme`, `detail`; tiêu chí dựa vào SAV, Bhava Bala, chủ nhà, phẩm chất, tụ tinh, góc chiếu, vị trí chủ nhà; tránh liền hai nhà cùng mô típ.
4. **D9/D10:** thêm đọc đối chiếu với D1; vị trí chủ nhà 7/10 trong D1 và D9/D10; tách giả thuyết và hạn chế, không áp quy tắc D1 máy móc.
5. **Vimshottari:** nội dung tập trung tại các trang Đại vận/Tiểu vận; nêu sự cai quản và vị trí của hành tinh chủ vận trong D1, tránh dự đoán chắc chắn một sự kiện.
6. **Gochara:** nhấn rõ hệ quy chiếu Mặt Trăng và cung mọc trong từng đoạn chuyển vận, bao gồm khi chọn ngày khác.
7. **Biên tập và hiển thị:** giữ giao diện dark/gold và bộ tính gốc; điều chỉnh nhịp văn dài, cỡ chữ, khoảng cách đoạn, responsive mobile, loại bỏ lời dẫn đã lỗi thời.

## Những thứ được giữ lại

- Bộ máy tính toán sidereal/Lahiri, Whole Sign, nakshatra, yoga, SAV, Shadbala, Bhava Bala, Vimshottari, D9/D10, Gochara và các trường dữ kiện gốc.
- Trang nhập giờ/ngày/địa điểm sinh, lá số mẫu, điều hướng, chi tiết dữ kiện, sao chép nội dung và in/lưu PDF của trình duyệt.
- Cấu trúc định hướng thận trọng, chỉ giải thích dựa trên dữ kiện sẵn có; không suy diễn dữ kiện nếu thiếu giờ sinh.

## Những giới hạn chưa thể xác nhận tuyệt đối

- Tập dữ kiện hiện có không có đối chứng độc lập từ Swiss Ephemeris hoặc phần mềm Jyotish tham chiếu. **Chưa xác minh toàn bộ vị trí hành tinh, phân chia D9/D10 và Dasha bằng một ephemeris độc lập**; không được suy diễn kết quả unit test sang độ chuẩn xác thiên văn.
- Phân tích D9/D10 mới nhấn mạnh đối chiếu chủ nhà; chưa thể khẳng định đã bao phủ đầy đủ tất cả yoga chuyên biệt của mọi truyền phái.
- Chỉ có mã build gốc; không thể khôi phục chính xác cây mã React/TypeScript ban đầu của tác giả.
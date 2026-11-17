# Đặc tả bộ máy diễn giải Life Atlas v3.0

## Dữ liệu vào và ranh giới hệ thống

`LAV3.enhance(base, ctx)` nhận đầu ra của bộ máy Jyotish gốc (`base`) cùng cấu trúc lá số (`ctx.n`) và đặc trưng cung/nhà. Hàm trả về bản đọc mới mà không sửa các toạ độ thiên văn, ngày tháng Dasha hay thông số SAV/Shadbala/Bhava Bala. Hàm được gọi ở factory tạo bản luận; `LAV3.gochara()` cũng được áp dụng trong luồng đổi ngày.

- `ctx.n.lagna`, `ctx.n.grahas`: Lagna và chín Graha (cung, nhà, phẩm chất, nakshatra, pada).
- `ctx.n.houses`: các nhà D1 với chủ nhà, hành tinh cư trú, góc chiếu, SAV, vị trí chủ nhà.
- `ctx.sb.bhava`: thứ hạng Bhava Bala khi bộ tính cung cấp.
- `base.vargas`, `base.timeline`, `base.sky`: lá số phân chia, Vimshottari, Gochara, đã tính sẵn ở phiên bản gốc.
- `ctx.noTime`: không có giờ sinh; loại trừ luận giải cần cung mọc/hệ nhà.

## Quy tắc chọn bài Mở lá số

`features()` tính số hành tinh cùng cung, nhóm có dignity thuận/nghịch, tương quan Sun–Moon, khoảng cách Lagna–Moon và Lagna–Sun khi biết giờ sinh. Hàm `letter()` ưu tiên các lớp tín hiệu theo trình tự: **tụ tinh → Sun–Moon cùng cung → Lagna–Moon tương quan rõ → biến thể theo cung của Mặt Trời**. Lựa chọn là hàm thuần của lá số; cùng dữ liệu cho cùng lời dẫn. Mỗi bài có bốn phần: đón tiếp, thời điểm sinh (theo Lahiri), một chỉ dấu có kiểm chứng, lối vào chương Tổng quan. Không gán tính cách cụ thể từ vị trí đơn lẻ.

## Tổng quan đa chỉ dấu

`overview()` kết hợp Lagna, Sun và Moon ở mức cấu trúc, không nối ba đoạn rời. Các mục `story` nêu một trọng tâm, liên hệ D1, đối chiếu hỗ trợ/trái chiều, biểu hiện có điều kiện và câu hỏi suy ngẫm. `evidence` là chuỗi dữ kiện phía sau nhận định, chỉ mở khi người đọc muốn biết chi tiết. Không biến kết quả chiêm tinh thành chẩn đoán, định mệnh hoặc khẳng định nhân quả.

## Cơ chế kể chuyện 12 nhà

`signals(ctx,house,prev)` xác định các tín hiệu sau:

| Tín hiệu | Điều kiện kích hoạt | Ý nghĩa |
|---|---|---|
| `contrast` | SAV cao ≥32 nhưng Bhava Bala yếu (rank ≥9), hoặc SAV thấp ≤24 nhưng Bhava Bala mạnh (rank ≤4) | Hai thước đo khác nhau; không đồng nhất năng lực biểu hiện với hỗ trợ |
| `crowd` | ≥3 hành tinh trong nhà | Nhiều tác nhân cùng tham dự |
| `strength` | Chủ nhà có dignity thuận, thêm hỗ trợ SAV hoặc Bhava Bala và không vướng xung đột hai thước đo | Cấu trúc tương đối hỗ trợ, không có nghĩa đảm bảo kết quả |
| `conditions` | Chủ nhà ở 6, 8 hoặc 12 | Điều kiện và độ phức tạp cao hơn, không mặc định rủi ro |
| `link` | Chủ nhà nằm ngoài chính nhà đó | Liên hệ hai miền đời sống |
| `aspect` | Sao Mộc chiếu nhà | Chỉ báo chiếu cần đặt trong toàn cảnh |
| `theme` | Không có dấu mạnh theo ưu tiên | Mở từ chủ đề đời sống của nhà |
| `detail` | Phương án dự phòng chống lặp mô típ | Đi từ một lát cắt dữ kiện cụ thể |

Thứ tự xét ưu tiên theo tín hiệu, rồi chọn mô típ đầu tiên khác với nhà liền trước nếu có thể. Không dùng số ngẫu nhiên. Mỗi nhà chỉ có `summary` mới và khu vực giải thích kỹ thuật; `now/next/turn` bị bỏ. Các khối dữ kiện chi tiết ban đầu khác được giữ.

**Lưu ý học thuật:** Bhava Bala là chỉ báo đánh giá lực của nhà; SAV của Sarvashtakavarga phản ánh phân bố bindu hỗ trợ theo cách tính tương ứng. Điểm số không tự chứng minh một sự kiện là tốt hay xấu. Cần cân nhắc chủ nhà, tác nhân và bối cảnh.

## D9, D10, Vimshottari và Gochara

- `varga()` đối chiếu chủ nhà 7/10 tại D1 với vị trí cùng Graha trong D9/D10 và cung mọc phân chia; không áp lại mọi đặc tính của D1.
- `dasha()` bổ sung giải thích đại vận/tiểu vận theo chủ vận, nhà cai quản, dignity và các quan hệ tương ứng; mốc thời gian được lấy từ bộ tính gốc, không tự tạo.
- `gochara()` tách văn bản thành đoạn từ **Mặt Trăng gốc** và từ **cung mọc** khi có dữ liệu; không trộn hai hệ quy chiếu. Nếu không có đoạn Lagna, không tự dựng.

## Biên tập và quy tắc loại suy

Dùng `mình` và `bạn`, câu đầy đủ, giữ một luận điểm/một đoạn. Tránh giọng phán xét, khẳng định chắc chắn và chuỗi câu sáo. Mỗi khẳng định mạnh cần có chỉ dấu quan sát được trong `ctx` hoặc được làm mềm thành giả thuyết có điều kiện. Khi nguồn thiếu, không bịa vị trí, nhà, phẩm chất hay giai đoạn. Đánh giá nghiệm thu kết hợp kiểm thử dữ liệu máy với việc đọc liên tục của con người.
# Life Atlas v2.9

> Quay lại làm tiếp: đọc `CONTINUE.md` trước (trang đang ở đâu, đã làm gì, việc kế tiếp, cách chạy và đăng).

Trang đọc lá số Jyotish (chiêm tinh Vệ Đà) bằng tiếng Việt, chạy hoàn toàn trong trình duyệt. Không gọi máy chủ, không dùng AI để viết lời lúc bạn nhập lá số: mọi câu là câu viết tay, được ghép theo quy tắc từ chính lá số.

## Bài đọc: bảy phần, hai mươi tám trang
1. **Mở lá số của bạn**: một câu mở đầu và ba chỉ dấu (cung mọc, Mặt Trời, Mặt Trăng).
2. **Tổng quan**: chỉ nói chung về cung và các điểm chung của lá số; bảng chín hành tinh gập lại.
3. **Mười hai khía cạnh cuộc sống**: mỗi nhà một trang, đọc qua cung, hành tinh cai quản, hành tinh trong nhà (chòm sao, Shadbala), ánh nhìn, SAV, yoga và điều đang diễn ra lúc này.
4. **Bài học kiếp này**: trục Rahu–Ketu, hành tinh của linh hồn (Atmakaraka, Karakamsa), bảy vai trò (Chara Karaka).
5. **Biểu đồ chuyên sâu**: D2, D3, D9, D10.
6. **Đại vận và tiểu vận**: các chương đời, năm bậc đang chạy với nhãn độ tin cậy, và các hành tinh đang đi qua so với lá số của bạn.
7. **Lời nhắn hôm nay**: một lá thư ngắn ghép từ đại vận, tiểu vận và bầu trời của ngày (có chọn ngày).

Khi chưa biết giờ sinh, bài đọc bỏ phần cung mọc, mười hai nhà và biểu đồ chuyên sâu, chỉ giữ những điều không phụ thuộc giờ sinh.

## Quy ước tính
Sidereal Lahiri · Whole Sign · Rahu thật (true node) · Vimshottari năm bậc (năm 365,25 ngày) · lá số phụ D2, D3, D9, D10 · Atmakaraka và Karakamsa (Jaimini, bảy karaka, không tính Rahu) · điểm SAV theo Brihat Parashara Hora Shastra (đọc mặc định của Jagannatha Hora) · Shadbala, Ishta/Kashta, Bhava Bala · Gochar (Sade Sati, Ashtama Shani, Chandra Bala, Tara Bala). Giờ sinh Việt Nam được đổi về UTC theo bảng múi giờ lịch sử (`src/engine/vn-time.ts`). Trang "Cách đọc" trong ứng dụng liệt kê đầy đủ các quy ước và độ chính xác đã kiểm.

## Đã kiểm với nguồn nào
- Vị trí thiên văn so với Swiss Ephemeris trên 103 lá số: hành tinh dưới 1,1 giây cung (Mặt Trăng 12″, Rahu 45″), cung mọc 3″.
- Drik Bala khớp ví dụ có lời giải của B.V. Raman (lệch tối đa 0,02 virupa); `npm test` giữ phép thử này.
- So với PyJHora (bản mã nguồn mở của Jagannatha Hora), 60 lá số: Uccha, Kendradi, Drekkana, Tribhaga, Abda, Masa, Vara khớp cả 420 giá trị; Saptavargaja 418/420, Ojhayugma 419/420. Các thành phần còn lại của Shadbala (Dig, Cheshta, Paksha, Nathonnatha, Hora, Ayana) khác nhau ở nhiều lá số, nên tổng Shadbala **không** được coi là trùng với phần mềm khác; bài đọc chỉ dùng nó để xếp hạng và nói "đủ sức hay chưa".
- Đại vận năm bậc so với PyJHora, 30 lá số: bốn bậc đầu khớp 30/30, bậc thứ năm khớp 22/30 (mốc lệch tối đa khoảng một ngày). Chín đoạn con luôn khít đoạn cha ở mọi bậc.
- PyJHora (AGPL-3.0) chỉ dùng để so số. Mã Shadbala, Bhava Bala và đại vận được viết lại từ công thức cổ điển, không lấy mã từ đó.

## Lệnh
```
npm install
npm run dev            # chạy thử
npm run build          # kiểm tra kiểu + đóng gói thành dist/index.html (một file duy nhất)
npm test               # 49 phép thử: giờ Việt Nam, lịch âm, lá số, lá số phụ, Jaimini, Shadbala, đại vận năm bậc, Gochar, và cả bảy phần của bài đọc (kể cả khi chưa có giờ sinh)
npm run lint:reading   # soi 300 bài đọc: từ cấm và từ khó, câu quá dài, độ dài từng trang nhà, chỗ trống chưa điền, câu lặp
npm run calibrate      # tính lại ngưỡng Thuận / Đan xen / Cần chăm cho từng nhà
python3 scripts/shots.py 390 844 m     # chụp màn hình từng trang của báo cáo (cần Chrome + playwright)
python3 scripts/e2e.py                 # thử thao tác thật trong Chrome không đầu
```

## Cấu trúc
- `src/engine/` phần tính: hành tinh, cung mọc, nhà, SAV, yoga, giờ Việt Nam, âm lịch. `vargas.ts` là D2/D3/D9/D10, hora, bảy karaka và Karakamsa. `shadbala.ts` là sức mạnh hành tinh và nhà. `dasha5.ts` là đại vận năm bậc cùng độ tin cậy theo giờ sinh. `transit.ts` là các hành tinh đang đi qua.
- `src/reading/content/` thư viện câu viết tay (giọng văn nằm ở đây). Sửa chữ ở đây, không sửa trong các bộ ghép.
- `src/reading/` các bộ ghép: `compose.ts` nối các phần; `overviewpage.ts` (lời mở đầu, tổng quan); `housepage.ts` (mười hai trang nhà); `deep.ts` (Rahu–Ketu, hành tinh của linh hồn, bốn lá số phụ); `timeline.ts` (chương đời và năm bậc đại vận); `skypage.ts` (bầu trời hiện tại và lời nhắn hôm nay).
- `src/ui/` giao diện React. `pages.ts` quyết định bài đọc có những trang nào; `Report.tsx` dựng hai thanh điều hướng (phần và trang), nút Trước / Tiếp theo và lịch sử trình duyệt. `styles.css` chứa toàn bộ màu và hiệu ứng (hai giao diện: đêm và giấy da).
- `STYLE.md` quy tắc giọng văn ("bạn thân kể chuyện", người chưa biết gì cũng hiểu, cách viết điều nặng, cách nói phần huyền học, cách chống lặp).

## Muốn thêm hoặc sửa nội dung
1. Mở file tương ứng trong `src/reading/content/` và sửa hoặc thêm câu (mỗi ý có ít nhất 2 cách nói để bài đọc không lặp).
2. `npm run lint:reading` phải sạch (không từ cấm, không chỗ trống).
3. `npm test`, rồi `npm run build` và mở `dist/index.html`.

# Tiếp tục làm Life Atlas v2 (đọc file này đầu tiên)

Cập nhật: 16/11/2026 · phiên bản mã nguồn 2.9.0

## 1. Trang web đang ở đâu
- **Trang đang chạy (công khai):** https://claude.ai/artifact/DMWe7b1PUb8X3tyChxJrXu (mã `640ace38-8d77-4cdd-94f8-be01d3417ebc`, tên "Life Atlas"). Mỗi lần đăng bản mới thì link này tự cập nhật, không đổi link.
- **Mã nguồn:** thư mục này (Vite + React + TypeScript, thư viện `caelus` tính sao). Bản đóng gói: `life-atlas-v2.zip` (không kèm `node_modules` và `dist`).
- Trang chỉ là **một file HTML** (`dist/index.html`, khoảng 1,3 MB). Nó không có máy chủ, không tải về được file, và không có AI chạy trực tiếp trên trang. Mọi chữ do mình viết sẵn, ghép bằng mã.
- Trang mẫu dùng người hư cấu "Minh Anh (mẫu)" 23/05/1990 08:40 Huế. **Dữ liệu sinh thật của bạn không được xuất hiện ở bất kỳ trang nào đăng công khai.**

## 2. Chạy và kiểm tra trên máy
```
npm install
npm test                       # 50 test
npm run lint:reading 60        # kiểm tra chữ trên 60 lá số mẫu (không tham số = 300 lá, mất vài phút)
npm run build                  # ra dist/index.html
python3 scripts/e2e.py         # 97 kiểm tra trình duyệt, cần playwright + Chrome, mất khoảng 4 phút
node --experimental-strip-types scripts/voice-check.ts ban-nhap.txt   # kiểm tra giọng văn một bản nháp
```
In chữ của một trang nhà (lá số mẫu) ra màn hình: `node --experimental-strip-types scripts/dev/house_dump.ts 7`  (đổi 7 thành số nhà; bỏ số thì in cả 12 nhà).

## 3. Đăng bản mới lên link công khai
Nhờ Claude trong cuộc trò chuyện: "build rồi đăng lên artifact Life Atlas". Các bước: `npm run build` → `get_artifact` (lấy version) → `publish_files` với `index.html` từ `dist/`, `shared_live: "public"`, `artifact_title: "Life Atlas"`. Claude không đổi được chế độ chia sẻ; việc đó bạn làm trong giao diện Claude.

## 4. Đã làm tới đâu (v2.9, bản xem trước)
- **v2.9.2 (17/11/2026, trưa)**: bạn đã duyệt phim; hỏi thêm sổ về 35 cặp sao ngồi cùng nhau và 12 nhà khi mạnh/yếu; trang nhà nói rõ ý nghĩa cặp sao cùng nhà và thêm câu "Sách cổ tả nhà này…". Ngưỡng phần hiển thị trang nhà nâng lên 800 từ.
- **v2.9.1 (17/11/2026, trưa)**: phim rút còn ~40 giây (tua nhanh các khoảng lặng, phụ đề giữ nguyên thời gian đọc); câu cuối đổi thành "Để mình kể cho bạn nghe câu chuyện về chính bạn…". Đã đọc sổ NotebookLM qua trình duyệt trên máy bạn: thêm "sách cổ tả" cho mỗi đại vận/tiểu vận (mạnh/yếu), thêm nhà mà sao tiểu vận chiếu tới, sửa câu thế 3/11. Bỏ thêm chú thích: dòng năm hợp lệ, gợi ý giờ chính xác và canh giờ, đoạn phụ bên form, đoạn thứ hai ở trang bản đồ 12 nhà, câu "bấm vào một hàng", câu "màu chỉ là gợi ý".
- **v2.9 (17/11/2026): đoạn phim mở đầu** theo bản yêu cầu "Cinematic intro" của bạn. Đang ở **link xem trước riêng**, link chính vẫn là v2.8 cho tới khi bạn duyệt.
  - Tệp: `src/ui/Intro.tsx` (giao diện: phụ đề, Bỏ qua, Bật tiếng, Phụ đề bật/tắt, thẻ cuối, bản tĩnh khi giảm chuyển động), `src/ui/intro-film.ts` (6 cảnh vẽ trên canvas), `src/ui/intro-audio.ts` (âm thanh tự tổng hợp bằng Web Audio), `src/ui/intro-deva.ts` (nét chữ Devanagari), `devtools/deva_paths.py` (công cụ tạo nét chữ, nằm ngoài thư mục dự án).
  - Gắn vào `App.tsx`: lần đầu vào trang thì phim phủ lên trên; Bỏ qua hoặc Bắt đầu thì phim mờ dần; Bắt đầu cuộn tới form nhập ngày sinh; chân trang có nút "Xem lại đoạn mở đầu"; đã xem thì nhớ bằng localStorage (`lifeatlas.intro.seen`). Esc cũng bỏ qua. Lỗi canvas thì vào web ngay.
  - Không đụng bộ máy tính lá số, nội dung luận giải hay các trang kết quả.
  - `window.__introSeek(giây)` là móc để bộ kiểm tra nhảy tới một cảnh; không ảnh hưởng người dùng.
  - Kiểm tra: e2e 97 (thêm 14 kiểm tra cho phim), `npm test` 50; đo 40–60 khung hình/giây khi vẽ bằng phần mềm ở 1440×900 và 390×844.
- **v2.8 (16/11/2026)**:
- **v2.8 (16/11/2026)**, theo góp ý của bạn: giao diện động, huyền bí hơn, bớt chú thích, ẩn bớt thông số.
  - **Nền vũ trụ** (`src/ui/Cosmos.tsx`, thay `Starfield.tsx`): sao, sao băng và chín hành tinh quay quanh Trái Đất theo thứ tự cổ (Mặt Trăng, Thủy, Kim, Mặt Trời, Hỏa, Mộc, Thổ, rồi Rahu và Ketu). Vị trí xuất phát là vị trí thật lúc mở trang, sau đó quay nhanh hơn thật. Ở trang chủ nó lớn và sáng, khi cuộn xuống hoặc vào bài đọc thì lùi về góc và mờ đi. Có tắt chuyển động khi người dùng chọn giảm chuyển động.
  - **Chín vị thần Vệ Đà** (`src/ui/deities.ts`, `src/ui/Emblem.tsx`): mỗi hành tinh có một biểu tượng SVG (vòng sen quanh một ký hiệu; không vẽ hình người của vị thần nào) và tên thần chủ theo một cách liệt kê phổ biến (nguồn: Indian Divinity, bảng Adhi/Pratyadhi Devata). Hiện ở trang chủ (dải "Chín hành tinh, chín vị gìn giữ"), bảng "Chín nhân vật", thẻ đại vận, năm bậc, màn dựng lá số; bảng đầy đủ ở trang Phương pháp.
  - **Bớt chú thích, gập thông số**: bỏ các câu hướng dẫn thừa; chip kỹ thuật, điểm SAV, chú giải ký hiệu, điều kiện yoga, vị trí hành tinh, Chandra/Tara Bala, cách tính đại vận đều nằm trong mục "Xem …" gập sẵn. Nhãn độ tin cậy chỉ hiện khi mốc chưa chắc. Gạch chân thuật ngữ mờ hơn.
  - Nhẹ hơn: bỏ bộ lọc làm mờ ở lớp tinh vân (từ khoảng 10 lên khoảng 60 khung hình/giây khi vẽ bằng phần mềm).
  - Kiểm tra: `npm test` 50, e2e 83, soi giọng văn 40 lá số không lỗi.
- **v2.7** (cùng ngày), tiểu vận kể thành chuyện, luận nhà thành chuyện, trang chủ gọn:
- **v2.7 (16/11/2026)**, theo góp ý của bạn sau khi đọc vài lá số thật:
  - **Tiểu vận kể thành chuyện** (`dasha-story.ts`, `timeline.ts`): mỗi tiểu vận nói sao đó đại diện cho điều gì và hay kéo theo chuyện gì (ví dụ Sao Thủy: học thêm, viết và nói, buôn bán, những chuyến đi, anh chị em), nó đứng ở nhà nào và cai quản nhà nào, mạnh hay yếu, đi cùng sao nào, quan hệ với sao của đại vận (bạn, không thân, đối nghịch) và hệ quả bằng lời thường, rồi một câu "thuận lợi / có thuận có khó / nhiều khó khăn" và xu hướng "đỡ dần / giữ nguyên / khó hơn dần" (tính theo Mộc và Thổ đi qua ở 4 mốc, chỉ tính khi mở).
  - **Luận nhà thành một câu chuyện** (`story.ts`, `content/story.ts`, `housepage.ts`): tóm tắt nhà không còn ghép khuôn; cung, chủ nhà, sao trong nhà, quan hệ giữa chúng, điều bạn đang tìm, cái giá và người ngoài thấy được nối thành 3 đoạn; thêm mục "Khi nào chuyện này nổi lên" liệt kê các đại vận/tiểu vận sắp tới của chủ nhà và sao trong nhà, kèm chuyện hay xảy ra.
  - **Từ dễ hiểu hơn**: bỏ "cần chăm", "đan xen"; nhãn tốt/xấu đổi thành "thuận lợi", "có thuận có khó", "nhiều khó khăn"; dọn nhiều chữ chuyên môn ở chủ nhà, BHAVA, SAV.
  - **Trang chủ gọn lại**: bỏ phần nhấn mạnh dữ liệu ở lại trên máy, bỏ chú thích giờ miền Nam, rút ngắn phần giới thiệu.
  - Chưa làm được (cần máy tính của bạn bật và mở ứng dụng Claude để dùng trình duyệt): đọc thêm sổ tay NotebookLM cho phần đại vận/tiểu vận, và chạy vài lá số mẫu hư cấu qua ChatGPT để hai bên chốt giọng văn. Xem mục 5.
- Các bản trước:
- **v2.6 (16/11/2026)**, theo góp ý của bạn: câu chào trang chủ đúng nguyên văn bạn viết; câu "đọc vị" ở trang mở lá số (cung mọc đặt cạnh cung Mặt Trăng: người ta thấy gì, lòng cần gì); viết lại các câu khó hiểu (mirror.ts, house-summary.ts, nakshatra.ts, axis.ts...); "chương" thành "giai đoạn", "mùa nhỏ" thành "giai đoạn nhỏ"; lời nhắn theo **tháng** (chọn tháng, Mặt Trời đi qua nhà nào); bỏ D3; D2, D9, D10 luận sâu (D9 và D10 đủ 12 nhà, mỗi nhà 3 nhịp).
- Quy trình khi sổ tay thiếu nguồn (bạn dặn): nhờ ChatGPT tìm (web, blog, YouTube, sách; nhấn mạnh Jyotish/Vệ Đà, không phương Tây; không gửi dữ liệu sinh), rồi dán link vào NotebookLM (Thêm nguồn, Trang web), rồi hỏi lại sổ tay. Sổ tay giới hạn 300 nguồn, hiện khoảng 287.
- Cấu trúc trang nhà: kết luận ở đầu, bằng chứng gập dưới "Vì sao mình nói vậy: đọc từng lớp".
- **Cả 12 nhà đã viết lại theo giọng mới** (7, 10, 2, 1, 5, 4, 9, 11, 3, 6, 8, 12) (3 nhịp: bản chất, cái giá, người ngoài thấy gì): 12 cung đứng trên nhà, chủ nhà ở 12 nơi (kèm tên ngắn), 9 hành tinh ngồi trong nhà. Nguồn đối chiếu: `SOURCES.md`.
- Các câu về hành tinh ở cung thù, cháy sáng, "ít điểm hỗ trợ" đã sửa cho đúng điều sổ tay nói.
- Câu chào ở trang chủ đã viết lại ấm hơn (16/11): "Có những điều về mình, bạn đã cảm thấy từ lâu mà chưa gọi được tên. Mình ngồi lại đọc cùng bạn nhé."
- Trang tổng quan: bảng "Chín nhân vật", đoạn nối ba điểm gốc, chú thích dưới ba thẻ đầu.
- Quy tắc giọng văn: `STYLE.md` (bảng đổi từ, 3 nhịp, viết đủ chữ không cắt cụt) và `scripts/voice-rules.ts`.

## 5. Việc tiếp theo (theo thứ tự)
0. **Khi máy tính của bạn bật và mở ứng dụng Claude (hoặc Chrome có tiện ích Claude in Chrome):** (a) hỏi sổ tay NotebookLM về cặp hành tinh đồng cung, việc xảy ra trong từng tiểu vận (có chuyện đi xa), chủ nhà ở từng nhà, ánh nhìn; thêm vào sổ tay các trang web đang dùng ở mục "Đại vận và tiểu vận" của `SOURCES.md`; (b) chạy vài lá số mẫu hư cấu (Minh Anh 23/05/1990 08:40 Huế, hoặc lá số tự đặt), gửi đoạn luận qua ChatGPT, hai bên trao đổi để chốt giọng; chỉ gửi dữ liệu hư cấu; (c) đưa kết quả vào `dasha-story.ts` và `content/story.ts`. Điện thoại không làm được việc này.
1. ~~Viết lại 12 nhà theo giọng mới~~ **ĐÃ XONG** (16/11/2026). Nếu muốn viết lại một nhà nào đó, dùng quy trình ở cuối `STYLE.md`. Quy trình ở cuối `STYLE.md`. Câu hỏi cho NotebookLM đã soạn sẵn trong `scripts/notebook/queue.json` (24 câu, 3 câu mỗi nhà); cách gửi và đọc câu trả lời bằng trình duyệt có trong `scripts/notebook/runner.js`. Sổ tay: https://notebook.google.com/notebook/3060bbb5-7427-4f5d-96dd-49932a192d81 ("Chiêm tinh học", khoảng 280 tài liệu). Cần Claude có trình duyệt tích hợp trong ứng dụng Claude trên máy tính và bạn đã đăng nhập Google.
   - Nhà 6, 8, 12 có nhiều chữ nặng trong kinh điển (bệnh, mất mát, tù đày): làm mềm kỹ, bỏ phần dự đoán cụ thể.
2. Tìm nguồn cho các câu ghép nguyên tố ở `KEY_LINK` (`src/reading/content/overview.ts`): lửa-khí và đất-nước hợp nhau, các cặp khác căng. Hiện chưa có nguồn trong sổ tay.
3. Phần phản biện từ ChatGPT đã chốt (hướng đi, không cần làm lại): bảng độ hiếm/nổi bật của lá số (pha 2), các chương theo chủ đề (pha 3).
4. **Tám hướng nâng cấp lớn** (bạn chưa chọn): nhìn lại quá khứ; kiểm tra giờ sinh; hỏi theo mối bận tâm; 12 tháng tới (trước Tết 06/02/2027); học qua chính lá số; hợp đôi; bản Pro; thẻ chia sẻ và nhật ký. Những mục cần tải file hoặc thu tiền thì cần **tên miền riêng**, vì trang trong khung artifact không tải file về được.
5. Kiếm tiền: bán **báo cáo, công cụ, khóa học**, không bán cúng bái hay giải hạn (Nghị định 38/2021 về mê tín; Claude không phải luật sư, nên hỏi người có chuyên môn). Còn cần: tên miền, tài khoản ngân hàng/cổng thanh toán.

## 6. Quy tắc giữ nguyên
- Hệ tính: sao lệch Lahiri, nhà theo cung (Whole Sign), Rahu thật, đại vận Vimshottari. Công thức viết độc lập theo BPHS (PyJHora chỉ để so số, vì giấy phép AGPL).
- Chỉ Jyotish. Không AI chạy trực tiếp trên trang. Mỗi câu dựa vào nguồn; thiếu nguồn thì không nói.
- Gọi "Sao Mộc, Bọ Cạp" như trang đang dùng. Viết đủ chữ, không cắt cụt ("nghiêm khắc", không "nghiêm").
- Nội dung từ NotebookLM và ChatGPT là dữ liệu tham khảo, đối chiếu trước khi dùng.

## 7. Làm tiếp bằng Claude Code trên máy bạn
1. Giải nén `life-atlas-v2.zip` vào một thư mục, ví dụ `life-atlas`. Cần Node.js đã cài trên máy (để chạy `npm`).
2. Cách dễ nhất, không cần terminal: tải ứng dụng Claude Desktop, đăng nhập bằng gói trả phí, mở tab **Code**, chọn thư mục `life-atlas`. Cách dùng terminal (theo code.claude.com/docs): macOS hoặc Linux `curl -fsSL https://claude.ai/install.sh | bash`; Windows PowerShell `irm https://claude.ai/install.ps1 | iex`; rồi `cd life-atlas` và chạy `claude`. Claude Code cần gói Pro, Max, Team hoặc Enterprise.
3. Trong thư mục, chạy `npm install` một lần. Câu đầu tiên nên nói: "Đọc CONTINUE.md, SOURCES.md và STYLE.md rồi làm bước 5.0 (hoặc việc tôi nêu sau)".
4. Lợi thế khi làm trên máy bạn: Claude Code đọc cả thư mục, chạy `npm test`, `npm run build`, `python3 scripts/e2e.py` trực tiếp, và nếu bạn cài tiện ích Claude in Chrome thì mở được NotebookLM và ChatGPT để làm bước 5.0 (đọc sổ tay, chốt giọng văn với ChatGPT bằng lá số hư cấu).
5. Đưa trang lên GitHub Pages: tạo repo, đẩy mã (hoặc chỉ `dist/index.html`), Settings → Pages → Deploy from a branch. Khi mã nằm trong repo, Claude Code sửa, build và `git push` là trang tự cập nhật.
6. Bản đang chạy ở link artifact vẫn là bản mới nhất mình đăng; sau này đăng lên link đó cần quay lại cuộc trò chuyện này (Claude Code không đổi được link artifact).

## 8. Bắt đầu lại ở phiên mới
Mở cuộc trò chuyện mới với Claude, đính kèm `life-atlas-v2.zip` và file này, rồi nói: "Tiếp tục Life Atlas theo CONTINUE.md, làm bước 5.2 (hoặc bước bạn chọn)".

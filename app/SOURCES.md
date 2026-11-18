# Bản đối chiếu nguồn (riêng cho người kiểm tra)

Mỗi dòng nội dung viết theo giọng mới (file `src/reading/content/house-voice.ts`, `lord-in-house.ts`, `planet-in-house.ts`) đều dựa
vào câu trả lời của sổ tay "Chiêm tinh học" (NotebookLM). Tên tài liệu bên dưới là tên sổ tay tự ghi ở cuối mỗi dòng trả lời;
muốn kiểm tra thì mở đúng tài liệu đó trong sổ tay. Trang web chỉ viết lại bằng từ phổ thông, **không thêm ý ngoài nguồn**, và
**bỏ** những câu quá nặng của kinh điển (bệnh tật, con cái, ngoại tình, "kẻ thù", đa thê) vì chưa đủ cơ sở để nói với một người cụ thể.

Cách đọc: "Cung X ở nhà N" lấy từ video "<cung đối diện cung X từ nhà N> Rising/Ascendant in depth", vì khi cung đó là Lagna thì
cung X nằm ở nhà N.

## Nhà 7 (hôn nhân, đối tác)

### Cung đứng trên nhà 7 → `SIGN_ON_HOUSE_DEEP[7]`
| Cung | Nguồn sổ tay ghi |
|---|---|
| Bạch Dương | Libra Rising/Ascendant in depth; Mars in All Signs! |
| Kim Ngưu | Scorpio Rising/Ascendant in depth + Mars in all houses; Moon Karmas in All Signs! |
| Song Tử | Sagittarius Rising/Ascendant in depth; Gemini Rising in Depth |
| Cự Giải | Capricorn Rising/Ascendant in depth; Moon in Seventh House |
| Sư Tử | Aquarius Rising/Ascendant in depth; Sun in Seventh House |
| Xử Nữ | Pisces Rising/Ascendant in depth; Moon Karmas in All Signs! |
| Thiên Bình | Aries Rising/Ascendant in depth; Venus in Seventh House |
| Bọ Cạp | Taurus Rising/Ascendant in depth; Moon Karmas in All Signs! |
| Nhân Mã | Gemini Rising/Ascendant in depth; Aspects.pdf |
| Ma Kết | Cancer Rising/Ascendant in depth; Robert Svoboda, *Light on Life* |
| Bảo Bình | Leo Rising/Ascendant in depth; Moon Karmas in All Signs! |
| Song Ngư | Virgo Rising/Ascendant in depth; Moon Karmas in All Signs! |

Đã làm mềm: "thao túng tâm lý" (Bọ Cạp) → "muốn biết cả điều người kia chưa nói"; "nhượng bộ mù quáng" (Thiên Bình) → "hay nhường";
"kỳ quặc" (Bảo Bình) → "khác thường"; "đi tìm hình bóng người mẹ" (Cự Giải) giữ ý, bỏ giọng phán xét.

### Chủ nhà 7 đứng ở nhà N → `LORD_IN[6]` và `LORD_IN_TITLE[7]`
Nguồn chung cho cả 12 dòng: *Seventh Lord of SPOUSE & MARRIAGE in Different Houses*; Brihat Parashara Hora Shastra (BPHS, chương 24).
Nhà 1 còn có thêm *Crux of Astrology* (Sanjay Rath, 7.3.3).

Phần bỏ đi vì quá nặng hoặc dự đoán cụ thể: nhà 2 ("tham lam nhục dục", "gãy đổ sớm"), nhà 3, 5 và 11 (chuyện con cái, con trai),
nhà 6 ("coi bạn đời như kẻ thù", "bạn đời ốm yếu"), nhà 7 ("đa thê", "dễ ngoại tình"), nhà 8 ("bạn đời bệnh tật"), nhà 9 ("đa tình ngoài luồng"),
nhà 12 ("tiêu xài hoang phí").

### Hành tinh ngồi ở nhà 7 → `PLANET_IN_HOUSE[*][6]`
Mỗi hành tinh: tài liệu "<Hành tinh> in Seventh House" (Mặt Trời, Mặt Trăng, Sao Hỏa, Sao Thủy, Sao Mộc, Sao Kim, Sao Thổ; Rahu: "Rahu 7th House";
Ketu: "Ketu in Seventh House"); ASPECTS.pdf; *Crux of Astrology*.

### Góc chiếu vào nhà 7 (Sao Mộc, Sao Thổ, Sao Hỏa)
ASPECTS.pdf; Sao Mộc còn có *Conjunctions @ The Speed of Light*; Sao Thổ còn có *Saturn in the Fifth House*. (Chưa đưa vào web, giữ cho bước sau.)

## Nhà 10 (sự nghiệp, danh tiếng)

### Cung đứng trên nhà 10 → `SIGN_ON_HOUSE_DEEP[10]`
Nguồn mỗi cung (video "<cung đối diện> Rising/Ascendant in depth" + tài liệu thứ hai):
Bạch Dương: Cancer Rising; Moon Karmas in All Signs! · Kim Ngưu: Leo Rising; Moon Karmas · Song Tử: Virgo Rising; Moon Karmas · Cự Giải: Libra Rising; Moon Karmas ·
Sư Tử: Scorpio Rising + Mars in all houses; Moon Karmas · Xử Nữ: Sagittarius Rising; Moon Karmas · Thiên Bình: Capricorn Rising; Moon Karmas ·
Bọ Cạp: Aquarius Rising; Moon Karmas · Nhân Mã: Pisces Rising; Moon Karmas · Ma Kết: Aries Rising; Robert Svoboda, *Light on Life* ·
Bảo Bình: Taurus Rising; Moon Karmas · Song Ngư: Gemini Rising; Moon Karmas.
Đã làm mềm: "thao túng"/"hiếu chiến" bỏ; "vương giả" → "dáng của người đứng đầu".

### Chủ nhà 10 đứng ở nhà N → `LORD_IN[9]`, `LORD_IN_TITLE[10]`
Nguồn chung: *Tenth lord of CAREER/ SUCCESS/ STATUS & DEEDS!*; Brihat Parashara Hora Shastra; nhà 1, 2, 3, 5 còn có *Crux of Astrology*.
Bỏ: "thời thơ ấu bệnh tật" (nhà 1), "dễ mất việc/tổn thất tiền bạc" (nhà 6), "bị tẩy chay" (nhà 10), "hao tốn tiền bạc vì chính quyền" (nhà 12), "mưu mô".

### Hành tinh ở nhà 10 → `PLANET_IN_HOUSE[*][9]`
Mỗi hành tinh: "<Hành tinh> in Tenth House" + *Tenth lord of CAREER/ SUCCESS/ STATUS & DEEDS!* + tài liệu thứ ba:
Mặt Trời: mahadasha.pdf · Mặt Trăng: "chúa tể trong các nhà.docx" · Sao Hỏa, Sao Thổ: ASPECTS.pdf · Sao Thủy, Sao Mộc: Full_text_of_Hindu_Predictive_Astrology.pdf ·
Sao Kim: Beginners Astrology, Basics 7 · Rahu: Astrology_at_the_speed_of_light-101-168.pdf · Ketu: mahadasha.pdf.
Bỏ: "dễ ngã ngựa", "bất chấp thủ đoạn", "hung hăng", "thích thao túng".

## Nhà 2 (tiền, lời nói, gia đình gốc)

### Cung đứng trên nhà 2 → `SIGN_ON_HOUSE_DEEP[2]`
Bạch Dương: Pisces Rising; Moon Karmas in All Signs! · Kim Ngưu: Aries Rising; *Second Lord of WEALTH & FAMILY in different houses* · Song Tử: Taurus Rising; Moon Karmas ·
Cự Giải: Gemini Rising; Moon in Second House · Sư Tử: Cancer Rising; Sun in Second House · Xử Nữ: Leo Rising; Mercury in Second House ·
Thiên Bình: Virgo Rising; Venus in Second House · Bọ Cạp: Libra Rising; Moon Karmas · Nhân Mã: Scorpio Rising; Jupiter in Second House ·
Ma Kết: Sagittarius Rising; Saturn in the Second House · Bảo Bình: Capricorn Rising; Moon Karmas · Song Ngư: Aquarius Rising; Moon Karmas.
Bỏ: "tuổi thơ thiếu thốn" (Ma Kết).

### Chủ nhà 2 đứng ở nhà N → `LORD_IN[1]`, `LORD_IN_TITLE[2]`
Nguồn chung: *Second Lord of WEALTH & FAMILY in different houses*; Brihat Parashara Hora Shastra; nhà 1 còn có *Crux of Astrology*; nhà 3: *Third Lord of ENTERPRISE & COMMUNICATION*; nhà 9: *Ninth Lord of FORTUNE & PAST LIFE!*.
Bỏ: "béo phì" (nhà 3), "kiểm soát con cái gắt gao" (nhà 2), "tiểu xảo, xảo quyệt" (nhà 5), "bệnh tật", "coi người nhà như kẻ thù" (nhà 6), "đa tình, hám sắc" (nhà 7), "tuổi thơ ốm yếu/đau ốm" (nhà 9, 11), "mờ ám" (nhà 8).

### Hành tinh ở nhà 2 → `PLANET_IN_HOUSE[*][1]`
Mỗi hành tinh: "<Hành tinh> in Second House" (Mặt Trăng, Mặt Trời, Sao Thủy, Sao Mộc, Sao Kim, Sao Hỏa; Sao Thổ: SATURN IN THE SECOND HOUSE; Rahu: Rahu (North Node) in Second House; Ketu: Ketu in Second House) +
ASPECTS.pdf + mahadasha.pdf / Full_text_of_Hindu_Predictive_Astrology.pdf / Scientific_Hindu_Astrology_Part_1 / Astrology_at_the_speed_of_light / pdfcoffee.com-rahu-ketu.
Bỏ: "chửi bới", "hung hăng", "lươn lẹo", "kiệt xỉ", "bất hòa ly tán", "giả tạo".

## Nhà 1 (Lagna: bản thân)

### Cung Mọc → `SIGN_ON_HOUSE_DEEP[1]`
Nguồn chung cho cả 12 cung: Full_text_of_Hindu_Predictive_Astrology.pdf; "<Cung> Rising/Ascendant in depth"; crux-of-astrology.pdf.
**Bỏ phần "sức khỏe nền" theo cung** (vùng cơ thể hay yếu: họng, dạ dày, tim, khớp…). Lý do: nói cho từng người về bộ phận cơ thể là bước quá xa với một bài đọc chiêm tinh; nếu muốn đưa lại thì chỉ nên ở dạng nhắc nhẹ, có lời nhắc đi khám.

### Chủ nhà 1 đứng ở nhà N → `LORD_IN[0]`, `LORD_IN_TITLE[1]`
Nguồn chung: *First Lord of SELF & DIRECTION*; Brihat Parashara Hora Shastra; *Crux of Astrology*.
Bỏ: "tuổi thơ thiếu bình yên" (nhà 3), "sức khỏe yếu, hay mắc bệnh" (nhà 6), "thể chất yếu ớt", "u ám" (nhà 8).

### Hành tinh ở nhà 1 → `PLANET_IN_HOUSE[*][0]`
Mỗi hành tinh: "<Hành tinh> in First House" (Mặt Trời: Sun in First House (Sun 1st House) Vedic Astrology + SUN MAHADASHA; Sao Thủy: + MERCURY MAHADASHA; Sao Thổ: SATURN IN THE FIRST HOUSE; Rahu: Rahu (North Node) in First House + pdfcoffee.com-rahu-ketu + 18.-Rahudeva-Rahu; Ketu: Ketu in First House + mahadasha.pdf) + Full_text_of_Hindu_Predictive_Astrology.pdf / ASPECTS.pdf.
**Bỏ toàn bộ phần thể chất** (mắt, tim, tai nạn, sẹo, cân nặng, xương khớp, dị ứng…).

## Nhà 5 (sáng tạo, tình yêu, học hành, con cái)

### Cung đứng trên nhà 5 → `SIGN_ON_HOUSE_DEEP[5]`
Nguồn mỗi cung ("<cung đối diện> Rising/Ascendant in depth" + hai tài liệu khác): Bạch Dương: Sagittarius Rising; vedic_astro_textbook.pdf; Robert Svoboda, *Light on Life* · Kim Ngưu: Capricorn Rising; vedic_astro_textbook.pdf; Venus in Fifth House · Song Tử: Aquarius Rising; Mercury Fifth House · Cự Giải: Pisces Rising; 001-Astrology-For-Beginners-Par-4.pdf · Sư Tử: Aries Rising; Beginners Astrology 4; Astrology_at_the_speed_of_light.pdf · Xử Nữ: Taurus Rising; *Light on Life*; naksatras-compatibility-lagna-signs.pdf · Thiên Bình: Gemini Rising; VENUS MAHADASHA · Bọ Cạp: Cancer Rising; ASPECTS.pdf · Nhân Mã: Leo Rising; *Light on Life* · Ma Kết: Virgo Rising; Saturn in the Fifth House · Bảo Bình: Libra Rising; naksatras-compatibility-lagna-signs.pdf · Song Ngư: Scorpio Rising; vedic_astro_textbook.pdf.
Đã làm mềm: bỏ mọi dự đoán về con cái (đến muộn, đau ốm); chỉ giữ cách người đó đối xử với con cái/người nhỏ hơn mình.

### Chủ nhà 5 đứng ở nhà N → `LORD_IN[4]`, `LORD_IN_TITLE[5]`
Nguồn chung: *Fifth lord of CHILDREN & LEARNING*; Brihat Parashara Hora Shastra; *Crux of Astrology*.
Bỏ: "trắc trở đường con cái, hay bệnh tật" (nhà 6), "con cái đau ốm" (nhà 8), "xa cách con cái", "thiếu chung thủy" (nhà 7), "coi con như đối thủ" (nhà 6).

### Hành tinh ở nhà 5 → `PLANET_IN_HOUSE[*][4]`
Mỗi hành tinh: "<Hành tinh> in Fifth House" + "<HÀNH TINH> MAHADASHA" (Mặt Trời, Mặt Trăng, Sao Hỏa, Sao Thủy, Sao Mộc, Sao Kim, Sao Thổ, Rahu, Ketu) + một tài liệu thứ ba (ASPECTS.pdf, Full_text_of_Hindu_Predictive_Astrology.pdf, pdfcoffee.com-rahu-ketu, mahadasha.pdf).
Bỏ: "con cái dễ đau ốm" (Sao Hỏa), "con cái khó dạy" (Rahu), "ngắt kết nối với con" (Ketu).

## Nhà 4 (tổ ấm, mẹ, cảm giác an toàn)

### Cung đứng trên nhà 4 → `SIGN_ON_HOUSE_DEEP[4]`
Nguồn mỗi cung ("<cung đối diện> Rising/Ascendant in depth" + *Fourth Lord of HOME* + một tài liệu thứ ba): Bạch Dương: Capricorn Rising; vedic_astro_textbook.pdf · Kim Ngưu: Aquarius Rising; *Light on Life* · Song Tử: Pisces Rising · Cự Giải: Aries Rising; Moon in Fourth House · Sư Tử: Taurus Rising; Sun in Fourth House · Xử Nữ: Gemini Rising; Mercury in Fourth House · Thiên Bình: Cancer Rising; Venus in Fourth House · Bọ Cạp: Leo Rising; *Light on Life* · Nhân Mã: Virgo Rising; Jupiter in Fourth House · Ma Kết: Libra Rising; Saturn in Fourth House · Bảo Bình: Scorpio Rising + Mars in all houses · Song Ngư: Sagittarius Rising; vedic_astro_textbook.pdf.
Đã làm mềm: "bất an, căng thẳng trong gia đình" → "thấy cả sự căng ở chuyện gia đình"; "tuổi thơ thiếu hơi ấm" → "nhà ít lời âu yếm".

### Chủ nhà 4 đứng ở nhà N → `LORD_IN[3]`, `LORD_IN_TITLE[4]`
Nguồn chung: *Fourth Lord of HOME*; Brihat Parashara Hora Shastra; nhà 10 còn có *Crux of Astrology*.
Bỏ: "tuổi thơ thiếu an toàn" (nhà 2), "thiếu tình mẹ" (nhà 6), "mất sản nghiệp cha ông" (nhà 7), "tuổi thơ tổn thương, giảm thỏa mãn hôn nhân" (nhà 8), "mẹ thiếu hạnh phúc, gia đạo lạnh nhạt" (nhà 10), "lo âu bệnh kín" (nhà 11). Nhà 12: sổ tay nói cổ điển chê lười, hiện đại khen tinh thần phụng sự; trang web nói đúng như vậy ("Các sách nói không giống nhau").

### Hành tinh ở nhà 4 → `PLANET_IN_HOUSE[*][3]`
Mỗi hành tinh: "<Hành tinh> in Fourth House" + ASPECTS.pdf / mahadasha.pdf / Beginners Astrology Basics 7 / crux-of-astrology.pdf.
Bỏ: "bất hòa với mẹ" nặng lời (giữ ở dạng "có lúc va chạm"), "tuổi thơ thiếu ấm áp" (Sao Thổ), "xa cách mẹ" (Rahu giữ nhẹ).

## Nhà 9 (niềm tin, người thầy, học cao, vận may)

### Cung đứng trên nhà 9 → `SIGN_ON_HOUSE_DEEP[9]`
Nguồn mỗi cung ("<cung đối diện> Rising/Ascendant in depth" + hai tài liệu): Bạch Dương: Leo Rising; Beginners Astrology 4; Mars in Ninth House · Kim Ngưu: Virgo Rising; *Light on Life*; Mercury Karmas in All Signs! · Song Tử: Libra Rising; Mercury in Ninth House · Cự Giải: Scorpio Rising; Moon in Ninth House · Sư Tử: Sagittarius Rising + Leo Rising; Sun in Ninth House · Xử Nữ: Capricorn Rising; Mercury in Ninth House · Thiên Bình: Aquarius Rising; Venus in Ninth House · Bọ Cạp: Pisces Rising; Beginners Astrology 4 · Nhân Mã: Aries Rising; *Ninth Lord of FORTUNE & PAST LIFE!* · Ma Kết: Taurus Rising; Saturn in Ninth House · Bảo Bình: Gemini Rising; HOW TO JUDGE MAHADASHA IN VEDIC ASTROLOGY · Song Ngư: Cancer Rising; Full_text_of_Hindu_Predictive_Astrology.
Đã làm mềm: bỏ "dị giáo", "báng bổ"; "quan hệ với cha và thầy nhiều sóng gió" → "quan hệ với thầy hoặc người lớn tuổi có lúc sóng gió".

### Chủ nhà 9 đứng ở nhà N → `LORD_IN[8]`, `LORD_IN_TITLE[9]`
Nguồn chung: *Ninth Lord of FORTUNE & PAST LIFE!*; Brihat Parashara Hora Shastra.
Bỏ: "sa đà nhục dục" (nhà 2), "thử thách chung thủy" (nhà 7), "gia đạo khó yên" giữ nhẹ (nhà 9), "tài chính bấp bênh, tâm lý bất an" giữ nhẹ (nhà 8), "nhiều đối thủ quấy phá" (nhà 6).

### Hành tinh ở nhà 9 → `PLANET_IN_HOUSE[*][8]`
Mỗi hành tinh: "<Hành tinh> in Ninth House" + ASPECTS.pdf / Full_text_of_Hindu_Predictive_Astrology.pdf (Rahu: Rahu 9th House + 18.-Rahudeva-Rahu.pdf; Ketu: mahadasha.pdf).
Bỏ: "báng bổ" (Rahu), "hung hăng, cực đoan" (góc chiếu Sao Hỏa), "bi quan" (Sao Thổ).

## Nhà 11 (thu nhập, bạn bè, mục tiêu, mạng lưới)

### Cung đứng trên nhà 11 → `SIGN_ON_HOUSE_DEEP[11]`
Nguồn mỗi cung ("<cung đối diện> Rising/Ascendant in depth" + hai tài liệu): Bạch Dương: Gemini Rising; Mars in Eleventh House; Virgo Rising · Kim Ngưu: Cancer Rising; Moon Karmas in All Signs!; Beginners Astrology 3 THE SIGNS · Song Tử: Leo Rising; Mercury in Eleventh House; *Astrology of the Seers* · Cự Giải: Virgo Rising; vedic_astro_textbook.pdf · Sư Tử: Libra Rising; Sun in Eleventh House; ASPECTS.pdf · Xử Nữ: Scorpio Rising + Mars in all houses; Scientific_Hindu_Astrology_Part_1 · Thiên Bình: Sagittarius Rising; Scientific_Hindu_Astrology_Part_1 · Bọ Cạp: Capricorn Rising; Beginners Astrology 4 · Nhân Mã: Aquarius Rising; *Light on Life*; Full_text_of_Hindu_Predictive_Astrology · Ma Kết: Pisces Rising; Saturn in the Fifth House; ASPECTS.pdf · Bảo Bình: Aries Rising; *First Lord of SELF & DIRECTION* · Song Ngư: Taurus Rising; HOW TO JUDGE MAHADASHA IN VEDIC ASTROLOGY.
Đã làm mềm: "chia tay bạn bè gay gắt" giữ nhẹ; "quyền lực ngầm" bỏ.

### Chủ nhà 11 đứng ở nhà N → `LORD_IN[10]`, `LORD_IN_TITLE[11]`
Nguồn chung: *Eleventh Lord of DESIRE*; Brihat Parashara Hora Shastra; nhà 1, 2 còn có *Crux of Astrology*.
Bỏ: "hao tổn sức khỏe" (nhà 1), "giảm thọ" (nhà 2), "đau nhức khớp" (nhà 3), "hay mắc bệnh" (nhà 6), "ích kỷ, lận đận xa quê" (nhà 6; giữ ý đi nhiều nơi), "mất mát người thân" (nhà 8), "bạn bè nguy hiểm trục lợi" (nhà 11, giữ nhẹ), "bạn bè ái tình nhập nhằng" (nhà 12, giữ nhẹ), "con cái thành đạt" (nhà 5).

### Hành tinh ở nhà 11 → `PLANET_IN_HOUSE[*][10]`
Mỗi hành tinh: "<Hành tinh> in Eleventh House" + mahadasha.pdf / ASPECTS.pdf / Full_text_of_Hindu_Predictive_Astrology.pdf (Rahu: pdfcoffee.com-rahu-ketu).
Bỏ: "bạn bè mờ ám, tiểu xảo" (Rahu; đổi thành lời nhắc chọn bạn kỹ), "luôn thấy trống rỗng" (Ketu; đổi thành "hay thấy trống trải"), "cô độc" (Sao Thổ; đổi thành "ở một mình").

## Nhà 3 (can đảm, kỹ năng, anh chị em, giao tiếp)

### Cung đứng trên nhà 3 → `SIGN_ON_HOUSE_DEEP[3]`
Nguồn mỗi cung ("<cung đối diện> Rising/Ascendant in depth" + một tài liệu thứ hai): Bạch Dương: Aquarius Rising; Mars in Third House · Kim Ngưu: Pisces Rising; Beginners Astrology 3 THE SIGNS · Song Tử: Aries Rising; Beginners Astrology 2. THE HOUSES · Cự Giải: Taurus Rising; MOON MAHADASHA · Sư Tử: Gemini Rising; Sun in Third House · Xử Nữ: Cancer Rising; vedic_astro_textbook.pdf · Thiên Bình: Leo Rising; Beginners Astrology 4. RISING SIGNS · Bọ Cạp: Virgo Rising; Mars in Third House · Nhân Mã: Libra Rising; *Third Lord of ENTERPRISE & COMMUNICATION* · Ma Kết: Scorpio Rising; SATURN IN THE THIRD HOUSE · Bảo Bình: Sagittarius Rising + Aquarius Rising · Song Ngư: Capricorn Rising; vedic_astro_textbook.pdf.
Đã làm mềm: "gánh nặng lo toan tuổi trẻ" → "từ trẻ đã hay gánh nhiều lo toan".

### Chủ nhà 3 đứng ở nhà N → `LORD_IN[2]`, `LORD_IN_TITLE[3]`
Nguồn chung: *Third Lord of ENTERPRISE & COMMUNICATION*; Brihat Parashara Hora Shastra; nhà 5 và 6 còn có crux-of-astrology.pdf. Nhà 5: sổ tay ghi tài liệu mâu thuẫn (sách cổ chê, trường phái Argala khen); trang web nói đúng như vậy.
Bỏ: "ăn uống mất kiểm soát" (nhà 2), "bạn đời dữ dằn" (nhà 5), "cái tôi phá hủy hôn nhân, tuổi trẻ cơ cực" (nhà 7), "tai nạn, anh em hoạn nạn" (nhà 8), "thể chất hao mòn" (nhà 11), "nội tâm dằn vặt" (nhà 12).

### Hành tinh ở nhà 3 → `PLANET_IN_HOUSE[*][2]`
Mỗi hành tinh: "<Hành tinh> in Third House" + Full_text_of_Hindu_Predictive_Astrology.pdf / ASPECTS.pdf / mahadasha.pdf.
Bỏ: "thao túng lời nói" (Rahu), "mồm mép, lắm lời" (Sao Thủy → "nói nhiều"), "cắt đứt quan hệ anh em" (Ketu → "xa anh chị em"), "hung hăng" (góc chiếu Sao Hỏa).

## Nhà 6 (công việc hằng ngày, đối thủ, nợ)

### Cung đứng trên nhà 6 → `SIGN_ON_HOUSE_DEEP[6]`
Nguồn mỗi cung ("<cung đối diện> Rising/Ascendant in depth" + một tài liệu thứ hai): Bạch Dương: Scorpio Rising; *Light on Life* · Kim Ngưu: Beginners Astrology 3 THE SIGNS; Full_text_of_Hindu_Predictive_Astrology · Song Tử: Capricorn Rising; vedic_astro_textbook.pdf · Cự Giải: Aquarius Rising; Beginners Astrology 4 · Sư Tử: Pisces Rising; Sun in Sixth House · Xử Nữ: Aries Rising; *Light on Life* · Thiên Bình: Taurus Rising; Beginners Astrology 4 · Bọ Cạp: Gemini Rising; *Light on Life* · Nhân Mã: Cancer Rising; Beginners Astrology 3 · Ma Kết: Leo Rising; Full_text_of_Hindu_Predictive_Astrology · Bảo Bình: Virgo Rising; Beginners Astrology 4 · Song Ngư: Libra Rising; Venus in Sixth House.
**Bỏ toàn bộ phần thân thể** sổ tay nêu (viêm nhiễm, dạ dày, tim mạch, tiêu hóa, xương khớp, tuần hoàn), cũng bỏ "kẻ thù" (đổi thành "người cạnh tranh") và "bệnh tật" (chỉ còn nhắc nhẹ "sức khỏe" ở Nhân Mã).

### Chủ nhà 6 đứng ở nhà N → `LORD_IN[5]`, `LORD_IN_TITLE[6]`
Nguồn chung: *Sixth Lord of ENEMIES in Different houses*; Brihat Parashara Hora Shastra; nhà 1 và 6 còn có Crux of Astrology.
Bỏ: "thể chất đau ốm" (nhà 1), "thiếu tình thương của mẹ" (nhà 4), "hôn nhân xung đột nặng nề, coi bạn đời như kẻ thù" (nhà 7), "tham lam của cải người khác, hay bệnh tật, suy đồi đạo đức" (nhà 8), "bất kính với cha, kiện tụng thừa kế" (nhà 10), "con cái trắc trở" (nhà 11), "sa đọa thói hư tật xấu, nguy hại" (nhà 12).

### Hành tinh ở nhà 6 → `PLANET_IN_HOUSE[*][5]`
Mỗi hành tinh: "<Hành tinh> in Sixth House" + ASPECTS.pdf / mahadasha.pdf / crux-of-astrology.pdf.
Bỏ: "thiêu rụi bệnh tật" (Mặt Trời), "tai nạn, thương tích, sốt viêm", "bệnh lạ" (Rahu), "đau nhức xương" (Sao Thổ), "thủ đoạn gây thù oán" giữ nhẹ ("dễ gây thù nếu dùng mánh").

## Nhà 8 (thay đổi sâu, bí mật, tài sản chung)

### Cung đứng trên nhà 8 → `SIGN_ON_HOUSE_DEEP[8]`
Nguồn mỗi cung ("<cung đối diện> Rising/Ascendant in depth" + một tài liệu thứ hai): Bạch Dương: Virgo Rising; *Light on Life* · Kim Ngưu: Libra Rising; Beginners astrology Basics 11 · Song Tử: Scorpio Rising; MERCURY MAHADASHA; ASPECTS.pdf · Cự Giải: Sagittarius Rising; Moon in Eighth House · Sư Tử: Capricorn Rising; Sun in Eighth House · Xử Nữ: Aquarius Rising; Brihat Parashara Hora Shastra · Thiên Bình: *Astrology of the Seers*; Full_text_of_Hindu_Predictive_Astrology · Bọ Cạp: Aries Rising; *Light on Life* · Nhân Mã: Taurus Rising; Jupiter in Eighth House · Ma Kết: Gemini Rising; Saturn in Eighth house · Bảo Bình: Cancer Rising; Beginners Astrology 4 · Song Ngư: *Astrology of the Seers*; *Eighth Lord of TRAUMA and TRANSFORMATION*.
Bỏ: "tai nạn và phẫu thuật" (Bạch Dương), "lo âu về cái chết" (Sư Tử), "bệnh tiêu hóa mãn tính" (Xử Nữ), "chấn thương tâm lý kéo dài" (Bọ Cạp), "cứu rỗi" (Song Ngư).

### Chủ nhà 8 đứng ở nhà N → `LORD_IN[7]`, `LORD_IN_TITLE[8]`
Nguồn chung: *Eighth Lord of TRAUMA and TRANSFORMATION*; Brihat Parashara Hora Shastra. Nhà 12: sổ tay ghi tài liệu mâu thuẫn (kinh điển chê, hiện đại khen); trang web nói đúng như vậy.
Bỏ: "đau ốm" (nhà 1), "thiếu thốn tình mẹ" (nhà 4), "nhiều bệnh tật, thuở nhỏ sợ nước" (nhà 6), "hôn nhân dễ đổ vỡ, giảm sức khỏe" (nhà 7), toàn bộ dự đoán tuổi thọ (nhà 8, 11, 12).

### Hành tinh ở nhà 8 → `PLANET_IN_HOUSE[*][7]`
Mỗi hành tinh: "<Hành tinh> in Eighth House" + ASPECTS.pdf / mahadasha.pdf.
Bỏ: "ám ảnh sợ mất mát" (Mặt Trời → "rất sợ mất"), "nguy cơ phẫu thuật", "trường thọ" (Sao Thổ), "nguy cơ biến cố đột ngột" (Rahu → "đời đôi lúc đổi đột ngột"), "tình ái mờ ám" (Sao Kim), "tai nạn, phẫu thuật" (góc chiếu Sao Hỏa).

## Nhà 12 (mất mát, nơi xa, một mình, đời sống tinh thần)

### Cung đứng trên nhà 12 → `SIGN_ON_HOUSE_DEEP[12]`
Nguồn mỗi cung ("<cung đối diện> Rising/Ascendant in depth" + một tài liệu thứ hai): Bạch Dương: Taurus Rising; *Light on Life* · Kim Ngưu: Gemini Rising; Beginners Astrology 3 THE SIGNS · Song Tử: Cancer Rising; ASPECTS.pdf · Cự Giải: Leo Rising; Moon Karmas in All Signs! · Sư Tử: Virgo Rising; Sun in Twelfth House · Xử Nữ: Libra Rising; vedic_astro_textbook.pdf · Thiên Bình: Scorpio Rising; Venus in Twelfth House · Bọ Cạp: Sagittarius Rising; Beginners Astrology 4 · Nhân Mã: Capricorn Rising; Jupiter in Twelfth House · Ma Kết: Aquarius Rising; Saturn in Twelfth house · Bảo Bình: Pisces Rising; *Light on Life* · Song Ngư: Aries Rising; vedic_astro_textbook.pdf.
Bỏ: "căng thẳng thần kinh, mất ngủ" (Song Tử → "bồn chồn và khó ngủ" giữ nhẹ), "bi quan" giữ nhẹ (Ma Kết).

### Chủ nhà 12 đứng ở nhà N → `LORD_IN[11]`, `LORD_IN_TITLE[12]`
Nguồn chung: *Twelfth Lord of LOSS*; Brihat Parashara Hora Shastra; nhà 1, 2, 6, 8 còn có Crux of Astrology; nhà 12 còn có *Secrets of the Bhavas!*. Nhà 12: sổ tay ghi tài liệu mâu thuẫn (kinh điển chê, hiện đại khen); trang web nói đúng như vậy.
Bỏ: "thể chất yếu ớt" (nhà 1), "tuổi thơ thiếu thốn" (nhà 2), "tổn thất nhà đất, thiếu tình thương của mẹ" (nhà 4), "trắc trở con cái" (nhà 5), "quan hệ ngoài luồng, kiện tụng" (nhà 6), "hôn nhân trắc trở, thiếu thỏa mãn lứa đôi" (nhà 7), toàn bộ dự đoán tuổi thọ (nhà 8), "thiếu phúc từ cha" (nhà 10).

### Hành tinh ở nhà 12 → `PLANET_IN_HOUSE[*][11]`
Mỗi hành tinh: "<Hành tinh> in Twelfth House" + mahadasha.pdf / ASPECTS.pdf (Ketu còn có "NEW INSIGHTS! KETU 12TH HOUSE/RAHU 6TH HOUSE").
Bỏ: "trầm cảm" (Mặt Trăng), "bốc đồng tình dục, mất ngủ" (Sao Hỏa), "sợ hãi vô cớ" (Sao Thổ), "cái tôi bị tổn thương" giữ nhẹ (Mặt Trời).

## Câu mở lá số ("đọc vị") → `LETTER_FACE`, `LETTER_NEED`, `LETTER_LINES` (overview.ts)
Một câu duy nhất, ghép từ hai thứ trong lá số: cung mọc (người ta thấy gì lúc mới gặp) và cung Mặt Trăng (lòng cần gì). Chọn câu theo quan hệ hai cung: cùng cung, cùng nhóm lẻ/chẵn, hoặc đối nhau.
Nguồn: 12 bài "<Cung> Rising/Ascendant in depth" (một bài mỗi cung mọc) cho `LETTER_FACE`; "Moon Karmas in All Signs! Vedic Astrology" cho `LETTER_NEED`. Chưa có giờ sinh thì chỉ dùng cung Mặt Trăng.
Đổi lời: "tuyệt đối" (Bọ Cạp) thành "hết lòng"; "lập dị" (Bảo Bình) thành "hơi khác người".

## D2 (Hora) → `D2_FIT`, `D2_UNFIT`, `D2_HOUSES` (vargas.ts)
Brihat Parasara Hora Sastra (chia hora, hành tinh hợp hora nào); "Conjunctions @ The Speed of Light"; Scientific Hindu Astrology Part 1; "Poverty In Astrology", "Saturn in Eleventh house" (nhà 2 là tiền giữ lại, nhà 11 là tiền thực nhận; cần xem chủ nhà 2, 11 và phẩm cấp của chúng trong D2).
Chỗ nguồn mâu thuẫn, nói rõ trong chữ: Sao Hỏa ở hora Mặt Trăng và Sao Kim ở hora Mặt Trời (Parashara coi là ít hợp, nguồn hiện đại coi là hợp theo ngày/đêm). Mặt Trời ở hora Mặt Trăng, Mặt Trăng ở hora Mặt Trời, Sao Thổ ở hora Mặt Trời: nguồn chỉ nói "ít hợp"/"kiềm lại", không có mô tả tâm lý nên chỉ viết đúng bấy nhiêu. Bỏ: "hiếu chiến" (Sao Hỏa) đổi thành "dễ va chạm".

## D9 → `D9_HOUSE`, `D9_STRONG`, `D9_LAGNA_SAME` (varga-houses.ts), `D9_LAGNA`, `D9_SEVENTH`, `D9_SHIFT` (vargas.ts)
Mười hai nhà D9: vedic_astro_textbook.pdf; "DARAKARAKA Soulmate (PART 2) THE HOUSES & Deeper secrets"; Astrology of the Seers; Light on Life; Astrology_at_the_speed_of_light. Mỗi nhà đọc theo ba bước (điều nhà nói, cái giá, người ngoài thấy gì).
Sổ tay ghi rõ "tài liệu mâu thuẫn": có nguồn xem D9 là nửa đời sau hoặc kích hoạt sau kết hôn, nguồn khác nói D9 có từ lúc sinh; và không nguồn nào cho độ tuổi cố định. Vì vậy trang chỉ nói D9 là "lá số khi trưởng thành" (phần chín của lá số chính), không nêu tuổi.
Vargottama cung mọc, Mặt Trời / Mặt Trăng / Sao Kim / Sao Mộc mạnh trong D9: câu trả lời "5 tình huống đặc biệt của D9".
Bỏ: "Mặt Trời mạnh thì cái tôi thiêu đốt hòa khí" giữ nhẹ ("làm mất hòa khí lứa đôi"); "hôn nhân hạnh phúc bền lâu" đổi thành "giữ được một tình cảm bền lâu"; "khủng hoảng tài sản chung" đổi thành "biến cố chung với người thân".
Dòng "chủ nhà đứng ở nhà k" và "hành tinh ngồi trong nhà" của mỗi nhà D9, D10 dùng lại nguyên lý đã có sổ tay ở lá số chính (nhà chủ nhà đứng nối với chuyện của nhà đó) cùng `PLANETS[p].gift/shadow`.

## D10 → `D10_HOUSE` (varga-houses.ts), `D10_LAGNA`, `D10_LORD` (vargas.ts)
Mười hai nhà D10: crux-of-astrology.pdf, vedic_astro_textbook.pdf, mahadasha.pdf.
Sổ tay ghi rõ: có tài liệu bảo chỉ xem nhà 10, chủ nhà 10; có tài liệu bảo đọc toàn diện như lá số chính, ưu tiên cung mọc D10.
Chủ nhà 10 của D10 đứng ở nhà 1 đến 12 → `D10_LORD_IN`: sổ tay ban đầu ghi "không có nguồn". Đã nhờ ChatGPT tìm web, rồi thêm vào nguồn của sổ tay bài "How to Read the D10 (Dashamsha) Chart" (moondasha.com), "How to Read Dashamsha Chart (D-10)" (vijayalur.com), "How to Read the D10 Chart: Career Questions" (kismo.app), "Principles of Divisional Charts" (Sanjay Rath, srath.com). Sổ tay trả lời từ bài của Moon Dasha; bài này là cách hệ thống hóa hiện đại, không phải nguyên văn Parashara, nên chỉ dùng như một cách đọc.
Bỏ/đổi: "nguy cơ mất việc" thành "nỗi lo giữ được việc hay không"; "áp lực nợ nần" giữ ở nhà 8 vì nguồn nói đúng vậy.

## Lời nhắn tháng → `MONTH_THEME`, `MONTH_SUN`, `MONTH_ASK`, `ACTION` (today.ts)
Mặt Trời đi qua từng nhà 1 đến 12 (tính từ cung mọc): điều nhấn mạnh, việc hợp, điều cần cẩn thận. Sổ tay ban đầu chưa có; đã nhờ ChatGPT tìm rồi thêm vào nguồn của sổ tay: "Sun Gochar: Transit Effects in the 12 Houses and 12 Signs" (diastrologer.com), "Surya: The Sun" (jyotish.info), "Gochar: Reading the Moving Sky" (udyogjyotish.com), "Gocara: Results of Transits from the Moon" (E. Wilhelm), Brihat Samhita chương 104 (wisdomlib.org). Sổ tay trả lời dựa trên "Sun Gochar: Transit in 12 Houses", "Surya (Sun) in Vedic Astrology", "Light on Life", "Gocara: Results of Transits".
Mặt Trời thuận ở nhà 3, 6, 10, 11 tính từ Mặt Trăng lúc sinh: khớp bảng cổ điển Phaladeepika chương 26 (`GOCHAR_GOOD`).
Chú ý của ChatGPT: các bảng tốt/xấu cổ điển đếm từ Mặt Trăng; đọc theo cung mọc là lớp diễn giải riêng, không gán cho kinh điển. Trang viết đúng như vậy (nhà tính từ cung mọc nói "chủ đề", còn "thuận/chưa thuận" tính từ Mặt Trăng).
Bỏ: "bệnh kín" (nhà 8) và "sốt nóng" (nhà 1) không đưa vào.
Một tháng dương lịch có thể có hai cung của Mặt Trời nên lời nhắn nói đầu tháng và từ khoảng giữa tháng.

## Đại vận và tiểu vận → `DASHA_*` (dasha-story.ts), `readPeriod`, `pairClass`, `readTrend` (timeline.ts)
Trạng thái: **đã hỏi sổ tay "Chiêm tinh học" ngày 17/11/2026** (ngoài các trang web satyori.com, astropatri.com, jagannathhora.com, dekhopanchang.com, vedicbirth.com, astromedha.in).
- Sổ tay xác nhận: vị trí sao tiểu vận tính từ sao đại vận (4/10, 5/9 tốt; 7 tác động qua lại, nhấn vào quan hệ; 2/12, 6/8 khó nhất; 3/11 có nguồn coi là tốt cho tăng trưởng, có nguồn nói phải bỏ nhiều công) và bạn/thù làm nhẹ hay nặng kết quả; nguồn: Astrology of the Seers, Beginners Astrology Basics 12, mahadasha.pdf, Scientific Hindu Astrology Part 1, Hindu Predictive Astrology. Câu của thế 3/11 đã sửa theo đó.
- Sổ tay xác nhận: tiểu vận làm nổi lên nhà sao đó cai quản, nhà nó đứng và nhà nó chiếu tới (Astrology of the Seers; Light on Life; mahadasha.pdf) → câu `DASHA_LOOKS`.
- `DASHA_CLASSIC` (điều sách cổ tả cho giai đoạn của từng sao khi mạnh và khi yếu): sổ tay, theo Brihat Parashara Hora Shastra và Hindu Predictive Astrology; kể lại bằng lời thường, bỏ phần bệnh tật.
- Cách đọc tiểu vận (Parashari): trước hết xem tình trạng sinh ra của sao (mạnh yếu, nhà nó cai quản và ngồi, đồng cung hay bị nhìn, bị cháy, nghịch hành), sau đó quan hệ với sao của đại vận. Vị trí sao tiểu vận tính từ sao đại vận: 3 và 11 tốt nhất, 4 và 10 tốt, 5 và 9 hợp đạo lý, 7 đối diện, 2 và 12 hạn chế, 6 và 8 khó. Quan hệ bạn/thù lấy từ bảng năm bậc của Parashara.
- Điều mỗi sao đại diện (Thủy: học, viết, nói, buôn bán, đi lại ngắn, anh chị em và người trẻ; Mộc: thầy, học lên cao, con cái, của cải; Kim: tình cảm, nghệ thuật, tiện nghi; Hỏa: hành động, đất đai, anh em; Thổ: gánh trách nhiệm, việc lâu dài; Mặt Trời: vai trò, cấp trên; Mặt Trăng: mẹ, cảm xúc, nơi ở; Rahu: cái mới, nước ngoài, cơ hội bất thường; Ketu: buông, tâm linh) là phần nghĩa chung (karakatwa) mọi trang trên đều nói giống nhau.
- **Phần riêng của trang này, không gán cho kinh điển:** nhãn "thuận lợi / có thuận có khó / nhiều khó khăn" là phép cộng điểm do trang tự tính từ các yếu tố trên; xu hướng "đỡ dần / giữ nguyên / khó hơn dần" là tính từ vị trí Mộc và Thổ đi qua ở 4 mốc trong tiểu vận. Mốc giờ sinh không chắc thì tiểu vận ghi "gần đúng".

## Luận nhà thành một câu chuyện → `STORY_*` (content/story.ts), `houseStory`, `lightWindows` (story.ts)
- Các câu nối (chủ nhà là bạn hay không thân với sao ngồi trong nhà, hai sao cùng nhà, sao mạnh hay yếu) dựa vào bảng năm bậc bạn/thù, bảng đắc vị và cháy sáng của Parashara; xem phần "Nhà 7" trở xuống cho các câu về cung, chủ nhà và sao trong nhà (ba nhịp được cắt ra rồi ghép lại, không thêm ý).
- Mục "Khi nào chuyện này nổi lên": nguyên tắc nhà được bật lên khi chủ nhà hoặc sao ngồi trong nhà nắm đại vận hoặc tiểu vận (cùng nguồn như trên). Chỉ liệt kê mốc có độ tin cậy "chắc" hoặc "gần đúng".

## Chín vị thần và biểu tượng → `DEITY`, `DAY_OF`, `GEM_OF` (src/ui/deities.ts), `Emblem.tsx`
- Thần chủ (adhi devata), thần thứ hai (pratyadhi devata) và đá gắn với từng hành tinh: bảng trên Indian Divinity, "Navagraha" (webonautics.com/mythology/navagraha.html). Mô tả ngắn của thần (thần Lửa, nữ thần Nước, nữ thần Đất, đấng gìn giữ, vua của các vị thần, hoàng hậu của các vị thần, thần của cái chết, nữ thần của sức mạnh, thần của nghiệp) lấy từ cùng bảng.
- Tên ngày trong tuần của bảy hành tinh: Wikipedia, "Navagraha".
- Các nguồn khác gán khác (ví dụ Ganesha cho Ketu, thần Indra và Indrani đổi chỗ trong một số bảng); trang chọn một bảng và nói rõ ở trang Phương pháp.
- **Phần riêng của trang này:** biểu tượng SVG (tia mặt trời, trăng lưỡi liềm, mũi giáo, bánh xe, chày kim cương, hoa sen, đồng hồ cát, hai hình móng ngựa của Rahu và Ketu) do trang tự vẽ để trang trí, không tuyên bố đó là biểu tượng chính thức của vị thần nào, và không vẽ hình người.
- Nền vũ trụ: thứ tự quay quanh Trái Đất theo thứ tự cổ (Mặt Trăng, Sao Thủy, Sao Kim, Mặt Trời, Sao Hỏa, Sao Mộc, Sao Thổ); tốc độ là tốc độ minh họa, vị trí xuất phát là vị trí thật. Chỉ để trang trí.

## Đoạn phim mở đầu → `Intro.tsx`, `intro-film.ts`, `intro-audio.ts`, `intro-deva.ts`
**Tài nguyên: không có ảnh chụp, video hay bản ghi âm nào.** Mọi hình đều dựng bằng mã trên canvas: sao, thiên hà, đền, người quan sát, đèn dầu, lá cọ, sơ đồ, quỹ đạo, lá số, người đứng bên hồ, vòng sáng.
- Chữ Devanagari ज्योतिष (jyotiṣa), नवग्रह (navagraha), नक्षत्र (nakṣatra): nét chữ lấy từ phông Noto Serif Devanagari (The Noto Project Authors, giấy phép SIL Open Font License 1.1, gói npm `@fontsource/noto-serif-devanagari` 5.3.0), dàn chữ bằng HarfBuzz rồi lưu thành đường vẽ. Đây là tên thuật ngữ, không phải câu chú hay câu tụng.
- Âm thanh: tự tổng hợp bằng Web Audio API (nền ngân trên D và A như tanpura giữ âm chủ và âm năm, tiếng gảy kiểu tanpura, lớp đệm, gió, chuông kim loại). Không có tiếng tụng, không mantra, không giọng đọc. Mặc định tắt tiếng; bật bằng nút.
- Lá số trong cảnh 4 là hình minh họa: các hành tinh được đặt tùy ý để vẽ, không lấy từ dữ liệu sinh của ai.
- Thứ tự quỹ đạo quanh Trái Đất (Mặt Trăng, Thủy, Kim, Mặt Trời, Hỏa, Mộc, Thổ) theo thứ tự cổ; Rahu và Ketu vẽ thành hai điểm giao giữa đường đi của Mặt Trăng và hoàng đạo, rỗng ruột, không phải hành tinh. Vòng ngoài có 12 vạch cung và 27 vạch nakshatra.
- Lời kể giữ đúng các lưu ý trong bản yêu cầu: không nói Jyotish hiện đại có nguyên vẹn từ hàng nghìn năm trước, không hứa đoán tương lai, "món quà của vũ trụ" là cách nói thi ca.

## Cặp sao ngồi cùng nhau và 12 nhà khi mạnh/yếu → `CONJ` (content/conjunctions.ts), `HOUSE_CLASSIC` (content/story.ts)
- `CONJ`: sổ tay "Chiêm tinh học", trả lời 17/11/2026, chủ yếu theo "Conjunctions @ The Speed of Light", thêm Scientific Hindu Astrology Part 1, ASPECTS.pdf, mahadasha.pdf và các ghi chú riêng từng cặp trong sổ. 35 cặp (Rahu và Ketu luôn đối nhau nên không thành cặp). Kể lại nhẹ nhàng, bỏ phần bệnh tật và bạo lực.
- `HOUSE_CLASSIC`: sổ tay, trả lời 17/11/2026 (Brihat Parashara Hora Shastra; Light on Life; Hindu Predictive Astrology; Astrology of the Seers; các ghi chú chủ nhà trong sổ). Chọn câu "mạnh", "yếu" hay "hai mặt" theo màu của nhà mà trang đã tính.

## Việc sổ tay không nói rõ (chưa dùng)
- "Chủ nhà ở cung không thân thì kết quả muộn hơn": câu này đang nằm ở lớp gập "chủ nhà" của mọi nhà và chưa tìm thấy dòng nguồn trực tiếp. Sẽ hỏi lại sổ tay.
- Điểm hỗ trợ (SAV) thấp nghĩa là "kết quả muộn hơn": **không có nguồn**; đã đổi thành "hành tinh đi qua được nâng đỡ ít hơn" ở dòng tóm tắt.

# Bộ máy đọc lá số (v3.x)

Jyotish Parashara · Lahiri · Whole Sign · Vimshottari. Mọi câu văn đi ra từ `src/reading/facts.ts` (độ mạnh hành tinh, nhà, yoga); không có câu nào do giao diện tự viết.

## Varga (khóa phương pháp, `src/engine/vargas.ts`)
| Chart | Quy tắc |
|---|---|
| D2 Hora | cung lẻ: 15° đầu Sư Tử (Mặt Trời), 15° sau Cự Giải (Mặt Trăng); cung chẵn ngược lại |
| D3 Drekkana | phần 1 chính nó, phần 2 cung thứ 5, phần 3 cung thứ 9 |
| D4 Chaturthamsha | 7°30′: chính nó, rồi cung thứ 4, 7, 10 |
| D7 Saptamsha | cung lẻ đếm từ chính nó, cung chẵn từ cung thứ 7 |
| D9 Navamsha | 3°20′ chuẩn |
| D10 Dashamsha | cung lẻ từ chính nó, cung chẵn từ cung thứ 9 |

Sai số giờ sinh: `stability.ts` lấy mẫu trong cửa sổ sai số, xem cung mọc và vị trí các hành tinh ở mỗi chart có đổi cung không. Chắc: không đổi. Một phần: cung mọc giữ nguyên, vài hành tinh đổi. Thấp: cung mọc đổi (không đọc theo nhà).

## Các engine văn bản
`overview3.ts`, `housenarr.ts` (8 hướng kể), `nodes.ts` (12 yếu tố), `vargas3.ts`, `timeline.ts` (6 lớp đại vận), `skypage.ts` (Gochara từ Mặt Trăng / từ cung mọc), `forecast.ts` (2027), `explore.ts`, `compat.ts`.

## Dự đoán 2027
Đi từng ngày của năm bằng ephemeris: hành tinh chậm (Mộc, Thổ, Rahu, Ketu, Hỏa) đổi cung, đổi chiều; Mộc/Thổ/Rahu/Ketu trùng hoặc đối một hành tinh/điểm mọc của lá số trong orb 1,5°. Mỗi tháng: nhà Mặt Trời đi qua (D1), Mộc + Thổ làm nền, Vimshottari giữa tháng.

## Kiểm thử
`npm test` (34 test), `npm run lint:reading` (12 lá số), `node scripts/smoke.cjs` (trình duyệt, desktop + mobile).

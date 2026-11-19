// Usage: node scripts/notebook/make-queue.mjs 3 4 5 6 8 9 11 12 > scripts/notebook/queue.json
// Builds the three NotebookLM questions (signs / lord / planets) for each house given on the command line.
const PRE = 'Chỉ dùng tài liệu trong sổ này. Bỏ qua mọi nội dung về cúng bái, mantra, đá quý, giải hạn, lời nguyền và kiếp trước. Trả lời bằng tiếng Việt đơn giản, gạch đầu dòng, mỗi dòng tối đa 40 từ, nói hành vi và tâm lý cụ thể của người đó: điểm mạnh, cái giá phải trả, người khác thấy gì ở họ. Cuối mỗi dòng ghi tên tài liệu nguồn. Nếu tài liệu không nói về mục nào thì ghi "không có nguồn" và không suy đoán; nếu các tài liệu mâu thuẫn thì ghi ngắn gọn. ';
const TOPIC = {
  1: "bản thân, Lagna", 2: "tiền tích lũy, lời nói, gia đình gốc", 3: "can đảm, kỹ năng, anh chị em, giao tiếp",
  4: "nhà cửa, mẹ, cảm giác an toàn, nền tảng", 5: "sáng tạo, tình yêu, con cái, học hành", 6: "công việc hằng ngày, sức khỏe nền, nợ nần, đối thủ",
  7: "bạn đời, đối tác, hôn nhân", 8: "thay đổi sâu, bí mật, tài sản chung, khủng hoảng", 9: "niềm tin, thầy, vận may, đi xa",
  10: "nghề nghiệp, danh tiếng, vị thế xã hội", 11: "thu nhập, bạn bè, mục tiêu, mạng lưới", 12: "mất mát, nơi xa, cô độc, đời sống tinh thần",
};
const out = [];
for (const arg of process.argv.slice(2)) {
  const n = Number(arg), t = TOPIC[n];
  out.push({ label: `h${n}-signs`, q: PRE + `12 cung hoàng đạo (Bạch Dương đến Song Ngư) lần lượt nằm ở nhà ${n} (${t}): mỗi cung một dòng, nói người có cung đó ở nhà ${n} thường thế nào, tìm gì, cái giá là gì, người khác thấy gì. Mỗi cung một dòng, đúng thứ tự.` });
  out.push({ label: `h${n}-lord`, q: PRE + `Hành tinh cai quản nhà ${n} (${t}) lần lượt đứng ở các nhà từ nhà 1 đến nhà 12: mỗi vị trí một dòng, nói người đó thường thế nào, tìm gì, cái giá là gì, người khác thấy gì. Mỗi nhà một dòng, đúng thứ tự.` });
  out.push({ label: `h${n}-planets`, q: PRE + `Chín hành tinh (Mặt Trời, Mặt Trăng, Sao Hỏa, Sao Thủy, Sao Mộc, Sao Kim, Sao Thổ, Rahu, Ketu) ngồi trong nhà ${n} (${t}): mỗi hành tinh ảnh hưởng thế nào đến chuyện của nhà này, người đó tìm gì, và mặt khó là gì? Mỗi hành tinh một dòng. Rồi thêm 3 dòng cho góc chiếu vào nhà này của Sao Mộc, Sao Thổ và Sao Hỏa.` });
}
console.log(JSON.stringify(out, null, 1));

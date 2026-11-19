// Paste into the browser console (or the built-in browser's javascript tool) on the NotebookLM page of the "Chiêm tinh học" notebook,
// with the chat tab ("Trò chuyện") open. Then:
//   window.__Q = { queue: [...questions], labels: [...labels] }   // from queue.json
//   await window.__send(0)           // sends question 0
//   window.__read(0)                 // poll until .done is true and .len stops changing; .ans is the answer text (clean it with __clean)
// Do NOT run long timer loops inside the page: a hidden tab throttles chained timers to about one per minute. Drive it with short calls instead.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
window.__P = () => window.__Q.queue[0].slice(0, 80); // all questions share this long preamble; we count how often it appears on the page
window.__occ = () => { const b = document.body.innerText; const pos = []; let i = -1; while ((i = b.indexOf(window.__P(), i + 1)) >= 0) pos.push(i); return { b, pos }; };
window.__send = async (i) => {
  const q = window.__Q.queue[i];
  const ta = [...document.querySelectorAll("textarea")].find((t) => t.getBoundingClientRect().width > 0); // the first textarea is hidden (0x0)
  ta.focus(); ta.select(); document.execCommand("delete"); document.execCommand("insertText", false, q);
  await sleep(500);
  let el = ta, btn = null;
  for (let k = 0; k < 10 && el && !btn; k++) { el = el.parentElement; if (!el) break; btn = [...el.querySelectorAll("button")].find((b) => /gửi/i.test((b.getAttribute("aria-label") || "") + b.innerText) && !b.disabled); }
  if (btn) btn.click(); else ta.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true }));
  return !!btn;
};
window.__read = (i) => { const { b, pos } = window.__occ(); const seg = b.slice(pos[pos.length - 1] || 0); return { n: pos.length, len: seg.length, done: seg.includes("keep_pin"), ans: seg.slice(window.__Q.queue[i].length).split("keep_pin")[0] }; };
window.__clean = (t) => t.replace(/\nmore_horiz\n/g, " ").replace(/\n\d+\n\d+\n/g, " ").replace(/\n(\d+)(?=\n)/g, "");

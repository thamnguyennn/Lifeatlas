import { useId, useMemo, useRef, useState } from "react";
import { PLACE_OPTIONS, CANH_GIO, type PlaceOption } from "../engine/places.ts";
import { resolveCivilTime, type PlaceInput } from "../engine/vn-time.ts";
import { LUNAR_YEAR_NAMES } from "../engine/lunar-vn.ts";
import { resolveDate, localMinuteOf, MIN_YEAR, MAX_YEAR, type FormValues, type CalendarKind, type TimeKind } from "./logic.ts";

const fold = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();

const OFFSETS: { label: string; min: number }[] = [
  ...[-12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((h) => ({ label: `UTC${h < 0 ? "−" : "+"}${Math.abs(h)}`, min: h * 60 })),
  { label: "UTC+5:30", min: 330 }, { label: "UTC+5:45", min: 345 },
  ...[6, 7, 8, 9].map((h) => ({ label: `UTC+${h}`, min: h * 60 })), { label: "UTC+9:30", min: 570 },
  ...[10, 11, 12, 13, 14].map((h) => ({ label: `UTC+${h}`, min: h * 60 })),
].sort((a, b) => a.min - b.min);

export interface IntakeInitial { values?: FormValues }

export const SAMPLE: FormValues = {
  name: "Minh Anh (mẫu)", calendar: "solar", day: 23, month: 5, year: 1990, leap: false, timeKind: "exact", hh: 8, mm: 40, canhId: "thin",
  place: { name: "Huế", lat: 16.4637, lon: 107.5909, country: "VN" },
};

function Segmented<T extends string>({ value, onChange, options, label }: {
  value: T; onChange: (v: T) => void; options: { v: T; text: string }[]; label: string;
}) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.v} type="button" role="radio" aria-checked={value === o.v} className={value === o.v ? "on" : ""} onClick={() => onChange(o.v)}>
          {o.text}
        </button>
      ))}
    </div>
  );
}

function PlaceBox({ value, onPick }: { value: PlaceInput | null; onPick: (p: PlaceInput | null) => void }) {
  const id = useId();
  const [q, setQ] = useState(value?.name ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    const f = fold(q.trim());
    if (!f) return PLACE_OPTIONS.slice(0, 8);
    const starts = PLACE_OPTIONS.filter((p) => fold(p.label).startsWith(f));
    const has = PLACE_OPTIONS.filter((p) => !starts.includes(p) && fold(p.label).includes(f));
    return [...starts, ...has].slice(0, 8);
  }, [q]);

  const choose = (p: PlaceOption) => { setQ(p.label); setOpen(false); onPick(p.place); };

  return (
    <div className="combo">
      <input
        ref={ref} id={id} className="input" autoComplete="off" placeholder="Gõ tên tỉnh / thành, ví dụ: Đà Nẵng"
        role="combobox" aria-expanded={open} aria-controls={`${id}-list`} aria-autocomplete="list"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); if (value) onPick(null); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, matches.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          else if (e.key === "Enter" && open && matches[active]) { e.preventDefault(); choose(matches[active]); }
          else if (e.key === "Escape") setOpen(false);
        }}
      />
      {open && matches.length > 0 && (
        <ul id={`${id}-list`} className="combo-list" role="listbox">
          {matches.map((p, i) => (
            <li key={p.id} role="option" aria-selected={i === active} className={i === active ? "on" : ""}
              onMouseDown={(e) => { e.preventDefault(); choose(p); }} onMouseEnter={() => setActive(i)}>
              <span>{p.label}</span>
              <small>{p.place.country === "VN" ? "Việt Nam" : "Nước ngoài"}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Intake({ initial, onSubmit }: { initial?: FormValues; onSubmit: (v: FormValues) => void }) {
  const uid = useId();
  const [name, setName] = useState(initial?.name ?? "");
  const [calendar, setCalendar] = useState<CalendarKind>(initial?.calendar ?? "solar");
  const [day, setDay] = useState(initial ? String(initial.day) : "");
  const [month, setMonth] = useState(initial ? String(initial.month) : "");
  const [year, setYear] = useState(initial ? String(initial.year) : "");
  const [leap, setLeap] = useState(initial?.leap ?? false);
  const [timeKind, setTimeKind] = useState<TimeKind>(initial?.timeKind ?? "exact");
  const [hh, setHh] = useState(initial && initial.timeKind === "exact" ? String(initial.hh) : "");
  const [mm, setMm] = useState(initial && initial.timeKind === "exact" ? String(initial.mm) : "");
  const [canhId, setCanhId] = useState(initial?.canhId ?? "ty");
  const [place, setPlace] = useState<PlaceInput | null>(initial?.place ?? null);
  const [manual, setManual] = useState(false);
  const [mLat, setMLat] = useState(""); const [mLon, setMLon] = useState("");
  const [mCountry, setMCountry] = useState<"VN" | "OTHER">("OTHER");
  const [offsetOn, setOffsetOn] = useState(false);
  const [offsetMin, setOffsetMin] = useState(420);
  const [tried, setTried] = useState(false);

  const effPlace: PlaceInput | null = useMemo(() => {
    let p: PlaceInput | null = place;
    if (manual) {
      const lat = parseFloat(mLat.replace(",", ".")), lon = parseFloat(mLon.replace(",", "."));
      if (Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
        p = { name: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`, lat, lon, country: mCountry, tz: mCountry === "OTHER" ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined };
      } else p = null;
    }
    return p && offsetOn ? { ...p, fixedOffsetMin: offsetMin } : p;
  }, [place, manual, mLat, mLon, mCountry, offsetOn, offsetMin]);

  const nums = { d: parseInt(day, 10), m: parseInt(month, 10), y: parseInt(year, 10) };
  const dateBase = { calendar, day: nums.d, month: nums.m, year: nums.y, leap, place: effPlace ?? { name: "", lat: 21, lon: 105.8, country: "VN" as const } };
  const filled = day !== "" && month !== "" && year.length === 4;
  const date = filled ? resolveDate(dateBase) : null;

  const hNum = parseInt(hh, 10), mNum = parseInt(mm === "" ? "0" : mm, 10);
  const timeOk = timeKind !== "exact" || (hh !== "" && hNum >= 0 && hNum <= 23 && mNum >= 0 && mNum <= 59);

  const draft: FormValues | null = date?.ok && effPlace && timeOk ? {
    name: name.trim(), calendar, day: nums.d, month: nums.m, year: nums.y, leap, timeKind,
    hh: timeKind === "exact" ? hNum : 0, mm: timeKind === "exact" ? mNum : 0, canhId, place: effPlace,
  } : null;

  const timeInfo = useMemo(() => {
    if (!draft || !date?.ok || !date.solar) return null;
    const [d, m, y] = date.solar;
    const min = localMinuteOf(draft);
    return resolveCivilTime(y, m, d, Math.floor(min / 60), min % 60, draft.place);
  }, [draft, date]);

  const errors: string[] = [];
  if (tried) {
    if (!filled) errors.push("Hãy nhập đủ ngày, tháng và năm sinh (năm gồm 4 chữ số).");
    else if (date && !date.ok) errors.push(date.error ?? "Ngày sinh không hợp lệ.");
    if (!effPlace) errors.push(manual ? "Tọa độ chưa hợp lệ (vĩ độ −90…90, kinh độ −180…180)." : "Hãy chọn nơi sinh trong danh sách, hoặc nhập tọa độ.");
    if (!timeOk) errors.push("Giờ sinh chưa hợp lệ (giờ 0–23, phút 0–59).");
  }
  const lunarName = date?.ok && date.lunar ? LUNAR_YEAR_NAMES(date.lunar.year) : "";

  return (
    <form
      className="intake card glow" id="form" noValidate
      onSubmit={(e) => { e.preventDefault(); setTried(true); if (draft) onSubmit(draft); }}
    >
      <div className="intake-head">
        <h2>Nhập thông tin sinh</h2>
        <p>Chỉ cần ngày, giờ và nơi sinh.</p>
      </div>

      <div className="field">
        <label htmlFor={`${uid}-name`}>Tên hoặc biệt danh <span className="opt">(không bắt buộc)</span></label>
        <input id={`${uid}-name`} className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="Để trang gọi bạn cho thân mật" />
      </div>

      <fieldset className="field">
        <legend>Ngày sinh</legend>
        <Segmented<CalendarKind> label="Loại lịch" value={calendar} onChange={setCalendar} options={[{ v: "solar", text: "Dương lịch" }, { v: "lunar", text: "Âm lịch" }]} />
        <div className="row3">
          <label className="mini"><span>Ngày</span><input id={`${uid}-day`} className="input" inputMode="numeric" maxLength={2} placeholder="dd" value={day} onChange={(e) => setDay(e.target.value.replace(/\D/g, ""))} aria-label="Ngày" /></label>
          <label className="mini"><span>Tháng</span><input id={`${uid}-month`} className="input" inputMode="numeric" maxLength={2} placeholder="mm" value={month} onChange={(e) => setMonth(e.target.value.replace(/\D/g, ""))} aria-label="Tháng" /></label>
          <label className="mini wide"><span>Năm</span><input id={`${uid}-year`} className="input" inputMode="numeric" maxLength={4} placeholder="yyyy" value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))} aria-label="Năm" /></label>
        </div>
        {calendar === "lunar" && (
          <label className="check"><input id={`${uid}-leap`} type="checkbox" checked={leap} onChange={(e) => setLeap(e.target.checked)} /> Tháng nhuận</label>
        )}
        <div className="live" aria-live="polite">
          {date?.ok && date.solar && date.lunar && (
            calendar === "solar"
              ? <>Âm lịch: <b>{date.lunar.day}/{date.lunar.month}{date.lunar.leap ? " nhuận" : ""}/{date.lunar.year}</b> ({lunarName})</>
              : <>Dương lịch: <b>{String(date.solar[0]).padStart(2, "0")}/{String(date.solar[1]).padStart(2, "0")}/{date.solar[2]}</b> ({lunarName})</>
          )}
          {date && !date.ok && <span className="bad">{date.error}</span>}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>Giờ sinh</legend>
        <Segmented<TimeKind> label="Cách nhập giờ" value={timeKind} onChange={setTimeKind}
          options={[{ v: "exact", text: "Giờ chính xác" }, { v: "canh", text: "Canh giờ" }, { v: "unknown", text: "Không rõ giờ" }]} />
        {timeKind === "exact" && (
          <div className="row3 time">
            <label className="mini"><span>Giờ (0–23)</span><input id={`${uid}-hh`} className="input" inputMode="numeric" maxLength={2} placeholder="hh" value={hh} onChange={(e) => setHh(e.target.value.replace(/\D/g, ""))} aria-label="Giờ" /></label>
            <label className="mini"><span>Phút</span><input id={`${uid}-mm`} className="input" inputMode="numeric" maxLength={2} placeholder="mm" value={mm} onChange={(e) => setMm(e.target.value.replace(/\D/g, ""))} aria-label="Phút" /></label>
          </div>
        )}
        {timeKind === "canh" && (
          <select id={`${uid}-canh`} className="input" value={canhId} onChange={(e) => setCanhId(e.target.value)} aria-label="Canh giờ">
            {CANH_GIO.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
        {timeKind === "unknown" && <p className="hint">Không có giờ sinh thì chưa có cung mọc và 12 nhà; các phần khác vẫn đọc được.</p>}
      </fieldset>

      <fieldset className="field">
        <legend>Nơi sinh</legend>
        {!manual ? <PlaceBox value={place} onPick={setPlace} /> : (
          <div className="row3 coords">
            <label className="mini"><span>Vĩ độ (Bắc +)</span><input id={`${uid}-lat`} className="input" inputMode="decimal" placeholder="16.46" value={mLat} onChange={(e) => setMLat(e.target.value)} /></label>
            <label className="mini"><span>Kinh độ (Đông +)</span><input id={`${uid}-lon`} className="input" inputMode="decimal" placeholder="107.59" value={mLon} onChange={(e) => setMLon(e.target.value)} /></label>
            <label className="mini"><span>Nơi sinh ở</span>
              <select id={`${uid}-country`} className="input" value={mCountry} onChange={(e) => setMCountry(e.target.value as "VN" | "OTHER")}><option value="VN">Việt Nam</option><option value="OTHER">Nước ngoài</option></select>
            </label>
          </div>
        )}
        <button type="button" className="linkbtn" onClick={() => setManual((m) => !m)}>{manual ? "← Chọn từ danh sách" : "Không thấy nơi sinh? Nhập tọa độ"}</button>
      </fieldset>

      {timeInfo && (
        <div className={`callout ${timeInfo.notes.some((n) => n.level === "check") || timeInfo.anomaly !== "none" ? "check" : "info"}`} aria-live="polite">
          <strong>Giờ chuẩn quốc tế: {timeInfo.label}</strong>
          {timeInfo.anomaly === "gap" && <p>Giờ này không tồn tại trên đồng hồ hôm đó (đồng hồ nhảy giờ). Hãy kiểm tra lại giờ trên giấy khai sinh.</p>}
          {timeInfo.anomaly === "repeat" && <p>Giờ này xuất hiện hai lần hôm đó (đồng hồ lùi giờ). Trang dùng lần đầu tiên.</p>}
          {timeInfo.notes.map((n, i) => <p key={i} className={n.level}>{n.text}</p>)}
          <label className="check"><input id={`${uid}-offset-on`} type="checkbox" checked={offsetOn} onChange={(e) => setOffsetOn(e.target.checked)} /> Tôi muốn tự chọn múi giờ</label>
          {offsetOn && (
            <select id={`${uid}-offset`} className="input" value={offsetMin} onChange={(e) => setOffsetMin(Number(e.target.value))} aria-label="Múi giờ">
              {OFFSETS.map((o) => <option key={o.min} value={o.min}>{o.label}</option>)}
            </select>
          )}
        </div>
      )}

      {errors.length > 0 && <ul className="errors" role="alert">{errors.map((e) => <li key={e}>{e}</li>)}</ul>}

      <button className="btn primary big" type="submit">Mở lá số <span aria-hidden="true">→</span></button>
    </form>
  );
}

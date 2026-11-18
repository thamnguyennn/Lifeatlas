// A compact place list so the form works offline. Coordinates are city centres
// (accurate to a few hundred metres, which moves the Lagna by well under a minute of arc).
import type { PlaceInput } from "./vn-time.ts";

type VN = [name: string, lat: number, lon: number];
const VN_PLACES: VN[] = [
  ["Hà Nội", 21.0285, 105.8542], ["Hải Phòng", 20.8449, 106.6881], ["Hạ Long (Quảng Ninh)", 20.95, 107.08],
  ["Bắc Ninh", 21.1861, 106.0763], ["Hải Dương", 20.9373, 106.3146], ["Hưng Yên", 20.6464, 106.0511],
  ["Phủ Lý (Hà Nam)", 20.5411, 105.9139], ["Nam Định", 20.4388, 106.1621], ["Thái Bình", 20.4463, 106.3366],
  ["Ninh Bình", 20.2506, 105.9745], ["Vĩnh Yên (Vĩnh Phúc)", 21.3091, 105.6049], ["Việt Trì (Phú Thọ)", 21.3227, 105.402],
  ["Thái Nguyên", 21.5928, 105.8442], ["Bắc Giang", 21.2731, 106.1946], ["Lạng Sơn", 21.8537, 106.7615],
  ["Cao Bằng", 22.6657, 106.2522], ["Bắc Kạn", 22.147, 105.8348], ["Tuyên Quang", 21.8236, 105.2181],
  ["Hà Giang", 22.8233, 104.9836], ["Lào Cai", 22.4856, 103.9707], ["Yên Bái", 21.7168, 104.8986],
  ["Sơn La", 21.3256, 103.9188], ["Điện Biên Phủ", 21.386, 103.023], ["Lai Châu", 22.3964, 103.458],
  ["Hòa Bình", 20.8133, 105.3383], ["Thanh Hóa", 19.8067, 105.7852], ["Vinh (Nghệ An)", 18.6796, 105.6813],
  ["Hà Tĩnh", 18.3428, 105.9057], ["Đồng Hới (Quảng Bình)", 17.4689, 106.6222], ["Đông Hà (Quảng Trị)", 16.8163, 107.1003],
  ["Huế", 16.4637, 107.5909], ["Đà Nẵng", 16.0544, 108.2022], ["Tam Kỳ (Quảng Nam)", 15.5736, 108.474],
  ["Hội An", 15.8801, 108.338], ["Quảng Ngãi", 15.1205, 108.7923], ["Quy Nhơn (Bình Định)", 13.7765, 109.2237],
  ["Tuy Hòa (Phú Yên)", 13.0955, 109.3209], ["Nha Trang (Khánh Hòa)", 12.2388, 109.1967],
  ["Phan Rang (Ninh Thuận)", 11.5646, 108.9886], ["Phan Thiết (Bình Thuận)", 10.9289, 108.1021],
  ["Kon Tum", 14.3497, 108.0005], ["Pleiku (Gia Lai)", 13.9833, 108.0], ["Buôn Ma Thuột (Đắk Lắk)", 12.6667, 108.05],
  ["Gia Nghĩa (Đắk Nông)", 12.003, 107.69], ["Đà Lạt (Lâm Đồng)", 11.9404, 108.4583],
  ["TP. Hồ Chí Minh", 10.7769, 106.7009], ["Biên Hòa (Đồng Nai)", 10.9447, 106.8243],
  ["Thủ Dầu Một (Bình Dương)", 10.9804, 106.6519], ["Vũng Tàu", 10.346, 107.0843], ["Tây Ninh", 11.3131, 106.0963],
  ["Đồng Xoài (Bình Phước)", 11.5349, 106.8836], ["Tân An (Long An)", 10.5359, 106.4136], ["Mỹ Tho (Tiền Giang)", 10.36, 106.36],
  ["Bến Tre", 10.2434, 106.3756], ["Vĩnh Long", 10.2538, 105.9722], ["Trà Vinh", 9.9347, 106.3453],
  ["Cao Lãnh (Đồng Tháp)", 10.46, 105.633], ["Long Xuyên (An Giang)", 10.3759, 105.4185], ["Châu Đốc", 10.7, 105.1167],
  ["Cần Thơ", 10.0452, 105.7469], ["Vị Thanh (Hậu Giang)", 9.784, 105.47], ["Sóc Trăng", 9.6025, 105.9739],
  ["Bạc Liêu", 9.294, 105.7216], ["Cà Mau", 9.1769, 105.1524], ["Rạch Giá (Kiên Giang)", 10.0125, 105.0809],
  ["Phú Quốc", 10.227, 103.967],
];

type Abroad = [name: string, lat: number, lon: number, tz: string];
const ABROAD: Abroad[] = [
  ["Bangkok, Thái Lan", 13.7563, 100.5018, "Asia/Bangkok"], ["Phnom Penh, Campuchia", 11.5564, 104.9282, "Asia/Phnom_Penh"],
  ["Viêng Chăn, Lào", 17.9757, 102.6331, "Asia/Vientiane"], ["Singapore", 1.3521, 103.8198, "Asia/Singapore"],
  ["Kuala Lumpur, Malaysia", 3.139, 101.6869, "Asia/Kuala_Lumpur"], ["Jakarta, Indonesia", -6.2088, 106.8456, "Asia/Jakarta"],
  ["Manila, Philippines", 14.5995, 120.9842, "Asia/Manila"], ["Hồng Kông", 22.3193, 114.1694, "Asia/Hong_Kong"],
  ["Đài Bắc, Đài Loan", 25.033, 121.5654, "Asia/Taipei"], ["Thượng Hải, Trung Quốc", 31.2304, 121.4737, "Asia/Shanghai"],
  ["Bắc Kinh, Trung Quốc", 39.9042, 116.4074, "Asia/Shanghai"], ["Tokyo, Nhật Bản", 35.6762, 139.6503, "Asia/Tokyo"],
  ["Seoul, Hàn Quốc", 37.5665, 126.978, "Asia/Seoul"], ["Paris, Pháp", 48.8566, 2.3522, "Europe/Paris"],
  ["London, Anh", 51.5074, -0.1278, "Europe/London"], ["Berlin, Đức", 52.52, 13.405, "Europe/Berlin"],
  ["Praha, Séc", 50.0755, 14.4378, "Europe/Prague"], ["Warsaw, Ba Lan", 52.2297, 21.0122, "Europe/Warsaw"],
  ["Moskva, Nga", 55.7558, 37.6173, "Europe/Moscow"], ["Sydney, Úc", -33.8688, 151.2093, "Australia/Sydney"],
  ["Melbourne, Úc", -37.8136, 144.9631, "Australia/Melbourne"], ["Brisbane, Úc", -27.4698, 153.0251, "Australia/Brisbane"],
  ["Perth, Úc", -31.9505, 115.8605, "Australia/Perth"], ["Auckland, New Zealand", -36.8485, 174.7633, "Pacific/Auckland"],
  ["Los Angeles, Mỹ", 34.0522, -118.2437, "America/Los_Angeles"], ["San Jose, Mỹ", 37.3382, -121.8863, "America/Los_Angeles"],
  ["Seattle, Mỹ", 47.6062, -122.3321, "America/Los_Angeles"], ["Houston, Mỹ", 29.7604, -95.3698, "America/Chicago"],
  ["Dallas, Mỹ", 32.7767, -96.797, "America/Chicago"], ["Chicago, Mỹ", 41.8781, -87.6298, "America/Chicago"],
  ["New York, Mỹ", 40.7128, -74.006, "America/New_York"], ["Atlanta, Mỹ", 33.749, -84.388, "America/New_York"],
  ["Washington DC, Mỹ", 38.9072, -77.0369, "America/New_York"], ["Toronto, Canada", 43.6532, -79.3832, "America/Toronto"],
  ["Vancouver, Canada", 49.2827, -123.1207, "America/Vancouver"], ["Montréal, Canada", 45.5017, -73.5673, "America/Toronto"],
];

export interface PlaceOption { id: string; label: string; place: PlaceInput }

export const PLACE_OPTIONS: PlaceOption[] = [
  ...VN_PLACES.map(([name, lat, lon]): PlaceOption => ({
    id: `vn:${name}`, label: name, place: { name, lat, lon, country: "VN" },
  })),
  ...ABROAD.map(([name, lat, lon, tz]): PlaceOption => ({
    id: `ab:${name}`, label: name, place: { name, lat, lon, country: "OTHER", tz },
  })),
];

export const findPlace = (id: string) => PLACE_OPTIONS.find((p) => p.id === id);

/** Vietnamese double-hours (canh giờ). Midpoints are used when the exact time is unknown. */
export interface CanhGio { id: string; name: string; from: number; to: number } // minutes of the day
export const CANH_GIO: CanhGio[] = [
  { id: "ty-dem", name: "Giờ Tý đêm (23h–24h)", from: 23 * 60, to: 24 * 60 },
  { id: "ty-rang", name: "Giờ Tý rạng (0h–1h)", from: 0, to: 60 },
  { id: "suu", name: "Giờ Sửu (1h–3h)", from: 60, to: 180 },
  { id: "dan", name: "Giờ Dần (3h–5h)", from: 180, to: 300 },
  { id: "mao", name: "Giờ Mão (5h–7h)", from: 300, to: 420 },
  { id: "thin", name: "Giờ Thìn (7h–9h)", from: 420, to: 540 },
  { id: "ty", name: "Giờ Tỵ (9h–11h)", from: 540, to: 660 },
  { id: "ngo", name: "Giờ Ngọ (11h–13h)", from: 660, to: 780 },
  { id: "mui", name: "Giờ Mùi (13h–15h)", from: 780, to: 900 },
  { id: "than", name: "Giờ Thân (15h–17h)", from: 900, to: 1020 },
  { id: "dau", name: "Giờ Dậu (17h–19h)", from: 1020, to: 1140 },
  { id: "tuat", name: "Giờ Tuất (19h–21h)", from: 1140, to: 1260 },
  { id: "hoi", name: "Giờ Hợi (21h–23h)", from: 1260, to: 1380 },
];

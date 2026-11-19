import { COMBUST_ORB, GRAHAS, GRAHA_VI } from "../engine/constants.ts";
import { DEITY, GEM_OF } from "./deities.ts";

const Row = ({ a, b, c }: { a: string; b: string; c?: string }) => (
  <tr><th scope="row">{a}</th><td>{b}</td>{c !== undefined && <td>{c}</td>}</tr>
);

export function Method() {
  return (
    <main id="main" className="method">
      <header className="mhead">
        <p className="eyebrow">Phương pháp · Life Atlas v4</p>
        <h1>Trang này tính và đọc lá số như thế nào</h1>
        <p className="lead">Mọi con số ở đây đều kiểm chứng được. Bạn có thể đem lá số sang phần mềm khác để so với các quy ước bên dưới; nếu cùng quy ước thì kết quả phải khớp.</p>
      </header>

      <section className="sec prose-sec">
        <h2>Ba bước từ giờ sinh đến bài đọc</h2>
        <ol className="steps">
          <li><b>Đổi giờ sinh sang giờ chuẩn quốc tế (UTC).</b> Đây là bước dễ sai nhất, nhất là với người sinh ở Việt Nam trước năm 1975 (xem mục Giờ sinh bên dưới).</li>
          <li><b>Tính vị trí thật của các hành tinh và cung mọc</b> bằng thuật toán thiên văn, rồi dựng 12 nhà, điểm SAV, sức mạnh hành tinh (Shadbala), sức mạnh nhà (Bhava Bala), mối quan hệ năm tầng (Panchadha Maitri), đại vận năm bậc và yoga theo quy tắc cổ điển Parashara.</li>
          <li><b>Tổng hợp luận giải theo cấu trúc lá số.</b> Hệ thống luận giải phân tích đa biến từng yếu tố của lá số (mối liên hệ giữa Cung mọc, Mặt Trời và Mặt Trăng; sáu lớp cấu trúc của từng nhà; đối chiếu D1 với D9 và D10; cùng hai lăng kính thời gian từ Mặt Trăng và Cung mọc) rồi chọn hướng kể chuyện phù hợp. Vì mọi quy tắc đều tất định, cùng một lá số và cùng một ngày luôn cho cùng một bài đọc.</li>
        </ol>
      </section>

      <section className="sec prose-sec">
        <h2>Bài đọc được chia thành bảy chương</h2>
        <p>Mỗi chương có một việc riêng và không kể lại chương khác. Phần luận giải hiển thị mặc định; số liệu nằm trong mục “Vì sao mình nói điều này?”.</p>
        <ol className="steps">
          <li><b>Tổng quan.</b> Một câu mở đầu dựng từ những dấu ấn nổi bật nhất của lá số, rồi cung mọc, Mặt Trời và Mặt Trăng đọc trong quan hệ với nhau, bốn nguyên tố, chu kỳ trăng, hành tinh trụ cột và những lĩnh vực nổi bật.</li>
          <li><b>12 nhà – 12 khía cạnh cuộc sống.</b> Mỗi nhà được phân tích qua năm bước (bản chất nhà, chủ nhà, hành tinh trong nhà và góc chiếu, Bhava Bala/SAV/yoga, tổng hợp); mỗi bằng chứng là một trọng số có dấu, và bài luận chỉ nói điều các bằng chứng cộng lại.</li>
          <li><b>Bài học kiếp này.</b> Rahu, Ketu và trục giữa chúng, với bảng 12 yếu tố, liên hệ đại vận và chuyển vận hiện tại.</li>
          <li><b>Biểu đồ chuyên sâu.</b> D2, D3, D4, D7, D9, D10, mỗi biểu đồ có sơ đồ kim cương, nhận định từ D1 đối chiếu với lá số chia, và độ ổn định trong sai số giờ sinh.</li>
          <li><b>Đại vận và tiểu vận.</b> Mahadasha đọc theo chủ đề, điều kiện thuận, yếu tố trái chiều và các lĩnh vực liên kết; Antardasha đọc qua quan hệ với chủ đại vận và những gì nó đổi so với bối cảnh.</li>
          <li><b>Dự báo năm 2027.</b> Lịch thiên văn thật của năm (đổi cung, nghịch hành, nhật/nguyệt thực, chạm điểm gốc, đổi tiểu vận) đặt lên lá số, từng tháng.</li>
          <li><b>Khám phá thêm.</b> Mười hai câu hỏi thực tế, kể cả so sánh hai lá số theo Ashtakoota.</li>
        </ol>
        <ul className="plain-list">
          <li><b>Mục “Vì sao mình nói điều này?” ở mỗi chương.</b> Mọi nhận định quan trọng trong Tổng quan, 12 nhà, D9/D10, Đại vận và Gochara đều có phần giải thích căn cứ kỹ thuật gập gọn ngay bên dưới để người đọc kiểm chứng.</li>
          <li><b>Khi chưa có giờ sinh.</b> Cung mọc và mười hai nhà không tính được, nên bài đọc bỏ các phần đó và chỉ giữ những điều không phụ thuộc giờ sinh: Mặt Trời, Mặt Trăng, hành tinh, Rahu và Ketu, đại vận bậc đầu và các hành tinh đang đi qua tính từ Mặt Trăng.</li>
        </ul>
      </section>

      <section className="sec prose-sec">
        <h2>Các quy ước đã chọn</h2>
        <p>Jyotish có nhiều trường phái. Trang này cố định một bộ quy ước phổ biến theo hệ Parashara và nói rõ để bạn đối chiếu.</p>
        <div className="tablewrap">
          <table className="mtable">
            <thead><tr><th>Mục</th><th>Quy ước</th></tr></thead>
            <tbody>
              <Row a="Hoàng đạo" b="Sidereal, ayanamsa Lahiri (Chitrapaksha). Lệch khoảng 24 độ so với chiêm tinh phương Tây nên cung của bạn có thể khác." />
              <Row a="Chia nhà" b="Whole Sign: mỗi cung hoàng đạo là một nhà, nhà 1 là cả cung mọc." />
              <Row a="Rahu và Ketu" b="Rahu thật (true node). Ketu nằm đối diện Rahu đúng 180 độ." />
              <Row a="Đại vận" b="Vimshottari, chu kỳ 120 năm, một năm tính 365,25 ngày, tính từ chòm sao (nakshatra) Mặt Trăng đang đứng lúc sinh. Năm bậc: Mahadasha (đại vận), Antardasha (tiểu vận), Pratyantardasha (chặng), Sukshma (nhịp), Prana (nhịp ngắn nhất)." />
              <Row a="Góc chiếu (Graha Drishti)" b="Mọi hành tinh nhìn nhà thứ 7 tính từ nó. Sao Hỏa còn nhìn nhà thứ 4 và 8, Sao Mộc nhà thứ 5 và 9, Sao Thổ nhà thứ 3 và 10." />
              <Row a="Cháy sáng" b={`Một hành tinh bị coi là cháy sáng khi cách Mặt Trời không quá: Mặt Trăng ${COMBUST_ORB.moon}°, Sao Hỏa ${COMBUST_ORB.mars}°, Sao Thủy ${COMBUST_ORB.mercury}° (12° khi nghịch hành), Sao Mộc ${COMBUST_ORB.jupiter}°, Sao Kim ${COMBUST_ORB.venus}° (8° khi nghịch hành), Sao Thổ ${COMBUST_ORB.saturn}°.`} />
              <Row a="Điểm SAV và BAV" b="Bảng Ashtakavarga theo Brihat Parashara Hora Shastra. Tổng SAV 12 cung luôn là 337 (trung bình 28 điểm mỗi nhà). BAV của từng hành tinh từ 0 đến 8 điểm (từ 5 điểm trở lên là thuận, từ 3 điểm trở xuống là cần lưu tâm khi hành tinh đó quá cảnh)." />
              <Row a="Sức mạnh hành tinh (Shadbala)" b="Sáu loại sức mạnh theo Brihat Parashara Hora Shastra, cách trình bày của B.V. Raman: Sthana (vị trí), Dig (hướng), Kala (thời điểm sinh), Cheshta (chuyển động), Naisargika (bản chất riêng) và Drik (ánh nhìn nhận được), tính cho bảy hành tinh từ Mặt Trời đến Sao Thổ." />
              <Row a="Sức mạnh nhà (Bhava Bala)" b="Cộng ba phần: sức của hành tinh cai quản nhà (Adhipati), sức theo hướng của chính nhà (Dig), và ánh nhìn rơi vào nhà (Drishti). Trang dùng thứ hạng giữa mười hai nhà kết hợp với điểm SAV." />
              <Row a="Chuyển động hiện tại (Gochara)" b="Đọc song song từ hai gốc: từ Mặt Trăng lúc sinh (Chandra Lagna — phản ánh tâm trạng, cảm xúc và Sade Sati/Kantaka/Ashtama Shani, điều chỉnh bằng điểm BAV) và từ Cung mọc (Udaya Lagna — phản ánh mảng việc thực tế trong 12 nhà và điểm SAV)." />
              <Row a="Lá số phụ" b="D2 Hora (Parashari: cung lẻ 15° đầu thuộc Sư Tử, sau thuộc Cự Giải; cung chẵn ngược lại), D3 Drekkana (1-5-9), D4 Chaturthamsha (1-4-7-10), D7 Saptamsha (lẻ từ chính nó, chẵn từ cung thứ 7), D9 Navamsha, D10 Dashamsha (lẻ từ chính nó, chẵn từ cung thứ 9). Đặt cạnh lá số gốc D1 để xét sự đồng thuận hay chuyển hóa về phẩm cấp và vị trí nhà." />
            </tbody>
          </table>
        </div>
        <p className="tip">Muốn đối chiếu bằng phần mềm khác: chọn Lahiri, Whole Sign, True Node, Vimshottari (năm 365,25 ngày).</p>
      </section>

      <section className="sec prose-sec">
        <h2>Độ chính xác của phần thiên văn</h2>
        <p>Mình đã so toàn bộ phép tính với Swiss Ephemeris trên 103 lá số thử: các năm từ 1900 đến 2100, 14 nơi trên thế giới.</p>
        <div className="tablewrap">
          <table className="mtable">
            <thead><tr><th>Đại lượng</th><th>Lệch tối đa so với Swiss Ephemeris</th></tr></thead>
            <tbody>
              <Row a="Mặt Trời, Sao Thủy đến Sao Thổ" b="dưới 1,1 giây cung" />
              <Row a="Mặt Trăng" b="12 giây cung" />
              <Row a="Rahu / Ketu" b="45 giây cung (khoảng 0,0125 độ)" />
              <Row a="Cung mọc" b="3 giây cung; đúng cung trong cả 103 trường hợp" />
              <Row a="Chủ đại vận đầu tiên" b="khớp 103/103; ngày kết thúc lệch tối đa 1,3 ngày" />
            </tbody>
          </table>
        </div>
        <p>Một phút sai giờ sinh làm cung mọc trượt khoảng 15 phút cung, lớn hơn sai số thiên văn trên hàng chục đến hàng trăm lần. Độ chính xác thật của lá số vì thế nằm ở <b>giờ sinh bạn nhập</b>, không nằm ở phép tính.</p>
      </section>

      <section className="sec prose-sec">
        <h2>Giờ sinh ở Việt Nam</h2>
        <p>Giờ trên giấy khai sinh là giờ đồng hồ lúc đó, và đồng hồ ở Việt Nam đã đổi nhiều lần. Trang dùng bảng múi giờ riêng cho Việt Nam.</p>
        <div className="tablewrap">
          <table className="mtable">
            <thead><tr><th>Thời kỳ</th><th>Miền Bắc</th><th>Miền Nam</th></tr></thead>
            <tbody>
              <Row a="Trước 7/1906" b="Giờ địa phương, khoảng UTC+7:07" c="như miền Bắc" />
              <Row a="1906 – 1942" b="UTC+7 (từ 1906 đến 1911 là UTC+7:06:30)" c="như miền Bắc" />
              <Row a="1943 – 3/1945" b="UTC+8" c="như miền Bắc" />
              <Row a="3/1945 – 9/1945" b="UTC+9 (giờ Tokyo)" c="như miền Bắc" />
              <Row a="9/1945 – 4/1947" b="UTC+7" c="như miền Bắc" />
              <Row a="4/1947 – 7/1955" b="UTC+7 (vùng chiến sự có thể dùng UTC+8)" c="UTC+8" />
              <Row a="7/1955 – 12/1959" b="UTC+7" c="UTC+7" />
              <Row a="1960 – 8/1967" b="UTC+7" c="UTC+8 (đồng hồ nhảy từ 23h ngày 31/12/1959 sang 0h)" />
              <Row a="8/1967 – 6/1975" b="UTC+7" c="UTC+8" />
              <Row a="Từ 13/6/1975" b="UTC+7" c="UTC+7" />
            </tbody>
          </table>
        </div>
      </section>

      <section className="sec prose-sec">
        <h2>Chín vị thần và nền vũ trụ</h2>
        <p>Trong truyền thống Vệ Đà, mỗi hành tinh (graha) có một vị thần chủ (adhi devata) và một vị thần thứ hai (pratyadhi devata). Trang dùng bảng này cho biểu tượng nghệ thuật, không dùng để suy diễn tính cách.</p>
        <div className="tablewrap">
          <table className="mtable">
            <thead><tr><th>Hành tinh</th><th>Thần chủ</th><th>Thần thứ hai</th><th>Đá gắn với hành tinh</th></tr></thead>
            <tbody>
              {GRAHAS.map((g) => <Row key={g} a={GRAHA_VI[g]} b={`${DEITY[g].name}, ${DEITY[g].epithet}`} c={`${DEITY[g].second}; ${GEM_OF[g]}`} />)}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sec prose-sec">
        <h2>Quyền riêng tư</h2>
        <p>Mọi phép tính chạy ngay trong trình duyệt của bạn. Ngày giờ và nơi sinh không được gửi tới bất kỳ máy chủ nào, và trang không lưu chúng lại sau khi bạn đóng.</p>
      </section>
    </main>
  );
}

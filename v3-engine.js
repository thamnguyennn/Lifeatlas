/* Life Atlas v3 — narrative layer, 2026. The original Lahiri/Parashara calculation bundle is unmodified.
 * Runs as a classic script before the compiled React application; also exports pure functions for Node tests.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LAV3 = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  const signs = ['Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải', 'Sư Tử', 'Xử Nữ', 'Thiên Bình', 'Thiên Yết', 'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư'];
  const names = {sun:'Mặt Trời',moon:'Mặt Trăng',mars:'Sao Hỏa',mercury:'Sao Thủy',jupiter:'Sao Mộc',venus:'Sao Kim',saturn:'Sao Thổ',rahu:'Rahu',ketu:'Ketu'};
  const worlds = ['bản sắc và cách xuất hiện trước đời','nguồn lực, lời nói và những giá trị được gìn giữ','sự chủ động, học hỏi và giao tiếp gần gũi','mái ấm, gốc rễ và cảm giác an toàn','sáng tạo, tình cảm và khả năng trao truyền','công việc hằng ngày, trở ngại và cách chăm sóc sức khỏe','hợp tác, cam kết và người đối diện','những biến đổi sâu, điều chia sẻ và phần chưa thể kiểm soát','niềm tin, học vấn và chân trời rộng hơn','trách nhiệm, nghề nghiệp và vị trí trong xã hội','cộng đồng, đồng minh và những mục tiêu dài hạn','đời sống riêng tư, chiêm nghiệm và điều cần buông xuống'];
  const dignityPositive = new Set(['own','exalted','moolatrikona']);
  const dignityNegative = new Set(['debilitated']);
  const positive = new Set(['jupiter','venus']);
  const fmt = p => names[p] || p;
  const sign = n => signs[n] || 'chưa xác định';
  const join = (xs) => xs.filter(Boolean).join(' ');
  const clampedName = (s) => String(s || '').trim().slice(0, 80);
  const joinNames = a => a.map(fmt).join(', ');
  const houseOf = (g, allow) => allow && Number.isInteger(g?.house) ? `nhà ${g.house}` : `cung ${sign(g?.sign)}`;
  const hasStrong = d => dignityPositive.has(d);
  const isWeak = d => dignityNegative.has(d);
  const sep = (a,b) => ((b - a + 12) % 12);
  const houseName = i => `nhà ${i}`;
  const strengthText = (d) => hasStrong(d) ? 'có vị thế tương đối vững theo phẩm chất cung' : isWeak(d) ? 'ở vị trí cần được đọc thận trọng theo phẩm chất cung' : 'không có phẩm chất đặc biệt đủ để một mình quyết định cách luận';
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
  const role = {sun:'cảm thức về bản thân và quyền chủ động',moon:'cách tâm trí tìm sự yên ổn',mars:'hành động và khả năng đối diện sức ép',mercury:'tư duy, lời nói và phân tích',jupiter:'tri thức, niềm tin và khả năng định hướng',venus:'khả năng hòa hợp, thẩm mỹ và gắn bó',saturn:'trách nhiệm, giới hạn và nhịp bền bỉ',rahu:'nơi trải nghiệm dễ được khuếch đại',ketu:'nơi có xu hướng rút bớt sự bám víu'};
  const nakName = m => m?.nak?.name || 'một chòm sao chưa xác định';
  function features(ctx) {
    const n=ctx.n, g=n.grahas, timed=!ctx.noTime;
    const counts = new Map();
    for (const id of ['sun','moon','mars','mercury','jupiter','venus','saturn','rahu','ketu']) {
      const x=g[id]; if (x) counts.set(x.sign, [...(counts.get(x.sign)||[]),id]);
    }
    const crowd=[...counts.entries()].filter(x=>x[1].length>=3).sort((a,b)=>b[1].length-a[1].length || a[0]-b[0])[0];
    const strong=['sun','moon','mars','mercury','jupiter','venus','saturn'].filter(id=>hasStrong(g[id]?.dignity));
    const pressured=['sun','moon','mars','mercury','jupiter','venus','saturn'].filter(id=>isWeak(g[id]?.dignity));
    const together=g.sun.sign===g.moon.sign;
    const moonSun=sep(g.sun.sign,g.moon.sign);
    const lagMoon=timed?sep(n.lagna.sign,g.moon.sign):null;
    const lagSun=timed?sep(n.lagna.sign,g.sun.sign):null;
    return {n,g,timed,crowd,strong,pressured,together,moonSun,lagMoon,lagSun};
  }
  function firstSignal(f) {
    if(f.crowd) return `Có ${f.crowd[1].length} hành tinh tụ tại ${sign(f.crowd[0])}${f.timed?`, thuộc nhà ${f.g[f.crowd[1][0]].house}`:''}. Điều đó đưa một miền trải nghiệm lên gần tiền cảnh, nhưng ý nghĩa cụ thể còn tùy các hành tinh tham dự và chủ nhà liên quan.`;
    if(f.timed && f.lagMoon===0) return `Cung mọc và Mặt Trăng cùng ở ${sign(f.n.lagna.sign)}. Bề ngoài và cách tâm trí tiếp nhận hoàn cảnh có thể đi cùng một nhịp, dù hai chỉ dấu này vẫn đảm nhiệm những chức năng khác nhau.`;
    if(f.timed && (f.lagMoon===5 || f.lagMoon===7)) return `Cung mọc ${sign(f.n.lagna.sign)} và Mặt Trăng ${sign(f.g.moon.sign)} nằm trên một trục cần sự điều đình giữa cách sống và điều tâm trí tìm kiếm. Đây là mối liên hệ đáng theo dõi, chưa phải một kết luận về xung đột.`;
    if(f.strong.length) return `${fmt(f.strong[0])} ở ${sign(f.g[f.strong[0]].sign)}, một vị trí có phẩm chất thuận trong phương pháp đang dùng. Nhưng một hành tinh đứng vững không đồng nghĩa mọi chủ đề do nó đại diện đều sẽ diễn ra dễ dàng.`;
    return `Mặt Trăng ở ${sign(f.g.moon.sign)}, trong nakshatra ${nakName(f.g.moon)}. Vị trí này mở ra góc nhìn về nếp cảm nhận; để hiểu trọn vẹn hơn, mình sẽ đặt nó bên cạnh Mặt Trời${f.timed?' và cung mọc':''}.`;
  }
  function letter(ctx, base) {
    const f=features(ctx), g=f.g, n=f.n;
    const variant=f.crowd?0:f.together?1:f.timed&&(f.lagMoon===0||f.lagMoon===6)?2:3+(g.sun.sign%7);
    const starts=[
      'Mình muốn bắt đầu câu chuyện này bằng một khoảng lặng. Trước khi những tên gọi quen thuộc xuất hiện, hãy hình dung một tấm bản đồ cũ vừa được trải ra dưới ánh đèn: không có dòng nào bắt bạn phải trở thành ai, chỉ có những đường nét chờ được đọc bằng sự kiên nhẫn.',
      'Có những câu chuyện cần được mở thật khẽ, giống như khi người ta bước vào một căn phòng đã giữ hộ mình nhiều kỷ niệm. Mình mời bạn ở lại đây một chút, không phải để nghe một lời phán định, mà để xem những ký hiệu cổ xưa đã được đặt bên nhau ra sao.',
      'Mình dành lời chào này cho khoảng thời gian rất riêng giữa một người và câu chuyện của chính họ. Trên bản đồ trước mặt, mỗi đường nối đều bắt đầu từ một thời khắc có thật; ý nghĩa của nó thì cần được đọc chậm, qua nhiều lớp, thay vì gói lại trong vài câu ngắn.',
      'Chào bạn. Nếu xem đời sống như một cuốn sách chưa viết xong, lá số là trang giấy lưu lại dáng vẻ bầu trời khi câu chuyện khởi đầu. Mình sẽ cùng bạn đọc những dấu mực ấy, vừa đủ gần để hiểu, vừa đủ xa để không biến biểu tượng thành định mệnh.',
      'Trên một tấm bản đồ cổ, đôi khi điều khiến người ta dừng lại không phải một dấu hiệu lạ, mà là cách những đường nét quen thuộc gặp nhau. Mình muốn dành cho bạn cách đọc ấy: lần theo các mối liên hệ thật sự có trên lá số, rồi để chúng cất tiếng bằng một câu chuyện liền mạch.',
      'Có những buổi chiều ta mở lại một quyển sổ cũ và bất ngờ hiểu hơn vì sao mình đã ghi những dòng ấy. Mình mong lá số này cũng được đón nhận theo tinh thần đó: không ép quá khứ vào một lời giải, không dùng tương lai để gieo lo lắng, chỉ nhìn kỹ hơn các hình dạng đã có từ điểm khởi đầu.',
      'Lời chào đầu tiên của mình không dành cho một cung hoàng đạo, mà dành cho người đang đọc. Những biểu tượng sắp xuất hiện thuộc về một truyền thống lâu đời; còn cuộc sống bạn đã đi qua thì không thể gói trong một bảng vị trí. Ta có thể đặt hai điều ấy cạnh nhau mà không cần xem chúng là một.',
      'Hãy hình dung một mặt bàn gỗ, ánh sáng vừa đủ, và một vòng tròn được vẽ bằng những nét mực mảnh. Mình trải lá số ra ở đây như trải một tấm bản đồ đường xa: những ký hiệu nói về hướng và mối liên hệ, còn hành trình thật sự luôn có thời tiết, ngã rẽ và những lựa chọn riêng.',
      'Khi đọc một bản đồ bầu trời, người ta dễ tìm ngay dấu hiệu nổi bật nhất rồi để nó nói thay tất cả. Mình muốn làm khác: giữ cho mỗi chỉ dấu đúng với sức nặng của nó, lắng nghe cả những khoảng lặng giữa chúng, và kể với bạn một câu chuyện không cần quá nhiều lời quả quyết.',
      'Trước mắt bạn là một bản đồ được dựng từ một thời khắc không thể lặp lại. Mình sẽ dẫn bạn đi qua nó bằng ngôn ngữ gần gũi, nhưng vẫn giữ lại sự tinh tế của những phân chia cổ xưa: không vội phán đoán, không tô đậm điều mà dữ liệu chỉ nói rất khẽ.'
    ];
    const moon=f.g.moon, sun=f.g.sun;
    const birth=f.timed
      ? `Vào khoảnh khắc bạn chào đời, theo hệ hoàng đạo sao Lahiri, cung ${sign(n.lagna.sign)} đang mọc lên ở chân trời phía đông. Mặt Trời ở ${sign(sun.sign)}, trong khi Mặt Trăng đi qua ${sign(moon.sign)} và nakshatra ${nakName(moon)}, pada ${moon.nak?.pada||'chưa xác định'}. Đó là những vị trí được bộ máy thiên văn của Life Atlas tính từ dữ liệu sinh; chúng là điểm xuất phát cho cách đọc Jyotish Parashara, chứ chưa phải lời mô tả cố định về một con người.`
      : `Với ngày sinh được cung cấp nhưng chưa có giờ sinh xác định, mình có thể nói về Mặt Trời ở ${sign(sun.sign)} và Mặt Trăng ở ${sign(moon.sign)}, trong nakshatra ${nakName(moon)} theo phép tính hiện có. Cung mọc và hệ thống 12 nhà chưa đủ cơ sở để kết luận, vì chỉ một thay đổi nhỏ về giờ sinh cũng có thể khiến chúng dịch chuyển.`;
    const nuance=f.together
      ? 'Mặt Trời và Mặt Trăng cùng trú trong một cung. Hai cách nhìn về bản ngã và đời sống cảm xúc vì thế có một điểm tụ đáng chú ý, nhưng ánh sáng của chúng không luôn dễ phân biệt: cần đọc thêm vị trí, phẩm chất và những liên hệ khác.'
      : `Mặt Trời ở ${sign(sun.sign)} và Mặt Trăng ở ${sign(moon.sign)} không cùng một cung. Sự khác biệt ấy mở ra hai giọng nói riêng: một hướng về điều bạn muốn nhận là của mình, một hướng về nơi tâm trí tìm sự an ổn. Chúng có thể hỗ trợ, điều chỉnh hoặc đặt câu hỏi cho nhau tùy phần còn lại của lá số.`;
    const detail=firstSignal(f);
    const endings=[
      'Mình sẽ không vội đặt tên cho tất cả. Ở chương Tổng quan, các chỉ dấu sẽ được đặt cạnh nhau để xem điều gì lặp lại, điều gì trái chiều, và điều gì chỉ nên để ngỏ. Có thể chính những khoảng chưa thể kết luận mới khiến tấm bản đồ này giống một câu chuyện riêng.',
      'Phần tiếp theo không chia bạn thành những mảnh rời mang tên từng hành tinh. Mình muốn đi từ mối quan hệ giữa chúng: những chỗ sáng rõ, những chỗ cần thêm bằng chứng, và cả những khoảng lặng mà lá số không đủ sức nói thay bạn.',
      'Khi bước sang Tổng quan, bạn sẽ thấy bức tranh ấy không được tạo bởi một biểu tượng duy nhất. Mình sẽ nối các chi tiết có căn cứ, xem đâu là sợi chỉ xuyên qua nhiều miền trải nghiệm, và giữ lại những câu hỏi còn đáng để suy ngẫm.',
      'Mình mời bạn đi tiếp, từ điểm nhìn bao quát đến từng miền đời sống. Mỗi chương sẽ trở lại với dữ liệu của nó, nhưng câu chuyện chung chỉ thực sự hiện ra khi những phần ấy được đọc trong mối liên hệ với nhau.'
    ];
    return {...base, greeting:`Gửi ${clampedName(ctx.name)||'bạn'},`,line:[starts[variant],birth,join([nuance,detail]),endings[variant%endings.length]].join('\n\n'), narrativeVersion:3};
  }
  function relation(f) {
    const g=f.g;
    if (f.together) return {type:'convergence',text:`Mặt Trời và Mặt Trăng cùng ở ${sign(g.sun.sign)}, khiến câu chuyện về bản sắc và nhu cầu cảm xúc cùng bắt đầu từ một trường biểu tượng. Điều này tạo sự tập trung, nhưng không bảo đảm hai nhu cầu luôn hòa thuận.`};
    if ([3,6,9].includes(f.moonSun)) return {type:'angular',text:`Mặt Trời ở ${sign(g.sun.sign)} và Mặt Trăng ở ${sign(g.moon.sign)} tạo một tương quan góc theo cung có tính đối chiếu. Một bên mô tả cách khẳng định bản thân; bên kia cho biết điều tâm trí thường lấy làm điểm tựa. Sự đối chiếu có thể khiến một lựa chọn được cân nhắc từ hơn một phía.`};
    if ([4,8].includes(f.moonSun)) return {type:'trine',text:`Mặt Trời tại ${sign(g.sun.sign)} và Mặt Trăng tại ${sign(g.moon.sign)} có tương quan tam hợp theo cung. Trong lối đọc truyền thống, đây là điều kiện thuận cho việc đưa ý hướng cá nhân và nếp cảm nhận vào cùng một hướng, dù kết quả vẫn phụ thuộc chủ quản và sức mạnh thực tế.`};
    return {type:'distinct',text:`Mặt Trời ở ${sign(g.sun.sign)} còn Mặt Trăng ở ${sign(g.moon.sign)}. Hai vị trí không lặp lại nhau; vì thế mình đọc chúng như hai tầng trải nghiệm, thay vì lấy một cung làm đáp án cho toàn bộ tính cách.`};
  }
  function overview(ctx, base) {
    const f=features(ctx), n=f.n,g=f.g, sun=g.sun, moon=g.moon, rel=relation(f);
    const asc=f.timed?`Cung mọc ${sign(n.lagna.sign)} cho biết cách hoàn cảnh được tiếp cận; Mặt Trời tại ${sign(sun.sign)} diễn tả trục ý chí và cảm thức về bản thân; Mặt Trăng tại ${sign(moon.sign)} gắn với lối cảm nhận và tìm chỗ an toàn.`:`Vì chưa có giờ sinh xác định, mình chưa dùng cung mọc để xây nhận định. Phần này tập trung vào Mặt Trời, Mặt Trăng và các mối liên hệ có thể xác định từ dữ liệu hiện có.`;
    const path=f.timed
      ? f.lagMoon===0?'Điều người khác có thể nhìn thấy trong cách bạn bước vào đời có khả năng gần với điều tâm trí đang tìm kiếm. Nhưng sự gần nhau ấy vẫn chứa khác biệt giữa phản ứng trước hoàn cảnh và nhu cầu được an ủi.'
      : [3,6,9].includes(f.lagMoon)?'Giữa cách bạn tiến vào một tình huống và cảm giác bên trong có thể tồn tại độ lệch đáng quan sát. Hai góc nhìn không triệt tiêu nhau; chúng chỉ cho thấy vì sao một quyết định có vẻ hợp lý ở bên ngoài vẫn cần thời gian để trở nên yên ổn ở bên trong.'
      : `Cung mọc và Mặt Trăng không đồng vị. Điều này khiến mình không thể lấy nét bộc lộ ra ngoài làm đại diện cho toàn bộ đời sống cảm xúc; đôi khi sự khác biệt chỉ xuất hiện trong những tình huống thân mật hoặc có nhiều áp lực.`
      :'Với những dữ kiện chưa đủ chính xác về giờ, các suy luận về hình ảnh bên ngoài hay nhà đời sống cần được giữ lại. Việc không kết luận ở chỗ thiếu dữ liệu là một phần của cách đọc nghiêm túc.';
    const strong=f.strong.length?f.strong.slice(0,2).map(fmt).join(' và '):null;
    const tension=f.pressured.length?f.pressured.slice(0,2).map(fmt).join(' và '):null;
    const supports=strong?`${strong} ${f.strong.length===1?'đứng':'đứng'} ở vị trí có phẩm chất cung tương đối vững. Đây là một điều kiện để năng lực của các hành tinh ấy có cơ hội biểu hiện rõ, nhưng chưa đủ để suy ra thuận lợi ở mọi lĩnh vực chúng cai quản.`:'Không có hành tinh cổ điển nào nổi bật riêng chỉ bằng tiêu chí đắc vị hoặc ở cung của mình. Vì thế nhận định về thế mạnh cần dựa nhiều hơn vào các mối liên hệ, chủ nhà và các chỉ số hỗ trợ; một khoảng trống bằng chứng không nên được lấp bằng lời khen chung chung.';
    const pressure=tension?`${tension} ở vị trí bị xem là suy giảm về phẩm chất cung. Mình xem đó như điều kiện cần đọc chậm, không như lời tuyên bố rằng một phần đời sẽ thất bại; liên hệ với chủ nhà, góc chiếu và sự bù trừ mới làm rõ mức ảnh hưởng.`:'Không có chỉ dấu hãm địa nổi bật theo tiêu chí này. Điều đó không đồng nghĩa lá số thiếu thử thách: căng thẳng vẫn có thể xuất hiện từ vị trí nhà, các liên kết hay sự khác biệt giữa các thước đo.';
    const bunch=f.crowd?`Sự tập trung của ${joinNames(f.crowd[1])} trong ${sign(f.crowd[0])}${f.timed?` (nhà ${g[f.crowd[1][0]].house})`:''} khiến miền biểu tượng này xuất hiện nhiều lần trong phép đọc. Mỗi hành tinh mang một chức năng khác nhau nên sự tập trung ấy có thể tạo sức bật, nhưng cũng đòi hỏi phân biệt điều được củng cố với điều bị kéo căng.`:`Các hành tinh không tụ thành nhóm từ ba vị trí trở lên trong một cung. Bởi vậy câu chuyện của bạn không bị quy về một điểm nhấn duy nhất; những liên hệ giữa các vị trí rải đều có thể quan trọng hơn bất kỳ hình ảnh nổi bật nào.`;
    const lunar=`Mặt Trăng đi qua nakshatra ${nakName(moon)}${moon.nak?.pada?`, pada ${moon.nak.pada}`:''}, một lớp phân chia tinh tế hơn cung. Mình giữ dữ kiện này như một sắc thái bổ sung cho cách cảm nhận, chứ không dùng riêng tên nakshatra để khẳng định trước tính cách, quan hệ hay biến cố.`;
    const central=f.crowd?`Một trường trải nghiệm được nhấn mạnh, nhưng không giữ độc quyền câu chuyện.`:f.together?`Một điểm tụ giữa ý chí và cảm xúc, với nhiều sắc thái chưa thể thu về một kết luận.`:f.timed&&[3,6,9].includes(f.lagMoon)?`Hai nhịp khác nhau giữa cách bước ra đời và nơi tâm trí trở về.`:`Bản sắc và đời sống nội tâm được viết bằng những nét khác nhau, cần đọc trong tương quan.`;
    const story=[
      {id:'center',title:'Sợi chỉ ở giữa bức tranh',paragraphs:[`${central} ${asc} ${rel.text}`,path], evidence:[`Mặt Trời: ${sign(sun.sign)}` , `Mặt Trăng: ${sign(moon.sign)}` , ...(f.timed?[`Cung mọc: ${sign(n.lagna.sign)}`]:[])]},
      {id:'resources',title:'Những điều có thể trở thành nguồn lực',paragraphs:[supports,`Thế mạnh trong Jyotish cần được hiểu theo điều kiện: phẩm chất hành tinh nói về cách một tác nhân vận hành; nhà mà nó cư trú hoặc cai quản nói về miền đời sống chịu tác động. Mình không đánh đồng Shadbala cao với một kết quả chắc chắn tốt, cũng không xem sự hỗ trợ của một nhà là lời hứa về thành tựu.`],evidence:f.strong.map(id=>`${fmt(id)} ở ${sign(g[id].sign)}: ${g[id].dignity}`)},
      {id:'tensions',title:'Khi các chỉ dấu không nói cùng một giọng',paragraphs:[pressure,rel.type==='convergence'?`Sự tập trung của hai nguồn sáng trong cùng một cung còn đáng đọc cùng khoảng cách góc thực tế và chu kỳ Mặt Trăng. Một mô tả duy nhất về “sự thống nhất nội tâm” sẽ bỏ qua các khả năng khác.`:`${rel.text} ${f.timed?'Khi đặt thêm cung mọc vào mối liên hệ này,':'Với dữ kiện hiện tại,'} việc đọc trở thành đối chiếu các điều kiện, chứ không phải chọn một nhãn tính cách rồi ép mọi biểu hiện vào đó.`],evidence:f.pressured.map(id=>`${fmt(id)} ở ${sign(g[id].sign)}: ${g[id].dignity}`)},
      {id:'patterns',title:'Nơi những đường nét chạm nhau',paragraphs:[bunch,lunar],evidence:f.crowd?[`Đồng cung: ${joinNames(f.crowd[1])}, ${sign(f.crowd[0])}`]:[`Nakshatra Mặt Trăng: ${nakName(moon)}`]},
      {id:'questions',title:'Phần câu chuyện vẫn thuộc về bạn',paragraphs:[f.timed&&f.lagMoon!==null&&[3,6,9].includes(f.lagMoon)?'Khi phải quyết định một việc quan trọng, điều bạn thể hiện trước người khác có giống với điều bạn cần để thấy yên lòng? Sự khác biệt, nếu có, thường bộc lộ trong bối cảnh nào?':'Có những lúc bạn hành động rất rõ ràng nhưng mãi sau mới hiểu cảm xúc thật sự của mình không? Khi nhìn lại, điều gì giúp hai phần ấy tìm được tiếng nói chung?',`Đây là những câu hỏi nảy sinh từ mối liên hệ giữa các chỉ dấu được tính toán, không phải bài kiểm tra để bạn chứng minh lá số đúng. Những chương sau sẽ nhìn vào từng nhà và các lá số phân chia; nếu có bằng chứng mới, cách diễn giải cũng cần được điều chỉnh.`],evidence:[]}
    ];
    return {...base,intro:`${central} ${asc}`,story,keystones:[],link:{title:'Những mối liên hệ đáng đọc tiếp',paragraphs:[]},cast:null, narrativeVersion:3};
  }
  function signals(ctx, h, prev) {
    const e=ctx.n.houses[h.n-1], ruler=ctx.n.grahas[e.lord];
    const bala=ctx.sb?.bhava?.[h.n-1], highSupport=e.sav>=32, lowSupport=e.sav<=24;
    const strongBala=bala&&bala.rank<=4, weakBala=bala&&bala.rank>=9;
    const conflict=!!(bala && ((highSupport&&weakBala)||(lowSupport&&strongBala)));
    const crowded=e.occupants.length>=3;
    const difficult=[6,8,12].includes(e.lordHouse);
    const supported=hasStrong(ruler.dignity) && (highSupport||strongBala) && !conflict;
    const aspect=(e.aspectedBy||[]).includes('jupiter');
    const candidates=[];
    if(conflict)candidates.push('contrast');
    if(crowded)candidates.push('crowd');
    if(supported)candidates.push('strength');
    if(difficult)candidates.push('conditions');
    if(e.lordHouse!==h.n)candidates.push('link');
    if(aspect)candidates.push('aspect');
    candidates.push('theme','detail');
    const unique=[...new Set(candidates)];
    const pick=unique.find(x=>x!==prev) || unique[0];
    return {e,ruler,bala,highSupport,lowSupport,strongBala,weakBala,conflict,crowded,difficult,supported,aspect,pick};
  }
  const linkThemes = ['bản sắc','nguồn lực','học hỏi','mái ấm','sáng tạo','nếp sống','quan hệ','biến đổi','niềm tin','sự nghiệp','cộng đồng','đời sống riêng tư'];
  const scenes = [
    'Những lần phải tự giới thiệu, lựa chọn cách xuất hiện hoặc đứng ra nhận một vai trò thường cho thấy rõ hơn chủ đề này.',
    'Nó có thể được nhận ra khi bạn quyết định giữ điều gì, chia sẻ điều gì, và tiếng nói của mình được dùng để bảo vệ giá trị nào.',
    'Những cuộc trò chuyện khó, một kỹ năng rèn đi rèn lại hay quan hệ với người ở gần là nơi liên kết này có thể trở nên hữu hình.',
    'Câu chuyện có thể đi từ một không gian sống rất cụ thể đến cách bạn xây cảm giác thuộc về, ngay cả khi mọi thứ xung quanh đang thay đổi.',
    'Đôi khi chủ đề này lộ ra trong cách bạn dành thời gian cho điều mình tạo nên, hoặc cho một người hay một ý tưởng mà mình thực lòng yêu quý.',
    'Những thói quen nhỏ, việc phải giải quyết đều đặn và cách phân bổ sức lực làm cho chủ đề này bớt trừu tượng.',
    'Một cuộc thương lượng hay mối quan hệ đòi hỏi cam kết thường là nơi ta nhận ra giới hạn giữa mong muốn của mình và nhu cầu của người khác.',
    'Sự thay đổi về nguồn lực chung, niềm tin sâu kín hoặc một giai đoạn phải điều chỉnh cách kiểm soát có thể làm hiện rõ miền đời sống này.',
    'Các lựa chọn về học tập, niềm tin và người mình lắng nghe có thể cho thấy bản đồ này nối với chân trời rộng hơn như thế nào.',
    'Một quyết định nghề nghiệp thường kéo theo trách nhiệm với người khác; chính ở các lựa chọn có hậu quả ấy mà mối liên hệ trở nên dễ nhìn thấy.',
    'Nhóm người bạn chọn đồng hành và cách một mục tiêu chung được xây dựng có thể là nơi chủ đề này bộc lộ cụ thể.',
    'Đó có thể là những khoảng thời gian dành cho nghỉ ngơi, nghiên cứu riêng hoặc việc âm thầm khép lại một điều đã cũ.'
  ];
  const questionEnds = [
    'Khi không cần giải thích mình với ai, bạn thấy điều gì vẫn là cốt lõi?',
    'Có giá trị nào bạn giữ được rõ nhất khi phải đưa ra lựa chọn khó?',
    'Kỹ năng hay cuộc trò chuyện nào từng thay đổi hướng đi của bạn?',
    'Điều gì khiến một nơi trở thành nhà, ngoài địa chỉ và ký ức?',
    'Bạn nhận ra niềm vui sáng tạo của mình rõ nhất trong hoàn cảnh nào?',
    'Nhịp sinh hoạt nào giúp bạn thấy mình chủ động hơn trước khó khăn?',
    'Khi cam kết với một người, điều gì khiến bạn thấy cả hai vẫn là chính mình?',
    'Bạn từng thay đổi quan niệm về điều không thể kiểm soát như thế nào?',
    'Niềm tin nào đã trở nên sâu hơn nhờ trải nghiệm thực tế?',
    'Bạn muốn người khác nhớ đến phẩm chất nào trong cách mình đảm nhận trách nhiệm?',
    'Bạn thuộc về một cộng đồng vì mục tiêu chung hay vì cảm giác được thấu hiểu?',
    'Khoảng riêng tư nào giúp bạn trở về với điều thật sự quan trọng?'
  ];
  function houseStory(ctx, h, previous) {
    const s=signals(ctx,h,previous),e=s.e,g=s.ruler,world=worlds[h.n-1];
    const rulerName=fmt(e.lord), loc=houseName(e.lordHouse), subject=`nhà ${h.n}`;
    const mid=s.bala ? `Bhava Bala xếp nhà này thứ ${s.bala.rank} trong 12 nhà; SAV là ${e.sav} điểm.` : `SAV của cung tương ứng là ${e.sav} điểm; không có kết quả Bhava Bala đủ để so sánh trong dữ liệu này.`;
    const leads={
      contrast:`Khi hai thước đo không đi cùng hướng, câu chuyện về ${world} cần một cách đọc hai tầng. ${mid} Một thước đo năng lực cấu trúc của nhà, thước kia nói về mức hỗ trợ dành cho cung; chúng không thể thay thế cho nhau.`,
      crowd:`${capitalize(world)} trở thành nơi nhiều tiếng nói cùng hiện diện: ${joinNames(e.occupants)} đang ở ${subject}. Điều đáng chú ý không nằm ở số lượng đơn thuần, mà ở việc các hành tinh ấy có thể cùng tác động lên một miền đời sống theo những cách rất khác nhau.`,
      strength:`Một vài điều kiện trong lá số đang nâng đỡ chủ đề ${world}. ${rulerName}, hành tinh cai quản ${subject}, ${strengthText(g.dignity)}; ${mid} Đó là tiềm năng để xem xét, không phải lời bảo đảm về kết quả.`,
      conditions:`Để đọc ${world} một cách công bằng, mình cần bắt đầu từ vị trí của hành tinh cai quản. ${rulerName} nằm ở ${loc}, vùng đời sống thường đặt ra những việc cần xử lý, chuyển đổi hoặc buông xuống; điều này làm câu chuyện phức tạp hơn một mô tả “tốt” hay “xấu”.`,
      link:`Câu chuyện về ${world} không dừng lại ở chính ${subject}. ${rulerName} cai quản nhà này nhưng hiện ở ${loc}, kéo mối quan tâm ấy sang ${linkThemes[e.lordHouse-1]}. Đây là một liên kết cấu trúc giữa hai lĩnh vực, trước khi nói tới bất cứ kết quả cụ thể nào.`,
      aspect:`Có một đường nhìn đáng chú ý hướng về ${subject}: Sao Mộc chiếu tới nhà này theo quy tắc góc chiếu được dùng trong lá số. Với chủ đề ${world}, đây có thể là điều kiện bổ sung góc nhìn phát triển hoặc định hướng, nhưng cần đọc cùng sức mạnh và vị trí của Sao Mộc.`,
      theme:`${capitalize(world)} là miền trải nghiệm của ${subject}. Lá số hiện không cho thấy một tổ hợp đủ nổi bật để đặt ngay ra một nhận định khác thường; vì thế mình bắt đầu từ cấu trúc có thể xác minh, rồi mới đi vào những sắc thái nhỏ hơn.`,
      detail:`Với ${subject}, điều đáng lưu ý trước tiên là sự tiết chế: chưa có một tín hiệu vượt trội để coi ${world} là điểm nhấn đặc biệt. Mình sẽ đặt chủ nhà và các chỉ số kỹ thuật cạnh nhau, không suy rộng hơn những gì cấu trúc cho phép.`
    };
    const houseLord=`Trong lá số D1, ${rulerName} cai quản nhà này và đang ở ${loc}, thuộc cung ${sign(g.sign)}. ${hasStrong(g.dignity)?'Phẩm chất cung là một nguồn lực tương đối thuận.':isWeak(g.dignity)?'Phẩm chất cung là một điểm cần cân nhắc kỹ.':'Phẩm chất cung tự nó chưa tạo nên một kết luận nổi bật.'} ${e.lordHouse===h.n?'Chủ nhà ở chính nhà của mình, khiến mối liên hệ nội tại dễ thấy hơn.':`Việc chủ nhà nối với ${loc} khiến khi đọc ${world}, mình cần xét cả ${linkThemes[e.lordHouse-1]}.`}`;
    const occupants=e.occupants.length?`Sự có mặt của ${joinNames(e.occupants)} trong nhà bổ sung nhiều cách vận hành khác nhau. Mình không gom chúng thành một đặc tính chung; vị trí, phẩm chất và góc chiếu của từng hành tinh mới cho biết chúng có đang hỗ trợ cùng một hướng hay không.`:`Nhà không có hành tinh cư trú, nhưng chủ nhà và những góc chiếu vẫn hiện diện trong cấu trúc. Một nhà “trống” không có nghĩa là lĩnh vực ấy ít quan trọng trong đời bạn.`;
    const measured=s.bala?`Ở nhà ${h.n}, Bhava Bala xếp thứ ${s.bala.rank}, trong khi SAV đạt ${e.sav} điểm. Hai số liệu trả lời hai câu hỏi khác nhau, nên nếu chúng không cùng hướng, điều đúng nhất là giữ nguyên cả hai cách nhìn.`:`SAV của nhà ${h.n} là ${e.sav}; dữ liệu Bhava Bala chưa đủ để đối chiếu. Vì thế mình không suy ra một mức thuận lợi chắc chắn chỉ từ một con số.`;
    const bridge=`${capitalize(scenes[h.n-1])} Đó là ví dụ về nơi chủ đề có thể được quan sát, không phải một sự kiện mà lá số khẳng định sẽ xảy ra.`;
    const nuance=s.difficult?`Vì chủ nhà nằm tại ${loc}, cách đọc có thêm các điều kiện liên quan đến ${linkThemes[e.lordHouse-1]}. Những nhà 6, 8, 12 trong hệ thống truyền thống có sắc thái phức tạp, nhưng không thể rút ra một lời dự đoán biến cố chỉ từ vị trí ấy.`:s.conflict?`Năng lực của nhà và mức hỗ trợ không phải một thước đo duy nhất. Đọc cùng lúc hai chiều này giúp tránh cả sự lạc quan quá sớm lẫn kết luận tiêu cực khi gặp một chỉ số thấp.`:s.supported?`Nền tảng tương đối thuận giúp chủ đề có thêm điều kiện biểu hiện, còn hướng biểu hiện phụ thuộc chủ nhà, liên hệ với nhà khác và hoàn cảnh sống. Một chỉ số mạnh không tự nói thay toàn bộ câu chuyện.`:s.aspect?`Góc chiếu của Sao Mộc là một phần của cấu trúc, không phải một cam kết rằng chuyện ${world} nhất định sẽ thuận lợi. Những liên hệ khác vẫn có thể làm thay đổi mức độ hỗ trợ.`:`Không có đủ bằng chứng để đặt một nhận định mạnh về kết quả. Chính sự dè dặt này giữ cho câu chuyện trung thành với dữ liệu, thay vì bắt mọi nhà phải có một lời phán đoán đặc biệt.`;
    const thought=`Từ mối liên hệ giữa ${subject} và ${loc}, câu hỏi có thể giữ lại là: ${questionEnds[h.n-1]}`;
    const narratives={
      contrast:{title:'Hai thước đo, hai góc nhìn',paras:[measured,bridge,houseLord,nuance]},
      crowd:{title:'Khi nhiều động lực gặp nhau',paras:[occupants,bridge,`Cần đọc thêm chủ nhà: ${rulerName} ở ${loc}, thuộc ${sign(g.sign)}. Sự đồng cung vì thế có thể làm phong phú một miền trải nghiệm, nhưng cũng có thể bộc lộ những hướng ưu tiên chưa thống nhất.`,thought]},
      strength:{title:'Nền tảng và giới hạn của thế mạnh',paras:[bridge,houseLord,measured,nuance]},
      conditions:{title:'Những điều kiện làm câu chuyện sâu hơn',paras:[nuance,bridge,occupants,thought]},
      link:{title:'Khi một lĩnh vực dẫn sang lĩnh vực khác',paras:[bridge,occupants,`Ở đây, trọng tâm đáng đọc là đường nối từ ${subject} sang ${loc} (${linkThemes[e.lordHouse-1]}). ${rulerName} đảm nhận vai trò liên kết, chứ không tự chứng minh một kết quả về ${world}.`,thought]},
      aspect:{title:'Một ảnh hưởng đi từ bên ngoài nhà',paras:[`Góc chiếu của Sao Mộc thêm một điều kiện cho ${subject}, nhưng vẫn cần đặt bên chủ nhà ${rulerName} đang ở ${loc}.`,bridge,measured,nuance]},
      theme:{title:'Đọc từ những điều gần gũi',paras:[bridge,houseLord,occupants,`Ở đây không có một tổ hợp đủ mạnh để lấn át các dữ kiện nền. Mình giữ phần chưa rõ ấy lại, để những trải nghiệm thực tế không bị ép vào một khuôn mô tả có sẵn.`]},
      detail:{title:'Những dấu hiệu nhỏ vẫn đáng đọc',paras:[measured,`Điều có thể xác minh là ${rulerName} giữ vai trò chủ nhà và ở ${loc}. Phần còn lại của chủ đề ${world} cần được soi từ các liên hệ chi tiết hơn.`,bridge]}
    };
    const narrative=narratives[s.pick];
    const evidence=[`Cung trên nhà: ${sign(e.sign)}; chủ nhà: ${rulerName} ở nhà ${e.lordHouse}.`,`Hành tinh cư trú: ${e.occupants.length?joinNames(e.occupants):'không có'}. Góc chiếu tới nhà: ${(e.aspectedBy||[]).length?joinNames(e.aspectedBy):'không ghi nhận'}.`,mid,`Phẩm chất chủ nhà: ${g.dignity||'không xác định'}.`];
    const retained=h.sections.filter(x=>!['now','next','turn','summary','open','why-v3'].includes(x.id));
    const sections=[
      {id:'open',title:['Điều xuất hiện trước hết','Một mối liên hệ cần đọc','Từ cấu trúc đến trải nghiệm','Nơi câu chuyện bắt đầu'][h.n%4],paragraphs:[leads[s.pick]]},
      {id:'summary',title:narrative.title,paragraphs:narrative.paras},
      ...retained,
      {id:'why-v3',title:'Vì sao mình nói điều này?',fold:true,paragraphs:evidence}
    ];
    return [{...h, sections, narrativePattern:s.pick,words:sections.flatMap(x=>x.paragraphs||[]).join(' ').trim().split(/\s+/).length},s.pick];
  }
  function varga(ctx, v) {
    const n=ctx.n,g=n.grahas,chart=v.chart;
    if(!chart||![9,10].includes(v.n))return v;
    const h=v.n===9?7:10, d1Lord=n.houses[h-1]?.lord;
    const d1Planet=d1Lord&&g[d1Lord];
    const d1Place=d1Planet?`${fmt(d1Lord)} ở nhà ${d1Planet.house}, cung ${sign(d1Planet.sign)}`:'chưa đủ dữ kiện chủ nhà';
    const chartSign=sign(chart.lagnaSign);
    const peer=chart.planets[d1Lord];
    const moved=d1Lord&&Number.isInteger(peer)?sign(peer):'chưa xác định';
    const topic=v.n===9?'khả năng duy trì cam kết, sự trưởng thành trong mối quan hệ và lớp nghĩa của dharma':'cách trách nhiệm nghề nghiệp được đảm đương, vai trò xã hội và phẩm chất công việc';
    const primary=v.n===9?'nhà 7':'nhà 10';
    const base=`Lá số D1 đặt ${primary} dưới sự cai quản của ${d1Lord?fmt(d1Lord):'một hành tinh chưa xác định'}; vị trí của chủ nhà trong D1 là ${d1Place}. Ở lá số D${v.n}, cung mọc là ${chartSign}${d1Lord?`, còn cùng hành tinh ấy chuyển tới cung ${moved}`:''}. Mình đọc sự dịch chuyển này như một phép đối chiếu hai lớp biểu tượng, không xem D${v.n} như một lá số độc lập thay thế D1.`;
    const strong=d1Lord&&hasStrong(g[d1Lord].dignity)?`Tại D1, ${fmt(d1Lord)} có phẩm chất cung thuận tương đối. Đây là nền tảng cần được đặt bên các chỉ dấu trong D${v.n}, không đủ để kết luận ngay về một cuộc hôn nhân hay bước tiến nghề nghiệp.`:d1Lord&&isWeak(g[d1Lord].dignity)?`Tại D1, ${fmt(d1Lord)} có phẩm chất cung suy giảm. Nếu D${v.n} cho hình ảnh khác, sự khác biệt nên được giữ lại và giải thích bằng điều kiện cụ thể, thay vì chọn cách nói dễ nghe hơn.`:`Chủ nhà trong D1 không cho một kết luận mạnh chỉ từ phẩm chất cung. Vì thế các vị trí ở D${v.n} được dùng để làm rõ sắc thái, không bị nâng thành lời dự đoán chắc chắn.`;
    const end=`D${v.n} được dùng để đọc sâu hơn về ${topic}. Cách phân tích ở đây không tự động sao chép mọi yoga, Bhava Bala hoặc góc chiếu của D1 sang lá số phân chia. Những tín hiệu có vẻ trái chiều giữa D1 và D${v.n} cần được đối chiếu theo phương pháp áp dụng, trước khi đưa ra nhận định.`;
    return {...v,lead:v.n===9?'D9 · Mối liên hệ và chiều sâu của cam kết':'D10 · Nghề nghiệp qua những tầng trách nhiệm',paragraphs:[base,strong,end,...v.paragraphs.slice(2,4)]};
  }
  function dasha(ctx,timeline){
    if(!timeline||!timeline.mahas)return timeline;
    const n=ctx.n;
    return {...timeline, intro:'Vimshottari Dasha cho thấy những giai đoạn mà các chủ đề vốn có trong lá số có thể được nhấn mạnh. Đại vận là khung thời gian, tiểu vận là sắc thái bên trong khung đó. Chúng không tạo ra tiềm năng mới từ hư không và không bảo đảm một sự kiện nhất định.',mahas:timeline.mahas.map(m=>{
      const p=n.grahas[m.lord], houses=n.houses.filter(h=>h.lord===m.lord).map(h=>h.n);
      const evidence=`Trong D1, ${fmt(m.lord)} ở ${houseOf(p,!ctx.noTime)}${houses.length?`; cai quản ${houses.map(houseName).join(' và ')}`:''}. Hành tinh này ${strengthText(p.dignity)}. Đây là cơ sở để chọn chủ đề nào có khả năng được gọi ra trong giai đoạn, chứ không phải dự báo rằng chủ đề ấy chắc chắn xảy ra.`;
      const explain=`Đại vận ${fmt(m.lord)} (${m.from} – ${m.to}) cho phép quan sát ${role[m.lord]}. Mối liên hệ giữa hành tinh chủ vận và các nhà nó cai quản quyết định câu chuyện cụ thể hơn tên gọi của đại vận; cùng một hành tinh có thể mang ý nghĩa khác nhau giữa các lá số.`;
      const caution=`Những khả năng vừa nói còn phụ thuộc phối hợp đại vận–tiểu vận, sức mạnh hành tinh và bối cảnh thực tế. Mình không chuyển một chỉ báo chiêm tinh thành lịch hẹn chắc chắn cho sự nghiệp, sức khỏe hay quan hệ.`;
      const read={...m.read,paragraphs:[explain,evidence,caution]};
      const antars=(m.antars||[]).map(a=>{
        const child=n.grahas[a.lord], ruled=n.houses.filter(h=>h.lord===a.lord).map(h=>h.n);
        return {...a,paragraphs:[`Trong đại vận ${fmt(m.lord)}, tiểu vận ${fmt(a.lord)} đưa thêm ${role[a.lord]} vào mạch chính. Cần xét sự phối hợp của hai hành tinh, không đọc từng tên riêng rồi ghép cơ học.`,`Dữ kiện từ D1: ${fmt(a.lord)} ở ${houseOf(child,!ctx.noTime)}${ruled.length?`, cai quản ${ruled.map(houseName).join(' và ')}`:''}. Đây là một điều kiện để lựa chọn chủ đề được nhấn mạnh, không phải một sự kiện định trước.`]};
      });
      return {...m, theme:`${fmt(m.lord)} · ${role[m.lord]}`,read,antars};
    })};
  }
  function gochara(sky) {
    if(!sky?.planets) return sky;
    return {...sky,planets:sky.planets.map(p=>{
      const original=p.text||'';
      const at=original.indexOf('Tính từ cung mọc của bạn,');
      if(at===-1) return {...p,moonText:original,lagnaText:null, text:`Tính từ Mặt Trăng gốc: ${original}`};
      let moon=original.slice(0,at).trim();
      let lagna=original.slice(at).trim();
      const caveat=lagna.indexOf('Bảng điểm riêng');
      if(caveat>=0) {moon+=' '+lagna.slice(caveat);lagna=lagna.slice(0,caveat).trim();}
      return {...p,moonText:moon,lagnaText:lagna,text:`Tính từ Mặt Trăng gốc: ${moon}\n\nTính từ cung mọc: ${lagna}`};
    })};
  }
  function enhance(base,ctx){
    if(!base || !ctx?.n?.grahas) return base;
    const next={...base,letter:letter(ctx,base.letter),overview:overview(ctx,base.overview)};
    if(Array.isArray(base.houses)){
      let previous=''; next.houses=base.houses.map(h=>{const [x,key]=houseStory(ctx,h,previous); previous=key; return x;});
    }
    if(Array.isArray(base.vargas))next.vargas=base.vargas.map(v=>varga(ctx,v));
    next.timeline=dasha(ctx,base.timeline);
    next.sky=gochara(base.sky);
    next.version='3.0';
    return next;
  }
  return {enhance,features,letter,overview,houseStory,varga,dasha,gochara};
});
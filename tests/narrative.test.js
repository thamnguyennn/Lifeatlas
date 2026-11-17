'use strict';
const assert=require('node:assert/strict');
const api=require('../v3-engine.js');
const ids=['sun','moon','mars','mercury','jupiter','venus','saturn','rahu','ketu'];
const lords=['mars','venus','mercury','moon','sun','mercury','venus','mars','jupiter','saturn','saturn','jupiter'];
const signNames=['Bạch Dương','Kim Ngưu','Song Tử','Cự Giải','Sư Tử','Xử Nữ','Thiên Bình','Thiên Yết','Nhân Mã','Ma Kết','Bảo Bình','Song Ngư'];
function fixture(kind){
 const asc=kind%12, gr={};
 for(let i=0;i<ids.length;i++){
  const sg=(i*2+kind)%12;
  gr[ids[i]]={id:ids[i],sign:sg,house:((sg-asc+12)%12)+1,deg:10,dignity:'neutral',nak:{name:['Bharani','Rohini','Hasta','Shravana'][i%4],pada:i%4+1}};
 }
 if(kind===0){gr.jupiter.dignity='exalted';gr.venus.dignity='own';}
 if(kind===1){gr.mars.dignity='debilitated';gr.sun.dignity='own';gr.moon.dignity='debilitated';}
 if(kind===2){gr.sun.sign=3;gr.moon.sign=3;gr.jupiter.sign=3;gr.venus.sign=3;}
 if(kind===3){gr.mercury.house=8;gr.jupiter.house=12;}
 if(kind===4){gr.venus.dignity='own';gr.saturn.dignity='debilitated';}
 if(kind===5){gr.sun.dignity='neutral';gr.moon.dignity='neutral';}
 const houses=Array.from({length:12},(_,i)=>{
  const sn=(asc+i)%12,l=lords[sn];
  return {n:i+1,sign:sn,lord:l,lordHouse:kind===3&&i%2===0?8:gr[l].house,occupants:ids.filter(id=>gr[id].house===i+1),aspectedBy:(kind+i)%3===0?['jupiter']:[],sav:kind===1&&i%2===0?35:kind===4&&i%3===0?22:28+(i%5),};
 });
 if(kind===2) {houses[0].occupants=['sun','moon','jupiter','venus'];}
 const n={lagna:{sign:asc},grahas:gr,houses};
 const ctx={name:`Người thử ${kind}`,noTime:kind===5,n,sb:{bhava:houses.map((_,i)=>({rank:((i+kind*2)%12)+1}))}};
 const base={letter:{greeting:'',line:'',chips:[]},overview:{intro:'',keystones:[],link:{title:'',paragraphs:[]},common:[],strength:null,cast:{title:'',rows:[]}},houses:houses.map(h=>({n:h.n,sections:[{id:'open',title:'A',paragraphs:['A']},{id:'summary',title:'B',paragraphs:['B']},{id:'now',title:'C',paragraphs:['Đại vận']},{id:'next',title:'D',paragraphs:['Tiểu vận']},{id:'turn',title:'E',paragraphs:['Khuyên']}],yogaIds:[]})),vargas:kind===5?null:[{n:9,chart:{lagnaSign:(asc+1)%12,planets:Object.fromEntries(ids.map((id,i)=>[id,(i*3+kind)%12]))},paragraphs:['Cũ 1','Cũ 2','Cũ 3','Cũ 4']},{n:10,chart:{lagnaSign:(asc+4)%12,planets:Object.fromEntries(ids.map((id,i)=>[id,(i*4+kind)%12]))},paragraphs:['Cũ 1','Cũ 2','Cũ 3','Cũ 4']}],timeline:{intro:'',mahas:[{lord:'sun',from:'2000',to:'2006',read:{title:'',paragraphs:['Cũ']},antars:[{lord:'mars',paragraphs:['Cũ']}] }]},sky:{planets:[{text:'Sao Thổ đứng ở cung thứ 4 so với Mặt Trăng. Tính từ cung mọc của bạn, Sao Thổ đi qua nhà 9, nên chuyện trách nhiệm nổi bật.'}]}};
 return {ctx,base};
}
const seen=[];
for(let i=0;i<6;i++){
 const {ctx,base}=fixture(i);
 const r=api.enhance(base,ctx);
 assert.equal(r.version,'3.0');
 assert.ok(r.letter.line.split('\n\n').length===4);
 assert.ok(r.letter.line.includes(signNames[ctx.n.grahas.sun.sign]));
 assert.ok(r.letter.line.includes(signNames[ctx.n.grahas.moon.sign]));
 assert.equal(r.overview.story.length,5);
 assert.equal(r.overview.cast,null);
 assert.ok(r.overview.story[0].evidence.length>=2);
 assert.equal(r.houses.length,12);
 const patterns=r.houses.map(h=>h.narrativePattern);
 for(let j=1;j<12;j++)assert.notEqual(patterns[j],patterns[j-1],`pattern repeated house ${j+1} fixture ${i}`);
 const names=new Set(patterns);
 assert.ok(names.size>=2);
 for(const h of r.houses){
  assert.ok(h.sections.every(x=>!['now','next','turn'].includes(x.id)));
  assert.ok(h.sections.find(x=>x.id==='why-v3'));
  assert.ok(h.sections.find(x=>x.id==='summary').paragraphs.join(' ').length>300);
 }
 assert.match(r.timeline.intro,/Vimshottari/);
 assert.match(r.timeline.mahas[0].read.paragraphs[0],/Đại vận/);
 assert.match(r.timeline.mahas[0].antars[0].paragraphs[0],/tiểu vận/);
 assert.match(r.sky.planets[0].text,/Tính từ Mặt Trăng gốc/);
 assert.match(r.sky.planets[0].text,/Tính từ cung mọc/);
 if(ctx.noTime){assert.doesNotMatch(r.letter.line,/cung .+ đang mọc lên ở chân trời/);assert.equal(r.vargas,null)}
 else {assert.equal(r.vargas.length,2);assert.match(r.vargas[0].paragraphs[0],/D1/);assert.match(r.vargas[1].paragraphs[0],/D10/)}
 seen.push(r.letter.line);
 console.log(`Case ${i+1}: narrative patterns [${patterns.join(', ')}], opening words=${r.letter.line.trim().split(/\s+/).length}`);
}
assert.equal(new Set(seen).size,6);
// Check repeated 5-word sequences to detect a single universal opening.
const shards=seen.map(s=>new Set(s.toLowerCase().split(/\s+/).slice(0,70).map((_,i,a)=>a.slice(i,i+5).join(' '))));
for(let i=0;i<6;i++)for(let j=i+1;j<6;j++){
 const intersection=[...shards[i]].filter(x=>shards[j].has(x)).length;
 assert.ok(intersection<40,`Openings ${i},${j} are too similar: ${intersection}`);
}
console.log('PASS: 6 deterministic scenarios, no dasha in 12 houses, no adjacent duplicate house pattern, D1/D9/D10, Gochara split, no-time, narrative variation.');
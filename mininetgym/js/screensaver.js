// ═══════════════════════════════════════════
// Background network animation
// ═══════════════════════════════════════════
const cv = document.getElementById('bgc');
const ct = cv.getContext('2d');
let W, H, frame = 0;
const nodes = [];
let pkts = [];
let atk = { on:false, ai:-1, vi:-1, blocked:false };

function resize() {
  W = cv.width = window.innerWidth;
  H = cv.height = window.innerHeight;
  buildTopo();
}
window.addEventListener('resize', resize);

function buildTopo() {
  nodes.length = 0;
  const cx = W*.5, cy = H*.5, R = Math.min(W,H)*.27;
  nodes.push({ x:cx, y:cy, t:'sw', lbl:'SW', r:20, blocked:false });
  for (let i=0; i<5; i++) {
    const a = (i/5)*Math.PI*2 - Math.PI/2;
    nodes.push({ x:cx+Math.cos(a)*R, y:cy+Math.sin(a)*R, t:'h', lbl:`H${i+1}`, r:13, blocked:false });
  }
  for (let i=0; i<5; i++) {
    const a = ((i+.5)/5)*Math.PI*2 - Math.PI/2;
    nodes.push({ x:cx+Math.cos(a)*R*1.65, y:cy+Math.sin(a)*R*1.65, t:'iot', lbl:`IoT${i+1}`, r:9, blocked:false });
  }
}

function drawBg() {
  const g = ct.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*.75);
  g.addColorStop(0,'#0c1a2e'); g.addColorStop(1,'#040b18');
  ct.fillStyle=g; ct.fillRect(0,0,W,H);
  ct.save(); ct.strokeStyle='rgba(66,165,245,.032)'; ct.lineWidth=1;
  const gs=55;
  for(let x=0;x<W;x+=gs){ct.beginPath();ct.moveTo(x,0);ct.lineTo(x,H);ct.stroke();}
  for(let y=0;y<H;y+=gs){ct.beginPath();ct.moveTo(0,y);ct.lineTo(W,y);ct.stroke();}
  ct.restore();
}

function drawEdges() {
  const sw=nodes[0];
  for(let i=1;i<nodes.length;i++){
    const n=nodes[i]; ct.save(); ct.beginPath();
    ct.moveTo(sw.x,sw.y); ct.lineTo(n.x,n.y);
    ct.strokeStyle='rgba(66,165,245,.07)'; ct.lineWidth=1; ct.stroke(); ct.restore();
  }
}

function drawNodes() {
  nodes.forEach((n,i)=>{
    const isA=atk.on&&i===atk.ai+1, isV=atk.on&&i===atk.vi+1;
    ct.save(); ct.beginPath(); ct.arc(n.x,n.y,n.r,0,Math.PI*2);
    if(n.t==='sw'){
      ct.fillStyle='rgba(21,101,192,.5)'; ct.strokeStyle='#42A5F5';
    } else if(n.t==='h'){
      ct.fillStyle=isA?'rgba(230,74,25,.5)':isV?'rgba(183,28,28,.35)':'rgba(0,105,92,.5)';
      ct.strokeStyle=isA?'#FF8A65':isV?'#EF9A9A':'#4DB6AC';
    } else {
      ct.fillStyle='rgba(55,71,79,.5)'; ct.strokeStyle='#607D8B';
    }
    if(n.blocked) ct.strokeStyle='#EF5350';
    ct.lineWidth=n.blocked?2.5:1.5; ct.fill(); ct.stroke();
    ct.fillStyle='#CFD8DC';
    ct.font=`${n.r<11?8:10}px Segoe UI,sans-serif`;
    ct.textAlign='center'; ct.textBaseline='middle';
    ct.fillText(n.lbl,n.x,n.y);
    if(n.blocked){
      ct.strokeStyle='#EF5350'; ct.lineWidth=2;
      const d=n.r*.55;
      ct.beginPath();
      ct.moveTo(n.x-d,n.y-d); ct.lineTo(n.x+d,n.y+d);
      ct.moveTo(n.x+d,n.y-d); ct.lineTo(n.x-d,n.y+d);
      ct.stroke();
    }
    ct.restore();
  });
}

function spawnPkt(fi,ti,isA){
  if(!nodes[fi]||!nodes[ti]) return;
  const f=nodes[fi],t=nodes[ti];
  pkts.push({x:f.x,y:f.y,sx:f.x,sy:f.y,tx:t.x,ty:t.y,p:0,spd:.018+Math.random()*.012,atk:isA,a:1});
}

function updatePkts(){
  pkts=pkts.filter(p=>p.a>0);
  pkts.forEach(p=>{
    p.p+=p.spd; if(p.p>=1){p.p=1;p.a-=.06;}
    p.x=p.sx+(p.tx-p.sx)*p.p; p.y=p.sy+(p.ty-p.sy)*p.p;
  });
}

function drawPkts(){
  pkts.forEach(p=>{
    ct.save(); ct.globalAlpha=p.a; ct.beginPath(); ct.arc(p.x,p.y,p.atk?4:3,0,Math.PI*2);
    ct.fillStyle=p.atk?'#FF5252':'#4DB6AC';
    ct.shadowColor=p.atk?'#FF5252':'#4DB6AC'; ct.shadowBlur=10;
    ct.fill(); ct.restore();
  });
}

function manageAtk(){
  const ph=frame%320;
  if(ph===0&&frame>0){
    atk.ai=Math.floor(Math.random()*5);
    let vi=Math.floor(Math.random()*5);
    while(vi===atk.ai) vi=Math.floor(Math.random()*5);
    atk.vi=vi; atk.on=true; atk.blocked=false;
    nodes.forEach(n=>n.blocked=false);
  }
  if(atk.on&&!atk.blocked&&ph===90){ atk.blocked=true; nodes[atk.ai+1].blocked=true; }
  if(atk.on&&ph>=280){ atk.on=false; nodes.forEach(n=>n.blocked=false); }
}

function spawnTraffic(){
  if(frame%18===0){
    const hi=1+Math.floor(Math.random()*10);
    spawnPkt(hi,0,false); spawnPkt(0,hi,false);
  }
  if(atk.on&&!atk.blocked&&frame%7===0){
    spawnPkt(atk.ai+1,0,true); spawnPkt(0,atk.vi+1,true);
  }
}

function tick(){
  frame++; manageAtk(); spawnTraffic(); updatePkts();
  drawBg(); drawEdges(); drawPkts(); drawNodes();
  requestAnimationFrame(tick);
}

resize(); tick();

// ═══════════════════════════════════════════
// Slide manager
// ═══════════════════════════════════════════
const SLIDES = ['s1','s2','s3','s4','svid','s5','s6','s7','s8'];
const DURS   = [9000,10500,10000,9000,11000,12000,12000,9000,8000];
let cur = 0, slideStart = performance.now(), inTrans = false;

function showSlide(idx){
  document.querySelectorAll('.al,.aarr').forEach(e=>e.classList.remove('vis'));
  document.querySelectorAll('.sc,.ds').forEach(e=>e.classList.remove('vis'));
  SLIDES.forEach((id,i)=>document.getElementById(id).classList.toggle('active',i===idx));
  const sid=SLIDES[idx];
  if(sid==='s2') animateArch();
  if(sid==='s3') animateStagger('.sc');
  if(sid==='s4') animateStagger('.ds');
  if(sid==='svid') initQR();
}

let qrReady = false;
function initQR(){
  if(qrReady) return;
  const el = document.getElementById('vid-qr');
  if(!window.QRCode){ return; }
  el.innerHTML = '';
  new QRCode(el, {
    text: 'https://youtu.be/sSzUz6w-4H8',
    width: 190, height: 190,
    colorDark: '#000000', colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M
  });
  qrReady = true;
}

function animateArch(){
  document.querySelectorAll('#aw .al,#aw .aarr').forEach(el=>{
    setTimeout(()=>el.classList.add('vis'), parseInt(el.dataset.di||0));
  });
}
function animateStagger(sel){
  document.querySelectorAll(sel).forEach(el=>{
    setTimeout(()=>el.classList.add('vis'), parseInt(el.dataset.di||0)+80);
  });
}

function loop(now){
  const elapsed=now-slideStart, dur=DURS[cur];
  document.getElementById('pbar').style.width=Math.min(elapsed/dur*100,100)+'%';
  if(elapsed>=dur&&!inTrans){
    inTrans=true;
    const el=document.getElementById(SLIDES[cur]);
    el.style.opacity='0';
    setTimeout(()=>{
      el.style.opacity='';
      cur=(cur+1)%SLIDES.length;
      showSlide(cur);
      slideStart=performance.now();
      inTrans=false;
    },900);
  }
  requestAnimationFrame(loop);
}

showSlide(0);
requestAnimationFrame(loop);

// ═══════════════════════════════════════════
// Click/Space to advance slide
// ═══════════════════════════════════════════
function nextSlide(){
  if(inTrans) return;
  inTrans=true;
  const el=document.getElementById(SLIDES[cur]);
  el.style.opacity='0';
  setTimeout(()=>{
    el.style.opacity='';
    cur=(cur+1)%SLIDES.length;
    showSlide(cur);
    slideStart=performance.now();
    inTrans=false;
  },900);
}

document.addEventListener('click', nextSlide);
document.getElementById('next-hint').addEventListener('click', e=>e.stopPropagation());

document.addEventListener('keydown', e=>{
  if(e.code==='Space'){
    e.preventDefault();
    nextSlide();
  }
});
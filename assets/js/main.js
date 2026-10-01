(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- nav ---------------- */
var nav=$('#nav');
function onScroll(){nav.classList.toggle('solid',window.scrollY>40)}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

/* ---------------- hero intro ---------------- */
var hero=$('#top'), art=$('#art'), goatPos=$('#goatPos'), canvas=$('#fx'), ctx=canvas.getContext('2d');
var logo=$('#introLogo'), logoSvg=$('#introLogo svg');
var LEDGES=[[151,602],[282,507],[399,402],[501,302],[621,180]];
var S=0.72;
var legs=$$('#goatPos .leg').map(function(g){var low=g.querySelector('.low');return{g:g,n:g.getAttribute('data-leg'),p:g.getAttribute('data-p').split(','),low:low,lp:low.getAttribute('data-p').split(',')}});
var head=$('#goatPos .head'), headP=head.getAttribute('data-p').split(',');
var POSES={
  stand:{fn:[0,0],ff:[0,0],hn:[0,0],hf:[0,0]},
  crouch:{fn:[14,-22],ff:[14,-22],hn:[-12,18],hf:[-12,18]},
  leap:{fn:[-70,95],ff:[-58,85],hn:[48,-10],hf:[40,-6]},
  land:{fn:[-22,12],ff:[-16,8],hn:[24,0],hf:[18,0]}
};
function setPose(a,b,t){legs.forEach(function(L){var A=POSES[a][L.n],B=POSES[b][L.n];var u=A[0]+(B[0]-A[0])*t,l=A[1]+(B[1]-A[1])*t;
  L.g.setAttribute('transform','rotate('+u.toFixed(2)+' '+L.p[0]+' '+L.p[1]+')');L.low.setAttribute('transform','rotate('+l.toFixed(2)+' '+L.lp[0]+' '+L.lp[1]+')')})}
function setGoat(x,y,rot,sy){goatPos.setAttribute('transform','translate('+x.toFixed(2)+' '+y.toFixed(2)+') scale('+S+') rotate('+(rot||0).toFixed(2)+' 0 -60) scale(1 '+(sy==null?1:sy).toFixed(3)+')')}
function setHead(a){head.setAttribute('transform','rotate('+a.toFixed(2)+' '+headP[0]+' '+headP[1]+')')}
var E={
  inOut:function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2},
  out:function(t){return 1-Math.pow(1-t,3)},
  sine:function(t){return -(Math.cos(Math.PI*t)-1)/2},
  lin:function(t){return t}
};
var run=0;
function tween(dur,fn,ease){var id=run;ease=ease||E.lin;return new Promise(function(res){var t0=performance.now();function step(now){if(id!==run)return res(false);var t=Math.min(1,(now-t0)/dur);fn(ease(t),t);if(t<1)requestAnimationFrame(step);else res(true)}requestAnimationFrame(step)})}
function wait(ms){var id=run;return new Promise(function(res){setTimeout(function(){res(id===run)},ms)})}

/* responsive framing of the mountain on narrow screens */
var phone=window.matchMedia('(max-width:600px)');
function frameArt(){var w=art.clientWidth||1,h=art.clientHeight||1;art.setAttribute('viewBox',phone.matches?'90 30 720 650':(w/h<1.25)?'60 40 900 620':'0 0 1000 700')}
frameArt();window.addEventListener('resize',frameArt);

function finalState(){
  run++;
  hero.className='hero';delete hero.dataset.playing;nav.classList.remove('hide');
  setPose('stand','stand',0);setGoat(LEDGES[4][0],LEDGES[4][1],0,1);setHead(0);
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

/* sample filled pixels of a shape drawn with Path2D */
function sample(paths,w,h,setup,step){
  var c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(w));c.height=Math.max(1,Math.ceil(h));
  var x=c.getContext('2d');setup(x);paths.forEach(function(d){x.fill(new Path2D(d))});
  var data=x.getImageData(0,0,c.width,c.height).data,pts=[];
  for(var yy=0;yy<c.height;yy+=step)for(var xx=0;xx<c.width;xx+=step){if(data[((yy|0)*c.width+(xx|0))*4+3]>140)pts.push([xx,yy])}
  return pts;
}
function buildParticles(){
  var hr=hero.getBoundingClientRect();
  var dpr=Math.min(2,window.devicePixelRatio||1);
  canvas.width=Math.round(hr.width*dpr);canvas.height=Math.round(hr.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  // trustmark (logo viewBox units → screen)
  var lr=logoSvg.getBoundingClientRect(),k=lr.width/280;
  var tmD=$$('#tm path').map(function(p){return p.getAttribute('d')});
  var A=sample(tmD,70*k,111*k,function(x){x.setTransform(k,0,0,k,0,0)},Math.max(1.6,k*.9)).map(function(p){return[p[0]+lr.left-hr.left,p[1]+lr.top-hr.top]});
  // goat at the foot of the mountain, rest pose
  var g=goatPos.getScreenCTM(),gk=g.a;
  var gD=$$('#goatPos path').filter(function(p){return p.getAttribute('fill')!=='none'}).map(function(p){return p.getAttribute('d')});
  var B=sample(gD,160*gk,156*gk,function(x){x.setTransform(gk,0,0,gk,72*gk,154*gk)},Math.max(1.1,gk*.55)).map(function(p){var lx=p[0]/gk-72,ly=p[1]/gk-154;return[g.a*lx+g.c*ly+g.e-hr.left,g.b*lx+g.d*ly+g.f-hr.top]});
  if(!A.length||!B.length)return null;
  var N=Math.min(1700,Math.max(900,A.length));
  function sortKey(arr){var minX=1e9,maxX=-1e9,minY=1e9,maxY=-1e9;arr.forEach(function(p){minX=Math.min(minX,p[0]);maxX=Math.max(maxX,p[0]);minY=Math.min(minY,p[1]);maxY=Math.max(maxY,p[1])});
    return arr.map(function(p){return{p:p,k:(p[1]-minY)/(maxY-minY+1)+.35*(p[0]-minX)/(maxX-minX+1)+Math.random()*.08}}).sort(function(a,b){return a.k-b.k}).map(function(o){return o.p})}
  A=sortKey(A);B=sortKey(B);
  var cols=['#FFF0C2','#F4CF7A','#E2AE52','#C8913A'],P=[];
  for(var i=0;i<N;i++){
    var a=A[Math.floor(i*A.length/N)],b=B[Math.floor(i*B.length/N)];
    var mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;
    var sw=(Math.random()*2-1)*Math.min(220,L*.45);
    P.push({x0:a[0]+(Math.random()-.5)*1.5,y0:a[1]+(Math.random()-.5)*1.5,x1:b[0]+(Math.random()-.5)*.8,y1:b[1]+(Math.random()-.5)*.8,
      cx:mx-dy/L*sw,cy:my+dx/L*sw-(40+Math.random()*110),d:(i/N)*380+Math.random()*220,s:1.3+Math.random()*1.5,c:(Math.random()*cols.length)|0});
  }
  P.sort(function(p,q){return p.c-q.c});
  return{P:P,cols:cols,w:hr.width,h:hr.height};
}
function drawParticles(F,el,dur){
  ctx.clearRect(0,0,F.w,F.h);var cur=-1;
  for(var i=0;i<F.P.length;i++){var p=F.P[i];var u=Math.min(1,Math.max(0,(el-p.d)/dur));u=E.inOut(u);var iu=1-u;
    var x=iu*iu*p.x0+2*iu*u*p.cx+u*u*p.x1,y=iu*iu*p.y0+2*iu*u*p.cy+u*u*p.y1;var s=p.s*(1-.35*u)+.25*Math.sin(u*Math.PI)*2;
    if(p.c!==cur){cur=p.c;ctx.fillStyle=F.cols[cur]}ctx.fillRect(x-s/2,y-s/2,s,s)}
}
function hop(a,b){
  return tween(140,function(e){setPose('stand','crouch',e);setGoat(a[0],a[1],0,1-.1*e)},E.out)
  .then(function(ok){if(!ok)return false;var h=58+Math.abs(b[1]-a[1])*.35;
    return tween(480,function(e){var x=a[0]+(b[0]-a[0])*e,y=a[1]+(b[1]-a[1])*e-h*4*e*(1-e);var rot=-20*(1-e)+8*Math.max(0,(e-.7)/.3);
      if(e<.5)setPose('crouch','leap',Math.min(1,e*3));else setPose('leap','land',(e-.5)*2);setGoat(x,y,rot,1)},E.sine)})
  .then(function(ok){if(!ok)return false;return tween(150,function(e){setPose('land','stand',e);setGoat(b[0],b[1],8*(1-e),1-.07*Math.sin(Math.PI*e))},E.out)});
}
function playIntro(replay){
  if(reduce){finalState();return}
  run++;var id=run;
  hero.dataset.playing='1';hero.className='hero intro'+(replay?' replaying':'');nav.classList.add('hide');
  frameArt();setPose('stand','stand',0);setHead(0);setGoat(LEDGES[0][0],LEDGES[0][1],0,1);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  var alive=function(){return id===run};
  // 1 · official full-colour logo on white
  wait(replay?380:120).then(function(ok){if(!ok)return;hero.classList.add('logo-in');return wait(1250)})
  // 2 · Tết red blooms out from the logo, logo turns to gold foil
  .then(function(ok){if(!ok||!alive())return;hero.classList.add('bloom');return wait(800)})
  .then(function(ok){if(!ok||!alive())return;hero.classList.add('shine');return wait(600)})
  .then(function(ok){if(!ok||!alive())return;hero.classList.add('uncurtain','wm-out');return wait(480)})
  // 3 · Trustmark dissolves into gold dust that becomes the goat
  .then(function(ok){if(!ok||!alive())return;
    var F=null;try{F=buildParticles()}catch(err){F=null}
    hero.classList.add('draw');
    if(!F){hero.classList.add('tm-out','goat-in');return wait(900)}
    drawParticles(F,0,1200);hero.classList.add('fx-on','tm-out');
    var DUR=1200,TOTAL=1200+600;
    return tween(TOTAL,function(e,t){drawParticles(F,t*TOTAL,DUR)}).then(function(ok){if(!ok)return false;
      hero.classList.add('goat-in','fx-fade');return wait(350)});
  })
  // 4 · the goat climbs ledge by ledge to the summit
  .then(function(ok){if(!ok||!alive())return;
    var chain=Promise.resolve(true);
    for(var i=0;i<LEDGES.length-1;i++)(function(i){chain=chain.then(function(ok){return ok?hop(LEDGES[i],LEDGES[i+1]):false})})(i);
    return chain;
  })
  // 5 · sun ring, head lifts, copy appears
  .then(function(ok){if(!ok||!alive())return;hero.classList.add('ring-in','reveal');nav.classList.remove('hide');
    return tween(800,function(e){setHead(-7*Math.sin(Math.PI*Math.min(1,e*1.2)))},E.sine)})
  .then(function(ok){if(!ok||!alive())return;return wait(1100)})
  .then(function(ok){if(!ok||!alive())return;
    hero.className='hero';delete hero.dataset.playing;nav.classList.remove('hide');ctx.clearRect(0,0,canvas.width,canvas.height);
  });
}
$('#skip').addEventListener('click',finalState);
$('#replay').addEventListener('click',function(){window.scrollTo({top:0,behavior:'auto'});playIntro(true)});
function whenVisible(cb){if(!document.hidden)return cb();document.addEventListener('visibilitychange',function h(){if(!document.hidden){document.removeEventListener('visibilitychange',h);cb()}})}
if(hero.classList.contains('intro')&&!reduce){
  hero.dataset.playing='1';
  var start=function(){whenVisible(function(){if(hero.classList.contains('intro'))playIntro(false)})};
  if(document.fonts&&document.fonts.ready){Promise.race([document.fonts.ready,new Promise(function(r){setTimeout(r,1200)})]).then(start)}else start();
}else{finalState()}
window.addEventListener('scroll',function(){if(hero.dataset.playing&&window.scrollY>hero.offsetHeight*.7)finalState()},{passive:true});

/* ---------------- gift filters ---------------- */
var chips=$$('.chip'),gifts=$$('.gift'),golden=$('#mua-vang');
chips.forEach(function(c){c.addEventListener('click',function(){
  var f=c.getAttribute('data-f');chips.forEach(function(x){x.setAttribute('aria-pressed',String(x===c))});
  gifts.forEach(function(g){var show=f==='all'||g.getAttribute('data-line')===f||(f==='wine'&&g.getAttribute('data-wine')==='1')||(f==='nowine'&&g.getAttribute('data-wine')==='0');g.hidden=!show});
  golden.hidden=!(f==='all');
})});

/* ---------------- lightbox ---------------- */
var lb=$('#lb'),lbImg=$('#lbImg'),lbCap=$('#lbCap');
$$('.zoomable').forEach(function(b){b.addEventListener('click',function(){var img=b.querySelector('img');lbImg.src=img.src;lbImg.alt=img.alt;lbCap.textContent=b.getAttribute('data-cap')||img.alt;
  if(lb.showModal)lb.showModal();else lb.setAttribute('open','')})});
$('#lbClose').addEventListener('click',function(){lb.close()});
lb.addEventListener('click',function(e){if(e.target===lb)lb.close()});

/* ---------------- personalised card ---------------- */
var lang='vi',sal=$('#salute'),nm=$('#rname'),mBody=$('#mBody'),mH=$('#mH');
function esc(s){return s.replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function renderCard(){
  var s=sal.value,n=esc(nm.value.trim());
  if(lang==='vi'){
    mH.textContent='Chúc mừng năm mới';
    var to=n?(s==='Quý đối tác'?s+' '+n:s+' '+n):s;
    mBody.innerHTML='<p>Thân gửi '+to+',</p><p>Cảm ơn '+s+' đã tận tâm đóng góp và đồng hành cùng Standard Chartered trong năm qua.</p><p>Kính chúc '+s+' cùng gia đình một năm mới sức khỏe, bình an và hạnh phúc. Mong món quà nhỏ này góp thêm niềm vui trong những ngày Tết sum vầy.</p><p>Trân trọng,<br>Standard Chartered</p>';
  }else{
    mH.textContent='Happy New Year';
    var t={'Anh':'Mr. ','Ông':'Mr. ','Chị':'Ms. ','Bà':'Ms. '}[s]||'';
    var to2=n?(t+n):(s==='Quý đối tác'?'Valued Partner':'Valued Client');
    mBody.innerHTML='<p>Dear '+to2+',</p><p>Thank you for your dedication and partnership with Standard Chartered over the past year.</p><p>We wish you and your family a new year of good health, peace and happiness. May this small gift add to the joy of your Tết celebrations.</p><p>Warm regards,<br>Standard Chartered</p>';
  }
}
sal.addEventListener('change',renderCard);nm.addEventListener('input',renderCard);
$$('.seg button').forEach(function(b){b.addEventListener('click',function(){lang=b.getAttribute('data-lang');$$('.seg button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});renderCard()})});
renderCard();

/* ---------------- copy buttons ---------------- */
$$('[data-copy]').forEach(function(b){b.addEventListener('click',function(){
  var v=b.getAttribute('data-copy'),out=$('#'+b.getAttribute('data-done'));
  function fallback(){var el=b.closest('.ci').querySelector('.val');var r=document.createRange();r.selectNodeContents(el);var s=window.getSelection();s.removeAllRanges();s.addRange(r);out.textContent='Đã chọn sẵn, nhấn Ctrl/⌘ + C để sao chép.'}
  try{navigator.clipboard.writeText(v).then(function(){out.textContent='Đã sao chép: '+v},fallback)}catch(e){fallback()}
})});

/* ---------------- gentle reveal (content is readable at rest) ---------------- */
if(!reduce&&'IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px'});
  $$('.rv').forEach(function(el){var r=el.getBoundingClientRect();if(r.top>window.innerHeight){el.classList.add('pre');io.observe(el)}});
}
})();

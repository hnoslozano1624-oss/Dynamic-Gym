(function(){
  var b=document.getElementById('menu-btn'),l=document.getElementById('links');
  if(b&&l){b.addEventListener('click',function(){var o=l.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false')})}
  var f=document.getElementById('form');
  try{var q=new URLSearchParams(location.search).get('interes'),sel=document.getElementById('interes');if(q&&sel)sel.value=q;var pl=new URLSearchParams(location.search).get('plan'),ms=document.getElementById('msg');if(/^(4|8|12)$/.test(pl||'')&&ms&&!ms.value)ms.value='Me interesa el plan de '+pl+' clases al mes.'}catch(e){}
  if(f){f.addEventListener('submit',function(e){e.preventDefault();var wa=f.getAttribute('data-wa');if(wa){var g=function(i){var el=document.getElementById(i);return el?el.value.trim():''};var txt='Hola, soy '+g('nombre')+'. Me interesa: '+(document.getElementById('interes')?document.getElementById('interes').selectedOptions[0].text:'')+'. '+g('msg')+(g('tel')?' Mi contacto: '+g('tel'):'');window.open('https://wa.me/'+wa+'?text='+encodeURIComponent(txt),'_blank','noopener');return}var a=document.getElementById('aviso');if(a)a.textContent='Gracias. Esta es una versión de pruebas y el mensaje no se envió. Cuando el sitio esté conectado, tu mensaje llegará a la academia.'})}
  var c=document.querySelector('.confetti');
  if(c&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){
    var H=c.clientHeight||500;
    for(var n=0;n<46;n++){var p=document.createElement('i'),w=5+Math.random()*7,d=4.5+Math.random()*4.5,
      dl=Math.random()*d;
      p.style.cssText='left:'+(Math.random()*100)+'%;width:'+w+'px;height:'+(w*1.9)+'px;border-radius:1px;--dx:'+(Math.random()*90-45)+'px;--dy:'+(H+40)+'px;--rot:'+(Math.random()*900-450)+'deg;animation-duration:'+d+'s,'+(0.9+Math.random()*1.4)+'s;animation-delay:-'+dl+'s,-'+(Math.random()*2)+'s';
      c.appendChild(p)}
  }
})();

/* Trofeos rotatorios en la portada de Campeonatos */
(function(){try{var h=document.querySelector('.hero.rot');if(!h)return;var im=h.querySelectorAll('img.bg');if(im.length<2||matchMedia('(prefers-reduced-motion: reduce)').matches)return;var i=0;setInterval(function(){im[i].classList.remove('on');i=(i+1)%im.length;im[i].classList.add('on')},4500)}catch(e){}})();

/* Medallería: los números suman hasta su valor al aparecer en pantalla y al tocar la tarjeta */
(function(){try{var els=document.querySelectorAll('.medal strong[data-n]');if(!els.length)return;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function run(el){var n=+el.dataset.n,c=el.parentNode;clearTimeout(el._t);c.classList.remove('done');el.dataset.run=(+el.dataset.run||0)+1;var id=el.dataset.run;
function end(){el.textContent=n;c.classList.add('done');if(!reduce&&n>0)el._t=setTimeout(function(){run(el)},5000)}
if(reduce||n<1){end();return}var t0=null,d=Math.min(2600,1200+n*30);
function f(t){if(el.dataset.run!==id)return;if(!t0)t0=t;var p=Math.min((t-t0)/d,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f);else end()}requestAnimationFrame(f)}
if(!('IntersectionObserver' in window)){els.forEach(function(e){e.textContent=e.dataset.n});return}
var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){run(x.target);io.unobserve(x.target)}})},{threshold:.5});
els.forEach(function(e){io.observe(e);var c=e.parentNode;c.addEventListener('click',function(){run(e)});c.addEventListener('keydown',function(k){if(k.key==='Enter'||k.key===' '){k.preventDefault();run(e)}})})}catch(e){}})();

/* Portada: el movimiento de las niñas avanza y retrocede con el scroll (secuencia de fotogramas en canvas; sin video ni reproducción automática) */
(function(){try{
var tr=document.querySelector('.lv-track[data-seq]');if(!tr)return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var auto=matchMedia('(max-width:1024px), (pointer:coarse) and (max-width:1366px)').matches;
var mob=matchMedia('(max-width:700px)').matches&&+tr.dataset.nM>=8;
var n=mob?+tr.dataset.nM:+tr.dataset.n,pat=mob?tr.dataset.seqM:tr.dataset.seq;
var hero=tr.querySelector('.hero.live'),stage=tr.querySelector('.lv-stage'),img=stage.querySelector('img');
var cv=document.createElement('canvas');cv.className='lv-cv';cv.setAttribute('aria-hidden','true');stage.insertBefore(cv,img.nextSibling);
var cx=cv.getContext('2d');if(!cx)return;
var fr=[],shown=-1,pinned=false,navH=0,W=0,H=0,fx=.72,raf=0,pos=0,tgt=0,ready=false;
function url(i){return pat.replace('%02d',('0'+i).slice(-2))}
function load(i,cb){if(fr[i])return cb&&cb();var m=new Image();m.decoding='async';m.onload=function(){fr[i]=m;cb&&cb()};m.onerror=function(){cb&&cb()};m.src=url(i)}
var pb=document.createElement('div');pb.style.cssText='position:fixed;left:0;top:0;width:0;height:100svh;visibility:hidden;pointer-events:none';document.body.appendChild(pb);
function vh(){var h=pb.offsetHeight;return h>200?h:window.innerHeight}
var lw=innerWidth;
function size(){var r=stage.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);W=Math.round(r.width*d);H=Math.round(r.height*d);cv.width=W;cv.height=H;
 var op=(getComputedStyle(img).objectPosition||'72% 50%').split(' ')[0];fx=mob?.7:parseFloat(op)/100;if(!(fx>=0&&fx<=1))fx=.72;
 var nh=document.querySelector('header.nav');navH=nh?nh.offsetHeight:0;
 hero.style.minHeight='';
 if(mob){stage.style.height='';var nat=stage.offsetHeight,wh=hero.offsetHeight-nat,av=vh()-navH-wh-2;if(av<nat&&av>=190){stage.style.height=av+'px';W=Math.round(stage.getBoundingClientRect().width*Math.min(window.devicePixelRatio||1,2));H=Math.round(av*Math.min(window.devicePixelRatio||1,2));cv.width=W;cv.height=H}}
 pinned=!auto&&(hero.offsetHeight+navH)<=vh();
 var fill=pinned&&!mob;if(fill)hero.style.minHeight=Math.max(hero.offsetHeight,Math.min(vh()-navH,Math.round(stage.getBoundingClientRect().width/2.5*1.15)))+'px';
 tr.classList.toggle('fill',fill);
 var extra=pinned?Math.round(Math.min(vh()*2.4,2200)):0;
 tr.style.height=(hero.offsetHeight+extra)+'px';tr.classList.toggle('pin',pinned);hero.style.top=navH+'px';shown=-1;target();loop()}
function draw(i){var m=fr[i];if(!m)for(var k=i;k>=0&&!m;k--)m=fr[k];if(!m)return;
 var s=Math.max(W/m.naturalWidth,H/m.naturalHeight),w=m.naturalWidth*s,h=m.naturalHeight*s;
 cx.drawImage(m,(W-w)*fx,(H-h)/2,w,h);cv.classList.add('on')}
function prog(){var r=tr.getBoundingClientRect();
 if(pinned){var d=tr.offsetHeight-hero.offsetHeight;return d>0?(navH-r.top)/d:0}
 return (navH-r.top)/(hero.offsetHeight*.6)}
function target(){tgt=Math.max(0,Math.min(1,prog()))}
/* El fotograma sigue a la posición del scroll; un amortiguado corto (menos de 0,3 s) evita saltos con la rueda del ratón y se detiene en cuanto el scroll para */
function loop(){raf=0;var d=tgt-pos;pos=Math.abs(d)<.0008?tgt:pos+d*.2;var i=Math.round(pos*(n-1));
 if(i!==shown){shown=i;draw(i);if(!fr[i])load(i,function(){if(shown===i)draw(i)})}
 if(pos!==tgt)raf=requestAnimationFrame(loop)}
function req(){if(auto)return;target();if(!raf)raf=requestAnimationFrame(loop)}
/* Celular y tableta: el movimiento se reproduce solo, en bucle de ida y vuelta (sin depender del scroll) */
var ar=0,al=0,vis=true,go=false,ap=0,adir=1,okc=0,fps=n/7.97;/* misma cadencia del video original: 7,97 s para toda la secuencia */
function aframe(t){ar=0;if(!go||!vis||document.hidden){al=0;return}
 if(!al)al=t;var dt=Math.min(t-al,100)/1000;al=t;while(fr[okc])okc++;
 var np=ap+adir*fps*dt;
 if(adir>0&&np>=n-1){np=n-1;adir=-1}else if(adir<0&&np<=0){np=0;adir=1}
 if(np>okc-1)np=Math.max(0,okc-1);/* si los fotogramas aún cargan, espera en el último disponible */
 ap=np;var i=Math.floor(ap),f=ap-i;draw(i);
 shown=i;ar=requestAnimationFrame(aframe)}
function astart(){if(go)return;go=true;al=0;if(!ar)ar=requestAnimationFrame(aframe)}
if(auto){if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis&&go&&!ar){al=0;ar=requestAnimationFrame(aframe)}}).observe(hero);
 document.addEventListener('visibilitychange',function(){if(!document.hidden&&go&&!ar){al=0;ar=requestAnimationFrame(aframe)}})}
function boot(){size();if(auto&&vid)return;loadAll()}
function loadAll(){var q=[];for(var i=1;i<n;i++)q.push(i);var run=0;
 (function pump(){while(run<6&&q.length){run++;load(q.shift(),function(){run--;pump();if(!auto&&!raf)raf=requestAnimationFrame(loop)})}})()}
addEventListener('scroll',req,{passive:true});addEventListener('resize',function(){if(innerWidth===lw)return;lw=innerWidth;size()});
var vid=null;
function startVid(){/* Celular y tableta: se reproduce el video original (30 fps, en bucle); si el dispositivo no lo permite, queda la secuencia de fotogramas */
 var u=tr.dataset.vid;if(!u||!auto)return false;vid=document.createElement('video');vid.className='lv-vid';[[u,'video/mp4'],[u.replace(/\.mp4$/,'.webm'),'video/webm']].forEach(function(x){var so=document.createElement('source');so.src=x[0];so.type=x[1];vid.appendChild(so)});vid.muted=true;vid.defaultMuted=true;vid.loop=true;vid.playsInline=true;vid.setAttribute('playsinline','');vid.setAttribute('muted','');vid.setAttribute('aria-hidden','true');vid.preload='auto';vid.style.objectPosition=Math.round(fx*100)+'% center';
 stage.insertBefore(vid,cv.nextSibling);
 var bad=function(){if(vid){vid.remove();vid=null}go=false;loadAll();astart()};
 vid.lastChild.addEventListener('error',bad);
 vid.addEventListener('playing',function(){vid.classList.add('on');go=false;cv.style.display='none'});
 var pl=function(){var r=vid&&vid.play();if(r&&r.catch)r.catch(function(){setTimeout(function(){if(vid&&vid.paused&&!vid.classList.contains('on'))bad()},600)})};
 pl();if('IntersectionObserver' in window)new IntersectionObserver(function(es){if(!vid)return;if(es[0].isIntersecting)pl();else vid.pause()}).observe(hero);
 return true}
load(0,function(){size();ready=true;if(auto){if(!startVid())astart()}(window.requestIdleCallback||function(f){setTimeout(f,200)})(boot)});
}catch(e){}})();
(function(){try{
if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches||!Element.prototype.animate)return;
var col=['#4696FF','#6CBF1F','#FFFFFF','#8CC4FF','#7FD13C'],last=new WeakMap();
document.addEventListener('pointerover',function(e){var c=e.target.closest&&e.target.closest('.card:not(.medal)');if(!c||(e.relatedTarget&&c.contains(e.relatedTarget)))return;
 var t=Date.now();if(t-(last.get(c)||0)<700)return;last.set(c,t);
 var r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
 for(var i=0;i<7;i++){var s=document.createElement('i');s.className='pic-star';s.style.background=col[i%col.length];c.appendChild(s);
  var a=-Math.PI/2+(Math.random()-.5)*2.4,d=40+Math.random()*60,sz=.6+Math.random()*.9,rot=(Math.random()-.5)*160;
  var x0=x-8,y0=y-8,dx=Math.cos(a)*d,dy=Math.sin(a)*d-12;
  var an=s.animate([{opacity:0,transform:'translate('+x0+'px,'+y0+'px) scale(0) rotate(0deg)'},{opacity:1,offset:.25,transform:'translate('+(x0+dx*.5)+'px,'+(y0+dy*.5)+'px) scale('+sz+') rotate('+rot/2+'deg)'},{opacity:0,transform:'translate('+(x0+dx)+'px,'+(y0+dy+18)+'px) scale('+sz*.5+') rotate('+rot+'deg)'}],{duration:650+Math.random()*250,delay:i*35,easing:'cubic-bezier(0.23,1,0.32,1)',fill:'both'});
  an.onfinish=(function(el){return function(){el.remove()}})(s)}
},{passive:true});
}catch(e){}})();

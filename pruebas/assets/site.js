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

/* Portada: las niñas bajan la pierna con el scroll (secuencia de fotogramas en canvas, sin video ni reproducción automática) */
(function(){try{
var tr=document.querySelector('.lv-track[data-seq]');if(!tr)return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var n=+tr.dataset.n,pat=tr.dataset.seq,hero=tr.querySelector('.hero.live'),stage=tr.querySelector('.lv-stage'),img=stage.querySelector('img');
var cv=document.createElement('canvas');cv.className='lv-cv';cv.setAttribute('aria-hidden','true');stage.insertBefore(cv,img.nextSibling);
var cx=cv.getContext('2d');if(!cx)return;
var fr=[],cur=-1,pinned=false,navH=0,W=0,H=0,dpr=1,fx=.72,tick=false;
function url(i){return pat.replace('%02d',('0'+i).slice(-2))}
function load(i,cb){if(fr[i])return cb&&cb();var m=new Image();m.decoding='async';m.onload=function(){fr[i]=m;cb&&cb()};m.onerror=function(){cb&&cb()};m.src=url(i)}
function size(){var r=stage.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,2);W=Math.round(r.width*dpr);H=Math.round(r.height*dpr);cv.width=W;cv.height=H;
 var op=(getComputedStyle(img).objectPosition||'72% 50%').split(' ')[0];fx=parseFloat(op)/100;if(!(fx>=0&&fx<=1))fx=.72;
 var nh=document.querySelector('header.nav');navH=nh?nh.offsetHeight:0;
 hero.style.minHeight='';pinned=(hero.offsetHeight+navH)<=window.innerHeight;
 if(pinned)hero.style.minHeight=Math.max(hero.offsetHeight,Math.min(window.innerHeight-navH,720))+'px';
 var extra=pinned?Math.round(Math.min(window.innerHeight*.8,760)):0;
 tr.style.height=(hero.offsetHeight+extra)+'px';tr.classList.toggle('pin',pinned);hero.style.top=navH+'px';cur=-1;upd()}
function draw(i){var m=fr[i];if(!m)for(var k=i;k>=0&&!m;k--)m=fr[k];if(!m)return;
 var s=Math.max(W/m.naturalWidth,H/m.naturalHeight),w=m.naturalWidth*s,h=m.naturalHeight*s;
 cx.drawImage(m,(W-w)*fx,(H-h)/2,w,h);cv.classList.add('on')}
function prog(){var r=tr.getBoundingClientRect();
 if(pinned){var d=tr.offsetHeight-hero.offsetHeight;return d>0?(navH-r.top)/d:0}
 return (navH-r.top)/(hero.offsetHeight*.6)}
function upd(){tick=false;var p=Math.max(0,Math.min(1,prog())),i=Math.round(p*(n-1));if(i===cur&&fr[i])return;cur=i;draw(i);if(!fr[i])load(i,function(){if(cur===i)draw(i)})}
function req(){if(!tick){tick=true;requestAnimationFrame(upd)}}
function boot(){size();var q=[];for(var i=1;i<n;i++)q.push(i);var run=0;
 (function pump(){while(run<4&&q.length){run++;load(q.shift(),function(){run--;pump();upd()})}})()}
addEventListener('scroll',req,{passive:true});addEventListener('resize',function(){size()});
load(0,function(){size();var go=function(){boot()};(window.requestIdleCallback||function(f){setTimeout(f,300)})(go)});
}catch(e){}})();

/* Botón Deportistas: un aviso suave solo en la primera página de cada visita */
(function(){try{var b=document.querySelector('.btn-dep');if(!b||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
if(sessionStorage.getItem('depAttn'))return;sessionStorage.setItem('depAttn','1');b.classList.add('attn')}catch(e){}})();

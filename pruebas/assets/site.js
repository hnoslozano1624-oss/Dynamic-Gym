(function(){
  var b=document.getElementById('menu-btn'),l=document.getElementById('links');
  if(b&&l){b.addEventListener('click',function(){var o=l.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false')})}
  var f=document.getElementById('form');
  if(f){f.addEventListener('submit',function(e){e.preventDefault();var a=document.getElementById('aviso');if(a)a.textContent='Gracias. Esta es una versión de pruebas y el mensaje no se envió. Cuando el sitio esté conectado, tu mensaje llegará a la academia.'})}
  var c=document.querySelector('.confetti');
  if(c&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){
    var H=c.clientHeight||500;
    for(var n=0;n<46;n++){var p=document.createElement('i'),w=5+Math.random()*7,d=4.5+Math.random()*4.5,
      dl=Math.random()*d;
      p.style.cssText='left:'+(Math.random()*100)+'%;width:'+w+'px;height:'+(w*1.9)+'px;border-radius:1px;--dx:'+(Math.random()*90-45)+'px;--dy:'+(H+40)+'px;--rot:'+(Math.random()*900-450)+'deg;animation-duration:'+d+'s,'+(0.9+Math.random()*1.4)+'s;animation-delay:-'+dl+'s,-'+(Math.random()*2)+'s';
      c.appendChild(p)}
  }
})();

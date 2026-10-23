/* Dynamic GYM · página de Deportistas: preinscripción de las familias e ingreso.
   Prototipo: guarda en este navegador (misma clave que el panel). Con un servidor real, las solicitudes llegarán al panel desde cualquier dispositivo. */
(function(){
var INS_KEY='dgym_insc',TODAY=new Date().toISOString().slice(0,10);
var $=function(s){return document.querySelector(s)};
function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function fmt(n){return '$ '+Number(n).toLocaleString('es-CO')}
var PLAN={'12':'12 clases (competencia)','8':'8 clases (recreativo)','4':'4 clases (recreativo)','dance':'Dance'},PRICE={'12':150000,'8':120000,'4':100000,'dance':100000};
var CVD=[{n:'Spartan',dias:'sáb y dom'},{n:'White Bulls',dias:'lun, mié y sáb'},{n:'Black Bulls',dias:'2 a 3 veces al año'},{n:'San Bonifacio',dias:'domingos, ~2 al mes'},{n:'Lúdicas',dias:'viernes en la mañana'},{n:'Acrotelas',dias:'días por definir'}];
function cvLabel(c){return c.n+' ('+c.dias+')'}
var ING=[['alq1','Alquiler 1 hora',6000],['alq2','Alquiler 2 horas',10000],['alq3','Alquiler 3 horas',15000],['ing','Ingreso al gimnasio',10000]];
var MODES={dia:'Por día',ini:'Mes completo adelantado',fin:'Mes vencido'},RIDE=11500,HOME=9000,MESES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
function inicioDe(r){return MESES[new Date(r.sentAt||TODAY).getMonth()]}
function insLoad(){try{var r=localStorage.getItem(INS_KEY);if(r)return JSON.parse(r)}catch(x){}return []}
function insSave(a){try{localStorage.setItem(INS_KEY,JSON.stringify(a));return true}catch(x){return false}}
/* portal de la familia (página pública) */
var P={stage:'home',rec:null,vals:{},files:{},fails:0,lock:0,err:''};
var TALLAS=['4','6','8','10','12','14','16','S','M','L'];
function pf(id,label,type,o){o=o||{};var v=P.vals[id]!==undefined?P.vals[id]:(o.val||'');
  if(type==='select')return '<label class="f">'+label+(o.req?' *':'')+'<select id="pf-'+id+'" data-pk="'+id+'">'+(o.opts||[]).map(function(x){var a=Array.isArray(x)?x:[x,x];return '<option value="'+esc(a[0])+'"'+(String(v)===String(a[0])?' selected':'')+'>'+esc(a[1])+'</option>'}).join('')+'</select></label>';
  if(type==='area')return '<label class="f wide">'+label+(o.req?' *':'')+'<textarea id="pf-'+id+'" data-pk="'+id+'" rows="'+(o.rows||2)+'" placeholder="'+esc(o.ph||'')+'">'+esc(v)+'</textarea></label>';
  return '<label class="f">'+label+(o.req?' *':'')+'<input id="pf-'+id+'" data-pk="'+id+'" type="'+type+'" value="'+esc(v)+'"'+(o.ro?' readonly':'')+(o.mode?' inputmode="'+o.mode+'"':'')+(o.ph?' placeholder="'+esc(o.ph)+'"':'')+'></label>'}
function pfile(k,label,accept,hint){var ok=k==='foto'?P.files.foto:P.files.pdf;return '<label class="f wide">'+label+' *<input type="file" data-pfile="'+k+'" accept="'+accept+'"><span class="note" id="pfs-'+k+'">'+(ok?'Cargado ✓ '+esc(k==='pdf'?(P.files.pdfName||''):''):hint)+'</span></label>'}
function pchk(id,text,req){return '<label class="chk pc"><input type="checkbox" id="pf-'+id+'" data-pk="'+id+'"'+(P.vals[id]?' checked':'')+'><span>'+text+(req?' *':'')+'</span></label>'}
function pCollect(){[].forEach.call(document.querySelectorAll('#dep [data-pk]'),function(e){P.vals[e.getAttribute('data-pk')]=e.type==='checkbox'?e.checked:e.value})}
function pFile(t){var k=t.getAttribute('data-pfile'),f=t.files&&t.files[0],st=$('#pfs-'+k);if(!f||!st)return;
  if(k==='foto'){
    if(!/^image\//.test(f.type)){st.textContent='Elige una imagen (JPG o PNG).';P.files.foto='';return}
    var fr=new FileReader();fr.onload=function(){var im=new Image();im.onload=function(){var r=Math.min(1,480/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*r);c.height=Math.round(im.height*r);c.getContext('2d').drawImage(im,0,0,c.width,c.height);P.files.foto=c.toDataURL('image/jpeg',.72);st.textContent='Foto cargada ✓ '+f.name};im.onerror=function(){st.textContent='No se pudo leer la imagen.'};im.src=fr.result};fr.readAsDataURL(f)
  }else{
    if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){st.textContent='El documento debe ser un PDF.';P.files.pdf='';return}
    if(f.size>700*1024){st.textContent='El PDF pesa más de 700 KB. Comprímelo e inténtalo de nuevo.';P.files.pdf='';t.value='';return}
    var fr2=new FileReader();fr2.onload=function(){P.files.pdf=fr2.result;P.files.pdfName=f.name;st.textContent='PDF cargado ✓ '+f.name};fr2.readAsDataURL(f)
  }}
function portalRender(){
  var h='<div class="pt-wrap">',r=P.rec;
  if(P.stage==='home'){
    h+='<h1>Inscripciones</h1><p class="pt-sub">Inscribe a tu estudiante o ingresa para ver su estado.</p><div class="pt-card"><button class="btn primary" type="button" data-pact="new">Quiero inscribir a una estudiante</button><button class="btn line" type="button" data-pact="tologin">Ya me inscribí: ingresar</button></div>'+
      '<p class="pt-note">Prototipo con datos de ejemplo. El envío real y el ingreso seguro los define el desarrollador.</p>';
  }else if(P.stage==='login'){
    h+='<h1>Ingresar</h1><p class="pt-sub">Usuario: la cédula del acudiente. Clave: el número de documento de la estudiante. Solo funciona cuando la academia completa la inscripción.</p>'+
      '<form id="ptlogin" class="pt-card" novalidate><label class="f">Cédula del acudiente (usuario)<input id="pl-u" inputmode="numeric" autocomplete="username"></label>'+
      '<label class="f">Documento de la estudiante (clave)<span class="pw"><input id="pl-p" type="password" autocomplete="current-password"><button type="button" class="btn line" data-pact="show">Ver</button></span></label>'+
      '<div class="lg-err" role="alert">'+esc(P.err)+'</div><button class="btn primary" type="button" data-pact="login">Ingresar</button><button class="btn line" type="button" data-pact="home">Volver</button></form>';
  }else if(P.stage==='cuenta'&&r&&r.data){
    var d=r.data;
    h+='<div class="pt-card pt-done"><h1>Hola, '+esc(d.acudiente)+'</h1><p><b>'+esc(d.nombres+' '+d.apellidos)+'</b> está inscrita en Dynamic All Star.</p><div class="tw keep"><table><tbody><tr><th scope="row">Estado</th><td>Inscrita</td></tr><tr><th scope="row">Grupo</th><td>'+esc(d.grupos&&d.grupos.length?d.grupos.join(' y '):(d.grupo||'Por definir'))+'</td></tr><tr><th scope="row">Plan</th><td>'+esc((PLAN[d.plan]||d.plan||'')+(PRICE[d.plan]?' · '+fmt(PRICE[d.plan])+' al mes':''))+'</td></tr><tr><th scope="row">Mes de inicio</th><td>'+esc(r.inicio||inicioDe(r))+'</td></tr></tbody></table></div><p class="note">Aquí también verás el avance de tu estudiante (nivel, insignias y seguimiento) cuando la academia lo active.</p><button class="btn line" data-pact="logout">Salir</button></div>';
  }else if(P.stage==='done'){
    var esc2=r&&r.data&&r.data.unidad==='gym';
    h+='<div class="pt-card pt-done"><h1>¡Preinscripción recibida!</h1>'+(esc2?'<p>Gracias. Ya registramos a '+esc(r.data.nombres)+'. La academia se comunicará contigo si necesita algo más.</p>':
      '<p>Gracias'+(r&&r.data?', '+esc(r.data.acudiente):'')+'. La inscripción de '+esc(r&&r.data?r.data.nombres:'tu estudiante')+' quedó preinscrita. La academia revisará los datos, asignará el grupo o los grupos y te avisará por WhatsApp.</p><p>Cuando la inscripción quede completa podrás ingresar con la <b>cédula del acudiente</b> como usuario y el <b>documento de la estudiante</b> como clave.</p>')+'<button class="btn line" data-pact="logout">Salir</button></div>';
  }else{
    var v=P.vals,un=v.unidad||'',mo=v.modalidad||'convenio';
    h+='<h1>Inscripción</h1><p class="pt-sub">Los campos con * son obligatorios.</p><form id="ptform" class="pt-card" novalidate>'+
      '<h2>Unidad</h2><div class="pg">'+pf('unidad','¿En cuál unidad se inscribe?','select',{req:1,opts:[['','Elige una opción'],['escuela','Dynamic All Star (escuela)'],['gym','Dynamic GYM (convenio, Wildcats o ingreso ocasional)']]})+'</div>';
    if(un==='gym'){
      h+='<h2>Datos de Dynamic GYM</h2><div class="pg">'+pf('modalidad','Modalidad','select',{req:1,opts:[['convenio','Convenio con una escuela o colegio'],['wildcats','Wildcats'],['liga','Ingreso ocasional (alquiler por horas o ingreso al gimnasio)']]});
      if(mo==='convenio')h+=pf('entidad','Convenio','select',{req:1,opts:CVD.map(function(x){return [x.n,cvLabel(x)]})});
      if(mo==='wildcats')h+=pf('modoPago','Cómo prefiere pagar','select',{opts:Object.keys(MODES).map(function(k){return [k,MODES[k]]})})+pf('transporte','Transporte','select',{opts:[['Ruta','Ruta ('+fmt(RIDE)+' por entrenamiento)'],['Casa','Desde casa ('+fmt(HOME)+' por entrenamiento)']]});
      if(mo==='liga')h+=pf('tipoIngreso','Tipo de ingreso','select',{opts:ING.map(function(x){return [x[1],x[1]+' · '+fmt(x[2])]})});
      h+='</div><h2>Datos de la persona</h2><div class="pg">'+pf('nombres','Nombres','text',{req:1})+pf('apellidos','Apellidos','text',{req:1})+pf('tipoDoc','Tipo de documento','select',{opts:['Tarjeta de identidad','Registro civil','Cédula de ciudadanía','Cédula de extranjería','Otro']})+pf('docEst','Número de documento','text',{req:1,mode:'numeric'})+'</div>';
    }
    if(un==='escuela'){
      h+='<h2>Plan de clases</h2><div class="pg">'+pf('plan','Plan','select',{req:1,opts:[['','Elige un plan']].concat(Object.keys(PLAN).map(function(k){return [k,PLAN[k]+' · '+fmt(PRICE[k])+' al mes']}))})+'</div><p class="note">El grupo lo asigna la academia al aprobar la inscripción.</p>'+
      '<h2>Datos de la estudiante</h2><div class="pg">'+pf('nombres','Nombres','text',{req:1})+pf('apellidos','Apellidos','text',{req:1})+
      pf('tipoDoc','Tipo de documento','select',{opts:['Tarjeta de identidad','Registro civil','Cédula de extranjería','Otro']})+pf('docEst','Número de documento','text',{req:1,mode:'numeric'})+
      pf('fechaNac','Fecha de nacimiento','date',{req:1})+pf('sexo','Sexo','select',{opts:['Femenino','Masculino']})+pf('colegio','Colegio','text')+pf('eps','EPS','text',{req:1})+pf('sangre','Tipo de sangre','select',{opts:['','O+','O-','A+','A-','B+','B-','AB+','AB-']})+
      pf('talla','Talla de uniforme','select',{opts:TALLAS})+pf('experiencia','Experiencia previa','select',{opts:['Ninguna','Menos de 1 año','De 1 a 3 años','Más de 3 años']})+
      pfile('foto','Foto de la estudiante','image/*','JPG o PNG. Se reduce automáticamente.')+pfile('pdf','Documento de identidad de la estudiante (PDF)','application/pdf,.pdf','Un PDF de máximo 700 KB.')+'</div>'+
      '<h2>Salud</h2><p class="note">Esta información protege a la estudiante en el entrenamiento. Escribe «Ninguna» si no aplica.</p><div class="pg">'+
      pf('enfBase','Enfermedad de base (ej. diabetes, asma)','area',{req:1})+pf('fracturas','Fracturas previas','area',{req:1})+pf('cirugias','Cirugías','area',{req:1})+pf('medicacion','Medicación permanente','area',{req:1})+pf('alergias','Alergias','area',{req:1})+pf('emocional','Condición emocional o mental que debamos conocer','area',{req:1})+'</div>'+
      '<h2>Acudiente</h2><div class="pg">'+pf('acudiente','Nombre completo','text',{req:1})+pf('cedAc','Cédula (será su usuario)','text',{req:1,mode:'numeric'})+pf('parentesco','Parentesco','select',{opts:['Madre','Padre','Acudiente']})+pf('celular','Teléfono o WhatsApp','tel',{req:1,mode:'tel'})+
      pf('correo','Correo electrónico del acudiente','email',{req:1,ph:'nombre@correo.com'})+pf('direccion','Residencia (dirección y barrio)','text',{req:1})+pf('emNombre','Contacto de emergencia','text')+pf('emTel','Teléfono de emergencia','tel',{mode:'tel'})+'</div>'+
      '<h2>Recogida y restricciones</h2><div class="pg">'+pf('autorizados','Personas autorizadas para recoger (nombre, parentesco y teléfono; una por línea)','area',{req:1,rows:3})+pf('restricciones','Personas que NO pueden recoger, custodia o medidas de protección (escribe «Ninguna» si no aplica)','area',{req:1,rows:3})+'</div>'+
      '<h2>Autorizaciones</h2>'+pchk('autDatos','Autorizo el tratamiento de los datos personales míos y de la estudiante (menor de edad), incluidos los datos de salud, para la gestión de la inscripción, según la Ley 1581 de 2012 y la <a href="politica-de-datos.html" target="_blank" rel="noopener">política de tratamiento de datos personales</a>.',1)+
      pchk('autImagen','Autorizo el uso de fotos y videos de la estudiante en el seguimiento de su proceso y en redes de la academia (opcional).',0)+pchk('autReglamento','Acepto el reglamento de la academia.',1)+
      '<div class="pg">'+pf('firma','Firma: escribe tu nombre completo','text',{req:1})+'</div>';
    }
    if(un)h+='<div class="lg-err" role="alert">'+esc(P.err)+'</div><button class="btn primary" type="button" data-pact="send">Enviar inscripción</button>';
    h+='</form><button class="btn line" type="button" data-pact="home" style="margin-top:12px">Volver</button><p class="pt-note">Los textos legales son de ejemplo y deben ser revisados por la academia antes de usarse.</p>';
  }
  $('#dep').innerHTML=h+'</div>';
}
function portalInit(){portalRender();
  document.addEventListener('click',function(e){var t=e.target.closest('[data-pact]');if(!t)return;var a=t.getAttribute('data-pact');
    if(a==='show'){var i=$('#pl-p');i.type=i.type==='password'?'text':'password';t.textContent=i.type==='password'?'Ver':'Ocultar';return}
    if(a==='login'){portalLogin();return}
    if(a==='new'){P.stage='form';P.err='';portalRender();window.scrollTo(0,0);return}
    if(a==='tologin'){P.stage='login';P.err='';portalRender();return}
    if(a==='home'||a==='logout'){P={stage:'home',rec:null,vals:{},files:{},fails:0,lock:0,err:''};portalRender();return}
    if(a==='send'){portalSend();return}});
  document.addEventListener('change',function(e){var t=e.target;if(!t.getAttribute)return;
    if(t.getAttribute('data-pfile')){pFile(t);return}
    if(!t.getAttribute('data-pk'))return;var k=t.getAttribute('data-pk');pCollect();if(k==='unidad'||k==='modalidad'){if(k==='unidad'&&!P.vals.modalidad)P.vals.modalidad='convenio';portalRender()}});
  document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target&&(e.target.id==='pl-u'||e.target.id==='pl-p')){e.preventDefault();portalLogin()}});
}
function portalLogin(){
  if(Date.now()<P.lock){P.err='Demasiados intentos. Espera unos minutos e inténtalo de nuevo.';portalRender();return}
  var u=$('#pl-u').value.replace(/\D/g,''),p=$('#pl-p').value.trim().toUpperCase();
  var rec=insLoad().filter(function(x){return x.ced&&x.ced===u&&String(x.doc).toUpperCase()===p&&x.data&&x.data.unidad==='escuela'&&(x.status==='Recibida'||x.status==='Por aprobar')}).sort(function(a,b){return (b.status==='Recibida')-(a.status==='Recibida')})[0];
  if(!u||!p||!rec){P.fails++;if(P.fails>=5){P.lock=Date.now()+5*60000;P.fails=0}P.err='Los datos no coinciden o la inscripción aún no está completa.';portalRender();return}
  P.err='';P.fails=0;P.rec=rec;P.vals={};P.stage=rec.status==='Recibida'?'cuenta':'done';portalRender();window.scrollTo(0,0)}
function portalSend(){
  pCollect();var v=P.vals,un=v.unidad,miss=[],T=function(k){return String(v[k]||'').trim()};
  if(!un){P.err='Elige la unidad.';portalRender();return}
  var req=['nombres','apellidos','docEst'];
  if(un==='escuela')req=req.concat(['plan','fechaNac','eps','enfBase','fracturas','cirugias','medicacion','alergias','emocional','acudiente','cedAc','celular','correo','direccion','autorizados','restricciones','firma']);
  req.forEach(function(k){if(!T(k))miss.push(k)});
  if(miss.length){P.err='Faltan campos obligatorios. Revisa los marcados con * (si no aplica, escribe «Ninguna»).';portalRender();return}
  if(un==='escuela'&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(T('correo'))){P.err='Escribe un correo electrónico válido, por ejemplo nombre@correo.com.';portalRender();return}
  var L=insLoad(),doc=T('docEst'),ced=un==='escuela'?T('cedAc').replace(/\D/g,''):'';
  if(un==='escuela'){
    if(ced.length<5||ced.length>12){P.err='La cédula del acudiente debe tener solo números (5 a 12 dígitos).';portalRender();return}
    if(!P.files.foto||!P.files.pdf){P.err='Carga la foto y el PDF del documento de la estudiante.';portalRender();return}
    if(!v.autDatos||!v.autReglamento){P.err='Para enviar debes aceptar el tratamiento de datos y el reglamento.';portalRender();return}
    if(L.some(function(x){return String(x.doc).toUpperCase()===doc.toUpperCase()&&x.data&&x.data.unidad==='escuela'&&(x.status==='Por aprobar'||x.status==='Recibida')})){P.err='Ya hay una inscripción con ese documento. Si ya fue aprobada, ingresa con tu usuario; si no, la academia la está revisando.';portalRender();return}}
  var d={unidad:un,nombres:T('nombres'),apellidos:T('apellidos'),tipoDoc:v.tipoDoc||'Tarjeta de identidad'};
  if(un==='escuela'){
    ['fechaNac','eps','colegio','sangre','talla','experiencia','enfBase','fracturas','cirugias','medicacion','alergias','emocional','acudiente','parentesco','celular','correo','direccion','emNombre','emTel','autorizados','restricciones','firma'].forEach(function(k){d[k]=T(k)});
    d.sexo=v.sexo||'Femenino';d.parentesco=v.parentesco||'Madre';d.plan=T('plan');d.cedAc=ced;d.autDatos=true;d.autImagen=!!v.autImagen;d.autReglamento=true;d.grupo='Por definir';
  }else{
    d.modalidad=v.modalidad||'convenio';if(d.modalidad==='convenio'){d.entidad=v.entidad||CVD[0].n}if(d.modalidad==='wildcats'){d.modoPago=v.modoPago||'dia';d.transporte=v.transporte||'Ruta'}if(d.modalidad==='liga'){d.tipoIngreso=v.tipoIngreso||ING[0][1]}}
  var rec={id:'i'+Date.now().toString(36),ced:ced,doc:doc,acu:d.acudiente||'',est:(d.nombres+' '+d.apellidos).trim(),status:un==='escuela'?'Por aprobar':'Recibida',created:TODAY,sentAt:new Date().toISOString(),data:d,files:un==='escuela'?{foto:P.files.foto,pdf:P.files.pdf,pdfName:P.files.pdfName||'documento.pdf'}:{}};
  L.push(rec);
  if(!insSave(L)){L.pop();P.err='No se pudo guardar en este dispositivo (el navegador no tiene espacio para los archivos). Inténtalo con una foto o PDF más livianos.';portalRender();return}
  P.rec=rec;P.stage='done';P.err='';P.files={};portalRender();window.scrollTo(0,0)}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',portalInit);else portalInit();
})();

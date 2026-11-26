(()=>{'use strict';
const products=(Array.isArray(window.FUTNEXO_PRODUCTOS)?window.FUTNEXO_PRODUCTOS:[]).filter(p=>p.category!=='Entrenamiento');
const byId=new Map(products.map(p=>[p.id,p]));
const prices={'Fan':[21.99,44.99],'Player':[25.99,54.99],'Retro':[25.99,54.99],'Infantil':[27.99,41.99],'Adulto':[29.99,44.99],'NBA':[30.99,64.99],'Media cremallera':[49.99,89.99],'Cremallera larga':[58.99,109.99],'Entrenamiento':[37.99,54.99]};
const $=id=>document.getElementById(id),esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=x=>Number(x).toFixed(2).replace('.',',')+' €';
const cartKey='futnexo_v358_cart';let cart=[],editIndex=-1;
try{const data=JSON.parse(localStorage.getItem(cartKey)||'[]');if(Array.isArray(data))cart=data.filter(x=>byId.has(x.id)&&prices[x.type]&&Number.isInteger(x.quantity)&&x.quantity>=1&&x.quantity<=40).slice(0,40)}catch(e){}
const unique=xs=>[...new Set(xs)].sort((a,b)=>a.localeCompare(b,'es'));
const normalizeSearch=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').replace(/\bbarca\b/g,'barcelona').trim();
const modelLabel=m=>{const v=normalizeSearch(m);if(/^(primera equipacion|local|primera)$/.test(v))return 'Primera equipación';if(/^(segunda equipacion|visitante|segunda)$/.test(v))return 'Segunda equipación';if(/^(tercera equipacion|tercera)$/.test(v))return 'Tercera equipación';if(/^(cuarta equipacion|cuarta)$/.test(v))return 'Cuarta equipación';return '';};
const params=new URLSearchParams(location.search);
const fields=['category','team','season','model','reference'];
function filtered(level){const selected={};for(const field of fields.slice(0,level)){selected[field]=$ (field).value;}
 if(level>=2&&$('team-search').value.trim()&&!$('team').value)return [];return products.filter(p=>(!selected.category||p.category===selected.category)&&(!selected.team||p.team===selected.team)&&(!selected.season||selected.category==='Retro'||p.season===selected.season)&&(!selected.model||(selected.category==='Retro'?p.season===selected.model:modelLabel(p.model)===selected.model)));}
function choices(selectId,items,prefer){const s=$(selectId);if(!s)return;let old=prefer??s.value;s.replaceChildren();for(const name of items){const o=new Option(name,name);s.add(o);}if(items.includes(old))s.value=old;else if(items.length)s.selectedIndex=0;}
function synchronize(from=0,preferred=null){const cfg=[['category','category'],['team','team'],['season','season'],['model','model']];
 for(let i=from;i<cfg.length;i++){let [id,key]=cfg[i],items=unique(filtered(i).map(p=>p[key]));if(id==='category'){const order=['Clubes','Selecciones','Retro','NBA','Chándals','Entrenamiento'];items.sort((a,b)=>order.indexOf(a)-order.indexOf(b));}
  if(id==='team'){const q=normalizeSearch($('team-search').value);const matching=items.filter(v=>normalizeSearch(v).includes(q));if(q&&matching.length===0){$('team-search').setCustomValidity('No encontramos ese equipo en el catálogo.');}else $('team-search').setCustomValidity('');items=matching;}
  if(id==='season'&&$('category').value==='Retro')items=[''];
  if(id==='model'){
    const category=$('category').value;
    const kit=/^(Clubes|Selecciones)$/.test(category);
    const retro=category==='Retro';
    items=retro?unique(filtered(i).map(p=>p.season)):kit?unique(items.map(modelLabel).filter(Boolean)):[];
    if(kit){const modelOrder=['Primera equipación','Segunda equipación','Tercera equipación','Cuarta equipación'];items.sort((a,b)=>modelOrder.indexOf(a)-modelOrder.indexOf(b));}
    $('model-field').hidden=!(retro||kit)||items.length===0;
    $('model-field').querySelector('label').textContent=retro?'Selecciona modelo':'Equipación';
    if(!items.length)items=[''];
  }
  const prefer=preferred?(id==='model'?(preferred.category==='Retro'?preferred.season:modelLabel(preferred[key])):preferred[key]):null;
  choices(id,items,prefer);}
 const list=filtered(4),reflist=$('reference');reflist.replaceChildren();for(const p of list){const opt=new Option(p.description,p.id);reflist.add(opt)}
 $('reference-field').style.display=list.length>1?'block':'none';if(preferred&&list.some(p=>p.id===preferred.id))reflist.value=preferred.id;
 preview();}
function selected(){const l=filtered(4);return l.find(p=>p.id===$('reference').value)||l[0]||null;}
function picture(p){if(!p||!p.photo)return '<div class="no-photo" aria-label="Fotografía pendiente">👕<span>Foto por confirmar</span></div>';
 return '<img class="photo" src="'+esc(p.photo)+'" alt="Foto de '+esc(p.name)+'" loading="lazy">';}
function preview(){const p=selected(),el=$('product-preview');if(!p){el.innerHTML='<div class="no-photo">👕<span>Sin referencia</span></div><div><p class="preview-title">No hay prendas disponibles para esta elección</p></div>';return}
 const tracksuit=p.category==='Chándals';$('personalize').closest('.options').style.display=tracksuit?'none':'';if(tracksuit){$('personalize').checked=false;$('patch').checked=false;$('personal-fields').hidden=true;$('patch-fields').hidden=true;$('patch-description').value='';}const typeField=$('version-field');typeField.hidden=!!p.fixedVersion||!['Clubes','Selecciones'].includes(p.category);
 let note=p.pending?'Referencia pendiente de confirmar con el proveedor.':'Referencia del catálogo. Comprueba la fotografía y elige tu talla.';if(p.fixedVersion)note+=' Fotografía correspondiente a versión '+p.fixedVersion+'.';if(p.category==='Selecciones'&&p.photo)note+=' Imagen frontal de la selección elegida.';if(!p.photo)note+=' Fotografía pendiente: no se muestra una imagen de otra equipación.';
 $('selection-notice').textContent=note;
 if(typeof syncShorts==='function')syncShorts();
 el.innerHTML=picture(p)+'<div><p class="preview-title">'+esc(p.name)+'</p><p class="preview-desc">'+esc(p.description)+'</p>'+(tracksuit?'':'<p class="preview-desc" style="margin-top:7px">Temporada: '+esc(p.season)+'</p>')+(p.pending?'<span class="pill" style="margin-top:7px">Disponibilidad pendiente</span>':'')+'</div>';
}
for(const id of ['season','model']){$(id).addEventListener('change',()=>synchronize(fields.indexOf(id)+1));}
$('reference').addEventListener('change',preview);
$('category').addEventListener('change',()=>{$('team-search').value='';synchronize(1)});
$('team-search').addEventListener('input',()=>{synchronize(1);updateUnknownTeam()});
$('team').addEventListener('change',()=>{$('team-search').value=$('team').value;synchronize(2)});
function setProduct(p){if(!p)return;$('team-search').value='';synchronize(0,p);}
let start=byId.get(params.get('ref'));if(start)setProduct(start);else synchronize(0,null);
$('personalize').addEventListener('change',()=>{$('personal-fields').hidden=!$('personalize').checked});
$('patch').addEventListener('change',()=>{const on=$('patch').checked;$('patch-fields').hidden=!on;if(on)$('patch-description').focus();else $('patch-description').value='';});
$('patch-fields').hidden=!$('patch').checked;
function syncSizes(child){const select=$('size'),mode=child?'child':'adult';if(select.dataset.mode===mode)return;select.dataset.mode=mode;select.replaceChildren(new Option('Selecciona tu talla',''));for(const [label,value,age] of child?[['XXS','16','2–3'],['XS','18','4–5'],['S','20','6–7'],['M','22','8–9'],['L','24','10–11'],['XL','26','12–13'],['XXL','28','14–15']]:['XS','S','M','L','XL','XXL','3XL','4XL'].map(x=>[x,x,'']))select.add(new Option(child?label+' · '+value+' ('+age+' años)':label,child?label+' / '+value: value));}
function syncShorts(){
 const p=selected(),eligible=p&&['Clubes','Selecciones'].includes(p.category),child=eligible&&typeFor(p)==='Infantil';
 syncSizes(child);
 $('shorts-options').hidden=!eligible;
 $('shorts-add-label').hidden=!eligible||child;
 $('shorts-child-label').hidden=!eligible||!child;
 if(!eligible||child){$('shorts-add').checked=false;$('shorts-custom').checked=false;}
 if(!eligible||!child)$('shorts-child-personalize').checked=false;
 const withShorts=eligible&&!child&&$('shorts-add').checked;
 $('shorts-custom-options').hidden=!withShorts;
 if(!withShorts)$('shorts-custom').checked=false;
 const numbering=eligible&&(child?$('shorts-child-personalize').checked:withShorts&&$('shorts-custom').checked);
 $('shorts-number-field').hidden=!numbering;
 if(!numbering)$('shorts-number').value='';
}
$('version').addEventListener('change',syncShorts);
for(const id of ['shorts-add','shorts-child-personalize','shorts-custom'])$(id).addEventListener('change',syncShorts);
syncShorts();
function persist(){try{localStorage.setItem(cartKey,JSON.stringify(cart))}catch(e){}}
function typeFor(p){return p.fixedVersion||(['Clubes','Selecciones'].includes(p.category)?$('version').value:p.priceType);}
function calc(){
 const units=cart.reduce((n,i)=>n+i.quantity,0),eligible=cart.filter(i=>['Fan','Retro','Player','NBA','Media cremallera','Cremallera larga'].includes(i.type));
 const eligibleUnits=eligible.reduce((n,i)=>n+i.quantity,0),excludedUnits=units-eligibleUnits;
 const baseCents=cart.reduce((n,i)=>n+Math.round(prices[i.type][0]*100)*i.quantity,0);
 const eligibleCents=eligible.reduce((n,i)=>n+Math.round(prices[i.type][0]*100)*i.quantity,0);
 const extrasCents=cart.reduce((n,i)=>n+i.quantity*(150*Number(i.personalized)+150*Number(i.patch)+1000*Number(i.shortsAdded)+150*Number(i.shortsPersonalized&&!i.shortsChild)),0);
 const shipCents=units===1?299:0;
 const tier=eligibleUnits>=10?35:eligibleUnits>=5?30:eligibleUnits>=3?20:eligibleUnits>=2?15:0;
 // Presupuesto público conservador: nunca muestra tarifas de proveedores.
 // Es orientativo: el coste real y el margen requieren validación privada antes de confirmar.
 const hasTraining=cart.some(i=>i.type==='Entrenamiento');
 // Importes de reserva de seguridad, NO tarifas de proveedores.
 // La cotización real deberá validarse en un servicio privado antes del pago.
 const reserve=hasTraining?{'Fan':1200,'Retro':1400,'Player':1400,'NBA':1500,'Media cremallera':3300,'Cremallera larga':3300,'Entrenamiento':2700,'Infantil':1300,'Adulto':1500}:{'Fan':850,'Retro':1150,'Player':1150,'NBA':1450,'Media cremallera':2650,'Cremallera larga':3350,'Entrenamiento':2700,'Infantil':1300,'Adulto':1500};
 const conservativeCost=cart.reduce((n,i)=>n+(reserve[i.type]||4000)*i.quantity,0)+(units?(hasTraining?800:units===1?900:500):0)+cart.reduce((n,i)=>n+i.quantity*(300*Number(i.personalized)+150*Number(i.patch)),0);
 const full=baseCents+extrasCents+shipCents;
 const required=Math.ceil(conservativeCost/0.6);
 const review=units>0&&full<required;
 // Para pedidos compuestos exclusivamente por camisetas Fan, Retro, Player o NBA,
 // aplicar íntegro el descuento promocional del tramo correspondiente.
 // La comprobación privada del margen sigue siendo necesaria antes de confirmar el pedido.
 const shirtsOnly=cart.length>0&&cart.every(i=>['Fan','Retro','Player','NBA'].includes(i.type));
 const discountCents=shirtsOnly?Math.floor(eligibleCents*tier/100):(review?0:Math.max(0,Math.min(Math.floor(eligibleCents*tier/100),full-required)));
 const appliedPercent=eligibleCents?Math.round(discountCents/eligibleCents*10000)/100:0;
 const message=shirtsOnly?'Descuento promocional aplicado. Precio sujeto a validación final antes de confirmar el pedido.':review?'Este pedido requiere confirmación de precio; no se aplica descuento.':eligibleUnits<2?'Añade otra prenda elegible para acceder a la promoción.':appliedPercent+0.01<tier?'El descuento depende de la combinación de productos.':'Descuento por cantidad aplicado.';
 return{units,normal:baseCents/100,extras:extrasCents/100,ship:shipCents/100,total:(full-discountCents)/100,discount:discountCents/100,eligibleUnits,excludedUnits,tier,appliedPercent,message};
}
const PRIVATE_QUOTE_URL='https://futnexo-calculo-privado.vercel.app/api/cotizar';
let verifiedQuote=null,verifiedKey='',quoteRequest=0;
function quoteKey(){return JSON.stringify(cart.map(x=>({type:x.type,quantity:x.quantity,personalized:!!x.personalized,patch:!!x.patch,shortsAdded:!!x.shortsAdded,shortsPersonalized:!!x.shortsPersonalized,shortsChild:!!x.shortsChild,shortsNumber:x.shortsNumber||''})))}
function updateVerifiedQuote(){
 const key=quoteKey(),request=++quoteRequest;
 verifiedQuote=null;verifiedKey='';
 if(!cart.length)return;
 if(cart.some(x=>x.shortsAdded||x.shortsPersonalized)){$('offer-msg').textContent='Pantalón incluido en el presupuesto orientativo. Importe final pendiente de confirmación por Instagram.';$('total').textContent='Por confirmar';$('discount').textContent='—';$('applied-percent').textContent='—';return;}
 if(cart.some(x=>!['Fan','Retro','Player','NBA','Media cremallera','Cremallera larga','Entrenamiento'].includes(x.type))){
  $('offer-msg').textContent='Precio sujeto a confirmación para esta categoría.';
  return;
 }
 $('offer-msg').textContent='Calculando descuento y total…';
 $('total').textContent='Calculando…';
 $('discount').textContent='—';
 $('applied-percent').textContent='—';
 fetch(PRIVATE_QUOTE_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:cart.map(x=>({type:x.type,quantity:x.quantity,personalized:!!x.personalized,patch:!!x.patch}))})})
 .then(async response=>{const data=await response.json();if(!response.ok)throw Error(data.error||'Cotización no disponible');return data})
 .then(data=>{
  if(request!==quoteRequest||key!==quoteKey())return;
  verifiedQuote=data;verifiedKey=key;
  $('subtotal').textContent=money(data.subtotal);
  $('discount').textContent='−'+money(data.discount);
  $('shipping').textContent=data.units===1?money(data.shipping):'Gratis';
  $('total').textContent=money(data.total);
  $('offer-msg').textContent=data.notice;
  $('eligible-count').textContent=String(data.eligibleUnits);
  $('discount-tier').textContent=data.tier?'Hasta '+data.tier+' %':'Sin tramo';
  $('applied-percent').textContent=data.appliedPercent.toFixed(2).replace('.',',')+' %';
  $('excluded-count').textContent=data.excludedUnits?data.excludedUnits+' prenda(s) excluida(s) del descuento (sí cuentan para el envío gratis).':'No hay prendas excluidas del descuento.';
 })
 .catch(()=>{if(request!==quoteRequest||key!==quoteKey())return;$('offer-msg').textContent='No se ha podido calcular el importe. Confirma el precio antes de realizar el pedido.';$('total').textContent='Por confirmar';$('discount').textContent='—';$('applied-percent').textContent='—'});
}
function render(){const d=calc();$('cart-count').textContent=d.units+' '+(d.units===1?'prenda':'prendas');$('cart-items').innerHTML=cart.length?cart.map((x,i)=>{const p=byId.get(x.id);if(!p)return'';return '<div class="cart-item">'+picture(p)+'<div class="cart-info"><p class="cart-name">'+esc(p.name)+'</p><p class="cart-meta">'+esc(p.category)+' · '+esc(p.description)+(p.category==='Chándals'?'':'<br>Temporada: '+esc(p.season))+'<br>Versión: '+esc(x.type)+' · Talla: '+esc(x.size)+' · '+x.quantity+' ud.<br>'+(x.personalized?'Estampado: '+esc(x.name)+' #'+esc(x.number):'Sin estampado')+' · '+(x.patch?'Parche: '+esc(x.patchDescription||'Por confirmar'):'Sin parche')+(x.shortsAdded?' · Pantalón corto (+10,00 €/ud.)':'')+(x.shortsPersonalized?' · Dorsal pantalón: '+esc(x.shortsNumber)+(x.shortsChild?' (gratis)':' (+1,50 €/ud.)'):'')+'</p><div class="cart-price">'+money(prices[x.type][0]*x.quantity+x.quantity*(1.5*Number(x.personalized)+1.5*Number(x.patch)+10*Number(x.shortsAdded)+1.5*Number(x.shortsPersonalized&&!x.shortsChild)))+' <span class="tiny">antes de descuentos</span></div><div class="cart-controls"><button type="button" data-edit="'+i+'" class="text-button">Editar</button><button type="button" data-remove="'+i+'" class="text-button remove">Eliminar</button></div></div></div>'}).join(''):'<div class="empty">Aún no hay prendas. Añade una para ver aquí su fotografía y características.</div>';
 $('subtotal').textContent=money(d.normal+d.extras);$('discount').textContent='−'+money(d.discount);$('shipping').textContent=d.units===0?'—':d.units===1?money(d.ship):'Gratis';$('total').textContent=money(d.total);$('offer-msg').textContent=d.message;$('eligible-count').textContent=String(d.eligibleUnits);$('discount-tier').textContent=d.tier?'Hasta '+d.tier+' %':'Sin tramo';$('applied-percent').textContent=d.appliedPercent.toFixed(2).replace('.',',')+' %';$('excluded-count').textContent=d.excludedUnits?d.excludedUnits+' prenda(s) excluida(s) del descuento (sí cuentan para el envío gratis).':'No hay prendas excluidas del descuento.';persist();updateVerifiedQuote();}
function resetEdit(){editIndex=-1;$('add').textContent='🛒 Añadir al carrito';$('cancel-edit').hidden=true}
function fillEdit(i){const x=cart[i],p=byId.get(x.id);if(!p)return;document.documentElement.classList.remove('fn-cart-view');history.replaceState(null,'','pedido.html');setProduct(p);$('version').value=['Clubes','Selecciones'].includes(p.category)?x.type:'Fan';syncSizes(x.type==='Infantil');$('size').value=x.size;$('quantity').value=x.quantity;$('personalize').checked=x.personalized;$('personal-fields').hidden=!x.personalized;$('patch').checked=x.patch;$('patch-description').value=x.patchDescription||'';$('patch-fields').hidden=!x.patch;$('shorts-add').checked=!!x.shortsAdded;$('shorts-child-personalize').checked=!!(x.shortsChild&&x.shortsPersonalized);$('shorts-custom').checked=!!(!x.shortsChild&&x.shortsPersonalized);$('shorts-number').value=x.shortsNumber||'';syncShorts();$('personal-name').value=x.name;$('number').value=x.number;editIndex=i;$('add').textContent='Guardar cambios';$('cancel-edit').hidden=false;$('add-status').textContent='Editando '+p.name+'. Guarda los cambios cuando termines.';document.getElementById('configurar').scrollIntoView({behavior:'smooth',block:'start'});}
$('cart-items').addEventListener('click',e=>{const remove=e.target.closest('[data-remove]'),edit=e.target.closest('[data-edit]');if(remove){cart.splice(Number(remove.dataset.remove),1);resetEdit();render()}else if(edit)fillEdit(Number(edit.dataset.edit));});
$('cancel-edit').addEventListener('click',()=>{resetEdit();$('add-status').textContent='Edición cancelada.'});
function makeItem(){const p=selected();if(!p)return{error:'Selecciona una prenda válida.'};const type=typeFor(p),quantity=Number($('quantity').value),personalized=p.category!=='Chándals'&&$('personalize').checked,patch=p.category!=='Chándals'&&$('patch').checked,patchDescription=$('patch-description').value.trim(),name=$('personal-name').value.trim(),number=$('number').value.trim();
 if(!prices[type])return{error:'Versión no válida.'};if(!Number.isInteger(quantity)||quantity<1||quantity>40)return{error:'Introduce una cantidad de 1 a 40.'};if(personalized&&(!name||!/^[0-9]{1,3}$/.test(number)))return{error:'Indica el nombre y un dorsal numérico de 1 a 3 cifras.'};if(!$('size').value)return{error:'Selecciona una talla.'};if(patch&&!patchDescription)return{error:'Indica qué parche quieres añadir (por ejemplo, Champions League).'};const shortsChild=['Clubes','Selecciones'].includes(p.category)&&type==='Infantil';const shortsAdded=!shortsChild&&['Clubes','Selecciones'].includes(p.category)&&$('shorts-add').checked;const shortsPersonalized=shortsChild?$('shorts-child-personalize').checked:shortsAdded&&$('shorts-custom').checked;const shortsNumber=shortsPersonalized?$('shorts-number').value.trim():'';if(shortsPersonalized&&!/^[0-9]{1,3}$/.test(shortsNumber))return{error:'Indica un dorsal del pantalón de 1 a 3 cifras.'};return{id:p.id,type,size:$('size').value,quantity,personalized,patch,patchDescription:patch?patchDescription:'',name:personalized?name:'',number:personalized?number:'',shortsAdded,shortsChild,shortsPersonalized,shortsNumber};}
$('add').addEventListener('click',()=>{let it=makeItem();if(it.error){$('add-status').textContent=it.error;$('add-status').classList.add('error');return};let units=cart.reduce((s,x)=>s+x.quantity,0)-(editIndex>=0?cart[editIndex].quantity:0);if(units+it.quantity>80){$('add-status').textContent='Máximo 80 prendas por solicitud.';return}if(editIndex>=0)cart[editIndex]=it;else cart.push(it);resetEdit();$('add-status').classList.remove('error');$('add-status').textContent='Producto añadido al carrito. Revisa la imagen, los detalles y el total.';render();const status=$('add-status');status.replaceChildren(document.createTextNode('Producto añadido. '));const go=document.createElement('a');go.href='pedido.html?vista=carrito#solicitud';go.textContent='Ir al carrito →';status.append(go);});
$('clear').addEventListener('click',()=>{if(cart.length&&!window.confirm('¿Quieres vaciar el carrito?'))return;cart=[];resetEdit();render();});
function message(){const d=verifiedKey===quoteKey()&&verifiedQuote?{total:verifiedQuote.total,message:verifiedQuote.notice}:{total:0,message:'Precio pendiente de cotización privada.'};return 'SOLICITUD FUTNEXO — PENDIENTE DE CONFIRMACIÓN\n\n'+cart.map((x,i)=>{const p=byId.get(x.id);const base=location.href.startsWith('http')?location.href:'https://futnexo.futnexo.workers.dev/pedido.html';const url=new URL('pedido.html?ref='+encodeURIComponent(p.id),base).href;return (i+1)+'. '+p.name+' ('+p.category+')\nReferencia: '+p.id+'\nDescripción: '+p.description+'\nTemporada: '+p.season+' | Modelo: '+p.model+'\nVersión: '+x.type+' | Talla: '+x.size+' | Unidades: '+x.quantity+'\nPersonalización: '+(x.personalized?x.name+' #'+x.number:'No')+' | Parche: '+(x.patch?(x.patchDescription||'Por confirmar'):'No')+'\nPantalón: '+(x.shortsAdded?'Añadido (+10 €/ud.)':x.shortsChild?'Infantil':'No')+' | Dorsal pantalón: '+(x.shortsPersonalized?x.shortsNumber+(x.shortsChild?' (gratis)':' (+1,50 €/ud.)'):'No')+'\nFicha: '+url;}).join('\n\n')+'\n\nIMPORTE ORIENTATIVO: '+(verifiedKey===quoteKey()&&verifiedQuote?money(d.total):'Pendiente de confirmar')+'\n'+d.message+'\n\nNOMBRE/ALIAS: '+$('customer').value.trim()+'\nINSTAGRAM PARA CONTACTO: '+$('contact').value.trim()+'\nEMAIL: '+$('customer-email').value.trim()+'\nOBSERVACIONES: '+$('notes').value.trim()+'\n\nEl cliente acepta continuar por Instagram. Disponibilidad, precio final y pago pendientes de confirmación.';}
function validate(){if(cart.length&&cart.every(x=>['Fan','Retro','Player','NBA','Media cremallera','Cremallera larga','Entrenamiento'].includes(x.type))&&!(verifiedQuote&&verifiedKey===quoteKey())){$('copy-status').textContent='Espera a que se calcule el total antes de enviar el pedido.';$('copy-status').classList.add('error');return false;}if(!cart.length){$('copy-status').textContent='Añade al menos una prenda antes de enviar.';$('copy-status').classList.add('error');$('add').focus();return false;}const ig=$('contact');ig.value=ig.value.trim();if(!/^@?[A-Za-z0-9._]{1,30}$/.test(ig.value)){ig.setCustomValidity('Introduce un usuario de Instagram válido, sin espacios.');}else ig.setCustomValidity('');const form=$('order-form');if(!form.checkValidity()){form.reportValidity();return false;}return true;}
$('contact').addEventListener('input',()=>{$('contact').setCustomValidity('')});
const ORDER_URL='https://futnexo-pedidos.vercel.app/api/pedido';
const sending=new WeakSet(), sent=new WeakMap();
async function sendRequest(form,status,kind,body,honey){status.classList.remove('error');status.textContent='Simulación completada. No se ha enviado ningún pedido real.';}

$('order-form').addEventListener('submit',e=>{e.preventDefault();if(!validate()||$('website-check').value)return;const body=message();if($('summary-input'))$('summary-input').value=body;sendRequest(e.currentTarget,$('copy-status'),'pedido',body,$('website-check').value);});
$('copy').addEventListener('click',async()=>{if(!cart.length){$('copy-status').textContent='Añade al menos una prenda para copiar el resumen.';return;}const text=message();try{await navigator.clipboard.writeText(text);$('copy-status').textContent='Resumen copiado.'}catch(e){const t=document.createElement('textarea');t.value=text;document.body.append(t);t.select();let ok=document.execCommand('copy');t.remove();$('copy-status').textContent=ok?'Resumen copiado.':'No se pudo copiar. Revisa los permisos del navegador.'}});

function updateUnknownTeam(){const q=$('team-search').value.trim(), noMatch=q&&!Array.from($('team').options).length;
 const help=$('fn-unknown-team');if(!help)return;help.hidden=!noMatch;
 if(noMatch)$('fn-unknown-team-link').href='pedido.html?buscar='+encodeURIComponent(q)+'#consulta-disponibilidad';}
function prepareAvailability(){
 const requested=byId.get(params.get('consulta'));
 const searchText=(params.get('buscar')||'').trim().slice(0,140);
 const form=$('availability-form');if(!form)return;
 if(requested){
  const kind={'Clubes':'Camiseta de fútbol','Selecciones':'Camiseta de fútbol','NBA':'Camiseta NBA','Retro':'Prenda retro','Chándals':'Chándal','Entrenamiento':'Conjunto de entrenamiento'}[requested.category]||'Otra prenda';
  $('availability-category').value=kind;
  $('availability-description').value=requested.name+' — '+requested.description+' ('+requested.season+'). Referencia: '+requested.id+'.';
  $('availability-details').value='Quiero saber si está disponible y qué tallas o versiones puedo solicitar.';
 } else if(searchText){
  $('availability-description').value='Busco: '+searchText+'. Quiero saber si podéis conseguir esta prenda.';
 }
 let status=$('availability-status');if(!status){status=document.createElement('p');status.id='availability-status';status.className='status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');form.append(status);}
 form.addEventListener('submit',function(e){e.preventDefault();const ig=$('availability-instagram');ig.value=ig.value.trim();
  const invalid=!/^@?[A-Za-z0-9._]{1,30}$/.test(ig.value);ig.setCustomValidity(invalid?'Introduce un usuario de Instagram válido.':'');
  if($('availability-website').value||!form.checkValidity()){form.reportValidity();return;}
  const body=['CONSULTA DE DISPONIBILIDAD FUTNEXO — SIN PEDIDO','NOMBRE/ALIAS: '+$('availability-name').value.trim(),'INSTAGRAM: '+ig.value,'EMAIL: '+$('availability-email').value.trim(),'TIPO DE PRENDA: '+$('availability-category').value,'PRENDA SOLICITADA: '+$('availability-description').value.trim(),'DETALLES: '+$('availability-details').value.trim(),'El cliente acepta el contacto por Instagram.'].join('\n\n');
  sendRequest(form,status,'consulta',body,$('availability-website').value);
 });
 $('availability-instagram').addEventListener('input',function(){$('availability-instagram').setCustomValidity('')});
}
prepareAvailability();updateUnknownTeam();
render();
})();
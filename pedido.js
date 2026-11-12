(()=>{'use strict';
const products=Array.isArray(window.FUTNEXO_PRODUCTOS)?window.FUTNEXO_PRODUCTOS:[];
const byId=new Map(products.map(p=>[p.id,p]));
const prices={'Fan':[29.99,44.99],'Player':[36.99,54.99],'Retro':[36.99,54.99],'Infantil':[27.99,41.99],'Adulto':[29.99,44.99],'NBA':[39.99,64.99],'F1':[36.99,59.99],'Media cremallera':[54.99,89.99],'Cremallera larga':[64.99,109.99],'Entrenamiento':[34.99,54.99],'Pantalón':[19.99,29.99],'Tirantes':[29.99,46.99]};
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
 if(level>=2&&$('team-search').value.trim()&&!$('team').value)return [];return products.filter(p=>(!selected.category||p.category===selected.category)&&(!selected.team||p.team===selected.team)&&(!selected.season||p.season===selected.season)&&(!selected.model||modelLabel(p.model)===selected.model));}
function choices(selectId,items,prefer){const s=$(selectId);if(!s)return;let old=prefer??s.value;s.replaceChildren();for(const name of items){const o=new Option(name,name);s.add(o);}if(items.includes(old))s.value=old;else if(items.length)s.selectedIndex=0;}
function synchronize(from=0,preferred=null){const cfg=[['category','category'],['team','team'],['season','season'],['model','model']];
 for(let i=from;i<cfg.length;i++){let [id,key]=cfg[i],items=unique(filtered(i).map(p=>p[key]));if(id==='category'){const order=['Clubes','Selecciones','Retro','NBA','Chándals','Entrenamiento'];items.sort((a,b)=>order.indexOf(a)-order.indexOf(b));}
  if(id==='team'){const q=normalizeSearch($('team-search').value);const matching=items.filter(v=>normalizeSearch(v).includes(q));if(q&&matching.length===0){$('team-search').setCustomValidity('No encontramos ese equipo en el catálogo.');}else $('team-search').setCustomValidity('');items=matching;}
  if(id==='model'){
    const category=$('category').value;
    const kit=/^(Clubes|Selecciones)$/.test(category);
    items=kit?items.map(modelLabel).filter(Boolean):[];
    items=unique(items);
    const modelOrder=['Primera equipación','Segunda equipación','Tercera equipación','Cuarta equipación'];
    items.sort((a,b)=>modelOrder.indexOf(a)-modelOrder.indexOf(b));
    const show=kit&&items.length>0;
    $('model-field').hidden=!show;
    if(!show)items=[''];
  }
  const prefer=preferred?(id==='model'?modelLabel(preferred[key]):preferred[key]):null;
  choices(id,items,prefer);}
 const list=filtered(4),reflist=$('reference');reflist.replaceChildren();for(const p of list){const opt=new Option(p.description+' · '+p.id,p.id);reflist.add(opt)}
 $('reference-field').style.display=list.length>1?'block':'none';if(preferred&&list.some(p=>p.id===preferred.id))reflist.value=preferred.id;
 preview();}
function selected(){const l=filtered(4);return l.find(p=>p.id===$('reference').value)||l[0]||null;}
function picture(p){if(!p||!p.photo)return '<div class="no-photo" aria-label="Fotografía pendiente">👕<span>Foto por confirmar</span></div>';
 return '<img class="photo" src="'+esc(p.photo)+'" alt="Foto de '+esc(p.name)+'" loading="lazy">';}
function preview(){const p=selected(),el=$('product-preview');if(!p){el.innerHTML='<div class="no-photo">👕<span>Sin referencia</span></div><div><p class="preview-title">No hay prendas disponibles para esta elección</p></div>';return}
 const typeField=$('version-field');typeField.hidden=!!p.fixedVersion||!['Clubes','Selecciones'].includes(p.category);
 let note=p.pending?'Referencia pendiente de confirmar con el proveedor.':'Referencia del catálogo. Comprueba la fotografía y elige tu talla.';if(p.fixedVersion)note+=' Fotografía correspondiente a versión '+p.fixedVersion+'.';if(!p.photo)note+=' Fotografía pendiente: no se muestra una imagen de otra equipación.';
 $('selection-notice').textContent=note;
 el.innerHTML=picture(p)+'<div><p class="preview-title">'+esc(p.name)+'</p><p class="preview-desc">'+esc(p.description)+'</p><p class="preview-desc" style="margin-top:7px">Temporada: '+esc(p.season)+'</p>'+(p.pending?'<span class="pill" style="margin-top:7px">Disponibilidad pendiente</span>':'')+'</div>';
}
for(const id of ['season','model']){$(id).addEventListener('change',()=>synchronize(fields.indexOf(id)+1));}
$('reference').addEventListener('change',preview);
$('category').addEventListener('change',()=>{$('team-search').value='';synchronize(1)});
$('team-search').addEventListener('input',()=>synchronize(1));
$('team').addEventListener('change',()=>{$('team-search').value=$('team').value;synchronize(2)});
function setProduct(p){if(!p)return;$('team-search').value='';synchronize(0,p);}
let start=byId.get(params.get('ref'));if(start)setProduct(start);else synchronize(0,null);
$('personalize').addEventListener('change',()=>{$('personal-fields').hidden=!$('personalize').checked});
function persist(){try{localStorage.setItem(cartKey,JSON.stringify(cart))}catch(e){}}
function typeFor(p){return p.fixedVersion||(['Clubes','Selecciones'].includes(p.category)?$('version').value:p.priceType);}
function calc(){const units=cart.reduce((s,x)=>s+x.quantity,0),normal=cart.reduce((s,x)=>s+prices[x.type][0]*x.quantity,0),extras=cart.reduce((s,x)=>s+x.quantity*(1.5*Number(x.personalized)+1.5*Number(x.patch)),0),ship=units===1?2.99:0;
 let base=normal,message='Añade al menos una prenda para calcular el importe.';
 if(units===1)message='Una prenda: 2,99 € de envío.';
 else if(units===2){const a=cart.flatMap(x=>Array(x.quantity).fill(x.type));if(a[0]===a[1]){base=prices[a[0]][1];message='Pack de dos prendas de la misma categoría aplicado.'}
 else if(a.includes('Fan')&&a.includes('Retro')){base=49.99;message='Pack combinado Retro + Fan aplicado.'}
 else{base=normal-0.1*Math.min(prices[a[0]][0],prices[a[1]][0]);message='Pack mixto: 10 % en la prenda más barata.'}}
 else if(units>2){const per=cart.reduce((s,x)=>s+x.quantity*(prices[x.type][1]/2),0);const factor=units>=10?0.9:units>=5?0.95:1;base=per*factor;message=units>=10?'10 o más prendas: 10 % adicional sobre tarifa de pack.':units>=5?'5 o más prendas: 5 % adicional sobre tarifa de pack.':'Precio proporcional al pack de dos.'}
 base=Math.round(base*100)/100;let total=Math.round((base+extras+ship)*100)/100;return{units,normal,extras,ship,base,total,discount:normal-base,message};}
function render(){const d=calc();$('cart-count').textContent=d.units+' '+(d.units===1?'prenda':'prendas');$('cart-items').innerHTML=cart.length?cart.map((x,i)=>{const p=byId.get(x.id);if(!p)return'';return '<div class="cart-item">'+picture(p)+'<div class="cart-info"><p class="cart-name">'+esc(p.name)+'</p><p class="cart-meta">'+esc(p.category)+' · '+esc(p.description)+'<br>Temporada: '+esc(p.season)+'<br>Versión: '+esc(x.type)+' · Talla: '+esc(x.size)+' · '+x.quantity+' ud.<br>'+(x.personalized?'Estampado: '+esc(x.name)+' #'+esc(x.number):'Sin estampado')+' · '+(x.patch?'Con parche':'Sin parche')+'</p><div class="cart-price">'+money(prices[x.type][0]*x.quantity+x.quantity*(1.5*Number(x.personalized)+1.5*Number(x.patch)))+' <span class="tiny">antes de descuentos de pack</span></div><div class="cart-controls"><button type="button" data-edit="'+i+'" class="text-button">Editar</button><button type="button" data-remove="'+i+'" class="text-button remove">Eliminar</button></div></div></div>'}).join(''):'<div class="empty">Aún no hay prendas. Añade una para ver aquí su fotografía y características.</div>';
 $('subtotal').textContent=money(d.normal+d.extras);$('discount').textContent='−'+money(d.discount);$('shipping').textContent=d.units===0?'—':d.units===1?money(d.ship):'Gratis';$('total').textContent=money(d.total);$('offer-msg').textContent=d.message;persist();}
function resetEdit(){editIndex=-1;$('add').textContent='+ Añadir a mi solicitud';$('cancel-edit').hidden=true}
function fillEdit(i){const x=cart[i],p=byId.get(x.id);if(!p)return;setProduct(p);$('version').value=['Clubes','Selecciones'].includes(p.category)?x.type:'Fan';$('size').value=x.size;$('quantity').value=x.quantity;$('personalize').checked=x.personalized;$('personal-fields').hidden=!x.personalized;$('patch').checked=x.patch;$('personal-name').value=x.name;$('number').value=x.number;editIndex=i;$('add').textContent='Guardar cambios';$('cancel-edit').hidden=false;$('add-status').textContent='Editando '+p.name+'. Guarda los cambios cuando termines.';document.getElementById('configurar').scrollIntoView({behavior:'smooth',block:'start'});}
$('cart-items').addEventListener('click',e=>{const remove=e.target.closest('[data-remove]'),edit=e.target.closest('[data-edit]');if(remove){cart.splice(Number(remove.dataset.remove),1);resetEdit();render()}else if(edit)fillEdit(Number(edit.dataset.edit));});
$('cancel-edit').addEventListener('click',()=>{resetEdit();$('add-status').textContent='Edición cancelada.'});
function makeItem(){const p=selected();if(!p)return{error:'Selecciona una prenda válida.'};const type=typeFor(p),quantity=Number($('quantity').value),personalized=$('personalize').checked,patch=$('patch').checked,name=$('personal-name').value.trim(),number=$('number').value.trim();
 if(!prices[type])return{error:'Versión no válida.'};if(!Number.isInteger(quantity)||quantity<1||quantity>40)return{error:'Introduce una cantidad de 1 a 40.'};if(personalized&&(!name||!/^[0-9]{1,3}$/.test(number)))return{error:'Indica el nombre y un dorsal numérico de 1 a 3 cifras.'};if(!$('size').value)return{error:'Selecciona una talla.'};return{id:p.id,type,size:$('size').value,quantity,personalized,patch,name:personalized?name:'',number:personalized?number:''};}
$('add').addEventListener('click',()=>{let it=makeItem();if(it.error){$('add-status').textContent=it.error;$('add-status').classList.add('error');return};let units=cart.reduce((s,x)=>s+x.quantity,0)-(editIndex>=0?cart[editIndex].quantity:0);if(units+it.quantity>80){$('add-status').textContent='Máximo 80 prendas por solicitud.';return}if(editIndex>=0)cart[editIndex]=it;else cart.push(it);resetEdit();$('add-status').classList.remove('error');$('add-status').textContent='Prenda guardada. Comprueba su fotografía en «Tu solicitud».';render();$('solicitud').scrollIntoView({behavior:'smooth',block:'start'});});
$('clear').addEventListener('click',()=>{if(cart.length&&!window.confirm('¿Quieres vaciar la solicitud?'))return;cart=[];resetEdit();render();});
function message(){const d=calc();return 'SOLICITUD FUTNEXO — PENDIENTE DE CONFIRMACIÓN\n\n'+cart.map((x,i)=>{const p=byId.get(x.id);const base=location.href.startsWith('http')?location.href:'https://futnexo.futnexo.workers.dev/pedido.html';const url=new URL('pedido.html?ref='+encodeURIComponent(p.id),base).href;return (i+1)+'. '+p.name+' ('+p.category+')\nReferencia: '+p.id+'\nDescripción: '+p.description+'\nTemporada: '+p.season+' | Modelo: '+p.model+'\nVersión: '+x.type+' | Talla: '+x.size+' | Unidades: '+x.quantity+'\nPersonalización: '+(x.personalized?x.name+' #'+x.number:'No')+' | Parche: '+(x.patch?'Sí':'No')+'\nFicha: '+url;}).join('\n\n')+'\n\nIMPORTE ORIENTATIVO: '+money(d.total)+'\n'+d.message+'\n\nNOMBRE/ALIAS: '+$('customer').value.trim()+'\nINSTAGRAM PARA CONTACTO: '+$('contact').value.trim()+'\nEMAIL: '+$('customer-email').value.trim()+'\nOBSERVACIONES: '+$('notes').value.trim()+'\n\nEl cliente acepta continuar por Instagram. Disponibilidad, precio final y pago pendientes de confirmación.';}
function validate(){if(!cart.length){$('copy-status').textContent='Añade al menos una prenda antes de enviar.';$('copy-status').classList.add('error');$('add').focus();return false;}const ig=$('contact');ig.value=ig.value.trim();if(!/^@?[A-Za-z0-9._]{1,30}$/.test(ig.value)){ig.setCustomValidity('Introduce un usuario de Instagram válido, sin espacios.');}else ig.setCustomValidity('');const form=$('order-form');if(!form.checkValidity()){form.reportValidity();return false;}return true;}
$('contact').addEventListener('input',()=>{$('contact').setCustomValidity('')});
$('order-form').addEventListener('submit',e=>{if(!validate()){e.preventDefault();return}if($('website-check').value){e.preventDefault();return}$('summary-input').value=message();$('copy-status').classList.remove('error');$('copy-status').textContent='Enviando al servicio de formularios. Puede aparecer una verificación antispam.';});
$('copy').addEventListener('click',async()=>{if(!cart.length){$('copy-status').textContent='Añade al menos una prenda para copiar el resumen.';return;}const text=message();try{await navigator.clipboard.writeText(text);$('copy-status').textContent='Resumen copiado.'}catch(e){const t=document.createElement('textarea');t.value=text;document.body.append(t);t.select();let ok=document.execCommand('copy');t.remove();$('copy-status').textContent=ok?'Resumen copiado.':'No se pudo copiar. Revisa los permisos del navegador.'}});
render();
})();
(()=>{'use strict';
const KEY='futnexo_v358_cart';
const PRODUCTS=Array.isArray(window.FUTNEXO_PRODUCTOS)?window.FUTNEXO_PRODUCTOS:[];
const map=new Map(PRODUCTS.map(p=>[p.id,p]));
const prices={Fan:21.99,Player:25.99,Retro:25.99,Infantil:27.99,Adulto:29.99,NBA:30.99,'Media cremallera':49.99,'Cremallera larga':58.99,Entrenamiento:37.99};
function get(){try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v.filter(x=>x&&map.has(x.id)&&prices[x.type]&&Number.isInteger(x.quantity)&&x.quantity>=1&&x.quantity<=40).slice(0,80):[]}catch(e){return []}}
function money(n){return n.toFixed(2).replace('.',',')+' €'}
const link=document.createElement('a');link.className='fn-cart-link';link.href='pedido.html#solicitud';link.setAttribute('aria-label','Abrir carrito de compra');link.innerHTML='🛒 Mi carrito <span class="fn-cart-count">0</span>';document.body.append(link);
function update(){link.querySelector('.fn-cart-count').textContent=get().reduce((s,x)=>s+x.quantity,0)}update();window.addEventListener('storage',update);
const dialog=document.createElement('dialog');dialog.className='fn-cart-dialog';dialog.innerHTML=`<form class="fn-cart-inner" id="fn-cart-form"><button class="fn-close" type="button" aria-label="Cerrar">×</button><h2 id="fn-cart-title">Configurar producto</h2><p id="fn-cart-desc"></p><label for="fn-type">Versión</label><select id="fn-type"></select><div class="fn-inline"><div><label for="fn-size">Talla</label><select id="fn-size"><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option></select></div><div><label for="fn-qty">Cantidad</label><input id="fn-qty" type="number" min="1" max="40" value="1" required></div></div><label class="fn-check"><input id="fn-custom" type="checkbox"> Personalizar nombre y dorsal (+1,50 €/ud.)</label><div id="fn-custom-fields" hidden class="fn-inline"><div><label for="fn-name">Nombre</label><input id="fn-name" maxlength="20" placeholder="Ej. BELLINGHAM"></div><div><label for="fn-number">Dorsal</label><input id="fn-number" inputmode="numeric" pattern="[0-9]{1,3}" placeholder="Ej. 5"></div></div><label class="fn-check"><input id="fn-patch" type="checkbox"> Añadir parche (+1,50 €/ud.)</label><div id="fn-patch-fields" hidden><label for="fn-patch-description">¿Qué parche quieres añadir?</label><input id="fn-patch-description" type="text" maxlength="90" placeholder="Ej.: Champions League, LaLiga, Mundial…" autocomplete="off"><small>Escribe el parche que quieras. Confirmaremos su disponibilidad.</small></div><p class="fn-total" id="fn-price"></p><p class="fn-error" id="fn-error" role="alert"></p><div class="fn-actions"><button type="button" class="fn-cancel">Cancelar</button><button class="fn-primary" type="submit">Añadir al carrito</button></div><p>Solicitud sin pago online. Disponibilidad y precio final sujetos a confirmación.</p></form>`;document.body.append(dialog);
const el=id=>dialog.querySelector('#'+id);let active=null;
dialog.querySelector('.fn-close').addEventListener('click',()=>dialog.close());dialog.querySelector('.fn-cancel').addEventListener('click',()=>dialog.close());
el('fn-custom').addEventListener('change',()=>{el('fn-custom-fields').hidden=!el('fn-custom').checked;refresh()});
el('fn-patch').addEventListener('change',()=>{el('fn-patch-fields').hidden=!el('fn-patch').checked;if(el('fn-patch').checked)el('fn-patch-description').focus();else el('fn-patch-description').value='';refresh()});
function refresh(){const q=Number(el('fn-qty').value)||1;const p=prices[el('fn-type').value]||0;el('fn-price').textContent='Precio orientativo: '+money(q*(p+(el('fn-custom').checked?1.5:0)+(el('fn-patch').checked?1.5:0)))+' (sin descuentos ni envío)'}
for(const id of ['fn-qty','fn-type','fn-patch'])el(id).addEventListener('change',refresh);
function open(p){active=p;el('fn-cart-title').textContent=p.name;el('fn-cart-desc').textContent=(p.category==='Clubes'?p.description.replace(/\s*·\s*Fan\s*$/,''):p.description)+' · '+p.season;el('fn-error').textContent='';el('fn-qty').value='1';el('fn-custom').checked=false;el('fn-patch').checked=false;el('fn-patch-fields').hidden=true;el('fn-patch-description').value='';el('fn-custom-fields').hidden=true;el('fn-name').value='';el('fn-number').value='';const types=(p.category==='Clubes'?['Fan','Player','Infantil']:p.fixedVersion?[p.fixedVersion]:p.category==='Selecciones'?['Fan','Player','Infantil']:[p.priceType||'Fan']).filter(t=>prices[t]);el('fn-type').replaceChildren(...types.map(t=>{const o=document.createElement('option');o.value=t;o.textContent=t+' · '+money(prices[t]);return o}));el('fn-size').value='M';refresh();dialog.showModal()}
dialog.querySelector('form').addEventListener('submit',e=>{e.preventDefault();if(!active)return;const quantity=Number(el('fn-qty').value),personalized=el('fn-custom').checked,name=el('fn-name').value.trim(),number=el('fn-number').value.trim(),type=el('fn-type').value,patchDescription=el('fn-patch-description').value.trim();if(el('fn-patch').checked&&!patchDescription){el('fn-error').textContent='Indica qué parche quieres añadir (por ejemplo, Champions League).';el('fn-patch-description').focus();return}if(!Number.isInteger(quantity)||quantity<1||quantity>40){el('fn-error').textContent='La cantidad debe estar entre 1 y 40.';return}if(personalized&&(!name||!/^[0-9]{1,3}$/.test(number))){el('fn-error').textContent='Introduce un nombre y un dorsal de 1 a 3 cifras.';return}const cart=get();if(cart.reduce((s,x)=>s+x.quantity,0)+quantity>80){el('fn-error').textContent='Máximo 80 prendas por solicitud.';return}cart.push({id:active.id,type,size:el('fn-size').value,quantity,personalized,patch:el('fn-patch').checked,patchDescription:el('fn-patch').checked?patchDescription:'',name:personalized?name:'',number:personalized?number:''});try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){el('fn-error').textContent='No se pudo guardar el carrito. Revisa el almacenamiento del navegador.';return}update();dialog.close();link.focus();link.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:300})});
const style=document.createElement('style');
style.id='fn-cart-catalog-theme';
style.textContent=`
.fn-add-cart{display:inline-flex;align-items:center;justify-content:center;gap:6px;background:#2679e4;color:#fff;border:1px solid #398af0;border-radius:10px;padding:12px 15px;min-height:46px;font:800 12px Inter,system-ui,sans-serif;line-height:1.2;cursor:pointer;white-space:nowrap;transition:background .2s,transform .2s,box-shadow .2s}
.fn-add-cart:hover{background:#4a98ff;transform:translateY(-1px);box-shadow:0 8px 20px #0a56ad44}
.fn-add-cart:focus-visible{outline:3px solid #92c7ff;outline-offset:3px}
.fn-cart-dialog{position:fixed;inset:0;margin:auto;width:min(94vw,570px);max-height:min(90dvh,780px);overflow:auto;padding:0;border:1px solid #39669d;border-radius:22px;background:#0d1b30;color:#f1f6ff;box-shadow:0 24px 90px #000a;font:inherit}
.fn-cart-dialog::backdrop{background:#020812cc;backdrop-filter:blur(7px)}
.fn-cart-inner{padding:clamp(22px,4vw,36px);display:flex;flex-direction:column;gap:11px;background:radial-gradient(ellipse at 100% 0%,#1b3d67,transparent 60%),#0d1b30}
.fn-cart-inner h2{margin:0 40px 3px 0;color:#fff;font-size:clamp(24px,4vw,32px);font-weight:850;letter-spacing:-.03em}
.fn-cart-inner>p{color:#b5c9e5;font-size:13px;line-height:1.55;margin:0 0 5px}
.fn-cart-inner label{color:#e0ecff;font-size:13px;font-weight:750}
.fn-cart-inner select,.fn-cart-inner input:not([type=checkbox]){box-sizing:border-box;width:100%;min-height:46px;padding:11px 13px;background:#0a1629;color:#fff;border:1px solid #47678e;border-radius:11px;font:inherit}
.fn-cart-inner select:focus,.fn-cart-inner input:focus{outline:2px solid #6eb2ff;outline-offset:2px}
.fn-inline{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}
.fn-inline>div{min-width:0;display:flex;flex-direction:column;gap:7px}
.fn-check{display:flex;align-items:center;gap:11px;padding:12px 13px;border:1px solid #34547a;background:#142842;border-radius:11px;cursor:pointer}
.fn-check input{accent-color:#2786ed;width:17px;height:17px;flex:none}
#fn-patch-fields{display:flex;flex-direction:column;gap:8px;padding:10px 2px}#fn-patch-fields[hidden]{display:none!important}#fn-patch-fields small{color:#b5c9e5;font-size:12px;line-height:1.4}
.fn-total{padding:14px 16px;border:1px solid #3674b4;background:#102e51;border-radius:12px;color:#fff!important;font-size:16px!important;font-weight:850}
.fn-error:not(:empty){padding:10px;color:#ffd0d5!important;background:#40202d;border:1px solid #a05c6c;border-radius:10px}
.fn-actions{display:flex;gap:12px;margin-top:6px}
.fn-actions button{flex:1;min-height:47px;padding:12px;border-radius:11px;font:800 13px Inter,system-ui,sans-serif;cursor:pointer}
.fn-cancel{background:#233954;border:1px solid #47658a;color:#e8f2ff}
.fn-primary{background:#2679e4;border:1px solid #4a9bff;color:white}
.fn-primary:hover{background:#4093fa}
.fn-cart-dialog .fn-close{position:absolute;z-index:5;top:15px;right:17px;display:flex;align-items:center;justify-content:center;width:38px;height:38px;min-width:38px;min-height:38px;margin:0;padding:0;line-height:1;font-family:Arial,sans-serif;font-size:25px;font-weight:400;text-align:center;border:1px solid #4d6b92;border-radius:10px;background:#182e4b;color:#fff;cursor:pointer;appearance:none;box-sizing:border-box}.fn-cart-dialog .fn-close:hover{background:#285181;border-color:#70a7e8}.fn-cart-dialog .fn-close:focus-visible{outline:2px solid #89bdff;outline-offset:3px}
@media(max-width:480px){.fn-inline{grid-template-columns:1fr}.fn-actions{flex-direction:column}.fn-cart-dialog{max-height:94dvh}}
`;
document.head.append(style);
for(const card of document.querySelectorAll('[data-fn-product-id]')){
 const p=map.get(card.getAttribute('data-fn-product-id'));if(!p)continue;
 const bottom=card.querySelector('.club-bottom,.bottom,.catalog-card-bottom,.product-bottom');
 if(!bottom)continue;
 const old=[...bottom.querySelectorAll('a')].find(a=>/hacer pedido/i.test(a.textContent));
 const btn=document.createElement('button');btn.type='button';btn.className='fn-add-cart';btn.textContent='🛒 Añadir al carrito';
 btn.setAttribute('aria-label','Añadir '+p.name+' al carrito');
 btn.addEventListener('click',()=>open(p));
 if(old){old.replaceWith(btn)}else{bottom.append(btn)}
}
})();
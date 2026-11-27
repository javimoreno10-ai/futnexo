(()=>{
const header=document.querySelector('header');if(!header)return;
const css=document.createElement('style');css.textContent=`
.fn-search-toggle,.fn-nav-toggle{display:inline-flex!important;align-items:center;justify-content:center;width:42px;height:42px;flex:0 0 42px;border:1px solid #34516e;border-radius:9px;background:#10233b;color:white;cursor:pointer;padding:0;vertical-align:middle}
.fn-search-toggle svg,.fn-nav-toggle svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}
.fn-search-toggle:hover,.fn-nav-toggle:hover{background:#173c65}.fn-search-toggle:focus-visible,.fn-nav-toggle:focus-visible,.fn-search-panel input:focus-visible{outline:2px solid #82baff;outline-offset:3px}
.fn-search-panel,.fn-global-menu{background:#10233b;color:white;padding:14px clamp(16px,5vw,80px);border-bottom:1px solid #34516e}
.fn-search-panel[hidden],.fn-search-results[hidden],.fn-global-menu[hidden]{display:none!important}
.fn-search-panel input{box-sizing:border-box;width:100%;background:white;color:#12233b;border:1px solid #4774aa;border-radius:9px;padding:12px;font:inherit;font-size:16px}
.fn-search-results{max-height:50vh;overflow:auto;margin-top:8px}.fn-search-results a,.fn-global-menu a{display:block;color:white;padding:10px;text-decoration:none;border-bottom:1px solid #34516e}.fn-search-results a:hover,.fn-global-menu a:hover{background:#173c65}
.fn-global-menu{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}
.fn-nav-actions{display:inline-flex;align-items:center;gap:8px;flex-shrink:0}.fn-nav-actions a{color:white;text-decoration:none;font-size:13px;font-weight:700}
header .fn-nav-toggle{display:inline-flex!important}.fn-nav-actions .fn-mobile-cart{display:none}
@media(max-width:760px){header.site-header,header.fn-search-header{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;flex-wrap:wrap!important}header .nav,header .nav-cta,header .menu-toggle,header .fn-pedido-topnav{display:none!important}header .fn-nav-actions .fn-mobile-cart{display:inline-flex;align-items:center;min-height:40px}header .fn-nav-actions{margin-left:auto}.fn-global-menu{grid-template-columns:repeat(2,minmax(0,1fr))}.fn-search-panel{padding:12px 16px}}

/* Integrar los desplegables y sus iconos en el fondo original de FutNexo. */
header .fn-search-toggle,header .fn-nav-toggle{background:transparent!important;border-color:transparent!important;box-shadow:none!important}
header .fn-search-toggle:hover,header .fn-nav-toggle:hover{background:#ffffff0d!important}
.fn-search-panel,.fn-global-menu{background:#080d17!important;border-bottom:1px solid #26374f}
.fn-search-panel input{background:transparent!important;color:#f4f7ff!important;border-color:#34465e!important}
.fn-search-panel input::placeholder{color:#aabbd1;opacity:1}
.fn-search-results,.fn-search-results a,.fn-global-menu a{background:transparent!important;color:#e8effa!important}
.fn-search-results a:hover,.fn-global-menu a:hover{background:#ffffff0b!important}
`;document.head.append(css);
header.classList.add('fn-search-header');
const makeButton=(label,cls,svg)=>{const b=document.createElement('button');b.type='button';b.className=cls;b.setAttribute('aria-label',label);b.setAttribute('aria-expanded','false');b.innerHTML=svg;return b;};
const search=makeButton('Buscar productos','fn-search-toggle','<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>');
const toggle=makeButton('Menú de colecciones','fn-nav-toggle','<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>');
const actions=document.createElement('div');actions.className='fn-nav-actions';const cart=document.createElement('a');cart.className='fn-mobile-cart';cart.href='carrito.html';cart.textContent='Carrito 🛒';actions.append(toggle,cart,search);
const instagram=header.querySelector('.nav-cta');const nav=header.querySelector('.nav,.fn-pedido-topnav');
if(instagram){instagram.before(actions);}else if(nav){const ig=nav.querySelector('a[href*="instagram.com"]');const existing=nav.querySelector('a[href*="carrito.html"]');if(!existing){const a=document.createElement('a');a.href='carrito.html';a.textContent='Carrito 🛒';nav.insertBefore(a,ig||null);}header.append(actions);if(ig){nav.after(actions);actions.after(ig);ig.classList.add('nav-cta');}}else header.append(actions);
const old=header.querySelector('.menu-toggle');if(old)old.style.setProperty('display','none','important');
const menu=document.createElement('nav');menu.className='fn-global-menu';menu.id='fn-global-menu';menu.hidden=true;menu.setAttribute('aria-label','Todas las colecciones');
for(const [name,url] of [['Inicio','index.html'],['Clubes','clubes.html'],['Selecciones','selecciones.html'],['Retro','retro.html'],['NBA','nba.html'],['Chándals','chandals.html'],['Guía de tallas','guia-tallas.html'],['Hacer pedido','pedido.html'],['Carrito','carrito.html'],['Instagram','https://www.instagram.com/fut_nexo_/']]){const a=document.createElement('a');a.href=url;a.textContent=name;menu.append(a);}
const panel=document.createElement('section');panel.id='fn-search-panel';panel.className='fn-search-panel';panel.hidden=true;panel.setAttribute('aria-label','Buscador de productos');const input=document.createElement('input');input.type='search';input.placeholder='Buscar equipo, temporada o prenda…';input.setAttribute('aria-label','Buscar productos');const results=document.createElement('div');results.className='fn-search-results';results.hidden=true;results.setAttribute('aria-live','polite');panel.append(input,results);header.after(menu,panel);
search.setAttribute('aria-controls',panel.id);toggle.setAttribute('aria-controls',menu.id);
function setSearch(open){panel.hidden=!open;search.setAttribute('aria-expanded',String(open));if(open){setMenu(false);input.focus();}}
function setMenu(open){menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open)setSearch(false);}
search.addEventListener('click',()=>setSearch(panel.hidden));toggle.addEventListener('click',()=>setMenu(menu.hidden));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!panel.hidden){setSearch(false);search.focus();}else if(!menu.hidden){setMenu(false);toggle.focus();}}});
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\bbarca\b/g,'barcelona');
input.addEventListener('input',()=>{const q=norm(input.value).trim();results.replaceChildren();results.hidden=!q;if(!q)return;const matches=(window.FUTNEXO_PRODUCTOS||[]).filter(p=>p.category!=='Entrenamiento').filter(p=>q.split(/\s+/).every(t=>norm([p.name,p.team,p.category,p.season,p.model,p.description].join(' ')).includes(t)));for(const p of matches.slice(0,40)){const a=document.createElement('a');a.href='pedido.html?ref='+encodeURIComponent(p.id);a.textContent=p.name+' · '+p.category+' · '+p.season;results.append(a);}if(!matches.length){const a=document.createElement('a');a.href='pedido.html#consulta-disponibilidad';a.textContent='LO CONSULTAMOS CONTIGO. Solicitar disponibilidad →';results.append(a);}});

/* Favoritos locales: sin cuenta ni datos personales. */
const favKey='futnexo_favoritos_v1';
const favProducts=new Map((window.FUTNEXO_PRODUCTOS||[]).map(p=>[p.id,p]));
let favIds=new Set();
function readFav(){try{const a=JSON.parse(localStorage.getItem(favKey)||'[]');favIds=new Set(Array.isArray(a)?a.filter(x=>typeof x==='string'):[]);}catch(e){favIds=new Set();}}
readFav();
const favCss=document.createElement('style');favCss.textContent=`
.fn-fav-card{position:relative!important}.fn-fav-heart{position:absolute!important;top:10px;right:10px;z-index:4;width:38px;height:38px;display:grid;place-items:center;background:#101d30;color:#f1f6ff;border:1px solid #48617e;border-radius:50%;cursor:pointer;padding:0}.fn-fav-heart svg,.fn-fav-toggle svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.8}.fn-fav-heart[aria-pressed=true]{color:#ff7892}.fn-fav-heart[aria-pressed=true] svg{fill:currentColor}.fn-fav-toggle{position:relative}.fn-fav-count{position:absolute;top:0;right:0;background:#2679e4;color:white;border-radius:10px;font:700 10px/16px Arial;padding:0 4px}.fn-fav-count[hidden]{display:none!important}.fn-fav-panel{background:#080d17;color:#e8effa;padding:20px clamp(16px,5vw,80px);border-bottom:1px solid #26374f}.fn-fav-panel[hidden]{display:none!important}.fn-fav-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}.fn-fav-head h2{font-size:22px;margin:0}.fn-fav-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}.fn-fav-item{display:flex;align-items:center;gap:10px;min-width:0;border:1px solid #34465e;border-radius:12px;padding:10px;background:#101d30}.fn-fav-item img{width:65px;height:78px;object-fit:contain;background:#fff;border-radius:7px}.fn-fav-item div{min-width:0;flex:1}.fn-fav-item a{color:#8bc1ff;text-decoration:none;font-weight:700;overflow-wrap:anywhere}.fn-fav-item small{display:block;color:#b3c8e2;margin-top:5px}.fn-fav-remove,.fn-fav-close{background:transparent;color:#e8effa;border:1px solid #48617e;border-radius:8px;padding:8px;cursor:pointer}.fn-fav-heart:focus-visible,.fn-fav-remove:focus-visible,.fn-fav-close:focus-visible{outline:2px solid #82baff;outline-offset:2px}
`;document.head.append(favCss);
const heartSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>';
const favToggle=makeButton('Mis favoritos','fn-search-toggle fn-fav-toggle',heartSvg);
const favCount=document.createElement('span');favCount.className='fn-fav-count';favCount.setAttribute('aria-hidden','true');favToggle.append(favCount);actions.append(favToggle);
const favPanel=document.createElement('section');favPanel.className='fn-fav-panel';favPanel.id='fn-fav-panel';favPanel.hidden=true;favPanel.setAttribute('aria-label','Mis favoritos');favToggle.setAttribute('aria-controls',favPanel.id);
const favHead=document.createElement('div');favHead.className='fn-fav-head';const favTitle=document.createElement('h2');favTitle.textContent='Mis favoritos';const favClose=document.createElement('button');favClose.type='button';favClose.className='fn-fav-close';favClose.textContent='Cerrar';favHead.append(favTitle,favClose);const favList=document.createElement('div');favList.className='fn-fav-list';favList.setAttribute('aria-live','polite');favPanel.append(favHead,favList);panel.after(favPanel);
function favRender(){const visible=[...favIds].map(id=>favProducts.get(id)).filter(Boolean);favCount.textContent=String(visible.length);favCount.hidden=!visible.length;favList.replaceChildren();if(!visible.length){const p=document.createElement('p');p.textContent='Todavía no tienes favoritos. Pulsa el corazón de una prenda para guardarla.';favList.append(p);}for(const p of visible){const item=document.createElement('div');item.className='fn-fav-item';const img=document.createElement('img');img.src=p.photo;img.alt=p.name;img.loading='lazy';const info=document.createElement('div');const a=document.createElement('a');a.href='pedido.html?ref='+encodeURIComponent(p.id);a.textContent=p.name;const desc=document.createElement('small');desc.textContent=[p.season,p.model].filter(Boolean).join(' · ');info.append(a,desc);const remove=document.createElement('button');remove.type='button';remove.className='fn-fav-remove';remove.textContent='×';remove.setAttribute('aria-label','Quitar '+p.name+' de favoritos');remove.onclick=()=>changeFav(p.id);item.append(img,info,remove);favList.append(item);}for(const b of document.querySelectorAll('.fn-fav-heart')){const on=favIds.has(b.dataset.favId);b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',(on?'Quitar de favoritos: ':'Guardar en favoritos: ')+(favProducts.get(b.dataset.favId)?.name||'prenda'));}}
function changeFav(id){if(!favProducts.has(id))return; if(favIds.has(id))favIds.delete(id);else favIds.add(id);try{localStorage.setItem(favKey,JSON.stringify([...favIds]));}catch(e){}favRender();}
function setFav(open){favPanel.hidden=!open;favToggle.setAttribute('aria-expanded',String(open));if(open){setSearch(false);setMenu(false);favRender();favClose.focus();}}
favToggle.onclick=()=>setFav(favPanel.hidden);favClose.onclick=()=>{setFav(false);favToggle.focus();};search.addEventListener('click',()=>setFav(false));toggle.addEventListener('click',()=>setFav(false));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!favPanel.hidden){setFav(false);favToggle.focus();}});window.addEventListener('storage',e=>{if(e.key===favKey){readFav();favRender();}});
for(const card of document.querySelectorAll('article[data-fn-product-id]')){const id=card.dataset.fnProductId;if(!favProducts.has(id))continue;card.classList.add('fn-fav-card');const b=document.createElement('button');b.type='button';b.className='fn-fav-heart';b.dataset.favId=id;b.innerHTML=heartSvg;b.onclick=e=>{e.preventDefault();e.stopPropagation();changeFav(id);};card.append(b);}
favRender();


/* Accesos sociales en el lugar del antiguo botón de Instagram. */
const social=document.createElement('div');social.className='fn-social-links';
const socialData=[
['Instagram','https://www.instagram.com/fut_nexo_/','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>'],
['TikTok','https://www.tiktok.com/@fut_nexo_?_r=1&_t=ZN-9BjEOHBcCQw','<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 2c.3 2.5 1.7 4 4.4 4.2v3.4a8.2 8.2 0 0 1-4.4-1.3v7.1a6.4 6.4 0 1 1-6.4-6.4c.4 0 .8 0 1.2.1v3.5a3.1 3.1 0 1 0 1.8 2.8V2z"/></svg>']
];
for(const [name,url,svg] of socialData){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',name+' de FutNexo');a.title=name;a.innerHTML=svg;social.append(a);}
const oldSocial=header.querySelector('.nav-cta[href*="instagram.com"],a.nav-cta[href*="instagram.com"]');
if(oldSocial){oldSocial.replaceWith(social);}else{const oldIg=[...header.querySelectorAll('a[href*="instagram.com"]')].find(a=>/instagram/i.test(a.textContent));if(oldIg)oldIg.replaceWith(social);else actions.after(social);}
const socialStyle=document.createElement('style');socialStyle.textContent='.fn-social-links{display:inline-flex!important;align-items:center;gap:6px;flex-shrink:0}.fn-social-links a{display:inline-flex!important;align-items:center;justify-content:center;width:38px;height:38px;border-radius:9px;color:#f1f6ff!important;background:transparent;text-decoration:none}.fn-social-links a:hover{background:#ffffff12}.fn-social-links a:focus-visible{outline:2px solid #82baff;outline-offset:2px}.fn-social-links svg{width:23px;height:23px}@media(max-width:760px){.fn-social-links{gap:2px}.fn-social-links a{width:32px;height:36px}.fn-social-links svg{width:20px;height:20px}}';document.head.append(socialStyle);



/* Cabecera móvil en una sola fila; escritorio intacto. */
const mobileHeaderStyle=document.createElement('style');
mobileHeaderStyle.textContent=`
@media(max-width:760px){
header.fn-search-header{box-sizing:border-box!important;display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;justify-content:flex-start!important;gap:clamp(2px,1vw,7px)!important;padding-inline:clamp(6px,2vw,14px)!important}
header.fn-search-header .brand{display:inline-flex!important;flex:0 1 auto!important;min-width:0!important;align-items:center!important;gap:3px!important;margin:0!important;white-space:nowrap!important}
header.fn-search-header .brand-fn-icon{width:clamp(25px,7vw,34px)!important;height:clamp(25px,7vw,34px)!important;min-width:0!important;flex-shrink:0!important;font-size:14px!important}
header.fn-search-header .brand-wordmark{font-size:clamp(11px,3.4vw,17px)!important;letter-spacing:0!important;white-space:nowrap!important}
header.fn-search-header .fn-nav-actions{display:flex!important;flex:0 0 auto!important;flex-wrap:nowrap!important;gap:0!important;margin:0 0 0 auto!important}
header.fn-search-header .fn-social-links{display:flex!important;flex:0 0 auto!important;flex-wrap:nowrap!important;gap:0!important;margin:0!important}
header.fn-search-header .fn-nav-actions button,header.fn-search-header .fn-nav-actions .fn-mobile-cart,header.fn-search-header .fn-social-links a{box-sizing:border-box!important;width:clamp(27px,8vw,38px)!important;min-width:0!important;height:40px!important;min-height:40px!important;flex:0 0 auto!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;padding:0!important;margin:0!important}
header.fn-search-header .fn-nav-actions svg,header.fn-search-header .fn-social-links svg{width:19px!important;height:19px!important;flex-shrink:0!important}
header.fn-search-header .fn-mobile-cart{font-size:0!important}
header.fn-search-header .fn-mobile-cart::after{content:"";width:19px;height:19px;background:currentColor;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3h3l3 12h11l3-9H6'/%3E%3Ccircle cx='9' cy='20' r='1'/%3E%3Ccircle cx='19' cy='20' r='1'/%3E%3C/svg%3E") center/contain no-repeat}
header.fn-search-header .fn-nav-toggle{order:0}header.fn-search-header .fn-search-toggle:not(.fn-fav-toggle){order:1}header.fn-search-header .fn-fav-toggle{order:2}header.fn-search-header .fn-mobile-cart{order:3}
}
`;document.head.append(mobileHeaderStyle);
cart.setAttribute('aria-label','Carrito');

/* Vista previa navideña: exclusivamente rama de pruebas. */
const previewStyle=document.createElement('style');previewStyle.textContent=`
.fn-preview-sale{margin:12px auto 20px;width:calc(100% - 24px);max-width:1320px;box-sizing:border-box;text-align:center;padding:15px 10px;background:radial-gradient(ellipse at top,#be2536,#740912 75%);border:1px solid #e9c36c;border-radius:16px;color:#fff;box-shadow:0 4px 20px #0004}.fn-preview-sale b{color:#ffe1a0;display:block;font-size:clamp(20px,3vw,32px);margin:4px}.fn-preview-sale small{color:#ffe1a0}.fn-preview-price{display:flex;flex-direction:column;gap:4px}.fn-preview-price del{font-size:12px;color:#aabbd0}.fn-preview-price strong{color:#75e6a0!important;font-size:20px}.fn-preview-label{color:#ffe2a0;background:#941b29;border-radius:5px;padding:3px 6px;font-size:10px;font-weight:bold;align-self:flex-start}.fn-volume-promo{border-color:#b99a59!important}.fn-volume-grid>div{background:#143e2d!important;border-color:#a98e50!important}.fn-volume-grid strong{color:#ffdc89!important}
`;document.head.append(previewStyle);
const sale=document.createElement('section');sale.className='fn-preview-sale';sale.innerHTML='<small>🎄 FUTNEXO · CHRISTMAS SALE 🎄</small><b>HASTA UN 45 % DE DESCUENTO</b><div>🎁 Envío GRATIS desde 2 prendas</div><small>Del 1 de diciembre al 5 de enero · VISTA DE PRUEBAS</small>';const promo=document.querySelector('main .fn-volume-promo');if(promo)promo.before(sale);else favPanel.after(sale);
const previewPrices={Fan:[2199,1980],Player:[2599,2340],Retro:[2599,2340],Infantil:[2799,2520],Adulto:[2999,2700],NBA:[3099,2806],'Media cremallera':[4999,4500],'Cremallera larga':[5899,5310]};
const fmtPreview=n=>(n/100).toFixed(2).replace('.',',')+' €';
for(const card of document.querySelectorAll('[data-fn-product-id]')){const p=favProducts.get(card.dataset.fnProductId);if(!p)continue;const t=p.priceType||p.fixedVersion||'Fan',v=previewPrices[t];const bottom=card.querySelector('.club-bottom,.bottom,.catalog-card-bottom,.product-bottom');const price=bottom?.querySelector('strong');if(!v||!price)continue;const display=document.createElement('div');display.className='fn-preview-price';display.innerHTML='<span class="fn-preview-label">🎄 NAVIDAD · HASTA 10 %</span><del>'+fmtPreview(v[0])+'</del><strong>'+fmtPreview(v[1])+'</strong><small>Precio individual orientativo</small>';price.replaceWith(display);}

for(const node of document.querySelectorAll('.legacy-collection-bottom>strong,.chandal-choice-card em')){const m=node.textContent.match(/(21,99|25,99|49,99|58,99|30,99)\s*€/);if(!m)continue;const cents=Number(m[1].replace(',',''));const t=Object.values(previewPrices).find(v=>v[0]===cents);if(!t)continue;const prefix=node.textContent.slice(0,m.index);node.replaceChildren(document.createTextNode(prefix));const del=document.createElement('del');del.textContent=fmtPreview(cents);const strong=document.createElement('span');strong.style.cssText='color:#75e6a0;font-weight:850;display:block';strong.textContent=fmtPreview(t[1])+' · Navidad';node.append(del,strong);}

/* Decoración de temporada, solo en la rama de pruebas. */
document.documentElement.classList.add('fn-holiday-theme');
const holidayCSS=document.createElement('style');holidayCSS.textContent=`
.fn-holiday-theme body{background-image:radial-gradient(ellipse at 8% 12%,#12402a55,transparent 38%),radial-gradient(ellipse at 94% 35%,#75122338,transparent 37%)!important;background-color:#080f1b!important}
.fn-holiday-theme header.fn-search-header{border-bottom:1px solid #b7a067!important}
.fn-holiday-theme .brand-fn-icon{position:relative;isolation:isolate}
.fn-holiday-hat{position:absolute;width:29px;height:25px;left:-9px;top:-12px;pointer-events:none;z-index:2;transform:rotate(-22deg)}
.fn-holiday-garland{height:18px;overflow:hidden;background:linear-gradient(180deg,#0a251b,#194e32 60%,transparent);position:relative;pointer-events:none;display:flex;justify-content:space-around;align-items:flex-start;padding:0 8px;box-sizing:border-box}
.fn-holiday-garland:before{content:"";position:absolute;inset:0 0 8px;background:repeating-linear-gradient(145deg,transparent 0 8px,#327447 9px 11px,transparent 12px 16px),repeating-linear-gradient(35deg,transparent 0 10px,#22623a 11px 14px,transparent 15px 20px);opacity:.75}
.fn-holiday-garland i{position:relative;display:block;width:6px;height:6px;border-radius:50%;margin-top:6px;background:#ffcf75;box-shadow:0 0 8px 2px #ffce6577}
.fn-holiday-garland i:nth-child(3n){background:#ff465d;box-shadow:0 0 8px 2px #ff465d88}
.fn-holiday-garland i:nth-child(3n+1){background:#68eea0;box-shadow:0 0 8px 2px #68eea077}
.fn-holiday-garland i:nth-child(even){margin-top:11px}
.fn-holiday-theme .hero h1>span{color:#6cdb91!important}
.fn-holiday-theme .hero .btn-primary{background:linear-gradient(135deg,#c82739,#8f1426)!important;border-color:#df6871!important}
.fn-holiday-theme .hero-art-label{background:#145333!important;border-color:#75a981!important}
.fn-holiday-theme .hero-art .art-front{box-shadow:0 -5px 0 #eef7ff,0 0 22px #a3e6c528}
.fn-holiday-theme .legacy-collection,.fn-holiday-theme [data-fn-product-id]{border-color:#4d775e!important}
.fn-holiday-theme .legacy-collection:nth-child(odd),.fn-holiday-theme [data-fn-product-id]:nth-child(odd){border-color:#8b4551!important}
.fn-holiday-theme .legacy-collection:hover,.fn-holiday-theme [data-fn-product-id]:hover{border-color:#d9b768!important}
.fn-holiday-theme .legacy-collection{box-shadow:inset 0 3px 0 #e5f3ff25}
.fn-holiday-theme .fn-preview-sale{background:radial-gradient(ellipse at 15% 10%,#d02b3d55,transparent 45%),linear-gradient(105deg,#8b1020,#102a25 52%,#8b1020)!important;box-shadow:0 0 20px #b4913c22,inset 0 3px 0 #f1f8ffaf}
.fn-holiday-theme .fn-preview-sale b{letter-spacing:.025em}
.fn-holiday-theme .fn-preview-price small{color:#a9c8b5}
.fn-holiday-theme .fn-cart-dialog{border-color:#568a69!important}
.fn-holiday-theme .fn-cart-inner{background:radial-gradient(ellipse at 100% 0%,#234b35,transparent 58%),#0d1b30!important}
.fn-holiday-theme .fn-cart-inner .fn-total{border-color:#63c38d!important}
.fn-holiday-theme #discount,.fn-holiday-theme #applied-percent,.fn-holiday-theme #total{color:#75e6a0!important}
.fn-holiday-theme .footer{border-top:1px solid #bca16c!important}
.fn-holiday-foot{font-weight:700;text-align:center;color:#e9ca85;padding:12px 8px;background:linear-gradient(90deg,#64122255,#15432b88,#64122255);border-top:1px solid #bca16c44;font-size:13px}
.fn-holiday-snow{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:20}
.fn-holiday-snow i{position:absolute;top:-22px;color:#e5f4ff;opacity:var(--o);font:normal var(--s) Arial,sans-serif;animation:fn-holiday-fall var(--d) linear infinite;animation-delay:var(--delay);text-shadow:0 0 5px #cae6ff77}
@keyframes fn-holiday-fall{0%{transform:translate3d(0,-25px,0) rotate(0deg)}100%{transform:translate3d(var(--drift),calc(100vh + 45px),0) rotate(130deg)}}
.fn-holiday-detail{display:block;color:#ffe0a0;font-size:12px;font-weight:750;letter-spacing:.08em;margin:0 auto 6px;text-transform:uppercase}
@media(max-width:760px){.fn-holiday-garland{height:13px}.fn-holiday-garland i:nth-child(n+23){display:none}.fn-holiday-hat{width:22px;height:19px;left:-5px;top:-9px}.fn-holiday-snow i:nth-child(n+15){display:none}.fn-holiday-detail{font-size:10px}}
@media(prefers-reduced-motion:reduce){.fn-holiday-snow{display:none}}
`;document.head.append(holidayCSS);
const hatAnchor=header.querySelector('.brand-fn-icon');if(hatAnchor){const hat=document.createElement('span');hat.className='fn-holiday-hat';hat.setAttribute('aria-hidden','true');hat.innerHTML='<svg viewBox="0 0 36 30" width="100%" height="100%"><path d="M5 22Q8 1 23 3Q30 5 29 15L24 12L28 23Z" fill="#c91f34" stroke="#ff6c76"/><path d="M5 21Q16 18 29 21L30 26Q15 24 4 27Z" fill="#f5f8ff"/><circle cx="29" cy="14" r="4.5" fill="#fff"/></svg>';hatAnchor.append(hat);}
const garland=document.createElement('div');garland.className='fn-holiday-garland';garland.setAttribute('aria-hidden','true');for(let n=0;n<38;n++)garland.append(document.createElement('i'));header.after(garland);
const snow=document.createElement('div');snow.className='fn-holiday-snow';snow.setAttribute('aria-hidden','true');for(let n=0;n<30;n++){const flake=document.createElement('i');flake.textContent=n%4===0?'❄':'•';flake.style.left=((n*37+11)%100)+'%';flake.style.setProperty('--s',(n%4===0?11:5+n%4)+'px');flake.style.setProperty('--o',String(.18+(n%5)*.07));flake.style.setProperty('--d',(12+n%9*2)+'s');flake.style.setProperty('--delay',(-n*1.7)+'s');flake.style.setProperty('--drift',(n%2?35:-35)+'px');snow.append(flake);}document.body.append(snow);
const pageName=location.pathname.split('/').pop().replace('.html','')||'index';const details={index:'✦ Una Navidad llena de fútbol ✦',clubes:'⚽ Regala los colores de tu equipo',selecciones:'❄ La pasión no tiene fronteras',retro:'✦ Una Navidad de leyendas',nba:'🏀 Navidad sobre la cancha',chandals:'❄ Abrígate con tus colores', 'guia-tallas':'🎁 Encuentra la talla perfecta para tu regalo',pedido:'🎁 Prepara tu pedido de Navidad',carrito:'🎁 Tus regalos de Navidad'};const detail=document.createElement('span');detail.className='fn-holiday-detail';detail.textContent=details[pageName]||'✦ Especial Navidad FutNexo ✦';sale.prepend(detail);
const footer=document.querySelector('footer');if(footer){const note=document.createElement('div');note.className='fn-holiday-foot';note.textContent='❄  FUTNEXO · FELICES FIESTAS  ❄';footer.prepend(note);}


/* Únicamente el estadio fotográfico; conservar decoración original. */
const stadiumHero=document.querySelector('.hero');
if(stadiumHero){
 const stadiumStyle=document.createElement('style');
 stadiumStyle.textContent=`
 .fn-holiday-theme .hero.fn-photo-stadium{position:relative;isolation:isolate}
 .fn-holiday-theme .hero.fn-photo-stadium:before{content:"";position:absolute;z-index:-1;inset:0;border-radius:20px;pointer-events:none;background:linear-gradient(90deg,#080f1bf2 0%,#080f1bc2 38%,#080f1b44 100%),linear-gradient(0deg,#080f1b 0%,transparent 22%),url('https://futnexo.pages.dev/navidad-estadio.png') center center/cover no-repeat}
 @media(max-width:760px){.fn-holiday-theme .hero.fn-photo-stadium:before{background:linear-gradient(180deg,#080f1be8 0%,#080f1b80 55%,#080f1b 100%),url('https://futnexo.pages.dev/navidad-estadio.png') center center/cover no-repeat}}
 `;document.head.append(stadiumStyle);
 const stadiumImage=new Image();stadiumImage.onload=()=>stadiumHero.classList.add('fn-photo-stadium');stadiumImage.src='https://futnexo.pages.dev/navidad-estadio.png';
}
})();
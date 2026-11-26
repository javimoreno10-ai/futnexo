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
for(const [name,url] of [['Inicio','index.html'],['Clubes','clubes.html'],['Selecciones','selecciones.html'],['Retro','retro.html'],['NBA','nba.html'],['Chándals','chandals.html'],['Entrenamiento','entrenamiento.html'],['Guía de tallas','guia-tallas.html'],['Hacer pedido','pedido.html'],['Carrito','carrito.html'],['Instagram','https://www.instagram.com/fut_nexo_/']]){const a=document.createElement('a');a.href=url;a.textContent=name;menu.append(a);}
const panel=document.createElement('section');panel.id='fn-search-panel';panel.className='fn-search-panel';panel.hidden=true;panel.setAttribute('aria-label','Buscador de productos');const input=document.createElement('input');input.type='search';input.placeholder='Buscar equipo, temporada o prenda…';input.setAttribute('aria-label','Buscar productos');const results=document.createElement('div');results.className='fn-search-results';results.hidden=true;results.setAttribute('aria-live','polite');panel.append(input,results);header.after(menu,panel);
search.setAttribute('aria-controls',panel.id);toggle.setAttribute('aria-controls',menu.id);
function setSearch(open){panel.hidden=!open;search.setAttribute('aria-expanded',String(open));if(open){setMenu(false);input.focus();}}
function setMenu(open){menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open)setSearch(false);}
search.addEventListener('click',()=>setSearch(panel.hidden));toggle.addEventListener('click',()=>setMenu(menu.hidden));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!panel.hidden){setSearch(false);search.focus();}else if(!menu.hidden){setMenu(false);toggle.focus();}}});
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\bbarca\b/g,'barcelona');
input.addEventListener('input',()=>{const q=norm(input.value).trim();results.replaceChildren();results.hidden=!q;if(!q)return;const matches=(window.FUTNEXO_PRODUCTOS||[]).filter(p=>q.split(/\s+/).every(t=>norm([p.name,p.team,p.category,p.season,p.model,p.description].join(' ')).includes(t)));for(const p of matches.slice(0,40)){const a=document.createElement('a');a.href='pedido.html?ref='+encodeURIComponent(p.id);a.textContent=p.name+' · '+p.category+' · '+p.season;results.append(a);}if(!matches.length)results.textContent='No encontramos productos. Prueba otro equipo o temporada.';});
})();
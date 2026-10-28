/* FutNexo Clubes 26/27 — edita este listado al actualizar los equipos. */
const CLUBES = [
  {
    "slug": "real-madrid",
    "nombre": "Real Madrid",
    "liga": "espana",
    "region": "España",
    "foto": "real-madrid.webp"
  },
  {
    "slug": "barcelona",
    "nombre": "FC Barcelona",
    "liga": "espana",
    "region": "España",
    "foto": "barcelona.webp"
  },
  {
    "slug": "arsenal",
    "nombre": "Arsenal",
    "liga": "inglaterra",
    "region": "Inglaterra",
    "foto": "arsenal.webp"
  },
  {
    "slug": "man-city",
    "nombre": "Manchester City",
    "liga": "inglaterra",
    "region": "Inglaterra",
    "foto": "man-city.webp"
  },
  {
    "slug": "liverpool",
    "nombre": "Liverpool",
    "liga": "inglaterra",
    "region": "Inglaterra",
    "foto": "liverpool.webp"
  },
  {
    "slug": "chelsea",
    "nombre": "Chelsea",
    "liga": "inglaterra",
    "region": "Inglaterra",
    "foto": "chelsea.webp"
  },
  {
    "slug": "man-united",
    "nombre": "Manchester United",
    "liga": "inglaterra",
    "region": "Inglaterra",
    "foto": "man-united.webp"
  },
  {
    "slug": "bayern",
    "nombre": "Bayern de Múnich",
    "liga": "europa",
    "region": "Europa",
    "foto": "bayern.webp"
  },
  {
    "slug": "dortmund",
    "nombre": "Borussia Dortmund",
    "liga": "europa",
    "region": "Europa",
    "foto": "dortmund.webp"
  },
  {
    "slug": "psg",
    "nombre": "Paris Saint-Germain",
    "liga": "europa",
    "region": "Europa",
    "foto": "psg.webp"
  },
  {
    "slug": "milan",
    "nombre": "AC Milan",
    "liga": "europa",
    "region": "Europa",
    "foto": "milan.webp"
  },
  {
    "slug": "juventus",
    "nombre": "Juventus",
    "liga": "europa",
    "region": "Europa",
    "foto": "juventus.webp"
  }
];

(function(){
 'use strict';
 const grid=document.getElementById('club-grid');
 const buttons=[...document.querySelectorAll('.club-filter')];
 const search=document.getElementById('club-search');
 const count=document.getElementById('club-count');
 const menuButton=document.getElementById('menu-toggle');
 const mobile=document.getElementById('mobile-nav');
 let current='todos';
 const safe=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const instagram='https://www.instagram.com/fut_nexo_/';
 function render(){
  const q=search.value.trim().toLocaleLowerCase('es');
  const filtered=CLUBES.filter(p=>(current==='todos'||p.liga===current)&&p.nombre.toLocaleLowerCase('es').includes(q));
  count.textContent=filtered.length+' '+(filtered.length===1?'equipo':'equipos')+' para explorar';
  grid.innerHTML=filtered.length?filtered.map(p=>`<article class="club-card">
   <div class="club-photo"><span class="club-photo-tag">${safe(p.region)}</span><img src="assets/clubes/${encodeURIComponent(p.foto)}" alt="Foto de referencia: camiseta de ${safe(p.nombre)}" loading="lazy"></div>
   <div class="club-card-body"><h3>${safe(p.nombre)}</h3><p>Consultar modelos y tallas</p><div class="club-bottom"><strong>Fan desde 17,99 €</strong><a href="${instagram}" target="_blank" rel="noopener noreferrer" aria-label="Consultar camisetas de ${safe(p.nombre)} por Instagram">Consultar ↗</a></div></div>
  </article>`).join(''):'<p class="club-none">No hemos encontrado ese equipo. Puedes preguntarnos por Instagram.</p>';
 }
 buttons.forEach(b=>b.addEventListener('click',()=>{current=b.dataset.league;buttons.forEach(x=>{const on=x===b;x.classList.toggle('active',on);x.setAttribute('aria-pressed',String(on))});render()}));
 search.addEventListener('input',render);
 if(menuButton&&mobile){menuButton.addEventListener('click',()=>{const open=mobile.classList.toggle('open');menuButton.textContent=open?'×':'☰';menuButton.setAttribute('aria-expanded',String(open))});mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('open');menuButton.textContent='☰';menuButton.setAttribute('aria-expanded','false')}))}
 render();
})();

/* FutNexo V3.61 — navegación principal, sin dependencia de bibliotecas externas. */
(function(){'use strict';
 const menu=document.getElementById('menu-toggle');
 const nav=document.getElementById('mobile-nav');
 if(menu&&nav){
   const close=()=>{nav.classList.remove('open','is-open');menu.setAttribute('aria-expanded','false');};
   menu.setAttribute('aria-expanded','false');
   menu.addEventListener('click',()=>{
     const expanded=menu.getAttribute('aria-expanded')==='true';
     nav.classList.toggle('open',!expanded);
     menu.setAttribute('aria-expanded',String(!expanded));
   });
   nav.addEventListener('click',event=>{if(event.target.closest('a'))close()});
   document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
   document.addEventListener('click',event=>{if(!nav.contains(event.target)&&!menu.contains(event.target))close()});
 }
})();

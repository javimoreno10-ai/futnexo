import {PRODUCTS,calculate,money,FX} from './calculator.js';
const $=id=>document.getElementById(id);
const eur=n=>Number.isFinite(n)?new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(money(n)):'No disponible';
const state=Object.fromEntries(PRODUCTS.map(p=>[p.id,{quantity:p.id==='fan'?2:0,price:p.price}]));
let result;
function init(){
 $('products').innerHTML=PRODUCTS.map(p=>`<tr><td>${p.name}${p.eligible?'':' <small>(sin descuentos)</small>'}</td><td><input aria-label="Precio ${p.name}" data-id="${p.id}" data-field="price" type="number" min="0" step="0.01" value="${p.price}"></td><td><div class="qty"><button data-id="${p.id}" data-delta="-1" aria-label="Quitar ${p.name}">−</button><output id="q-${p.id}">${state[p.id].quantity}</output><button data-id="${p.id}" data-delta="1" aria-label="Añadir ${p.name}">+</button></div></td><td id="c1-${p.id}"></td><td id="c2-${p.id}"></td><td id="sum-${p.id}"></td></tr>`).join('');
 $('products').addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(!b)return;const s=state[b.dataset.id];s.quantity=Math.max(0,Math.min(1000,s.quantity+Number(b.dataset.delta)));render();});
 $('products').addEventListener('input',e=>{if(e.target.dataset.field==='price'){const v=e.target.value;state[e.target.dataset.id].price=v===''?'':Math.max(0,Number(v)||0);render();}});
 $('goal').addEventListener('input',render);
 $('reset').addEventListener('click',()=>{PRODUCTS.forEach(p=>state[p.id]={quantity:0,price:p.price});$('goal').value=40;initRows();render();});
 $('copy').addEventListener('click',async()=>{const text=summary();try{await navigator.clipboard.writeText(text);$('copy').textContent='Copiado';setTimeout(()=>$('copy').textContent='Copiar resultados',1500);}catch{window.prompt('Copia los resultados:',text);}});
 render();
}
function initRows(){PRODUCTS.forEach(p=>{document.querySelector(`input[data-id="${p.id}"]`).value=p.price;});}
function render(){result=calculate(state,{targetMargin:Number($('goal').value)});$('goalValue').textContent=$('goal').value+' %';result.rows.forEach(r=>{$('q-'+r.id).textContent=r.quantity;$('c1-'+r.id).textContent=eur(r.c1[result.n>=40?4:result.n>=10?3:result.n>=5?2:result.n>=3?1:0]*FX);$('c2-'+r.id).textContent=r.c2===null?'No disponible':eur(r.c2*FX);$('sum-'+r.id).textContent=eur(r.quantity*r.salePrice);});
 $('stats').innerHTML=[['Prendas totales',result.n],['Prendas elegibles',result.eligibleCount],['Descuento del tramo',result.tierPct+' %'],['Descuento aplicado',result.discountPct.toFixed(2).replace('.',',')+' %'],['Total cliente',eur(result.revenue)],['Beneficio bruto',eur(result.profit)],['Margen bruto',result.margin.toFixed(2).replace('.',',')+' %'],['Objetivo',result.n===0?'Sin pedido':result.goalMet?'✓ Cumplido':'⚠ No alcanzado']].map(([k,v])=>`<article class="stat"><span>${k}</span><strong>${v}</strong></article>`).join('');
 const values=[['Subtotal original',eur(result.subtotal)],['Descuento','−'+eur(result.saving)],['Envío cobrado al cliente',eur(result.customerShipping)],['Coste CHINO 1',eur(result.cost1)],['Coste CHINO 2',eur(result.cost2)],['Proveedor más económico',result.supplier],['Coste seleccionado',eur(result.cost)],['Beneficio bruto',eur(result.profit)],['Margen',result.margin.toFixed(2).replace('.',',')+' %']];$('breakdown').innerHTML=values.map(([a,b])=>`<div class="line"><span>${a}</span><strong>${b}</strong></div>`).join('')+(result.n>0&&!result.goalMet?'<p class="warning">El pedido no alcanza el margen objetivo ni con el descuento limitado. Revisar precios.</p>':'');
}
function summary(){return ['FUTNEXO — SIMULACIÓN',...result.rows.filter(r=>r.quantity).map(r=>`${r.name}: ${r.quantity} × ${eur(r.salePrice)}`),`Prendas elegibles: ${result.eligibleCount}`,`Descuento del tramo: ${result.tierPct}%`,`Descuento aplicado: ${result.discountPct.toFixed(2)}%`,`Envío cliente: ${eur(result.customerShipping)}`,`Coste CHINO 1: ${eur(result.cost1)}`,`Coste CHINO 2: ${eur(result.cost2)}`,`Proveedor: ${result.supplier}`,`Total: ${eur(result.revenue)}`,`Beneficio bruto: ${eur(result.profit)}`,`Margen: ${result.margin.toFixed(2)}%`].join('\n');}
init();

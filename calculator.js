// FutNexo shared calculation engine. All money in EUR, supplier tariffs in USD.
export const FX = 0.9092;
export const PRODUCTS = [
 {id:'fan',name:'Camiseta Fan',price:29.99,c1:[12.5,10,9.5,8.5,8],c2:8,eligible:true},
 {id:'retro',name:'Camiseta Retro',price:36.99,c1:[15,12.5,12,11,10.5],c2:11,eligible:true},
 {id:'player',name:'Camiseta Player',price:36.99,c1:[15,12.5,12,11,10.5],c2:11,eligible:true},
 {id:'nba',name:'Camiseta NBA',price:39.99,c1:[15.5,13,12.5,11.5,11],c2:14,eligible:true},
 {id:'half',name:'Chándal media cremallera',price:54.99,c1:[36,36,36,36,36],c2:26,eligible:true},
 {id:'full',name:'Chándal cremallera completa',price:54.99,c1:[36,36,36,36,36],c2:33,eligible:true},
 {id:'training',name:'Conjunto de entrenamiento',price:34.99,c1:[29,29,29,29,29],c2:null,eligible:false},
];
export const money = n => Math.round((n + Number.EPSILON)*100)/100;
export function calculate(lines, {fx=FX,targetMargin=40}={}) {
 const rows=PRODUCTS.map(p=>{const l=lines?.[p.id]||{};return {...p,quantity:Math.max(0,Math.floor(Number(l.quantity)||0)),salePrice:Number.isFinite(Number(l.price))&&l.price!==''?Math.max(0,Number(l.price)):p.price};});
 const n=rows.reduce((s,r)=>s+r.quantity,0);
 const eligibleCount=rows.reduce((s,r)=>s+(r.eligible?r.quantity:0),0);
 const tier=n>=40?4:n>=10?3:n>=5?2:n>=3?1:0;
 const rate=eligibleCount>=10?35:eligibleCount>=5?30:eligibleCount>=3?20:eligibleCount>=2?15:0;
 const subtotal=rows.reduce((s,r)=>s+r.quantity*r.salePrice,0);
 const eligibleSubtotal=rows.reduce((s,r)=>s+(r.eligible?r.quantity*r.salePrice:0),0);
 const customerShipping=n===1?2.99:0;
 const c1=n?(rows.reduce((s,r)=>s+r.c1[tier]*r.quantity,0)+3.5)*fx+4:0;
 const c2=n&&rows.every(r=>r.quantity===0||r.c2!==null)?(rows.reduce((s,r)=>s+(r.c2??0)*r.quantity,0)+(n===1?4:n===2?3:n===3?2:0))*fx+4:Infinity;
 const cost=Math.min(c1,c2);
 const supplier=n===0?'—':c1<=c2?'CHINO 1':'CHINO 2';
 const safeTarget=Math.max(0,Math.min(99.9,Number(targetMargin)||0));
 const possible=eligibleSubtotal>0?Math.max(0,Math.min(rate,((subtotal+customerShipping-cost/(1-safeTarget/100))/eligibleSubtotal)*100)):0;
 // Match the existing ChatGPT simulator: truncate the percentage to four decimal places.
 const discountPct=Math.floor((possible+1e-10)*10000)/10000;
 const saving=eligibleSubtotal*discountPct/100;
 const revenue=subtotal-saving+customerShipping;
 const profit=revenue-cost;
 const margin=revenue>0?profit/revenue*100:0;
 return {rows,n,eligibleCount,tierPct:rate,discountPct,subtotal,eligibleSubtotal,customerShipping,cost1:c1,cost2:c2,supplier,cost,saving,revenue,profit,margin,targetMargin:safeTarget,goalMet:n>0&&margin+1e-8>=safeTarget};
}

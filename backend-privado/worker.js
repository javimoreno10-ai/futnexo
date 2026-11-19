// Deploy this Worker separately. Set FUTNEXO_COSTS_JSON as an encrypted secret.
// Never put supplier tariffs in this repository or in public Worker variables.
const PRICES={Fan:2199,Retro:2599,Player:2599,NBA:3099,'Media cremallera':4999,'Cremallera larga':5899,Entrenamiento:3799,Infantil:2799,Adulto:2999};
const ELIGIBLE=new Set(['Fan','Retro','Player','NBA','Media cremallera','Cremallera larga']);
const round=n=>Math.round(n);
function quote(lines,cfg){
 if(!Array.isArray(lines)||lines.length>80)throw Error('Pedido inválido');
 let items=lines.map(x=>{let type=String(x.type||''),quantity=Number(x.quantity);if(!(type in PRICES)||!Number.isInteger(quantity)||quantity<1||quantity>40)throw Error('Prenda inválida');return {type,quantity,personalized:!!x.personalized,patch:!!x.patch}});
 let n=items.reduce((s,x)=>s+x.quantity,0);if(n>80)throw Error('Cantidad inválida');
 let eligible=items.reduce((s,x)=>s+(ELIGIBLE.has(x.type)?x.quantity:0),0),rate=eligible>=10?35:eligible>=5?30:eligible>=3?20:eligible>=2?15:0;
 let base=items.reduce((s,x)=>s+PRICES[x.type]*x.quantity,0),discountable=items.reduce((s,x)=>s+(ELIGIBLE.has(x.type)?PRICES[x.type]*x.quantity:0),0);
 let extras=items.reduce((s,x)=>s+x.quantity*(150*Number(x.personalized)+150*Number(x.patch)),0),ship=n===1?299:0;
 let fx=Number(cfg.fx),overhead=Number(cfg.overheadEUR),margin=Number(cfg.targetMargin);
 if(!(fx>0&&overhead>=0&&margin>=0&&margin<1))throw Error('Configuración inválida');
 let candidates=[];
 function supplierCost(supplier,group){
  if(!group.length)return 0;
  let groupN=group.reduce((n,x)=>n+x.quantity,0);
  let tier=groupN>=40?4:groupN>=10?3:groupN>=5?2:groupN>=3?1:0;
  let usd=Number(supplier.feeUSD||0)+Number(supplier.shippingUSD?.[String(groupN)]??supplier.shippingDefaultUSD??0);
  for(const x of group){
   const p=supplier.products[x.type];
   if(p==null)return Infinity;
   const unit=Array.isArray(p)?p[tier]:p;
   if(!Number.isFinite(Number(unit)))return Infinity;
   usd+=Number(unit)*x.quantity+x.quantity*(Number(supplier.personalizationUSD||0)*Number(x.personalized)+Number(supplier.patchUSD||0)*Number(x.patch));
  }
  return usd*fx+overhead;
 }
 for(const supplier of cfg.suppliers){
  const cost=supplierCost(supplier,items);
  if(Number.isFinite(cost))candidates.push(cost);
 }
 // Permitir pedidos mixtos: asignar cada referencia a un proveedor compatible.
 // Se prueban dos estrategias conservadoras, sin omitir los gastos fijos de cada proveedor.
 if(cfg.suppliers.length===2){
  for(const preferred of [0,1]){
   const groups=[[],[]];
   let valid=true;
   for(const item of items){
    const idx=cfg.suppliers[preferred].products[item.type]!=null?preferred:1-preferred;
    if(cfg.suppliers[idx].products[item.type]==null){valid=false;break}
    groups[idx].push(item);
   }
   if(valid){
    const cost=groups.reduce((sum,g,i)=>sum+supplierCost(cfg.suppliers[i],g),0);
    if(Number.isFinite(cost))candidates.push(cost);
   }
  }
 }
 if(!candidates.length)throw Error('Sin proveedor disponible');
 let costCents=Math.ceil(Math.min(...candidates)*100-1e-9),full=base+extras+ship;
 let minRevenue=Math.ceil(costCents/(1-margin)),maxDiscount=Math.max(0,full-minRevenue);
 let discount=Math.max(0,Math.min(round(discountable*rate/100),maxDiscount));
 return {eligibleUnits:eligible,tierPct:rate,discountPct:discountable?Math.round(discount/discountable*10000)/100:0,discountEUR:discount/100,shippingEUR:ship/100,subtotalEUR:(base+extras)/100,totalEUR:(full-discount)/100,requiresReview:full<minRevenue};
}
export default {async fetch(request,env){
 const origin=request.headers.get('Origin')||'',allowed=String(env.ALLOWED_ORIGIN||'').replace(/\/$/,'');
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin',...(origin===allowed?{'Access-Control-Allow-Origin':origin}:{})};
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
 if(request.method!=='POST'||(origin&&origin!==allowed))return new Response('No autorizado',{status:403,headers});
 try{const cfg=JSON.parse(env.FUTNEXO_COSTS_JSON||'null');if(!cfg)throw Error('Configuración no disponible');const body=await request.json();return new Response(JSON.stringify(quote(body.lines,cfg)),{headers})}catch(e){return new Response(JSON.stringify({error:'No se ha podido calcular el pedido'}),{status:422,headers})}
 }};

/* FutNexo: presupuesto orientativo. La confirmación requiere recálculo en servidor. */
(function(root){'use strict';
function cents(n){return Math.round((Number(n)+Number.EPSILON)*100)}
function quote(cart,prices,cfg){
 const units=cart.reduce((n,x)=>n+x.quantity,0);
 const eligible=cart.filter(x=>cfg.eligibleTypes.includes(x.type));
 const eligibleUnits=eligible.reduce((n,x)=>n+x.quantity,0);
 const excludedUnits=units-eligibleUnits;
 const e=eligible.reduce((n,x)=>n+cents(prices[x.type])*x.quantity,0);
 const x=cart.filter(i=>!cfg.eligibleTypes.includes(i.type)).reduce((n,i)=>n+cents(prices[i.type])*i.quantity,0);
 const a=cart.reduce((n,i)=>n+i.quantity*((i.personalized?cents(cfg.extraSaleEur.personalized):0)+(i.patch?cents(cfg.extraSaleEur.patch):0)),0);
 const max=(cfg.discountTiers.find(t=>eligibleUnits>=t.min)||{max:0}).max;
 function supplier(name){
  const s=cfg[name];let usd=0;
  for(const item of cart){
   let p=s.productsUsd[item.type];
   if(p===undefined)return null;
   if(Array.isArray(p)){
    // Conservador: no aplicar descuentos por volumen a mezclas sin confirmación.
    let tier=1;
    if(s.tierMixedOrdersConfirmed)tier=units;
    else if(cart.every(i=>i.type===item.type))tier=units;
    let idx=0;for(let j=0;j<s.volumeTiers.length;j++)if(tier>=s.volumeTiers[j])idx=j;
    p=p[idx];
   }
   usd+=p*item.quantity;
   if(item.personalized)usd+=s.extrasUsd.personalized*item.quantity;
   if(item.patch)usd+=s.extrasUsd.patch*item.quantity;
  }
  const ship=s.shippingUsdByUnits?(units>=4?s.shippingUsdByUnits['4+']:s.shippingUsdByUnits[String(units)]||0):(s.shippingUsd||0);
  usd+=ship+(s.feeUsd||0);
  return {name,costCents:cents(usd*cfg.exchangeUsdEur)+cents(cfg.fixedOrderCostEur)};
 }
 const available=['chino1','chino2'].map(supplier).filter(Boolean).sort((a,b)=>a.costCents-b.costCents);
 const chosen=available[0]||null;
 const before=e+x+a;
 let discountCents=0,review=false,reason='';
 if(!chosen){review=true;reason='Costes de proveedor no disponibles: descuento pendiente de validación.'}
 else {
  const minimumCents=Math.ceil(chosen.costCents/(1-cfg.minGrossMargin)-1e-9);
  if(before<minimumCents){review=true;reason='Precio pendiente de revisión; no se aplica descuento.'}
  else if(e>0){discountCents=Math.max(0,Math.min(Math.floor(e*max+1e-9),before-minimumCents))}
 }
 const totalCents=before-discountCents;
 return {units,eligibleUnits,excludedUnits,subtotalCents:before,extrasCents:a,discountCents,totalCents,maximumPercent:max*100,appliedPercent:e?Math.round(discountCents/e*10000)/100:0,review,reason,providerAvailable:!!chosen,shippingCustomerCents:units===1?299:0};
}
root.FutNexoDiscounts={quote};
})(typeof window!=='undefined'?window:globalThis);

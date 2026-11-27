// Same-origin quotation gateway. Pricing remains in the private service.
export async function onRequestPost({request}) {
  try {
    const body=await request.text();
    if(body.length>100000) return new Response('{"error":"Pedido demasiado grande"}',{status:413,headers:{"Content-Type":"application/json"}});
    const upstream=await fetch("https://futnexo-calculo-privado.vercel.app/api/cotizar",{method:"POST",headers:{"Content-Type":"application/json"},body});
    return new Response(upstream.body,{status:upstream.status,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
  } catch {
    return new Response('{"error":"No se ha podido cotizar"}',{status:502,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
  }
}

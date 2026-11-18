# Despliegue privado de descuentos FutNexo

1. Crear un Cloudflare Worker independiente (NO servir esta carpeta como web estática).
2. Pegar el contenido de worker.js. Configurar ALLOWED_ORIGIN con el origen exacto de la tienda.
3. Configurar FUTNEXO_COSTS_JSON como **secret cifrado** en Cloudflare; incluir fx, overheadEUR, targetMargin (0.4), suppliers y sus productos/tarifas. Nunca subir el valor a GitHub.
4. En la tienda, configurar el endpoint de este Worker. Hasta conectar el endpoint, los importes de pedido son orientativos.
5. El cliente recibe exclusivamente subtotalEUR, discountPct, discountEUR, shippingEUR y totalEUR. El Worker no devuelve costes, beneficios, proveedor ni margen.
6. El envío por FormSubmit NO valida precios ni cobra; para confirmar automáticamente el importe hace falta un flujo de pedidos con verificación del lado del servidor.
7. IMPORTANTE: retirar del sitio público index.html del simulador, calculator.js y main.js. El repositorio público y su historial contienen las tarifas antiguas: rotar/actualizar tarifas y considerar repo privado o nuevo repo limpio. Eliminar un archivo no borra el historial Git.

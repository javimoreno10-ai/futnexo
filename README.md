# FutNexo — simulador de descuentos y rentabilidad

Módulo web estático ES Modules sin dependencias. **No está integrado en el repositorio actual ni sustituye el carrito de producción.**

## Ejecutar

Extraer el ZIP en una carpeta del repositorio y servirla con un servidor HTTP (no abrir index.html mediante file://):

```bash
python -m http.server 8000
```

Abrir `http://localhost:8000/futnexo-simulador/` si la carpeta está dentro del directorio servido; si se sirve desde la propia carpeta, abrir `http://localhost:8000/`.

## Integrar en la tienda

- `calculator.js`: función pura `calculate(lines, {fx,targetMargin})`. `lines` es un objeto por ID de producto, por ejemplo `{fan:{quantity:2,price:29.99}}`.
- `main.js`: interfaz del simulador administrativo.
- `index.html`, `styles.css`: página independiente.
- Importar `calculate` en el backend de checkout o portar su lógica al backend y usarla para calcular los descuentos reales. **Nunca confiar en importes enviados por el cliente.**
- Restringir la página a administradores antes de desplegar: muestra costes, proveedores y márgenes confidenciales.
- Si se integra en Cloudflare Workers, publicar los recursos estáticos como assets y ejecutar el cálculo final de pedido en el Worker.

## Reglas

- USD a EUR: 0,9092.
- Coste interno fijo: 4 € por pedido.
- CHINO 1: coste por tramos de cantidad total del pedido + 3,50 USD por pedido.
- CHINO 2: precio fijo + envío de 4/3/2/0 USD según 1/2/3/4+ unidades.
- Descuento cliente: 0/15/20/30/35 % según 0–1/2/3–4/5–9/10+ **prendas elegibles**.
- Entrenamiento excluido del descuento y del cómputo de prendas elegibles; incluido en coste, margen y cómputo para envío gratuito.
- Envío cliente: 2,99 € si hay exactamente una prenda; gratis con 2+.
- Descuento máximo limitado por margen bruto objetivo (40 % por defecto), sobre ingresos totales incluidos los gastos de envío cobrados al cliente.
- Cuando el pedido no llega al margen objetivo incluso sin descuento, el simulador muestra advertencia.
- No incluye IVA desglosado, comisiones, parches, personalización, ni reglas de packs.
- El chándal de cremallera completa tiene precio público **provisional** de 54,99 €.
- La aplicación de tramos de CHINO 1 a prendas mixtas y entrenamiento **está pendiente de confirmación**.
- Los importes visibles se redondean a 2 decimales; la tasa de descuento se trunca a 4 decimales porcentuales como el simulador de ChatGPT.

## Prueba de referencia

2 Fan, precio 29,99 € cada una, objetivo 40 %:

- Subtotal: 59,98 €
- Descuento: 15 % (9,00 € mostrado)
- Envío cliente: 0 €
- Total: 50,98 €
- CHINO 1: 29,91 €
- CHINO 2: 21,27 €
- Proveedor: CHINO 2
- Beneficio: 29,71 €
- Margen: 58,27 % aproximadamente.

## Seguridad

Este ZIP es una **demo administrativa**. Antes de publicarlo: autenticar acceso, no exponer tarifas al navegador del cliente, conectar catálogo real, controlar IVA y gastos adicionales, y realizar pruebas de checkout.

import { mismaReferencia } from './inventoryUtils.js';

// Valida datos externos antes de incorporarlos al estado de React.
export function validarInventarioGuardado(datos) {
  if (!Array.isArray(datos)) return null;
  const ids = new Set();
  const productos = [];

  for (const dato of datos) {
    if (!dato || typeof dato !== 'object' || Array.isArray(dato) ||
        !(['string', 'number'].includes(typeof dato.id)) ||
        !String(dato.id).trim() ||
        !['nombre', 'marca', 'categoria'].every((campo) =>
          typeof dato[campo] === 'string' && dato[campo].trim().length > 0) ||
        !Number.isSafeInteger(dato.precio) || dato.precio < 0 ||
        !Number.isSafeInteger(dato.stock) || dato.stock < 0 ||
        (dato.icono !== undefined && typeof dato.icono !== 'string')) return null;

    const id = String(dato.id);
    if (ids.has(id)) return null;
    ids.add(id);

    const indice = productos.findIndex((producto) => mismaReferencia(producto, dato));
    if (indice < 0) productos.push({ ...dato, id });
    else {
      const total = productos[indice].stock + dato.stock;
      if (!Number.isSafeInteger(total)) return null;
      productos[indice] = { ...productos[indice], stock: total };
    }
  }
  return productos;
}

// Descarta reservas repetidas, inexistentes o superiores al stock total.
export function validarCarritoGuardado(datos, productos) {
  if (!Array.isArray(datos)) return [];
  const ids = new Set();
  const carrito = [];
  for (const item of datos) {
    if (!item || typeof item.id !== 'string' ||
        !Number.isSafeInteger(item.cantidad) || item.cantidad <= 0 ||
        ids.has(item.id)) continue;
    const producto = productos.find((p) => p.id === item.id);
    if (!producto || item.cantidad > producto.stock) continue;
    ids.add(item.id);
    carrito.push({ id: item.id, cantidad: item.cantidad });
  }
  return carrito;
}

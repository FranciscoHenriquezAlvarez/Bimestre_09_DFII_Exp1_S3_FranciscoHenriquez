import { mismaReferencia } from '../utils/inventoryUtils.js';

export function disponibles(estado, id) {
  const producto = estado.productos.find((p) => p.id === id);
  const reservado = estado.carrito.find((item) => item.id === id)?.cantidad ?? 0;
  return producto ? producto.stock - reservado : 0;
}

export function inventarioReducer(estado, accion) {
  switch (accion.tipo) {
    case 'AGREGAR_PRODUCTO':
      if (estado.productos.some((p) => mismaReferencia(p, accion.producto))) return estado;
      return { ...estado, productos: [...estado.productos, accion.producto] };
    case 'AUMENTAR_STOCK':
      if (!Number.isSafeInteger(accion.cantidad) || accion.cantidad <= 0) return estado;
      return { ...estado, productos: estado.productos.map((p) =>
        p.id === accion.id && Number.isSafeInteger(p.stock + accion.cantidad)
          ? { ...p, stock: p.stock + accion.cantidad } : p
      ) };
    case 'REDUCIR_STOCK':
      if (!Number.isSafeInteger(accion.cantidad) || accion.cantidad <= 0 ||
          accion.cantidad > disponibles(estado, accion.id)) return estado;
      return { ...estado, productos: estado.productos.map((p) =>
        p.id === accion.id ? { ...p, stock: p.stock - accion.cantidad } : p
      ) };
    case 'ELIMINAR_PRODUCTO':
      return { productos: estado.productos.filter((p) => p.id !== accion.id),
        carrito: estado.carrito.filter((item) => item.id !== accion.id) };
    case 'AGREGAR_AL_CARRITO': {
      const cantidad = accion.cantidad;
      if (!Number.isSafeInteger(cantidad) || cantidad <= 0 ||
          cantidad > disponibles(estado, accion.id)) return estado;
      const existente = estado.carrito.find((item) => item.id === accion.id);
      if (existente && !Number.isSafeInteger(existente.cantidad + cantidad)) return estado;
      return { ...estado, carrito: existente
        ? estado.carrito.map((item) => item.id === accion.id
          ? { ...item, cantidad: item.cantidad + cantidad } : item)
        : [...estado.carrito, { id: accion.id, cantidad }] };
    }
    case 'DISMINUIR_CARRITO': {
      const item = estado.carrito.find((p) => p.id === accion.id);
      if (!item) return estado;
      return { ...estado, carrito: item.cantidad === 1
        ? estado.carrito.filter((p) => p.id !== accion.id)
        : estado.carrito.map((p) => p.id === accion.id
          ? { ...p, cantidad: p.cantidad - 1 } : p) };
    }
    case 'ELIMINAR_DEL_CARRITO':
      return { ...estado, carrito: estado.carrito.filter((item) => item.id !== accion.id) };
    case 'VACIAR_CARRITO':
      return { ...estado, carrito: [] };
    default:
      return estado;
  }
}

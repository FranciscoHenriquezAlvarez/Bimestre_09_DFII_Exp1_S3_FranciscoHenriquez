import { useEffect, useReducer } from 'react';
import { InventoryContext } from './InventoryContext';
import { mismaReferencia } from '../utils/inventoryUtils';
import { inventarioReducer, disponibles } from './inventarioReducer.js';

const productosIniciales = [
  { id: '1', nombre: 'Arroz 1 kg', marca: 'Tucapel', categoria: 'Abarrotes', precio: 1590, stock: 35, icono: '🍚' },
  { id: '2', nombre: 'Leche 1 L', marca: 'Colun', categoria: 'Lácteos', precio: 1290, stock: 48, icono: '🥛' },
  { id: '3', nombre: 'Aceite 900 ml', marca: 'Chef', categoria: 'Abarrotes', precio: 2490, stock: 22, icono: '🫒' },
  { id: '4', nombre: 'Manzanas 1 kg', marca: 'Sin marca', categoria: 'Frutas', precio: 1990, stock: 30, icono: '🍎' },
  { id: '5', nombre: 'Detergente 1 L', marca: 'Omo', categoria: 'Limpieza', precio: 3490, stock: 15, icono: '🧴' },
  { id: '6', nombre: 'Pan de molde', marca: 'Ideal', categoria: 'Panadería', precio: 2290, stock: 20, icono: '🍞' }
];

const CLAVE_INVENTARIO = 'superahorro-inventario-semana02';
const CLAVE_CARRITO_ANTERIOR = 'superahorro-carrito-semana03';
const CLAVE_CARRITO_SESION = 'superahorro-carrito-sesion-semana03';

function consolidarDuplicados(lista) {
  const resultado = [];
  for (const producto of lista) {
    const indice = resultado.findIndex((actual) => mismaReferencia(actual, producto));
    if (indice === -1) resultado.push({ ...producto, id: String(producto.id) });
    else {
      const total = resultado[indice].stock + producto.stock;
      if (!Number.isSafeInteger(total)) return null;
      resultado[indice] = { ...resultado[indice], stock: total };
    }
  }
  return resultado;
}

function carritoValido(datos, productos) {
  if (!Array.isArray(datos)) return [];
  const ids = new Set();
  return datos.filter((item) => {
    if (!item || typeof item.id !== 'string' ||
        !Number.isSafeInteger(item.cantidad) || item.cantidad <= 0 ||
        ids.has(item.id) || !productos.some((p) => p.id === item.id)) return false;
    ids.add(item.id);
    return true;
  }).map(({ id, cantidad }) => ({ id, cantidad }));
}

function cargarEstadoInicial() {
  let productos = productosIniciales;
  let carrito = [];
  try {
    const guardados = localStorage.getItem(CLAVE_INVENTARIO);
    if (guardados) {
      const datos = JSON.parse(guardados);
      if (Array.isArray(datos) && datos.every((p) =>
        p && (typeof p.id === 'string' || typeof p.id === 'number') &&
        typeof p.nombre === 'string' && typeof p.marca === 'string' &&
        typeof p.categoria === 'string' && Number.isFinite(p.precio) && p.precio >= 0 &&
        Number.isSafeInteger(p.stock) && p.stock >= 0
      )) productos = consolidarDuplicados(datos) ?? productosIniciales;
    }

    // Migración única: la etapa anterior descontaba reservas del inventario persistente.
    const anterior = localStorage.getItem(CLAVE_CARRITO_ANTERIOR);
    if (anterior !== null) {
      const reservas = carritoValido(JSON.parse(anterior), productos);
      productos = productos.map((p) => {
        const reservado = reservas.find((item) => item.id === p.id)?.cantidad ?? 0;
        const total = p.stock + reservado;
        return Number.isSafeInteger(total) ? { ...p, stock: total } : p;
      });
      localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(productos));
      localStorage.removeItem(CLAVE_CARRITO_ANTERIOR);
    }
    const sesion = sessionStorage.getItem(CLAVE_CARRITO_SESION);
    if (sesion) {
      const reservas = carritoValido(JSON.parse(sesion), productos);
      carrito = reservas.filter((item) =>
        item.cantidad <= productos.find((p) => p.id === item.id).stock
      );
    }
  } catch (error) {
    console.warn('No se pudieron recuperar todos los datos guardados:', error);
  }
  return { productos, carrito };
}


export default function InventoryProvider({ children }) {
  const [estado, dispatch] = useReducer(inventarioReducer, undefined, cargarEstadoInicial);
  const { carrito } = estado;
  // Los productos expuestos muestran stock DISPONIBLE, no el total persistido.
  const productos = estado.productos.map((p) => ({ ...p, stock: disponibles(estado, p.id) }));

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(estado.productos));
      sessionStorage.setItem(CLAVE_CARRITO_SESION, JSON.stringify(carrito));
    } catch (error) {
      console.warn('No se pudieron guardar los datos localmente:', error);
    }
  }, [estado.productos, carrito]);

  function agregarAlCarrito(id, cantidad) {
    if (!Number.isSafeInteger(cantidad) || cantidad <= 0 || cantidad > disponibles(estado, id)) return false;
    const actual = carrito.find((p) => p.id === id)?.cantidad ?? 0;
    if (!Number.isSafeInteger(actual + cantidad)) return false;
    dispatch({ tipo: 'AGREGAR_AL_CARRITO', id, cantidad });
    return true;
  }

  return (
    <InventoryContext.Provider value={{
      productos, carrito,
      agregarProducto: (producto) => dispatch({ tipo: 'AGREGAR_PRODUCTO', producto: { ...producto, id: crypto.randomUUID() } }),
      aumentarStock: (id, cantidad) => dispatch({ tipo: 'AUMENTAR_STOCK', id, cantidad }),
      reducirStock: (id, cantidad) => dispatch({ tipo: 'REDUCIR_STOCK', id, cantidad }),
      eliminarProducto: (id) => dispatch({ tipo: 'ELIMINAR_PRODUCTO', id }),
      agregarAlCarrito,
      disminuirDelCarrito: (id) => dispatch({ tipo: 'DISMINUIR_CARRITO', id }),
      eliminarDelCarrito: (id) => dispatch({ tipo: 'ELIMINAR_DEL_CARRITO', id }),
      vaciarCarrito: () => dispatch({ tipo: 'VACIAR_CARRITO' })
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

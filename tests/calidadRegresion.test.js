import test from 'node:test';
import assert from 'node:assert/strict';
import { inventarioReducer, disponibles } from '../src/context/inventarioReducer.js';
import { validarInventarioGuardado, validarCarritoGuardado } from '../src/utils/storageValidation.js';

const producto = (id, stock = 6) => ({ id, nombre: `Producto ${id}`, marca: 'Marca', categoria: 'Abarrotes', precio: 1200, stock });
const estadoInicial = () => ({ productos: [producto('a'), producto('b', 3)], carrito: [] });
const aplicar = (estado, tipo, datos = {}) => inventarioReducer(estado, { tipo, ...datos });

test('el reducer no modifica el estado original al reservar y liberar unidades', () => {
  const original = estadoInicial();
  const copia = structuredClone(original);
  const reservado = aplicar(original, 'AGREGAR_AL_CARRITO', { id: 'a', cantidad: 2 });
  const liberado = aplicar(reservado, 'DISMINUIR_CARRITO', { id: 'a' });
  assert.deepEqual(original, copia);
  assert.deepEqual(reservado.carrito, [{ id: 'a', cantidad: 2 }]);
  assert.deepEqual(liberado.carrito, [{ id: 'a', cantidad: 1 }]);
});

test('reservar el último producto disponible deja stock disponible cero', () => {
  const reservado = aplicar(estadoInicial(), 'AGREGAR_AL_CARRITO', { id: 'b', cantidad: 3 });
  assert.equal(disponibles(reservado, 'b'), 0);
  assert.strictEqual(aplicar(reservado, 'AGREGAR_AL_CARRITO', { id: 'b', cantidad: 1 }), reservado);
});

test('un producto inexistente no tiene existencias disponibles', () => {
  assert.equal(disponibles(estadoInicial(), 'inexistente'), 0);
});

test('aumentar stock conserva reservas existentes', () => {
  const reservado = aplicar(estadoInicial(), 'AGREGAR_AL_CARRITO', { id: 'a', cantidad: 2 });
  const aumentado = aplicar(reservado, 'AUMENTAR_STOCK', { id: 'a', cantidad: 4 });
  assert.equal(aumentado.productos[0].stock, 10);
  assert.deepEqual(aumentado.carrito, [{ id: 'a', cantidad: 2 }]);
  assert.equal(disponibles(aumentado, 'a'), 8);
});

test('rechaza aumentos de stock con cantidades inválidas', () => {
  const estado = estadoInicial();
  for (const cantidad of [0, -2, 1.5, '3', NaN, Infinity]) {
    assert.strictEqual(aplicar(estado, 'AUMENTAR_STOCK', { id: 'a', cantidad }), estado);
  }
});

test('no permite superar el límite de enteros seguros al aumentar stock', () => {
  const estado = { productos: [producto('a', Number.MAX_SAFE_INTEGER)], carrito: [] };
  const siguiente = aplicar(estado, 'AUMENTAR_STOCK', { id: 'a', cantidad: 1 });
  assert.equal(siguiente.productos[0].stock, Number.MAX_SAFE_INTEGER);
});

test('rechaza reducción de stock cuando la cantidad no es válida', () => {
  const estado = estadoInicial();
  for (const cantidad of [0, -1, 1.5, '1', NaN]) {
    assert.strictEqual(aplicar(estado, 'REDUCIR_STOCK', { id: 'a', cantidad }), estado);
  }
});

test('el carrito puede vaciarse y volver a reservar productos', () => {
  const reservado = aplicar(estadoInicial(), 'AGREGAR_AL_CARRITO', { id: 'a', cantidad: 6 });
  const vacio = aplicar(reservado, 'VACIAR_CARRITO');
  assert.equal(disponibles(vacio, 'a'), 6);
  const nuevo = aplicar(vacio, 'AGREGAR_AL_CARRITO', { id: 'a', cantidad: 1 });
  assert.deepEqual(nuevo.carrito, [{ id: 'a', cantidad: 1 }]);
});

test('inventario guardado rechaza formatos inválidos', () => {
  for (const dato of [null, {}, 'texto', 4, [null], [{ ...producto('a'), precio: -1 }], [{ ...producto('a'), stock: 1.5 }]]) {
    assert.equal(validarInventarioGuardado(dato), null);
  }
});

test('inventario guardado admite lista vacía como inventario válido', () => {
  assert.deepEqual(validarInventarioGuardado([]), []);
});

test('inventario guardado detecta identificadores repetidos entre número y texto', () => {
  const primero = { ...producto('a'), id: 1 };
  const segundo = { ...producto('b'), id: '1' };
  assert.equal(validarInventarioGuardado([primero, segundo]), null);
});

test('carrito recuperado descarta productos inexistentes y cantidades no enteras', () => {
  const productos = [producto('a', 5)];
  const carrito = [{ id: 'x', cantidad: 1 }, { id: 'a', cantidad: 1.5 }, { id: 'a', cantidad: 3 }];
  assert.deepEqual(validarCarritoGuardado(carrito, productos), [{ id: 'a', cantidad: 3 }]);
});

test('carrito recuperado descarta cantidades mayores al stock y mantiene reservas válidas', () => {
  const productos = [producto('a', 5), producto('b', 2)];
  const carrito = [{ id: 'a', cantidad: 6 }, { id: 'b', cantidad: 2 }];
  assert.deepEqual(validarCarritoGuardado(carrito, productos), [{ id: 'b', cantidad: 2 }]);
});

test('carrito recuperado no permite duplicar reservas del mismo identificador', () => {
  const productos = [producto('a', 5)];
  const carrito = [{ id: 'a', cantidad: 2 }, { id: 'a', cantidad: 3 }];
  assert.deepEqual(validarCarritoGuardado(carrito, productos), [{ id: 'a', cantidad: 2 }]);
});

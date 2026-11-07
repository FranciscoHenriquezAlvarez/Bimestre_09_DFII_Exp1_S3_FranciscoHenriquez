import test from 'node:test';
import assert from 'node:assert/strict';
import { inventarioReducer, disponibles } from '../src/context/inventarioReducer.js';

const arroz = { id: '1', nombre: 'Arroz 1 kg', marca: 'Tucapel', categoria: 'Abarrotes', precio: 1590, stock: 10 };
const leche = { id: '2', nombre: 'Leche 1 L', marca: 'Colun', categoria: 'Lácteos', precio: 1290, stock: 8 };
const inicial = () => ({ productos: [{ ...arroz }, { ...leche }], carrito: [] });
const aplicar = (estado, tipo, datos = {}) => inventarioReducer(estado, { tipo, ...datos });

test('agregar al carrito reserva unidades sin alterar el stock total', () => {
  const estado = aplicar(inicial(), 'AGREGAR_AL_CARRITO', { id: '1', cantidad: 3 });
  assert.deepEqual(estado.carrito, [{ id: '1', cantidad: 3 }]);
  assert.equal(estado.productos[0].stock, 10);
  assert.equal(disponibles(estado, '1'), 7);
});

test('aumentar cantidad reserva unidades adicionales', () => {
  const uno = aplicar(inicial(), 'AGREGAR_AL_CARRITO', { id: '1', cantidad: 3 });
  const dos = aplicar(uno, 'AGREGAR_AL_CARRITO', { id: '1', cantidad: 2 });
  assert.deepEqual(dos.carrito, [{ id: '1', cantidad: 5 }]);
  assert.equal(disponibles(dos, '1'), 5);
});

test('disminuir cantidad libera una unidad y elimina ítem al llegar a cero', () => {
  const uno = aplicar(inicial(), 'AGREGAR_AL_CARRITO', { id: '1', cantidad: 2 });
  const dos = aplicar(uno, 'DISMINUIR_CARRITO', { id: '1' });
  assert.equal(disponibles(dos, '1'), 9);
  const tres = aplicar(dos, 'DISMINUIR_CARRITO', { id: '1' });
  assert.deepEqual(tres.carrito, []);
  assert.equal(disponibles(tres, '1'), 10);
});

test('eliminar del carrito libera todas las unidades', () => {
  const uno = aplicar(inicial(), 'AGREGAR_AL_CARRITO', { id: '1', cantidad: 4 });
  const dos = aplicar(uno, 'ELIMINAR_DEL_CARRITO', { id: '1' });
  assert.deepEqual(dos.carrito, []);
  assert.equal(disponibles(dos, '1'), 10);
});

test('vaciar carrito libera reservas de varios productos', () => {
  let estado = aplicar(inicial(), 'AGREGAR_AL_CARRITO', { id: '1', cantidad: 4 });
  estado = aplicar(estado, 'AGREGAR_AL_CARRITO', { id: '2', cantidad: 3 });
  estado = aplicar(estado, 'VACIAR_CARRITO');
  assert.deepEqual(estado.carrito, []);
  assert.equal(disponibles(estado, '1'), 10);
  assert.equal(disponibles(estado, '2'), 8);
});

test('rechaza reservas superiores al stock o para productos inexistentes', () => {
  const estado = inicial();
  assert.strictEqual(aplicar(estado, 'AGREGAR_AL_CARRITO', { id: '1', cantidad: 11 }), estado);
  assert.strictEqual(aplicar(estado, 'AGREGAR_AL_CARRITO', { id: '99', cantidad: 1 }), estado);
  const reservado = aplicar(estado, 'AGREGAR_AL_CARRITO', { id: '1', cantidad: 9 });
  assert.strictEqual(aplicar(reservado, 'AGREGAR_AL_CARRITO', { id: '1', cantidad: 2 }), reservado);
});

test('rechaza cantidades inválidas', () => {
  const estado = inicial();
  for (const cantidad of [-1, 0, 1.5, NaN, Infinity, '2']) {
    assert.strictEqual(aplicar(estado, 'AGREGAR_AL_CARRITO', { id: '1', cantidad }), estado);
  }
});

test('reducir stock no puede consumir unidades reservadas', () => {
  const reservado = aplicar(inicial(), 'AGREGAR_AL_CARRITO', { id: '1', cantidad: 8 });
  assert.strictEqual(aplicar(reservado, 'REDUCIR_STOCK', { id: '1', cantidad: 3 }), reservado);
  const reducido = aplicar(reservado, 'REDUCIR_STOCK', { id: '1', cantidad: 2 });
  assert.equal(disponibles(reducido, '1'), 0);
  assert.equal(reducido.productos[0].stock, 8);
});

test('eliminar producto del inventario también lo retira del carrito', () => {
  const reservado = aplicar(inicial(), 'AGREGAR_AL_CARRITO', { id: '1', cantidad: 3 });
  const eliminado = aplicar(reservado, 'ELIMINAR_PRODUCTO', { id: '1' });
  assert.deepEqual(eliminado.productos.map((p) => p.id), ['2']);
  assert.deepEqual(eliminado.carrito, []);
});

test('evita agregar referencias duplicadas al inventario', () => {
  const estado = inicial();
  const repetido = { ...arroz, id: '3', nombre: ' ARROZ 1kg ', marca: 'TUCAPEL' };
  assert.strictEqual(aplicar(estado, 'AGREGAR_PRODUCTO', { producto: repetido }), estado);
});

test('acciones desconocidas no modifican el estado', () => {
  const estado = inicial();
  assert.strictEqual(aplicar(estado, 'DESCONOCIDA'), estado);
});

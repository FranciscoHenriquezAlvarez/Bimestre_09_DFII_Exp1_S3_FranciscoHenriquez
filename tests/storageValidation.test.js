import test from 'node:test';
import assert from 'node:assert/strict';
import { validarInventarioGuardado, validarCarritoGuardado } from '../src/utils/storageValidation.js';

const producto = { id: '1', nombre: 'Arroz', marca: 'Marca', categoria: 'Abarrotes', precio: 1000, stock: 5 };

test('acepta inventario válido y convierte identificadores numéricos antiguos', () => {
  assert.deepEqual(validarInventarioGuardado([{ ...producto, id: 1 }]), [producto]);
});
test('rechaza identificadores duplicados y campos vacíos', () => {
  assert.equal(validarInventarioGuardado([producto, { ...producto }]), null);
  assert.equal(validarInventarioGuardado([{ ...producto, nombre: '  ' }]), null);
});
test('consolida referencias iguales con identificadores distintos', () => {
  assert.deepEqual(validarInventarioGuardado([producto, { ...producto, id: '2', stock: 3 }]), [{ ...producto, stock: 8 }]);
});
test('rechaza totales fuera del rango de enteros seguros', () => {
  assert.equal(validarInventarioGuardado([producto, { ...producto, id: '2', stock: Number.MAX_SAFE_INTEGER }]), null);
});
test('elimina reservas inválidas, duplicadas y superiores al stock', () => {
  assert.deepEqual(validarCarritoGuardado([
    { id: '1', cantidad: 2 }, { id: '1', cantidad: 1 },
    { id: '2', cantidad: 1 }, { id: '1', cantidad: 8 }
  ], [producto]), [{ id: '1', cantidad: 2 }]);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizarTexto, mismaReferencia } from '../src/utils/inventoryUtils.js';

test('normalizarTexto elimina diferencias de tildes, mayúsculas y espacios', () => {
  assert.equal(normalizarTexto('  CAFÉ   MOLIDO  1 kg  '), 'cafe molido 1kg');
  assert.equal(normalizarTexto('Leche 900 ml'), 'leche 900ml');
});

test('mismaReferencia compara nombre y marca normalizados', () => {
  assert.equal(mismaReferencia(
    { nombre: 'Arroz 1 kg', marca: 'Tucapel' },
    { nombre: ' ARROZ 1kg ', marca: 'TUCAPEL' }
  ), true);
  assert.equal(mismaReferencia(
    { nombre: 'Arroz 1 kg', marca: 'Tucapel' },
    { nombre: 'Arroz 1 kg', marca: 'Otra marca' }
  ), false);
});

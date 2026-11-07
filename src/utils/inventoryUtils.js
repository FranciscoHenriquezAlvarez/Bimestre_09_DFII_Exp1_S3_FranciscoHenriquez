// Ignora mayúsculas, tildes, espacios repetidos y espacios antes de unidades.
export function normalizarTexto(texto) {
  return String(texto ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es').trim().replace(/\s+/g, ' ')
    .replace(/(\d)\s+(kg|g|ml|l)\b/g, '$1$2');
}

export function mismaReferencia(a, b) {
  return normalizarTexto(a.nombre) === normalizarTexto(b.nombre) &&
    normalizarTexto(a.marca) === normalizarTexto(b.marca);
}


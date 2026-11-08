import { useState } from 'react';
import { Link } from 'react-router';

function InventoryTable({ productos, alReducir, alEliminar }) {
  const [cantidades, setCantidades] = useState({});
  const [errores, setErrores] = useState({});

  function actualizarCantidad(id, valor) {
    setCantidades((actuales) => ({ ...actuales, [id]: valor }));
    setErrores((actuales) => ({ ...actuales, [id]: '' }));
  }

  function descontar(producto) {
    const valor = cantidades[producto.id] ?? '';
    const cantidad = Number(valor);
    if (valor.trim() === '' || !Number.isSafeInteger(cantidad) || cantidad <= 0) {
      setErrores((actuales) => ({ ...actuales, [producto.id]: 'Ingresa una cantidad entera mayor que cero.' }));
      return;
    }
    if (cantidad > producto.stock) {
      setErrores((actuales) => ({ ...actuales, [producto.id]: 'La cantidad supera el stock disponible.' }));
      return;
    }
    if (alReducir(producto.id, cantidad)) {
      setCantidades((actuales) => ({ ...actuales, [producto.id]: '' }));
      setErrores((actuales) => ({ ...actuales, [producto.id]: '' }));
    } else {
      setErrores((actuales) => ({ ...actuales, [producto.id]: 'No se pudo reducir el stock. Revisa las existencias disponibles.' }));
    }
  }

  if (productos.length === 0) {
    return <p role="status" className="rounded-xl border border-gray-200 bg-white p-5">Todavía no hay productos registrados en el inventario.</p>;
  }

  return (
    <>
      <p className="mb-2 text-sm text-gray-600 sm:hidden">Desliza la tabla horizontalmente para ver todas las columnas →</p>
    <div className="tabla-contenedor" role="region" aria-label="Tabla de inventario, desplazamiento horizontal" tabIndex={0}>
      <table className="tabla-inventario min-w-[850px] text-sm sm:text-base">
        <caption className="tabla-caption">Listado actualizado de artículos disponibles</caption>
        <thead>
          <tr>
            <th scope="col">Producto</th><th scope="col">Marca</th><th scope="col">Tipo</th>
            <th scope="col">Precio</th><th scope="col">Stock</th><th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td><Link to={`/producto/${producto.id}`} className="font-semibold text-green-800 underline underline-offset-2 hover:text-green-950">{producto.nombre}</Link></td>
              <td>{producto.marca}</td>
              <td>{producto.categoria}</td>
              <td>${producto.precio.toLocaleString('es-CL')}</td>
              <td>{producto.stock}</td>
              <td>
                <div className="flex min-w-48 flex-col gap-2">
                  <label htmlFor={`descuento-${producto.id}`} className="text-sm font-semibold">Unidades a descontar de {producto.nombre}</label>
                  <input
                    id={`descuento-${producto.id}`}
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max={producto.stock}
                    step="1"
                    value={cantidades[producto.id] ?? ''}
                    onChange={(evento) => actualizarCantidad(producto.id, evento.target.value)}
                    aria-invalid={Boolean(errores[producto.id])}
                    aria-describedby={errores[producto.id] ? `error-${producto.id}` : undefined}
                    className="w-full rounded-md border border-gray-400 bg-white p-2 text-gray-900 focus-visible:outline-2 focus-visible:outline-green-700"
                  />
                  {errores[producto.id] && <span id={`error-${producto.id}`} role="alert" className="text-sm text-red-700">{errores[producto.id]}</span>}
                  <button type="button" disabled={producto.stock === 0} onClick={() => descontar(producto)} aria-label={`Reducir stock de ${producto.nombre}`} className="rounded-md bg-amber-600 px-3 py-2 font-semibold text-white hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:cursor-not-allowed disabled:opacity-50">Reducir stock</button>
                  <button type="button" onClick={() => alEliminar(producto.id)} aria-label={`Eliminar ${producto.nombre} del inventario`} className="rounded-md bg-red-700 px-3 py-2 font-semibold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700">Eliminar producto</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}

export default InventoryTable;

import { useContext, useState } from 'react';
import { Link, useParams } from 'react-router';
import { InventoryContext } from '../context/InventoryContext';

function DetalleProducto() {
  const { id } = useParams();
  const inventario = useContext(InventoryContext);
  const [cantidad, setCantidad] = useState('1');
  const [mensaje, setMensaje] = useState('');

  if (!inventario) {
    throw new Error('DetalleProducto debe estar dentro de InventoryProvider');
  }

  const producto = inventario.productos.find((articulo) => articulo.id === id);

  if (!producto) {
    return (
      <section className="gestion-pagina mx-auto w-full max-w-3xl">
        <h1>Producto no encontrado</h1>
        <p>El artículo solicitado no existe o fue eliminado del inventario.</p>
        <Link to="/inventario" className="inline-block rounded-lg bg-green-800 px-4 py-2 font-semibold text-white hover:bg-green-900">
          Volver al inventario
        </Link>
      </section>
    );
  }

  function manejarAgregar(evento) {
    evento.preventDefault();
    const unidades = Number(cantidad);
    if (!Number.isSafeInteger(unidades) || unidades <= 0 || unidades > producto.stock) {
      setMensaje('Ingresa una cantidad entera entre 1 y el stock disponible.');
      return;
    }
    if (inventario.agregarAlCarrito(producto.id, unidades)) {
      setMensaje(`Se agregaron ${unidades} unidades de ${producto.nombre} al carrito.`);
      setCantidad('1');
    }
  }

  return (
    <section className="gestion-pagina mx-auto w-full max-w-3xl">
      <h1>Detalle del producto</h1>
      <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-4 text-center text-6xl" aria-hidden="true">{producto.icono || '🛒'}</div>
        <h2 className="mb-5 text-center text-2xl font-bold text-green-800">{producto.nombre}</h2>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4 text-left"><dt className="mb-1 font-semibold text-gray-700">Marca</dt><dd className="m-0 text-left text-gray-900">{producto.marca}</dd></div>
          <div className="rounded-lg bg-gray-50 p-4 text-left"><dt className="mb-1 font-semibold text-gray-700">Categoría</dt><dd className="m-0 text-left text-gray-900">{producto.categoria}</dd></div>
          <div className="rounded-lg bg-gray-50 p-4 text-left"><dt className="mb-1 font-semibold text-gray-700">Precio unitario</dt><dd className="m-0 text-left text-gray-900">${producto.precio.toLocaleString('es-CL')}</dd></div>
          <div className="rounded-lg bg-gray-50 p-4 text-left"><dt className="mb-1 font-semibold text-gray-700">Stock disponible</dt><dd className="m-0 text-left text-gray-900">{producto.stock} unidades</dd></div>
        </dl>
        <form onSubmit={manejarAgregar} className="mt-6 flex flex-col gap-4 rounded-lg border border-green-100 bg-green-50 p-4 sm:flex-row sm:items-end sm:p-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="cantidad-carrito" className="font-semibold text-gray-800">Unidades para agregar</label>
            <input
              id="cantidad-carrito"
              type="number"
              min="1"
              max={producto.stock}
              step="1"
              required
              value={cantidad}
              onChange={(evento) => { setCantidad(evento.target.value); setMensaje(''); }}
              className="w-full rounded-md border border-gray-400 bg-white px-3 py-3 sm:w-36"
              disabled={producto.stock === 0}
            />
          </div>
          <button type="submit" disabled={producto.stock === 0} className="rounded-lg bg-green-800 px-5 py-3 font-semibold text-white hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50">
            Agregar al carrito
          </button>
        </form>
        {producto.stock === 0 && <p role="status" className="mt-3 text-amber-800">Producto sin stock disponible.</p>}
        {mensaje && <p role="status" aria-live="polite" className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-green-900">{mensaje}</p>}
        <nav aria-label="Acciones del producto" className="mt-6 flex flex-col items-stretch gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center">
          <Link to="/carrito" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-green-800 px-5 py-3 text-center font-semibold text-green-800 no-underline hover:bg-green-50">
            Ver carrito de compras
          </Link>
          <Link to="/inventario" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-green-800 px-5 py-3 text-center font-semibold text-white no-underline hover:bg-green-900">
            Volver al inventario
          </Link>
        </nav>
      </article>
    </section>
  );
}

export default DetalleProducto;

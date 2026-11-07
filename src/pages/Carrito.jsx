import { useContext, useState } from 'react';
import { Link } from 'react-router';
import { InventoryContext } from '../context/InventoryContext';

function Carrito() {
  const inventario = useContext(InventoryContext);
  const [mensaje, setMensaje] = useState('');
  if (!inventario) throw new Error('Carrito debe estar dentro de InventoryProvider');

  const articulos = inventario.carrito.map((item) => ({
    ...item,
    producto: inventario.productos.find((producto) => producto.id === item.id)
  })).filter((item) => item.producto);
  const unidades = articulos.reduce((total, item) => total + item.cantidad, 0);
  const total = articulos.reduce((suma, item) => suma + item.cantidad * item.producto.precio, 0);

  function aumentar(item) {
    if (inventario.agregarAlCarrito(item.id, 1)) setMensaje(`Se agregó una unidad de ${item.producto.nombre}.`);
    else setMensaje(`No hay más existencias disponibles de ${item.producto.nombre}.`);
  }

  function disminuir(item) {
    inventario.disminuirDelCarrito(item.id);
    setMensaje(`Se devolvió una unidad de ${item.producto.nombre} al inventario.`);
  }

  function eliminar(item) {
    if (!window.confirm(`¿Quitar ${item.producto.nombre} del carrito y liberar sus ${item.cantidad} unidades?`)) return;
    inventario.eliminarDelCarrito(item.id);
    setMensaje(`Se quitó ${item.producto.nombre} del carrito.`);
  }

  function vaciar() {
    if (!window.confirm('¿Vaciar el carrito y liberar todas las unidades reservadas?')) return;
    inventario.vaciarCarrito();
    setMensaje('Se vació el carrito y se liberaron todas las unidades.');
  }

  return (
    <section className="gestion-pagina mx-auto w-full max-w-5xl">
      <h1>Carrito de compras</h1>
      <p>Modifica tus cantidades. Las unidades reservadas se liberan al quitarlas del carrito o terminar la sesión de la pestaña.</p>
      {mensaje && <p role="status" aria-live="polite" className="my-4 rounded-lg border border-green-200 bg-green-50 p-3 text-green-900">{mensaje}</p>}
      {articulos.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p role="status">Tu carrito está vacío.</p>
          <Link to="/inventario" className="font-semibold text-green-800 underline">Ver inventario</Link>
        </div>
      ) : (
        <>
          <p className="mb-2 text-sm text-gray-600 sm:hidden">Desliza la tabla horizontalmente para ver todas las columnas →</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <caption className="p-4 text-left font-semibold">Artículos agregados al carrito</caption>
              <thead className="bg-green-50">
                <tr>
                  <th scope="col" className="p-3">Producto</th>
                  <th scope="col" className="p-3">Cantidad</th>
                  <th scope="col" className="p-3">Precio unitario</th>
                  <th scope="col" className="p-3">Subtotal</th>
                  <th scope="col" className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {articulos.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200">
                    <td className="p-3"><Link className="font-semibold text-green-800 underline" to={`/producto/${item.id}`}>{item.producto.nombre}</Link></td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => disminuir(item)} aria-label={`Disminuir cantidad de ${item.producto.nombre}`} className="rounded border border-gray-300 bg-white px-3 py-2 font-bold">−</button>
                        <span className="min-w-6 text-center">{item.cantidad}</span>
                        <button type="button" onClick={() => aumentar(item)} disabled={item.producto.stock === 0} aria-label={`Aumentar cantidad de ${item.producto.nombre}`} className="rounded border border-gray-300 bg-white px-3 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-40">+</button>
                      </div>
                    </td>
                    <td className="p-3">${item.producto.precio.toLocaleString('es-CL')}</td>
                    <td className="p-3">${(item.cantidad * item.producto.precio).toLocaleString('es-CL')}</td>
                    <td className="p-3"><button type="button" onClick={() => eliminar(item)} className="rounded-lg border border-red-700 px-3 py-2 font-semibold text-red-800 hover:bg-red-50">Eliminar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-lg font-semibold">{unidades} unidades · Total: ${total.toLocaleString('es-CL')}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link to="/inventario" className="inline-flex items-center justify-center rounded-lg bg-green-800 px-4 py-3 font-semibold text-white no-underline hover:bg-green-900">Seguir explorando productos</Link>
            <button type="button" onClick={vaciar} className="rounded-lg border border-red-700 bg-white px-4 py-3 font-semibold text-red-800 hover:bg-red-50">Vaciar carrito</button>
          </div>
        </>
      )}
    </section>
  );
}

export default Carrito;

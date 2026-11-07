import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { InventoryContext } from '../context/InventoryContext';
import InventoryTable from '../components/InventoryTable';

function Inventario() {
  const inventario = useContext(InventoryContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  const [mensaje, setMensaje] = useState(() =>
    typeof location.state?.mensajeExito === 'string'
      ? location.state.mensajeExito
      : ''
  );

  // Consumir el aviso para que no reaparezca al volver al inventario.
  useEffect(() => {
    if (typeof location.state?.mensajeExito === 'string') {
      navigate(
        `${location.pathname}${location.search}${location.hash}`,
        { replace: true, state: null }
      );
    }
  }, [
    location.pathname,
    location.search,
    location.hash,
    location.state,
    navigate
  ]);

  if (!inventario) {
    throw new Error('Inventario debe estar dentro de InventoryProvider');
  }

  const { productos, reducirStock, eliminarProducto } = inventario;

  // Obtener categorías sin modificar los productos originales.
  const categorias = [
    ...new Set(productos.map((producto) => producto.categoria))
  ].sort((a, b) => a.localeCompare(b, 'es'));

  // Mostrar únicamente los productos de la categoría seleccionada.
  const productosFiltrados = categoriaSeleccionada === 'Todas'
    ? productos
    : productos.filter(
        (producto) => producto.categoria === categoriaSeleccionada
      );

  function manejarReduccion(id, cantidad) {
    const producto = productos.find((p) => p.id === id);

    if (
      !producto ||
      !Number.isSafeInteger(cantidad) ||
      cantidad <= 0 ||
      cantidad > producto.stock
    ) {
      return false;
    }

    reducirStock(id, cantidad);
    setMensaje(`Se descontaron ${cantidad} unidades de ${producto.nombre}.`);

    return true;
  }

  function manejarEliminacion(id) {
    const producto = productos.find((p) => p.id === id);

    if (!producto) return;

    if (
      !window.confirm(
        `¿Eliminar definitivamente ${producto.nombre} (${producto.marca}) del inventario?`
      )
    ) {
      return;
    }

    eliminarProducto(id);
    setMensaje(`Se eliminó ${producto.nombre} del inventario.`);
  }

  return (
    <section className="gestion-pagina mx-auto w-full max-w-5xl">
      <h1>Inventario de productos</h1>

      <p>
        Consulta los {productos.length} artículos registrados en SuperAhorro.
      </p>

      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label
          htmlFor="filtro-categoria"
          className="font-semibold text-gray-800"
        >
          Filtrar por categoría:
        </label>

        <select
          id="filtro-categoria"
          value={categoriaSeleccionada}
          onChange={(evento) =>
            setCategoriaSeleccionada(evento.target.value)
          }
          className="w-full rounded-lg border border-gray-400 bg-white px-3 py-2 text-gray-900 focus-visible:outline-2 focus-visible:outline-green-700 sm:w-64"
        >
          <option value="Todas">Todas las categorías</option>

          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </div>

      <p role="status" className="mb-4 text-sm text-gray-700">
        Mostrando {productosFiltrados.length} de {productos.length} productos.
      </p>

      {mensaje && (
        <p
          role="status"
          aria-live="polite"
          className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-green-900"
        >
          {mensaje}
        </p>
      )}

      {productosFiltrados.length === 0 && productos.length > 0 ? (
        <p
          role="status"
          className="rounded-xl border border-gray-200 bg-white p-5"
        >
          No hay productos disponibles en la categoría seleccionada.
        </p>
      ) : (
        <InventoryTable
          productos={productosFiltrados}
          alReducir={manejarReduccion}
          alEliminar={manejarEliminacion}
        />
      )}
    </section>
  );
}

export default Inventario;
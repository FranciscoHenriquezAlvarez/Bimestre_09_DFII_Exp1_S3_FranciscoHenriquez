import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { InventoryContext } from '../context/InventoryContext';
import { mismaReferencia } from '../utils/inventoryUtils';
import CampoFormulario from '../components/CampoFormulario';

// Permite letras (incluidas tildes), números y signos habituales en nombres comerciales.
const PATRON_TEXTO = /^[\p{L}\p{N}][\p{L}\p{N}\s.,()/%+&º°'-]*$/u;

const formularioInicial = {
  nombre: '', marca: '', categoria: '', precio: '', stock: ''
};

function AgregarProducto() {
  const inventario = useContext(InventoryContext);
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(formularioInicial);
  const [error, setError] = useState('');
  const existente = inventario?.productos.find((p) => mismaReferencia(p, formulario));

  if (!inventario) throw new Error('AgregarProducto debe estar dentro de InventoryProvider');

  function actualizarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
    setError('');
  }

  function guardarProducto(evento) {
    evento.preventDefault();
    const nombre = formulario.nombre.trim();
    const marca = formulario.marca.trim();
    const categoria = formulario.categoria.trim();
    if (!nombre || !marca) {
      setError('Ingresa el nombre y la marca del producto.');
      return;
    }
    if (!PATRON_TEXTO.test(nombre) || !PATRON_TEXTO.test(marca)) {
      setError('El nombre y la marca contienen caracteres no permitidos.');
      return;
    }
    if (existente) {
      const cantidad = Number(formulario.stock);
      if (formulario.stock === '' || !Number.isSafeInteger(cantidad) || cantidad <= 0) {
        setError('Ingresa una cantidad entera mayor que cero para aumentar el stock.');
        return;
      }
      if (!Number.isSafeInteger(existente.stock + cantidad)) {
        setError('La cantidad supera el máximo permitido para el inventario.');
        return;
      }
      inventario.aumentarStock(existente.id, cantidad);
      setFormulario(formularioInicial);
      navigate('/inventario', { state: { mensajeExito: `Se agregaron ${cantidad} unidades al stock de ${existente.nombre} (${existente.marca}).` } });
      return;
    }
    const precio = Number(formulario.precio);
    const stock = Number(formulario.stock);

    if (!nombre || !marca || !categoria || formulario.precio === '' || formulario.stock === '') {
      setError('Completa todos los campos para registrar el producto.');
      return;
    }
    if (!PATRON_TEXTO.test(categoria)) {
      setError('La categoría contiene caracteres no permitidos.');
      return;
    }
    if (!Number.isSafeInteger(precio) || precio <= 0 || !Number.isSafeInteger(stock) || stock < 0) {
      setError('Ingresa un precio entero mayor que cero y un stock entero igual o mayor que cero.');
      return;
    }

    inventario.agregarProducto({ nombre, marca, categoria, precio, stock, icono: '🛒' });
    setFormulario(formularioInicial);
    navigate('/inventario', { state: { mensajeExito: `Se registró correctamente ${nombre} (${marca}) con ${stock} unidades.` } });
  }

  return (
    <section className="gestion-pagina mx-auto w-full max-w-3xl">
      <h1>Agregar producto</h1>
      <p>Ingresa el nombre y la marca. Si el producto ya existe, podrás aumentar sus existencias sin duplicarlo.</p>
      <form className="producto-formulario sm:p-8" onSubmit={guardarProducto}>
        <CampoFormulario id="nombre" etiqueta="Nombre del producto" valor={formulario.nombre} alCambiar={actualizarCampo} longitudMaxima={80} ejemplo="Ej.: Harina 1 kg" />
        <CampoFormulario id="marca" etiqueta="Marca" valor={formulario.marca} alCambiar={actualizarCampo} longitudMaxima={60} ejemplo="Ej.: Selecta" />

        {existente && (
          <div className="aviso-existente rounded-lg border border-amber-300 bg-amber-50 p-4" role="status" aria-live="polite">
            <strong>Este producto ya existe en el inventario.</strong>
            <p>{existente.nombre} — {existente.marca}</p>
            <p>Stock actual: <strong>{existente.stock} unidades</strong>.</p>
            <p>Indica abajo cuántas unidades adicionales deseas ingresar.</p>
          </div>
        )}

        {!existente && (
          <>
            <CampoFormulario id="categoria" etiqueta="Tipo o categoría" valor={formulario.categoria} alCambiar={actualizarCampo} longitudMaxima={60} ejemplo="Ej.: Abarrotes" />
            <CampoFormulario id="precio" etiqueta="Precio (CLP)" tipo="number" minimo="1" paso="1" valor={formulario.precio} alCambiar={actualizarCampo} ejemplo="Ej.: 1490" />
          </>
        )}

        <CampoFormulario id="stock" etiqueta={existente ? 'Unidades adicionales' : 'Cantidad disponible'} tipo="number" minimo={existente ? '1' : '0'} paso="1" valor={formulario.stock} alCambiar={actualizarCampo} ejemplo="Ej.: 20" />

        {error && <p className="formulario-error" role="alert">{error}</p>}
        <button className="boton-guardar" type="submit">{existente ? "Aumentar stock" : "Guardar producto"}</button>
      </form>
    </section>
  );
}

export default AgregarProducto;

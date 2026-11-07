import { Link } from 'react-router';

function NotFound() {
  return (
    <main className="gestion-pagina mx-auto w-full max-w-3xl">
      <h1>Página no encontrada (404)</h1>
      <p>La dirección que ingresaste no corresponde a una página de SuperAhorro.</p>
      <Link className="inventory-nav-link inline-block mt-4" to="/">Volver al inicio</Link>
    </main>
  );
}

export default NotFound;

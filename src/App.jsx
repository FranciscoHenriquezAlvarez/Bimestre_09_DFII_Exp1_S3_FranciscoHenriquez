import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import QuienesSomos from './pages/QuienesSomos';
import Contacto from './pages/Contacto';
import AgregarProducto from './pages/AgregarProducto';
import Inventario from './pages/Inventario';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import InventoryNav from './components/InventoryNav';
import './App.css';

function App() {
  const [temaOscuro, setTemaOscuro] = useState(() => {
    try {
      return window.localStorage.getItem('superahorro-tema') === 'oscuro';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', temaOscuro);
    try {
      window.localStorage.setItem('superahorro-tema', temaOscuro ? 'oscuro' : 'claro');
    } catch {
      // El cambio visual sigue funcionando si el almacenamiento está bloqueado.
    }
    return () => document.documentElement.classList.remove('dark');
  }, [temaOscuro]);

  return (
    <div className="app min-h-screen bg-[#f5f7f5]">
      <header className="header">
        <h1>SuperAhorro</h1>
        <p>Tu supermercado de confianza</p>
        <button
          type="button"
          className="boton-tema" title={temaOscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
          onClick={() => setTemaOscuro((anterior) => !anterior)}
          aria-label={temaOscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
          aria-pressed={temaOscuro}
        >
          {temaOscuro ? '☀️' : '🌙'}
        </button>
      </header>
      <main className="contenido mx-auto w-full max-w-6xl px-4 sm:px-6">
        <InventoryNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/agregar-producto" element={<AgregarProducto />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Navbar />
    </div>
  );
}

export default App;

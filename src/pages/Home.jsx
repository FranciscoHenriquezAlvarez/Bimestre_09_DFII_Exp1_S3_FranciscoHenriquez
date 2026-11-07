import { useContext } from 'react';
import { InventoryContext } from '../context/InventoryContext';
import ProductCard from '../components/ProductCard';

function Home() {
  const inventario = useContext(InventoryContext);

  if (!inventario) {
    throw new Error('Home debe estar dentro de InventoryProvider');
  }

  const { productos } = inventario;

  return (
    <main className="home w-full">
      <section className="bienvenida">
        <h1>Bienvenidos a SuperAhorro</h1>
        <p>
          Somos tu supermercado de confianza.
          Encuentra productos de calidad para toda la familia.
        </p>
      </section>

      <section className="inventario">
        <h2>Nuestros productos</h2>
        <p>
          Conoce algunos de los productos disponibles en nuestro supermercado.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;

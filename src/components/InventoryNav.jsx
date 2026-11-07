import { NavLink } from 'react-router';

function InventoryNav() {
  return (
    <nav className="inventory-nav" aria-label="Gestión de inventario">
      <NavLink to="/agregar-producto" className={({ isActive }) => `inventory-nav-link${isActive ? ' active' : ''}`}>
        Agregar producto
      </NavLink>
      <NavLink to="/inventario" className={({ isActive }) => `inventory-nav-link${isActive ? ' active' : ''}`}>
        Ver inventario
      </NavLink>
      <NavLink to="/carrito" className={({ isActive }) => `inventory-nav-link${isActive ? ' active' : ''}`}>
        Carrito de compras
      </NavLink>
    </nav>
  );
}

export default InventoryNav;

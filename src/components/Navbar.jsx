import { NavLink } from 'react-router';

function Navbar() {
  return (
    <nav className="navbar" aria-label="Navegación principal">
      <NavLink end to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
        Inicio
      </NavLink>
      <NavLink to="/quienes-somos" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
        Quiénes somos
      </NavLink>
      <NavLink to="/contacto" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
        Contáctanos
      </NavLink>
    </nav>
  );
}

export default Navbar;

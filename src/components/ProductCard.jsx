function ProductCard({ producto }) {
  return (
    <article className="producto-card">
      <div className="producto-icono" aria-hidden="true">{producto.icono || '🛒'}</div>
      <h3>{producto.nombre}</h3>
      <p className="producto-categoria">{producto.categoria}</p>
      <p className="producto-precio">${producto.precio.toLocaleString('es-CL')}</p>
      <p className="producto-stock">Stock disponible: {producto.stock}</p>
    </article>
  );
}

export default ProductCard;

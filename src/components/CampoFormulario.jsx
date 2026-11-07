// Campo reutilizable: recibe la configuración y el valor desde el formulario padre.
function CampoFormulario({ id, etiqueta, valor, alCambiar, tipo = 'text', minimo, paso, longitudMaxima, ejemplo }) {
  return (
    <>
      <label htmlFor={id}>{etiqueta}</label>
      <input
        id={id}
        name={id}
        type={tipo}
        min={minimo}
        step={paso}
        maxLength={longitudMaxima}
        value={valor}
        onChange={alCambiar}
        required
        placeholder={ejemplo}
      />
    </>
  );
}

export default CampoFormulario;

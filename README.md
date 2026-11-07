# SuperAhorro — Gestión de inventario y carrito de compras

Aplicación web desarrollada con **React y Vite** para administrar productos de un supermercado, consultar sus existencias y preparar un carrito de compras. El proyecto se construyó progresivamente durante las **semanas 01, 02 y 03** de Frontend II.

## Evolución del proyecto

| Semana | Desarrollo principal |
| --- | --- |
| **01** | Construcción de la base de SuperAhorro: estructura de la aplicación, presentación de productos, navegación y primeras interfaces. |
| **02** | Incorporación y consolidación de la gestión del inventario: registro de artículos, validaciones, control de existencias, componentes reutilizables y almacenamiento local. |
| **03** | Ampliación del proyecto con filtro dinámico por categoría, detalle individual de productos, carrito de compras, sincronización de existencias, mejoras de modularidad, pruebas y diseño responsive. Se agregó también un modo oscuro como mejora opcional. |

## Funcionalidades del proyecto

### Inventario

- Visualización de productos con nombre, marca, categoría, precio y stock disponible.
- Registro de nuevos artículos y aumento de existencias de referencias ya registradas, evitando duplicados.
- Reducción de existencias y eliminación de productos.
- Filtro dinámico por categoría.
- Acceso al detalle individual de cada producto mediante una ruta con identificador.

### Carrito de compras — Semana 03

- Incorporación de productos desde su página de detalle.
- Selección de unidades según el stock disponible.
- Aumento y disminución de cantidades desde el carrito.
- Eliminación de artículos y opción para vaciar el carrito.
- Cálculo de subtotales, cantidad total de unidades y monto total en pesos chilenos.
- **Reserva temporal de existencias:** las unidades agregadas al carrito disminuyen el stock *disponible*, sin alterar el total almacenado. Al reducir cantidades, eliminar artículos o finalizar la sesión de la pestaña, las reservas dejan de aplicarse.
- Validación de cantidades para impedir reservas superiores a las existencias.

### Interfaz y navegación — Semana 03

- Navegación con **React Router 7**, incluida la ruta dinámica `/producto/:id`.
- Diseño adaptable a escritorio y móvil con **Tailwind CSS 4** y estilos propios.
- Tablas con desplazamiento horizontal e indicaciones para pantallas pequeñas.
- Modo claro y **modo oscuro** con tarjetas gris carbón, botón de cambio de tema y preferencia guardada localmente.
- Componentes reutilizables y separación entre páginas, presentación, estado y funciones auxiliares.

## Tecnologías utilizadas

- **React 19** y **React DOM**: construcción de interfaces mediante componentes.
- **Vite 8**: entorno de desarrollo y compilación.
- **React Router 7**: navegación entre páginas.
- **Tailwind CSS 4** y **CSS**: diseño visual y adaptación responsive.
- **Context API** y **`useReducer`**: gestión compartida del inventario y carrito.
- **`localStorage`**: persistencia del inventario y de la preferencia de tema.
- **`sessionStorage`**: persistencia temporal del carrito en la sesión de la pestaña.
- **ESLint** y **Node.js Test Runner**: análisis estático y pruebas automatizadas.

## Instalación y ejecución local

**Requisito:** contar con una versión de Node.js compatible con Vite 8 y npm.

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/FranciscoHenriquezAlvarez/Bimestre_09_DFII_Exp1_S3_FranciscoHenriquez.git
   ```

2. Entrar a la carpeta del proyecto:

   ```bash
   cd Bimestre_09_DFII_Exp1_S3_FranciscoHenriquez
   ```

3. Instalar dependencias:

   ```bash
   npm install
   ```

4. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrir en el navegador la dirección local indicada por Vite.

## Comprobaciones del proyecto

```bash
npm run lint
npm run build
npm run test
```

- `lint`: revisa el código con ESLint.
- `build`: genera la versión de producción en `dist/`.
- `test`: ejecuta las pruebas automatizadas del reducer y las funciones auxiliares del inventario.

Para revisar localmente la compilación de producción:

```bash
npm run preview
```

## Organización principal

```text
src/
├── components/     # Tarjetas, formulario, tabla y navegación
├── context/        # Context API, proveedor y reducer del inventario/carrito
├── pages/          # Inicio, inventario, detalle, carrito y demás páginas
├── utils/          # Funciones auxiliares del inventario
├── App.jsx         # Rutas, estructura general y selector de tema
├── App.css         # Estilos generales y apariencia oscura
└── index.css       # Configuración de Tailwind CSS 4 y estilos base
tests/              # Pruebas automatizadas
```

## Persistencia de datos

El inventario se guarda en el almacenamiento local del navegador. El carrito se guarda en el almacenamiento de sesión de la pestaña: se conserva durante la navegación y las recargas de esa sesión, pero no constituye un historial permanente de compras. Las reservas del carrito se calculan sobre el inventario disponible; no se descuentan definitivamente del inventario persistente.

La preferencia de modo claro u oscuro se conserva en `localStorage` para futuras visitas desde el mismo navegador.

> **Nota:** esta aplicación es una demostración frontend; no dispone de backend, autenticación ni procesamiento de pagos.

## Repositorio y publicación

**Repositorio de Semana 03:**

https://github.com/FranciscoHenriquezAlvarez/Bimestre_09_DFII_Exp1_S3_FranciscoHenriquez

**GitHub Pages:** pendiente de configurar y verificar. Una vez publicada la aplicación, se incorporará aquí el enlace definitivo.

## Alcance de la Semana 03

Esta entrega se concentra en integrar la navegación por categorías y productos, implementar el carrito con modificación de cantidades, mantener sincronizado el stock disponible y reforzar la organización del código. Como trabajo complementario se realizaron pruebas automatizadas, comprobaciones visuales en escritorio y móvil, y la incorporación opcional del modo oscuro.

// ---------- NAVEGACIÓN ENTRE VISTAS ----------
const btnCliente  = document.getElementById('btn-cliente');
const btnAlmacen  = document.getElementById('btn-almacen');
const btnStock    = document.getElementById('btn-stock');
const btnCasos    = document.getElementById('btn-casos');

const sectionCliente = document.getElementById('section-cliente');
const sectionAlmacen = document.getElementById('section-almacen');
const sectionStock   = document.getElementById('section-stock');
const sectionCasos   = document.getElementById('section-casos');

function activarSeccion(botonActivo, seccionActiva) {
  // quitar active de todos los botones
  [btnCliente, btnAlmacen, btnStock, btnCasos].forEach(b => b.classList.remove('active'));
  // ocultar secciones
  [sectionCliente, sectionAlmacen, sectionStock, sectionCasos].forEach(s => s.classList.remove('active'));

  botonActivo.classList.add('active');
  seccionActiva.classList.add('active');
}

btnCliente.addEventListener('click', () => activarSeccion(btnCliente, sectionCliente));
btnAlmacen.addEventListener('click', () => activarSeccion(btnAlmacen, sectionAlmacen));
btnStock.addEventListener('click',   () => activarSeccion(btnStock, sectionStock));
btnCasos.addEventListener('click',   () => activarSeccion(btnCasos, sectionCasos));

// ---------- MODAL GENÉRICO ----------
const modalOverlay = document.getElementById('modal-overlay');
const modalTitulo  = document.getElementById('modal-titulo');
const modalMensaje = document.getElementById('modal-mensaje');
const modalCerrar  = document.getElementById('modal-cerrar');

function mostrarModal(titulo, mensaje) {
  modalTitulo.textContent  = titulo;
  modalMensaje.textContent = mensaje;
  modalOverlay.classList.remove('hidden');
}

modalCerrar.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
});

// ---------- "BASE DE DATOS" SIMULADA ----------
const productos = [
  { id: 'P001', nombre: 'Leche Gloria 1L', stock: 30 },
  { id: 'P002', nombre: 'Arroz Costeño 5kg', stock: 20 },
  { id: 'P003', nombre: 'Aceite Primor 1L', stock: 15 },
  { id: 'P004', nombre: 'Huevos x 15 und', stock: 25 },
  { id: 'P005', nombre: 'Azúcar Rubia 1kg', stock: 10 },
  { id: 'P006', nombre: 'Pan de molde integral', stock: 12 }
];

let contadorPedidos = 1;

// ---------- CARGAR PRODUCTOS EN SELECT DEL FORMULARIO ----------
const selectProducto = document.getElementById('producto');

function cargarProductosSelect() {
  selectProducto.innerHTML = '<option value="">Seleccione un producto</option>';
  productos.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = `${p.nombre} (Stock: ${p.stock})`;
    selectProducto.appendChild(option);
  });
}

// ---------- TABLA DE STOCK ----------
const tablaStockBody = document.querySelector('#tabla-stock tbody');

function pintarTablaStock(filtroTexto = '', filtroTipo = 'todos') {
  tablaStockBody.innerHTML = '';

  const texto = filtroTexto.toLowerCase();

  productos.forEach(p => {
    let coincideTexto = p.nombre.toLowerCase().includes(texto);
    let coincideTipo  = true;

    if (filtroTipo === 'bajo') {
      coincideTipo = p.stock > 0 && p.stock < 10;
    } else if (filtroTipo === 'sin') {
      coincideTipo = p.stock === 0;
    }

    if (coincideTexto && coincideTipo) {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.stock}</td>
      `;
      tablaStockBody.appendChild(fila);
    }
  });
}

// filtros de stock
const inputBuscarStock = document.getElementById('buscar-stock');
const selectFiltroStock = document.getElementById('filtro-stock');

inputBuscarStock.addEventListener('input', () => {
  pintarTablaStock(inputBuscarStock.value, selectFiltroStock.value);
});
selectFiltroStock.addEventListener('change', () => {
  pintarTablaStock(inputBuscarStock.value, selectFiltroStock.value);
});

// ---------- REGISTRAR PEDIDO ONLINE ----------
const formPedido = document.getElementById('form-pedido');
const tablaPedidosBody = document.querySelector('#tabla-pedidos tbody');

formPedido.addEventListener('submit', (event) => {
  event.preventDefault();

  const nombre    = document.getElementById('cliente-nombre').value.trim();
  const correo    = document.getElementById('cliente-correo').value.trim();
  const idProd    = selectProducto.value;
  const cantidad  = parseInt(document.getElementById('cantidad').value, 10);
  const modalidad = document.getElementById('modalidad').value;
  const metodo    = document.getElementById('metodo-pago').value;
  const direccion = document.getElementById('direccion').value.trim();

  if (!nombre || !correo || !idProd || !cantidad) {
    mostrarModal('Campos incompletos', 'Por favor, complete todos los campos obligatorios.');
    return;
  }

  // Buscar producto en "BD"
  const producto = productos.find(p => p.id === idProd);
  if (!producto) {
    mostrarModal('Error', 'El producto seleccionado no existe.');
    return;
  }

  // Validar stock
  if (cantidad > producto.stock) {
    mostrarModal('Stock insuficiente',
      `Solo hay ${producto.stock} unidades disponibles de "${producto.nombre}".`);
    return;
  }

  // Descontar stock
  producto.stock -= cantidad;

  // Crear código de pedido
  const codigo = 'PV-' + String(contadorPedidos).padStart(4, '0');
  contadorPedidos++;

  // Agregar pedido a tabla de almacén
  const fila = document.createElement('tr');
  fila.innerHTML = `
    <td>${codigo}</td>
    <td>${nombre}</td>
    <td>${producto.nombre}</td>
    <td>${cantidad}</td>
    <td>${modalidad}</td>
    <td><span class="estado">Por preparar</span></td>
    <td><button class="btn btn-small btn-preparar">Marcar preparado</button></td>
  `;
  tablaPedidosBody.appendChild(fila);

  // Actualizar UI de productos (select y tabla stock)
  cargarProductosSelect();
  pintarTablaStock(inputBuscarStock.value, selectFiltroStock.value);

  // Limpiar formulario
  formPedido.reset();

  mostrarModal(
    'Pedido registrado',
    `El pedido ${codigo} fue registrado correctamente y enviado al almacén.`
  );
});

// ---------- PANEL DE ALMACÉN: MARCAR PREPARADO ----------
tablaPedidosBody.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn-preparar')) {
    const fila = event.target.closest('tr');
    const codigo = fila.children[0].textContent;
    const estadoSpan = fila.querySelector('.estado');

    estadoSpan.textContent = 'Preparado';
    estadoSpan.style.background = '#c8e6c9';
    estadoSpan.style.color = '#2e7d32';

    mostrarModal(
      'Pedido preparado',
      `El pedido ${codigo} fue marcado como preparado en el almacén.`
    );
  }
});

// ---------- INICIALIZACIÓN ----------
window.addEventListener('DOMContentLoaded', () => {
  cargarProductosSelect();
  pintarTablaStock();
});

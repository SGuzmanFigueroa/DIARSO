// ---------- CAMBIO ENTRE VISTAS ----------
const btnCliente = document.getElementById('btn-cliente');
const btnAlmacen = document.getElementById('btn-almacen');
const sectionCliente = document.getElementById('section-cliente');
const sectionAlmacen = document.getElementById('section-almacen');

btnCliente.addEventListener('click', () => {
  btnCliente.classList.add('active');
  btnAlmacen.classList.remove('active');
  sectionCliente.classList.add('active');
  sectionAlmacen.classList.remove('active');
});

btnAlmacen.addEventListener('click', () => {
  btnAlmacen.classList.add('active');
  btnCliente.classList.remove('active');
  sectionAlmacen.classList.add('active');
  sectionCliente.classList.remove('active');
});

// ---------- MODAL GENÉRICO ----------
const modalOverlay = document.getElementById('modal-overlay');
const modalTitulo = document.getElementById('modal-titulo');
const modalMensaje = document.getElementById('modal-mensaje');
const modalCerrar = document.getElementById('modal-cerrar');

function mostrarModal(titulo, mensaje) {
  modalTitulo.textContent = titulo;
  modalMensaje.textContent = mensaje;
  modalOverlay.classList.remove('hidden');
}

modalCerrar.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
});

// ---------- REGISTRAR PEDIDO ONLINE ----------
const formPedido = document.getElementById('form-pedido');
const tablaPedidosBody = document.querySelector('#tabla-pedidos tbody');

let contadorPedidos = 1;

formPedido.addEventListener('submit', (event) => {
  event.preventDefault(); // No recargar página

  // Obtener datos del formulario
  const nombre = document.getElementById('cliente-nombre').value.trim();
  const correo = document.getElementById('cliente-correo').value.trim();
  const producto = document.getElementById('producto').value.trim();
  const cantidad = document.getElementById('cantidad').value;
  const modalidad = document.getElementById('modalidad').value;
  const metodo = document.getElementById('metodo-pago').value;

  if (!nombre || !correo || !producto || !cantidad) {
    mostrarModal('Campos incompletos', 'Por favor, complete todos los campos obligatorios.');
    return;
  }

  // Crear código de pedido simple
  const codigo = 'PV-' + String(contadorPedidos).padStart(4, '0');
  contadorPedidos++;

  // Agregar pedido a la tabla del almacén
  const fila = document.createElement('tr');
  fila.innerHTML = `
    <td>${codigo}</td>
    <td>${nombre}</td>
    <td>${producto}</td>
    <td>${cantidad}</td>
    <td>${modalidad}</td>
    <td><span class="estado">Por preparar</span></td>
    <td><button class="btn btn-small btn-preparar">Marcar preparado</button></td>
  `;
  tablaPedidosBody.appendChild(fila);

  // Limpiar formulario
  formPedido.reset();

  // Mostrar modal de éxito
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

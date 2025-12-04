// Lista de pedidos en memoria (simula "BD")
let pedidos = [];

// Referencias a elementos de DOM
const tbodyPedidos = document.getElementById("tbody-pedidos");
const txtBuscar = document.getElementById("txt-buscar");
const filtroEstado = document.getElementById("filtro-estado");
const lblTotal = document.getElementById("lbl-total");
const lblPendientes = document.getElementById("lbl-pendientes");
const lblEntregados = document.getElementById("lbl-entregados");
const lblNoEntregados = document.getElementById("lbl-no-entregados");
const panelMensaje = document.getElementById("panel-mensaje");
const msgChofer = document.getElementById("msg-chofer");

// Cargar pedidos (de localStorage o demo)
function cargarPedidos() {
  try {
    const guardados = localStorage.getItem("pedidosChofer");
    if (guardados) {
      pedidos = JSON.parse(guardados);
    }
  } catch (e) {
    console.warn("No se pudo leer pedidosChofer de localStorage:", e);
  }

  // Si no hay nada, cargamos DEMO
  if (!pedidos || pedidos.length === 0) {
    pedidos = [
      {
        codigo: "PV-0001",
        cliente: "Juan Pérez",
        direccion: "Av. Los Olivos 123, Lima",
        ventana: "Hoy 10:00 - 12:00",
        estado: "pendiente"   // pendiente | entregado | no_entregado
      },
      {
        codigo: "PV-0002",
        cliente: "María López",
        direccion: "Jr. Las Flores 456, Lima",
        ventana: "Hoy 12:00 - 14:00",
        estado: "pendiente"
      },
      {
        codigo: "PV-0003",
        cliente: "Carlos Díaz",
        direccion: "Calle Lima 789, Callao",
        ventana: "Hoy 15:00 - 17:00",
        estado: "entregado"
      }
    ];
  }

  renderPedidos();
}

// Guardar en localStorage
function guardarPedidos() {
  try {
    localStorage.setItem("pedidosChofer", JSON.stringify(pedidos));
  } catch (e) {
    console.warn("No se pudo guardar pedidosChofer:", e);
  }
}

// Renderizar tabla según filtros
function renderPedidos() {
  tbodyPedidos.innerHTML = "";

  const texto = txtBuscar.value.trim().toLowerCase();
  const filtro = filtroEstado.value;

  let total = 0;
  let pendientes = 0;
  let entregados = 0;
  let noEntregados = 0;

  pedidos.forEach((p, index) => {
    // filtro búsqueda
    const coincideTexto =
      p.codigo.toLowerCase().includes(texto) ||
      p.cliente.toLowerCase().includes(texto);

    // filtro estado
    const coincideEstado =
      filtro === "todos" || filtro === p.estado;

    if (!coincideTexto || !coincideEstado) return;

    total++;

    if (p.estado === "pendiente") pendientes++;
    if (p.estado === "entregado") entregados++;
    if (p.estado === "no_entregado") noEntregados++;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.cliente}</td>
      <td>${p.direccion}</td>
      <td>${p.ventana}</td>
      <td>${renderEstadoBadge(p.estado)}</td>
      <td>
        <button class="btn" data-accion="entregado" data-index="${index}">
          Marcar entregado
        </button>
        <button class="btn btn-secondary" data-accion="no_entregado" data-index="${index}">
          No entregado
        </button>
      </td>
    `;
    tbodyPedidos.appendChild(tr);
  });

  // Actualizar resumen
  lblTotal.textContent = total;
  lblPendientes.textContent = pendientes;
  lblEntregados.textContent = entregados;
  lblNoEntregados.textContent = noEntregados;

  // Eventos de botones
  tbodyPedidos.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", manejarAccionPedido);
  });
}

// Devuelve HTML para badge de estado
function renderEstadoBadge(estado) {
  switch (estado) {
    case "entregado":
      return `<span class="badge badge-entregado">ENTREGADO</span>`;
    case "no_entregado":
      return `<span class="badge badge-no-entregado">NO ENTREGADO</span>`;
    default:
      return `<span class="badge badge-pendiente">PENDIENTE</span>`;
  }
}

// Maneja los clicks en "Marcar entregado" / "No entregado"
function manejarAccionPedido(e) {
  const accion = e.target.getAttribute("data-accion");
  const index = parseInt(e.target.getAttribute("data-index"), 10);
  const pedido = pedidos[index];

  if (!pedido) return;

  if (accion === "entregado") {
    pedido.estado = "entregado";
    mostrarMensaje(`Pedido ${pedido.codigo} marcado como ENTREGADO.`);
  } else if (accion === "no_entregado") {
    const motivo = prompt(
      "Ingrese motivo de no entrega (cliente ausente, dirección incorrecta, etc.):",
      "Cliente ausente"
    );
    pedido.estado = "no_entregado";
    pedido.motivoNoEntrega = motivo || "";
    mostrarMensaje(`Pedido ${pedido.codigo} marcado como NO ENTREGADO.`);
  }

  guardarPedidos();
  renderPedidos();
}

// Mostrar mensaje al chofer
function mostrarMensaje(texto) {
  msgChofer.textContent = texto;
  panelMensaje.style.display = "block";

  setTimeout(() => {
    panelMensaje.style.display = "none";
  }, 3500);
}

// Listeners de filtros
txtBuscar.addEventListener("input", renderPedidos);
filtroEstado.addEventListener("change", renderPedidos);

// Inicialización
cargarPedidos();

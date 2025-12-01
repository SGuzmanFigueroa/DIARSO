// =================== "BASE DE DATOS" DE PEDIDOS ===================
// Intentamos leer de localStorage (si tu módulo de pedidos guarda allí).
// Si no hay nada, usamos algunos pedidos de ejemplo.

let pedidos = [];

function cargarPedidos() {
  const guardado = localStorage.getItem("pedidos_plazavea");
  if (guardado) {
    pedidos = JSON.parse(guardado);
  } else {
    pedidos = [
      {
        codigo: "PV-0001",
        cliente: "Juan Pérez",
        correo: "juan@example.com",
        producto: "Leche Gloria Entera 1L",
        cantidad: 2,
        modalidad: "Entrega a domicilio",
        metodoPago: "Tarjeta (online)",
        direccion: "Av. Siempre Viva 123, Lima",
        estado: "Registrado",
        conformidad: "pendiente",
        destino: "",
        observaciones: ""
      },
      {
        codigo: "PV-0002",
        cliente: "María López",
        correo: "maria@example.com",
        producto: "Arroz Costeño 5kg",
        cantidad: 1,
        modalidad: "Recojo en tienda",
        metodoPago: "Pago contra entrega",
        direccion: "Recojo en Plaza Vea San Miguel",
        estado: "Registrado",
        conformidad: "pendiente",
        destino: "",
        observaciones: ""
      }
    ];
  }
}

function guardarPedidos() {
  localStorage.setItem("pedidos_plazavea", JSON.stringify(pedidos));
}

// =================== REFERENCIAS DOM ===================
const tbody = document.getElementById("tbody-pedidos");
const resumenEl = document.getElementById("resumen");

const filtroBusqueda = document.getElementById("filtro-busqueda");
const filtroEstado = document.getElementById("filtro-estado");
const filtroModalidad = document.getElementById("filtro-modalidad");

const overlay = document.getElementById("overlay");
const detallePedidoDiv = document.getElementById("detalle-pedido");
const formConformidad = document.getElementById("form-conformidad");
const destinoSelect = document.getElementById("destino");
const observacionesInput = document.getElementById("observaciones");

let pedidoSeleccionado = null;

// =================== PINTAR TABLA ===================
function pintarTabla() {
  tbody.innerHTML = "";

  const texto = filtroBusqueda.value.toLowerCase().trim();
  const estado = filtroEstado.value;
  const modalidad = filtroModalidad.value;

  let total = 0,
      totalPendiente = 0,
      totalConforme = 0,
      totalNoConforme = 0;

  pedidos.forEach(p => {
    const coincideTexto =
      p.codigo.toLowerCase().includes(texto) ||
      p.cliente.toLowerCase().includes(texto);

    const coincideEstado =
      estado === "todos" || p.conformidad === estado;

    const coincideModalidad =
      modalidad === "todas" || p.modalidad === modalidad;

    if (!coincideTexto || !coincideEstado || !coincideModalidad) return;

    total++;

    if (p.conformidad === "pendiente") totalPendiente++;
    if (p.conformidad === "conforme") totalConforme++;
    if (p.conformidad === "no-conforme") totalNoConforme++;

    const tr = document.createElement("tr");

    const claseBadge =
      p.conformidad === "conforme" ? "badge-conforme" :
      p.conformidad === "no-conforme" ? "badge-no-conforme" :
      "badge-pendiente";

    const textoBadge =
      p.conformidad === "conforme" ? "Conforme" :
      p.conformidad === "no-conforme" ? "No conforme" :
      "Pendiente";

    tr.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.cliente}</td>
      <td>${p.producto}</td>
      <td>${p.cantidad}</td>
      <td>${p.modalidad}</td>
      <td>${p.estado}</td>
      <td><span class="badge-estado ${claseBadge}">${textoBadge}</span></td>
      <td><button class="btn-tabla" onclick="abrirModal('${p.codigo}')">Revisar</button></td>
    `;

    tbody.appendChild(tr);
  });

  resumenEl.textContent =
    `Pedidos listados: ${total} | Pendientes: ${totalPendiente} | ` +
    `Conformes: ${totalConforme} | No conformes: ${totalNoConforme}`;
}

// =================== MODAL ===================
function abrirModal(codigoPedido) {
  pedidoSeleccionado = pedidos.find(p => p.codigo === codigoPedido);
  if (!pedidoSeleccionado) return;

  detallePedidoDiv.innerHTML = `
    <p><b>Código:</b> ${pedidoSeleccionado.codigo}</p>
    <p><b>Cliente:</b> ${pedidoSeleccionado.cliente} (${pedidoSeleccionado.correo})</p>
    <p><b>Producto:</b> ${pedidoSeleccionado.producto} x ${pedidoSeleccionado.cantidad}</p>
    <p><b>Modalidad:</b> ${pedidoSeleccionado.modalidad}</p>
    <p><b>Método de pago:</b> ${pedidoSeleccionado.metodoPago}</p>
    <p><b>Dirección / punto de entrega:</b> ${pedidoSeleccionado.direccion}</p>
  `;

  // Setear valores actuales si ya existía una conformidad
  formConformidad.reset();

  if (pedidoSeleccionado.conformidad === "conforme") {
    formConformidad.conformidad.value = "conforme";
  } else if (pedidoSeleccionado.conformidad === "no-conforme") {
    formConformidad.conformidad.value = "no-conforme";
  }

  destinoSelect.value = pedidoSeleccionado.destino || "Chofer – reparto a domicilio";
  observacionesInput.value = pedidoSeleccionado.observaciones || "";

  overlay.classList.remove("hidden");
}

function cerrarModal() {
  overlay.classList.add("hidden");
  pedidoSeleccionado = null;
}

// =================== GUARDAR CONFORMIDAD ===================
formConformidad.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!pedidoSeleccionado) return;

  const nuevaConf = formConformidad.conformidad.value;
  const nuevoDestino = destinoSelect.value;
  const obs = observacionesInput.value.trim();

  pedidoSeleccionado.conformidad = nuevaConf;
  pedidoSeleccionado.destino = nuevoDestino;
  pedidoSeleccionado.observaciones = obs;

  // Cambiamos estado interno del pedido (ejemplo)
  if (nuevaConf === "conforme") {
    pedidoSeleccionado.estado =
      pedidoSeleccionado.modalidad === "Entrega a domicilio"
        ? "Listo para reparto"
        : "Listo para recojo";
  } else {
    pedidoSeleccionado.estado = "Observado";
  }

  guardarPedidos();
  pintarTabla();
  cerrarModal();
  alert("Conformidad registrada correctamente.");
});

// =================== EVENTOS FILTROS ===================
[filtroBusqueda, filtroEstado, filtroModalidad].forEach(ctrl => {
  ctrl.addEventListener("input", pintarTabla);
  ctrl.addEventListener("change", pintarTabla);
});

// =================== INICIALIZACIÓN ===================
window.addEventListener("DOMContentLoaded", () => {
  cargarPedidos();
  pintarTabla();
});

// Exponer funciones usadas en HTML
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;

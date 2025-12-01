// ================ "BASE DE DATOS" EN LOCALSTORAGE ==================
let reclamos = [];

// Cargar desde localStorage
function cargarReclamos() {
  const data = localStorage.getItem("reclamos_plazavea");
  if (data) {
    reclamos = JSON.parse(data);
  } else {
    reclamos = []; // sin ejemplos para no ensuciar
  }
}

// Guardar en localStorage
function guardarReclamos() {
  localStorage.setItem("reclamos_plazavea", JSON.stringify(reclamos));
}

// ================ UTILIDADES ==================

// Generar código tipo RC-0001
function generarCodigoReclamo() {
  const num = reclamos.length + 1;
  return "RC-" + String(num).padStart(4, "0");
}

// Formatear fecha
function formatearFecha(fechaIso) {
  const f = new Date(fechaIso);
  const d = String(f.getDate()).padStart(2, "0");
  const m = String(f.getMonth() + 1).padStart(2, "0");
  const y = f.getFullYear();
  const h = String(f.getHours()).padStart(2, "0");
  const min = String(f.getMinutes()).padStart(2, "0");
  return `${d}/${m}/${y} ${h}:${min}`;
}

// ================ DOM ==================
const formReclamo = document.getElementById("form-reclamo");
const canalInput = document.getElementById("canal");
const tipoInput = document.getElementById("tipo");
const codigoPedidoInput = document.getElementById("codigo-pedido");
const clienteInput = document.getElementById("cliente");
const documentoInput = document.getElementById("documento");
const correoInput = document.getElementById("correo");
const telefonoInput = document.getElementById("telefono");
const fechaHechoInput = document.getElementById("fecha-hecho");
const detalleInput = document.getElementById("detalle");

const filtroBusqueda = document.getElementById("filtro-busqueda");
const filtroEstado = document.getElementById("filtro-estado");
const filtroCanal = document.getElementById("filtro-canal");

const tbodyReclamos = document.getElementById("tbody-reclamos");
const resumenEl = document.getElementById("resumen");

// Modal seguimiento
const overlay = document.getElementById("overlay");
const detalleReclamoDiv = document.getElementById("detalle-reclamo");
const formSeguimiento = document.getElementById("form-seguimiento");
const seguimientoEstado = document.getElementById("seguimiento-estado");
const seguimientoComentario = document.getElementById("seguimiento-comentario");
const seguimientoHistorial = document.getElementById("seguimiento-historial");

let reclamoSeleccionado = null;

// ================ RENDER LISTA ==================
function pintarReclamos() {
  tbodyReclamos.innerHTML = "";

  const texto = filtroBusqueda.value.toLowerCase().trim();
  const est = filtroEstado.value;
  const canalFiltro = filtroCanal.value;

  let total = 0, abiertos = 0, proceso = 0, cerrados = 0;

  reclamos.forEach(r => {
    const coincideTexto =
      r.codigo.toLowerCase().includes(texto) ||
      r.cliente.toLowerCase().includes(texto);

    const coincideEstado =
      est === "todos" || r.estado === est;

    const coincideCanal =
      canalFiltro === "todos" || r.canal === canalFiltro;

    if (!coincideTexto || !coincideEstado || !coincideCanal) return;

    total++;
    if (r.estado === "Abierto") abiertos++;
    if (r.estado === "En proceso") proceso++;
    if (r.estado === "Cerrado") cerrados++;

    let claseEstado = "estado-abierto";
    if (r.estado === "En proceso") claseEstado = "estado-proceso";
    if (r.estado === "Cerrado") claseEstado = "estado-cerrado";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.codigo}</td>
      <td>${formatearFecha(r.fechaRegistro)}</td>
      <td>${r.cliente}</td>
      <td>${r.canal}</td>
      <td>${r.tipo}</td>
      <td><span class="badge-estado ${claseEstado}">${r.estado}</span></td>
      <td>
        <button class="btn-tabla" onclick="abrirModal('${r.codigo}')">
          Ver / Actualizar
        </button>
      </td>
    `;
    tbodyReclamos.appendChild(tr);
  });

  resumenEl.textContent =
    `Reclamos listados: ${total} | Abiertos: ${abiertos} | ` +
    `En proceso: ${proceso} | Cerrados: ${cerrados}`;
}

// ================ REGISTRO DE RECLAMO ==================
formReclamo.addEventListener("submit", (e) => {
  e.preventDefault();

  const codigo = generarCodigoReclamo();
  const ahora = new Date();

  const reclamo = {
    codigo,
    fechaRegistro: ahora.toISOString(),
    canal: canalInput.value,
    tipo: tipoInput.value,
    codigoPedido: codigoPedidoInput.value.trim() || null,
    cliente: clienteInput.value.trim(),
    documento: documentoInput.value.trim() || null,
    correo: correoInput.value.trim() || null,
    telefono: telefonoInput.value.trim() || null,
    fechaHecho: fechaHechoInput.value || null,
    detalle: detalleInput.value.trim(),
    estado: "Abierto",
    historial: []  // cada item: {fechaISO, comentario, estado}
  };

  if (!reclamo.cliente || !reclamo.detalle) {
    alert("Completa al menos el nombre del cliente y el detalle del reclamo.");
    return;
  }

  reclamos.push(reclamo);
  guardarReclamos();
  formReclamo.reset();
  pintarReclamos();

  alert(`Reclamo ${codigo} registrado correctamente.`);
});

// ================ MODAL SEGUIMIENTO ==================
function abrirModal(codigoReclamo) {
  reclamoSeleccionado = reclamos.find(r => r.codigo === codigoReclamo);
  if (!reclamoSeleccionado) return;

  detalleReclamoDiv.innerHTML = `
    <p><b>Código:</b> ${reclamoSeleccionado.codigo}</p>
    <p><b>Fecha de registro:</b> ${formatearFecha(reclamoSeleccionado.fechaRegistro)}</p>
    <p><b>Canal:</b> ${reclamoSeleccionado.canal}</p>
    <p><b>Tipo:</b> ${reclamoSeleccionado.tipo}</p>
    <p><b>Cliente:</b> ${reclamoSeleccionado.cliente} (${reclamoSeleccionado.documento || "sin documento"})</p>
    <p><b>Contacto:</b> ${reclamoSeleccionado.correo || "-"} / ${reclamoSeleccionado.telefono || "-"}</p>
    <p><b>Pedido relacionado:</b> ${reclamoSeleccionado.codigoPedido || "No especificado"}</p>
    <p><b>Detalle:</b> ${reclamoSeleccionado.detalle}</p>
  `;

  // Estado actual
  seguimientoEstado.value = reclamoSeleccionado.estado;

  // Historial
  renderHistorial();

  seguimientoComentario.value = "";
  overlay.classList.remove("hidden");
}

function cerrarModal() {
  overlay.classList.add("hidden");
  reclamoSeleccionado = null;
}

// Mostrar historial en el div
function renderHistorial() {
  seguimientoHistorial.innerHTML = "";

  if (!reclamoSeleccionado.historial || reclamoSeleccionado.historial.length === 0) {
    seguimientoHistorial.innerHTML = "<p>No hay comentarios de seguimiento registrados.</p>";
    return;
  }

  reclamoSeleccionado.historial.forEach(item => {
    const p = document.createElement("p");
    p.textContent = `[${formatearFecha(item.fecha)}] (${item.estado}) ${item.comentario}`;
    seguimientoHistorial.appendChild(p);
  });
}

// Guardar actualización
formSeguimiento.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!reclamoSeleccionado) return;

  const nuevoEstado = seguimientoEstado.value;
  const comentario = seguimientoComentario.value.trim();
  const ahora = new Date();

  // Actualizar estado principal
  reclamoSeleccionado.estado = nuevoEstado;

  // Agregar comentario solo si escribió algo
  if (comentario) {
    reclamoSeleccionado.historial.push({
      fecha: ahora.toISOString(),
      estado: nuevoEstado,
      comentario
    });
  }

  guardarReclamos();
  pintarReclamos();
  renderHistorial();
  seguimientoComentario.value = "";

  alert("Seguimiento actualizado correctamente.");
});

// ================ FILTROS ==================
[filtroBusqueda, filtroEstado, filtroCanal].forEach(ctrl => {
  ctrl.addEventListener("input", pintarReclamos);
  ctrl.addEventListener("change", pintarReclamos);
});

// ================ INICIO ==================
window.addEventListener("DOMContentLoaded", () => {
  cargarReclamos();
  pintarReclamos();
});

// Exponer funciones a window para onclick
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;

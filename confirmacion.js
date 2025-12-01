reclamo.confirmacion = {
  fecha: ISOString,
  medio: "...",
  asunto: "...",
  mensaje: "..."
}

// =================== CARGA DE DATOS ===================
let reclamos = [];

function cargarReclamos() {
  const data = localStorage.getItem("reclamos_plazavea");
  if (data) {
    reclamos = JSON.parse(data);
  } else {
    reclamos = [];
  }
}

function guardarReclamos() {
  localStorage.setItem("reclamos_plazavea", JSON.stringify(reclamos));
}

// =================== UTILIDADES ===================
function formatearFecha(fechaIso) {
  const f = new Date(fechaIso);
  const d = String(f.getDate()).padStart(2, "0");
  const m = String(f.getMonth() + 1).padStart(2, "0");
  const y = f.getFullYear();
  const h = String(f.getHours()).padStart(2, "0");
  const min = String(f.getMinutes()).padStart(2, "0");
  return `${d}/${m}/${y} ${h}:${min}`;
}

// Fecha de cierre = último historial con estado "Cerrado" o fechaRegistro
function obtenerFechaCierre(reclamo) {
  if (!reclamo.historial || reclamo.historial.length === 0) {
    return reclamo.fechaRegistro;
  }
  const cerrados = reclamo.historial.filter(h => h.estado === "Cerrado");
  if (cerrados.length === 0) return reclamo.fechaRegistro;
  const ultimo = cerrados[cerrados.length - 1];
  return ultimo.fecha;
}

// =================== DOM ===================
const tbodyPendientes = document.getElementById("tbody-pendientes");
const resumenPendientes = document.getElementById("resumen-pendientes");

const tbodyEnviadas = document.getElementById("tbody-enviadas");
const resumenEnviadas = document.getElementById("resumen-enviadas");

const overlay = document.getElementById("overlay");
const detalleReclamoDiv = document.getElementById("detalle-reclamo");
const formConfirmacion = document.getElementById("form-confirmacion");
const medioSelect = document.getElementById("medio");
const asuntoInput = document.getElementById("asunto");
const mensajeInput = document.getElementById("mensaje");

let reclamoSeleccionado = null;

// =================== RENDER ===================
function pintarPendientes() {
  tbodyPendientes.innerHTML = "";

  const pendientes = reclamos.filter(
    r => r.estado === "Cerrado" && !r.confirmacion
  );

  pendientes.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.codigo}</td>
      <td>${r.cliente}</td>
      <td>${r.canal}</td>
      <td>${r.tipo}</td>
      <td>${formatearFecha(obtenerFechaCierre(r))}</td>
      <td><span class="badge-estado estado-cerrado">Cerrado</span></td>
      <td>
        <button class="btn-tabla" onclick="abrirModal('${r.codigo}')">
          Preparar confirmación
        </button>
      </td>
    `;
    tbodyPendientes.appendChild(tr);
  });

  resumenPendientes.textContent =
    pendientes.length === 0
      ? "No hay reclamos cerrados pendientes de confirmación."
      : `Reclamos pendientes de confirmación: ${pendientes.length}`;
}

function pintarEnviadas() {
  tbodyEnviadas.innerHTML = "";

  const enviados = reclamos.filter(r => r.confirmacion);

  enviados.forEach(r => {
    const c = r.confirmacion;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.codigo}</td>
      <td>${r.cliente}</td>
      <td>${c.medio}</td>
      <td>${formatearFecha(c.fecha)}</td>
      <td>${c.asunto}</td>
    `;
    tbodyEnviadas.appendChild(tr);
  });

  resumenEnviadas.textContent =
    `Confirmaciones enviadas: ${enviados.length}`;
}

// =================== MODAL ===================
function armarMensajeEjemplo(r) {
  const fecha = formatearFecha(r.fechaRegistro);
  const tipo = r.tipo.toLowerCase();
  const detalleCorto = r.detalle.length > 120
    ? r.detalle.slice(0, 117) + "..."
    : r.detalle;

  return (
`Estimado/a ${r.cliente}:

Nos comunicamos respecto a su ${tipo} registrado el día ${fecha} sobre:
"${detalleCorto}"

Luego de la revisión realizada por nuestro equipo, se ha procedido a dar solución
al caso y el reclamo ha sido marcado como CERRADO en nuestro sistema.

Si tiene alguna consulta adicional o no está conforme con la solución brindada,
puede responder por este mismo medio o acercarse a nuestro módulo de atención.

Atentamente,
Área de Soporte
Plaza Vea`
  );
}

function abrirModal(codigoReclamo) {
  reclamoSeleccionado = reclamos.find(r => r.codigo === codigoReclamo);
  if (!reclamoSeleccionado) return;

  // Datos del reclamo
  detalleReclamoDiv.innerHTML = `
    <p><b>Código:</b> ${reclamoSeleccionado.codigo}</p>
    <p><b>Cliente:</b> ${reclamoSeleccionado.cliente}</p>
    <p><b>Canal:</b> ${reclamoSeleccionado.canal}</p>
    <p><b>Tipo:</b> ${reclamoSeleccionado.tipo}</p>
    <p><b>Fecha de registro:</b> ${formatearFecha(reclamoSeleccionado.fechaRegistro)}</p>
    <p><b>Detalle:</b> ${reclamoSeleccionado.detalle}</p>
  `;

  // Datos por defecto del mensaje
  medioSelect.value = "Correo electrónico";
  asuntoInput.value = `Confirmación de ${reclamoSeleccionado.tipo.toLowerCase()} ${reclamoSeleccionado.codigo}`;
  mensajeInput.value = armarMensajeEjemplo(reclamoSeleccionado);

  overlay.classList.remove("hidden");
}

function cerrarModal() {
  overlay.classList.add("hidden");
  reclamoSeleccionado = null;
}

// =================== GUARDAR CONFIRMACIÓN ===================
formConfirmacion.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!reclamoSeleccionado) return;

  const medio = medioSelect.value;
  const asunto = asuntoInput.value.trim();
  const mensaje = mensajeInput.value.trim();

  if (!asunto || !mensaje) {
    alert("Completa el asunto y el mensaje.");
    return;
  }

  const ahora = new Date();

  reclamoSeleccionado.confirmacion = {
    fecha: ahora.toISOString(),
    medio,
    asunto,
    mensaje
  };

  guardarReclamos();
  pintarPendientes();
  pintarEnviadas();
  cerrarModal();

  alert("Confirmación registrada como enviada (simulación de envío).");
});

// =================== INICIO ===================
window.addEventListener("DOMContentLoaded", () => {
  cargarReclamos();
  pintarPendientes();
  pintarEnviadas();
});

// Exponer funciones usadas en el HTML
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;

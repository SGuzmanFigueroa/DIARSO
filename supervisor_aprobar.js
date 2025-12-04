// ---- "BD" en memoria ----
let solicitudes = [];

// Referencias DOM
const tbodySolicitudes = document.getElementById("tbody-solicitudes");
const txtBuscar = document.getElementById("txt-buscar");
const filtroEstado = document.getElementById("filtro-estado");
const filtroPrioridad = document.getElementById("filtro-prioridad");

const lblTotal = document.getElementById("lbl-total");
const lblPendientes = document.getElementById("lbl-pendientes");
const lblAprobadas = document.getElementById("lbl-aprobadas");
const lblRechazadas = document.getElementById("lbl-rechazadas");

const panelMensaje = document.getElementById("panel-mensaje");
const msgSupervisor = document.getElementById("msg-supervisor");

// ---- Cargar solicitudes ----
function cargarSolicitudes() {
  try {
    const guardadas = localStorage.getItem("solicitudesAlmacen");
    if (guardadas) {
      solicitudes = JSON.parse(guardadas);
    }
  } catch (e) {
    console.warn("No se pudo leer solicitudesAlmacen de localStorage:", e);
  }

  // Si no hay nada, cargamos demo
  if (!solicitudes || solicitudes.length === 0) {
    solicitudes = [
      {
        codigo: "SOL-0001",
        fecha: "2025-11-30 09:15",
        tipo: "Reposición de stock",
        motivo: "Reposición de arroz y aceite - alto consumo.",
        prioridad: "alta",
        estado: "pendiente", // pendiente | aprobada | rechazada
        comentarioSupervisor: ""
      },
      {
        codigo: "SOL-0002",
        fecha: "2025-11-30 10:45",
        tipo: "Pedido especial",
        motivo: "Pedido corporativo de 50 canastas navideñas.",
        prioridad: "media",
        estado: "pendiente",
        comentarioSupervisor: ""
      },
      {
        codigo: "SOL-0003",
        fecha: "2025-11-30 11:30",
        tipo: "Reposición de stock",
        motivo: "Reposición de frutas y verduras frescas.",
        prioridad: "baja",
        estado: "aprobada",
        comentarioSupervisor: "Aprobado en turno anterior."
      }
    ];
  }

  renderSolicitudes();
}

function guardarSolicitudes() {
  try {
    localStorage.setItem("solicitudesAlmacen", JSON.stringify(solicitudes));
  } catch (e) {
    console.warn("No se pudo guardar solicitudesAlmacen:", e);
  }
}

// ---- Renderizar ----
function renderSolicitudes() {
  tbodySolicitudes.innerHTML = "";

  const texto = txtBuscar.value.trim().toLowerCase();
  const filtroE = filtroEstado.value;
  const filtroP = filtroPrioridad.value;

  let total = 0;
  let pendientes = 0;
  let aprobadas = 0;
  let rechazadas = 0;

  solicitudes.forEach((s, index) => {
    // Filtro texto
    const coincideTexto =
      s.codigo.toLowerCase().includes(texto) ||
      s.motivo.toLowerCase().includes(texto) ||
      s.tipo.toLowerCase().includes(texto);

    // Filtro estado
    const coincideEstado =
      filtroE === "todos" || filtroE === s.estado;

    // Filtro prioridad
    const coincidePrioridad =
      filtroP === "todas" || filtroP === s.prioridad;

    if (!coincideTexto || !coincideEstado || !coincidePrioridad) return;

    total++;
    if (s.estado === "pendiente") pendientes++;
    if (s.estado === "aprobada") aprobadas++;
    if (s.estado === "rechazada") rechazadas++;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.codigo}</td>
      <td>${s.fecha}</td>
      <td>${s.tipo}</td>
      <td>${s.motivo}</td>
      <td>${renderPrioridadBadge(s.prioridad)}</td>
      <td>${renderEstadoBadge(s.estado)}</td>
      <td>
        <button class="btn" data-accion="aprobar" data-index="${index}">
          Aprobar
        </button>
        <button class="btn btn-secondary" data-accion="rechazar" data-index="${index}">
          Rechazar
        </button>
      </td>
    `;
    tbodySolicitudes.appendChild(tr);
  });

  // Resumen
  lblTotal.textContent = total;
  lblPendientes.textContent = pendientes;
  lblAprobadas.textContent = aprobadas;
  lblRechazadas.textContent = rechazadas;

  // Eventos botones
  tbodySolicitudes.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", manejarAccionSolicitud);
  });
}

function renderEstadoBadge(estado) {
  switch (estado) {
    case "aprobada":
      return `<span class="badge badge-aprobada">APROBADA</span>`;
    case "rechazada":
      return `<span class="badge badge-rechazada">RECHAZADA</span>`;
    default:
      return `<span class="badge badge-pendiente">PENDIENTE</span>`;
  }
}

function renderPrioridadBadge(prioridad) {
  switch (prioridad) {
    case "alta":
      return `<span class="badge-prioridad-alta badge">ALTA</span>`;
    case "media":
      return `<span class="badge-prioridad-media badge">MEDIA</span>`;
    default:
      return `<span class="badge-prioridad-baja badge">BAJA</span>`;
  }
}

// ---- Acciones Supervisor ----
function manejarAccionSolicitud(e) {
  const accion = e.target.getAttribute("data-accion");
  const index = parseInt(e.target.getAttribute("data-index"), 10);
  const sol = solicitudes[index];
  if (!sol) return;

  if (accion === "aprobar") {
    const comentario = prompt(
      "Comentario para el almacén (opcional):",
      "Solicitud aprobada. Proceder con el pedido."
    );
    sol.estado = "aprobada";
    sol.comentarioSupervisor = comentario || "";
    mostrarMensaje(`Solicitud ${sol.codigo} aprobada.`);
  } else if (accion === "rechazar") {
    const comentario = prompt(
      "Indique el motivo del rechazo:",
      "No se aprueba por falta de presupuesto."
    );
    sol.estado = "rechazada";
    sol.comentarioSupervisor = comentario || "";
    mostrarMensaje(`Solicitud ${sol.codigo} rechazada.`);
  }

  guardarSolicitudes();
  renderSolicitudes();
}

function mostrarMensaje(texto) {
  msgSupervisor.textContent = texto;
  panelMensaje.style.display = "block";

  setTimeout(() => {
    panelMensaje.style.display = "none";
  }, 3500);
}

// ---- Filtros ----
txtBuscar.addEventListener("input", renderSolicitudes);
filtroEstado.addEventListener("change", renderSolicitudes);
filtroPrioridad.addEventListener("change", renderSolicitudes);

// ---- Inicio ----
cargarSolicitudes();

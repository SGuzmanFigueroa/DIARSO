let solicitudes = [];

const form = document.getElementById("form-solicitud");
const tbody = document.getElementById("tbody-lista");

const panelMsg = document.getElementById("panel-msg");
const msg = document.getElementById("msg");

// === Cargar solicitudes guardadas o crear si no hay
function cargarSolicitudes() {
  const data = localStorage.getItem("solicitudesAlmacen");

  if (data) {
    solicitudes = JSON.parse(data);
  } else {
    solicitudes = []; // vacío inicialmente
  }

  render();
}

// === Guardar en localStorage
function guardar() {
  localStorage.setItem("solicitudesAlmacen", JSON.stringify(solicitudes));
}

// === Renderizar tabla
function render() {
  tbody.innerHTML = "";

  solicitudes.forEach(s => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${s.codigo}</td>
      <td>${s.fecha}</td>
      <td>${s.tipo}</td>
      <td>${s.motivo}</td>
      <td>${renderPrioridad(s.prioridad)}</td>
      <td>${renderEstado(s.estado)}</td>
      <td>${s.comentarioSupervisor || "-"}</td>
    `;

    tbody.appendChild(tr);
  });
}

function renderPrioridad(p) {
  if (p === "alta") return `<span class="badge badge-prioridad alta">Alta</span>`;
  if (p === "media") return `<span class="badge badge-prioridad media">Media</span>`;
  return `<span class="badge badge-prioridad baja">Baja</span>`;
}

function renderEstado(e) {
  if (e === "pendiente") return `<span class="badge badge-pendiente">Pendiente</span>`;
  if (e === "aprobada") return `<span class="badge badge-aprobada">Aprobada</span>`;
  return `<span class="badge badge-rechazada">Rechazada</span>`;
}

// === Crear solicitud
form.addEventListener("submit", e => {
  e.preventDefault();

  const tipo = document.getElementById("tipo").value;
  const motivo = document.getElementById("motivo").value.trim();
  const prioridad = document.getElementById("prioridad").value;

  if (!motivo) {
    alert("El motivo es obligatorio.");
    return;
  }

  const codigo = "SOL-" + String(solicitudes.length + 1).padStart(4, "0");

  const nueva = {
    codigo,
    fecha: new Date().toLocaleString(),
    tipo,
    motivo,
    prioridad,
    estado: "pendiente",
    comentarioSupervisor: ""
  };

  solicitudes.push(nueva);
  guardar();
  render();

  form.reset();

  mostrarMensaje(`Solicitud ${codigo} enviada al supervisor.`);
});

// === Mostrar mensaje
function mostrarMensaje(texto) {
  msg.textContent = texto;
  panelMsg.style.display = "block";

  setTimeout(() => {
    panelMsg.style.display = "none";
  }, 3000);
}

cargarSolicitudes();

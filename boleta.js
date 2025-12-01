// ========================= DATOS BASE =========================
// Pedidos y boletas se guardan en localStorage para simular la BD.

let pedidos = [];
let boletas = [];

// Cargar pedidos desde localStorage o ejemplos
function cargarPedidos() {
  const guardado = localStorage.getItem("pedidos_plazavea");
  if (guardado) {
    pedidos = JSON.parse(guardado);
  } else {
    // Ejemplos por si aún no integras con el módulo de pedidos/conformidad
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
        estado: "Listo para reparto",
        conformidad: "conforme",
        destino: "Chofer – reparto a domicilio",
        observaciones: "Sin incidencias.",
        boletaNumero: null
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
        estado: "Listo para recojo",
        conformidad: "conforme",
        destino: "Listo para recojo en tienda",
        observaciones: "",
        boletaNumero: null
      }
    ];
  }
}

// Guardar pedidos actualizados
function guardarPedidos() {
  localStorage.setItem("pedidos_plazavea", JSON.stringify(pedidos));
}

// Cargar boletas
function cargarBoletas() {
  const guardado = localStorage.getItem("boletas_recepcion");
  if (guardado) {
    boletas = JSON.parse(guardado);
  } else {
    boletas = [];
  }
}

// Guardar boletas
function guardarBoletas() {
  localStorage.setItem("boletas_recepcion", JSON.stringify(boletas));
}

// ========================= REFERENCIAS DOM =========================
const tbodyPendientes = document.getElementById("tbody-pendientes");
const resumenPendientes = document.getElementById("resumen-pendientes");

const tbodyBoletas = document.getElementById("tbody-boletas");
const resumenBoletas = document.getElementById("resumen-boletas");

const overlay = document.getElementById("overlay");
const detallePedidoDiv = document.getElementById("detalle-pedido");
const formBoleta = document.getElementById("form-boleta");

const boletaNumeroInput = document.getElementById("boleta-numero");
const boletaFechaInput = document.getElementById("boleta-fecha");
const boletaDespachadorInput = document.getElementById("boleta-despachador");
const boletaObservacionesInput = document.getElementById("boleta-observaciones");

let pedidoSeleccionado = null;

// ========================= UTILIDADES =========================

// Generar número de boleta tipo BR-0001
function generarNumeroBoleta() {
  const nro = boletas.length + 1;
  return "BR-" + String(nro).padStart(4, "0");
}

// Formatear fecha/hora legible
function formatearFecha(fecha) {
  const f = new Date(fecha);
  const dia = String(f.getDate()).padStart(2, "0");
  const mes = String(f.getMonth() + 1).padStart(2, "0");
  const anio = f.getFullYear();
  const hora = String(f.getHours()).padStart(2, "0");
  const min = String(f.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${anio} ${hora}:${min}`;
}

// ========================= RENDER PENDIENTES =========================
function pintarPendientes() {
  tbodyPendientes.innerHTML = "";

  const pendientes = pedidos.filter(
    p => p.conformidad === "conforme" && !p.boletaNumero
  );

  pendientes.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.cliente}</td>
      <td>${p.producto}</td>
      <td>${p.cantidad}</td>
      <td>${p.modalidad}</td>
      <td><span class="badge-conf badge-conforme">Conforme</span></td>
      <td>
        <button class="btn-tabla" onclick="abrirModal('${p.codigo}')">
          Emitir boleta
        </button>
      </td>
    `;
    tbodyPendientes.appendChild(tr);
  });

  resumenPendientes.textContent =
    pendientes.length === 0
      ? "No hay pedidos conformes pendientes de boleta."
      : `Pedidos pendientes de boleta: ${pendientes.length}`;
}

// ========================= RENDER BOLETAS =========================
function pintarBoletas() {
  tbodyBoletas.innerHTML = "";

  boletas.forEach(b => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.numero}</td>
      <td>${b.pedidoCodigo}</td>
      <td>${b.cliente}</td>
      <td>${formatearFecha(b.fecha)}</td>
      <td>${b.modalidad}</td>
      <td>${b.despachador}</td>
      <td>${b.observaciones || "-"}</td>
    `;
    tbodyBoletas.appendChild(tr);
  });

  resumenBoletas.textContent =
    `Total de boletas emitidas: ${boletas.length}`;
}

// ========================= MODAL =========================
function abrirModal(codigoPedido) {
  pedidoSeleccionado = pedidos.find(p => p.codigo === codigoPedido);
  if (!pedidoSeleccionado) return;

  const numero = generarNumeroBoleta();
  const ahora = new Date();

  detallePedidoDiv.innerHTML = `
    <p><b>Pedido:</b> ${pedidoSeleccionado.codigo}</p>
    <p><b>Cliente:</b> ${pedidoSeleccionado.cliente} (${pedidoSeleccionado.correo})</p>
    <p><b>Producto:</b> ${pedidoSeleccionado.producto} x ${pedidoSeleccionado.cantidad}</p>
    <p><b>Modalidad:</b> ${pedidoSeleccionado.modalidad}</p>
    <p><b>Destino:</b> ${pedidoSeleccionado.destino || "No especificado"}</p>
  `;

  boletaNumeroInput.value = numero;
  boletaFechaInput.value = formatearFecha(ahora);
  formBoleta.reset();
  boletaNumeroInput.value = numero;       // reset borra, así que lo fijamos de nuevo
  boletaFechaInput.value = formatearFecha(ahora);

  overlay.classList.remove("hidden");
}

function cerrarModal() {
  overlay.classList.add("hidden");
  pedidoSeleccionado = null;
}

// ========================= EMITIR BOLETA =========================
formBoleta.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!pedidoSeleccionado) return;

  const numero = boletaNumeroInput.value;
  const fecha = new Date();
  const despachador = boletaDespachadorInput.value.trim();
  const observaciones = boletaObservacionesInput.value.trim();

  if (!despachador) {
    alert("Ingrese el nombre del despachador.");
    return;
  }

  const nuevaBoleta = {
    numero,
    pedidoCodigo: pedidoSeleccionado.codigo,
    cliente: pedidoSeleccionado.cliente,
    fecha: fecha.toISOString(),
    modalidad: pedidoSeleccionado.modalidad,
    despachador,
    observaciones
  };

  boletas.push(nuevaBoleta);

  // Marcamos el pedido como que ya tiene boleta
  pedidoSeleccionado.boletaNumero = numero;

  guardarBoletas();
  guardarPedidos();

  pintarPendientes();
  pintarBoletas();
  cerrarModal();

  alert(`Boleta de recepción ${numero} emitida correctamente.`);
});

// ========================= INICIALIZACIÓN =========================
window.addEventListener("DOMContentLoaded", () => {
  cargarPedidos();
  cargarBoletas();
  pintarPendientes();
  pintarBoletas();
});

// Exponer funciones para el onclick del HTML
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;

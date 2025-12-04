// "BD" de pedidos para reportes.
// En un sistema real vendrían de la BD; aquí usamos localStorage + demo.
let pedidos = [];

// DOM
const fechaDesde = document.getElementById("fecha-desde");
const fechaHasta = document.getElementById("fecha-hasta");
const tipoReporte = document.getElementById("tipo-reporte");
const btnGenerar = document.getElementById("btn-generar");

const sumPedidos = document.getElementById("sum-pedidos");
const sumEntregados = document.getElementById("sum-entregados");
const sumPendientes = document.getElementById("sum-pendientes");
const sumCancelados = document.getElementById("sum-cancelados");
const sumMonto = document.getElementById("sum-monto");

const tbodyDetalle = document.getElementById("tbody-detalle");

// Cargar datos
function cargarPedidos() {
  try {
    const guardados = localStorage.getItem("reportesPedidos");
    if (guardados) {
      pedidos = JSON.parse(guardados);
    }
  } catch (e) {
    console.warn("No se pudo leer reportesPedidos:", e);
  }

  // Si no hay nada, generamos demo
  if (!pedidos || pedidos.length === 0) {
    pedidos = [
      {
        codigo: "PV-0001",
        fecha: "2025-11-28",
        cliente: "Juan Pérez",
        canal: "Online",
        estado: "entregado",
        monto: 120.5
      },
      {
        codigo: "PV-0002",
        fecha: "2025-11-28",
        cliente: "María López",
        canal: "Online",
        estado: "pendiente",
        monto: 75.9
      },
      {
        codigo: "PV-0003",
        fecha: "2025-11-29",
        cliente: "Carlos Díaz",
        canal: "Presencial",
        estado: "entregado",
        monto: 210.0
      },
      {
        codigo: "PV-0004",
        fecha: "2025-11-29",
        cliente: "Ana Torres",
        canal: "Online",
        estado: "cancelado",
        monto: 0
      },
      {
        codigo: "PV-0005",
        fecha: "2025-11-30",
        cliente: "Luis García",
        canal: "Online",
        estado: "proceso",
        monto: 89.5
      }
    ];
  }

  // Guardamos demo por si luego otros módulos quieren leerlo
  try {
    localStorage.setItem("reportesPedidos", JSON.stringify(pedidos));
  } catch (e) {
    console.warn("No se pudo guardar reportesPedidos:", e);
  }

  // Sugerimos fechas (mín y máx)
  if (pedidos.length > 0) {
    const fechas = pedidos.map(p => p.fecha);
    const minF = fechas.reduce((a, b) => (a < b ? a : b));
    const maxF = fechas.reduce((a, b) => (a > b ? a : b));
    fechaDesde.value = minF;
    fechaHasta.value = maxF;
  }

  generarReporte();
}

// Generar reporte según filtros
function generarReporte() {
  const desde = fechaDesde.value || "0000-01-01";
  const hasta = fechaHasta.value || "9999-12-31";
  const tipo = tipoReporte.value;

  let totalPedidos = 0;
  let entregados = 0;
  let pendientes = 0;
  let cancelados = 0;
  let montoTotal = 0;

  tbodyDetalle.innerHTML = "";

  pedidos.forEach(p => {
    if (p.fecha < desde || p.fecha > hasta) return;

    // Filtrado por tipo de reporte
    if (tipo === "pedidos") {
      // mostramos todos, pero el monto no se acumula
    } else if (tipo === "ventas") {
      // solo pedidos entregados (ventas concretadas)
      if (p.estado !== "entregado") return;
    }

    totalPedidos++;

    if (p.estado === "entregado") {
      entregados++;
      montoTotal += p.monto;
    } else if (p.estado === "pendiente" || p.estado === "proceso") {
      pendientes++;
    } else if (p.estado === "cancelado") {
      cancelados++;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.fecha}</td>
      <td>${p.cliente}</td>
      <td>${p.canal}</td>
      <td>${renderEstadoBadge(p.estado)}</td>
      <td>${p.monto.toFixed(2)}</td>
    `;
    tbodyDetalle.appendChild(tr);
  });

  sumPedidos.textContent = totalPedidos;
  sumEntregados.textContent = entregados;
  sumPendientes.textContent = pendientes;
  sumCancelados.textContent = cancelados;
  sumMonto.textContent = montoTotal.toFixed(2);
}

function renderEstadoBadge(estado) {
  switch (estado) {
    case "entregado":
      return `<span class="badge badge-entregado">ENTREGADO</span>`;
    case "cancelado":
      return `<span class="badge badge-cancelado">CANCELADO</span>`;
    case "proceso":
      return `<span class="badge badge-proceso">EN PROCESO</span>`;
    default:
      return `<span class="badge badge-pendiente">PENDIENTE</span>`;
  }
}

// Eventos
btnGenerar.addEventListener("click", generarReporte);

// Inicio
cargarPedidos();

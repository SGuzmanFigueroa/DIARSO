// LOGIN PARA ACCEDER AL CIERRE
const formLoginCierre = document.getElementById("form-login-cierre");
const loginError = document.getElementById("login-error");
const panelResumen = document.getElementById("panel-resumen");

formLoginCierre.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("cierre-user").value.trim().toUpperCase();
  const pass = document.getElementById("cierre-pass").value.trim();

  // Demo: CAJA01 / 1234
  if (user === "CAJA01" && pass === "1234") {
    loginError.classList.add("hidden");
    panelResumen.style.display = "block";
    cargarResumenCaja();
  } else {
    loginError.textContent = "Credenciales incorrectas.";
    loginError.classList.remove("hidden");
  }
});

// --- CARGA DE PAGOS Y RESUMEN ---

// Intenta leer pagos reales desde localStorage; si no hay, usa demo
function obtenerPagosDelDia() {
  let pagos = [];

  try {
    const almacenados = localStorage.getItem("pagosCaja");
    if (almacenados) {
      pagos = JSON.parse(almacenados);
    }
  } catch (e) {
    console.warn("No se pudo leer pagosCaja de localStorage:", e);
  }

  // Si no hay datos, cargamos DEMO
  if (!pagos || pagos.length === 0) {
    pagos = [
      {
        nroBoleta: "B00001234",
        fecha: "2025-11-30 10:15",
        dniCliente: "74563218",
        metodoPago: "efectivo",
        total: 45.60
      },
      {
        nroBoleta: "B00001235",
        fecha: "2025-11-30 11:20",
        dniCliente: "70894512",
        metodoPago: "tarjeta",
        total: 89.90
      },
      {
        nroBoleta: "B00001236",
        fecha: "2025-11-30 12:05",
        dniCliente: "76543210",
        metodoPago: "yape",
        total: 23.50
      }
    ];
  }

  return pagos;
}

function cargarResumenCaja() {
  const pagos = obtenerPagosDelDia();

  const tbody = document.getElementById("tbody-pagos");
  tbody.innerHTML = "";

  let totalDia = 0;
  let totalEfectivo = 0;
  let totalTarjeta = 0;
  let totalYape = 0;

  pagos.forEach(p => {
    totalDia += p.total;

    switch (p.metodoPago) {
      case "efectivo":
        totalEfectivo += p.total;
        break;
      case "tarjeta":
        totalTarjeta += p.total;
        break;
      case "yape":
      case "plin":
        totalYape += p.total;
        break;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.nroBoleta}</td>
      <td>${p.fecha}</td>
      <td>${p.dniCliente}</td>
      <td>${p.metodoPago.toUpperCase()}</td>
      <td>${p.total.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });

  // Totales
  document.getElementById("lbl-cant-boletas").textContent = pagos.length;
  document.getElementById("lbl-total-dia").textContent =
    "S/ " + totalDia.toFixed(2);

  document.getElementById("lbl-total-efectivo").textContent =
    "S/ " + totalEfectivo.toFixed(2);
  document.getElementById("lbl-total-tarjeta").textContent =
    "S/ " + totalTarjeta.toFixed(2);
  document.getElementById("lbl-total-yape").textContent =
    "S/ " + totalYape.toFixed(2);

  // Último cierre
  const ultimo = localStorage.getItem("ultimoCierreCaja");
  document.getElementById("lbl-ultimo-cierre").textContent =
    ultimo ? ultimo : "No registrado";
}

// --- CONFIRMAR CIERRE ---
const btnConfirmarCierre = document.getElementById("btn-confirmar-cierre");
const msgCierre = document.getElementById("msg-cierre");

btnConfirmarCierre.addEventListener("click", () => {
  const ahora = new Date();
  const fechaStr = ahora.toLocaleString();

  // Guardamos la fecha/hora del último cierre
  try {
    localStorage.setItem("ultimoCierreCaja", fechaStr);
  } catch (e) {
    console.warn("No se pudo guardar ultimoCierreCaja:", e);
  }

  msgCierre.textContent = "Cierre de caja registrado a las " + fechaStr;
  msgCierre.classList.remove("hidden");

  alert("Cierre de caja realizado correctamente.\n" +
        "Resumen guardado (simulado).");
});

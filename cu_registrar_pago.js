// --- DEMO DE PRODUCTOS (simula tabla Producto) ---
const productos = [
  { codigo: "P001", nombre: "Leche Gloria 1L", precio: 4.50 },
  { codigo: "P002", nombre: "Arroz Extra 1Kg", precio: 3.20 },
  { codigo: "P003", nombre: "Aceite Primor 1L", precio: 8.90 },
  { codigo: "P004", nombre: "Gaseosa Inca Kola 1.5L", precio: 6.50 }
];

// Estado de sesión de caja y detalle de venta
let cajaAbierta = false;
let detalle = [];

// LOGIN CAJERO (simula CI_MenuPrincipal + CI_RegistrarPago)
const formLogin = document.getElementById("form-login");
const lblEstadoCaja = document.getElementById("lbl-estado-caja");
const btnCerrarCaja = document.getElementById("btn-cerrar-caja");
const panelPago = document.getElementById("panel-pago");

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("login-user").value.trim().toUpperCase();
  const pass = document.getElementById("login-pass").value.trim();

  // Demo: usuario CAJA01 / contraseña 1234
  if (user === "CAJA01" && pass === "1234") {
    cajaAbierta = true;
    lblEstadoCaja.textContent = "CAJA ABIERTA";
    lblEstadoCaja.classList.remove("badge-cerrada");
    lblEstadoCaja.classList.add("badge-abierta");

    // Habilitamos panel de pago
    panelPago.removeAttribute("aria-disabled");

    btnCerrarCaja.disabled = false;
    alert("Inicio de turno exitoso. Caja abierta.");
  } else {
    alert("Credenciales incorrectas.");
  }
});

// CIERRE DE CAJA (CI_CierreCaja)
btnCerrarCaja.addEventListener("click", () => {
  if (!cajaAbierta) return;

  cajaAbierta = false;
  lblEstadoCaja.textContent = "CAJA CERRADA";
  lblEstadoCaja.classList.remove("badge-abierta");
  lblEstadoCaja.classList.add("badge-cerrada");
  btnCerrarCaja.disabled = true;

  // Limpiamos info de pago
  detalle = [];
  renderDetalle();
  document.getElementById("lbl-total").textContent = "S/ 0.00";
  document.getElementById("fila-cambio").style.display = "none";
  document.getElementById("panel-boleta").style.display = "none";

  alert("Caja cerrada. Fin de turno.");
});

// --- REGISTRAR PAGO (CI_RegistrarPago + CC_Pago) ---

// Mostrar/ocultar monto recibido según método de pago
const selMetodo = document.getElementById("metodo-pago");
const grupoEfectivo = document.getElementById("grupo-efectivo");

selMetodo.addEventListener("change", () => {
  if (selMetodo.value === "efectivo") {
    grupoEfectivo.classList.remove("hidden");
  } else {
    grupoEfectivo.classList.add("hidden");
  }
});

// Agregar producto (escaneo)
const btnAgregar = document.getElementById("btn-agregar");
btnAgregar.addEventListener("click", () => {
  if (!cajaAbierta) {
    alert("Debe iniciar turno (abrir caja) antes de registrar pagos.");
    return;
  }

  const cod = document.getElementById("cod-producto").value.trim().toUpperCase();
  const cant = parseInt(document.getElementById("cant-producto").value, 10);

  if (!cod || isNaN(cant) || cant <= 0) {
    alert("Ingrese código y cantidad válida.");
    return;
  }

  const prod = productos.find(p => p.codigo === cod);
  if (!prod) {
    alert("Producto no encontrado. Use algún código de la demo: P001, P002...");
    return;
  }

  // Si el producto ya está en el detalle, sumamos cantidad
  const existente = detalle.find(d => d.codigo === cod);
  if (existente) {
    existente.cantidad += cant;
  } else {
    detalle.push({
      codigo: prod.codigo,
      nombre: prod.nombre,
      precio: prod.precio,
      cantidad: cant
    });
  }

  document.getElementById("cod-producto").value = "";
  document.getElementById("cant-producto").value = 1;

  renderDetalle();
});

// Dibujar detalle de productos (lista de DetalleVenta)
const tbodyDetalle = document.getElementById("tbody-detalle");

function renderDetalle() {
  tbodyDetalle.innerHTML = "";

  let total = 0;

  detalle.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.codigo}</td>
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>S/ ${item.precio.toFixed(2)}</td>
      <td>S/ ${subtotal.toFixed(2)}</td>
      <td><button class="btn btn-eliminar" data-index="${index}">X</button></td>
    `;
    tbodyDetalle.appendChild(tr);
  });

  document.getElementById("lbl-total").textContent = `S/ ${total.toFixed(2)}`;

  // Listeners para eliminar
  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.getAttribute("data-index"), 10);
      detalle.splice(idx, 1);
      renderDetalle();
    });
  });
}

// Confirmar pago
const btnConfirmar = document.getElementById("btn-confirmar");
const msgError = document.getElementById("msg-error");

btnConfirmar.addEventListener("click", () => {
  msgError.classList.add("hidden");
  msgError.textContent = "";

  if (!cajaAbierta) {
    msgError.textContent = "La caja está cerrada. Inicie turno primero.";
    msgError.classList.remove("hidden");
    return;
  }

  const dni = document.getElementById("dni-cliente").value.trim();
  const codTrab = document.getElementById("cod-trabajador").value.trim();
  const metodo = selMetodo.value;
  const total = calcularTotal();

  if (!dni || dni.length !== 8) {
    msgError.textContent = "Ingrese DNI válido de 8 dígitos.";
    msgError.classList.remove("hidden");
    return;
  }

  if (!codTrab) {
    msgError.textContent = "Ingrese código de trabajador (cajero).";
    msgError.classList.remove("hidden");
    return;
  }

  if (detalle.length === 0) {
    msgError.textContent = "Debe agregar al menos un producto.";
    msgError.classList.remove("hidden");
    return;
  }

  if (!metodo) {
    msgError.textContent = "Seleccione un método de pago.";
    msgError.classList.remove("hidden");
    return;
  }

  let cambio = 0;

  if (metodo === "efectivo") {
    const montoRecibido = parseFloat(
      document.getElementById("monto-recibido").value
    );
    if (isNaN(montoRecibido) || montoRecibido < total) {
      msgError.textContent = "Monto recibido insuficiente.";
      msgError.classList.remove("hidden");
      return;
    }
    cambio = montoRecibido - total;
    document.getElementById("fila-cambio").style.display = "flex";
    document.getElementById("lbl-cambio").textContent =
      `S/ ${cambio.toFixed(2)}`;
  } else {
    document.getElementById("fila-cambio").style.display = "none";
  }

  // Si todo ok, generamos "Pago" y "Boleta"
  generarBoleta({
    fecha: new Date(),
    dniCliente: dni,
    codTrabajador: codTrab,
    metodoPago: metodo,
    total,
    cambio,
    detalle: [...detalle]
  });

  alert("Pago registrado correctamente.");
});

// Calcula total actual
function calcularTotal() {
  return detalle.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

// --- Generación de boleta (CI_CierreCaja muestra resumen) ---
const panelBoleta = document.getElementById("panel-boleta");
const boletaContenido = document.getElementById("boleta-contenido");

function generarBoleta(pago) {
  panelBoleta.style.display = "block";

  const fecha = pago.fecha.toLocaleString();
  const nroBoleta = "B" + Date.now().toString().slice(-8);

  let html = `
    <div class="boleta-header">
      <div>
        <strong>Plaza Vea – Boleta</strong><br>
        RUC 20123456789<br>
        Av. Demo 123 – Lima
      </div>
      <div style="text-align:right;">
        <strong>N° ${nroBoleta}</strong><br>
        Fecha: ${fecha}
      </div>
    </div>

    <p><strong>DNI Cliente:</strong> ${pago.dniCliente}</p>
    <p><strong>Cajero:</strong> ${pago.codTrabajador}</p>
    <p><strong>Método de pago:</strong> ${pago.metodoPago.toUpperCase()}</p>

    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Producto</th>
          <th>Cant.</th>
          <th>P. Unit</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
  `;

  pago.detalle.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    html += `
      <tr>
        <td>${item.codigo}</td>
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>S/ ${item.precio.toFixed(2)}</td>
        <td>S/ ${subtotal.toFixed(2)}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>

    <div class="boleta-total">
      Total: S/ ${pago.total.toFixed(2)}<br>
  `;

  if (pago.metodoPago === "efectivo") {
    html += `Cambio: S/ ${pago.cambio.toFixed(2)}<br>`;
  }

  html += `
      <br><em>Gracias por su compra.</em>
    </div>
  `;

  boletaContenido.innerHTML = html;
}

// Simula impresión de boleta
function imprimirBoleta() {
  window.print();
}

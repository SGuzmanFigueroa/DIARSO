// ===============================
// pedido.js
// Lee carrito_plazavea de localStorage
// y lo muestra en la tabla del pedido
// ===============================

const STORAGE_KEY = "carrito_plazavea";
let carritoPedido = [];

// ---- CARRITO DESDE STORAGE ----
function cargarCarritoDesdeStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  carritoPedido = data ? JSON.parse(data) : [];
}

function guardarCarritoEnStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carritoPedido));
}

// ---- PINTAR TABLA ----
function pintarTablaCarrito() {
  const tbody = document.querySelector("#tabla-carrito tbody");
  const totalSpan = document.getElementById("total-carrito");
  if (!tbody || !totalSpan) return;

  tbody.innerHTML = "";
  let total = 0;

  if (!carritoPedido || carritoPedido.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">No hay productos en el carrito. Vuelve al catálogo.</td>
      </tr>
    `;
    totalSpan.textContent = "Total: S/ 0.00";
    return;
  }

  carritoPedido.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>S/ ${item.precio.toFixed(2)}</td>
      <td>S/ ${subtotal.toFixed(2)}</td>
      <td>
        <button class="btn-menos" data-index="${index}">-</button>
        <button class="btn-mas" data-index="${index}">+</button>
        <button class="btn-eliminar" data-index="${index}">🗑</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  totalSpan.textContent = `Total: S/ ${total.toFixed(2)}`;
}

// ---- CAMBIAR CANTIDAD / ELIMINAR ----
function cambiarCantidad(index, delta) {
  const item = carritoPedido[index];
  if (!item) return;

  const nuevo = item.cantidad + delta;
  if (nuevo <= 0) {
    carritoPedido.splice(index, 1);
  } else {
    item.cantidad = nuevo;
  }
  guardarCarritoEnStorage();
  pintarTablaCarrito();
  actualizarResumen();
}

function eliminarItemPedido(index) {
  carritoPedido.splice(index, 1);
  guardarCarritoEnStorage();
  pintarTablaCarrito();
  actualizarResumen();
}

// ---- MÉTODO DE PAGO ----
function actualizarSeccionPago() {
  const metodo = document.getElementById("pago-metodo")?.value;
  const secTarjeta = document.getElementById("pago-tarjeta");
  const secYape   = document.getElementById("pago-yape");
  const secContra = document.getElementById("pago-contra");

  if (secTarjeta) secTarjeta.classList.add("hidden");
  if (secYape) secYape.classList.add("hidden");
  if (secContra) secContra.classList.add("hidden");

  if (metodo === "tarjeta" && secTarjeta) secTarjeta.classList.remove("hidden");
  if (metodo === "yape" && secYape) secYape.classList.remove("hidden");
  if (metodo === "contra-entrega" && secContra) secContra.classList.remove("hidden");
}

// ---- RESUMEN ----
function actualizarResumen() {
  const resumen = document.getElementById("resumen-pedido");
  if (!resumen) return;

  if (!carritoPedido || carritoPedido.length === 0) {
    resumen.textContent = "No hay productos en el carrito.";
    return;
  }

  const nombre   = document.getElementById("cli-nombre")?.value || "";
  const correo   = document.getElementById("cli-correo")?.value || "";
  const telefono = document.getElementById("cli-telefono")?.value || "";
  const dni      = document.getElementById("cli-dni")?.value || "";

  const modalidad = document.getElementById("ent-modalidad")?.value || "";
  const ciudad    = document.getElementById("ent-ciudad")?.value || "";
  const direccion = document.getElementById("ent-direccion")?.value || "";

  const metodoPago = document.getElementById("pago-metodo")?.value || "";

  const total = carritoPedido.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const listaProductos = carritoPedido
    .map(
      item =>
        `<li>${item.cantidad} x ${item.nombre} — S/ ${(item.precio * item.cantidad).toFixed(2)}</li>`
    )
    .join("");

  resumen.innerHTML = `
    <h3>Resumen del pedido</h3>
    <h4>Cliente</h4>
    <p><b>Nombre:</b> ${nombre || "(sin completar)"}</p>
    <p><b>Correo:</b> ${correo || "(sin completar)"}</p>
    <p><b>Teléfono:</b> ${telefono || "(sin completar)"}</p>
    <p><b>DNI:</b> ${dni || "(opcional)"}</p>

    <h4>Entrega</h4>
    <p><b>Modalidad:</b> ${modalidad || "(sin seleccionar)"}</p>
    <p><b>Ciudad / Distrito:</b> ${ciudad || "(sin completar)"}</p>
    <p><b>Dirección:</b> ${direccion || "(si es a domicilio, completa la dirección)"}</p>

    <h4>Productos</h4>
    <ul>${listaProductos}</ul>

    <p><b>Total:</b> S/ ${total.toFixed(2)}</p>

    <h4>Método de pago</h4>
    <p>${
      metodoPago
        ? `Seleccionado: <b>${metodoPago}</b>`
        : "Aún no has seleccionado un método de pago."
    }</p>
  `;
}

// ---- VALIDAR Y CONFIRMAR ----
function validarYConfirmar() {
  if (!carritoPedido || carritoPedido.length === 0) {
    alert("No hay productos en el carrito.");
    return;
  }

  const nombre   = document.getElementById("cli-nombre")?.value.trim();
  const correo   = document.getElementById("cli-correo")?.value.trim();
  const telefono = document.getElementById("cli-telefono")?.value.trim();
  const modalidad = document.getElementById("ent-modalidad")?.value;
  const ciudad    = document.getElementById("ent-ciudad")?.value.trim();
  const direccion = document.getElementById("ent-direccion")?.value.trim();
  const metodoPago = document.getElementById("pago-metodo")?.value;

  if (!nombre || !correo || !telefono) {
    alert("Completa los datos básicos del cliente.");
    return;
  }
  if (!modalidad) {
    alert("Selecciona una modalidad de entrega.");
    return;
  }
  if (!ciudad) {
    alert("Ingresa el distrito / ciudad.");
    return;
  }
  if (modalidad === "Entrega a domicilio" && !direccion) {
    alert("Ingresa la dirección para entrega a domicilio.");
    return;
  }
  if (!metodoPago) {
    alert("Selecciona un método de pago.");
    return;
  }

  if (metodoPago === "tarjeta") {
    const num   = document.getElementById("tarjeta-numero")?.value.trim();
    const nom   = document.getElementById("tarjeta-nombre")?.value.trim();
    const fecha = document.getElementById("tarjeta-fecha")?.value.trim();
    const cvv   = document.getElementById("tarjeta-cvv")?.value.trim();
    if (!num || !nom || !fecha || !cvv) {
      alert("Completa todos los datos de la tarjeta.");
      return;
    }
  }

  if (metodoPago === "yape") {
    const cel = document.getElementById("yape-celular")?.value.trim();
    if (!cel) {
      alert("Ingresa el celular asociado a Yape/Plin.");
      return;
    }
  }

  actualizarResumen();
  alert("✅ Pedido registrado (simulación).");
  carritoPedido = [];
  guardarCarritoEnStorage();
  pintarTablaCarrito();
  actualizarResumen();
}

// ---- INIT ----
document.addEventListener("DOMContentLoaded", () => {
  cargarCarritoDesdeStorage();
  pintarTablaCarrito();
  actualizarResumen();

  // Eventos tabla
  const tbody = document.querySelector("#tabla-carrito tbody");
  if (tbody) {
    tbody.addEventListener("click", (e) => {
      const menos = e.target.closest(".btn-menos");
      const mas = e.target.closest(".btn-mas");
      const eliminar = e.target.closest(".btn-eliminar");

      if (menos) {
        const index = Number(menos.getAttribute("data-index"));
        cambiarCantidad(index, -1);
      } else if (mas) {
        const index = Number(mas.getAttribute("data-index"));
        cambiarCantidad(index, +1);
      } else if (eliminar) {
        const index = Number(eliminar.getAttribute("data-index"));
        eliminarItemPedido(index);
      }
    });
  }

  // Método de pago
  const selMetodo = document.getElementById("pago-metodo");
  if (selMetodo) {
    selMetodo.addEventListener("change", actualizarSeccionPago);
    actualizarSeccionPago();
  }

  // Botones resumen / confirmar
  const btnActualizar = document.getElementById("btn-actualizar-resumen");
  if (btnActualizar) {
    btnActualizar.addEventListener("click", (e) => {
      e.preventDefault();
      actualizarResumen();
    });
  }

  const btnConfirmar = document.getElementById("btn-confirmar");
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", (e) => {
      e.preventDefault();
      validarYConfirmar();
    });
  }

  // Desactivar selección manual de productos en esta página
  const selectProd = document.getElementById("prod-select");
  const inputCant = document.getElementById("prod-cantidad");
  const btnAgregar = document.getElementById("btn-agregar");

  if (selectProd) selectProd.disabled = true;
  if (inputCant) inputCant.disabled = true;
  if (btnAgregar) btnAgregar.style.display = "none";
});

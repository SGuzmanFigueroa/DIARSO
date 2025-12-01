// ===============================
// pedido.js
// Registrar Pedido Online usando
// exclusivamente el carrito guardado
// en localStorage por el catálogo
// ===============================

(() => {
  const STORAGE_KEY = "carritoPlazaVea";
  let carritoPedido = [];

  // --------- CARRITO DESDE LOCALSTORAGE ---------
  function cargarCarritoDesdeStorage() {
    const guardado = localStorage.getItem(STORAGE_KEY);
    carritoPedido = guardado ? JSON.parse(guardado) : [];
  }

  function guardarCarritoEnStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carritoPedido));
  }

  function pintarTablaCarrito() {
    const tbody = document.querySelector("#tabla-carrito tbody");
    const totalSpan = document.getElementById("total-carrito");

    if (!tbody || !totalSpan) return;

    tbody.innerHTML = "";
    let total = 0;

    if (!carritoPedido || carritoPedido.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">No hay productos en el carrito. Vuelve al catálogo para agregar productos.</td>
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

  function cambiarCantidad(index, delta) {
    const item = carritoPedido[index];
    if (!item) return;

    const nuevoValor = item.cantidad + delta;
    if (nuevoValor <= 0) {
      carritoPedido.splice(index, 1);
    } else {
      item.cantidad = nuevoValor;
    }

    guardarCarritoEnStorage();
    pintarTablaCarrito();
    actualizarResumen();
  }

  function eliminarItem(index) {
    carritoPedido.splice(index, 1);
    guardarCarritoEnStorage();
    pintarTablaCarrito();
    actualizarResumen();
  }

  // --------- MANEJO DE MÉTODO DE PAGO ---------
  function actualizarSeccionPago() {
    const selectMetodo = document.getElementById("pago-metodo");
    const seccionTarjeta = document.getElementById("pago-tarjeta");
    const seccionYape = document.getElementById("pago-yape");
    const seccionContra = document.getElementById("pago-contra");

    if (!selectMetodo) return;

    const valor = selectMetodo.value;

    if (seccionTarjeta) seccionTarjeta.classList.add("hidden");
    if (seccionYape) seccionYape.classList.add("hidden");
    if (seccionContra) seccionContra.classList.add("hidden");

    if (valor === "tarjeta" && seccionTarjeta) {
      seccionTarjeta.classList.remove("hidden");
    } else if (valor === "yape" && seccionYape) {
      seccionYape.classList.remove("hidden");
    } else if (valor === "contra-entrega" && seccionContra) {
      seccionContra.classList.remove("hidden");
    }
  }

  // --------- RESUMEN DEL PEDIDO ---------
  function actualizarResumen() {
    const resumenDiv = document.getElementById("resumen-pedido");
    if (!resumenDiv) return;

    if (!carritoPedido || carritoPedido.length === 0) {
      resumenDiv.textContent =
        "No hay productos en el carrito. Vuelve al catálogo para agregar productos.";
      return;
    }

    const nombre = document.getElementById("cli-nombre")?.value || "";
    const correo = document.getElementById("cli-correo")?.value || "";
    const telefono = document.getElementById("cli-telefono")?.value || "";
    const dni = document.getElementById("cli-dni")?.value || "";

    const modalidad = document.getElementById("ent-modalidad")?.value || "";
    const ciudad = document.getElementById("ent-ciudad")?.value || "";
    const direccion = document.getElementById("ent-direccion")?.value || "";

    const metodoPago = document.getElementById("pago-metodo")?.value || "";

    let total = carritoPedido.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );

    const listaProductos = carritoPedido
      .map(
        (item) =>
          `<li>${item.cantidad} x ${item.nombre} — S/ ${(item.precio * item.cantidad).toFixed(2)}</li>`
      )
      .join("");

    resumenDiv.innerHTML = `
      <h3>Resumen del pedido</h3>
      <h4>Cliente</h4>
      <p><b>Nombre:</b> ${nombre || "(sin completar)"}</p>
      <p><b>Correo:</b> ${correo || "(sin completar)"}</p>
      <p><b>Teléfono:</b> ${telefono || "(sin completar)"}</p>
      <p><b>DNI:</b> ${dni || "(opcional)"}</p>

      <h4>Entrega</h4>
      <p><b>Modalidad:</b> ${modalidad || "(sin seleccionar)"}</p>
      <p><b>Ciudad / Distrito:</b> ${ciudad || "(sin completar)"}</p>
      <p><b>Dirección:</b> ${
        direccion || "(si es a domicilio, ingresa la dirección)"
      }</p>

      <h4>Productos</h4>
      <ul>
        ${listaProductos}
      </ul>

      <p><b>Total:</b> S/ ${total.toFixed(2)}</p>

      <h4>Método de pago</h4>
      <p>${
        metodoPago
          ? `Seleccionado: <b>${metodoPago}</b>`
          : "Aún no has seleccionado un método de pago."
      }</p>
    `;
  }

  // --------- VALIDACIÓN BÁSICA ---------
  function validarFormularioBasico() {
    if (!carritoPedido || carritoPedido.length === 0) {
      alert(
        "No hay productos en el carrito. Debes agregar productos desde el catálogo."
      );
      return false;
    }

    const nombre = document.getElementById("cli-nombre")?.value.trim();
    const correo = document.getElementById("cli-correo")?.value.trim();
    const telefono = document.getElementById("cli-telefono")?.value.trim();
    const modalidad = document.getElementById("ent-modalidad")?.value;
    const ciudad = document.getElementById("ent-ciudad")?.value.trim();
    const direccion = document.getElementById("ent-direccion")?.value.trim();
    const metodoPago = document.getElementById("pago-metodo")?.value;

    if (!nombre || !correo || !telefono) {
      alert("Por favor completa los datos básicos del cliente.");
      return false;
    }

    if (!modalidad) {
      alert("Selecciona una modalidad de entrega.");
      return false;
    }

    if (!ciudad) {
      alert("Ingresa el distrito o ciudad para la entrega.");
      return false;
    }

    if (modalidad === "Entrega a domicilio" && !direccion) {
      alert("Ingresa la dirección para la entrega a domicilio.");
      return false;
    }

    if (!metodoPago) {
      alert("Selecciona un método de pago.");
      return false;
    }

    // Validaciones específicas por método de pago (simples)
    if (metodoPago === "tarjeta") {
      const num = document.getElementById("tarjeta-numero")?.value.trim();
      const nom = document.getElementById("tarjeta-nombre")?.value.trim();
      const fecha = document.getElementById("tarjeta-fecha")?.value.trim();
      const cvv = document.getElementById("tarjeta-cvv")?.value.trim();

      if (!num || !nom || !fecha || !cvv) {
        alert("Completa todos los campos de la tarjeta.");
        return false;
      }
    } else if (metodoPago === "yape") {
      const cel = document.getElementById("yape-celular")?.value.trim();
      if (!cel) {
        alert("Ingresa el celular asociado a Yape/Plin.");
        return false;
      }
    }

    return true;
  }

  // --------- CONFIRMAR PEDIDO (DEMO) ---------
  function confirmarPedido() {
    if (!validarFormularioBasico()) return;

    actualizarResumen();

    alert(
      "✅ Pedido registrado (simulación).\nEn un sistema real, aquí se enviaría la información al servidor."
    );

    // Limpiar carrito (porque ya se "registró" el pedido)
    carritoPedido = [];
    guardarCarritoEnStorage();
    pintarTablaCarrito();
    actualizarResumen();
  }

  // --------- INIT ---------
  document.addEventListener("DOMContentLoaded", () => {
    // Cargar carrito y dibujar
    cargarCarritoDesdeStorage();
    pintarTablaCarrito();
    actualizarResumen();

    // Eventos en la tabla del carrito
    const tbody = document.querySelector("#tabla-carrito tbody");
    if (tbody) {
      tbody.addEventListener("click", (e) => {
        const btnMas = e.target.closest(".btn-mas");
        const btnMenos = e.target.closest(".btn-menos");
        const btnEliminar = e.target.closest(".btn-eliminar");

        if (btnMas) {
          const index = Number(btnMas.getAttribute("data-index"));
          cambiarCantidad(index, +1);
        } else if (btnMenos) {
          const index = Number(btnMenos.getAttribute("data-index"));
          cambiarCantidad(index, -1);
        } else if (btnEliminar) {
          const index = Number(btnEliminar.getAttribute("data-index"));
          eliminarItem(index);
        }
      });
    }

    // Método de pago
    const selectMetodo = document.getElementById("pago-metodo");
    if (selectMetodo) {
      selectMetodo.addEventListener("change", actualizarSeccionPago);
      actualizarSeccionPago(); // Estado inicial
    }

    // Botón actualizar resumen
    const btnActualizar = document.getElementById("btn-actualizar-resumen");
    if (btnActualizar) {
      btnActualizar.addEventListener("click", (e) => {
        e.preventDefault();
        actualizarResumen();
      });
    }

    // Botón confirmar pedido
    const btnConfirmar = document.getElementById("btn-confirmar");
    if (btnConfirmar) {
      btnConfirmar.addEventListener("click", (e) => {
        e.preventDefault();
        confirmarPedido();
      });
    }

    // 🔒 Desactivar seleccionar productos manualmente en esta página
    const selectProd = document.getElementById("prod-select");
    const inputCant = document.getElementById("prod-cantidad");
    const btnAgregar = document.getElementById("btn-agregar");

    if (selectProd) selectProd.disabled = true;
    if (inputCant) inputCant.disabled = true;
    if (btnAgregar) btnAgregar.style.display = "none";
  });
})();

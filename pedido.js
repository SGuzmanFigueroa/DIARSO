// ================= BASE DE DATOS (SIMULADA) =================
const productos = [
  { id: 'P001', nombre: 'Leche Gloria 1L', precio: 5.50, stock: 10 },
  { id: 'P002', nombre: 'Arroz Costeño 5kg', precio: 25.00, stock: 8 },
  { id: 'P003', nombre: 'Aceite Primor 1L', precio: 12.00, stock: 12 },
  { id: 'P004', nombre: 'Huevos x 15 und', precio: 9.90, stock: 6 },
  { id: 'P005', nombre: 'Azúcar rubia 1kg', precio: 4.80, stock: 15 }
];

const selectProducto = document.getElementById('prod-select');
const inputCantidad  = document.getElementById('prod-cantidad');
const tablaCarrito   = document.querySelector('#tabla-carrito tbody');
const totalCarritoEl = document.getElementById('total-carrito');

const metodoPagoSel  = document.getElementById('pago-metodo');
const pagoTarjetaDiv = document.getElementById('pago-tarjeta');
const pagoYapeDiv    = document.getElementById('pago-yape');
const pagoContraDiv  = document.getElementById('pago-contra');

const resumenDiv = document.getElementById('resumen-pedido');

let carrito = [];
let contadorPedido = 1;

// ================= Cargar productos =================
function cargarProductos() {
  productos.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.nombre} – S/ ${p.precio.toFixed(2)} (Stock: ${p.stock})`;
    selectProducto.appendChild(opt);
  });
}
cargarProductos();

// ================= Agregar al carrito =================
document.getElementById('btn-agregar').addEventListener('click', () => {
  const idProd = selectProducto.value;
  const cant   = parseInt(inputCantidad.value, 10);

  if (!idProd) return alert('Selecciona un producto.');
  if (!cant || cant <= 0) return alert('Cantidad inválida.');

  const prod = productos.find(p => p.id === idProd);
  const cantCarrito = carrito.filter(i => i.id === idProd)
                             .reduce((acc,i)=>acc+i.cantidad,0);

  if (cant + cantCarrito > prod.stock)
    return alert(`Stock insuficiente. Disponible: ${prod.stock - cantCarrito}`);

  carrito.push({
    id: prod.id,
    nombre: prod.nombre,
    cantidad: cant,
    precio: prod.precio
  });

  pintarCarrito();
});

function pintarCarrito() {
  tablaCarrito.innerHTML = '';
  let total = 0;

  carrito.forEach((item, i) => {
    const subtotal = item.cantidad * item.precio;
    total += subtotal;

    tablaCarrito.innerHTML += `
      <tr>
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>S/ ${item.precio.toFixed(2)}</td>
        <td>S/ ${subtotal.toFixed(2)}</td>
        <td><button class="btn btn-sec" data-index="${i}">Eliminar</button></td>
      </tr>
    `;
  });

  totalCarritoEl.textContent = `Total: S/ ${total.toFixed(2)}`;
}

// eliminar
tablaCarrito.addEventListener('click', e => {
  if (e.target.matches('button[data-index]')) {
    carrito.splice(e.target.dataset.index, 1);
    pintarCarrito();
  }
});

// ================= Cambiar método de pago =================
metodoPagoSel.addEventListener('change', () => {
  pagoTarjetaDiv.classList.add('hidden');
  pagoYapeDiv.classList.add('hidden');
  pagoContraDiv.classList.add('hidden');

  if (metodoPagoSel.value === 'tarjeta') pagoTarjetaDiv.classList.remove('hidden');
  if (metodoPagoSel.value === 'yape')    pagoYapeDiv.classList.remove('hidden');
  if (metodoPagoSel.value === 'contra-entrega') pagoContraDiv.classList.remove('hidden');
});

// ================= Generar resumen =================
function generarResumen() {
  if (carrito.length === 0) {
    return resumenDiv.textContent = "Carrito vacío.";
  }

  const nombre = document.getElementById('cli-nombre').value.trim();
  const correo = document.getElementById('cli-correo').value.trim();
  const telefono = document.getElementById('cli-telefono').value.trim();

  const modalidad = document.getElementById('ent-modalidad').value;
  const ciudad = document.getElementById('ent-ciudad').value.trim();
  const direccion = document.getElementById('ent-direccion').value.trim();

  const metodo = metodoPagoSel.value || "(no seleccionado)";

  let total = carrito.reduce((a, b) => a + b.cantidad * b.precio, 0);

  let html = `
    <strong>Cliente:</strong><br>
    ${nombre || "(sin nombre)"} / ${correo || "(sin correo)"}<br><br>

    <strong>Entrega:</strong><br>
    ${modalidad}<br>
    Dirección: ${modalidad === "Entrega a domicilio" ? (direccion || "(falta dirección)") : "No aplica"}<br><br>

    <strong>Productos:</strong><br>
  `;

  carrito.forEach(item => {
    html += `• ${item.nombre} x ${item.cantidad} = S/ ${(item.cantidad * item.precio).toFixed(2)}<br>`;
  });

  html += `<br><strong>Total:</strong> S/ ${total.toFixed(2)}<br>`;
  html += `<strong>Método de pago:</strong> ${metodo.toUpperCase()}`;

  resumenDiv.innerHTML = html;
}

document.getElementById('btn-actualizar-resumen').addEventListener('click', generarResumen);

// ================= Confirmar pedido =================
document.getElementById('btn-confirmar').addEventListener('click', () => {

  if (!document.getElementById('cli-nombre').value.trim() ||
      !document.getElementById('cli-correo').value.trim())
    return alert("Completa tus datos.");

  if (carrito.length === 0) return alert("Carrito vacío.");
  if (!metodoPagoSel.value) return alert("Selecciona método de pago.");

  generarResumen();

  const codigo = "PV-" + String(contadorPedido++).padStart(4,"0");

  alert(`✔ Pedido ${codigo} registrado (simulación).\nTu pedido está en proceso.`);

  carrito = [];
  pintarCarrito();
});

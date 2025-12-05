// ===================== DATOS DE PRODUCTOS =====================
const productos = [
  {
    id: "P001",
    nombre: "Tomate Italiano x kg",
    marca: "PLAZA VEA",
    categoria: "Frutas y Verduras",
    unidad: "1 Und. ≈ 0.25 kg",
    precioAnterior: 6.49,
    precioOferta: 5.80,
    descuento: 10,
    img: "img/tomateitaliano.jpg"
  },
  {
    id: "P002",
    nombre: "Papa Amarilla x kg",
    marca: "PLAZA VEA",
    categoria: "Frutas y Verduras",
    unidad: "1 Und. ≈ 1 kg",
    precioAnterior: 6.89,
    precioOferta: 5.48,
    descuento: 20,
    img: "img/papaamarilla.jpg"
  },
  {
    id: "P003",
    nombre: "Leche Gloria Entera 1L",
    marca: "GLORIA",
    categoria: "Lácteos",
    unidad: "1 Und. = 1L",
    precioAnterior: 5.80,
    precioOferta: 4.90,
    descuento: 15,
    img: "img/lechegloriaentera1l.png"
  },
  {
    id: "P004",
    nombre: "Arroz Costeño Superior 5kg",
    marca: "COSTEÑO",
    categoria: "Abarrotes",
    unidad: "1 Und. = 5kg",
    precioAnterior: 28.90,
    precioOferta: 25.50,
    descuento: 12,
    img: "img/Arroz Costeño Superior 5kg.png"
  },
  {
    id: "P005",
    nombre: "Aceite Primor 1L",
    marca: "PRIMOR",
    categoria: "Abarrotes",
    unidad: "1 Und. = 1L",
    precioAnterior: 14.00,
    precioOferta: 11.90,
    descuento: 15,
    img: "img/Aceite Primor 1L.jpg"
  },
  {
    id: "P006",
    nombre: "Gaseosa Inca Kola 1.5L",
    marca: "INCA KOLA",
    categoria: "Bebidas",
    unidad: "1 Und. = 1.5L",
    precioAnterior: 6.50,
    precioOferta: 5.50,
    descuento: 15,
    img: "img/Gaseosa Inca Kola 1.5L.jpg"
  },
  {
    id: "P007",
    nombre: "Yogurt Laive Fresa 1L",
    marca: "LAIVE",
    categoria: "Lácteos",
    unidad: "1 Und. = 1L",
    precioAnterior: 8.50,
    precioOferta: 7.20,
    descuento: 15,
    img: "img/Yogurt Laive Fresa 1L.png"
  },
  {
    id: "P008",
    nombre: "Coca Cola 2.25L",
    marca: "COCA COLA",
    categoria: "Bebidas",
    unidad: "1 Und. = 2.25L",
    precioAnterior: 9.50,
    precioOferta: 7.90,
    descuento: 17,
    img: "img/Coca Cola 2.25L.jpg"
  },
  {
    id: "P009",
    nombre: "Pan Molde Bimbo Blanco 600g",
    marca: "BIMBO",
    categoria: "Abarrotes",
    unidad: "1 Und. = 600g",
    precioAnterior: 7.80,
    precioOferta: 6.50,
    descuento: 17,
    img: "img/Pan Molde Bimbo Blanco 600g.png"
  },
  {
    id: "P010",
    nombre: "Plátano de Seda x kg",
    marca: "PLAZA VEA",
    categoria: "Frutas y Verduras",
    unidad: "1 Und. ≈ 1 kg",
    precioAnterior: 4.50,
    precioOferta: 3.80,
    descuento: 15,
    img: "img/Plátano de Seda x kg.jpg"
  },
  {
    id: "P011",
    nombre: "Queso Edam Bonlé 250g",
    marca: "BONLÉ",
    categoria: "Lácteos",
    unidad: "1 Und. = 250g",
    precioAnterior: 12.90,
    precioOferta: 10.90,
    descuento: 15,
    img: "img/Queso Edam Bonlé 250g.png"
  },
  {
    id: "P012",
    nombre: "Atún Florida en Agua 170g",
    marca: "FLORIDA",
    categoria: "Abarrotes",
    unidad: "1 Und. = 170g",
    precioAnterior: 7.50,
    precioOferta: 6.20,
    descuento: 17,
    img: "img/Atún Florida en Agua 170g.jpg"
  },
  {
    id: "P013",
    nombre: "Agua San Luis 2.5L",
    marca: "SAN LUIS",
    categoria: "Bebidas",
    unidad: "1 Und. = 2.5L",
    precioAnterior: 4.20,
    precioOferta: 3.50,
    descuento: 17,
    img: "img/Agua San Luis 2.5L.png"
  },
  {
    id: "P014",
    nombre: "Manzana Israel x kg",
    marca: "PLAZA VEA",
    categoria: "Frutas y Verduras",
    unidad: "1 Und. ≈ 1 kg",
    precioAnterior: 6.90,
    precioOferta: 5.80,
    descuento: 15,
    img: "img/Manzana Israel x kg.png"
  },
  {
    id: "P015",
    nombre: "Huevos Pardos x 15 und",
    marca: "AVINKA",
    categoria: "Abarrotes",
    unidad: "1 Paq. = 15 und",
    precioAnterior: 12.00,
    precioOferta: 10.00,
    descuento: 17,
    img: "img/Huevos Pardos x 15 und.jpg"
  },
  {
    id: "P016",
    nombre: "Yogurt Gloria Batido Durazno 1kg",
    marca: "GLORIA",
    categoria: "Lácteos",
    unidad: "1 Und. = 1kg",
    precioAnterior: 10.50,
    precioOferta: 8.90,
    descuento: 15,
    img: "img/Yogurt Gloria Batido Durazno 1kg.png"
  }
];


const STORAGE_KEY = "carrito_plazavea";

let carrito = []; // {id, nombre, precio, cantidad}
let categoriaActual = "Todos";
let textoBusqueda = "";

const grid = document.getElementById("grid-productos");
const burbujaCarrito = document.getElementById("burbuja-carrito");
const panelCarrito = document.getElementById("panel-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarritoEl = document.getElementById("total-carrito");

// ===================== HELPERS STORAGE =====================
function cargarCarritoDesdeStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  carrito = data ? JSON.parse(data) : [];
}

function guardarCarritoEnStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
}

// ===================== RENDER DEL CATÁLOGO =====================
function renderProductos() {
  grid.innerHTML = "";

  const filtrados = productos.filter(p => {
    const coincideCat = categoriaActual === "Todos" || p.categoria === categoriaActual;
    const coincideTexto =
      p.nombre.toLowerCase().includes(textoBusqueda) ||
      p.marca.toLowerCase().includes(textoBusqueda);
    return coincideCat && coincideTexto;
  });

  filtrados.forEach(p => {
    const card = document.createElement("article");
    card.className = "card-prod";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.nombre}">
      <span class="etiqueta-oferta">Precio Chaufa</span>
      <div class="marca">${p.marca}</div>
      <div class="nombre-prod">${p.nombre}</div>
      <div class="unidad">${p.unidad}</div>
      <div class="precios">
        <span class="precio-anterior">S/ ${p.precioAnterior.toFixed(2)}</span>
      </div>
      <div>
        <span class="precio-oferta">S/ ${p.precioOferta.toFixed(2)} x und</span>
        <span class="descuento">-${p.descuento}%</span>
      </div>
      <div class="card-bottom">
        <div class="cantidad-row">
          <span>Cant.</span>
          <input type="number" min="1" value="1" id="cant-${p.id}">
        </div>
        <button class="btn-agregar" onclick="agregarAlCarrito('${p.id}')">AGREGAR</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ===================== CATEGORÍAS =====================
document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    categoriaActual = btn.dataset.cat;
    renderProductos();
  });
});

// ===================== BUSCADOR =====================
document.getElementById("buscador").addEventListener("input", e => {
  textoBusqueda = e.target.value.toLowerCase();
  renderProductos();
});

// ===================== CARRITO =====================
function agregarAlCarrito(idProd) {
  const prod = productos.find(p => p.id === idProd);
  const inputCant = document.getElementById(`cant-${idProd}`);
  const cantidad = parseInt(inputCant.value, 10) || 1;

  const existente = carrito.find(item => item.id === idProd);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      id: prod.id,
      nombre: prod.nombre,
      precio: prod.precioOferta,
      cantidad
    });
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  burbujaCarrito.textContent = totalItems;

  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    const div = document.createElement("div");
    div.className = "item-carrito";
    div.innerHTML = `
      ${item.nombre}<br>
      ${item.cantidad} x S/ ${item.precio.toFixed(2)} = S/ ${subtotal.toFixed(2)}
      <br>
      <button onclick="eliminarItem(${index})" class="btn-agregar" style="margin-top:4px;padding:4px 8px;border-radius:10px;font-size:11px;">Eliminar</button>
    `;
    listaCarrito.appendChild(div);
  });

  totalCarritoEl.textContent = `Total: S/ ${total.toFixed(2)}`;

  // 👉 guardar siempre que se actualiza
  guardarCarritoEnStorage();
}

function eliminarItem(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function toggleCarrito() {
  panelCarrito.classList.toggle("visible");
}

// ===================== IR A PAGAR =====================
function irAPagar() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  // ya se guarda en actualizarCarrito, pero por si acaso:
  guardarCarritoEnStorage();
  window.location.href = "registrar_pedido_online.html";
}

// ===================== LOGIN PROCESOS INTERNOS =====================
const loginOverlay = document.getElementById("login-overlay");
const formLogin = document.getElementById("form-login-internos");

const usuariosInternos = [
  {
    user: "almacen@plazavea.com",
    pass: "1234",
    rol: "almacen",
    destino: "consulta_stock.html"
  },
  {
    user: "vendedor@plazavea.com",
    pass: "1234",
    rol: "vendedor",
    destino: "consulta_stock.html"
  },
  {
    user: "supervisor@plazavea.com",
    pass: "1234",
    rol: "supervisor",
    destino: "reportes.html"
  }
];

function abrirLogin() {
  loginOverlay.classList.remove("hidden");
}

function cerrarLogin() {
  loginOverlay.classList.add("hidden");
  formLogin.reset();
}

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("login-user").value.trim();
  const pass = document.getElementById("login-pass").value.trim();
  const rol  = document.getElementById("login-rol").value;

  const encontrado = usuariosInternos.find(
    u => u.user === user && u.pass === pass && u.rol === rol
  );

  if (!encontrado) {
    alert("Credenciales inválidas para procesos internos.");
    return;
  }

  alert(`Bienvenido, ${rol}. Redirigiendo a procesos internos...`);
  window.location.href = encontrado.destino;
});

// ====== ATAJO DE TECLADO: CTRL + B PARA PROCESOS INTERNOS ======
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && (e.key === "b" || e.key === "B")) {
    e.preventDefault();
    abrirLogin();
  }
});

// ===================== EXPONER FUNCIONES GLOBALES =====================
window.agregarAlCarrito = agregarAlCarrito;
window.eliminarItem = eliminarItem;
window.toggleCarrito = toggleCarrito;
window.irAPagar = irAPagar;
window.abrirLogin = abrirLogin;
window.cerrarLogin = cerrarLogin;

// ===================== INICIALIZACIÓN =====================
cargarCarritoDesdeStorage();   // 👈 cargar si ya había algo
actualizarCarrito();           // para que se vea en el panel y burbuja
renderProductos();             // para dibujar el catálogo

// ========= INVENTARIO BASE (misma info que catálogo / pedidos) =========
const inventarioBase = [
  {
    id: "P001",
    nombre: "Tomate Italiano x kg",
    categoria: "Frutas y Verduras",
    stock: 30,
    stockMinimo: 10
  },
  {
    id: "P002",
    nombre: "Papa Amarilla x kg",
    categoria: "Frutas y Verduras",
    stock: 40,
    stockMinimo: 10
  },
  {
    id: "P003",
    nombre: "Leche Gloria Entera 1L",
    categoria: "Lácteos",
    stock: 25,
    stockMinimo: 8
  },
  {
    id: "P004",
    nombre: "Arroz Costeño Superior 5kg",
    categoria: "Abarrotes",
    stock: 18,
    stockMinimo: 5
  },
  {
    id: "P005",
    nombre: "Aceite Primor 1L",
    categoria: "Abarrotes",
    stock: 15,
    stockMinimo: 5
  },
  {
    id: "P006",
    nombre: "Gaseosa Inca Kola 1.5L",
    categoria: "Bebidas",
    stock: 20,
    stockMinimo: 6
  }
];

let inventario = [];

// ========= CARGAR / GUARDAR EN "BD" (localStorage) =========
function cargarInventario() {
  const guardado = localStorage.getItem("inventario_plazavea");
  if (guardado) {
    inventario = JSON.parse(guardado);
  } else {
    inventario = structuredClone(inventarioBase);
    guardarInventario();
  }
}

function guardarInventario() {
  localStorage.setItem("inventario_plazavea", JSON.stringify(inventario));
}

// ========= RENDER DE TABLA =========
const tbody = document.getElementById("tabla-stock");
const resumenEl = document.getElementById("resumen-stock");
const buscarInput = document.getElementById("buscar-stock");
const filtroEstado = document.getElementById("filtro-estado");
const filtroCategoria = document.getElementById("filtro-categoria");

function getEstado(prod) {
  if (prod.stock === 0) return "sin";
  if (prod.stock <= prod.stockMinimo) return "bajo";
  return "normal";
}

function pintarTabla() {
  const texto = buscarInput.value.trim().toLowerCase();
  const estado = filtroEstado.value;
  const cat = filtroCategoria.value;

  tbody.innerHTML = "";

  let total = 0;
  let sinStock = 0;
  let bajoStock = 0;

  inventario.forEach(prod => {
    const coincideTexto =
      prod.nombre.toLowerCase().includes(texto) ||
      prod.id.toLowerCase().includes(texto);

    const estadoProd = getEstado(prod);
    const coincideEstado =
      estado === "todos" || estadoProd === estado;

    const coincideCat =
      cat === "todas" || prod.categoria === cat;

    if (!coincideTexto || !coincideEstado || !coincideCat) return;

    total++;

    if (estadoProd === "sin") sinStock++;
    if (estadoProd === "bajo") bajoStock++;

    const tr = document.createElement("tr");

    const claseEstado =
      estadoProd === "sin" ? "estado-sin" :
      estadoProd === "bajo" ? "estado-bajo" : "estado-normal";

    const textoEstado =
      estadoProd === "sin" ? "Sin stock" :
      estadoProd === "bajo" ? "Stock bajo" : "OK";

    tr.innerHTML = `
      <td>${prod.id}</td>
      <td>${prod.nombre}</td>
      <td>${prod.categoria}</td>
      <td>${prod.stock}</td>
      <td>${prod.stockMinimo}</td>
      <td><span class="estado-tag ${claseEstado}">${textoEstado}</span></td>
    `;
    tbody.appendChild(tr);
  });

  resumenEl.textContent =
    `Productos listados: ${total} | Sin stock: ${sinStock} | Con stock bajo: ${bajoStock}`;
}

// ========= FORMULARIO DE AJUSTE (ALMACENERO) =========
const formAjuste = document.getElementById("form-ajuste");
const selectAjuste = document.getElementById("ajuste-producto");
const inputCantidad = document.getElementById("ajuste-cantidad");

function cargarSelectAjuste() {
  selectAjuste.innerHTML = "";
  inventario.forEach(prod => {
    const opt = document.createElement("option");
    opt.value = prod.id;
    opt.textContent = `${prod.id} - ${prod.nombre}`;
    selectAjuste.appendChild(opt);
  });
}

formAjuste.addEventListener("submit", e => {
  e.preventDefault();

  const id = selectAjuste.value;
  const cant = Number(inputCantidad.value || "0");

  if (!id || !cant) {
    alert("Seleccione un producto y cantidad distinta de 0.");
    return;
  }

  const prod = inventario.find(p => p.id === id);
  if (!prod) return;

  const nuevoStock = prod.stock + cant;
  if (nuevoStock < 0) {
    alert("No se puede dejar stock negativo.");
    return;
  }

  prod.stock = nuevoStock;
  guardarInventario();
  pintarTabla();
  alert("Ajuste aplicado correctamente.");
});

// ========= EVENTOS =========
buscarInput.addEventListener("input", pintarTabla);
filtroEstado.addEventListener("change", pintarTabla);
filtroCategoria.addEventListener("change", pintarTabla);

// ========= INICIALIZACIÓN =========
window.addEventListener("DOMContentLoaded", () => {
  cargarInventario();
  cargarSelectAjuste();
  pintarTabla();
});

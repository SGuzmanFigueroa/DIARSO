// "BD" de productos de stock.
// En un sistema real vendrían de BD; aquí usamos localStorage + demo.
let productos = [];

// DOM
const filtroEstado = document.getElementById("filtro-estado");
const filtroCategoria = document.getElementById("filtro-categoria");
const ordenarPor = document.getElementById("ordenar-por");
const btnAplicar = document.getElementById("btn-aplicar");

const resTotal = document.getElementById("res-total");
const resConStock = document.getElementById("res-con-stock");
const resSinStock = document.getElementById("res-sin-stock");
const resBajo = document.getElementById("res-bajo");
const resUnidades = document.getElementById("res-unidades");
const resTopVendido = document.getElementById("res-top-vendido");

const tbodyStock = document.getElementById("tbody-stock");

// Cargar productos
function cargarProductos() {
  try {
    const guardados = localStorage.getItem("productosStock");
    if (guardados) {
      productos = JSON.parse(guardados);
    }
  } catch (e) {
    console.warn("No se pudo leer productosStock:", e);
  }

  // Si no hay nada, cargamos demo
  if (!productos || productos.length === 0) {
    productos = [
      {
        codigo: "PR-001",
        nombre: "Arroz Costeño 5kg",
        categoria: "Abarrotes",
        stock: 35,
        reorden: 20,
        vendidos: 120
      },
      {
        codigo: "PR-002",
        nombre: "Aceite Primor 1L",
        categoria: "Abarrotes",
        stock: 8,
        reorden: 15,
        vendidos: 90
      },
      {
        codigo: "PR-003",
        nombre: "Leche Gloria 1L",
        categoria: "Lácteos",
        stock: 0,
        reorden: 25,
        vendidos: 150
      },
      {
        codigo: "PR-004",
        nombre: "Tomate Italiano x kg",
        categoria: "Frutas y Verduras",
        stock: 12,
        reorden: 10,
        vendidos: 60
      },
      {
        codigo: "PR-005",
        nombre: "Gaseosa Inca Kola 1.5L",
        categoria: "Bebidas",
        stock: 50,
        reorden: 30,
        vendidos: 200
      }
    ];
  }

  // Guardamos demo para que otros módulos puedan usar la misma BD
  try {
    localStorage.setItem("productosStock", JSON.stringify(productos));
  } catch (e) {
    console.warn("No se pudo guardar productosStock:", e);
  }

  llenarCategorias();
  generarReporte();
}

// Llenar combo de categorías
function llenarCategorias() {
  const categorias = new Set(productos.map(p => p.categoria));
  filtroCategoria.innerHTML = `<option value="todas">Todas</option>`;
  categorias.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filtroCategoria.appendChild(opt);
  });
}

// Generar reporte
function generarReporte() {
  const estado = filtroEstado.value;      // todos | conStock | bajo | sin
  const categoria = filtroCategoria.value; // todas o nombre
  const orden = ordenarPor.value;

  let total = 0;
  let conStock = 0;
  let sinStock = 0;
  let bajo = 0;
  let unidades = 0;
  let topProducto = null;

  // Copia para filtrar/ordenar
  let lista = productos.slice();

  // Filtro por categoría
  if (categoria !== "todas") {
    lista = lista.filter(p => p.categoria === categoria);
  }

  // Filtro por estado
  lista = lista.filter(p => {
    const sin = p.stock === 0;
    const esBajo = p.stock > 0 && p.stock < p.reorden;
    if (estado === "conStock") return p.stock > 0;
    if (estado === "bajo") return esBajo;
    if (estado === "sin") return sin;
    return true; // todos
  });

  // Orden
  if (orden === "stockDesc") {
    lista.sort((a, b) => b.stock - a.stock);
  } else if (orden === "stockAsc") {
    lista.sort((a, b) => a.stock - b.stock);
  } else if (orden === "vendidosDesc") {
    lista.sort((a, b) => b.vendidos - a.vendidos);
  } else {
    // nombre
    lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  // Resumen y tabla
  tbodyStock.innerHTML = "";

  lista.forEach(p => {
    total++;
    unidades += p.stock;

    const sin = p.stock === 0;
    const esBajo = p.stock > 0 && p.stock < p.reorden;
    if (!sin) conStock++;
    if (sin) sinStock++;
    if (esBajo) bajo++;

    if (!topProducto || p.vendidos > topProducto.vendidos) {
      topProducto = p;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.codigo}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>${p.stock}</td>
      <td>${p.reorden}</td>
      <td>${p.vendidos}</td>
      <td>${renderEstadoBadge(p)}</td>
    `;
    tbodyStock.appendChild(tr);
  });

  resTotal.textContent = total;
  resConStock.textContent = conStock;
  resSinStock.textContent = sinStock;
  resBajo.textContent = bajo;
  resUnidades.textContent = unidades;
  resTopVendido.textContent = topProducto ? topProducto.nombre : "–";
}

function renderEstadoBadge(p) {
  if (p.stock === 0) {
    return `<span class="badge badge-sin">Sin stock</span>`;
  }
  if (p.stock < p.reorden) {
    return `<span class="badge badge-bajo">Stock bajo</span>`;
  }
  return `<span class="badge badge-normal">Stock normal</span>`;
}

// Eventos
btnAplicar.addEventListener("click", generarReporte);

// Inicio
cargarProductos();

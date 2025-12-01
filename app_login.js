let selectedActor = "";

// HTML que se abrirá según el actor
let actorPages = {
  cliente: "actor_cliente.html",
  despachador: "actor_despachador.html",
  soporte: "actor_soporte.html",
  vendedor: "actor_vendedor.html",
  caja: "actor_caja.html",
  chofer: "actor_chofer.html",
  almacenero: "actor_almacenero.html",
  supervisor: "actor_supervisor.html",
  usuario: "actor_usuario.html"
};

// CONTRASEÑAS POR ACTOR (todas iguales por ahora)
let passwords = {
  cliente: "1234",
  despachador: "1234",
  soporte: "1234",
  vendedor: "1234",
  caja: "1234",
  chofer: "1234",
  almacenero: "1234",
  supervisor: "1234",
  usuario: "1234"
};

// Abrir "login" para un actor
function openLogin(actor) {
  selectedActor = actor;
  document.getElementById("login-title").innerText =
    "Acceso: " + actor.toUpperCase();
  document.getElementById("modal-login").classList.remove("hidden");
  document.getElementById("actor-pass").value = "";
  document.getElementById("login-error").style.display = "none";
}

// Cerrar
function closeLogin() {
  document.getElementById("modal-login").classList.add("hidden");
}

// Validar contraseña
function doLogin() {
  const pass = document.getElementById("actor-pass").value;

  if (pass === passwords[selectedActor]) {
    // Ir al panel del actor
    window.location.href = actorPages[selectedActor];
  } else {
    document.getElementById("login-error").style.display = "block";
  }
}

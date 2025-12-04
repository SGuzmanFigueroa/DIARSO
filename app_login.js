let selectedActor = "";

// HTML que se abrirá según el actor
const actorPages = {
  despachador: "actor_despachador.html",
  soporte: "actor_soporte.html",
  vendedor: "actor_vendedor.html",
  caja: "actor_caja.html",
  chofer: "actor_chofer.html",
  almacenero: "actor_almacenero.html",
  supervisor: "actor_supervisor.html",
  usuario: "actor_usuario.html"
};

// CONTRASEÑAS POR ACTOR (por defecto)
let passwords = {
  despachador: "1234",
  soporte: "1234",
  vendedor: "1234",
  caja: "1234",
  chofer: "1234",
  almacenero: "1234",
  supervisor: "1234",
  usuario: "1234"
};

// ====== INICIALIZAR DESDE LOCALSTORAGE ======
(function initPasswords() {
  try {
    const saved = localStorage.getItem("actorPasswords");
    if (saved) {
      const parsed = JSON.parse(saved);
      // solo pisamos las claves que existan
      Object.keys(passwords).forEach(actor => {
        if (parsed[actor]) passwords[actor] = parsed[actor];
      });
    }
  } catch (e) {
    console.warn("No se pudieron cargar contraseñas guardadas:", e);
  }
})();

function savePasswords() {
  try {
    localStorage.setItem("actorPasswords", JSON.stringify(passwords));
  } catch (e) {
    console.warn("No se pudieron guardar contraseñas:", e);
  }
}

// ====== UI LOGIN / MODAL ======
function openLogin(actor) {
  selectedActor = actor;

  document.getElementById("login-title").innerText =
    "Acceso: " + actor.toUpperCase();

  document.getElementById("modal-login").classList.remove("hidden");

  // limpiar campos y mensajes
  document.getElementById("actor-pass").value = "";
  document.getElementById("login-error").style.display = "none";

  document.getElementById("pass-actual").value = "";
  document.getElementById("pass-nueva").value = "";
  document.getElementById("pass-nueva-2").value = "";
  document.getElementById("change-error").style.display = "none";
  document.getElementById("change-ok").style.display = "none";

  // siempre arrancar en pestaña login
  showLoginTab();
}

function closeLogin() {
  document.getElementById("modal-login").classList.add("hidden");
}

// ====== TABS ======
function showLoginTab() {
  document.getElementById("panel-login").classList.remove("panel-hidden");
  document.getElementById("panel-change").classList.add("panel-hidden");

  document.getElementById("tab-login").classList.add("active");
  document.getElementById("tab-change").classList.remove("active");
}

function showChangeTab() {
  document.getElementById("panel-login").classList.add("panel-hidden");
  document.getElementById("panel-change").classList.remove("panel-hidden");

  document.getElementById("tab-login").classList.remove("active");
  document.getElementById("tab-change").classList.add("active");
}

// ====== LOGIN ======
function doLogin() {
  const pass = document.getElementById("actor-pass").value;

  if (pass === passwords[selectedActor]) {
    window.location.href = actorPages[selectedActor];
  } else {
    document.getElementById("login-error").style.display = "block";
  }
}

// ====== CAMBIO DE CONTRASEÑA ======
function changePassword() {
  const actual = document.getElementById("pass-actual").value;
  const nueva = document.getElementById("pass-nueva").value;
  const nueva2 = document.getElementById("pass-nueva-2").value;

  const errorEl = document.getElementById("change-error");
  const okEl = document.getElementById("change-ok");

  errorEl.style.display = "none";
  okEl.style.display = "none";

  if (!actual || !nueva || !nueva2) {
    errorEl.textContent = "Complete todos los campos.";
    errorEl.style.display = "block";
    return;
  }

  if (actual !== passwords[selectedActor]) {
    errorEl.textContent = "La contraseña actual es incorrecta.";
    errorEl.style.display = "block";
    return;
  }

  if (nueva !== nueva2) {
    errorEl.textContent = "La nueva contraseña no coincide.";
    errorEl.style.display = "block";
    return;
  }

  if (nueva.length < 3) {
    errorEl.textContent = "La nueva contraseña debe tener al menos 3 caracteres.";
    errorEl.style.display = "block";
    return;
  }

  // Actualizar y guardar
  passwords[selectedActor] = nueva;
  savePasswords();

  okEl.textContent = "Contraseña actualizada correctamente.";
  okEl.style.display = "block";

  // limpiar campos nuevos
  document.getElementById("pass-actual").value = "";
  document.getElementById("pass-nueva").value = "";
  document.getElementById("pass-nueva-2").value = "";
}
// ====== FIN DEL CÓDIGO ======
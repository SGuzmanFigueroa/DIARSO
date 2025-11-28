// Cambiar entre secciones principales (cliente / interno / login)
function showSection(id) {
  const sections = {
    cliente: document.getElementById('section-cliente'),
    interno: document.getElementById('section-interno'),
    login: document.getElementById('section-login')
  };

  // Ocultar todas las secciones
  Object.values(sections).forEach(sec => sec.classList.remove('active'));

  // Mostrar la sección seleccionada
  sections[id].classList.add('active');

  // Actualizar botones del menú
  document.getElementById('btn-cliente').classList.remove('active');
  document.getElementById('btn-interno').classList.remove('active');
  document.getElementById('btn-login').classList.remove('active');

  if (id === 'cliente') document.getElementById('btn-cliente').classList.add('active');
  if (id === 'interno') document.getElementById('btn-interno').classList.add('active');
  if (id === 'login') document.getElementById('btn-login').classList.add('active');
}

// Cambiar "ventanas" del cliente (tabs)
function showClientTab(tabId) {
  const tabs = document.querySelectorAll('#tabs-cliente .tab-btn');
  const sections = document.querySelectorAll('.subsection-cliente');

  tabs.forEach(t => t.classList.remove('active'));
  sections.forEach(s => s.classList.remove('active'));

  // Activar la tab clickeada
  const clickedButton = Array.from(tabs)
    .find(btn => btn.getAttribute('onclick').includes(tabId));
  if (clickedButton) clickedButton.classList.add('active');

  // Mostrar la sección correspondiente
  const activeSection = document.getElementById(tabId);
  if (activeSection) activeSection.classList.add('active');
}

// Cambiar panel de roles internos
function showRole(rol) {
  const roles = ['almacen', 'caja', 'chofer', 'supervisor', 'soporte', 'reportes'];

  roles.forEach(r => {
    const panel = document.getElementById('rol-' + r);
    if (panel) panel.classList.remove('active');
  });

  const activePanel = document.getElementById('rol-' + rol);
  if (activePanel) activePanel.classList.add('active');
}

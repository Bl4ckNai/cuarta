const TOKEN_KEY = "inventario_auth_token";

const authShell = document.getElementById("authShell");
const mainHeader = document.getElementById("mainHeader");
const mainDashboard = document.getElementById("mainDashboard");
const homeLanding = document.getElementById("homeLanding");
const loginForm = document.getElementById("loginForm");
const authError = document.getElementById("authError");
const userInfoNav = document.getElementById("userInfoNav");
const userInfoDropdown = document.getElementById("userInfoDropdown");
const mainMenu = document.getElementById("mainMenu");
const menuHomeBtn = document.getElementById("menuHomeBtn");
const menuOpenInventory = document.getElementById("menuOpenInventory");
const menuOpenGuard = document.getElementById("menuOpenGuard");
const menuOpenMedical = document.getElementById("menuOpenMedical");
const menuOpenCourses = document.getElementById("menuOpenCourses");
const menuOpenDayOrders = document.getElementById("menuOpenDayOrders");
const menuOpenVehicles = document.getElementById("menuOpenVehicles");
const menuOpenUniforms = document.getElementById("menuOpenUniforms");
const menuOpenReports = document.getElementById("menuOpenReports");
const menuOpenUsers = document.getElementById("menuOpenUsers");
const manageUsersBtn = document.getElementById("manageUsersBtnDropdown");
const logoutBtn = document.getElementById("logoutBtnDropdown");
const themeToggleBtn = document.getElementById("themeToggleBtnDropdown");
const usersModal = document.getElementById("usersModal");
const usersModalBackdrop = document.getElementById("usersModalBackdrop");
const closeUsersModalBtn = document.getElementById("closeUsersModalBtn");
const guardModal = document.getElementById("guardModal");
const guardModalBackdrop = document.getElementById("guardModalBackdrop");
const closeGuardModalBtn = document.getElementById("closeGuardModalBtn");
const medicalModal = document.getElementById("medicalModal");
const medicalModalBackdrop = document.getElementById("medicalModalBackdrop");
const closeMedicalModalBtn = document.getElementById("closeMedicalModalBtn");
const coursesModal = document.getElementById("coursesModal");
const coursesModalBackdrop = document.getElementById("coursesModalBackdrop");
const closeCoursesModalBtn = document.getElementById("closeCoursesModalBtn");
const qrModal = document.getElementById("qrModal");
const qrModalBackdrop = document.getElementById("qrModalBackdrop");
const closeQrModalBtn = document.getElementById("closeQrModalBtn");
const dayOrdersModal = document.getElementById("dayOrdersModal");
const dayOrdersModalBackdrop = document.getElementById("dayOrdersModalBackdrop");
const closeDayOrdersModalBtn = document.getElementById("closeDayOrdersModalBtn");
const vehiclesModal = document.getElementById("vehiclesModal");
const vehiclesModalBackdrop = document.getElementById("vehiclesModalBackdrop");
const closeVehiclesModalBtn = document.getElementById("closeVehiclesModalBtn");
const uniformsModal = document.getElementById("uniformsModal");
const uniformsModalBackdrop = document.getElementById("uniformsModalBackdrop");
const closeUniformsModalBtn = document.getElementById("closeUniformsModalBtn");

const featureSections = [usersModal, guardModal, medicalModal, coursesModal, qrModal, dayOrdersModal, vehiclesModal, uniformsModal];

const form = document.getElementById("inventoryForm");
const itemIdInput = document.getElementById("itemId");
const tableBody = document.getElementById("inventoryTableBody");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const filterEstado = document.getElementById("filterEstado");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const reportInventoryBtn = document.getElementById("reportInventoryBtn");
const reportExpiringBtn = document.getElementById("reportExpiringBtn");
const reportUniformsBtn = document.getElementById("reportUniformsBtn");
const quickScanQrBtn = document.getElementById("quickScanQrBtn");
const quickNewRecordBtn = document.getElementById("quickNewRecordBtn");
const quickReportBtn = document.getElementById("quickReportBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const rowTemplate = document.getElementById("rowTemplate");
const userForm = document.getElementById("userForm");
const usersTableBody = document.getElementById("usersTableBody");
const usersEmpty = document.getElementById("usersEmpty");
const permissionsEditorPanel = document.getElementById("permissionsEditorPanel");
const permissionsEditorForm = document.getElementById("permissionsEditorForm");
const permissionsEditorTitle = document.getElementById("permissionsEditorTitle");
const cancelPermissionsBtn = document.getElementById("cancelPermissionsBtn");
const inventorySection = document.getElementById("inventorySection");
const guardForm = document.getElementById("guardForm");
const guardFechaTurno = document.getElementById("guardFechaTurno");
const guardSearchInput = document.getElementById("guardSearchInput");
const guardFilterTurno = document.getElementById("guardFilterTurno");
const guardFilterTipo = document.getElementById("guardFilterTipo");
const guardTableBody = document.getElementById("guardTableBody");
const guardEmptyState = document.getElementById("guardEmptyState");
const medicalForm = document.getElementById("medicalForm");
const medicalRecordId = document.getElementById("medicalRecordId");
const medicalTableBody = document.getElementById("medicalTableBody");
const medicalSearchInput = document.getElementById("medicalSearchInput");
const medicalEmptyState = document.getElementById("medicalEmptyState");
const medicalCancelEditBtn = document.getElementById("medicalCancelEditBtn");
const coursesForm = document.getElementById("coursesForm");
const courseRecordId = document.getElementById("courseRecordId");
const coursesTableBody = document.getElementById("coursesTableBody");
const coursesSearchInput = document.getElementById("coursesSearchInput");
const coursesEmptyState = document.getElementById("coursesEmptyState");
const courseCancelEditBtn = document.getElementById("courseCancelEditBtn");
const qrScanStatus = document.getElementById("qrScanStatus");
const qrManualInput = document.getElementById("qrManualInput");
const applyQrManualBtn = document.getElementById("applyQrManualBtn");
const dayOrdersForm = document.getElementById("dayOrdersForm");
const dayOrderId = document.getElementById("dayOrderId");
const dayOrdersSearchInput = document.getElementById("dayOrdersSearchInput");
const dayOrdersFilterTipo = document.getElementById("dayOrdersFilterTipo");
const dayOrdersTableBody = document.getElementById("dayOrdersTableBody");
const dayOrdersEmptyState = document.getElementById("dayOrdersEmptyState");
const dayOrderCancelEditBtn = document.getElementById("dayOrderCancelEditBtn");
const vehiclesForm = document.getElementById("vehiclesForm");
const vehicleId = document.getElementById("vehicleId");
const vehiclesTableBody = document.getElementById("vehiclesTableBody");
const vehiclesSearchInput = document.getElementById("vehiclesSearchInput");
const vehiclesFilterStatus = document.getElementById("vehiclesFilterStatus");
const vehiclesEmptyState = document.getElementById("vehiclesEmptyState");
const vehicleCancelEditBtn = document.getElementById("vehicleCancelEditBtn");
const uniformsForm = document.getElementById("uniformsForm");
const uniformRecordId = document.getElementById("uniformRecordId");
const uniformsTableBody = document.getElementById("uniformsTableBody");
const uniformsSearchInput = document.getElementById("uniformsSearchInput");
const uniformsFilterMovement = document.getElementById("uniformsFilterMovement");
const uniformsFilterStatus = document.getElementById("uniformsFilterStatus");
const uniformsEmptyState = document.getElementById("uniformsEmptyState");
const uniformCancelEditBtn = document.getElementById("uniformCancelEditBtn");

const totalItemsEl = document.getElementById("totalItems");
const lowStockCountEl = document.getElementById("lowStockCount");
const inServiceCountEl = document.getElementById("inServiceCount");
const expiringCountEl = document.getElementById("expiringCount");
const homeAlertsList = document.getElementById("homeAlertsList");
const recentChangesList = document.getElementById("recentChangesList");

const menuNavLinks = [
  menuOpenInventory,
  menuOpenGuard,
  menuOpenMedical,
  menuOpenCourses,
  menuOpenDayOrders,
  menuOpenVehicles,
  menuOpenUniforms,
  menuOpenReports,
  menuOpenUsers
];

const statusClassMap = {
  "En Servicio": "status-ok",
  "En Mantenimiento": "status-maintenance",
  "Fuera de Servicio": "status-out"
};

let authToken = localStorage.getItem(TOKEN_KEY) || "";
let currentUser = null;
let inventory = [];
let users = [];
let guardEntries = [];
let medicalRecords = [];
let volunteerCourses = [];
let dayOrders = [];
let vehicles = [];
let uniforms = [];
let qrScanner = null;
let qrScannerActive = false;
let qrLastDecoded = "";
let editingPermissionsUserId = "";
let permissions = {
  canWriteInventory: false,
  canWriteGuardBook: false,
  canWriteMedicalRecords: false,
  canWriteVolunteerCourses: false,
  canWriteDayOrders: false,
  canWriteVehicles: false,
  canWriteUniforms: false,
  canManageUsers: false,
  canGenerateReports: true
};

// Funciones de tema (oscuro/claro)
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggleBtn.textContent = "🌙";
    themeToggleBtn.title = "Cambiar a modo oscuro";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggleBtn.textContent = "☀️";
    themeToggleBtn.title = "Cambiar a modo claro";
  }
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  const currentTheme = localStorage.getItem("theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
}

loginForm.addEventListener("submit", onLogin);
logoutBtn.addEventListener("click", onLogout);
themeToggleBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleTheme();
});
form.addEventListener("submit", onSubmit);
searchInput.addEventListener("input", render);
filterEstado.addEventListener("change", render);
exportCsvBtn.addEventListener("click", exportToCsv);
reportInventoryBtn.addEventListener("click", () => downloadPdfReport("/api/reports/inventory.pdf", "inventario"));
reportExpiringBtn.addEventListener("click", () => downloadPdfReport("/api/reports/expiring.pdf", "vencimientos"));
reportUniformsBtn.addEventListener("click", () => downloadPdfReport("/api/reports/uniforms.pdf", "uniformes"));
quickScanQrBtn.addEventListener("click", onQuickScanQr);
quickNewRecordBtn.addEventListener("click", onQuickNewRecord);
quickReportBtn.addEventListener("click", onQuickReport);
cancelEditBtn.addEventListener("click", resetForm);
manageUsersBtn.addEventListener("click", openUsersModal);
closeUsersModalBtn.addEventListener("click", () => closeUsersModal({ returnHome: true }));
usersModalBackdrop.addEventListener("click", () => closeUsersModal({ returnHome: true }));
closeGuardModalBtn.addEventListener("click", () => closeGuardModal({ returnHome: true }));
guardModalBackdrop.addEventListener("click", () => closeGuardModal({ returnHome: true }));
closeMedicalModalBtn.addEventListener("click", () => closeMedicalModal({ returnHome: true }));
medicalModalBackdrop.addEventListener("click", () => closeMedicalModal({ returnHome: true }));
closeCoursesModalBtn.addEventListener("click", () => closeCoursesModal({ returnHome: true }));
coursesModalBackdrop.addEventListener("click", () => closeCoursesModal({ returnHome: true }));
closeQrModalBtn.addEventListener("click", () => closeQrModal({ returnHome: true }));
qrModalBackdrop.addEventListener("click", () => closeQrModal({ returnHome: true }));
closeDayOrdersModalBtn.addEventListener("click", () => closeDayOrdersModal({ returnHome: true }));
dayOrdersModalBackdrop.addEventListener("click", () => closeDayOrdersModal({ returnHome: true }));
closeVehiclesModalBtn.addEventListener("click", () => closeVehiclesModal({ returnHome: true }));
vehiclesModalBackdrop.addEventListener("click", () => closeVehiclesModal({ returnHome: true }));
closeUniformsModalBtn.addEventListener("click", () => closeUniformsModal({ returnHome: true }));
uniformsModalBackdrop.addEventListener("click", () => closeUniformsModal({ returnHome: true }));
userForm.addEventListener("submit", onCreateUser);
permissionsEditorForm.addEventListener("submit", onSaveUserPermissions);
cancelPermissionsBtn.addEventListener("click", closePermissionsEditor);
guardForm.addEventListener("submit", onGuardSubmit);
medicalForm.addEventListener("submit", onMedicalSubmit);
coursesForm.addEventListener("submit", onCourseSubmit);
dayOrdersForm.addEventListener("submit", onDayOrderSubmit);
vehiclesForm.addEventListener("submit", onVehicleSubmit);
uniformsForm.addEventListener("submit", onUniformSubmit);
guardSearchInput.addEventListener("input", renderGuardBook);
guardFilterTurno.addEventListener("change", renderGuardBook);
guardFilterTipo.addEventListener("change", renderGuardBook);
medicalSearchInput.addEventListener("input", renderMedicalRecords);
medicalCancelEditBtn.addEventListener("click", resetMedicalForm);
coursesSearchInput.addEventListener("input", renderCourses);
courseCancelEditBtn.addEventListener("click", resetCourseForm);
applyQrManualBtn.addEventListener("click", onManualQrSearch);
dayOrdersSearchInput.addEventListener("input", renderDayOrders);
dayOrdersFilterTipo.addEventListener("change", renderDayOrders);
dayOrderCancelEditBtn.addEventListener("click", resetDayOrderForm);
vehiclesSearchInput.addEventListener("input", renderVehicles);
vehiclesFilterStatus.addEventListener("change", renderVehicles);
vehicleCancelEditBtn.addEventListener("click", resetVehicleForm);
uniformsSearchInput.addEventListener("input", renderUniforms);
uniformsFilterMovement.addEventListener("change", renderUniforms);
uniformsFilterStatus.addEventListener("change", renderUniforms);
uniformCancelEditBtn.addEventListener("click", resetUniformForm);
menuHomeBtn.addEventListener("click", (event) => {
  event.preventDefault();
  openHomeModule();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
menuOpenInventory.addEventListener("click", (event) => {
  event.preventDefault();
  openInventoryModule();
  inventorySection.scrollIntoView({ behavior: "smooth", block: "start" });
});
menuOpenGuard.addEventListener("click", (event) => {
  event.preventDefault();
  openGuardModal();
});
menuOpenMedical.addEventListener("click", async (event) => {
  event.preventDefault();
  await openMedicalModal();
});
menuOpenCourses.addEventListener("click", async (event) => {
  event.preventDefault();
  await openCoursesModal();
});
menuOpenDayOrders.addEventListener("click", async (event) => {
  event.preventDefault();
  await openDayOrdersModal();
});
menuOpenVehicles.addEventListener("click", async (event) => {
  event.preventDefault();
  await openVehiclesModal();
});
menuOpenUniforms.addEventListener("click", async (event) => {
  event.preventDefault();
  await openUniformsModal();
});
menuOpenReports.addEventListener("click", (event) => {
  event.preventDefault();
  openInventoryModule();
  setActiveNav(menuOpenReports);
  reportInventoryBtn.click();
});
menuOpenUsers.addEventListener("click", async (event) => {
  event.preventDefault();
  await openUsersModal();
});
setDefaultGuardDate();
resetDayOrderForm();
resetUniformForm();

initTheme();
bootstrap();

async function bootstrap() {
  if (!authToken) {
    showAuthScreen();
    return;
  }

  try {
    const me = await api("/api/me");
    currentUser = me.user;
    permissions = me.permissions || permissions;
    await refreshInventory();
    await refreshGuardBook();
    await refreshMedicalRecords();
    await refreshCourses();
    await refreshDayOrders();
    await refreshVehicles();
    await refreshUniforms();
    showAppScreen();
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    authToken = "";
    showAuthScreen();
  }
}

async function onLogin(event) {
  event.preventDefault();
  authError.classList.add("hidden");
  authError.textContent = "";

  const formData = new FormData(loginForm);
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    showAuthError("Debes completar usuario y clave.");
    return;
  }

  try {
    const response = await api("/api/login", {
      method: "POST",
      body: { username, password },
      requiresAuth: false
    });

    authToken = response.token;
    currentUser = response.user;
    localStorage.setItem(TOKEN_KEY, authToken);
    loginForm.reset();

    const me = await api("/api/me");
    permissions = me.permissions || permissions;

    await refreshInventory();
    await refreshGuardBook();
    await refreshMedicalRecords();
    await refreshCourses();
    await refreshDayOrders();
    await refreshVehicles();
    await refreshUniforms();
    showAppScreen();
  } catch (error) {
    showAuthError(error.message || "No se pudo iniciar sesión.");
  }
}

async function onLogout() {
  try {
    if (authToken) {
      await api("/api/logout", { method: "POST" });
    }
  } catch {
    // Se continúa con cierre local aunque falle el logout remoto.
  }

  authToken = "";
  currentUser = null;
  inventory = [];
  users = [];
  guardEntries = [];
  medicalRecords = [];
  volunteerCourses = [];
  dayOrders = [];
  vehicles = [];
  uniforms = [];
  permissions = {
    canWriteInventory: false,
    canWriteGuardBook: false,
    canWriteMedicalRecords: false,
    canWriteVolunteerCourses: false,
    canWriteDayOrders: false,
    canWriteVehicles: false,
    canWriteUniforms: false,
    canManageUsers: false,
    canGenerateReports: true
  };
  localStorage.removeItem(TOKEN_KEY);
  resetForm();
  resetMedicalForm();
  resetCourseForm();
  resetDayOrderForm();
  resetVehicleForm();
  resetUniformForm();
  closeUsersModal();
  closeGuardModal();
  closeMedicalModal();
  closeCoursesModal();
  closeDayOrdersModal();
  closeVehiclesModal();
  closeUniformsModal();
  showAuthScreen();
}

async function refreshInventory() {
  const response = await api("/api/inventory");
  inventory = response.items || [];
  render();
  updateHomeSummary();
}

async function refreshGuardBook() {
  const response = await api("/api/guard-book");
  guardEntries = response.entries || [];
  renderGuardBook();
  updateHomeSummary();
}

async function refreshMedicalRecords() {
  const response = await api("/api/medical-records");
  medicalRecords = response.records || [];
  renderMedicalRecords();
  updateHomeSummary();
}

async function refreshCourses() {
  const response = await api("/api/volunteer-courses");
  volunteerCourses = response.courses || [];
  renderCourses();
  updateHomeSummary();
}

async function refreshDayOrders() {
  const response = await api("/api/day-orders");
  dayOrders = response.orders || [];
  renderDayOrders();
  updateHomeSummary();
}

async function refreshVehicles() {
  const response = await api("/api/vehicles");
  vehicles = response.vehicles || [];
  renderVehicles();
  updateHomeSummary();
}

async function refreshUniforms() {
  const response = await api("/api/uniform-inventory");
  uniforms = response.uniforms || [];
  renderUniforms();
  updateHomeSummary();
}

function updateHomeSummary() {
  updateHomeAlerts();
  updateRecentChanges();
}

function updateHomeAlerts() {
  if (!homeAlertsList) {
    return;
  }

  const alerts = [];

  inventory.forEach((item) => {
    const alertData = getAlertData(item);
    if (alertData.className === "alert-none") {
      return;
    }
    alerts.push({
      level: alertData.className === "alert-high" ? "high" : "medium",
      text: `Inventario: ${item.nombre} - ${alertData.label}`
    });
  });

  vehicles.forEach((vehicle) => {
    const alertData = getVehicleAlertData(vehicle);
    if (alertData.className === "alert-none") {
      return;
    }
    alerts.push({
      level: alertData.className === "alert-high" ? "high" : "medium",
      text: `Carros: ${vehicle.codigo} (${vehicle.patente}) - ${alertData.label}`
    });
  });

  uniforms.forEach((record) => {
    const alertData = getUniformAlertData(record);
    if (alertData.className === "alert-none") {
      return;
    }
    alerts.push({
      level: alertData.className === "alert-high" ? "high" : "medium",
      text: `Uniformes: ${record.prenda} (${record.voluntarioNombre}) - ${alertData.label}`
    });
  });

  alerts.sort((a, b) => {
    if (a.level === b.level) {
      return 0;
    }
    return a.level === "high" ? -1 : 1;
  });

  homeAlertsList.innerHTML = "";

  if (alerts.length === 0) {
    const li = document.createElement("li");
    li.className = "home-alert-empty";
    li.textContent = "Sin alertas por el momento.";
    homeAlertsList.appendChild(li);
    return;
  }

  alerts.slice(0, 10).forEach((alert) => {
    const li = document.createElement("li");
    li.className = `home-alert-item home-alert-${alert.level}`;
    li.textContent = alert.text;
    homeAlertsList.appendChild(li);
  });
}

function updateRecentChanges() {
  if (!recentChangesList) {
    return;
  }

  const changes = [];

  inventory.forEach((item) => {
    changes.push({
      date: item.actualizado,
      text: `Inventario: ${item.nombre} actualizado.`
    });
  });

  guardEntries.forEach((entry) => {
    changes.push({
      date: entry.creadoEn,
      text: `Libro de guardia: ${entry.tipo} en turno ${formatTurnoLabel(entry.turno)}.`
    });
  });

  medicalRecords.forEach((record) => {
    changes.push({
      date: record.actualizadoEn,
      text: `Ficha medica: ${record.voluntarioNombre} actualizada.`
    });
  });

  volunteerCourses.forEach((course) => {
    changes.push({
      date: course.actualizadoEn,
      text: `Curso: ${course.curso} (${course.voluntarioNombre}) actualizado.`
    });
  });

  dayOrders.forEach((order) => {
    changes.push({
      date: order.actualizadoEn,
      text: `Orden del dia: ${order.titulo} (${order.tipo}).`
    });
  });

  vehicles.forEach((vehicle) => {
    changes.push({
      date: vehicle.actualizadoEn,
      text: `Carros: ${vehicle.codigo} (${vehicle.patente}) actualizado.`
    });
  });

  uniforms.forEach((record) => {
    changes.push({
      date: record.actualizadoEn,
      text: `Uniformes: ${record.prenda} (${record.voluntarioNombre}) actualizado.`
    });
  });

  const validChanges = changes
    .filter((change) => change.date && !Number.isNaN(new Date(change.date).getTime()))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  recentChangesList.innerHTML = "";

  if (validChanges.length === 0) {
    recentChangesList.innerHTML = `
      <li>
        <span class="activity-dot" aria-hidden="true"></span>
        <div>
          <p>Sin modificaciones recientes por el momento.</p>
          <small>Se mostraran automaticamente al registrar cambios.</small>
        </div>
      </li>
    `;
    return;
  }

  validChanges.slice(0, 8).forEach((change) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="activity-dot" aria-hidden="true"></span>
      <div>
        <p>${escapeHtml(change.text)}</p>
        <small>${escapeHtml(formatTimeAgo(change.date))}</small>
      </div>
    `;
    recentChangesList.appendChild(li);
  });
}

function formatTimeAgo(dateText) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return "Fecha desconocida";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));

  if (diffMin < 1) {
    return "Hace instantes";
  }

  if (diffMin < 60) {
    return `Hace ${diffMin} minuto${diffMin === 1 ? "" : "s"}`;
  }

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return `Hace ${diffHours} hora${diffHours === 1 ? "" : "s"}`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} dia${diffDays === 1 ? "" : "s"}`;
}

async function onSubmit(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    nombre: String(formData.get("nombre") || "").trim(),
    categoria: String(formData.get("categoria") || "").trim(),
    cantidad: Number(formData.get("cantidad") || 0),
    minimo: Number(formData.get("minimo") || 0),
    estado: String(formData.get("estado") || "").trim(),
    ubicacion: String(formData.get("ubicacion") || "").trim(),
    fechaVencimiento: String(formData.get("fechaVencimiento") || "").trim(),
    notas: String(formData.get("notas") || "").trim()
  };

  if (!payload.nombre || !payload.categoria || !payload.estado || !payload.ubicacion) {
    alert("Completa todos los campos obligatorios.");
    return;
  }

  if (payload.cantidad < 0 || payload.minimo < 0) {
    alert("Cantidad y mínimo deben ser valores positivos.");
    return;
  }

  if (!permissions.canWriteInventory) {
    alert("Tu rol es solo lectura. No puedes modificar inventario.");
    return;
  }

  try {
    const isEdit = Boolean(itemIdInput.value);
    if (isEdit) {
      await api(`/api/inventory/${itemIdInput.value}`, {
        method: "PUT",
        body: payload
      });
    } else {
      await api("/api/inventory", {
        method: "POST",
        body: payload
      });
    }

    await refreshInventory();
    resetForm();
  } catch (error) {
    alert(error.message || "No se pudo guardar el artículo.");
  }
}

function getFilteredInventory() {
  const term = searchInput.value.trim().toLowerCase();
  const estado = filterEstado.value;

  return inventory.filter((item) => {
    const matchesEstado = estado === "Todos" || item.estado === estado;
    const haystack = `${item.nombre} ${item.categoria} ${item.ubicacion}`.toLowerCase();
    const matchesTerm = !term || haystack.includes(term);
    return matchesEstado && matchesTerm;
  });
}

function render() {
  const rows = getFilteredInventory();
  tableBody.innerHTML = "";

  rows.forEach((item, idx) => {
    const row = rowTemplate.content.firstElementChild.cloneNode(true);
    const alertData = getAlertData(item);

    row.querySelector('[data-field="nombre"]').textContent = item.nombre;
    row.querySelector('[data-field="categoria"]').textContent = item.categoria;
    row.querySelector('[data-field="cantidad"]').textContent = String(item.cantidad);
    row.querySelector('[data-field="minimo"]').textContent = String(item.minimo);

    const estadoCell = row.querySelector('[data-field="estado"]');
    estadoCell.textContent = item.estado;
    estadoCell.classList.add(statusClassMap[item.estado] || "");

    row.querySelector('[data-field="fechaVencimiento"]').textContent = formatDate(item.fechaVencimiento);

    const alertCell = row.querySelector('[data-field="alertas"]');
    alertCell.innerHTML = `<span class="alert-pill ${alertData.className}">${alertData.label}</span>`;

    row.querySelector('[data-field="ubicacion"]').textContent = item.ubicacion;

    if (item.cantidad <= item.minimo) {
      row.classList.add("low-stock");
    }

    row.style.animationDelay = `${idx * 45}ms`;

    const editBtn = row.querySelector(".edit-btn");
    const deleteBtn = row.querySelector(".delete-btn");
    editBtn.disabled = !permissions.canWriteInventory;
    deleteBtn.disabled = !permissions.canWriteInventory;

    editBtn.addEventListener("click", () => startEdit(item.id));
    deleteBtn.addEventListener("click", () => removeItem(item.id));

    tableBody.appendChild(row);
  });

  emptyState.classList.toggle("hidden", rows.length > 0);
  updateStats();
}

function startEdit(id) {
  const item = inventory.find((candidate) => candidate.id === id);
  if (!item) {
    return;
  }

  itemIdInput.value = item.id;
  form.nombre.value = item.nombre;
  form.categoria.value = item.categoria;
  form.cantidad.value = item.cantidad;
  form.minimo.value = item.minimo;
  form.estado.value = item.estado;
  form.ubicacion.value = item.ubicacion;
  form.fechaVencimiento.value = item.fechaVencimiento || "";
  form.notas.value = item.notas;

  document.getElementById("saveBtn").textContent = "Actualizar artículo";
  cancelEditBtn.hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function removeItem(id) {
  if (!permissions.canWriteInventory) {
    alert("Tu rol es solo lectura. No puedes eliminar artículos.");
    return;
  }

  const item = inventory.find((candidate) => candidate.id === id);
  if (!item) {
    return;
  }

  const confirmed = confirm(`¿Eliminar "${item.nombre}" del inventario?`);
  if (!confirmed) {
    return;
  }

  try {
    await api(`/api/inventory/${id}`, { method: "DELETE" });
    await refreshInventory();
    if (itemIdInput.value === id) {
      resetForm();
    }
  } catch (error) {
    alert(error.message || "No se pudo eliminar el artículo.");
  }
}

function resetForm() {
  form.reset();
  itemIdInput.value = "";
  document.getElementById("saveBtn").textContent = "Guardar artículo";
  cancelEditBtn.hidden = true;
}

function updateStats() {
  totalItemsEl.textContent = String(inventory.length);

  const lowStock = inventory.filter((item) => item.cantidad <= item.minimo).length;
  lowStockCountEl.textContent = String(lowStock);

  const inService = inventory.filter((item) => item.estado === "En Servicio").length;
  inServiceCountEl.textContent = String(inService);

  const expiring = inventory.filter((item) => isExpiringInDays(item.fechaVencimiento, 30)).length;
  expiringCountEl.textContent = String(expiring);
}

function exportToCsv() {
  if (inventory.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const headers = [
    "Nombre",
    "Categoria",
    "Cantidad",
    "Minimo",
    "Estado",
    "FechaVencimiento",
    "Ubicacion",
    "Notas",
    "UltimaActualizacion"
  ];

  const rows = inventory.map((item) => [
    item.nombre,
    item.categoria,
    item.cantidad,
    item.minimo,
    item.estado,
    item.fechaVencimiento || "",
    item.ubicacion,
    item.notas,
    item.actualizado
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `inventario-bomberos-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getAlertData(item) {
  const alerts = [];

  if (item.cantidad <= item.minimo) {
    alerts.push("Stock bajo");
  }

  const exp = getExpirationLevel(item.fechaVencimiento);
  if (exp === "expired") {
    alerts.push("Vencido");
  } else if (exp === "urgent") {
    alerts.push("Vence pronto");
  }

  if (alerts.length === 0) {
    return { label: "Normal", className: "alert-none" };
  }

  if (alerts.includes("Vencido") || alerts.includes("Stock bajo")) {
    return { label: alerts.join(" + "), className: "alert-high" };
  }

  return { label: alerts.join(" + "), className: "alert-medium" };
}

function getExpirationLevel(dateText) {
  if (!dateText) {
    return "none";
  }

  const target = new Date(dateText);
  if (Number.isNaN(target.getTime())) {
    return "none";
  }

  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.ceil((target - now) / msPerDay);

  if (diffDays < 0) {
    return "expired";
  }

  if (diffDays <= 30) {
    return "urgent";
  }

  return "none";
}

function isExpiringInDays(dateText, days) {
  const target = new Date(dateText);
  if (!dateText || Number.isNaN(target.getTime())) {
    return false;
  }

  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.ceil((target - now) / msPerDay);
  return diffDays >= 0 && diffDays <= days;
}

function formatDate(dateText) {
  if (!dateText) {
    return "-";
  }

  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("es-ES");
}

function showAuthScreen() {
  authShell.classList.remove("hidden");
  mainHeader.classList.add("hidden");
  homeLanding.classList.add("hidden");
  mainDashboard.classList.add("hidden");
  mainMenu.classList.add("hidden");
  closeUsersModal();
  closeGuardModal();
  closeMedicalModal();
  closeCoursesModal();
  closeDayOrdersModal();
  closeQrModal();
  closeVehiclesModal();
  closeUniformsModal();
  setActiveNav(null);
}

function showAppScreen() {
  authShell.classList.add("hidden");
  mainHeader.classList.add("hidden");
  mainDashboard.classList.add("hidden");
  homeLanding.classList.remove("hidden");
  const userDisplayText = `${currentUser?.nombre || "Usuario"} (${currentUser?.username || ""})`;
  userInfoNav.textContent = userDisplayText;
  userInfoDropdown.textContent = userDisplayText;
  manageUsersBtn.classList.add("hidden");
  menuOpenUsers.classList.toggle("hidden", !permissions.canManageUsers);
  applyPermissionState();

  showStartMenu();
  setActiveNav(null);
}

function showAuthError(message) {
  authError.textContent = message;
  authError.classList.remove("hidden");
}

async function api(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    requiresAuth = true
  } = options;

  const requestHeaders = {
    ...headers
  };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (requiresAuth && authToken) {
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(path, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const payload = await safeJson(response);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      authToken = "";
      currentUser = null;
      showAuthScreen();
    }

    throw new Error(payload?.error || "Error en la solicitud");
  }

  return payload;
}

async function openUsersModal() {
  if (!permissions.canManageUsers) {
    return;
  }

  try {
    await refreshUsers();
    openFeatureModal(usersModal);
    setActiveNav(menuOpenUsers);
  } catch (error) {
    alert(error.message || "No se pudo cargar la gestión de usuarios.");
  }
}

async function openGuardModal() {
  try {
    await refreshGuardBook();
    openFeatureModal(guardModal);
    setActiveNav(menuOpenGuard);
  } catch (error) {
    alert(error.message || "No se pudo cargar el libro de guardia.");
  }
}

async function openMedicalModal() {
  try {
    await refreshMedicalRecords();
    openFeatureModal(medicalModal);
    setActiveNav(menuOpenMedical);
  } catch (error) {
    alert(error.message || "No se pudo cargar las fichas medicas.");
  }
}

async function openCoursesModal() {
  try {
    await refreshCourses();
    openFeatureModal(coursesModal);
    setActiveNav(menuOpenCourses);
  } catch (error) {
    alert(error.message || "No se pudo cargar los cursos de voluntarios.");
  }
}

async function openDayOrdersModal() {
  try {
    await refreshDayOrders();
    openFeatureModal(dayOrdersModal);
    setActiveNav(menuOpenDayOrders);
  } catch (error) {
    alert(error.message || "No se pudo cargar las ordenes del dia.");
  }
}

async function openVehiclesModal() {
  try {
    await refreshVehicles();
    openFeatureModal(vehiclesModal);
    setActiveNav(menuOpenVehicles);
  } catch (error) {
    alert(error.message || "No se pudo cargar los carros.");
  }
}

async function openUniformsModal() {
  try {
    await refreshUniforms();
    openFeatureModal(uniformsModal);
    setActiveNav(menuOpenUniforms);
  } catch (error) {
    alert(error.message || "No se pudo cargar inventario de uniformes.");
  }
}

function showStartMenu() {
  mainMenu.classList.remove("hidden");
  homeLanding.classList.remove("hidden");
}

function hideStartMenu() {
  mainMenu.classList.remove("hidden");
  mainDashboard.classList.remove("hidden");
  homeLanding.classList.add("hidden");
}

function openInventoryModule() {
  hideAllFeatureSections();
  stopQrScanner();
  hideStartMenu();
  mainHeader.classList.remove("hidden");
  setActiveNav(menuOpenInventory);
}

function openHomeModule() {
  mainMenu.classList.remove("hidden");
  mainHeader.classList.add("hidden");
  homeLanding.classList.remove("hidden");
  mainDashboard.classList.add("hidden");
  hideAllFeatureSections();
  stopQrScanner();
  setActiveNav(null);
}

function onQuickScanQr() {
  setActiveNav(null);
  openQrModal();
}

function onQuickNewRecord() {
  openInventoryModule();
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function onQuickReport() {
  openInventoryModule();
  setActiveNav(menuOpenReports);
  reportInventoryBtn.click();
}

function setActiveNav(activeLink) {
  menuNavLinks.forEach((link) => {
    if (!link) {
      return;
    }
    link.classList.remove("is-active");
  });

  if (activeLink) {
    activeLink.classList.add("is-active");
  }
}

function closeUsersModal(options = {}) {
  closeFeatureModal(usersModal, options);
}

function closeGuardModal(options = {}) {
  closeFeatureModal(guardModal, options);
}

function closeMedicalModal(options = {}) {
  closeFeatureModal(medicalModal, options);
}

function closeCoursesModal(options = {}) {
  closeFeatureModal(coursesModal, options);
}

function closeDayOrdersModal(options = {}) {
  closeFeatureModal(dayOrdersModal, options);
}

function closeVehiclesModal(options = {}) {
  closeFeatureModal(vehiclesModal, options);
}

function closeUniformsModal(options = {}) {
  closeFeatureModal(uniformsModal, options);
}

function openQrModal() {
  qrLastDecoded = "";
  qrManualInput.value = "";
  qrScanStatus.textContent = "Alinea el codigo QR dentro del recuadro para buscar equipo.";
  openFeatureModal(qrModal);
  startQrScanner();
}

function closeQrModal(options = {}) {
  closeFeatureModal(qrModal, options);
  stopQrScanner();
}

function openFeatureModal(element) {
  hideStartMenu();
  mainHeader.classList.add("hidden");
  mainDashboard.classList.add("hidden");
  hideAllFeatureSections();
  element.classList.remove("hidden");
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeFeatureModal(element, options = {}) {
  const { returnHome = false } = options;
  element.classList.add("hidden");

  if (returnHome) {
    openHomeModule();
  }
}

function hideAllFeatureSections() {
  featureSections.forEach((section) => {
    section.classList.add("hidden");
  });
}

async function startQrScanner() {
  if (typeof Html5Qrcode === "undefined") {
    qrScanStatus.textContent = "No se pudo cargar el lector QR. Usa la busqueda manual.";
    return;
  }

  try {
    if (!qrScanner) {
      qrScanner = new Html5Qrcode("qrReader");
    }

    if (qrScannerActive) {
      return;
    }

    qrScanStatus.textContent = "Camara activa. Escaneando codigo...";
    await qrScanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      onQrDecoded,
      () => {}
    );

    qrScannerActive = true;
  } catch {
    qrScanStatus.textContent = "No fue posible acceder a la camara. Usa el codigo manual.";
  }
}

async function stopQrScanner() {
  if (!qrScanner) {
    return;
  }

  try {
    if (qrScannerActive) {
      await qrScanner.stop();
    }
    await qrScanner.clear();
  } catch {
    // Ignorar errores de cierre de camara.
  } finally {
    qrScanner = null;
    qrScannerActive = false;
  }
}

function onQrDecoded(decodedText) {
  const code = String(decodedText || "").trim();
  if (!code || code === qrLastDecoded) {
    return;
  }

  qrLastDecoded = code;
  qrScanStatus.textContent = `Codigo detectado: ${code}`;
  applyInventorySearchFromQr(code);
}

function onManualQrSearch() {
  const code = String(qrManualInput.value || "").trim();
  if (!code) {
    alert("Ingresa un codigo para buscar.");
    return;
  }

  applyInventorySearchFromQr(code);
}

function applyInventorySearchFromQr(code) {
  searchInput.value = code;
  openInventoryModule();
  render();
  closeQrModal();
  inventorySection.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function refreshUsers() {
  const response = await api("/api/users");
  users = response.users || [];
  renderUsers();
}

async function onCreateUser(event) {
  event.preventDefault();
  if (!permissions.canManageUsers) {
    alert("No tienes permisos para gestionar usuarios.");
    return;
  }

  const formData = new FormData(userForm);
  const payload = {
    nombre: String(formData.get("nombre") || "").trim(),
    username: String(formData.get("username") || "").trim(),
    password: String(formData.get("password") || ""),
    role: String(formData.get("role") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    modulePermissions: extractModulePermissions(formData)
  };

  if (!payload.nombre || !payload.username || !payload.password || !payload.role) {
    alert("Completa todos los campos del nuevo usuario.");
    return;
  }

  try {
    await api("/api/users", { method: "POST", body: payload });
    userForm.reset();
    await refreshUsers();
  } catch (error) {
    alert(error.message || "No se pudo crear el usuario.");
  }
}

function renderUsers() {
  usersTableBody.innerHTML = "";

  users.forEach((user) => {
    const permissionsSummary = formatUserPermissionsSummary(user.modulePermissions);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(user.nombre)}</td>
      <td>${escapeHtml(user.username)}</td>
      <td>${escapeHtml(user.email || "-")}</td>
      <td>${escapeHtml(user.phone || "-")}</td>
      <td>${escapeHtml(user.role)}</td>
      <td>${escapeHtml(formatDateTime(user.lastLoginAt))}</td>
      <td>${escapeHtml(permissionsSummary)}</td>
      <td>${user.blocked ? "Bloqueado" : "Activo"}</td>
      <td class="actions-cell"></td>
    `;

    const actions = tr.querySelector(".actions-cell");

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "icon-btn";
    toggleBtn.textContent = user.blocked ? "Desbloquear" : "Bloquear";
    toggleBtn.disabled = user.id === currentUser?.id;
    toggleBtn.addEventListener("click", async () => {
      try {
        await api(`/api/users/${user.id}`, { method: "PATCH", body: { blocked: !user.blocked } });
        await refreshUsers();
      } catch (error) {
        alert(error.message || "No se pudo actualizar estado.");
      }
    });

    const roleBtn = document.createElement("button");
    roleBtn.className = "icon-btn";
    roleBtn.textContent = "Cambiar rol";
    roleBtn.addEventListener("click", async () => {
      const nuevoRol = prompt("Nuevo rol: admin o voluntario", user.role);
      if (!nuevoRol) {
        return;
      }
      try {
        await api(`/api/users/${user.id}`, { method: "PATCH", body: { role: nuevoRol.trim() } });
        await refreshUsers();
      } catch (error) {
        alert(error.message || "No se pudo cambiar el rol.");
      }
    });

    const passwordBtn = document.createElement("button");
    passwordBtn.className = "icon-btn";
    passwordBtn.textContent = "Cambiar clave";
    passwordBtn.addEventListener("click", async () => {
      const nuevaClave = prompt(`Nueva clave para ${user.username}`);
      if (!nuevaClave) {
        return;
      }
      try {
        await api(`/api/users/${user.id}`, { method: "PATCH", body: { password: nuevaClave } });
        alert("Clave actualizada.");
      } catch (error) {
        alert(error.message || "No se pudo cambiar la clave.");
      }
    });

    const permissionsBtn = document.createElement("button");
    permissionsBtn.className = "icon-btn";
    permissionsBtn.textContent = "Permisos";
    permissionsBtn.addEventListener("click", () => openPermissionsEditor(user));

    actions.appendChild(toggleBtn);
    actions.appendChild(roleBtn);
    actions.appendChild(passwordBtn);
    actions.appendChild(permissionsBtn);
    usersTableBody.appendChild(tr);
  });

  usersEmpty.classList.toggle("hidden", users.length > 0);
}

function openPermissionsEditor(user) {
  editingPermissionsUserId = user.id;
  permissionsEditorTitle.textContent = `Permisos por modulo - ${user.nombre} (${user.username})`;
  setPermissionsEditorValues(user.modulePermissions || {});
  permissionsEditorPanel.classList.remove("hidden");
  permissionsEditorPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closePermissionsEditor() {
  editingPermissionsUserId = "";
  permissionsEditorForm.reset();
  permissionsEditorPanel.classList.add("hidden");
  permissionsEditorTitle.textContent = "Permisos por módulo";
}

function setPermissionsEditorValues(modulePermissions) {
  permissionsEditorForm.elements.perm_canWriteInventory.checked = Boolean(modulePermissions.canWriteInventory);
  permissionsEditorForm.elements.perm_canWriteGuardBook.checked = Boolean(modulePermissions.canWriteGuardBook);
  permissionsEditorForm.elements.perm_canWriteMedicalRecords.checked = Boolean(modulePermissions.canWriteMedicalRecords);
  permissionsEditorForm.elements.perm_canWriteVolunteerCourses.checked = Boolean(modulePermissions.canWriteVolunteerCourses);
  permissionsEditorForm.elements.perm_canWriteDayOrders.checked = Boolean(modulePermissions.canWriteDayOrders);
  permissionsEditorForm.elements.perm_canWriteVehicles.checked = Boolean(modulePermissions.canWriteVehicles);
  permissionsEditorForm.elements.perm_canWriteUniforms.checked = Boolean(modulePermissions.canWriteUniforms);
  permissionsEditorForm.elements.perm_canGenerateReports.checked = Boolean(modulePermissions.canGenerateReports);
  permissionsEditorForm.elements.perm_canManageUsers.checked = Boolean(modulePermissions.canManageUsers);
}

async function onSaveUserPermissions(event) {
  event.preventDefault();
  if (!editingPermissionsUserId) {
    return;
  }

  const formData = new FormData(permissionsEditorForm);

  try {
    await api(`/api/users/${editingPermissionsUserId}`, {
      method: "PATCH",
      body: { modulePermissions: extractModulePermissions(formData) }
    });
    closePermissionsEditor();
    await refreshUsers();
  } catch (error) {
    alert(error.message || "No se pudieron actualizar los permisos.");
  }
}

function extractModulePermissions(formData) {
  return {
    canWriteInventory: formData.has("perm_canWriteInventory"),
    canWriteGuardBook: formData.has("perm_canWriteGuardBook"),
    canWriteMedicalRecords: formData.has("perm_canWriteMedicalRecords"),
    canWriteVolunteerCourses: formData.has("perm_canWriteVolunteerCourses"),
    canWriteDayOrders: formData.has("perm_canWriteDayOrders"),
    canWriteVehicles: formData.has("perm_canWriteVehicles"),
    canWriteUniforms: formData.has("perm_canWriteUniforms"),
    canGenerateReports: formData.has("perm_canGenerateReports"),
    canManageUsers: formData.has("perm_canManageUsers")
  };
}

function formatUserPermissionsSummary(modulePermissions) {
  const map = [
    ["canWriteInventory", "Inv"],
    ["canWriteGuardBook", "Guard"],
    ["canWriteMedicalRecords", "Med"],
    ["canWriteVolunteerCourses", "Cursos"],
    ["canWriteDayOrders", "OD"],
    ["canWriteVehicles", "Carros"],
    ["canWriteUniforms", "Uniformes"],
    ["canGenerateReports", "PDF"],
    ["canManageUsers", "Usuarios"]
  ];

  const enabled = map
    .filter(([key]) => modulePermissions && modulePermissions[key])
    .map(([, label]) => label);

  return enabled.length > 0 ? enabled.join(", ") : "Sin permisos";
}

function applyPermissionState() {
  const inventoryDisabled = !permissions.canWriteInventory;
  const fields = form.querySelectorAll("input, select, textarea, button");
  fields.forEach((field) => {
    if (field.id !== "cancelEditBtn") {
      field.disabled = inventoryDisabled;
    }
  });

  if (inventoryDisabled) {
    cancelEditBtn.hidden = true;
  }

  const guardDisabled = !permissions.canWriteGuardBook;
  const guardFields = guardForm.querySelectorAll("input, select, textarea, button");
  guardFields.forEach((field) => {
    field.disabled = guardDisabled;
  });

  const medicalDisabled = !permissions.canWriteMedicalRecords;
  const medicalFields = medicalForm.querySelectorAll("input, select, textarea, button");
  medicalFields.forEach((field) => {
    if (field.id !== "medicalCancelEditBtn") {
      field.disabled = medicalDisabled;
    }
  });

  if (medicalDisabled) {
    medicalCancelEditBtn.hidden = true;
  }

  const courseDisabled = !permissions.canWriteVolunteerCourses;
  const courseFields = coursesForm.querySelectorAll("input, select, textarea, button");
  courseFields.forEach((field) => {
    if (field.id !== "courseCancelEditBtn") {
      field.disabled = courseDisabled;
    }
  });

  if (courseDisabled) {
    courseCancelEditBtn.hidden = true;
  }

  const dayOrdersDisabled = !permissions.canWriteDayOrders;
  const dayOrderFields = dayOrdersForm.querySelectorAll("input, select, textarea, button");
  dayOrderFields.forEach((field) => {
    if (field.id !== "dayOrderCancelEditBtn") {
      field.disabled = dayOrdersDisabled;
    }
  });

  if (dayOrdersDisabled) {
    dayOrderCancelEditBtn.hidden = true;
  }

  const vehiclesDisabled = !permissions.canWriteVehicles;
  const vehicleFields = vehiclesForm.querySelectorAll("input, select, textarea, button");
  vehicleFields.forEach((field) => {
    if (field.id !== "vehicleCancelEditBtn") {
      field.disabled = vehiclesDisabled;
    }
  });

  if (vehiclesDisabled) {
    vehicleCancelEditBtn.hidden = true;
  }

  const uniformsDisabled = !permissions.canWriteUniforms;
  const uniformFields = uniformsForm.querySelectorAll("input, select, textarea, button");
  uniformFields.forEach((field) => {
    if (field.id !== "uniformCancelEditBtn") {
      field.disabled = uniformsDisabled;
    }
  });

  if (uniformsDisabled) {
    uniformCancelEditBtn.hidden = true;
  }
}

async function onGuardSubmit(event) {
  event.preventDefault();

  if (!permissions.canWriteGuardBook) {
    alert("Tu rol es solo lectura. No puedes registrar novedades de guardia.");
    return;
  }

  const formData = new FormData(guardForm);
  const payload = {
    fechaTurno: String(formData.get("fechaTurno") || "").trim(),
    turno: String(formData.get("turno") || "").trim(),
    tipo: String(formData.get("tipo") || "").trim(),
    recurso: String(formData.get("recurso") || "").trim(),
    descripcion: String(formData.get("descripcion") || "").trim()
  };

  if (!payload.fechaTurno || !payload.turno || !payload.tipo || !payload.descripcion) {
    alert("Completa fecha, turno, tipo y descripción.");
    return;
  }

  try {
    await api("/api/guard-book", { method: "POST", body: payload });
    guardForm.reset();
    setDefaultGuardDate();
    await refreshGuardBook();
  } catch (error) {
    alert(error.message || "No se pudo registrar la novedad.");
  }
}

function getFilteredGuardEntries() {
  const term = guardSearchInput.value.trim().toLowerCase();
  const turno = guardFilterTurno.value;
  const tipo = guardFilterTipo.value;

  return guardEntries.filter((entry) => {
    const matchesTurno = turno === "Todos" || entry.turno === turno;
    const matchesTipo = tipo === "Todos" || entry.tipo === tipo;
    const haystack = `${entry.descripcion} ${entry.recurso || ""} ${entry.autorNombre || ""}`.toLowerCase();
    const matchesTerm = !term || haystack.includes(term);
    return matchesTurno && matchesTipo && matchesTerm;
  });
}

function renderGuardBook() {
  const entries = getFilteredGuardEntries();
  guardTableBody.innerHTML = "";

  entries.forEach((entry, idx) => {
    const tr = document.createElement("tr");
    tr.style.animationDelay = `${idx * 35}ms`;
    tr.innerHTML = `
      <td>${escapeHtml(formatDate(entry.fechaTurno))}</td>
      <td>${escapeHtml(formatTurnoLabel(entry.turno))}</td>
      <td>${escapeHtml(entry.tipo)}</td>
      <td>${escapeHtml(entry.recurso || "-")}</td>
      <td>${escapeHtml(entry.descripcion)}</td>
      <td>${escapeHtml(entry.autorNombre || "-")}</td>
      <td>${escapeHtml(formatDateTime(entry.creadoEn))}</td>
    `;
    guardTableBody.appendChild(tr);
  });

  guardEmptyState.classList.toggle("hidden", entries.length > 0);
}

function setDefaultGuardDate() {
  guardFechaTurno.value = new Date().toISOString().slice(0, 10);
}

function getFilteredMedicalRecords() {
  const term = medicalSearchInput.value.trim().toLowerCase();

  return medicalRecords.filter((record) => {
    const haystack = `${record.voluntarioNombre} ${record.grupoSanguineo}`.toLowerCase();
    return !term || haystack.includes(term);
  });
}

function renderMedicalRecords() {
  const rows = getFilteredMedicalRecords();
  medicalTableBody.innerHTML = "";

  rows.forEach((record, idx) => {
    const tr = document.createElement("tr");
    tr.style.animationDelay = `${idx * 30}ms`;
    tr.innerHTML = `
      <td>${escapeHtml(record.voluntarioNombre)}</td>
      <td>${escapeHtml(record.grupoSanguineo || "-")}</td>
      <td>${escapeHtml(record.alergias || "-")}</td>
      <td>${escapeHtml(record.enfermedades || "-")}</td>
      <td>${escapeHtml(record.medicamentos || "-")}</td>
      <td>${escapeHtml(record.contactoEmergenciaNombre || "-")}</td>
      <td>${escapeHtml(record.contactoEmergenciaTelefono || "-")}</td>
      <td>${escapeHtml(record.contactoEmergenciaRelacion || "-")}</td>
      <td>${escapeHtml(formatDateTime(record.actualizadoEn))}</td>
      <td>${escapeHtml(record.actualizadoPor || "-")}</td>
      <td class="actions-cell"></td>
    `;

    const actions = tr.querySelector(".actions-cell");

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.textContent = "Editar";
    editBtn.disabled = !permissions.canWriteMedicalRecords;
    editBtn.addEventListener("click", () => startEditMedicalRecord(record.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn delete-btn";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.disabled = !permissions.canWriteMedicalRecords;
    deleteBtn.addEventListener("click", () => removeMedicalRecord(record.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    medicalTableBody.appendChild(tr);
  });

  medicalEmptyState.classList.toggle("hidden", rows.length > 0);
}

function startEditMedicalRecord(id) {
  const record = medicalRecords.find((candidate) => candidate.id === id);
  if (!record) {
    return;
  }

  medicalRecordId.value = record.id;
  medicalForm.voluntarioNombre.value = record.voluntarioNombre || "";
  medicalForm.grupoSanguineo.value = record.grupoSanguineo || "Desconocido";
  medicalForm.alergias.value = record.alergias || "";
  medicalForm.enfermedades.value = record.enfermedades || "";
  medicalForm.medicamentos.value = record.medicamentos || "";
  medicalForm.contactoEmergenciaNombre.value = record.contactoEmergenciaNombre || "";
  medicalForm.contactoEmergenciaTelefono.value = record.contactoEmergenciaTelefono || "";
  medicalForm.contactoEmergenciaRelacion.value = record.contactoEmergenciaRelacion || "";

  document.getElementById("medicalSaveBtn").textContent = "Actualizar ficha";
  medicalCancelEditBtn.hidden = false;
  medicalForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function removeMedicalRecord(id) {
  if (!permissions.canWriteMedicalRecords) {
    alert("Tu rol es solo lectura. No puedes eliminar fichas medicas.");
    return;
  }

  const record = medicalRecords.find((candidate) => candidate.id === id);
  if (!record) {
    return;
  }

  const confirmed = confirm(`¿Eliminar la ficha medica de "${record.voluntarioNombre}"?`);
  if (!confirmed) {
    return;
  }

  try {
    await api(`/api/medical-records/${id}`, { method: "DELETE" });
    await refreshMedicalRecords();
    if (medicalRecordId.value === id) {
      resetMedicalForm();
    }
  } catch (error) {
    alert(error.message || "No se pudo eliminar la ficha medica.");
  }
}

async function onMedicalSubmit(event) {
  event.preventDefault();

  if (!permissions.canWriteMedicalRecords) {
    alert("Tu rol es solo lectura. No puedes registrar fichas medicas.");
    return;
  }

  const formData = new FormData(medicalForm);
  const payload = {
    voluntarioNombre: String(formData.get("voluntarioNombre") || "").trim(),
    grupoSanguineo: String(formData.get("grupoSanguineo") || "Desconocido").trim(),
    alergias: String(formData.get("alergias") || "").trim(),
    enfermedades: String(formData.get("enfermedades") || "").trim(),
    medicamentos: String(formData.get("medicamentos") || "").trim(),
    contactoEmergenciaNombre: String(formData.get("contactoEmergenciaNombre") || "").trim(),
    contactoEmergenciaTelefono: String(formData.get("contactoEmergenciaTelefono") || "").trim(),
    contactoEmergenciaRelacion: String(formData.get("contactoEmergenciaRelacion") || "").trim()
  };

  if (!payload.voluntarioNombre || !payload.contactoEmergenciaNombre || !payload.contactoEmergenciaTelefono) {
    alert("Completa nombre del voluntario y contacto de emergencia (nombre y telefono).");
    return;
  }

  try {
    const isEdit = Boolean(medicalRecordId.value);
    if (isEdit) {
      await api(`/api/medical-records/${medicalRecordId.value}`, {
        method: "PUT",
        body: payload
      });
    } else {
      await api("/api/medical-records", {
        method: "POST",
        body: payload
      });
    }

    resetMedicalForm();
    await refreshMedicalRecords();
  } catch (error) {
    alert(error.message || "No se pudo guardar la ficha medica.");
  }
}

function resetMedicalForm() {
  medicalForm.reset();
  medicalRecordId.value = "";
  medicalForm.grupoSanguineo.value = "O+";
  document.getElementById("medicalSaveBtn").textContent = "Guardar ficha";
  medicalCancelEditBtn.hidden = true;
}

function getFilteredCourses() {
  const term = coursesSearchInput.value.trim().toLowerCase();

  return volunteerCourses.filter((course) => {
    const haystack = `${course.voluntarioNombre} ${course.curso} ${course.institucion} ${course.certificacion}`.toLowerCase();
    return !term || haystack.includes(term);
  });
}

function renderCourses() {
  const rows = getFilteredCourses();
  coursesTableBody.innerHTML = "";

  rows.forEach((course, idx) => {
    const tr = document.createElement("tr");
    tr.style.animationDelay = `${idx * 30}ms`;
    tr.innerHTML = `
      <td>${escapeHtml(course.voluntarioNombre)}</td>
      <td>${escapeHtml(course.curso)}</td>
      <td>${escapeHtml(course.institucion)}</td>
      <td>${escapeHtml(formatDate(course.fechaInicio))}</td>
      <td>${escapeHtml(formatDate(course.fechaFin))}</td>
      <td>${escapeHtml(course.certificacion)}</td>
      <td>${escapeHtml(String(course.horasCapacitacion))}</td>
      <td>${escapeHtml(formatDateTime(course.actualizadoEn))}</td>
      <td>${escapeHtml(course.actualizadoPor || "-")}</td>
      <td class="actions-cell"></td>
    `;

    const actions = tr.querySelector(".actions-cell");

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.textContent = "Editar";
    editBtn.disabled = !permissions.canWriteVolunteerCourses;
    editBtn.addEventListener("click", () => startEditCourse(course.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn delete-btn";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.disabled = !permissions.canWriteVolunteerCourses;
    deleteBtn.addEventListener("click", () => removeCourse(course.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    coursesTableBody.appendChild(tr);
  });

  coursesEmptyState.classList.toggle("hidden", rows.length > 0);
}

function startEditCourse(id) {
  const course = volunteerCourses.find((candidate) => candidate.id === id);
  if (!course) {
    return;
  }

  courseRecordId.value = course.id;
  coursesForm.voluntarioNombre.value = course.voluntarioNombre || "";
  coursesForm.curso.value = course.curso || "";
  coursesForm.institucion.value = course.institucion || "";
  coursesForm.fechaInicio.value = course.fechaInicio || "";
  coursesForm.fechaFin.value = course.fechaFin || "";
  coursesForm.certificacion.value = course.certificacion || "";
  coursesForm.horasCapacitacion.value = course.horasCapacitacion || "";

  document.getElementById("courseSaveBtn").textContent = "Actualizar curso";
  courseCancelEditBtn.hidden = false;
  coursesForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function removeCourse(id) {
  if (!permissions.canWriteVolunteerCourses) {
    alert("Tu rol es solo lectura. No puedes eliminar cursos.");
    return;
  }

  const course = volunteerCourses.find((candidate) => candidate.id === id);
  if (!course) {
    return;
  }

  const confirmed = confirm(`¿Eliminar el curso "${course.curso}" de ${course.voluntarioNombre}?`);
  if (!confirmed) {
    return;
  }

  try {
    await api(`/api/volunteer-courses/${id}`, { method: "DELETE" });
    await refreshCourses();
    if (courseRecordId.value === id) {
      resetCourseForm();
    }
  } catch (error) {
    alert(error.message || "No se pudo eliminar el curso.");
  }
}

async function onCourseSubmit(event) {
  event.preventDefault();

  if (!permissions.canWriteVolunteerCourses) {
    alert("Tu rol es solo lectura. No puedes registrar cursos.");
    return;
  }

  const formData = new FormData(coursesForm);
  const payload = {
    voluntarioNombre: String(formData.get("voluntarioNombre") || "").trim(),
    curso: String(formData.get("curso") || "").trim(),
    institucion: String(formData.get("institucion") || "").trim(),
    fechaInicio: String(formData.get("fechaInicio") || "").trim(),
    fechaFin: String(formData.get("fechaFin") || "").trim(),
    certificacion: String(formData.get("certificacion") || "").trim(),
    horasCapacitacion: Number(formData.get("horasCapacitacion") || 0)
  };

  if (!payload.voluntarioNombre || !payload.curso || !payload.institucion || !payload.fechaInicio || !payload.certificacion) {
    alert("Completa voluntario, curso, institucion, fecha de inicio y certificacion.");
    return;
  }

  if (payload.horasCapacitacion < 1) {
    alert("Las horas de capacitacion deben ser mayores o iguales a 1.");
    return;
  }

  try {
    const isEdit = Boolean(courseRecordId.value);
    if (isEdit) {
      await api(`/api/volunteer-courses/${courseRecordId.value}`, {
        method: "PUT",
        body: payload
      });
    } else {
      await api("/api/volunteer-courses", {
        method: "POST",
        body: payload
      });
    }

    resetCourseForm();
    await refreshCourses();
  } catch (error) {
    alert(error.message || "No se pudo guardar el curso.");
  }
}

function resetCourseForm() {
  coursesForm.reset();
  courseRecordId.value = "";
  document.getElementById("courseSaveBtn").textContent = "Guardar curso";
  courseCancelEditBtn.hidden = true;
}

function getFilteredDayOrders() {
  const term = dayOrdersSearchInput.value.trim().toLowerCase();
  const tipo = dayOrdersFilterTipo.value;

  return dayOrders.filter((order) => {
    const matchesTipo = tipo === "Todos" || order.tipo === tipo;
    const haystack = `${order.titulo || ""} ${order.contenido || ""} ${order.firmadoPor || ""}`.toLowerCase();
    const matchesTerm = !term || haystack.includes(term);
    return matchesTipo && matchesTerm;
  });
}

function renderDayOrders() {
  const rows = getFilteredDayOrders();
  dayOrdersTableBody.innerHTML = "";

  rows.forEach((order, idx) => {
    const tr = document.createElement("tr");
    tr.style.animationDelay = `${idx * 30}ms`;
    tr.innerHTML = `
      <td>${escapeHtml(formatDate(order.fecha))}</td>
      <td>${escapeHtml(order.tipo)}</td>
      <td>${escapeHtml(order.titulo)}</td>
      <td>${escapeHtml(order.contenido)}</td>
      <td>${escapeHtml(order.firmadoPor)}</td>
      <td>${order.publicado ? "Si" : "No"}</td>
      <td class="actions-cell"></td>
    `;

    const actions = tr.querySelector(".actions-cell");

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.textContent = "Editar";
    editBtn.disabled = !permissions.canWriteDayOrders;
    editBtn.addEventListener("click", () => startEditDayOrder(order.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn delete-btn";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.disabled = !permissions.canWriteDayOrders;
    deleteBtn.addEventListener("click", () => removeDayOrder(order.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    dayOrdersTableBody.appendChild(tr);
  });

  dayOrdersEmptyState.classList.toggle("hidden", rows.length > 0);
}

function startEditDayOrder(id) {
  const order = dayOrders.find((candidate) => candidate.id === id);
  if (!order) {
    return;
  }

  dayOrderId.value = order.id;
  dayOrdersForm.fecha.value = order.fecha || "";
  dayOrdersForm.tipo.value = order.tipo || "Disposicion";
  dayOrdersForm.titulo.value = order.titulo || "";
  dayOrdersForm.contenido.value = order.contenido || "";
  dayOrdersForm.firmadoPor.value = order.firmadoPor || "";
  document.getElementById("dayOrderSaveBtn").textContent = "Actualizar orden";
  dayOrderCancelEditBtn.hidden = false;
}

async function removeDayOrder(id) {
  if (!permissions.canWriteDayOrders) {
    alert("Tu rol es solo lectura. No puedes eliminar ordenes del dia.");
    return;
  }

  const order = dayOrders.find((candidate) => candidate.id === id);
  if (!order) {
    return;
  }

  const confirmed = confirm(`¿Eliminar la orden "${order.titulo}"?`);
  if (!confirmed) {
    return;
  }

  try {
    await api(`/api/day-orders/${id}`, { method: "DELETE" });
    await refreshDayOrders();
    if (dayOrderId.value === id) {
      resetDayOrderForm();
    }
  } catch (error) {
    alert(error.message || "No se pudo eliminar la orden del dia.");
  }
}

async function onDayOrderSubmit(event) {
  event.preventDefault();

  if (!permissions.canWriteDayOrders) {
    alert("Tu rol es solo lectura. No puedes publicar ordenes del dia.");
    return;
  }

  const formData = new FormData(dayOrdersForm);
  const payload = {
    fecha: String(formData.get("fecha") || "").trim(),
    tipo: String(formData.get("tipo") || "").trim(),
    titulo: String(formData.get("titulo") || "").trim(),
    contenido: String(formData.get("contenido") || "").trim(),
    firmadoPor: String(formData.get("firmadoPor") || "").trim()
  };

  if (!payload.fecha || !payload.tipo || !payload.titulo || !payload.contenido || !payload.firmadoPor) {
    alert("Completa fecha, tipo, titulo, contenido y firma.");
    return;
  }

  try {
    const isEdit = Boolean(dayOrderId.value);
    if (isEdit) {
      await api(`/api/day-orders/${dayOrderId.value}`, {
        method: "PUT",
        body: payload
      });
    } else {
      await api("/api/day-orders", {
        method: "POST",
        body: payload
      });
    }

    resetDayOrderForm();
    await refreshDayOrders();
  } catch (error) {
    alert(error.message || "No se pudo guardar la orden del dia.");
  }
}

function resetDayOrderForm() {
  dayOrdersForm.reset();
  dayOrderId.value = "";
  dayOrdersForm.tipo.value = "Disposicion";
  dayOrdersForm.fecha.value = new Date().toISOString().slice(0, 10);
  document.getElementById("dayOrderSaveBtn").textContent = "Publicar orden";
  dayOrderCancelEditBtn.hidden = true;
}

function getFilteredVehicles() {
  const term = vehiclesSearchInput.value.trim().toLowerCase();
  const status = vehiclesFilterStatus.value;

  return vehicles.filter((vehicle) => {
    const matchesStatus = status === "Todos" || vehicle.estadoOperativo === status;
    const haystack = `${vehicle.codigo || ""} ${vehicle.patente || ""} ${vehicle.marcaModelo || ""} ${vehicle.observaciones || ""}`.toLowerCase();
    const matchesTerm = !term || haystack.includes(term);
    return matchesStatus && matchesTerm;
  });
}

function renderVehicles() {
  const rows = getFilteredVehicles();
  vehiclesTableBody.innerHTML = "";

  rows.forEach((vehicle, idx) => {
    const tr = document.createElement("tr");
    const alertData = getVehicleAlertData(vehicle);
    tr.style.animationDelay = `${idx * 30}ms`;
    if (alertData.className === "alert-high") {
      tr.classList.add("vehicle-critical");
    }

    const statusClass = getVehicleStatusClass(vehicle.estadoOperativo);
    tr.innerHTML = `
      <td>${escapeHtml(vehicle.codigo)}</td>
      <td>${escapeHtml(vehicle.patente)}</td>
      <td>${escapeHtml(vehicle.marcaModelo)}</td>
      <td>${escapeHtml(String(vehicle.anio))}</td>
      <td>${escapeHtml(String(vehicle.kilometraje))}</td>
      <td class="${statusClass}">${escapeHtml(vehicle.estadoOperativo)}</td>
      <td>${escapeHtml(formatDate(vehicle.ultimaMantencion))}</td>
      <td>${escapeHtml(vehicle.proximaMantencionKm ? String(vehicle.proximaMantencionKm) : "-")}</td>
      <td>${escapeHtml(formatDate(vehicle.revisionTecnicaVencimiento))}</td>
      <td><span class="alert-pill ${alertData.className}">${escapeHtml(alertData.label)}</span></td>
      <td>${escapeHtml(vehicle.observaciones || "-")}</td>
      <td>${escapeHtml(formatDateTime(vehicle.actualizadoEn))}</td>
      <td>${escapeHtml(vehicle.actualizadoPor || "-")}</td>
      <td class="actions-cell"></td>
    `;

    const actions = tr.querySelector(".actions-cell");

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.textContent = "Editar";
    editBtn.disabled = !permissions.canWriteVehicles;
    editBtn.addEventListener("click", () => startEditVehicle(vehicle.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn delete-btn";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.disabled = !permissions.canWriteVehicles;
    deleteBtn.addEventListener("click", () => removeVehicle(vehicle.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    vehiclesTableBody.appendChild(tr);
  });

  vehiclesEmptyState.classList.toggle("hidden", rows.length > 0);
}

function getVehicleStatusClass(status) {
  if (status === "Disponible") {
    return "status-ok";
  }

  return statusClassMap[status] || "";
}

function getVehicleAlertData(vehicle) {
  const alerts = [];
  let level = "none";

  const reviewLevel = getDateAlertLevel(vehicle.revisionTecnicaVencimiento, 30);
  if (reviewLevel === "expired") {
    alerts.push("Rev. tecnica vencida");
    level = "high";
  } else if (reviewLevel === "soon") {
    alerts.push("Rev. tecnica <= 30 dias");
    if (level !== "high") {
      level = "medium";
    }
  }

  const nextMaintenanceKm = Number(vehicle.proximaMantencionKm || 0);
  const currentKm = Number(vehicle.kilometraje || 0);
  if (nextMaintenanceKm > 0 && Number.isFinite(currentKm)) {
    const deltaKm = nextMaintenanceKm - currentKm;
    if (deltaKm < 0) {
      alerts.push("Mantencion vencida");
      level = "high";
    } else if (deltaKm <= 1000) {
      alerts.push("Mantencion <= 1000 km");
      if (level !== "high") {
        level = "medium";
      }
    }
  }

  if (vehicle.estadoOperativo === "Fuera de Servicio") {
    alerts.push("Estado critico");
    level = "high";
  } else if (vehicle.estadoOperativo === "En Mantenimiento") {
    alerts.push("En mantenimiento");
    if (level !== "high") {
      level = "medium";
    }
  }

  if (alerts.length === 0) {
    return { label: "Normal", className: "alert-none" };
  }

  return {
    label: alerts.join(" + "),
    className: level === "high" ? "alert-high" : "alert-medium"
  };
}

function getDateAlertLevel(dateText, daysThreshold) {
  if (!dateText) {
    return "none";
  }

  const target = new Date(dateText);
  if (Number.isNaN(target.getTime())) {
    return "none";
  }

  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.ceil((target - now) / msPerDay);

  if (diffDays < 0) {
    return "expired";
  }

  if (diffDays <= daysThreshold) {
    return "soon";
  }

  return "none";
}

function startEditVehicle(id) {
  const vehicle = vehicles.find((candidate) => candidate.id === id);
  if (!vehicle) {
    return;
  }

  vehicleId.value = vehicle.id;
  vehiclesForm.codigo.value = vehicle.codigo || "";
  vehiclesForm.patente.value = vehicle.patente || "";
  vehiclesForm.marcaModelo.value = vehicle.marcaModelo || "";
  vehiclesForm.anio.value = vehicle.anio || "";
  vehiclesForm.kilometraje.value = vehicle.kilometraje || 0;
  vehiclesForm.estadoOperativo.value = vehicle.estadoOperativo || "Disponible";
  vehiclesForm.ultimaMantencion.value = vehicle.ultimaMantencion || "";
  vehiclesForm.proximaMantencionKm.value = vehicle.proximaMantencionKm || "";
  vehiclesForm.revisionTecnicaVencimiento.value = vehicle.revisionTecnicaVencimiento || "";
  vehiclesForm.observaciones.value = vehicle.observaciones || "";

  document.getElementById("vehicleSaveBtn").textContent = "Actualizar carro";
  vehicleCancelEditBtn.hidden = false;
  vehiclesForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function removeVehicle(id) {
  if (!permissions.canWriteVehicles) {
    alert("Tu rol es solo lectura. No puedes eliminar carros.");
    return;
  }

  const vehicle = vehicles.find((candidate) => candidate.id === id);
  if (!vehicle) {
    return;
  }

  const confirmed = confirm(`¿Eliminar el carro ${vehicle.codigo} (${vehicle.patente})?`);
  if (!confirmed) {
    return;
  }

  try {
    await api(`/api/vehicles/${id}`, { method: "DELETE" });
    await refreshVehicles();
    if (vehicleId.value === id) {
      resetVehicleForm();
    }
  } catch (error) {
    alert(error.message || "No se pudo eliminar el carro.");
  }
}

async function onVehicleSubmit(event) {
  event.preventDefault();

  if (!permissions.canWriteVehicles) {
    alert("Tu rol es solo lectura. No puedes registrar carros.");
    return;
  }

  const formData = new FormData(vehiclesForm);
  const payload = {
    codigo: String(formData.get("codigo") || "").trim(),
    patente: String(formData.get("patente") || "").trim(),
    marcaModelo: String(formData.get("marcaModelo") || "").trim(),
    anio: Number(formData.get("anio") || 0),
    kilometraje: Number(formData.get("kilometraje") || 0),
    estadoOperativo: String(formData.get("estadoOperativo") || "").trim(),
    ultimaMantencion: String(formData.get("ultimaMantencion") || "").trim(),
    proximaMantencionKm: Number(formData.get("proximaMantencionKm") || 0),
    revisionTecnicaVencimiento: String(formData.get("revisionTecnicaVencimiento") || "").trim(),
    observaciones: String(formData.get("observaciones") || "").trim()
  };

  if (!payload.proximaMantencionKm) {
    payload.proximaMantencionKm = 0;
  }

  if (!payload.codigo || !payload.patente || !payload.marcaModelo || !payload.anio || !payload.estadoOperativo) {
    alert("Completa codigo, patente, marca/modelo, año y estado operativo.");
    return;
  }

  try {
    const isEdit = Boolean(vehicleId.value);
    if (isEdit) {
      await api(`/api/vehicles/${vehicleId.value}`, {
        method: "PUT",
        body: payload
      });
    } else {
      await api("/api/vehicles", {
        method: "POST",
        body: payload
      });
    }

    resetVehicleForm();
    await refreshVehicles();
  } catch (error) {
    alert(error.message || "No se pudo guardar el carro.");
  }
}

function resetVehicleForm() {
  vehiclesForm.reset();
  vehicleId.value = "";
  vehiclesForm.estadoOperativo.value = "Disponible";
  document.getElementById("vehicleSaveBtn").textContent = "Guardar carro";
  vehicleCancelEditBtn.hidden = true;
}

function getFilteredUniforms() {
  const term = uniformsSearchInput.value.trim().toLowerCase();
  const movement = uniformsFilterMovement.value;
  const status = uniformsFilterStatus.value;

  return uniforms.filter((record) => {
    const matchesMovement = movement === "Todos" || record.tipoMovimiento === movement;
    const matchesStatus = status === "Todos" || record.estadoPrenda === status;
    const haystack = `${record.voluntarioNombre || ""} ${record.prenda || ""} ${record.talla || ""} ${record.observaciones || ""}`.toLowerCase();
    const matchesTerm = !term || haystack.includes(term);
    return matchesMovement && matchesStatus && matchesTerm;
  });
}

function renderUniforms() {
  const rows = getFilteredUniforms();
  uniformsTableBody.innerHTML = "";

  rows.forEach((record, idx) => {
    const tr = document.createElement("tr");
    const alertData = getUniformAlertData(record);
    tr.style.animationDelay = `${idx * 30}ms`;
    if (alertData.className === "alert-high") {
      tr.classList.add("uniform-critical");
    }
    tr.innerHTML = `
      <td>${escapeHtml(record.voluntarioNombre)}</td>
      <td>${escapeHtml(record.prenda)}</td>
      <td>${escapeHtml(record.talla)}</td>
      <td>${escapeHtml(String(record.cantidad))}</td>
      <td>${escapeHtml(record.tipoMovimiento)}</td>
      <td class="${getUniformStatusClass(record.estadoPrenda)}">${escapeHtml(record.estadoPrenda)}</td>
      <td>${escapeHtml(formatDate(record.fechaMovimiento))}</td>
      <td>${escapeHtml(formatDate(record.fechaVencimiento))}</td>
      <td><span class="alert-pill ${alertData.className}">${escapeHtml(alertData.label)}</span></td>
      <td>${escapeHtml(record.observaciones || "-")}</td>
      <td>${escapeHtml(formatDateTime(record.actualizadoEn))}</td>
      <td>${escapeHtml(record.actualizadoPor || "-")}</td>
      <td class="actions-cell"></td>
    `;

    const actions = tr.querySelector(".actions-cell");

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.textContent = "Editar";
    editBtn.disabled = !permissions.canWriteUniforms;
    editBtn.addEventListener("click", () => startEditUniform(record.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn delete-btn";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.disabled = !permissions.canWriteUniforms;
    deleteBtn.addEventListener("click", () => removeUniform(record.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    uniformsTableBody.appendChild(tr);
  });

  uniformsEmptyState.classList.toggle("hidden", rows.length > 0);
}

function getUniformStatusClass(status) {
  if (status === "En Uso" || status === "Disponible") {
    return "status-ok";
  }

  if (status === "En Reparacion") {
    return "status-maintenance";
  }

  return statusClassMap[status] || "";
}

function getUniformAlertData(record) {
  const alerts = [];
  let level = "none";

  const expiryLevel = getDateAlertLevel(record.fechaVencimiento, 30);
  if (expiryLevel === "expired") {
    alerts.push("Prenda vencida");
    level = "high";
  } else if (expiryLevel === "soon") {
    alerts.push("Vence <= 30 dias");
    level = "medium";
  }

  if (record.estadoPrenda === "Fuera de Servicio") {
    alerts.push("Estado critico");
    level = "high";
  } else if (record.estadoPrenda === "En Reparacion") {
    alerts.push("En reparacion");
    if (level !== "high") {
      level = "medium";
    }
  }

  if (record.tipoMovimiento === "Devolucion" && record.estadoPrenda === "En Uso") {
    alerts.push("Revisar estado");
    if (level === "none") {
      level = "medium";
    }
  }

  if (alerts.length === 0) {
    return { label: "Normal", className: "alert-none" };
  }

  return {
    label: alerts.join(" + "),
    className: level === "high" ? "alert-high" : "alert-medium"
  };
}

function startEditUniform(id) {
  const record = uniforms.find((candidate) => candidate.id === id);
  if (!record) {
    return;
  }

  uniformRecordId.value = record.id;
  uniformsForm.voluntarioNombre.value = record.voluntarioNombre || "";
  uniformsForm.prenda.value = record.prenda || "";
  uniformsForm.talla.value = record.talla || "";
  uniformsForm.cantidad.value = record.cantidad || 1;
  uniformsForm.tipoMovimiento.value = record.tipoMovimiento || "Entrega";
  uniformsForm.estadoPrenda.value = record.estadoPrenda || "En Uso";
  uniformsForm.fechaMovimiento.value = record.fechaMovimiento || "";
  uniformsForm.fechaVencimiento.value = record.fechaVencimiento || "";
  uniformsForm.observaciones.value = record.observaciones || "";

  document.getElementById("uniformSaveBtn").textContent = "Actualizar movimiento";
  uniformCancelEditBtn.hidden = false;
  uniformsForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function removeUniform(id) {
  if (!permissions.canWriteUniforms) {
    alert("Tu rol es solo lectura. No puedes eliminar movimientos de uniformes.");
    return;
  }

  const record = uniforms.find((candidate) => candidate.id === id);
  if (!record) {
    return;
  }

  const confirmed = confirm(`¿Eliminar movimiento de ${record.prenda} para ${record.voluntarioNombre}?`);
  if (!confirmed) {
    return;
  }

  try {
    await api(`/api/uniform-inventory/${id}`, { method: "DELETE" });
    await refreshUniforms();
    if (uniformRecordId.value === id) {
      resetUniformForm();
    }
  } catch (error) {
    alert(error.message || "No se pudo eliminar el movimiento de uniforme.");
  }
}

async function onUniformSubmit(event) {
  event.preventDefault();

  if (!permissions.canWriteUniforms) {
    alert("Tu rol es solo lectura. No puedes registrar movimientos de uniformes.");
    return;
  }

  const formData = new FormData(uniformsForm);
  const payload = {
    voluntarioNombre: String(formData.get("voluntarioNombre") || "").trim(),
    prenda: String(formData.get("prenda") || "").trim(),
    talla: String(formData.get("talla") || "").trim(),
    cantidad: Number(formData.get("cantidad") || 0),
    tipoMovimiento: String(formData.get("tipoMovimiento") || "").trim(),
    estadoPrenda: String(formData.get("estadoPrenda") || "").trim(),
    fechaMovimiento: String(formData.get("fechaMovimiento") || "").trim(),
    fechaVencimiento: String(formData.get("fechaVencimiento") || "").trim(),
    observaciones: String(formData.get("observaciones") || "").trim()
  };

  if (!payload.voluntarioNombre || !payload.prenda || !payload.talla || payload.cantidad < 1 || !payload.tipoMovimiento || !payload.estadoPrenda || !payload.fechaMovimiento) {
    alert("Completa voluntario, prenda, talla, cantidad, movimiento, estado y fecha del movimiento.");
    return;
  }

  try {
    const isEdit = Boolean(uniformRecordId.value);
    if (isEdit) {
      await api(`/api/uniform-inventory/${uniformRecordId.value}`, {
        method: "PUT",
        body: payload
      });
    } else {
      await api("/api/uniform-inventory", {
        method: "POST",
        body: payload
      });
    }

    resetUniformForm();
    await refreshUniforms();
  } catch (error) {
    alert(error.message || "No se pudo guardar el movimiento de uniforme.");
  }
}

function resetUniformForm() {
  uniformsForm.reset();
  uniformRecordId.value = "";
  uniformsForm.tipoMovimiento.value = "Entrega";
  uniformsForm.estadoPrenda.value = "En Uso";
  uniformsForm.fechaMovimiento.value = new Date().toISOString().slice(0, 10);
  document.getElementById("uniformSaveBtn").textContent = "Guardar movimiento";
  uniformCancelEditBtn.hidden = true;
}

function formatTurnoLabel(turno) {
  const labels = {
    Manana: "Mañana",
    Tarde: "Tarde",
    Noche: "Noche"
  };
  return labels[turno] || turno;
}

function formatDateTime(dateText) {
  if (!dateText) {
    return "-";
  }

  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("es-ES");
}

async function downloadPdfReport(url, tipo) {
  if (!permissions.canGenerateReports) {
    alert("No tienes permisos para generar reportes.");
    return;
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      const err = await safeJson(response);
      throw new Error(err.error || "No se pudo generar el PDF.");
    }

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${tipo}-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    alert(error.message || "No se pudo descargar el PDF.");
  }
}

async function safeJson(response) {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function escapeCsvValue(value) {
  const text = String(value ?? "");
  const escaped = text.replaceAll('"', '""');
  return `"${escaped}"`;
}

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

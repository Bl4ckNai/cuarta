const TOKEN_KEY = "inventario_auth_token";
const API_TIMEOUT_MS = 15000;

const authShell = document.getElementById("authShell");
const mainHeader = document.getElementById("mainHeader");
const mainDashboard = document.getElementById("mainDashboard");
const homeLanding = document.getElementById("homeLanding");
const loginForm = document.getElementById("loginForm");
const loginCompanySelect = document.getElementById("loginCompany");
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
const saveInventoryFiltersBtn = document.getElementById("saveInventoryFiltersBtn");
const loadInventoryFiltersBtn = document.getElementById("loadInventoryFiltersBtn");
const resetInventoryFiltersBtn = document.getElementById("resetInventoryFiltersBtn");
const reportUniformsBtn = document.getElementById("reportUniformsBtn");
const quickScanQrBtn = document.getElementById("quickScanQrBtn");
const quickNewRecordBtn = document.getElementById("quickNewRecordBtn");
const quickReportBtn = document.getElementById("quickReportBtn");
const autoApplySavedFiltersBtn = document.getElementById("autoApplySavedFiltersBtn");
const clearAllSavedFiltersBtn = document.getElementById("clearAllSavedFiltersBtn");
const savedFiltersModeHint = document.getElementById("savedFiltersModeHint");
const lastModuleLabel = document.getElementById("lastModuleLabel");
const reopenLastModuleBtn = document.getElementById("reopenLastModuleBtn");
const quickGlobalSearchInput = document.getElementById("quickGlobalSearchInput");
const quickGlobalSearchBtn = document.getElementById("quickGlobalSearchBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const rowTemplate = document.getElementById("rowTemplate");
const userForm = document.getElementById("userForm");
const companyForm = document.getElementById("companyForm");
const usersTableBody = document.getElementById("usersTableBody");
const companiesTableBody = document.getElementById("companiesTableBody");
const usersEmpty = document.getElementById("usersEmpty");
const newCompanyIdSelect = document.getElementById("newCompanyId");
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
const dayOrderPdfTitle = document.getElementById("dayOrderPdfTitle");
const dayOrderPdfFile = document.getElementById("dayOrderPdfFile");
const uploadDayOrderPdfBtn = document.getElementById("uploadDayOrderPdfBtn");
const dayOrderPdfUploadStatus = document.getElementById("dayOrderPdfUploadStatus");
const latestDayOrderPdfFrame = document.getElementById("latestDayOrderPdfFrame");
const latestDayOrderPdfMeta = document.getElementById("latestDayOrderPdfMeta");
const latestDayOrderPdfLink = document.getElementById("latestDayOrderPdfLink");
const vehiclesForm = document.getElementById("vehiclesForm");
const vehicleId = document.getElementById("vehicleId");
const vehiclesTableBody = document.getElementById("vehiclesTableBody");
const vehiclesSearchInput = document.getElementById("vehiclesSearchInput");
const vehiclesFilterStatus = document.getElementById("vehiclesFilterStatus");
const vehiclesEmptyState = document.getElementById("vehiclesEmptyState");
const vehicleCancelEditBtn = document.getElementById("vehicleCancelEditBtn");
const vehiclesViewerVehicle = document.getElementById("vehiclesViewerVehicle");
const vehicleViewerAngles = document.getElementById("vehicleViewerAngles");
const vehiclePhotoStage = document.getElementById("vehiclePhotoStage");
const vehiclePhotoMain = document.getElementById("vehiclePhotoMain");
const vehicleHotspotsLayer = document.getElementById("vehicleHotspotsLayer");
const vehiclePhotoHint = document.getElementById("vehiclePhotoHint");
const toggleVehicleEditorBtn = document.getElementById("toggleVehicleEditorBtn");
const saveVehicleViewerChangesBtn = document.getElementById("saveVehicleViewerChangesBtn");
const createVehicleQuickBtn = document.getElementById("createVehicleQuickBtn");
const deleteVehicleQuickBtn = document.getElementById("deleteVehicleQuickBtn");
const vehicleEditorPanel = document.getElementById("vehicleEditorPanel");
const vehiclePhotoLeftInput = document.getElementById("vehiclePhotoLeftInput");
const vehiclePhotoRightInput = document.getElementById("vehiclePhotoRightInput");
const vehiclePhotoRearInput = document.getElementById("vehiclePhotoRearInput");
const vehiclePhotoLeftFile = document.getElementById("vehiclePhotoLeftFile");
const vehiclePhotoRightFile = document.getElementById("vehiclePhotoRightFile");
const vehiclePhotoRearFile = document.getElementById("vehiclePhotoRearFile");
const vehicleDrawerSelect = document.getElementById("vehicleDrawerSelect");
const vehicleDrawerNameInput = document.getElementById("vehicleDrawerNameInput");
const vehicleDrawerItemSelect = document.getElementById("vehicleDrawerItemSelect");
const createVehicleDrawerBtn = document.getElementById("createVehicleDrawerBtn");
const deleteVehicleDrawerBtn = document.getElementById("deleteVehicleDrawerBtn");
const createVehicleDrawerItemBtn = document.getElementById("createVehicleDrawerItemBtn");
const deleteVehicleDrawerItemBtn = document.getElementById("deleteVehicleDrawerItemBtn");
const vehicleDrawerXRange = document.getElementById("vehicleDrawerXRange");
const vehicleDrawerYRange = document.getElementById("vehicleDrawerYRange");
const vehicleDrawerItemNameInput = document.getElementById("vehicleDrawerItemNameInput");
const vehicleDrawerItemStatusInput = document.getElementById("vehicleDrawerItemStatusInput");
const vehicleDrawerItemImageInput = document.getElementById("vehicleDrawerItemImageInput");
const vehicleDrawerItemDescriptionInput = document.getElementById("vehicleDrawerItemDescriptionInput");
const vehicleDrawerCoordsLabel = document.getElementById("vehicleDrawerCoordsLabel");
const vehicleMediaStatus = document.getElementById("vehicleMediaStatus");
const vehicleEditorValidation = document.getElementById("vehicleEditorValidation");
const vehicleDrawerPanel = document.getElementById("vehicleDrawerPanel");
const closeVehicleDrawerPanelBtn = document.getElementById("closeVehicleDrawerPanelBtn");
const vehicleDrawerItemsCount = document.getElementById("vehicleDrawerItemsCount");
const vehicleDrawerPanelItemSelect = document.getElementById("vehicleDrawerPanelItemSelect");
const vehicleDrawerTitle = document.getElementById("vehicleDrawerTitle");
const vehicleDrawerStatus = document.getElementById("vehicleDrawerStatus");
const vehicleDrawerItemImage = document.getElementById("vehicleDrawerItemImage");
const vehicleDrawerItemName = document.getElementById("vehicleDrawerItemName");
const vehicleDrawerItemDescription = document.getElementById("vehicleDrawerItemDescription");
const uniformsForm = document.getElementById("uniformsForm");
const uniformRecordId = document.getElementById("uniformRecordId");
const uniformsTableBody = document.getElementById("uniformsTableBody");
const uniformsSearchInput = document.getElementById("uniformsSearchInput");
const uniformsFilterMovement = document.getElementById("uniformsFilterMovement");
const uniformsFilterStatus = document.getElementById("uniformsFilterStatus");
const uniformsFilterExpiry = document.getElementById("uniformsFilterExpiry");
const uniformsEmptyState = document.getElementById("uniformsEmptyState");
const uniformCancelEditBtn = document.getElementById("uniformCancelEditBtn");
const inventoryModeBadge = document.getElementById("inventoryModeBadge");
const guardModeBadge = document.getElementById("guardModeBadge");
const medicalModeBadge = document.getElementById("medicalModeBadge");
const coursesModeBadge = document.getElementById("coursesModeBadge");
const dayOrdersModeBadge = document.getElementById("dayOrdersModeBadge");
const vehiclesModeBadge = document.getElementById("vehiclesModeBadge");
const uniformsModeBadge = document.getElementById("uniformsModeBadge");
const saveGuardFiltersBtn = document.getElementById("saveGuardFiltersBtn");
const loadGuardFiltersBtn = document.getElementById("loadGuardFiltersBtn");
const resetGuardFiltersBtn = document.getElementById("resetGuardFiltersBtn");
const saveMedicalFiltersBtn = document.getElementById("saveMedicalFiltersBtn");
const loadMedicalFiltersBtn = document.getElementById("loadMedicalFiltersBtn");
const resetMedicalFiltersBtn = document.getElementById("resetMedicalFiltersBtn");
const saveCoursesFiltersBtn = document.getElementById("saveCoursesFiltersBtn");
const loadCoursesFiltersBtn = document.getElementById("loadCoursesFiltersBtn");
const resetCoursesFiltersBtn = document.getElementById("resetCoursesFiltersBtn");
const saveDayOrdersFiltersBtn = document.getElementById("saveDayOrdersFiltersBtn");
const loadDayOrdersFiltersBtn = document.getElementById("loadDayOrdersFiltersBtn");
const resetDayOrdersFiltersBtn = document.getElementById("resetDayOrdersFiltersBtn");
const saveVehiclesFiltersBtn = document.getElementById("saveVehiclesFiltersBtn");
const loadVehiclesFiltersBtn = document.getElementById("loadVehiclesFiltersBtn");
const resetVehiclesFiltersBtn = document.getElementById("resetVehiclesFiltersBtn");
const saveUniformsFiltersBtn = document.getElementById("saveUniformsFiltersBtn");
const loadUniformsFiltersBtn = document.getElementById("loadUniformsFiltersBtn");
const resetUniformsFiltersBtn = document.getElementById("resetUniformsFiltersBtn");

const totalItemsEl = document.getElementById("totalItems");
const lowStockCountEl = document.getElementById("lowStockCount");
const inServiceCountEl = document.getElementById("inServiceCount");
const expiringCountEl = document.getElementById("expiringCount");
const homeVehiclesUnavailableCountEl = document.getElementById("homeVehiclesUnavailableCount");
const homeUniformCriticalCountEl = document.getElementById("homeUniformCriticalCount");
const homeAlertsList = document.getElementById("homeAlertsList");
const dashboardInventoryHealthValueEl = document.getElementById("dashboardInventoryHealthValue");
const dashboardInventoryHealthBarEl = document.getElementById("dashboardInventoryHealthBar");
const dashboardLowStockValueEl = document.getElementById("dashboardLowStockValue");
const dashboardLowStockBarEl = document.getElementById("dashboardLowStockBar");
const dashboardVehiclesValueEl = document.getElementById("dashboardVehiclesValue");
const dashboardVehiclesBarEl = document.getElementById("dashboardVehiclesBar");
const dashboardUniformsValueEl = document.getElementById("dashboardUniformsValue");
const dashboardUniformsBarEl = document.getElementById("dashboardUniformsBar");
const dashboardCriticalAlertsCountEl = document.getElementById("dashboardCriticalAlertsCount");
const dashboardMediumAlertsCountEl = document.getElementById("dashboardMediumAlertsCount");
const dashboardLastCheckEl = document.getElementById("dashboardLastCheck");
const recentChangesList = document.getElementById("recentChangesList");
const toastContainerEl = document.getElementById("toastContainer");

const nativeAlert = window.alert.bind(window);

const menuNavLinks = [
  menuOpenInventory,
  menuOpenGuard,
  menuOpenMedical,
  menuOpenCourses,
  menuOpenDayOrders,
  menuOpenVehicles,
  menuOpenUniforms,
  menuOpenReports
];

const moduleNavLinks = [
  menuOpenInventory,
  menuOpenGuard,
  menuOpenMedical,
  menuOpenCourses,
  menuOpenDayOrders,
  menuOpenVehicles,
  menuOpenUniforms
];

const adminOnlyModeElements = [
  autoApplySavedFiltersBtn,
  clearAllSavedFiltersBtn,
  savedFiltersModeHint,
  inventoryModeBadge,
  guardModeBadge,
  medicalModeBadge,
  coursesModeBadge,
  dayOrdersModeBadge,
  vehiclesModeBadge,
  uniformsModeBadge,
  saveInventoryFiltersBtn,
  loadInventoryFiltersBtn,
  resetInventoryFiltersBtn,
  saveGuardFiltersBtn,
  loadGuardFiltersBtn,
  resetGuardFiltersBtn,
  saveMedicalFiltersBtn,
  loadMedicalFiltersBtn,
  resetMedicalFiltersBtn,
  saveCoursesFiltersBtn,
  loadCoursesFiltersBtn,
  resetCoursesFiltersBtn,
  saveDayOrdersFiltersBtn,
  loadDayOrdersFiltersBtn,
  resetDayOrdersFiltersBtn,
  saveVehiclesFiltersBtn,
  loadVehiclesFiltersBtn,
  resetVehiclesFiltersBtn,
  saveUniformsFiltersBtn,
  loadUniformsFiltersBtn,
  resetUniformsFiltersBtn
];

const statusClassMap = {
  "En Servicio": "status-ok",
  "En Mantenimiento": "status-maintenance",
  "Fuera de Servicio": "status-out"
};

const FALLBACK_VEHICLE_PHOTO_BY_ANGLE = {
  left: "assets/vehicle-gallery/truck-left.svg",
  right: "assets/vehicle-gallery/truck-right.svg",
  rear: "assets/vehicle-gallery/truck-rear.svg"
};

const DEFAULT_COMPANIES = [
  { id: "company-1", nombre: "Cuarta Compañía" },
  { id: "company-3", nombre: "Tercera Compañía" },
  { id: "company-4", nombre: "Primera Compañía" }
];

let authToken = localStorage.getItem(TOKEN_KEY) || "";
let currentUser = null;
let inventory = [];
let users = [];
let companies = [];
let guardEntries = [];
let medicalRecords = [];
let volunteerCourses = [];
let dayOrders = [];
let dayOrderPdfs = [];
let vehicles = [];
let uniforms = [];
const vehicleViewerState = {
  vehicleId: "",
  angle: "left",
  activeDrawerId: "",
  activeDrawerItemIndex: 0,
  editMode: false,
  dirtyMedia: false,
  isSavingMedia: false,
  dragActive: false,
  draggingDrawerId: ""
};
let qrScanner = null;
let qrScannerActive = false;
let qrLastDecoded = "";
let authInProgress = false;
let loginCompanies = [];
let lastModuleState = "";
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
  canViewUsers: false,
  canCreateUsers: false,
  canEditUsers: false,
  canEditUserPermissions: false,
  canResetUserPasswords: false,
  canBlockUsers: false,
  canManageCompanies: false,
  canGenerateReports: true
};
let autoAlertMonitorId = null;
let autoAlertBaselineCaptured = false;
let lastCriticalAlertFingerprint = "";

const AUTO_ALERT_MONITOR_MS = 60000;

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
if (saveInventoryFiltersBtn) {
  saveInventoryFiltersBtn.addEventListener("click", saveInventoryFiltersPreset);
}
if (loadInventoryFiltersBtn) {
  loadInventoryFiltersBtn.addEventListener("click", () => {
    loadInventoryFiltersPreset({ notifyIfMissing: true });
  });
}
if (resetInventoryFiltersBtn) {
  resetInventoryFiltersBtn.addEventListener("click", () => resetInventoryFilters({ notify: true }));
}
if (saveGuardFiltersBtn) {
  saveGuardFiltersBtn.addEventListener("click", saveGuardFiltersPreset);
}
if (loadGuardFiltersBtn) {
  loadGuardFiltersBtn.addEventListener("click", () => loadGuardFiltersPreset({ notifyIfMissing: true }));
}
if (resetGuardFiltersBtn) {
  resetGuardFiltersBtn.addEventListener("click", () => resetGuardFilters({ notify: true }));
}
if (saveMedicalFiltersBtn) {
  saveMedicalFiltersBtn.addEventListener("click", saveMedicalFiltersPreset);
}
if (loadMedicalFiltersBtn) {
  loadMedicalFiltersBtn.addEventListener("click", () => loadMedicalFiltersPreset({ notifyIfMissing: true }));
}
if (resetMedicalFiltersBtn) {
  resetMedicalFiltersBtn.addEventListener("click", () => resetMedicalFilters({ notify: true }));
}
if (saveCoursesFiltersBtn) {
  saveCoursesFiltersBtn.addEventListener("click", saveCoursesFiltersPreset);
}
if (loadCoursesFiltersBtn) {
  loadCoursesFiltersBtn.addEventListener("click", () => loadCoursesFiltersPreset({ notifyIfMissing: true }));
}
if (resetCoursesFiltersBtn) {
  resetCoursesFiltersBtn.addEventListener("click", () => resetCoursesFilters({ notify: true }));
}
if (saveDayOrdersFiltersBtn) {
  saveDayOrdersFiltersBtn.addEventListener("click", saveDayOrdersFiltersPreset);
}
if (loadDayOrdersFiltersBtn) {
  loadDayOrdersFiltersBtn.addEventListener("click", () => loadDayOrdersFiltersPreset({ notifyIfMissing: true }));
}
if (resetDayOrdersFiltersBtn) {
  resetDayOrdersFiltersBtn.addEventListener("click", () => resetDayOrdersFilters({ notify: true }));
}
if (saveVehiclesFiltersBtn) {
  saveVehiclesFiltersBtn.addEventListener("click", saveVehiclesFiltersPreset);
}
if (loadVehiclesFiltersBtn) {
  loadVehiclesFiltersBtn.addEventListener("click", () => loadVehiclesFiltersPreset({ notifyIfMissing: true }));
}
if (resetVehiclesFiltersBtn) {
  resetVehiclesFiltersBtn.addEventListener("click", () => resetVehiclesFilters({ notify: true }));
}
if (saveUniformsFiltersBtn) {
  saveUniformsFiltersBtn.addEventListener("click", saveUniformsFiltersPreset);
}
if (loadUniformsFiltersBtn) {
  loadUniformsFiltersBtn.addEventListener("click", () => loadUniformsFiltersPreset({ notifyIfMissing: true }));
}
if (resetUniformsFiltersBtn) {
  resetUniformsFiltersBtn.addEventListener("click", () => resetUniformsFilters({ notify: true }));
}
reportUniformsBtn.addEventListener("click", () => downloadPdfReport("/api/reports/uniforms.pdf", "uniformes"));
quickScanQrBtn.addEventListener("click", onQuickScanQr);
quickNewRecordBtn.addEventListener("click", onQuickNewRecord);
quickReportBtn.addEventListener("click", onQuickReport);
if (autoApplySavedFiltersBtn) {
  autoApplySavedFiltersBtn.addEventListener("click", toggleAutoApplySavedFilters);
}
if (clearAllSavedFiltersBtn) {
  clearAllSavedFiltersBtn.addEventListener("click", clearAllSavedFilters);
}
if (quickGlobalSearchBtn) {
  quickGlobalSearchBtn.addEventListener("click", () => {
    void onQuickGlobalSearch();
  });
}
if (reopenLastModuleBtn) {
  reopenLastModuleBtn.addEventListener("click", () => {
    void reopenLastModule();
  });
}
if (quickGlobalSearchInput) {
  quickGlobalSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void onQuickGlobalSearch();
    }
  });
}
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
if (companyForm) {
  companyForm.addEventListener("submit", onCreateCompany);
}
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
uploadDayOrderPdfBtn.addEventListener("click", onUploadDayOrderPdf);
vehiclesSearchInput.addEventListener("input", renderVehicles);
vehiclesFilterStatus.addEventListener("change", renderVehicles);
vehicleCancelEditBtn.addEventListener("click", resetVehicleForm);
vehiclesViewerVehicle.addEventListener("change", onVehicleViewerVehicleChange);
closeVehicleDrawerPanelBtn.addEventListener("click", closeVehicleDrawerPanel);
toggleVehicleEditorBtn.addEventListener("click", toggleVehicleEditorMode);
saveVehicleViewerChangesBtn.addEventListener("click", saveVehicleViewerChanges);
createVehicleQuickBtn.addEventListener("click", createVehicleQuick);
deleteVehicleQuickBtn.addEventListener("click", deleteSelectedVehicleQuick);
vehiclePhotoStage.addEventListener("click", onVehiclePhotoStageClick);
vehicleDrawerSelect.addEventListener("change", onDrawerEditorSelectionChange);
vehicleDrawerNameInput.addEventListener("input", onDrawerNameInputChange);
vehicleDrawerItemSelect.addEventListener("change", onDrawerItemSelectionChange);
createVehicleDrawerBtn.addEventListener("click", onCreateVehicleDrawerClick);
deleteVehicleDrawerBtn.addEventListener("click", onDeleteVehicleDrawerClick);
createVehicleDrawerItemBtn.addEventListener("click", onCreateVehicleDrawerItemClick);
deleteVehicleDrawerItemBtn.addEventListener("click", onDeleteVehicleDrawerItemClick);
vehicleDrawerXRange.addEventListener("input", onDrawerCoordinateRangeInput);
vehicleDrawerYRange.addEventListener("input", onDrawerCoordinateRangeInput);
vehicleDrawerItemNameInput.addEventListener("input", onDrawerItemInputChange);
vehicleDrawerItemStatusInput.addEventListener("input", onDrawerItemInputChange);
vehicleDrawerItemImageInput.addEventListener("input", onDrawerItemInputChange);
vehicleDrawerItemDescriptionInput.addEventListener("input", onDrawerItemInputChange);
vehiclePhotoLeftInput.addEventListener("input", () => onPhotoInputChange("left", vehiclePhotoLeftInput.value));
vehiclePhotoRightInput.addEventListener("input", () => onPhotoInputChange("right", vehiclePhotoRightInput.value));
vehiclePhotoRearInput.addEventListener("input", () => onPhotoInputChange("rear", vehiclePhotoRearInput.value));
vehiclePhotoLeftFile.addEventListener("change", () => onPhotoFileChange("left", vehiclePhotoLeftFile));
vehiclePhotoRightFile.addEventListener("change", () => onPhotoFileChange("right", vehiclePhotoRightFile));
vehiclePhotoRearFile.addEventListener("change", () => onPhotoFileChange("rear", vehiclePhotoRearFile));
vehicleDrawerPanelItemSelect.addEventListener("change", onDrawerPanelItemSelectionChange);
window.addEventListener("pointermove", onVehicleHotspotPointerMove);
window.addEventListener("pointerup", onVehicleHotspotPointerUp);
uniformsSearchInput.addEventListener("input", renderUniforms);
uniformsFilterMovement.addEventListener("change", renderUniforms);
uniformsFilterStatus.addEventListener("change", renderUniforms);
if (uniformsFilterExpiry) {
  uniformsFilterExpiry.addEventListener("change", renderUniforms);
}
uniformCancelEditBtn.addEventListener("click", resetUniformForm);
window.addEventListener("keydown", onGlobalShortcutKeyDown);
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
setDefaultGuardDate();
resetDayOrderForm();
resetUniformForm();

initTheme();
initGlobalErrorHandling();
runStartupHealthCheck();
bootstrap();

async function bootstrap() {
  if (authInProgress) {
    return;
  }

  await ensureLoginCompaniesLoaded();

  if (!authToken) {
    showAuthScreen();
    return;
  }

  try {
    const me = await api("/api/me");
    currentUser = me.user;
    permissions = me.permissions || permissions;
    await loadInitialModules();
    showAppScreen();
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    authToken = "";
    showAuthScreen();
  }
}

async function onLogin(event) {
  event.preventDefault();
  if (authInProgress) {
    return;
  }

  authError.classList.add("hidden");
  authError.textContent = "";

  const formData = new FormData(loginForm);
  const companyId = String(formData.get("companyId") || "").trim();
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!companyId || !username || !password) {
    showAuthError("Debes completar compañía, usuario y clave.");
    return;
  }

  setAuthBusy(true);
  try {
    const response = await api("/api/login", {
      method: "POST",
      body: { companyId, username, password },
      requiresAuth: false
    });

    authToken = response.token;
    currentUser = response.user;
    localStorage.setItem(TOKEN_KEY, authToken);
    loginForm.reset();

    const me = await api("/api/me");
    permissions = me.permissions || permissions;

    await loadInitialModules();
    showAppScreen();
  } catch (error) {
    showAuthError(error.message || "No se pudo iniciar sesión.");
  } finally {
    setAuthBusy(false);
  }
}

function setAuthBusy(isBusy) {
  authInProgress = Boolean(isBusy);
  const submitBtn = loginForm?.querySelector('button[type="submit"]');
  if (!submitBtn) {
    return;
  }
  submitBtn.disabled = authInProgress;
  submitBtn.textContent = authInProgress ? "Ingresando..." : "Iniciar sesión";
}

async function loadInitialModules() {
  const loaders = [
    ["Inventario", refreshInventory],
    ["Libro de Guardia", refreshGuardBook],
    ["Fichas Médicas", refreshMedicalRecords],
    ["Cursos", refreshCourses],
    ["Órdenes del Día", refreshDayOrders],
    ["PDF de Órdenes", refreshDayOrderPdfs],
    ["Carros", refreshVehicles],
    ["Uniformes", refreshUniforms]
  ];

  const results = await Promise.allSettled(loaders.map(([, load]) => load()));
  const failedModules = results
    .map((result, index) => ({ result, name: loaders[index][0] }))
    .filter((item) => item.result.status === "rejected")
    .map((item) => item.name);

  if (failedModules.length > 0) {
    showToast(`Se cargó parcialmente. Fallaron: ${failedModules.join(", ")}.`, "warning");
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
  dayOrderPdfs = [];
  vehicles = [];
  uniforms = [];
  vehicleViewerState.vehicleId = "";
  vehicleViewerState.angle = "left";
  vehicleViewerState.activeDrawerId = "";
  vehicleViewerState.activeDrawerItemIndex = 0;
  vehicleViewerState.editMode = false;
  vehicleViewerState.dirtyMedia = false;
  vehicleViewerState.isSavingMedia = false;
  permissions = {
    canWriteInventory: false,
    canWriteGuardBook: false,
    canWriteMedicalRecords: false,
    canWriteVolunteerCourses: false,
    canWriteDayOrders: false,
    canWriteVehicles: false,
    canWriteUniforms: false,
    canManageUsers: false,
    canViewUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canEditUserPermissions: false,
    canResetUserPasswords: false,
    canBlockUsers: false,
    canManageCompanies: false,
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
  renderLatestDayOrderPdf();
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

async function refreshDayOrderPdfs() {
  const response = await api("/api/day-orders/pdfs");
  dayOrderPdfs = response.pdfs || [];
  renderLatestDayOrderPdf();
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
  const alerts = collectOperationalAlerts();
  updateHomeOperationalKpis();
  updateHomeAlerts(alerts);
  updateVisualDashboard(alerts);
  processAutomaticAlerts(alerts);
  updateRecentChanges();
}

function updateHomeOperationalKpis() {
  updateStats();

  if (homeVehiclesUnavailableCountEl) {
    const unavailableVehicles = vehicles.filter((vehicle) => {
      const status = String(vehicle?.estadoOperativo || "").trim();
      return status !== "" && status !== "En Servicio";
    }).length;
    homeVehiclesUnavailableCountEl.textContent = String(unavailableVehicles);
  }

  if (homeUniformCriticalCountEl) {
    const criticalUniforms = uniforms.filter((record) => {
      const alertData = getUniformAlertData(record);
      return alertData.className === "alert-high";
    }).length;
    homeUniformCriticalCountEl.textContent = String(criticalUniforms);
  }
}

function renderLatestDayOrderPdf() {
  if (!latestDayOrderPdfFrame || !latestDayOrderPdfMeta || !latestDayOrderPdfLink) {
    return;
  }

  if (!Array.isArray(dayOrderPdfs) || dayOrderPdfs.length === 0) {
    latestDayOrderPdfFrame.src = "";
    latestDayOrderPdfMeta.textContent = "No hay PDF cargado todavía.";
    latestDayOrderPdfLink.hidden = true;
    latestDayOrderPdfLink.removeAttribute("href");
    return;
  }

  const latestPdf = [...dayOrderPdfs].sort((a, b) => {
    const aTime = Date.parse(String(a?.uploadedAt || "")) || 0;
    const bTime = Date.parse(String(b?.uploadedAt || "")) || 0;
    return bTime - aTime;
  })[0];

  const fileUrl = String(latestPdf?.fileUrl || "").trim();
  if (!fileUrl) {
    latestDayOrderPdfFrame.src = "";
    latestDayOrderPdfMeta.textContent = "El último registro PDF no tiene URL válida.";
    latestDayOrderPdfLink.hidden = true;
    latestDayOrderPdfLink.removeAttribute("href");
    return;
  }

  const title = String(latestPdf?.titulo || latestPdf?.originalName || "Orden del día").trim();
  const uploadedBy = String(latestPdf?.uploadedBy || "Desconocido").trim();
  const uploadedAt = formatDateTime(latestPdf?.uploadedAt);

  latestDayOrderPdfFrame.src = fileUrl;
  latestDayOrderPdfLink.href = fileUrl;
  latestDayOrderPdfLink.hidden = false;
  latestDayOrderPdfMeta.textContent = `${title} · Subido por ${uploadedBy} · ${uploadedAt}`;
}

function collectOperationalAlerts() {
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

  volunteerCourses.forEach((course) => {
    const certAlert = getCertificationAlertData(course);
    if (certAlert.className === "alert-none") {
      return;
    }
    alerts.push({
      level: certAlert.className === "alert-high" ? "high" : "medium",
      text: `Certificación: ${course.certificacion} (${course.voluntarioNombre}) - ${certAlert.label}`
    });
  });

  alerts.sort((a, b) => {
    if (a.level === b.level) {
      return 0;
    }
    return a.level === "high" ? -1 : 1;
  });

  return alerts;
}

function updateHomeAlerts(alerts = collectOperationalAlerts()) {
  if (!homeAlertsList) {
    return;
  }

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

function updateVisualDashboard(alerts = collectOperationalAlerts()) {
  const hasDashboard =
    dashboardInventoryHealthValueEl &&
    dashboardInventoryHealthBarEl &&
    dashboardLowStockValueEl &&
    dashboardLowStockBarEl &&
    dashboardVehiclesValueEl &&
    dashboardVehiclesBarEl &&
    dashboardUniformsValueEl &&
    dashboardUniformsBarEl &&
    dashboardCriticalAlertsCountEl &&
    dashboardMediumAlertsCountEl;

  if (!hasDashboard) {
    return;
  }

  const inventoryTotal = inventory.length;
  const inService = inventory.filter((item) => item.estado === "En Servicio").length;
  const lowStockCount = inventory.filter((item) => item.cantidad <= item.minimo).length;
  const vehiclesTotal = vehicles.length;
  const unavailableVehicles = vehicles.filter((vehicle) => {
    const status = String(vehicle?.estadoOperativo || "").trim();
    return status !== "" && status !== "En Servicio";
  }).length;
  const uniformsTotal = uniforms.length;
  const criticalUniforms = uniforms.filter((record) => getUniformAlertData(record).className === "alert-high").length;

  const inventoryHealthRatio = inventoryTotal > 0 ? Math.round((inService / inventoryTotal) * 100) : 0;
  const lowStockRatio = inventoryTotal > 0 ? Math.round((lowStockCount / inventoryTotal) * 100) : 0;
  const vehiclesUnavailableRatio = vehiclesTotal > 0 ? Math.round((unavailableVehicles / vehiclesTotal) * 100) : 0;
  const uniformsCriticalRatio = uniformsTotal > 0 ? Math.round((criticalUniforms / uniformsTotal) * 100) : 0;

  dashboardInventoryHealthValueEl.textContent = `${inventoryHealthRatio}% (${inService}/${inventoryTotal || 0})`;
  dashboardInventoryHealthBarEl.style.width = `${inventoryHealthRatio}%`;

  dashboardLowStockValueEl.textContent = `${lowStockCount} de ${inventoryTotal || 0}`;
  dashboardLowStockBarEl.style.width = `${lowStockRatio}%`;

  dashboardVehiclesValueEl.textContent = `${unavailableVehicles} de ${vehiclesTotal || 0}`;
  dashboardVehiclesBarEl.style.width = `${vehiclesUnavailableRatio}%`;

  dashboardUniformsValueEl.textContent = `${criticalUniforms} de ${uniformsTotal || 0}`;
  dashboardUniformsBarEl.style.width = `${uniformsCriticalRatio}%`;

  const criticalAlerts = alerts.filter((alert) => alert.level === "high").length;
  const mediumAlerts = alerts.filter((alert) => alert.level === "medium").length;
  dashboardCriticalAlertsCountEl.textContent = String(criticalAlerts);
  dashboardMediumAlertsCountEl.textContent = String(mediumAlerts);

  if (dashboardLastCheckEl) {
    const now = new Date();
    dashboardLastCheckEl.textContent = `Actualizado ${now.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;
  }
}

function buildCriticalAlertFingerprint(alerts) {
  return alerts
    .filter((alert) => alert.level === "high")
    .map((alert) => alert.text)
    .sort((a, b) => a.localeCompare(b))
    .join("||");
}

function processAutomaticAlerts(alerts = collectOperationalAlerts()) {
  const criticalFingerprint = buildCriticalAlertFingerprint(alerts);

  if (!autoAlertBaselineCaptured) {
    autoAlertBaselineCaptured = true;
    lastCriticalAlertFingerprint = criticalFingerprint;
    return;
  }

  if (criticalFingerprint === lastCriticalAlertFingerprint) {
    return;
  }

  const criticalAlerts = alerts.filter((alert) => alert.level === "high");
  lastCriticalAlertFingerprint = criticalFingerprint;

  if (criticalAlerts.length === 0) {
    showToast("Alertas críticas normalizadas.", "success");
    return;
  }

  const preview = criticalAlerts
    .slice(0, 2)
    .map((alert) => alert.text)
    .join(" · ");

  showToast(`Alerta automática: ${criticalAlerts.length} crítica(s). ${preview}`, "warning", {
    actionLabel: "Ver panel",
    onAction: () => {
      openHomeModule();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

function startAutoAlertMonitor() {
  stopAutoAlertMonitor();
  autoAlertMonitorId = window.setInterval(() => {
    const alerts = collectOperationalAlerts();
    updateVisualDashboard(alerts);
    processAutomaticAlerts(alerts);
  }, AUTO_ALERT_MONITOR_MS);
}

function stopAutoAlertMonitor() {
  if (autoAlertMonitorId !== null) {
    window.clearInterval(autoAlertMonitorId);
    autoAlertMonitorId = null;
  }
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

function getInventoryFiltersStorageKey() {
  const userPart = String(currentUser?.id || currentUser?.username || "anon").trim();
  const companyPart = String(currentUser?.companyId || "global").trim();
  return `inventory_filters::${companyPart}::${userPart}`;
}

function getModuleFiltersStorageKey(moduleKey) {
  const userPart = String(currentUser?.id || currentUser?.username || "anon").trim();
  const companyPart = String(currentUser?.companyId || "global").trim();
  return `module_filters::${moduleKey}::${companyPart}::${userPart}`;
}

function getFiltersAutoloadStorageKey() {
  const userPart = String(currentUser?.id || currentUser?.username || "anon").trim();
  const companyPart = String(currentUser?.companyId || "global").trim();
  return `filters_autoload::${companyPart}::${userPart}`;
}

function getLastModuleStorageKey() {
  const userPart = String(currentUser?.id || currentUser?.username || "anon").trim();
  const companyPart = String(currentUser?.companyId || "global").trim();
  return `last_module::${companyPart}::${userPart}`;
}

function setLastModule(moduleKey) {
  if (!moduleOpenByKey[moduleKey]) {
    return;
  }

  lastModuleState = moduleKey;
  if (currentUser) {
    localStorage.setItem(getLastModuleStorageKey(), moduleKey);
  }
  updateLastModuleUi();
}

function loadLastModuleFromStorage() {
  if (!currentUser) {
    lastModuleState = "";
    updateLastModuleUi();
    return;
  }

  const moduleKey = String(localStorage.getItem(getLastModuleStorageKey()) || "").trim();
  lastModuleState = moduleOpenByKey[moduleKey] ? moduleKey : "";
  updateLastModuleUi();
}

function updateLastModuleUi() {
  if (!lastModuleLabel || !reopenLastModuleBtn) {
    return;
  }

  const moduleLabel = moduleLabelByKey[lastModuleState];
  if (!moduleLabel) {
    lastModuleLabel.textContent = "Aun no abriste ningun modulo.";
    reopenLastModuleBtn.hidden = true;
    return;
  }

  lastModuleLabel.textContent = moduleLabel;
  reopenLastModuleBtn.hidden = false;
}

async function reopenLastModule() {
  if (!lastModuleState || !moduleOpenByKey[lastModuleState]) {
    showToast("Aun no hay un modulo reciente para reabrir.", "info");
    return;
  }

  await moduleOpenByKey[lastModuleState]();
}

function isCurrentUserAdmin() {
  const role = String(currentUser?.role || "").trim().toLowerCase();
  return role === "admin" || Boolean(permissions.canManageUsers);
}

function isAutoApplySavedFiltersEnabled() {
  if (!isCurrentUserAdmin()) {
    return true;
  }

  const value = localStorage.getItem(getFiltersAutoloadStorageKey());
  if (value === null) {
    return true;
  }
  return value === "1";
}

function setAutoApplySavedFiltersEnabled(enabled) {
  if (!isCurrentUserAdmin()) {
    return;
  }

  localStorage.setItem(getFiltersAutoloadStorageKey(), enabled ? "1" : "0");
  updateAutoApplySavedFiltersButton();
}

function updateAutoApplySavedFiltersButton() {
  const adminUser = isCurrentUserAdmin();
  const enabled = isAutoApplySavedFiltersEnabled();

  adminOnlyModeElements.forEach((element) => {
    if (element) {
      element.classList.toggle("hidden", !adminUser);
    }
  });

  if (!adminUser) {
    moduleNavLinks.forEach((link) => {
      if (link) {
        link.classList.remove("is-auto-filters-on", "is-auto-filters-off");
      }
    });
    return;
  }

  if (!autoApplySavedFiltersBtn) {
    return;
  }

  autoApplySavedFiltersBtn.textContent = enabled ? "Auto filtros: ON" : "Auto filtros: OFF";
  autoApplySavedFiltersBtn.classList.toggle("btn-primary", enabled);
  autoApplySavedFiltersBtn.classList.toggle("btn-secondary", !enabled);
  autoApplySavedFiltersBtn.classList.toggle("is-auto-filters-on", enabled);
  autoApplySavedFiltersBtn.classList.toggle("is-auto-filters-off", !enabled);
  updateSavedFiltersModeIndicators();
}

function getSavedFiltersModeText() {
  return isAutoApplySavedFiltersEnabled() ? "Modo: filtros guardados" : "Modo: limpio";
}

function updateSavedFiltersModeIndicators() {
  const modeText = getSavedFiltersModeText();
  const hintText = isAutoApplySavedFiltersEnabled()
    ? "Los módulos abrirán con filtros guardados mientras el auto filtro esté activo."
    : "Los módulos abrirán con filtros predeterminados hasta que vuelvas a activar el auto filtro.";
  const modeEnabled = isAutoApplySavedFiltersEnabled();

  if (savedFiltersModeHint) {
    savedFiltersModeHint.textContent = hintText;
    savedFiltersModeHint.classList.toggle("is-auto-filters-on", modeEnabled);
    savedFiltersModeHint.classList.toggle("is-auto-filters-off", !modeEnabled);
  }

  [
    inventoryModeBadge,
    guardModeBadge,
    medicalModeBadge,
    coursesModeBadge,
    dayOrdersModeBadge,
    vehiclesModeBadge,
    uniformsModeBadge
  ].forEach((badge) => {
    if (badge) {
      badge.textContent = modeText;
      badge.classList.toggle("module-mode-badge--on", modeEnabled);
      badge.classList.toggle("module-mode-badge--off", !modeEnabled);
    }
  });

  moduleNavLinks.forEach((link) => {
    if (!link) {
      return;
    }

    link.classList.toggle("is-auto-filters-on", modeEnabled);
    link.classList.toggle("is-auto-filters-off", !modeEnabled);
  });
}

function toggleAutoApplySavedFilters() {
  if (!isCurrentUserAdmin()) {
    showToast("Solo los administradores pueden cambiar este modo.", "warning");
    return;
  }

  const nextValue = !isAutoApplySavedFiltersEnabled();
  setAutoApplySavedFiltersEnabled(nextValue);
  showToast(
    nextValue
      ? "Apertura con filtros guardados activada."
      : "Apertura en modo predeterminado activada.",
    "info"
  );
}

function applyFiltersOnOpen(loadFiltersFn, resetFiltersFn) {
  if (isAutoApplySavedFiltersEnabled()) {
    loadFiltersFn();
    return;
  }
  resetFiltersFn();
}

function saveModuleFilters(moduleKey, payload, label) {
  if (!isCurrentUserAdmin()) {
    showToast(`Solo los administradores pueden guardar filtros de ${label}.`, "warning");
    return false;
  }

  try {
    localStorage.setItem(getModuleFiltersStorageKey(moduleKey), JSON.stringify({ ...payload, savedAt: new Date().toISOString() }));
    showToast(`Filtros de ${label} guardados.`, "success");
    return true;
  } catch {
    alert("No se pudieron guardar los filtros en este navegador.");
    return false;
  }
}

function loadModuleFilters(moduleKey) {
  if (!isCurrentUserAdmin()) {
    showToast("Solo los administradores pueden cargar filtros guardados.", "warning");
    return null;
  }

  const raw = localStorage.getItem(getModuleFiltersStorageKey(moduleKey));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveInventoryFiltersPreset() {
  if (!isCurrentUserAdmin()) {
    showToast("Solo los administradores pueden guardar filtros de inventario.", "warning");
    return;
  }

  const payload = {
    search: String(searchInput.value || "").trim(),
    estado: String(filterEstado.value || "Todos").trim(),
    savedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(getInventoryFiltersStorageKey(), JSON.stringify(payload));
    showToast("Filtros de inventario guardados.", "success");
  } catch {
    alert("No se pudieron guardar los filtros en este navegador.");
  }
}

function loadInventoryFiltersPreset(options = {}) {
  const { notifyIfMissing = false } = options;
  if (!isCurrentUserAdmin()) {
    return false;
  }

  const raw = localStorage.getItem(getInventoryFiltersStorageKey());

  if (!raw) {
    if (notifyIfMissing) {
      showToast("No hay filtros guardados para este usuario.", "info");
    }
    return false;
  }

  try {
    const preset = JSON.parse(raw);
    searchInput.value = String(preset?.search || "");
    const nextEstado = String(preset?.estado || "Todos");
    filterEstado.value = nextEstado || "Todos";
    render();
    return true;
  } catch {
    if (notifyIfMissing) {
      showToast("Los filtros guardados son inválidos y se omitieron.", "warning");
    }
    return false;
  }
}

function resetInventoryFilters(options = {}) {
  if (!isCurrentUserAdmin()) {
    return;
  }

  const { notify = false } = options;
  searchInput.value = "";
  filterEstado.value = "Todos";
  render();
  if (notify) {
    showToast("Filtros de inventario restablecidos.", "info");
  }
}

function saveGuardFiltersPreset() {
  saveModuleFilters("guard", {
    search: String(guardSearchInput.value || ""),
    turno: String(guardFilterTurno.value || "Todos"),
    tipo: String(guardFilterTipo.value || "Todos")
  }, "Guardia");
}

function loadGuardFiltersPreset(options = {}) {
  const { notifyIfMissing = false } = options;
  const preset = loadModuleFilters("guard");
  if (!preset) {
    if (notifyIfMissing) {
      showToast("No hay filtros guardados para Guardia.", "info");
    }
    return false;
  }
  guardSearchInput.value = String(preset.search || "");
  guardFilterTurno.value = String(preset.turno || "Todos");
  guardFilterTipo.value = String(preset.tipo || "Todos");
  renderGuardBook();
  return true;
}

function resetGuardFilters(options = {}) {
  if (!isCurrentUserAdmin()) {
    return;
  }

  const { notify = false } = options;
  guardSearchInput.value = "";
  guardFilterTurno.value = "Todos";
  guardFilterTipo.value = "Todos";
  renderGuardBook();
  if (notify) {
    showToast("Filtros de Guardia restablecidos.", "info");
  }
}

function saveMedicalFiltersPreset() {
  saveModuleFilters("medical", {
    search: String(medicalSearchInput.value || "")
  }, "Fichas Médicas");
}

function loadMedicalFiltersPreset(options = {}) {
  const { notifyIfMissing = false } = options;
  const preset = loadModuleFilters("medical");
  if (!preset) {
    if (notifyIfMissing) {
      showToast("No hay filtros guardados para Fichas Médicas.", "info");
    }
    return false;
  }
  medicalSearchInput.value = String(preset.search || "");
  renderMedicalRecords();
  return true;
}

function resetMedicalFilters(options = {}) {
  if (!isCurrentUserAdmin()) {
    return;
  }

  const { notify = false } = options;
  medicalSearchInput.value = "";
  renderMedicalRecords();
  if (notify) {
    showToast("Filtros de Fichas Médicas restablecidos.", "info");
  }
}

function saveCoursesFiltersPreset() {
  saveModuleFilters("courses", {
    search: String(coursesSearchInput.value || "")
  }, "Cursos");
}

function loadCoursesFiltersPreset(options = {}) {
  const { notifyIfMissing = false } = options;
  const preset = loadModuleFilters("courses");
  if (!preset) {
    if (notifyIfMissing) {
      showToast("No hay filtros guardados para Cursos.", "info");
    }
    return false;
  }
  coursesSearchInput.value = String(preset.search || "");
  renderCourses();
  return true;
}

function resetCoursesFilters(options = {}) {
  if (!isCurrentUserAdmin()) {
    return;
  }

  const { notify = false } = options;
  coursesSearchInput.value = "";
  renderCourses();
  if (notify) {
    showToast("Filtros de Cursos restablecidos.", "info");
  }
}

function saveDayOrdersFiltersPreset() {
  saveModuleFilters("dayorders", {
    search: String(dayOrdersSearchInput.value || ""),
    tipo: String(dayOrdersFilterTipo.value || "Todos")
  }, "Órdenes del Día");
}

function loadDayOrdersFiltersPreset(options = {}) {
  const { notifyIfMissing = false } = options;
  const preset = loadModuleFilters("dayorders");
  if (!preset) {
    if (notifyIfMissing) {
      showToast("No hay filtros guardados para Órdenes del Día.", "info");
    }
    return false;
  }
  dayOrdersSearchInput.value = String(preset.search || "");
  dayOrdersFilterTipo.value = String(preset.tipo || "Todos");
  renderDayOrders();
  return true;
}

function resetDayOrdersFilters(options = {}) {
  if (!isCurrentUserAdmin()) {
    return;
  }

  const { notify = false } = options;
  dayOrdersSearchInput.value = "";
  dayOrdersFilterTipo.value = "Todos";
  renderDayOrders();
  if (notify) {
    showToast("Filtros de Órdenes del Día restablecidos.", "info");
  }
}

function saveVehiclesFiltersPreset() {
  saveModuleFilters("vehicles", {
    search: String(vehiclesSearchInput.value || ""),
    status: String(vehiclesFilterStatus.value || "Todos")
  }, "Carros");
}

function loadVehiclesFiltersPreset(options = {}) {
  const { notifyIfMissing = false } = options;
  const preset = loadModuleFilters("vehicles");
  if (!preset) {
    if (notifyIfMissing) {
      showToast("No hay filtros guardados para Carros.", "info");
    }
    return false;
  }
  vehiclesSearchInput.value = String(preset.search || "");
  vehiclesFilterStatus.value = String(preset.status || "Todos");
  renderVehicles();
  return true;
}

function resetVehiclesFilters(options = {}) {
  if (!isCurrentUserAdmin()) {
    return;
  }

  const { notify = false } = options;
  vehiclesSearchInput.value = "";
  vehiclesFilterStatus.value = "Todos";
  renderVehicles();
  if (notify) {
    showToast("Filtros de Carros restablecidos.", "info");
  }
}

function saveUniformsFiltersPreset() {
  saveModuleFilters("uniforms", {
    search: String(uniformsSearchInput.value || ""),
    movement: String(uniformsFilterMovement.value || "Todos"),
    status: String(uniformsFilterStatus.value || "Todos"),
    expiry: String(uniformsFilterExpiry?.value || "Todos")
  }, "Uniformes");
}

function loadUniformsFiltersPreset(options = {}) {
  const { notifyIfMissing = false } = options;
  const preset = loadModuleFilters("uniforms");
  if (!preset) {
    if (notifyIfMissing) {
      showToast("No hay filtros guardados para Uniformes.", "info");
    }
    return false;
  }
  uniformsSearchInput.value = String(preset.search || "");
  uniformsFilterMovement.value = String(preset.movement || "Todos");
  uniformsFilterStatus.value = String(preset.status || "Todos");
  if (uniformsFilterExpiry) {
    uniformsFilterExpiry.value = String(preset.expiry || "Todos");
  }
  renderUniforms();
  return true;
}

function resetUniformsFilters(options = {}) {
  if (!isCurrentUserAdmin()) {
    return;
  }

  const { notify = false } = options;
  uniformsSearchInput.value = "";
  uniformsFilterMovement.value = "Todos";
  uniformsFilterStatus.value = "Todos";
  if (uniformsFilterExpiry) {
    uniformsFilterExpiry.value = "Todos";
  }
  renderUniforms();
  if (notify) {
    showToast("Filtros de Uniformes restablecidos.", "info");
  }
}

function clearAllSavedFilters() {
  if (!isCurrentUserAdmin()) {
    showToast("Solo los administradores pueden limpiar filtros guardados.", "warning");
    return;
  }

  if (!currentUser) {
    showToast("Debes iniciar sesión para limpiar filtros guardados.", "warning");
    return;
  }

  const shouldClear = window.confirm("Se eliminarán todos tus filtros guardados en este navegador. ¿Continuar?");
  if (!shouldClear) {
    return;
  }

  const userPart = String(currentUser?.id || currentUser?.username || "anon").trim();
  const companyPart = String(currentUser?.companyId || "global").trim();
  const keys = [
    `inventory_filters::${companyPart}::${userPart}`,
    `module_filters::guard::${companyPart}::${userPart}`,
    `module_filters::medical::${companyPart}::${userPart}`,
    `module_filters::courses::${companyPart}::${userPart}`,
    `module_filters::dayorders::${companyPart}::${userPart}`,
    `module_filters::vehicles::${companyPart}::${userPart}`,
    `module_filters::uniforms::${companyPart}::${userPart}`
  ];

  keys.forEach((key) => localStorage.removeItem(key));
  showToast("Se limpiaron todos los filtros guardados del usuario.", "success");
}

function render() {
  const rows = getFilteredInventory();
  tableBody.innerHTML = "";

  rows.forEach((item, idx) => {
    const row = rowTemplate.content.firstElementChild.cloneNode(true);
    const alertData = getAlertData(item);

    applyCellLabels(row, ["Articulo", "Categoria", "Cantidad", "Minimo", "Estado", "Vencimiento", "Alertas", "Ubicacion", "Acciones"]);

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
  stopAutoAlertMonitor();
  autoAlertBaselineCaptured = false;
  lastCriticalAlertFingerprint = "";
  authShell.classList.remove("hidden");
  mainHeader.classList.add("hidden");
  homeLanding.classList.add("hidden");
  mainDashboard.classList.add("hidden");
  mainMenu.classList.add("hidden");
  manageUsersBtn.classList.add("hidden");
  closeUsersModal();
  closeGuardModal();
  closeMedicalModal();
  closeCoursesModal();
  closeDayOrdersModal();
  closeQrModal();
  closeVehiclesModal();
  closeUniformsModal();
  setActiveNav(null);
  void ensureLoginCompaniesLoaded();
}

function showAppScreen() {
  authShell.classList.add("hidden");
  mainHeader.classList.add("hidden");
  mainDashboard.classList.add("hidden");
  homeLanding.classList.remove("hidden");
  const companyLabel = String(currentUser?.companyName || currentUser?.companyId || "Sin compañía");
  const userDisplayText = `${currentUser?.nombre || "Usuario"} (${currentUser?.username || ""}) - ${companyLabel}`;
  userInfoNav.textContent = userDisplayText;
  userInfoDropdown.textContent = userDisplayText;
  manageUsersBtn.classList.toggle("hidden", !permissions.canManageUsers);
  try {
    applyPermissionState();
    updateAutoApplySavedFiltersButton();
    updateSavedFiltersModeIndicators();
    loadLastModuleFromStorage();
  } catch (error) {
    console.error("No se pudo completar la configuración inicial de la UI:", error);
    showToast("Se detectó un problema al preparar la interfaz.", "warning");
  }

  showStartMenu();
  setActiveNav(null);
  applyFiltersOnOpen(loadInventoryFiltersPreset, resetInventoryFilters);
  startAutoAlertMonitor();
}

function showAuthError(message) {
  authError.textContent = message;
  authError.classList.remove("hidden");
}

async function ensureLoginCompaniesLoaded() {
  if (!loginCompanySelect) {
    return;
  }

  if (companies.length > 0) {
    loginCompanies = [...companies];
    populateLoginCompanies(loginCompanies);
    return;
  }

  if (loginCompanies.length > 0) {
    populateLoginCompanies(loginCompanies);
    return;
  }

  try {
    const response = await api("/api/public/companies", {
      requiresAuth: false
    });
    loginCompanies = Array.isArray(response?.companies) ? response.companies : [];
    companies = [...loginCompanies];
  } catch {
    loginCompanies = [];
    companies = [];
  }

  if (loginCompanies.length === 0) {
    loginCompanies = [...DEFAULT_COMPANIES];
    companies = [...DEFAULT_COMPANIES];
    showAuthError("No se pudo obtener compañías desde el servidor. Reinicia el servidor para usar la configuración actual.");
  }

  populateLoginCompanies(loginCompanies);
}

function populateLoginCompanies(companies) {
  if (!loginCompanySelect) {
    return;
  }

  const previous = String(loginCompanySelect.value || "").trim();
  const list = Array.isArray(companies) ? companies : [];

  loginCompanySelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = list.length > 0 ? "Selecciona tu compañía" : "No hay compañías disponibles";
  loginCompanySelect.appendChild(placeholder);

  list.forEach((company) => {
    const option = document.createElement("option");
    option.value = String(company?.id || "").trim();
    option.textContent = String(company?.nombre || company?.id || "").trim();
    if (option.value) {
      loginCompanySelect.appendChild(option);
    }
  });

  if (previous && list.some((company) => String(company?.id || "") === previous)) {
    loginCompanySelect.value = previous;
  } else if (list.length === 1) {
    loginCompanySelect.value = String(list[0].id || "");
  } else {
    loginCompanySelect.value = "";
  }
}

async function api(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    requiresAuth = true,
    timeoutMs = API_TIMEOUT_MS
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(path, {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("La solicitud tardó demasiado. Intenta nuevamente.");
    }
    throw new Error("No se pudo conectar con el servidor.");
  } finally {
    clearTimeout(timeout);
  }

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

function initGlobalErrorHandling() {
  window.addEventListener("error", (event) => {
    const message = String(event?.message || "Error inesperado en la aplicación.").trim();
    showToast(message, "error");
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event?.reason;
    const message = typeof reason === "string" ? reason : String(reason?.message || "Error asíncrono no controlado.");
    showToast(message, "error");
  });
}

function runStartupHealthCheck() {
  const checks = [
    ["updateHomeOperationalKpis", typeof updateHomeOperationalKpis === "function"],
    ["renderLatestDayOrderPdf", typeof renderLatestDayOrderPdf === "function"],
    ["vehicleViewerState", typeof vehicleViewerState === "object" && vehicleViewerState !== null],
    ["FALLBACK_VEHICLE_PHOTO_BY_ANGLE", typeof FALLBACK_VEHICLE_PHOTO_BY_ANGLE === "object" && FALLBACK_VEHICLE_PHOTO_BY_ANGLE !== null]
  ];

  const missing = checks.filter(([, ok]) => !ok).map(([name]) => name);
  if (missing.length > 0) {
    showToast(`Faltan dependencias de inicio: ${missing.join(", ")}.`, "error");
  }
}

async function openUsersModal() {
  if (!permissions.canViewUsers) {
    return;
  }

  try {
    await refreshCompanies({ useAdminEndpoint: permissions.canManageCompanies });
    await refreshUsers();
    openFeatureModal(usersModal);
  } catch (error) {
    alert(error.message || "No se pudo cargar la gestión de usuarios.");
  }
}

async function openGuardModal() {
  try {
    await refreshGuardBook();
    openFeatureModal(guardModal);
    setActiveNav(menuOpenGuard);
    setLastModule("guard");
    applyFiltersOnOpen(loadGuardFiltersPreset, resetGuardFilters);
  } catch (error) {
    alert(error.message || "No se pudo cargar el libro de guardia.");
  }
}

async function openMedicalModal() {
  try {
    await refreshMedicalRecords();
    openFeatureModal(medicalModal);
    setActiveNav(menuOpenMedical);
    setLastModule("medical");
    applyFiltersOnOpen(loadMedicalFiltersPreset, resetMedicalFilters);
  } catch (error) {
    alert(error.message || "No se pudo cargar las fichas medicas.");
  }
}

async function openCoursesModal() {
  try {
    await refreshCourses();
    openFeatureModal(coursesModal);
    setActiveNav(menuOpenCourses);
    setLastModule("courses");
    applyFiltersOnOpen(loadCoursesFiltersPreset, resetCoursesFilters);
  } catch (error) {
    alert(error.message || "No se pudo cargar los cursos de voluntarios.");
  }
}

async function openDayOrdersModal() {
  try {
    await refreshDayOrders();
    await refreshDayOrderPdfs();
    openFeatureModal(dayOrdersModal);
    setActiveNav(menuOpenDayOrders);
    setLastModule("dayorders");
    applyFiltersOnOpen(loadDayOrdersFiltersPreset, resetDayOrdersFilters);
  } catch (error) {
    alert(error.message || "No se pudo cargar las ordenes del dia.");
  }
}

async function openVehiclesModal() {
  try {
    await refreshVehicles();
    openFeatureModal(vehiclesModal);
    setActiveNav(menuOpenVehicles);
    setLastModule("vehicles");
    applyFiltersOnOpen(loadVehiclesFiltersPreset, resetVehiclesFilters);
  } catch (error) {
    alert(error.message || "No se pudo cargar los carros.");
  }
}

async function openUniformsModal() {
  try {
    await refreshUniforms();
    openFeatureModal(uniformsModal);
    setActiveNav(menuOpenUniforms);
    setLastModule("uniforms");
    applyFiltersOnOpen(loadUniformsFiltersPreset, resetUniformsFilters);
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
  setLastModule("inventory");
  applyFiltersOnOpen(loadInventoryFiltersPreset, resetInventoryFilters);
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

function onGlobalShortcutKeyDown(event) {
  const isSearchShortcut = (event.ctrlKey || event.metaKey) && String(event.key || "").toLowerCase() === "k";
  if (!isSearchShortcut) {
    return;
  }

  event.preventDefault();
  openHomeModule();
  if (quickGlobalSearchInput) {
    quickGlobalSearchInput.focus();
    quickGlobalSearchInput.select();
  }
}

async function onQuickGlobalSearch() {
  const term = String(quickGlobalSearchInput?.value || "").trim();
  if (!term) {
    alert("Ingresa un texto para buscar.");
    return;
  }

  const normalized = term.toLowerCase();
  const countByModule = [
    {
      module: "Inventario",
      count: inventory.filter((item) => `${item.nombre || ""} ${item.categoria || ""} ${item.ubicacion || ""} ${item.notas || ""}`.toLowerCase().includes(normalized)).length,
      run: () => {
        openInventoryModule();
        searchInput.value = term;
        render();
        inventorySection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    {
      module: "Libro de Guardia",
      count: guardEntries.filter((entry) => `${entry.descripcion || ""} ${entry.recurso || ""} ${entry.autorNombre || ""}`.toLowerCase().includes(normalized)).length,
      run: async () => {
        await openGuardModal();
        guardSearchInput.value = term;
        renderGuardBook();
      }
    },
    {
      module: "Fichas Médicas",
      count: medicalRecords.filter((record) => `${record.voluntarioNombre || ""} ${record.grupoSanguineo || ""}`.toLowerCase().includes(normalized)).length,
      run: async () => {
        await openMedicalModal();
        medicalSearchInput.value = term;
        renderMedicalRecords();
      }
    },
    {
      module: "Cursos",
      count: volunteerCourses.filter((course) => `${course.voluntarioNombre || ""} ${course.curso || ""} ${course.institucion || ""} ${course.certificacion || ""}`.toLowerCase().includes(normalized)).length,
      run: async () => {
        await openCoursesModal();
        coursesSearchInput.value = term;
        renderCourses();
      }
    },
    {
      module: "Órdenes del Día",
      count: dayOrders.filter((order) => `${order.titulo || ""} ${order.contenido || ""} ${order.firmadoPor || ""}`.toLowerCase().includes(normalized)).length,
      run: async () => {
        await openDayOrdersModal();
        dayOrdersSearchInput.value = term;
        renderDayOrders();
      }
    },
    {
      module: "Carros",
      count: vehicles.filter((vehicle) => `${vehicle.nombre || ""} ${vehicle.codigo || ""} ${vehicle.patente || ""} ${vehicle.marcaModelo || ""} ${vehicle.observaciones || ""}`.toLowerCase().includes(normalized)).length,
      run: async () => {
        await openVehiclesModal();
        vehiclesSearchInput.value = term;
        renderVehicles();
      }
    },
    {
      module: "Uniformes",
      count: uniforms.filter((record) => `${record.codigoVestimenta || ""} ${record.voluntarioNombre || ""} ${record.prenda || ""} ${record.talla || ""} ${record.fechaMantencion || ""} ${record.revisionTecnicaVencimiento || ""} ${record.observaciones || ""}`.toLowerCase().includes(normalized)).length,
      run: async () => {
        await openUniformsModal();
        uniformsSearchInput.value = term;
        renderUniforms();
      }
    }
  ];

  const bestMatch = countByModule
    .sort((a, b) => b.count - a.count)
    .find((candidate) => candidate.count > 0);

  if (!bestMatch) {
    alert("No se encontraron coincidencias en los módulos operativos.");
    return;
  }

  await bestMatch.run();
  showToast(
    `Búsqueda global enviada a ${bestMatch.module} (${bestMatch.count} coincidencias).`,
    "success",
    {
      actionLabel: "Reabrir",
      onAction: async () => {
        await bestMatch.run();
      }
    }
  );
}

function inferToastType(message) {
  const text = String(message || "").toLowerCase();
  if (text.includes("no se pudo") || text.includes("error") || text.includes("no tienes permiso")) {
    return "error";
  }
  if (text.includes("completa") || text.includes("ingresa") || text.includes("selecciona")) {
    return "warning";
  }
  if (text.includes("actualizada") || text.includes("guardado") || text.includes("creado") || text.includes("enviado")) {
    return "success";
  }
  return "info";
}

function showToast(message, type = "info", options = {}) {
  const text = String(message || "").trim();
  if (!text) {
    return;
  }

  if (!toastContainerEl) {
    nativeAlert(text);
    return;
  }

  const toast = document.createElement("div");
  toast.className = `app-toast app-toast-${type}`;

  const content = document.createElement("div");
  content.className = "app-toast-content";
  content.textContent = text;
  toast.appendChild(content);

  if (typeof options.onAction === "function" && options.actionLabel) {
    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = "app-toast-action";
    actionBtn.textContent = String(options.actionLabel);
    actionBtn.addEventListener("click", () => {
      try {
        const result = options.onAction();
        if (result && typeof result.then === "function") {
          result.catch((error) => {
            console.error(error);
          });
        }
      } finally {
        dismiss();
      }
    });
    toast.appendChild(actionBtn);
  }

  toastContainerEl.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  const dismiss = () => {
    toast.classList.remove("is-visible");
    toast.classList.add("is-leaving");
    setTimeout(() => toast.remove(), 200);
  };

  setTimeout(dismiss, type === "error" ? 4800 : 3200);
}

window.alert = (message) => {
  const text = String(message || "").trim();
  if (!text) {
    return;
  }
  showToast(text, inferToastType(text));
};

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

function applyCellLabels(row, labels) {
  const cells = row.querySelectorAll("td");
  labels.forEach((label, index) => {
    const cell = cells[index];
    if (!cell) {
      return;
    }
    cell.setAttribute("data-label", label);
  });
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
  closeVehicleDrawerPanel();
  vehicleViewerState.editMode = false;
  vehicleEditorPanel.classList.add("hidden");
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

async function refreshCompanies(options = {}) {
  const { useAdminEndpoint = false } = options;
  const endpoint = useAdminEndpoint ? "/api/companies" : "/api/public/companies";
  const response = await api(endpoint, {
    requiresAuth: useAdminEndpoint
  });
  companies = Array.isArray(response?.companies) ? response.companies : [];
  loginCompanies = [...companies];
  populateCompanySelectors();
  renderCompanies();
}

function populateCompanySelectors() {
  if (newCompanyIdSelect) {
    const previous = String(newCompanyIdSelect.value || "").trim();
    newCompanyIdSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Selecciona compañía...";
    newCompanyIdSelect.appendChild(placeholder);

    companies.forEach((company) => {
      const option = document.createElement("option");
      option.value = String(company?.id || "").trim();
      option.textContent = String(company?.nombre || company?.id || "").trim();
      if (option.value) {
        newCompanyIdSelect.appendChild(option);
      }
    });

    if (previous && companies.some((company) => String(company?.id || "") === previous)) {
      newCompanyIdSelect.value = previous;
    } else if (currentUser?.companyId && companies.some((company) => String(company?.id || "") === String(currentUser.companyId))) {
      newCompanyIdSelect.value = String(currentUser.companyId);
    }
  }

  if (loginCompanySelect && !authToken) {
    populateLoginCompanies(companies);
  }
}

function renderCompanies() {
  if (!companiesTableBody) {
    return;
  }

  companiesTableBody.innerHTML = "";

  companies.forEach((company) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(company.id)}</td>
      <td>${escapeHtml(company.nombre || company.id)}</td>
      <td class="actions-cell"></td>
    `;

    applyCellLabels(tr, ["ID", "Nombre", "Acciones"]);

    const actions = tr.querySelector(".actions-cell");
    const renameBtn = document.createElement("button");
    renameBtn.className = "icon-btn";
    renameBtn.textContent = "Renombrar";
    renameBtn.disabled = !permissions.canManageCompanies;
    renameBtn.addEventListener("click", async () => {
      if (!permissions.canManageCompanies) {
        alert("No tienes permisos para renombrar compañías.");
        return;
      }
      const nextName = prompt("Nuevo nombre de la compañía", company.nombre || company.id);
      if (!nextName) {
        return;
      }
      try {
        await api(`/api/companies/${encodeURIComponent(company.id)}`, {
          method: "PATCH",
          body: { nombre: nextName.trim() }
        });
        await refreshCompanies({ useAdminEndpoint: true });
        await ensureLoginCompaniesLoaded();
        showToast("Compañía actualizada.", "success");
      } catch (error) {
        alert(error.message || "No se pudo actualizar la compañía.");
      }
    });

    actions.appendChild(renameBtn);
    companiesTableBody.appendChild(tr);
  });
}

async function onCreateCompany(event) {
  event.preventDefault();
  if (!permissions.canManageCompanies) {
    alert("No tienes permisos para gestionar compañías.");
    return;
  }

  const formData = new FormData(companyForm);
  const payload = {
    id: String(formData.get("id") || "").trim(),
    nombre: String(formData.get("nombre") || "").trim()
  };

  if (!payload.id || !payload.nombre) {
    alert("Completa id y nombre de la compañía.");
    return;
  }

  try {
    await api("/api/companies", {
      method: "POST",
      body: payload
    });
    companyForm.reset();
    await refreshCompanies({ useAdminEndpoint: true });
    await ensureLoginCompaniesLoaded();
    showToast("Compañía creada correctamente.", "success");
  } catch (error) {
    alert(error.message || "No se pudo crear la compañía.");
  }
}

async function onCreateUser(event) {
  event.preventDefault();
  if (!permissions.canCreateUsers) {
    alert("No tienes permisos para gestionar usuarios.");
    return;
  }

  const formData = new FormData(userForm);
  const payload = {
    nombre: String(formData.get("nombre") || "").trim(),
    username: String(formData.get("username") || "").trim(),
    password: String(formData.get("password") || ""),
    role: String(formData.get("role") || "").trim(),
    companyId: String(formData.get("companyId") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    modulePermissions: extractModulePermissions(formData)
  };

  if (!payload.nombre || !payload.username || !payload.password || !payload.role || !payload.companyId) {
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
      <td>${escapeHtml(user.companyName || user.companyId || "-")}</td>
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

    applyCellLabels(tr, ["Compañía", "Nombre", "Usuario", "Correo", "Telefono", "Rol", "Ultimo acceso", "Permisos", "Estado", "Acciones"]);

    const actions = tr.querySelector(".actions-cell");

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "icon-btn";
    toggleBtn.textContent = user.blocked ? "Desbloquear" : "Bloquear";
    toggleBtn.disabled = user.id === currentUser?.id || !permissions.canBlockUsers;
    toggleBtn.addEventListener("click", async () => {
      if (!permissions.canBlockUsers) {
        alert("No tienes permisos para bloquear usuarios.");
        return;
      }
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
    roleBtn.disabled = !permissions.canEditUserPermissions;
    roleBtn.addEventListener("click", async () => {
      if (!permissions.canEditUserPermissions) {
        alert("No tienes permisos para cambiar roles.");
        return;
      }
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
    passwordBtn.disabled = !permissions.canResetUserPasswords;
    passwordBtn.addEventListener("click", async () => {
      if (!permissions.canResetUserPasswords) {
        alert("No tienes permisos para cambiar claves.");
        return;
      }
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
    permissionsBtn.disabled = !permissions.canEditUserPermissions;
    permissionsBtn.addEventListener("click", () => openPermissionsEditor(user));

    const companyBtn = document.createElement("button");
    companyBtn.className = "icon-btn";
    companyBtn.textContent = "Compañía";
    companyBtn.disabled = !permissions.canEditUserPermissions;
    companyBtn.addEventListener("click", async () => {
      if (!permissions.canEditUserPermissions) {
        alert("No tienes permisos para cambiar compañía.");
        return;
      }
      const available = companies.map((company) => company.id).join(", ");
      const selected = prompt(`Compañía destino (${available})`, String(user.companyId || ""));
      if (!selected) {
        return;
      }
      try {
        await api(`/api/users/${user.id}`, {
          method: "PATCH",
          body: { companyId: selected.trim() }
        });
        await Promise.all([refreshCompanies({ useAdminEndpoint: permissions.canManageCompanies }), refreshUsers()]);
      } catch (error) {
        alert(error.message || "No se pudo cambiar la compañía del usuario.");
      }
    });

    actions.appendChild(toggleBtn);
    actions.appendChild(roleBtn);
    actions.appendChild(passwordBtn);
    actions.appendChild(companyBtn);
    actions.appendChild(permissionsBtn);
    usersTableBody.appendChild(tr);
  });

  usersEmpty.classList.toggle("hidden", users.length > 0);
}

function openPermissionsEditor(user) {
  if (!permissions.canEditUserPermissions) {
    return;
  }
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
  permissionsEditorForm.elements.perm_canViewUsers.checked = Boolean(modulePermissions.canViewUsers);
  permissionsEditorForm.elements.perm_canCreateUsers.checked = Boolean(modulePermissions.canCreateUsers);
  permissionsEditorForm.elements.perm_canEditUsers.checked = Boolean(modulePermissions.canEditUsers);
  permissionsEditorForm.elements.perm_canEditUserPermissions.checked = Boolean(modulePermissions.canEditUserPermissions);
  permissionsEditorForm.elements.perm_canResetUserPasswords.checked = Boolean(modulePermissions.canResetUserPasswords);
  permissionsEditorForm.elements.perm_canBlockUsers.checked = Boolean(modulePermissions.canBlockUsers);
  permissionsEditorForm.elements.perm_canManageCompanies.checked = Boolean(modulePermissions.canManageCompanies);
}

async function onSaveUserPermissions(event) {
  event.preventDefault();
  if (!permissions.canEditUserPermissions) {
    alert("No tienes permisos para editar permisos de usuario.");
    return;
  }
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
    canManageUsers: formData.has("perm_canManageUsers"),
    canViewUsers: formData.has("perm_canViewUsers"),
    canCreateUsers: formData.has("perm_canCreateUsers"),
    canEditUsers: formData.has("perm_canEditUsers"),
    canEditUserPermissions: formData.has("perm_canEditUserPermissions"),
    canResetUserPasswords: formData.has("perm_canResetUserPasswords"),
    canBlockUsers: formData.has("perm_canBlockUsers"),
    canManageCompanies: formData.has("perm_canManageCompanies")
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
    ["canManageUsers", "Usuarios"],
    ["canViewUsers", "Ver Usuarios"],
    ["canCreateUsers", "Crear Usuarios"],
    ["canEditUsers", "Editar Usuarios"],
    ["canEditUserPermissions", "Editar Permisos"],
    ["canResetUserPasswords", "Reset Claves"],
    ["canBlockUsers", "Bloquear Usuarios"],
    ["canManageCompanies", "Compañías"]
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

  if (dayOrderPdfTitle) {
    dayOrderPdfTitle.disabled = dayOrdersDisabled;
  }

  if (dayOrderPdfFile) {
    dayOrderPdfFile.disabled = dayOrdersDisabled;
  }

  if (uploadDayOrderPdfBtn) {
    uploadDayOrderPdfBtn.disabled = dayOrdersDisabled;
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

  if (userForm) {
    const createUserFields = userForm.querySelectorAll("input, select, textarea, button");
    createUserFields.forEach((field) => {
      field.disabled = !permissions.canCreateUsers;
    });
  }

  if (companyForm) {
    const companyFields = companyForm.querySelectorAll("input, select, textarea, button");
    companyFields.forEach((field) => {
      field.disabled = !permissions.canManageCompanies;
    });
  }

  if (permissionsEditorForm) {
    const permissionEditorFields = permissionsEditorForm.querySelectorAll("input, select, textarea, button");
    permissionEditorFields.forEach((field) => {
      if (field.id === "cancelPermissionsBtn") {
        field.disabled = false;
        return;
      }
      field.disabled = !permissions.canEditUserPermissions;
    });
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

    applyCellLabels(tr, ["Fecha", "Turno", "Tipo", "Recurso", "Descripcion", "Autor", "Registro"]);

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

    applyCellLabels(tr, ["Voluntario", "Grupo", "Alergias", "Enfermedades", "Medicamentos", "Contacto", "Telefono", "Relacion", "Actualizado", "Por", "Acciones"]);

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
    const haystack = `${course.voluntarioNombre} ${course.curso} ${course.institucion} ${course.certificacion} ${course.fechaVencimientoCertificacion || ""}`.toLowerCase();
    return !term || haystack.includes(term);
  });
}

function renderCourses() {
  const rows = getFilteredCourses();
  coursesTableBody.innerHTML = "";

  rows.forEach((course, idx) => {
    const certAlert = getCertificationAlertData(course);
    const tr = document.createElement("tr");
    tr.style.animationDelay = `${idx * 30}ms`;
    tr.innerHTML = `
      <td>${escapeHtml(course.voluntarioNombre)}</td>
      <td>${escapeHtml(course.curso)}</td>
      <td>${escapeHtml(course.institucion)}</td>
      <td>${escapeHtml(formatDate(course.fechaInicio))}</td>
      <td>${escapeHtml(formatDate(course.fechaFin))}</td>
      <td>${escapeHtml(course.certificacion)}</td>
      <td>${escapeHtml(formatDate(course.fechaVencimientoCertificacion))}</td>
      <td><span class="alert-pill ${certAlert.className}">${escapeHtml(certAlert.label)}</span></td>
      <td>${escapeHtml(String(course.horasCapacitacion))}</td>
      <td>${escapeHtml(formatDateTime(course.actualizadoEn))}</td>
      <td>${escapeHtml(course.actualizadoPor || "-")}</td>
      <td class="actions-cell"></td>
    `;

    applyCellLabels(tr, ["Voluntario", "Curso", "Institucion", "Inicio", "Fin", "Certificacion", "Vencimiento", "Estado Cert.", "Horas", "Actualizado", "Por", "Acciones"]);

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
  coursesForm.fechaVencimientoCertificacion.value = course.fechaVencimientoCertificacion || "";
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
    fechaVencimientoCertificacion: String(formData.get("fechaVencimientoCertificacion") || "").trim(),
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

  if (payload.fechaVencimientoCertificacion && payload.fechaVencimientoCertificacion < payload.fechaInicio) {
    alert("El vencimiento de certificación no puede ser anterior a la fecha de inicio.");
    return;
  }

  if (payload.fechaVencimientoCertificacion && payload.fechaFin && payload.fechaVencimientoCertificacion < payload.fechaFin) {
    alert("El vencimiento de certificación no puede ser anterior a la fecha de fin.");
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

    applyCellLabels(tr, ["Fecha", "Tipo", "Titulo", "Contenido", "Firmado por", "Publicado", "Acciones"]);

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

async function onUploadDayOrderPdf() {
  if (!permissions.canWriteDayOrders) {
    alert("Tu rol es solo lectura. No puedes subir PDFs de ordenes del dia.");
    return;
  }

  const selectedFile = dayOrderPdfFile?.files?.[0];
  if (!selectedFile) {
    if (dayOrderPdfUploadStatus) {
      dayOrderPdfUploadStatus.textContent = "Selecciona un archivo PDF antes de subir.";
    }
    return;
  }

  const fileType = String(selectedFile.type || "").toLowerCase();
  const fileName = String(selectedFile.name || "").toLowerCase();
  const looksLikePdf = fileType === "application/pdf" || fileName.endsWith(".pdf");

  if (!looksLikePdf) {
    if (dayOrderPdfUploadStatus) {
      dayOrderPdfUploadStatus.textContent = "El archivo debe ser un PDF válido.";
    }
    return;
  }

  if (selectedFile.size > 10 * 1024 * 1024) {
    if (dayOrderPdfUploadStatus) {
      dayOrderPdfUploadStatus.textContent = "El PDF supera el límite de 10 MB.";
    }
    return;
  }

  const title = String(dayOrderPdfTitle?.value || "").trim();
  const formData = new FormData();
  formData.append("pdf", selectedFile);
  if (title) {
    formData.append("titulo", title);
  }

  if (dayOrderPdfUploadStatus) {
    dayOrderPdfUploadStatus.textContent = "Subiendo PDF...";
  }
  uploadDayOrderPdfBtn.disabled = true;

  try {
    const response = await fetch("/api/day-orders/pdfs/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      body: formData
    });

    const payload = await safeJson(response);
    if (!response.ok) {
      throw new Error(payload?.error || "No se pudo subir el PDF.");
    }

    dayOrderPdfTitle.value = "";
    dayOrderPdfFile.value = "";
    await refreshDayOrderPdfs();

    if (dayOrderPdfUploadStatus) {
      const uploadedName = payload?.pdf?.titulo || payload?.pdf?.originalName || "PDF";
      dayOrderPdfUploadStatus.textContent = `PDF subido correctamente: ${uploadedName}`;
    }
  } catch (error) {
    if (dayOrderPdfUploadStatus) {
      dayOrderPdfUploadStatus.textContent = error.message || "No se pudo subir el PDF.";
    }
  } finally {
    uploadDayOrderPdfBtn.disabled = !permissions.canWriteDayOrders;
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
    const haystack = `${vehicle.nombre || ""} ${vehicle.codigo || ""} ${vehicle.patente || ""} ${vehicle.marcaModelo || ""} ${vehicle.observaciones || ""}`.toLowerCase();
    const matchesTerm = !term || haystack.includes(term);
    return matchesStatus && matchesTerm;
  });
}

function getVehicleDisplayName(vehicle) {
  const nombre = String(vehicle?.nombre || "").trim();
  if (nombre) {
    return nombre;
  }

  const marcaModelo = String(vehicle?.marcaModelo || "").trim();
  if (marcaModelo) {
    return marcaModelo;
  }

  return String(vehicle?.codigo || "Carro").trim() || "Carro";
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
      <td>${escapeHtml(getVehicleDisplayName(vehicle))}</td>
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
  renderVehiclePhotoViewer(rows);
}

function onVehicleViewerVehicleChange() {
  vehicleViewerState.vehicleId = vehiclesViewerVehicle.value;
  vehicleViewerState.angle = "left";
  vehicleViewerState.activeDrawerId = "";
  vehicleViewerState.activeDrawerItemIndex = 0;
  vehicleViewerState.dirtyMedia = false;
  renderVehiclePhotoViewer(getFilteredVehicles());
}

function getVehiclePhotoGallery(vehicle) {
  const source = Array.isArray(vehicle?.photoGallery) ? vehicle.photoGallery : [];
  const normalized = source
    .map((entry) => ({
      angle: String(entry?.angle || "").trim().toLowerCase(),
      label: String(entry?.label || "").trim(),
      image: String(entry?.image || "").trim()
    }))
    .filter((entry) => ["left", "right", "rear"].includes(entry.angle) && entry.image);

  if (normalized.length > 0) {
    return normalized;
  }

  return [
    { angle: "left", label: "Lado izquierdo", image: FALLBACK_VEHICLE_PHOTO_BY_ANGLE.left },
    { angle: "right", label: "Lado derecho", image: FALLBACK_VEHICLE_PHOTO_BY_ANGLE.right },
    { angle: "rear", label: "Parte trasera", image: FALLBACK_VEHICLE_PHOTO_BY_ANGLE.rear }
  ];
}

function getVehicleDrawers(vehicle) {
  if (!Array.isArray(vehicle?.drawerInventory)) {
    return [];
  }

  return vehicle.drawerInventory
    .map((drawer) => ({
      id: String(drawer?.id || "").trim(),
      nombre: String(drawer?.nombre || "").trim(),
      angle: String(drawer?.angle || "").trim().toLowerCase(),
      x: clamp(Number(drawer?.x), 4, 96),
      y: clamp(Number(drawer?.y), 10, 90),
      items: normalizeDrawerItems(drawer)
    }))
    .map((drawer) => ({
      ...drawer,
      item: drawer.items[0]
    }))
    .filter((drawer) => drawer.id && ["left", "right", "rear"].includes(drawer.angle));
}

function normalizeDrawerItems(drawer) {
  const source = Array.isArray(drawer?.items)
    ? drawer.items
    : drawer?.item
      ? [drawer.item]
      : [];

  const normalized = source
    .map((item) => ({
      nombre: String(item?.nombre || "").trim() || "Sin item asignado",
      estado: String(item?.estado || "").trim() || "Sin estado",
      imagen: String(item?.imagen || "").trim() || "logo.png",
      descripcion: String(item?.descripcion || "").trim() || "No hay descripción disponible."
    }))
    .filter((item) => item.nombre);

  if (normalized.length > 0) {
    return normalized;
  }

  return [
    {
      nombre: "Sin item asignado",
      estado: "Sin estado",
      imagen: "logo.png",
      descripcion: "No hay descripción disponible."
    }
  ];
}

function renderVehiclePhotoViewer(filteredVehicles = []) {
  if (!vehiclesViewerVehicle || !vehicleViewerAngles || !vehiclePhotoMain || !vehicleHotspotsLayer || !vehiclePhotoHint) {
    return;
  }

  const rows = Array.isArray(filteredVehicles) ? filteredVehicles : [];
  vehiclesViewerVehicle.innerHTML = "";

  if (rows.length === 0) {
    vehiclePhotoMain.src = FALLBACK_VEHICLE_PHOTO_BY_ANGLE.left;
    vehiclePhotoMain.alt = "No hay carros disponibles para mostrar";
    vehicleViewerAngles.innerHTML = "";
    vehicleHotspotsLayer.innerHTML = "";
    vehiclePhotoHint.textContent = "No hay carros que coincidan con el filtro actual.";
    closeVehicleDrawerPanel();
    updateVehicleMediaControls(null, []);
    return;
  }

  rows.forEach((vehicle) => {
    const option = document.createElement("option");
    option.value = vehicle.id;
    option.textContent = `${getVehicleDisplayName(vehicle)} · ${vehicle.codigo} (${vehicle.patente})`;
    vehiclesViewerVehicle.appendChild(option);
  });

  const hasCurrentSelection = rows.some((vehicle) => vehicle.id === vehicleViewerState.vehicleId);
  if (!hasCurrentSelection) {
    vehicleViewerState.vehicleId = rows[0].id;
    vehicleViewerState.activeDrawerId = "";
  }

  vehiclesViewerVehicle.value = vehicleViewerState.vehicleId;

  const selectedVehicle = rows.find((vehicle) => vehicle.id === vehicleViewerState.vehicleId) || rows[0];
  const gallery = getVehiclePhotoGallery(selectedVehicle);
  const allDrawers = getVehicleDrawers(selectedVehicle);
  const hasCurrentAngle = gallery.some((photo) => photo.angle === vehicleViewerState.angle);
  if (!hasCurrentAngle) {
    vehicleViewerState.angle = gallery[0].angle;
    vehicleViewerState.activeDrawerId = "";
  }

  vehicleViewerAngles.innerHTML = "";
  gallery.forEach((photo) => {
    const angleBtn = document.createElement("button");
    angleBtn.type = "button";
    angleBtn.className = "vehicle-angle-btn";
    if (photo.angle === vehicleViewerState.angle) {
      angleBtn.classList.add("is-active");
      angleBtn.setAttribute("aria-selected", "true");
    } else {
      angleBtn.setAttribute("aria-selected", "false");
    }
    angleBtn.setAttribute("role", "tab");
    angleBtn.textContent = photo.label || photo.angle;
    angleBtn.addEventListener("click", () => {
      vehicleViewerState.angle = photo.angle;
      vehicleViewerState.activeDrawerId = "";
      vehicleViewerState.activeDrawerItemIndex = 0;
      renderVehiclePhotoViewer(rows);
    });
    vehicleViewerAngles.appendChild(angleBtn);
  });

  const currentPhoto = gallery.find((photo) => photo.angle === vehicleViewerState.angle) || gallery[0];
  vehiclePhotoMain.src = currentPhoto.image;
  vehiclePhotoMain.alt = `Vista ${currentPhoto.label || currentPhoto.angle} del carro ${selectedVehicle.codigo}`;

  const drawersInAngle = getVehicleDrawers(selectedVehicle).filter((drawer) => drawer.angle === vehicleViewerState.angle);
  vehicleHotspotsLayer.innerHTML = "";

  drawersInAngle.forEach((drawer) => {
    const hotspot = document.createElement("button");
    hotspot.type = "button";
    hotspot.className = "vehicle-hotspot";
    hotspot.dataset.drawerId = drawer.id;
    hotspot.style.left = `${drawer.x}%`;
    hotspot.style.top = `${drawer.y}%`;
    hotspot.textContent = drawer.id;
    hotspot.setAttribute("aria-label", `Abrir inventario de ${drawer.nombre || drawer.id}`);

    if (vehicleViewerState.activeDrawerId === drawer.id) {
      hotspot.classList.add("is-active");
    }

    hotspot.addEventListener("click", () => {
      vehicleViewerState.activeDrawerId = drawer.id;
      vehicleViewerState.activeDrawerItemIndex = 0;
      openVehicleDrawerPanel(drawer);
      renderVehiclePhotoViewer(rows);
    });

    hotspot.addEventListener("pointerdown", (event) => {
      onVehicleHotspotPointerDown(event, drawer.id);
    });

    vehicleHotspotsLayer.appendChild(hotspot);
  });

  if (drawersInAngle.length === 0) {
    vehiclePhotoHint.textContent = "Este ángulo no tiene gavetas configuradas.";
    closeVehicleDrawerPanel();
    updateVehicleMediaControls(selectedVehicle, allDrawers);
    return;
  }

  const activeDrawer = drawersInAngle.find((drawer) => drawer.id === vehicleViewerState.activeDrawerId);
  if (activeDrawer) {
    vehiclePhotoHint.textContent = "Gaveta activa resaltada en la foto.";
    openVehicleDrawerPanel(activeDrawer);
    updateVehicleMediaControls(selectedVehicle, allDrawers);
    return;
  }

  vehiclePhotoHint.textContent = "Selecciona una gaveta para ver el inventario principal.";
  closeVehicleDrawerPanel();
  updateVehicleMediaControls(selectedVehicle, allDrawers);
}

function updateVehicleMediaControls(vehicle, drawers) {
  const editable = Boolean(vehicle) && permissions.canWriteVehicles;

  toggleVehicleEditorBtn.disabled = !editable;
  saveVehicleViewerChangesBtn.disabled = !editable || !vehicleViewerState.dirtyMedia || vehicleViewerState.isSavingMedia;
  createVehicleQuickBtn.disabled = !permissions.canWriteVehicles || vehicleViewerState.isSavingMedia;
  deleteVehicleQuickBtn.disabled = !editable || vehicleViewerState.isSavingMedia;

  if (!vehicle) {
    vehiclePhotoLeftInput.value = "";
    vehiclePhotoRightInput.value = "";
    vehiclePhotoRearInput.value = "";
    vehicleDrawerSelect.innerHTML = "";
    vehicleDrawerNameInput.value = "";
    vehicleDrawerItemSelect.innerHTML = "";
    vehicleDrawerNameInput.disabled = true;
    createVehicleDrawerBtn.disabled = true;
    deleteVehicleDrawerBtn.disabled = true;
    createVehicleDrawerItemBtn.disabled = true;
    deleteVehicleDrawerItemBtn.disabled = true;
    vehicleDrawerXRange.value = "0";
    vehicleDrawerYRange.value = "0";
    vehicleDrawerItemNameInput.value = "";
    vehicleDrawerItemStatusInput.value = "";
    vehicleDrawerItemImageInput.value = "";
    vehicleDrawerItemDescriptionInput.value = "";
    vehicleDrawerItemNameInput.disabled = true;
    vehicleDrawerItemStatusInput.disabled = true;
    vehicleDrawerItemImageInput.disabled = true;
    vehicleDrawerItemDescriptionInput.disabled = true;
    vehicleEditorValidation.textContent = "";
    vehicleEditorValidation.classList.add("hidden");
    vehicleDrawerCoordsLabel.textContent = "Selecciona una gaveta para ajustar coordenadas.";
    toggleVehicleEditorBtn.textContent = "Editar hotspots y fotos";
    vehicleMediaStatus.textContent = "Sin cambios pendientes.";
    return;
  }

  const galleryByAngle = {
    left: FALLBACK_VEHICLE_PHOTO_BY_ANGLE.left,
    right: FALLBACK_VEHICLE_PHOTO_BY_ANGLE.right,
    rear: FALLBACK_VEHICLE_PHOTO_BY_ANGLE.rear
  };

  getVehiclePhotoGallery(vehicle).forEach((entry) => {
    galleryByAngle[entry.angle] = entry.image;
  });

  vehiclePhotoLeftInput.value = galleryByAngle.left;
  vehiclePhotoRightInput.value = galleryByAngle.right;
  vehiclePhotoRearInput.value = galleryByAngle.rear;

  vehicleDrawerSelect.innerHTML = "";
  drawers.forEach((drawer) => {
    const option = document.createElement("option");
    option.value = drawer.id;
    option.textContent = `${drawer.id} - ${drawer.nombre}`;
    vehicleDrawerSelect.appendChild(option);
  });

  if (drawers.length === 0) {
    vehicleDrawerNameInput.value = "";
    vehicleDrawerItemSelect.innerHTML = "";
    vehicleDrawerNameInput.disabled = true;
    createVehicleDrawerBtn.disabled = !editable;
    deleteVehicleDrawerBtn.disabled = true;
    createVehicleDrawerItemBtn.disabled = true;
    deleteVehicleDrawerItemBtn.disabled = true;
    vehicleDrawerXRange.value = "0";
    vehicleDrawerYRange.value = "0";
    vehicleDrawerItemNameInput.value = "";
    vehicleDrawerItemStatusInput.value = "";
    vehicleDrawerItemImageInput.value = "";
    vehicleDrawerItemDescriptionInput.value = "";
    vehicleDrawerItemNameInput.disabled = true;
    vehicleDrawerItemStatusInput.disabled = true;
    vehicleDrawerItemImageInput.disabled = true;
    vehicleDrawerItemDescriptionInput.disabled = true;
    vehicleDrawerCoordsLabel.textContent = "El carro no tiene gavetas para editar.";
  } else {
    const selectedDrawer = drawers.find((drawer) => drawer.id === vehicleViewerState.activeDrawerId) || drawers[0];
    vehicleDrawerSelect.value = selectedDrawer.id;
    vehicleViewerState.activeDrawerId = selectedDrawer.id;
    vehicleDrawerNameInput.value = selectedDrawer.nombre || "";
    vehicleDrawerNameInput.disabled = !editable;
    createVehicleDrawerBtn.disabled = !editable;
    deleteVehicleDrawerBtn.disabled = !editable;
    createVehicleDrawerItemBtn.disabled = !editable;
    vehicleDrawerXRange.value = String(Math.round(selectedDrawer.x));
    vehicleDrawerYRange.value = String(Math.round(selectedDrawer.y));

    const drawerItems = Array.isArray(selectedDrawer.items) ? selectedDrawer.items : [];
    if (vehicleViewerState.activeDrawerItemIndex >= drawerItems.length) {
      vehicleViewerState.activeDrawerItemIndex = 0;
    }

    vehicleDrawerItemSelect.innerHTML = "";
    drawerItems.forEach((item, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `${index + 1}. ${item.nombre}`;
      vehicleDrawerItemSelect.appendChild(option);
    });

    const activeItem = drawerItems[vehicleViewerState.activeDrawerItemIndex] || drawerItems[0];
    vehicleDrawerItemSelect.value = String(vehicleViewerState.activeDrawerItemIndex);
    deleteVehicleDrawerItemBtn.disabled = !editable || drawerItems.length <= 1;
    vehicleDrawerItemNameInput.value = activeItem?.nombre || "";
    vehicleDrawerItemStatusInput.value = activeItem?.estado || "";
    vehicleDrawerItemImageInput.value = activeItem?.imagen || "";
    vehicleDrawerItemDescriptionInput.value = activeItem?.descripcion || "";
    vehicleDrawerItemNameInput.disabled = !editable;
    vehicleDrawerItemStatusInput.disabled = !editable;
    vehicleDrawerItemImageInput.disabled = !editable;
    vehicleDrawerItemDescriptionInput.disabled = !editable;
    vehicleDrawerCoordsLabel.textContent = `Coordenadas de ${selectedDrawer.id}: X ${Math.round(selectedDrawer.x)}% / Y ${Math.round(selectedDrawer.y)}%`;
  }

  toggleVehicleEditorBtn.textContent = vehicleViewerState.editMode ? "Ocultar editor" : "Editar hotspots y fotos";
  if (!editable) {
    vehicleMediaStatus.textContent = "Solo lectura: sin permisos para editar carros.";
  } else if (vehicleViewerState.isSavingMedia) {
    vehicleMediaStatus.textContent = "Guardando cambios del visor...";
  } else if (vehicleViewerState.dirtyMedia) {
    vehicleMediaStatus.textContent = "Hay cambios sin guardar.";
  } else {
    vehicleMediaStatus.textContent = "Sin cambios pendientes.";
  }

  vehicleEditorValidation.textContent = "";
  vehicleEditorValidation.classList.add("hidden");
}

function generateNextVehicleCode() {
  const existing = new Set(
    vehicles
      .map((vehicle) => String(vehicle?.codigo || "").trim().toUpperCase())
      .filter(Boolean)
  );

  for (let i = 1; i <= 999; i += 1) {
    const code = `M-${i}`;
    if (!existing.has(code)) {
      return code;
    }
  }

  return `M-${Date.now()}`;
}

function generateNextVehiclePlate() {
  const suffix = String(Math.floor(Math.random() * 900) + 100);
  return `ZZ${suffix}AA`;
}

async function createVehicleQuick() {
  if (!permissions.canWriteVehicles) {
    alert("Tu rol es solo lectura. No puedes agregar carros.");
    return;
  }

  const generatedCode = generateNextVehicleCode();

  const payload = {
    nombre: `Carro ${generatedCode}`,
    codigo: generatedCode,
    patente: generateNextVehiclePlate(),
    marcaModelo: "Nuevo carro",
    anio: new Date().getFullYear(),
    kilometraje: 0,
    estadoOperativo: "Disponible",
    ultimaMantencion: "",
    proximaMantencionKm: 0,
    revisionTecnicaVencimiento: "",
    observaciones: "Registro creado desde visor de gavetas"
  };

  try {
    const response = await api("/api/vehicles", {
      method: "POST",
      body: payload
    });

    await refreshVehicles();
    if (response?.vehicle?.id) {
      vehicleViewerState.vehicleId = response.vehicle.id;
      vehicleViewerState.angle = "left";
      vehicleViewerState.activeDrawerId = "";
      vehicleViewerState.dirtyMedia = false;
      renderVehiclePhotoViewer(getFilteredVehicles());
    }
  } catch (error) {
    alert(error.message || "No se pudo crear el carro.");
  }
}

async function deleteSelectedVehicleQuick() {
  if (!permissions.canWriteVehicles) {
    alert("Tu rol es solo lectura. No puedes eliminar carros.");
    return;
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleViewerState.vehicleId);
  if (!selectedVehicle) {
    alert("Selecciona un carro para eliminar.");
    return;
  }

  const confirmDelete = confirm(`¿Eliminar el carro ${selectedVehicle.codigo} (${selectedVehicle.patente})?`);
  if (!confirmDelete) {
    return;
  }

  try {
    await api(`/api/vehicles/${selectedVehicle.id}`, { method: "DELETE" });
    vehicleViewerState.vehicleId = "";
    vehicleViewerState.activeDrawerId = "";
    vehicleViewerState.activeDrawerItemIndex = 0;
    vehicleViewerState.dirtyMedia = false;
    await refreshVehicles();
  } catch (error) {
    alert(error.message || "No se pudo eliminar el carro seleccionado.");
  }
}

function toggleVehicleEditorMode() {
  if (!permissions.canWriteVehicles) {
    alert("Tu rol es solo lectura. No puedes editar fotos ni hotspots.");
    return;
  }

  vehicleViewerState.editMode = !vehicleViewerState.editMode;
  vehicleEditorPanel.classList.toggle("hidden", !vehicleViewerState.editMode);
  renderVehiclePhotoViewer(getFilteredVehicles());
}

function onDrawerEditorSelectionChange() {
  vehicleViewerState.activeDrawerId = vehicleDrawerSelect.value;
  vehicleViewerState.activeDrawerItemIndex = 0;
  renderVehiclePhotoViewer(getFilteredVehicles());
}

function onDrawerItemSelectionChange() {
  vehicleViewerState.activeDrawerItemIndex = Number(vehicleDrawerItemSelect.value || 0);
  renderVehiclePhotoViewer(getFilteredVehicles());
}

function onDrawerPanelItemSelectionChange() {
  vehicleViewerState.activeDrawerItemIndex = Number(vehicleDrawerPanelItemSelect.value || 0);
  renderVehiclePhotoViewer(getFilteredVehicles());
}

function onDrawerNameInputChange() {
  if (!permissions.canWriteVehicles) {
    return;
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleViewerState.vehicleId);
  if (!selectedVehicle || !Array.isArray(selectedVehicle.drawerInventory) || !vehicleViewerState.activeDrawerId) {
    return;
  }

  const drawer = selectedVehicle.drawerInventory.find((candidate) => candidate.id === vehicleViewerState.activeDrawerId);
  if (!drawer) {
    return;
  }

  const nombre = String(vehicleDrawerNameInput.value || "").trim();
  drawer.nombre = nombre || drawer.id;
  vehicleViewerState.dirtyMedia = true;
  renderVehiclePhotoViewer(getFilteredVehicles());
}

function onCreateVehicleDrawerClick() {
  if (!permissions.canWriteVehicles) {
    alert("Tu rol es solo lectura. No puedes crear gavetas.");
    return;
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleViewerState.vehicleId);
  if (!selectedVehicle) {
    alert("Selecciona un carro para crear una gaveta.");
    return;
  }

  if (!Array.isArray(selectedVehicle.drawerInventory)) {
    selectedVehicle.drawerInventory = [];
  }

  const newDrawer = {
    id: generateNextDrawerId(selectedVehicle),
    nombre: `Nueva gaveta ${selectedVehicle.drawerInventory.length + 1}`,
    angle: vehicleViewerState.angle || "left",
    x: 50,
    y: 50,
    items: [
      {
        nombre: "Nuevo objeto",
        estado: "Pendiente",
        imagen: "logo.png",
        descripcion: "Completa la información del item principal de esta gaveta."
      }
    ]
  };

  selectedVehicle.drawerInventory.push(newDrawer);
  vehicleViewerState.activeDrawerId = newDrawer.id;
  vehicleViewerState.activeDrawerItemIndex = 0;
  vehicleViewerState.dirtyMedia = true;
  renderVehiclePhotoViewer(getFilteredVehicles());
}

function onDeleteVehicleDrawerClick() {
  if (!permissions.canWriteVehicles) {
    alert("Tu rol es solo lectura. No puedes eliminar gavetas.");
    return;
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleViewerState.vehicleId);
  if (!selectedVehicle || !Array.isArray(selectedVehicle.drawerInventory) || !vehicleViewerState.activeDrawerId) {
    alert("Selecciona una gaveta para eliminar.");
    return;
  }

  const drawer = selectedVehicle.drawerInventory.find((candidate) => candidate.id === vehicleViewerState.activeDrawerId);
  if (!drawer) {
    return;
  }

  const confirmDelete = confirm(`¿Eliminar la gaveta ${drawer.id} (${drawer.nombre})?`);
  if (!confirmDelete) {
    return;
  }

  selectedVehicle.drawerInventory = selectedVehicle.drawerInventory.filter((candidate) => candidate.id !== drawer.id);
  vehicleViewerState.activeDrawerId = "";
  vehicleViewerState.activeDrawerItemIndex = 0;
  vehicleViewerState.dirtyMedia = true;
  renderVehiclePhotoViewer(getFilteredVehicles());
}

function onCreateVehicleDrawerItemClick() {
  if (!permissions.canWriteVehicles) {
    alert("Tu rol es solo lectura. No puedes agregar ítems.");
    return;
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleViewerState.vehicleId);
  if (!selectedVehicle || !Array.isArray(selectedVehicle.drawerInventory) || !vehicleViewerState.activeDrawerId) {
    alert("Selecciona una gaveta para agregar un ítem.");
    return;
  }

  const drawer = selectedVehicle.drawerInventory.find((candidate) => candidate.id === vehicleViewerState.activeDrawerId);
  if (!drawer) {
    return;
  }

  if (!Array.isArray(drawer.items)) {
    drawer.items = normalizeDrawerItems(drawer);
  }

  drawer.items.push({
    nombre: `Nuevo objeto ${drawer.items.length + 1}`,
    estado: "Pendiente",
    imagen: "logo.png",
    descripcion: "Completa la información de este ítem."
  });

  vehicleViewerState.activeDrawerItemIndex = drawer.items.length - 1;
  vehicleViewerState.dirtyMedia = true;
  renderVehiclePhotoViewer(getFilteredVehicles());
}

function onDeleteVehicleDrawerItemClick() {
  if (!permissions.canWriteVehicles) {
    alert("Tu rol es solo lectura. No puedes eliminar ítems.");
    return;
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleViewerState.vehicleId);
  if (!selectedVehicle || !Array.isArray(selectedVehicle.drawerInventory) || !vehicleViewerState.activeDrawerId) {
    alert("Selecciona una gaveta para eliminar un ítem.");
    return;
  }

  const drawer = selectedVehicle.drawerInventory.find((candidate) => candidate.id === vehicleViewerState.activeDrawerId);
  if (!drawer) {
    return;
  }

  if (!Array.isArray(drawer.items)) {
    drawer.items = normalizeDrawerItems(drawer);
  }

  if (drawer.items.length <= 1) {
    alert("Cada gaveta debe tener al menos un ítem.");
    return;
  }

  const currentItem = drawer.items[vehicleViewerState.activeDrawerItemIndex] || drawer.items[0];
  const confirmDelete = confirm(`¿Eliminar el ítem ${currentItem?.nombre || "seleccionado"}?`);
  if (!confirmDelete) {
    return;
  }

  drawer.items.splice(vehicleViewerState.activeDrawerItemIndex, 1);
  if (vehicleViewerState.activeDrawerItemIndex >= drawer.items.length) {
    vehicleViewerState.activeDrawerItemIndex = drawer.items.length - 1;
  }

  vehicleViewerState.dirtyMedia = true;
  renderVehiclePhotoViewer(getFilteredVehicles());
}

function onDrawerItemInputChange() {
  if (!permissions.canWriteVehicles) {
    return;
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleViewerState.vehicleId);
  if (!selectedVehicle || !Array.isArray(selectedVehicle.drawerInventory) || !vehicleViewerState.activeDrawerId) {
    return;
  }

  const drawer = selectedVehicle.drawerInventory.find((candidate) => candidate.id === vehicleViewerState.activeDrawerId);
  if (!drawer) {
    return;
  }

  if (!Array.isArray(drawer.items)) {
    drawer.items = normalizeDrawerItems(drawer);
  }

  if (vehicleViewerState.activeDrawerItemIndex >= drawer.items.length) {
    vehicleViewerState.activeDrawerItemIndex = 0;
  }

  if (!drawer.items[vehicleViewerState.activeDrawerItemIndex]) {
    drawer.items[vehicleViewerState.activeDrawerItemIndex] = {
      nombre: "Nuevo objeto",
      estado: "Pendiente",
      imagen: "logo.png",
      descripcion: ""
    };
  }

  const activeItem = drawer.items[vehicleViewerState.activeDrawerItemIndex];

  activeItem.nombre = String(vehicleDrawerItemNameInput.value || "").trim();
  activeItem.estado = String(vehicleDrawerItemStatusInput.value || "").trim();
  activeItem.imagen = String(vehicleDrawerItemImageInput.value || "").trim() || "logo.png";
  activeItem.descripcion = String(vehicleDrawerItemDescriptionInput.value || "").trim();
  vehicleViewerState.dirtyMedia = true;

  renderVehiclePhotoViewer(getFilteredVehicles());
}

function onVehicleHotspotPointerDown(event, drawerId) {
  if (!vehicleViewerState.editMode || !permissions.canWriteVehicles) {
    return;
  }

  event.preventDefault();
  vehicleViewerState.draggingDrawerId = drawerId;
  vehicleViewerState.dragActive = true;
  vehicleViewerState.activeDrawerId = drawerId;

  const target = event.currentTarget;
  if (target && typeof target.setPointerCapture === "function") {
    try {
      target.setPointerCapture(event.pointerId);
    } catch {
      // Ignora si el navegador no permite capturar el puntero.
    }
  }
}

function onVehicleHotspotPointerMove(event) {
  if (!vehicleViewerState.dragActive || !vehicleViewerState.draggingDrawerId) {
    return;
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleViewerState.vehicleId);
  if (!selectedVehicle || !Array.isArray(selectedVehicle.drawerInventory)) {
    return;
  }

  const drawer = selectedVehicle.drawerInventory.find((candidate) => candidate.id === vehicleViewerState.draggingDrawerId);
  if (!drawer) {
    return;
  }

  const bounds = vehiclePhotoStage.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) {
    return;
  }

  const x = clamp(((event.clientX - bounds.left) / bounds.width) * 100, 0, 100);
  const y = clamp(((event.clientY - bounds.top) / bounds.height) * 100, 0, 100);

  drawer.x = x;
  drawer.y = y;
  vehicleViewerState.dirtyMedia = true;

  const hotspot = vehicleHotspotsLayer.querySelector(`[data-drawer-id="${drawer.id}"]`);
  if (hotspot) {
    hotspot.style.left = `${x}%`;
    hotspot.style.top = `${y}%`;
  }

  vehicleDrawerXRange.value = String(Math.round(x));
  vehicleDrawerYRange.value = String(Math.round(y));
  vehicleDrawerCoordsLabel.textContent = `Coordenadas de ${drawer.id}: X ${Math.round(x)}% / Y ${Math.round(y)}%`;
}

function onVehicleHotspotPointerUp() {
  if (!vehicleViewerState.dragActive) {
    return;
  }

  vehicleViewerState.draggingDrawerId = "";
  vehicleViewerState.dragActive = false;
  renderVehiclePhotoViewer(getFilteredVehicles());
}

function validateVehicleViewerData(vehicle) {
  const errors = [];

  if (!vehicle || !Array.isArray(vehicle.drawerInventory)) {
    return ["No hay datos de gavetas para validar."];
  }

  const ids = new Set();
  vehicle.drawerInventory.forEach((drawer) => {
    const drawerId = String(drawer?.id || "").trim();
    if (!drawerId) {
      errors.push("Existe una gaveta sin identificador.");
      return;
    }

    const key = drawerId.toLowerCase();
    if (ids.has(key)) {
      errors.push(`ID duplicado de gaveta: ${drawerId}.`);
    }
    ids.add(key);

    const nombre = String(drawer?.nombre || "").trim();
    if (!nombre) {
      errors.push(`La gaveta ${drawerId} no tiene nombre.`);
    }

    const items = normalizeDrawerItems(drawer);
    if (items.length < 1) {
      errors.push(`La gaveta ${drawerId} debe tener al menos un ítem.`);
      return;
    }

    const invalidItem = items.find((item) => {
      const itemNombre = String(item?.nombre || "").trim();
      const itemEstado = String(item?.estado || "").trim();
      const itemDescripcion = String(item?.descripcion || "").trim();
      return !itemNombre || !itemEstado || !itemDescripcion;
    });

    if (invalidItem) {
      errors.push(`La gaveta ${drawerId} tiene un ítem incompleto (nombre, estado y descripción son obligatorios).`);
    }
  });

  return errors;
}

function generateNextDrawerId(vehicle) {
  const code = String(vehicle?.codigo || "CARRO").toUpperCase().replace(/\s+/g, "-");
  const existing = new Set(
    (Array.isArray(vehicle?.drawerInventory) ? vehicle.drawerInventory : [])
      .map((drawer) => String(drawer?.id || "").trim().toUpperCase())
      .filter(Boolean)
  );

  for (let i = 1; i <= 999; i += 1) {
    const candidate = `${code}-G${String(i).padStart(2, "0")}`;
    if (!existing.has(candidate)) {
      return candidate;
    }
  }

  return `${code}-G${Date.now()}`;
}

function onDrawerCoordinateRangeInput() {
  if (!permissions.canWriteVehicles) {
    return;
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleViewerState.vehicleId);
  if (!selectedVehicle || !Array.isArray(selectedVehicle.drawerInventory) || !vehicleViewerState.activeDrawerId) {
    return;
  }

  const drawer = selectedVehicle.drawerInventory.find((candidate) => candidate.id === vehicleViewerState.activeDrawerId);
  if (!drawer) {
    return;
  }

  drawer.x = clamp(Number(vehicleDrawerXRange.value), 0, 100);
  drawer.y = clamp(Number(vehicleDrawerYRange.value), 0, 100);
  vehicleViewerState.dirtyMedia = true;
  renderVehiclePhotoViewer(getFilteredVehicles());
}

function onVehiclePhotoStageClick(event) {
  if (!vehicleViewerState.editMode || !permissions.canWriteVehicles) {
    return;
  }

  if (!vehicleViewerState.activeDrawerId) {
    return;
  }

  if (event.target.closest(".vehicle-hotspot")) {
    return;
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleViewerState.vehicleId);
  if (!selectedVehicle || !Array.isArray(selectedVehicle.drawerInventory)) {
    return;
  }

  const drawer = selectedVehicle.drawerInventory.find((candidate) => candidate.id === vehicleViewerState.activeDrawerId);
  if (!drawer) {
    return;
  }

  const bounds = vehiclePhotoStage.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) {
    return;
  }

  const x = ((event.clientX - bounds.left) / bounds.width) * 100;
  const y = ((event.clientY - bounds.top) / bounds.height) * 100;

  drawer.x = clamp(x, 0, 100);
  drawer.y = clamp(y, 0, 100);
  vehicleViewerState.dirtyMedia = true;
  renderVehiclePhotoViewer(getFilteredVehicles());
}

function onPhotoInputChange(angle, value) {
  if (!permissions.canWriteVehicles) {
    return;
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleViewerState.vehicleId);
  if (!selectedVehicle) {
    return;
  }

  const gallery = ensureVehicleGallery(selectedVehicle);
  const target = gallery.find((entry) => entry.angle === angle);
  if (!target) {
    return;
  }

  const trimmed = String(value || "").trim();
  target.image = trimmed || FALLBACK_VEHICLE_PHOTO_BY_ANGLE[angle];
  vehicleViewerState.dirtyMedia = true;
  renderVehiclePhotoViewer(getFilteredVehicles());
}

function onPhotoFileChange(angle, inputElement) {
  if (!permissions.canWriteVehicles) {
    return;
  }

  const file = inputElement?.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    onPhotoInputChange(angle, String(reader.result || ""));
    inputElement.value = "";
  };
  reader.onerror = () => {
    alert("No se pudo leer el archivo de imagen seleccionado.");
  };
  reader.readAsDataURL(file);
}

function ensureVehicleGallery(vehicle) {
  if (!Array.isArray(vehicle.photoGallery)) {
    vehicle.photoGallery = [];
  }

  const required = [
    { angle: "left", label: "Lado izquierdo", image: FALLBACK_VEHICLE_PHOTO_BY_ANGLE.left },
    { angle: "right", label: "Lado derecho", image: FALLBACK_VEHICLE_PHOTO_BY_ANGLE.right },
    { angle: "rear", label: "Parte trasera", image: FALLBACK_VEHICLE_PHOTO_BY_ANGLE.rear }
  ];

  required.forEach((def) => {
    const existing = vehicle.photoGallery.find((entry) => String(entry?.angle || "").toLowerCase() === def.angle);
    if (!existing) {
      vehicle.photoGallery.push({ ...def });
    } else {
      existing.angle = def.angle;
      existing.label = existing.label || def.label;
      existing.image = String(existing.image || def.image).trim();
    }
  });

  vehicle.photoGallery = vehicle.photoGallery.filter((entry) => ["left", "right", "rear"].includes(String(entry?.angle || "").toLowerCase()));
  return vehicle.photoGallery;
}

function buildVehicleUpdatePayload(vehicle) {
  return {
    nombre: getVehicleDisplayName(vehicle),
    codigo: String(vehicle.codigo || "").trim(),
    patente: String(vehicle.patente || "").trim(),
    marcaModelo: String(vehicle.marcaModelo || "").trim(),
    anio: Number(vehicle.anio || 0),
    kilometraje: Number(vehicle.kilometraje || 0),
    estadoOperativo: String(vehicle.estadoOperativo || "").trim(),
    ultimaMantencion: String(vehicle.ultimaMantencion || "").trim(),
    proximaMantencionKm: Number(vehicle.proximaMantencionKm || 0),
    revisionTecnicaVencimiento: String(vehicle.revisionTecnicaVencimiento || "").trim(),
    observaciones: String(vehicle.observaciones || "").trim(),
    photoGallery: ensureVehicleGallery(vehicle),
    drawerInventory: sanitizeDrawerInventoryForSave(Array.isArray(vehicle.drawerInventory) ? vehicle.drawerInventory : [])
  };
}

function sanitizeDrawerInventoryForSave(drawers) {
  return drawers.map((drawer) => ({
    id: String(drawer?.id || "").trim(),
    nombre: String(drawer?.nombre || "").trim(),
    angle: String(drawer?.angle || "").trim().toLowerCase(),
    x: clamp(Number(drawer?.x), 0, 100),
    y: clamp(Number(drawer?.y), 0, 100),
    items: normalizeDrawerItems(drawer)
  }));
}

async function saveVehicleViewerChanges() {
  if (!permissions.canWriteVehicles) {
    alert("Tu rol es solo lectura. No puedes guardar cambios del visor.");
    return;
  }

  if (!vehicleViewerState.dirtyMedia || vehicleViewerState.isSavingMedia) {
    return;
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleViewerState.vehicleId);
  if (!selectedVehicle) {
    alert("No hay carro seleccionado para guardar cambios.");
    return;
  }

  const validationErrors = validateVehicleViewerData(selectedVehicle);
  if (validationErrors.length > 0) {
    vehicleEditorValidation.textContent = validationErrors[0];
    vehicleEditorValidation.classList.remove("hidden");
    vehicleMediaStatus.textContent = `Validación: ${validationErrors[0]}`;
    return;
  }

  vehicleEditorValidation.textContent = "";
  vehicleEditorValidation.classList.add("hidden");

  vehicleViewerState.isSavingMedia = true;
  renderVehiclePhotoViewer(getFilteredVehicles());

  try {
    await api(`/api/vehicles/${selectedVehicle.id}`, {
      method: "PUT",
      body: buildVehicleUpdatePayload(selectedVehicle)
    });
    vehicleViewerState.dirtyMedia = false;
    await refreshVehicles();
  } catch (error) {
    alert(error.message || "No se pudieron guardar las fotos y hotspots del carro.");
  } finally {
    vehicleViewerState.isSavingMedia = false;
    renderVehiclePhotoViewer(getFilteredVehicles());
  }
}

function openVehicleDrawerPanel(drawer) {
  if (!vehicleDrawerPanel) {
    return;
  }

  const items = Array.isArray(drawer?.items) ? drawer.items : normalizeDrawerItems(drawer);
  if (vehicleViewerState.activeDrawerItemIndex >= items.length) {
    vehicleViewerState.activeDrawerItemIndex = 0;
  }
  const activeItem = items[vehicleViewerState.activeDrawerItemIndex] || items[0];

  vehicleDrawerPanel.classList.remove("hidden");
  vehicleDrawerTitle.textContent = drawer.nombre || drawer.id;
  vehicleDrawerItemsCount.textContent = `Items: ${items.length}`;
  vehicleDrawerPanelItemSelect.innerHTML = "";
  items.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${index + 1}. ${item.nombre}`;
    vehicleDrawerPanelItemSelect.appendChild(option);
  });
  vehicleDrawerPanelItemSelect.value = String(vehicleViewerState.activeDrawerItemIndex);
  vehicleDrawerStatus.textContent = `Estado: ${activeItem?.estado || "Sin estado"}`;
  vehicleDrawerItemName.textContent = activeItem?.nombre || "Sin item asignado";
  vehicleDrawerItemDescription.textContent = activeItem?.descripcion || "Sin descripción.";
  vehicleDrawerItemImage.src = activeItem?.imagen || "logo.png";
  vehicleDrawerItemImage.alt = `Imagen del objeto ${activeItem?.nombre || "sin item"}`;
}

function closeVehicleDrawerPanel() {
  if (!vehicleDrawerPanel) {
    return;
  }

  vehicleViewerState.activeDrawerId = "";
  vehicleViewerState.activeDrawerItemIndex = 0;
  vehicleDrawerPanel.classList.add("hidden");
  vehicleDrawerTitle.textContent = "-";
  vehicleDrawerItemsCount.textContent = "Items: 0";
  vehicleDrawerPanelItemSelect.innerHTML = "";
  vehicleDrawerStatus.textContent = "Estado: -";
  vehicleDrawerItemName.textContent = "-";
  vehicleDrawerItemDescription.textContent = "-";
  vehicleDrawerItemImage.src = "logo.png";
  vehicleDrawerItemImage.alt = "Imagen del objeto en la gaveta";
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.max(min, Math.min(max, value));
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
  vehiclesForm.nombre.value = getVehicleDisplayName(vehicle);
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
    nombre: String(formData.get("nombre") || "").trim(),
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

  const currentVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId.value);
  if (currentVehicle) {
    payload.photoGallery = Array.isArray(currentVehicle.photoGallery) ? currentVehicle.photoGallery : [];
    payload.drawerInventory = Array.isArray(currentVehicle.drawerInventory) ? currentVehicle.drawerInventory : [];
  }

  if (!payload.proximaMantencionKm) {
    payload.proximaMantencionKm = 0;
  }

  if (!payload.nombre || !payload.codigo || !payload.patente || !payload.marcaModelo || !payload.anio || !payload.estadoOperativo) {
    alert("Completa nombre, codigo, patente, marca/modelo, año y estado operativo.");
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
  const expiry = uniformsFilterExpiry ? uniformsFilterExpiry.value : "Todos";

  return uniforms.filter((record) => {
    const matchesMovement = movement === "Todos" || record.tipoMovimiento === movement;
    const matchesStatus = status === "Todos" || record.estadoPrenda === status;
    const expiryLevel = getDateAlertLevel(record.fechaVencimiento, 30);
    const matchesExpiry =
      expiry === "Todos" ||
      (expiry === "Vencido" && expiryLevel === "expired") ||
      (expiry === "PorVencer" && expiryLevel === "soon") ||
      (expiry === "AlDia" && expiryLevel === "none" && Boolean(record.fechaVencimiento)) ||
      (expiry === "SinFecha" && !record.fechaVencimiento);
    const haystack = `${record.codigoVestimenta || ""} ${record.voluntarioNombre || ""} ${record.prenda || ""} ${record.talla || ""} ${record.fechaMantencion || ""} ${record.revisionTecnicaVencimiento || ""} ${record.observaciones || ""}`.toLowerCase();
    const matchesTerm = !term || haystack.includes(term);
    return matchesMovement && matchesStatus && matchesExpiry && matchesTerm;
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
      <td>${escapeHtml(record.codigoVestimenta || "-")}</td>
      <td>${escapeHtml(record.voluntarioNombre)}</td>
      <td>${escapeHtml(record.prenda)}</td>
      <td>${escapeHtml(record.talla)}</td>
      <td>${escapeHtml(String(record.cantidad))}</td>
      <td>${escapeHtml(record.tipoMovimiento)}</td>
      <td class="${getUniformStatusClass(record.estadoPrenda)}">${escapeHtml(record.estadoPrenda)}</td>
      <td>${escapeHtml(formatDate(record.fechaMovimiento))}</td>
      <td>${escapeHtml(formatDate(record.fechaVencimiento))}</td>
      <td>${escapeHtml(formatDate(record.fechaMantencion))}</td>
      <td>${escapeHtml(formatDate(record.revisionTecnicaVencimiento))}</td>
      <td><span class="alert-pill ${alertData.className}">${escapeHtml(alertData.label)}</span></td>
      <td>${escapeHtml(record.observaciones || "-")}</td>
      <td>${escapeHtml(formatDateTime(record.actualizadoEn))}</td>
      <td>${escapeHtml(record.actualizadoPor || "-")}</td>
      <td class="actions-cell"></td>
    `;

    applyCellLabels(tr, ["Codigo", "Voluntario", "Prenda", "Talla", "Cantidad", "Movimiento", "Estado", "Fecha", "Vencimiento", "Mantencion", "Revision tecnica", "Alertas", "Observaciones", "Actualizado", "Por", "Acciones"]);

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

  const maintenanceLevel = getDateAlertLevel(record.fechaMantencion, 7);
  if (maintenanceLevel === "expired") {
    alerts.push("Mantencion vencida");
    level = "high";
  } else if (maintenanceLevel === "soon") {
    alerts.push("Mantencion <= 7 dias");
    if (level !== "high") {
      level = "medium";
    }
  }

  const reviewLevel = getDateAlertLevel(record.revisionTecnicaVencimiento, 30);
  if (reviewLevel === "expired") {
    alerts.push("Rev. tecnica vencida");
    level = "high";
  } else if (reviewLevel === "soon") {
    alerts.push("Rev. tecnica <= 30 dias");
    if (level !== "high") {
      level = "medium";
    }
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

  if (!record.fechaVencimiento) {
    alerts.push("Sin fecha vencimiento");
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

function getCertificationAlertData(course) {
  const expiryLevel = getExpirationLevel(course?.fechaVencimientoCertificacion);

  if (expiryLevel === "expired") {
    return { label: "Vencida", className: "alert-high" };
  }

  if (expiryLevel === "urgent") {
    return { label: "Por vencer (30 dias)", className: "alert-medium" };
  }

  if (!course?.fechaVencimientoCertificacion) {
    return { label: "Sin fecha", className: "alert-none" };
  }

  return { label: "Vigente", className: "alert-none" };
}

function startEditUniform(id) {
  const record = uniforms.find((candidate) => candidate.id === id);
  if (!record) {
    return;
  }

  uniformRecordId.value = record.id;
  uniformsForm.codigoVestimenta.value = record.codigoVestimenta || "";
  uniformsForm.voluntarioNombre.value = record.voluntarioNombre || "";
  uniformsForm.prenda.value = record.prenda || "";
  uniformsForm.talla.value = record.talla || "";
  uniformsForm.cantidad.value = record.cantidad || 1;
  uniformsForm.tipoMovimiento.value = record.tipoMovimiento || "Entrega";
  uniformsForm.estadoPrenda.value = record.estadoPrenda || "En Uso";
  uniformsForm.fechaMovimiento.value = record.fechaMovimiento || "";
  uniformsForm.fechaVencimiento.value = record.fechaVencimiento || "";
  uniformsForm.fechaMantencion.value = record.fechaMantencion || "";
  uniformsForm.revisionTecnicaVencimiento.value = record.revisionTecnicaVencimiento || "";
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
    codigoVestimenta: String(formData.get("codigoVestimenta") || "").trim().toUpperCase(),
    voluntarioNombre: String(formData.get("voluntarioNombre") || "").trim(),
    prenda: String(formData.get("prenda") || "").trim(),
    talla: String(formData.get("talla") || "").trim().toUpperCase(),
    cantidad: Number(formData.get("cantidad") || 0),
    tipoMovimiento: String(formData.get("tipoMovimiento") || "").trim(),
    estadoPrenda: String(formData.get("estadoPrenda") || "").trim(),
    fechaMovimiento: String(formData.get("fechaMovimiento") || "").trim(),
    fechaVencimiento: String(formData.get("fechaVencimiento") || "").trim(),
    fechaMantencion: String(formData.get("fechaMantencion") || "").trim(),
    revisionTecnicaVencimiento: String(formData.get("revisionTecnicaVencimiento") || "").trim(),
    observaciones: String(formData.get("observaciones") || "").trim()
  };

  if (!payload.codigoVestimenta || !payload.voluntarioNombre || !payload.prenda || !payload.talla || payload.cantidad < 1 || !payload.tipoMovimiento || !payload.estadoPrenda || !payload.fechaMovimiento) {
    alert("Completa codigo, voluntario, prenda, talla, cantidad, movimiento, estado y fecha del movimiento.");
    return;
  }

  if (payload.tipoMovimiento === "Entrega" && !payload.fechaVencimiento) {
    alert("Para una entrega debes registrar fecha de vencimiento.");
    return;
  }

  if (payload.estadoPrenda === "En Reparacion" && !payload.fechaMantencion) {
    alert("Si la prenda esta en reparacion debes registrar la fecha de mantencion.");
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
  uniformsForm.codigoVestimenta.value = "";
  uniformsForm.tipoMovimiento.value = "Entrega";
  uniformsForm.estadoPrenda.value = "En Uso";
  uniformsForm.fechaMovimiento.value = new Date().toISOString().slice(0, 10);
  uniformsForm.fechaMantencion.value = "";
  uniformsForm.revisionTecnicaVencimiento.value = "";
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

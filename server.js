const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const PDFDocument = require("pdfkit");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, "data", "db.json");
const DAY_ORDERS_UPLOAD_DIR = path.join(__dirname, "uploads", "day-orders");
const MEDICAL_SECRET = process.env.MEDICAL_SECRET || "inv-cuarta-medical-default-secret-change-me";
const MEDICAL_KEY = crypto.scryptSync(MEDICAL_SECRET, "medical-records-salt", 32);

const dayOrdersPdfUpload = multer({
  storage: multer.diskStorage({
    destination: (req, _file, cb) => {
      const companyId = String(req?.user?.companyId || "company-default").trim();
      const targetDir = path.join(DAY_ORDERS_UPLOAD_DIR, companyId);
      fs.mkdirSync(targetDir, { recursive: true });
      cb(null, targetDir);
    },
    filename: (_req, file, cb) => {
      const safeBase = String(path.parse(file.originalname || "orden-dia").name || "orden-dia")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 70);
      const stamp = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      cb(null, `${stamp}-${safeBase}.pdf`);
    }
  }),
  fileFilter: (_req, file, cb) => {
    const mimetype = String(file?.mimetype || "").toLowerCase();
    const originalName = String(file?.originalname || "").toLowerCase();
    const isPdfMime = mimetype === "application/pdf" || mimetype === "application/x-pdf";
    const isPdfByName = originalName.endsWith(".pdf");
    if (!isPdfMime && !isPdfByName) {
      cb(new Error("Solo se permiten archivos PDF."));
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

const sessions = new Map();

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Usuario y clave son obligatorios." });
  }

  const db = readDb();
  const user = db.users.find((candidate) => candidate.username === username.trim());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Credenciales inválidas." });
  }

  if (user.blocked) {
    return res.status(403).json({ error: "Usuario bloqueado. Contacta a un administrador." });
  }

  user.lastLoginAt = new Date().toISOString();
  writeDb(db);

  const token = crypto.randomUUID();
  sessions.set(token, {
    userId: user.id,
    username: user.username,
    role: user.role,
    createdAt: Date.now()
  });

  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      nombre: user.nombre,
      blocked: Boolean(user.blocked),
      email: user.email || "",
      phone: user.phone || "",
      lastLoginAt: user.lastLoginAt || "",
      modulePermissions: user.modulePermissions || {}
    }
  });
});

app.post("/api/logout", authRequired, (req, res) => {
  sessions.delete(req.token);
  res.json({ ok: true });
});

app.get("/api/me", authRequired, (req, res) => {
  res.json({ user: req.user, permissions: getPermissions(req.user.role, req.user.modulePermissions) });
});

app.get("/api/inventory", authRequired, (req, res) => {
  const db = readDb();
  const companyItems = db.inventory.filter((item) => item.companyId === req.user.companyId);
  res.json({ items: companyItems });
});

app.get("/api/guard-book", authRequired, (req, res) => {
  const db = readDb();
  const query = {
    turno: String(req.query.turno || "").trim(),
    tipo: String(req.query.tipo || "").trim(),
    q: String(req.query.q || "").trim().toLowerCase(),
    from: String(req.query.from || "").trim(),
    to: String(req.query.to || "").trim()
  };

  let entries = db.guardBook.filter((entry) => entry.companyId === req.user.companyId);

  if (query.turno) {
    entries = entries.filter((entry) => entry.turno === query.turno);
  }

  if (query.tipo) {
    entries = entries.filter((entry) => entry.tipo === query.tipo);
  }

  if (query.q) {
    entries = entries.filter((entry) => {
      const haystack = `${entry.descripcion} ${entry.recurso || ""} ${entry.autorNombre || ""}`.toLowerCase();
      return haystack.includes(query.q);
    });
  }

  if (query.from) {
    entries = entries.filter((entry) => entry.fechaTurno >= query.from);
  }

  if (query.to) {
    entries = entries.filter((entry) => entry.fechaTurno <= query.to);
  }

  entries.sort((a, b) => {
    if (a.fechaTurno !== b.fechaTurno) {
      return a.fechaTurno < b.fechaTurno ? 1 : -1;
    }
    return a.creadoEn < b.creadoEn ? 1 : -1;
  });

  res.json({ entries });
});

app.post("/api/guard-book", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteGuardBook")) {
    return res.status(403).json({ error: "No tienes permiso para registrar novedades." });
  }

  const payload = sanitizeGuardEntry(req.body || {});
  if (!payload.ok) {
    return res.status(400).json({ error: payload.error });
  }

  const db = readDb();
  const entry = {
    id: crypto.randomUUID(),
    companyId: req.user.companyId,
    fechaTurno: payload.fechaTurno,
    turno: payload.turno,
    tipo: payload.tipo,
    descripcion: payload.descripcion,
    recurso: payload.recurso,
    autorId: req.user.id,
    autorNombre: req.user.nombre,
    creadoEn: new Date().toISOString()
  };

  db.guardBook.push(entry);
  writeDb(db);

  res.status(201).json({ entry });
});

app.get("/api/medical-records", authRequired, (req, res) => {
  const db = readDb();
  const query = String(req.query.q || "").trim().toLowerCase();

  let records = db.medicalRecords.filter((record) => record.companyId === req.user.companyId);

  if (query) {
    records = records.filter((record) => {
      const name = String(record.voluntarioNombre || "").toLowerCase();
      const blood = String(record.grupoSanguineo || "").toLowerCase();
      return name.includes(query) || blood.includes(query);
    });
  }

  records.sort((a, b) => (a.actualizadoEn < b.actualizadoEn ? 1 : -1));

  const safeRecords = records.map((record) => ({
    id: record.id,
    voluntarioNombre: record.voluntarioNombre,
    grupoSanguineo: record.grupoSanguineo,
    alergias: decryptMedicalValue(record.alergiasEnc),
    enfermedades: decryptMedicalValue(record.enfermedadesEnc),
    medicamentos: decryptMedicalValue(record.medicamentosEnc),
    contactoEmergenciaNombre: decryptMedicalValue(record.contactoEmergenciaNombreEnc),
    contactoEmergenciaTelefono: decryptMedicalValue(record.contactoEmergenciaTelefonoEnc),
    contactoEmergenciaRelacion: decryptMedicalValue(record.contactoEmergenciaRelacionEnc),
    actualizadoEn: record.actualizadoEn,
    actualizadoPor: record.actualizadoPor || "-"
  }));

  res.json({ records: safeRecords });
});

app.post("/api/medical-records", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteMedicalRecords")) {
    return res.status(403).json({ error: "No tienes permiso para registrar fichas medicas." });
  }

  const payload = sanitizeMedicalRecord(req.body || {});
  if (!payload.ok) {
    return res.status(400).json({ error: payload.error });
  }

  const db = readDb();
  const now = new Date().toISOString();
  const record = {
    id: crypto.randomUUID(),
    companyId: req.user.companyId,
    voluntarioNombre: payload.voluntarioNombre,
    grupoSanguineo: payload.grupoSanguineo,
    alergiasEnc: encryptMedicalValue(payload.alergias),
    enfermedadesEnc: encryptMedicalValue(payload.enfermedades),
    medicamentosEnc: encryptMedicalValue(payload.medicamentos),
    contactoEmergenciaNombreEnc: encryptMedicalValue(payload.contactoEmergenciaNombre),
    contactoEmergenciaTelefonoEnc: encryptMedicalValue(payload.contactoEmergenciaTelefono),
    contactoEmergenciaRelacionEnc: encryptMedicalValue(payload.contactoEmergenciaRelacion),
    actualizadoEn: now,
    actualizadoPor: req.user.nombre
  };

  db.medicalRecords.push(record);
  writeDb(db);

  res.status(201).json({
    record: {
      id: record.id,
      voluntarioNombre: record.voluntarioNombre,
      grupoSanguineo: record.grupoSanguineo,
      alergias: payload.alergias,
      enfermedades: payload.enfermedades,
      medicamentos: payload.medicamentos,
      contactoEmergenciaNombre: payload.contactoEmergenciaNombre,
      contactoEmergenciaTelefono: payload.contactoEmergenciaTelefono,
      contactoEmergenciaRelacion: payload.contactoEmergenciaRelacion,
      actualizadoEn: record.actualizadoEn,
      actualizadoPor: record.actualizadoPor
    }
  });
});

app.put("/api/medical-records/:id", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteMedicalRecords")) {
    return res.status(403).json({ error: "No tienes permiso para editar fichas medicas." });
  }

  const payload = sanitizeMedicalRecord(req.body || {});
  if (!payload.ok) {
    return res.status(400).json({ error: payload.error });
  }

  const db = readDb();
  const index = db.medicalRecords.findIndex(
    (record) => record.id === req.params.id && record.companyId === req.user.companyId
  );

  if (index < 0) {
    return res.status(404).json({ error: "Ficha medica no encontrada." });
  }

  const current = db.medicalRecords[index];
  const updated = {
    ...current,
    voluntarioNombre: payload.voluntarioNombre,
    grupoSanguineo: payload.grupoSanguineo,
    alergiasEnc: encryptMedicalValue(payload.alergias),
    enfermedadesEnc: encryptMedicalValue(payload.enfermedades),
    medicamentosEnc: encryptMedicalValue(payload.medicamentos),
    contactoEmergenciaNombreEnc: encryptMedicalValue(payload.contactoEmergenciaNombre),
    contactoEmergenciaTelefonoEnc: encryptMedicalValue(payload.contactoEmergenciaTelefono),
    contactoEmergenciaRelacionEnc: encryptMedicalValue(payload.contactoEmergenciaRelacion),
    actualizadoEn: new Date().toISOString(),
    actualizadoPor: req.user.nombre
  };

  db.medicalRecords[index] = updated;
  writeDb(db);

  res.json({
    record: {
      id: updated.id,
      voluntarioNombre: updated.voluntarioNombre,
      grupoSanguineo: updated.grupoSanguineo,
      alergias: payload.alergias,
      enfermedades: payload.enfermedades,
      medicamentos: payload.medicamentos,
      contactoEmergenciaNombre: payload.contactoEmergenciaNombre,
      contactoEmergenciaTelefono: payload.contactoEmergenciaTelefono,
      contactoEmergenciaRelacion: payload.contactoEmergenciaRelacion,
      actualizadoEn: updated.actualizadoEn,
      actualizadoPor: updated.actualizadoPor
    }
  });
});

app.delete("/api/medical-records/:id", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteMedicalRecords")) {
    return res.status(403).json({ error: "No tienes permiso para eliminar fichas medicas." });
  }

  const db = readDb();
  const before = db.medicalRecords.length;
  db.medicalRecords = db.medicalRecords.filter(
    (record) => !(record.id === req.params.id && record.companyId === req.user.companyId)
  );

  if (db.medicalRecords.length === before) {
    return res.status(404).json({ error: "Ficha medica no encontrada." });
  }

  writeDb(db);
  return res.json({ ok: true });
});

app.get("/api/volunteer-courses", authRequired, (req, res) => {
  const db = readDb();
  const query = String(req.query.q || "").trim().toLowerCase();

  let courses = db.volunteerCourses.filter((course) => course.companyId === req.user.companyId);

  if (query) {
    courses = courses.filter((course) => {
      const haystack = `${course.voluntarioNombre || ""} ${course.curso || ""} ${course.institucion || ""} ${course.certificacion || ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  courses.sort((a, b) => {
    if (a.fechaInicio !== b.fechaInicio) {
      return a.fechaInicio < b.fechaInicio ? 1 : -1;
    }
    return a.actualizadoEn < b.actualizadoEn ? 1 : -1;
  });

  res.json({ courses });
});

app.post("/api/volunteer-courses", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteVolunteerCourses")) {
    return res.status(403).json({ error: "No tienes permiso para registrar cursos." });
  }

  const payload = sanitizeVolunteerCourse(req.body || {});
  if (!payload.ok) {
    return res.status(400).json({ error: payload.error });
  }

  const db = readDb();
  const course = {
    id: crypto.randomUUID(),
    companyId: req.user.companyId,
    voluntarioNombre: payload.voluntarioNombre,
    curso: payload.curso,
    institucion: payload.institucion,
    fechaInicio: payload.fechaInicio,
    fechaFin: payload.fechaFin,
    certificacion: payload.certificacion,
    horasCapacitacion: payload.horasCapacitacion,
    actualizadoEn: new Date().toISOString(),
    actualizadoPor: req.user.nombre
  };

  db.volunteerCourses.push(course);
  writeDb(db);

  res.status(201).json({ course });
});

app.put("/api/volunteer-courses/:id", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteVolunteerCourses")) {
    return res.status(403).json({ error: "No tienes permiso para editar cursos." });
  }

  const payload = sanitizeVolunteerCourse(req.body || {});
  if (!payload.ok) {
    return res.status(400).json({ error: payload.error });
  }

  const db = readDb();
  const index = db.volunteerCourses.findIndex(
    (course) => course.id === req.params.id && course.companyId === req.user.companyId
  );

  if (index < 0) {
    return res.status(404).json({ error: "Curso no encontrado." });
  }

  const updated = {
    ...db.volunteerCourses[index],
    voluntarioNombre: payload.voluntarioNombre,
    curso: payload.curso,
    institucion: payload.institucion,
    fechaInicio: payload.fechaInicio,
    fechaFin: payload.fechaFin,
    certificacion: payload.certificacion,
    horasCapacitacion: payload.horasCapacitacion,
    actualizadoEn: new Date().toISOString(),
    actualizadoPor: req.user.nombre
  };

  db.volunteerCourses[index] = updated;
  writeDb(db);

  res.json({ course: updated });
});

app.delete("/api/volunteer-courses/:id", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteVolunteerCourses")) {
    return res.status(403).json({ error: "No tienes permiso para eliminar cursos." });
  }

  const db = readDb();
  const before = db.volunteerCourses.length;
  db.volunteerCourses = db.volunteerCourses.filter(
    (course) => !(course.id === req.params.id && course.companyId === req.user.companyId)
  );

  if (db.volunteerCourses.length === before) {
    return res.status(404).json({ error: "Curso no encontrado." });
  }

  writeDb(db);
  return res.json({ ok: true });
});

app.get("/api/day-orders", authRequired, (req, res) => {
  const db = readDb();
  const query = {
    tipo: String(req.query.tipo || "").trim(),
    q: String(req.query.q || "").trim().toLowerCase()
  };

  let orders = db.dayOrders.filter((order) => order.companyId === req.user.companyId);

  if (query.tipo) {
    orders = orders.filter((order) => order.tipo === query.tipo);
  }

  if (query.q) {
    orders = orders.filter((order) => {
      const haystack = `${order.titulo || ""} ${order.contenido || ""} ${order.firmadoPor || ""}`.toLowerCase();
      return haystack.includes(query.q);
    });
  }

  orders.sort((a, b) => {
    if (a.fecha !== b.fecha) {
      return a.fecha < b.fecha ? 1 : -1;
    }
    return a.actualizadoEn < b.actualizadoEn ? 1 : -1;
  });

  res.json({ orders });
});

app.get("/api/day-orders/pdfs", authRequired, (req, res) => {
  const db = readDb();
  const pdfs = (Array.isArray(db.dayOrderPdfs) ? db.dayOrderPdfs : [])
    .filter((pdf) => pdf.companyId === req.user.companyId)
    .sort((a, b) => {
      const aDate = new Date(a.uploadedAt || 0).getTime();
      const bDate = new Date(b.uploadedAt || 0).getTime();
      return bDate - aDate;
    });

  res.json({ pdfs });
});

app.get("/api/vehicles", authRequired, (req, res) => {
  const db = readDb();
  const query = {
    estadoOperativo: String(req.query.estadoOperativo || "").trim(),
    q: String(req.query.q || "").trim().toLowerCase()
  };

  let vehicles = db.vehicles.filter((vehicle) => vehicle.companyId === req.user.companyId);

  if (query.estadoOperativo) {
    vehicles = vehicles.filter((vehicle) => vehicle.estadoOperativo === query.estadoOperativo);
  }

  if (query.q) {
    vehicles = vehicles.filter((vehicle) => {
      const haystack = `${vehicle.nombre || ""} ${vehicle.codigo || ""} ${vehicle.patente || ""} ${vehicle.marcaModelo || ""} ${vehicle.observaciones || ""}`.toLowerCase();
      return haystack.includes(query.q);
    });
  }

  vehicles.sort((a, b) => {
    if (a.codigo !== b.codigo) {
      return a.codigo > b.codigo ? 1 : -1;
    }
    return a.actualizadoEn < b.actualizadoEn ? 1 : -1;
  });

  res.json({ vehicles });
});

app.get("/api/vehicles/:id/drawers", authRequired, (req, res) => {
  const db = readDb();
  const vehicle = db.vehicles.find(
    (candidate) => candidate.id === req.params.id && candidate.companyId === req.user.companyId
  );

  if (!vehicle) {
    return res.status(404).json({ error: "Carro no encontrado." });
  }

  return res.json({
    vehicleId: vehicle.id,
    codigo: vehicle.codigo,
    photoGallery: Array.isArray(vehicle.photoGallery) ? vehicle.photoGallery : [],
    drawers: Array.isArray(vehicle.drawerInventory) ? vehicle.drawerInventory : []
  });
});

app.post("/api/vehicles", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteVehicles")) {
    return res.status(403).json({ error: "No tienes permiso para registrar carros." });
  }

  const payload = sanitizeVehicle(req.body || {});
  if (!payload.ok) {
    return res.status(400).json({ error: payload.error });
  }

  const db = readDb();
  const exists = db.vehicles.some(
    (vehicle) => vehicle.companyId === req.user.companyId && vehicle.codigo.toLowerCase() === payload.codigo.toLowerCase()
  );

  if (exists) {
    return res.status(409).json({ error: "Ya existe un carro con ese codigo." });
  }

  const vehicle = {
    id: crypto.randomUUID(),
    companyId: req.user.companyId,
    nombre: payload.nombre,
    codigo: payload.codigo,
    patente: payload.patente,
    marcaModelo: payload.marcaModelo,
    anio: payload.anio,
    kilometraje: payload.kilometraje,
    estadoOperativo: payload.estadoOperativo,
    ultimaMantencion: payload.ultimaMantencion,
    proximaMantencionKm: payload.proximaMantencionKm,
    revisionTecnicaVencimiento: payload.revisionTecnicaVencimiento,
    observaciones: payload.observaciones,
    photoGallery:
      Array.isArray(payload.photoGallery) && payload.photoGallery.length > 0
        ? payload.photoGallery
        : getDefaultVehiclePhotoGallery(),
    drawerInventory:
      Array.isArray(payload.drawerInventory) && payload.drawerInventory.length > 0
        ? payload.drawerInventory
        : getDefaultVehicleDrawerInventory(payload.codigo),
    actualizadoEn: new Date().toISOString(),
    actualizadoPor: req.user.nombre
  };

  db.vehicles.push(vehicle);
  writeDb(db);

  res.status(201).json({ vehicle });
});

app.put("/api/vehicles/:id", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteVehicles")) {
    return res.status(403).json({ error: "No tienes permiso para editar carros." });
  }

  const payload = sanitizeVehicle(req.body || {});
  if (!payload.ok) {
    return res.status(400).json({ error: payload.error });
  }

  const db = readDb();
  const index = db.vehicles.findIndex(
    (vehicle) => vehicle.id === req.params.id && vehicle.companyId === req.user.companyId
  );

  if (index < 0) {
    return res.status(404).json({ error: "Carro no encontrado." });
  }

  const duplicate = db.vehicles.some(
    (vehicle) =>
      vehicle.id !== req.params.id &&
      vehicle.companyId === req.user.companyId &&
      vehicle.codigo.toLowerCase() === payload.codigo.toLowerCase()
  );

  if (duplicate) {
    return res.status(409).json({ error: "Ya existe otro carro con ese codigo." });
  }

  const updated = {
    ...db.vehicles[index],
    nombre: payload.nombre,
    codigo: payload.codigo,
    patente: payload.patente,
    marcaModelo: payload.marcaModelo,
    anio: payload.anio,
    kilometraje: payload.kilometraje,
    estadoOperativo: payload.estadoOperativo,
    ultimaMantencion: payload.ultimaMantencion,
    proximaMantencionKm: payload.proximaMantencionKm,
    revisionTecnicaVencimiento: payload.revisionTecnicaVencimiento,
    observaciones: payload.observaciones,
    photoGallery:
      Array.isArray(payload.photoGallery) && payload.photoGallery.length > 0
        ? payload.photoGallery
        : db.vehicles[index].photoGallery || getDefaultVehiclePhotoGallery(),
    drawerInventory:
      Array.isArray(payload.drawerInventory) && payload.drawerInventory.length > 0
        ? payload.drawerInventory
        : db.vehicles[index].drawerInventory || getDefaultVehicleDrawerInventory(payload.codigo),
    actualizadoEn: new Date().toISOString(),
    actualizadoPor: req.user.nombre
  };

  db.vehicles[index] = updated;
  writeDb(db);

  res.json({ vehicle: updated });
});

app.delete("/api/vehicles/:id", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteVehicles")) {
    return res.status(403).json({ error: "No tienes permiso para eliminar carros." });
  }

  const db = readDb();
  const before = db.vehicles.length;
  db.vehicles = db.vehicles.filter(
    (vehicle) => !(vehicle.id === req.params.id && vehicle.companyId === req.user.companyId)
  );

  if (db.vehicles.length === before) {
    return res.status(404).json({ error: "Carro no encontrado." });
  }

  writeDb(db);
  return res.json({ ok: true });
});

app.get("/api/uniform-inventory", authRequired, (req, res) => {
  const db = readDb();
  const query = {
    tipoMovimiento: String(req.query.tipoMovimiento || "").trim(),
    estadoPrenda: String(req.query.estadoPrenda || "").trim(),
    q: String(req.query.q || "").trim().toLowerCase()
  };

  let uniforms = db.uniformInventory.filter((record) => record.companyId === req.user.companyId);

  if (query.tipoMovimiento) {
    uniforms = uniforms.filter((record) => record.tipoMovimiento === query.tipoMovimiento);
  }

  if (query.estadoPrenda) {
    uniforms = uniforms.filter((record) => record.estadoPrenda === query.estadoPrenda);
  }

  if (query.q) {
    uniforms = uniforms.filter((record) => {
      const haystack = `${record.voluntarioNombre || ""} ${record.prenda || ""} ${record.talla || ""} ${record.observaciones || ""}`.toLowerCase();
      return haystack.includes(query.q);
    });
  }

  uniforms.sort((a, b) => (a.actualizadoEn < b.actualizadoEn ? 1 : -1));

  res.json({ uniforms });
});

app.post("/api/uniform-inventory", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteUniforms")) {
    return res.status(403).json({ error: "No tienes permiso para registrar movimientos de uniformes." });
  }

  const payload = sanitizeUniformRecord(req.body || {});
  if (!payload.ok) {
    return res.status(400).json({ error: payload.error });
  }

  const db = readDb();
  const record = {
    id: crypto.randomUUID(),
    companyId: req.user.companyId,
    voluntarioNombre: payload.voluntarioNombre,
    prenda: payload.prenda,
    talla: payload.talla,
    cantidad: payload.cantidad,
    tipoMovimiento: payload.tipoMovimiento,
    estadoPrenda: payload.estadoPrenda,
    fechaMovimiento: payload.fechaMovimiento,
    fechaVencimiento: payload.fechaVencimiento,
    observaciones: payload.observaciones,
    actualizadoEn: new Date().toISOString(),
    actualizadoPor: req.user.nombre
  };

  db.uniformInventory.push(record);
  writeDb(db);

  res.status(201).json({ uniform: record });
});

app.put("/api/uniform-inventory/:id", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteUniforms")) {
    return res.status(403).json({ error: "No tienes permiso para editar movimientos de uniformes." });
  }

  const payload = sanitizeUniformRecord(req.body || {});
  if (!payload.ok) {
    return res.status(400).json({ error: payload.error });
  }

  const db = readDb();
  const index = db.uniformInventory.findIndex(
    (record) => record.id === req.params.id && record.companyId === req.user.companyId
  );

  if (index < 0) {
    return res.status(404).json({ error: "Movimiento de uniforme no encontrado." });
  }

  const updated = {
    ...db.uniformInventory[index],
    voluntarioNombre: payload.voluntarioNombre,
    prenda: payload.prenda,
    talla: payload.talla,
    cantidad: payload.cantidad,
    tipoMovimiento: payload.tipoMovimiento,
    estadoPrenda: payload.estadoPrenda,
    fechaMovimiento: payload.fechaMovimiento,
    fechaVencimiento: payload.fechaVencimiento,
    observaciones: payload.observaciones,
    actualizadoEn: new Date().toISOString(),
    actualizadoPor: req.user.nombre
  };

  db.uniformInventory[index] = updated;
  writeDb(db);

  res.json({ uniform: updated });
});

app.delete("/api/uniform-inventory/:id", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteUniforms")) {
    return res.status(403).json({ error: "No tienes permiso para eliminar movimientos de uniformes." });
  }

  const db = readDb();
  const before = db.uniformInventory.length;
  db.uniformInventory = db.uniformInventory.filter(
    (record) => !(record.id === req.params.id && record.companyId === req.user.companyId)
  );

  if (db.uniformInventory.length === before) {
    return res.status(404).json({ error: "Movimiento de uniforme no encontrado." });
  }

  writeDb(db);
  return res.json({ ok: true });
});

app.post("/api/day-orders", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteDayOrders")) {
    return res.status(403).json({ error: "No tienes permiso para publicar ordenes del dia." });
  }

  const payload = sanitizeDayOrder(req.body || {});
  if (!payload.ok) {
    return res.status(400).json({ error: payload.error });
  }

  const db = readDb();
  const order = {
    id: crypto.randomUUID(),
    companyId: req.user.companyId,
    fecha: payload.fecha,
    tipo: payload.tipo,
    titulo: payload.titulo,
    contenido: payload.contenido,
    firmadoPor: payload.firmadoPor,
    publicado: true,
    actualizadoEn: new Date().toISOString(),
    actualizadoPor: req.user.nombre
  };

  db.dayOrders.push(order);
  writeDb(db);

  res.status(201).json({ order });
});

app.post("/api/day-orders/pdfs/upload", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteDayOrders")) {
    return res.status(403).json({ error: "No tienes permiso para subir PDFs de ordenes del dia." });
  }

  dayOrdersPdfUpload.single("pdf")(req, res, (error) => {
    if (error) {
      const message = error.code === "LIMIT_FILE_SIZE" ? "El PDF excede el tamaño máximo de 10 MB." : error.message;
      return res.status(400).json({ error: message || "No se pudo subir el PDF." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Debes seleccionar un archivo PDF." });
    }

    const db = readDb();
    const titulo = String(req.body?.titulo || "").trim() || String(path.parse(req.file.originalname).name || "Orden del dia").trim();
    const relativePath = path.relative(__dirname, req.file.path).replaceAll("\\", "/");
    const fileUrl = `/${relativePath}`;

    const pdfRecord = {
      id: crypto.randomUUID(),
      companyId: req.user.companyId,
      titulo,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileUrl,
      uploadedAt: new Date().toISOString(),
      uploadedBy: req.user.nombre
    };

    if (!Array.isArray(db.dayOrderPdfs)) {
      db.dayOrderPdfs = [];
    }

    db.dayOrderPdfs.push(pdfRecord);
    writeDb(db);

    return res.status(201).json({ pdf: pdfRecord });
  });
});

app.put("/api/day-orders/:id", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteDayOrders")) {
    return res.status(403).json({ error: "No tienes permiso para editar ordenes del dia." });
  }

  const payload = sanitizeDayOrder(req.body || {});
  if (!payload.ok) {
    return res.status(400).json({ error: payload.error });
  }

  const db = readDb();
  const index = db.dayOrders.findIndex(
    (order) => order.id === req.params.id && order.companyId === req.user.companyId
  );

  if (index < 0) {
    return res.status(404).json({ error: "Orden del dia no encontrada." });
  }

  const updated = {
    ...db.dayOrders[index],
    fecha: payload.fecha,
    tipo: payload.tipo,
    titulo: payload.titulo,
    contenido: payload.contenido,
    firmadoPor: payload.firmadoPor,
    publicado: true,
    actualizadoEn: new Date().toISOString(),
    actualizadoPor: req.user.nombre
  };

  db.dayOrders[index] = updated;
  writeDb(db);

  res.json({ order: updated });
});

app.delete("/api/day-orders/:id", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteDayOrders")) {
    return res.status(403).json({ error: "No tienes permiso para eliminar ordenes del dia." });
  }

  const db = readDb();
  const before = db.dayOrders.length;
  db.dayOrders = db.dayOrders.filter(
    (order) => !(order.id === req.params.id && order.companyId === req.user.companyId)
  );

  if (db.dayOrders.length === before) {
    return res.status(404).json({ error: "Orden del dia no encontrada." });
  }

  writeDb(db);
  return res.json({ ok: true });
});

app.post("/api/inventory", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteInventory")) {
    return res.status(403).json({ error: "No tienes permiso para crear artículos." });
  }

  const payload = sanitizeItem(req.body || {});
  if (!payload.ok) {
    return res.status(400).json({ error: payload.error });
  }

  const db = readDb();
  const newItem = {
    id: crypto.randomUUID(),
    companyId: req.user.companyId,
    nombre: payload.nombre,
    categoria: payload.categoria,
    cantidad: payload.cantidad,
    minimo: payload.minimo,
    estado: payload.estado,
    ubicacion: payload.ubicacion,
    notas: payload.notas,
    fechaVencimiento: payload.fechaVencimiento,
    actualizado: new Date().toISOString()
  };

  db.inventory.push(newItem);
  writeDb(db);

  res.status(201).json({ item: newItem });
});

app.put("/api/inventory/:id", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteInventory")) {
    return res.status(403).json({ error: "No tienes permiso para editar artículos." });
  }

  const payload = sanitizeItem(req.body || {});
  if (!payload.ok) {
    return res.status(400).json({ error: payload.error });
  }

  const db = readDb();
  const index = db.inventory.findIndex(
    (item) => item.id === req.params.id && item.companyId === req.user.companyId
  );

  if (index < 0) {
    return res.status(404).json({ error: "Artículo no encontrado." });
  }

  const updated = {
    ...db.inventory[index],
    nombre: payload.nombre,
    categoria: payload.categoria,
    cantidad: payload.cantidad,
    minimo: payload.minimo,
    estado: payload.estado,
    ubicacion: payload.ubicacion,
    notas: payload.notas,
    fechaVencimiento: payload.fechaVencimiento,
    actualizado: new Date().toISOString()
  };

  db.inventory[index] = updated;
  writeDb(db);

  res.json({ item: updated });
});

app.delete("/api/inventory/:id", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canWriteInventory")) {
    return res.status(403).json({ error: "No tienes permiso para eliminar artículos." });
  }

  const db = readDb();
  const before = db.inventory.length;
  db.inventory = db.inventory.filter(
    (item) => !(item.id === req.params.id && item.companyId === req.user.companyId)
  );

  if (db.inventory.length === before) {
    return res.status(404).json({ error: "Artículo no encontrado." });
  }

  writeDb(db);
  return res.json({ ok: true });
});

app.get("/api/users", authRequired, adminRequired, (req, res) => {
  const db = readDb();
  const users = db.users
    .filter((user) => user.companyId === req.user.companyId)
    .map((user) => ({
      id: user.id,
      nombre: user.nombre,
      username: user.username,
      email: user.email || "",
      phone: user.phone || "",
      role: user.role,
      blocked: Boolean(user.blocked),
      createdAt: user.createdAt || "",
      lastLoginAt: user.lastLoginAt || "",
      modulePermissions: user.modulePermissions || {}
    }));

  res.json({ users });
});

app.post("/api/users", authRequired, adminRequired, (req, res) => {
  const nombre = String(req.body?.nombre || "").trim();
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");
  const role = normalizeRoleValue(req.body?.role);
  const email = sanitizeUserOptionalField(req.body?.email);
  const phone = sanitizeUserOptionalField(req.body?.phone);
  const modulePermissionsInput = req.body?.modulePermissions;
  const allowedRoles = ["admin", "voluntario"];

  if (!nombre || !username || !password || !allowedRoles.includes(role)) {
    return res.status(400).json({ error: "Datos de usuario inválidos." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "La clave debe tener al menos 6 caracteres." });
  }

  const db = readDb();
  const exists = db.users.some(
    (user) => user.companyId === req.user.companyId && user.username.toLowerCase() === username.toLowerCase()
  );

  if (exists) {
    return res.status(409).json({ error: "Ese usuario ya existe." });
  }

  const newUser = {
    id: crypto.randomUUID(),
    companyId: req.user.companyId,
    nombre,
    username,
    password,
    role,
    blocked: false,
    email,
    phone,
    createdAt: new Date().toISOString(),
    lastLoginAt: "",
    modulePermissions: normalizeModulePermissions(modulePermissionsInput)
  };

  db.users.push(newUser);
  writeDb(db);

  res.status(201).json({
    user: {
      id: newUser.id,
      nombre: newUser.nombre,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      blocked: newUser.blocked,
      createdAt: newUser.createdAt,
      lastLoginAt: newUser.lastLoginAt,
      modulePermissions: newUser.modulePermissions
    }
  });
});

app.patch("/api/users/:id", authRequired, adminRequired, (req, res) => {
  const db = readDb();
  const index = db.users.findIndex(
    (user) => user.id === req.params.id && user.companyId === req.user.companyId
  );

  if (index < 0) {
    return res.status(404).json({ error: "Usuario no encontrado." });
  }

  const user = db.users[index];
  if (user.id === req.user.id && req.body?.blocked === true) {
    return res.status(400).json({ error: "No puedes bloquearte a ti mismo." });
  }

  if (typeof req.body?.blocked === "boolean") {
    user.blocked = req.body.blocked;
  }

  if (req.body?.password !== undefined) {
    const password = String(req.body.password || "");
    if (password.length < 6) {
      return res.status(400).json({ error: "La clave debe tener al menos 6 caracteres." });
    }
    user.password = password;
  }

  if (req.body?.role !== undefined) {
    const allowedRoles = ["admin", "voluntario"];
    const role = normalizeRoleValue(String(req.body.role || "").trim());
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Rol inválido." });
    }
    user.role = role;
  }

  if (req.body?.nombre !== undefined) {
    const nombre = String(req.body.nombre || "").trim();
    if (!nombre) {
      return res.status(400).json({ error: "Nombre inválido." });
    }
    user.nombre = nombre;
  }

  if (req.body?.email !== undefined) {
    user.email = sanitizeUserOptionalField(req.body.email);
  }

  if (req.body?.phone !== undefined) {
    user.phone = sanitizeUserOptionalField(req.body.phone);
  }

  if (req.body?.modulePermissions !== undefined) {
    user.modulePermissions = normalizeModulePermissions(req.body.modulePermissions);
  }

  db.users[index] = user;
  writeDb(db);

  res.json({
    user: {
      id: user.id,
      nombre: user.nombre,
      username: user.username,
      email: user.email || "",
      phone: user.phone || "",
      role: user.role,
      blocked: Boolean(user.blocked),
      createdAt: user.createdAt || "",
      lastLoginAt: user.lastLoginAt || "",
      modulePermissions: user.modulePermissions || {}
    }
  });
});

app.get("/api/reports/inventory.pdf", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canGenerateReports")) {
    return res.status(403).json({ error: "No tienes permiso para generar reportes." });
  }
  const db = readDb();
  const items = db.inventory.filter((item) => item.companyId === req.user.companyId);
  streamInventoryPdf(res, items, req.user);
});

app.get("/api/reports/expiring.pdf", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canGenerateReports")) {
    return res.status(403).json({ error: "No tienes permiso para generar reportes." });
  }
  const db = readDb();
  const now = new Date();
  const limit = new Date(now);
  limit.setDate(limit.getDate() + 30);

  const items = db.inventory.filter((item) => {
    if (item.companyId !== req.user.companyId || !item.fechaVencimiento) {
      return false;
    }
    const d = new Date(item.fechaVencimiento);
    return !Number.isNaN(d.getTime()) && d >= now && d <= limit;
  });

  streamExpiringPdf(res, items, req.user);
});

app.get("/api/reports/uniforms.pdf", authRequired, (req, res) => {
  if (!hasUserPermission(req.user, "canGenerateReports")) {
    return res.status(403).json({ error: "No tienes permiso para generar reportes." });
  }
  const db = readDb();
  const uniforms = db.uniformInventory.filter((record) => record.companyId === req.user.companyId);
  streamUniformsPdf(res, uniforms, req.user);
});

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});

function authRequired(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";

  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: "No autorizado." });
  }

  const session = sessions.get(token);
  const db = readDb();
  const user = db.users.find((candidate) => candidate.id === session.userId);
  if (!user) {
    sessions.delete(token);
    return res.status(401).json({ error: "Sesión inválida." });
  }

  req.token = token;
  req.user = {
    id: user.id,
    username: user.username,
    role: user.role,
    nombre: user.nombre,
    companyId: user.companyId,
    blocked: Boolean(user.blocked),
    email: user.email || "",
    phone: user.phone || "",
    createdAt: user.createdAt || "",
    lastLoginAt: user.lastLoginAt || "",
    modulePermissions: user.modulePermissions || {}
  };

  if (req.user.blocked) {
    sessions.delete(token);
    return res.status(403).json({ error: "Usuario bloqueado." });
  }

  next();
}

function adminRequired(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Solo administradores." });
  }
  next();
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  const parsed = JSON.parse(raw);
  const normalized = normalizeDb(parsed);
  if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
    writeDb(normalized);
  }
  return normalized;
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = {
      users: [
        {
          id: "u-admin-1",
          companyId: "company-1",
          username: "admin",
          password: "bomberos123",
          nombre: "Administrador",
          role: "admin",
          blocked: false,
          email: "",
          phone: "",
          createdAt: new Date().toISOString(),
          lastLoginAt: "",
          modulePermissions: {}
        }
      ],
      inventory: [],
      guardBook: [],
      medicalRecords: [],
      volunteerCourses: [],
      dayOrders: [],
      dayOrderPdfs: [],
      vehicles: [],
      uniformInventory: []
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), "utf-8");
  }
}

function sanitizeItem(body) {
  const allowedStates = ["En Servicio", "En Mantenimiento", "Fuera de Servicio"];
  const nombre = String(body.nombre || "").trim();
  const categoria = String(body.categoria || "").trim();
  const estado = String(body.estado || "").trim();
  const ubicacion = String(body.ubicacion || "").trim();
  const notas = String(body.notas || "").trim();
  const fechaVencimiento = body.fechaVencimiento ? String(body.fechaVencimiento) : "";
  const cantidad = Number(body.cantidad);
  const minimo = Number(body.minimo);

  if (!nombre || !categoria || !estado || !ubicacion) {
    return { ok: false, error: "Faltan campos obligatorios." };
  }

  if (!allowedStates.includes(estado)) {
    return { ok: false, error: "Estado inválido." };
  }

  if (!Number.isFinite(cantidad) || !Number.isFinite(minimo) || cantidad < 0 || minimo < 0) {
    return { ok: false, error: "Cantidad y mínimo deben ser positivos." };
  }

  if (fechaVencimiento && Number.isNaN(new Date(fechaVencimiento).getTime())) {
    return { ok: false, error: "Fecha de vencimiento inválida." };
  }

  return {
    ok: true,
    nombre,
    categoria,
    cantidad,
    minimo,
    estado,
    ubicacion,
    notas,
    fechaVencimiento
  };
}

function canWriteInventory(role) {
  return role === "admin" || role === "voluntario";
}

function canWriteGuardBook(role) {
  return role === "admin" || role === "voluntario";
}

function canWriteMedicalRecords(role) {
  return role === "admin" || role === "voluntario";
}

function canWriteVolunteerCourses(role) {
  return role === "admin" || role === "voluntario";
}

function canWriteDayOrders(role) {
  return role === "admin" || role === "voluntario";
}

function canWriteVehicles(role) {
  return role === "admin" || role === "voluntario";
}

function canWriteUniforms(role) {
  return role === "admin" || role === "voluntario";
}

function getPermissions(role, modulePermissions = {}) {
  const isAdmin = role === "admin";
  const base = {
    canWriteInventory: canWriteInventory(role),
    canWriteGuardBook: canWriteGuardBook(role),
    canWriteMedicalRecords: canWriteMedicalRecords(role),
    canWriteVolunteerCourses: canWriteVolunteerCourses(role),
    canWriteDayOrders: canWriteDayOrders(role),
    canWriteVehicles: canWriteVehicles(role),
    canWriteUniforms: canWriteUniforms(role),
    canManageUsers: isAdmin,
    canGenerateReports: true
  };

  if (isAdmin) {
    return base;
  }

  return {
    ...base,
    ...normalizeModulePermissions(modulePermissions),
    canManageUsers: false
  };
}

function hasUserPermission(user, permissionKey) {
  const permissions = getPermissions(user.role, user.modulePermissions || {});
  return Boolean(permissions[permissionKey]);
}

function normalizeDb(db) {
  const safeUsers = Array.isArray(db.users) ? db.users : [];
  const safeInventory = Array.isArray(db.inventory) ? db.inventory : [];
  const safeGuardBook = Array.isArray(db.guardBook) ? db.guardBook : [];
  const safeMedicalRecords = Array.isArray(db.medicalRecords) ? db.medicalRecords : [];
  const safeVolunteerCourses = Array.isArray(db.volunteerCourses) ? db.volunteerCourses : [];
  const safeDayOrders = Array.isArray(db.dayOrders) ? db.dayOrders : [];
  const safeDayOrderPdfs = Array.isArray(db.dayOrderPdfs) ? db.dayOrderPdfs : [];
  const safeVehicles = Array.isArray(db.vehicles) ? db.vehicles : [];
  const safeUniformInventory = Array.isArray(db.uniformInventory) ? db.uniformInventory : [];

  return {
    users: safeUsers.map((user) => ({
      ...user,
      blocked: Boolean(user.blocked),
      role: normalizeRoleValue(user.role),
      email: sanitizeUserOptionalField(user.email),
      phone: sanitizeUserOptionalField(user.phone),
      createdAt: String(user.createdAt || ""),
      lastLoginAt: String(user.lastLoginAt || ""),
      modulePermissions: normalizeModulePermissions(user.modulePermissions)
    })),
    inventory: safeInventory,
    guardBook: safeGuardBook,
    medicalRecords: safeMedicalRecords,
    volunteerCourses: safeVolunteerCourses,
    dayOrders: safeDayOrders,
    dayOrderPdfs: safeDayOrderPdfs,
    vehicles: safeVehicles,
    uniformInventory: safeUniformInventory
  };
}

function normalizeRoleValue(role) {
  const normalized = String(role || "").trim().toLowerCase();
  if (normalized === "admin") {
    return "admin";
  }
  return "voluntario";
}

function sanitizeUserOptionalField(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
}

function normalizeModulePermissions(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    canWriteInventory: Boolean(source.canWriteInventory),
    canWriteGuardBook: Boolean(source.canWriteGuardBook),
    canWriteMedicalRecords: Boolean(source.canWriteMedicalRecords),
    canWriteVolunteerCourses: Boolean(source.canWriteVolunteerCourses),
    canWriteDayOrders: Boolean(source.canWriteDayOrders),
    canWriteVehicles: Boolean(source.canWriteVehicles),
    canWriteUniforms: Boolean(source.canWriteUniforms),
    canGenerateReports: Boolean(source.canGenerateReports),
    canManageUsers: Boolean(source.canManageUsers)
  };
}

function sanitizeUniformRecord(body) {
  const allowedMovementTypes = ["Entrega", "Devolucion"];
  const allowedGarmentStates = ["En Uso", "Disponible", "En Reparacion", "Fuera de Servicio"];

  const voluntarioNombre = String(body.voluntarioNombre || "").trim();
  const prenda = String(body.prenda || "").trim();
  const talla = String(body.talla || "").trim();
  const cantidad = Number(body.cantidad);
  const tipoMovimiento = String(body.tipoMovimiento || "").trim();
  const estadoPrenda = String(body.estadoPrenda || "").trim();
  const fechaMovimiento = String(body.fechaMovimiento || "").trim();
  const fechaVencimiento = String(body.fechaVencimiento || "").trim();
  const observaciones = String(body.observaciones || "").trim();

  if (!voluntarioNombre || !prenda || !talla || !Number.isFinite(cantidad) || !tipoMovimiento || !estadoPrenda || !fechaMovimiento) {
    return { ok: false, error: "Completa voluntario, prenda, talla, cantidad, movimiento, estado y fecha del movimiento." };
  }

  if (cantidad < 1) {
    return { ok: false, error: "La cantidad debe ser mayor o igual a 1." };
  }

  if (!allowedMovementTypes.includes(tipoMovimiento)) {
    return { ok: false, error: "Tipo de movimiento invalido." };
  }

  if (!allowedGarmentStates.includes(estadoPrenda)) {
    return { ok: false, error: "Estado de prenda invalido." };
  }

  if (Number.isNaN(new Date(fechaMovimiento).getTime())) {
    return { ok: false, error: "Fecha de movimiento invalida." };
  }

  if (fechaVencimiento && Number.isNaN(new Date(fechaVencimiento).getTime())) {
    return { ok: false, error: "Fecha de vencimiento invalida." };
  }

  return {
    ok: true,
    voluntarioNombre,
    prenda,
    talla,
    cantidad,
    tipoMovimiento,
    estadoPrenda,
    fechaMovimiento,
    fechaVencimiento,
    observaciones
  };
}

function sanitizeVehicle(body) {
  const allowedStates = ["Disponible", "En Servicio", "En Mantenimiento", "Fuera de Servicio"];

  const nombre = String(body.nombre || "").trim();
  const codigo = String(body.codigo || "").trim();
  const patente = String(body.patente || "").trim();
  const marcaModelo = String(body.marcaModelo || "").trim();
  const anio = Number(body.anio);
  const kilometraje = Number(body.kilometraje);
  const estadoOperativo = String(body.estadoOperativo || "").trim();
  const ultimaMantencion = String(body.ultimaMantencion || "").trim();
  const proximaMantencionKm = Number(body.proximaMantencionKm || 0);
  const revisionTecnicaVencimiento = String(body.revisionTecnicaVencimiento || "").trim();
  const observaciones = String(body.observaciones || "").trim();
  const hasPhotoGallery = Array.isArray(body.photoGallery);
  const hasDrawerInventory = Array.isArray(body.drawerInventory);
  const photoGallery = hasPhotoGallery ? sanitizeVehiclePhotoGallery(body.photoGallery) : null;
  const drawerInventory = hasDrawerInventory ? sanitizeVehicleDrawerInventory(body.drawerInventory) : null;

  const resolvedNombre = nombre || marcaModelo || codigo;

  if (!resolvedNombre || !codigo || !patente || !marcaModelo || !Number.isFinite(anio) || !Number.isFinite(kilometraje) || !estadoOperativo) {
    return { ok: false, error: "Completa nombre, codigo, patente, marca/modelo, año, kilometraje y estado operativo." };
  }

  if (anio < 1950 || anio > 2100) {
    return { ok: false, error: "Año invalido para el carro." };
  }

  if (kilometraje < 0) {
    return { ok: false, error: "El kilometraje no puede ser negativo." };
  }

  if (!allowedStates.includes(estadoOperativo)) {
    return { ok: false, error: "Estado operativo invalido." };
  }

  if (ultimaMantencion && Number.isNaN(new Date(ultimaMantencion).getTime())) {
    return { ok: false, error: "La fecha de ultima mantencion es invalida." };
  }

  if (revisionTecnicaVencimiento && Number.isNaN(new Date(revisionTecnicaVencimiento).getTime())) {
    return { ok: false, error: "La fecha de revision tecnica es invalida." };
  }

  if (!Number.isFinite(proximaMantencionKm) || proximaMantencionKm < 0) {
    return { ok: false, error: "La proxima mantencion en km debe ser mayor o igual a 0." };
  }

  if (photoGallery && !photoGallery.ok) {
    return { ok: false, error: photoGallery.error };
  }

  if (drawerInventory && !drawerInventory.ok) {
    return { ok: false, error: drawerInventory.error };
  }

  if (photoGallery && drawerInventory) {
    const validAngles = new Set(photoGallery.items.map((entry) => entry.angle));
    const invalidDrawer = drawerInventory.items.find((drawer) => !validAngles.has(drawer.angle));
    if (invalidDrawer) {
      return {
        ok: false,
        error: `La gaveta ${invalidDrawer.id} usa un angulo que no existe en la galeria.`
      };
    }
  }

  return {
    ok: true,
    nombre: resolvedNombre,
    codigo,
    patente,
    marcaModelo,
    anio,
    kilometraje,
    estadoOperativo,
    ultimaMantencion,
    proximaMantencionKm,
    revisionTecnicaVencimiento,
    observaciones,
    photoGallery: photoGallery ? photoGallery.items : null,
    drawerInventory: drawerInventory ? drawerInventory.items : null
  };
}

function sanitizeVehiclePhotoGallery(entries) {
  const allowedAngles = ["left", "right", "rear"];

  if (!Array.isArray(entries)) {
    return { ok: false, error: "La galeria de fotos debe ser un arreglo." };
  }

  const normalized = entries.map((entry) => ({
    angle: String(entry?.angle || "").trim().toLowerCase(),
    label: String(entry?.label || "").trim(),
    image: String(entry?.image || "").trim()
  }));

  const invalid = normalized.find((entry) => !allowedAngles.includes(entry.angle) || !entry.image);
  if (invalid) {
    return { ok: false, error: "Cada foto de la galeria debe incluir angle valido e image." };
  }

  const seen = new Set();
  for (const entry of normalized) {
    if (seen.has(entry.angle)) {
      return { ok: false, error: "No se pueden repetir angulos en la galeria del carro." };
    }
    seen.add(entry.angle);
  }

  return { ok: true, items: normalized };
}

function sanitizeVehicleDrawerInventory(entries) {
  const allowedAngles = ["left", "right", "rear"];

  if (!Array.isArray(entries)) {
    return { ok: false, error: "La lista de gavetas debe ser un arreglo." };
  }

  const normalized = entries.map((entry) => {
    const id = String(entry?.id || "").trim();
    const nombre = String(entry?.nombre || "").trim();
    const angle = String(entry?.angle || "").trim().toLowerCase();
    const x = Number(entry?.x);
    const y = Number(entry?.y);
    const sourceItems = Array.isArray(entry?.items)
      ? entry.items
      : entry?.item
        ? [entry.item]
        : [];

    const items = sourceItems.map((item) => ({
      nombre: String(item?.nombre || "").trim(),
      estado: String(item?.estado || "").trim(),
      imagen: String(item?.imagen || "").trim() || "logo.png",
      descripcion: String(item?.descripcion || "").trim()
    }));

    return { id, nombre, angle, x, y, items };
  });

  const invalid = normalized.find((drawer) => {
    if (!drawer.id || !drawer.nombre || !allowedAngles.includes(drawer.angle)) {
      return true;
    }
    if (!Number.isFinite(drawer.x) || !Number.isFinite(drawer.y) || drawer.x < 0 || drawer.x > 100 || drawer.y < 0 || drawer.y > 100) {
      return true;
    }
    if (!Array.isArray(drawer.items) || drawer.items.length < 1) {
      return true;
    }

    const invalidItem = drawer.items.find((item) => {
      return !item.nombre || !item.estado || !item.descripcion;
    });

    if (invalidItem) {
      return true;
    }
    return false;
  });

  if (invalid) {
    return {
      ok: false,
      error: "Cada gaveta debe incluir id, nombre, angle, coordenadas x/y (0-100) y al menos un item completo."
    };
  }

  const seen = new Set();
  for (const drawer of normalized) {
    const key = drawer.id.toLowerCase();
    if (seen.has(key)) {
      return { ok: false, error: "Los ids de gaveta deben ser unicos por carro." };
    }
    seen.add(key);
  }

  return { ok: true, items: normalized };
}

function getDefaultVehiclePhotoGallery() {
  return [
    { angle: "left", label: "Lado izquierdo", image: "assets/vehicle-gallery/truck-left.svg" },
    { angle: "right", label: "Lado derecho", image: "assets/vehicle-gallery/truck-right.svg" },
    { angle: "rear", label: "Parte trasera", image: "assets/vehicle-gallery/truck-rear.svg" }
  ];
}

function getDefaultVehicleDrawerInventory(vehicleCode) {
  const code = String(vehicleCode || "CARRO").toUpperCase().replace(/\s+/g, "-");
  return [
    {
      id: `${code}-G01`,
      nombre: "Gaveta herramientas rapidas",
      angle: "left",
      x: 27,
      y: 58,
      items: [
        {
          nombre: "Kit de herramientas rapidas",
          estado: "Operativo",
          imagen: "logo.png",
          descripcion: "Incluye llaves, alicates y elementos de ajuste para intervenciones cortas."
        }
      ]
    },
    {
      id: `${code}-G02`,
      nombre: "Gaveta material absorbente",
      angle: "right",
      x: 68,
      y: 61,
      items: [
        {
          nombre: "Absorbente industrial",
          estado: "Operativo",
          imagen: "logo.png",
          descripcion: "Sacos absorbentes para control de derrames y contención inicial."
        }
      ]
    },
    {
      id: `${code}-G03`,
      nombre: "Gaveta señalizacion trasera",
      angle: "rear",
      x: 52,
      y: 66,
      items: [
        {
          nombre: "Conos y balizas",
          estado: "Operativo",
          imagen: "logo.png",
          descripcion: "Conjunto de conos reflectantes y balizas para asegurar el perímetro."
        }
      ]
    }
  ];
}

function sanitizeDayOrder(body) {
  const tiposPermitidos = ["Disposicion", "Nombramiento", "Felicitacion", "Informacion"];

  const fecha = String(body.fecha || "").trim();
  const tipo = String(body.tipo || "").trim();
  const titulo = String(body.titulo || "").trim();
  const contenido = String(body.contenido || "").trim();
  const firmadoPor = String(body.firmadoPor || "").trim();

  if (!fecha || !tipo || !titulo || !contenido || !firmadoPor) {
    return { ok: false, error: "Completa fecha, tipo, titulo, contenido y firma." };
  }

  if (Number.isNaN(new Date(fecha).getTime())) {
    return { ok: false, error: "Fecha de orden invalida." };
  }

  if (!tiposPermitidos.includes(tipo)) {
    return { ok: false, error: "Tipo de orden invalido." };
  }

  return {
    ok: true,
    fecha,
    tipo,
    titulo,
    contenido,
    firmadoPor
  };
}

function sanitizeVolunteerCourse(body) {
  const voluntarioNombre = String(body.voluntarioNombre || "").trim();
  const curso = String(body.curso || "").trim();
  const institucion = String(body.institucion || "").trim();
  const fechaInicio = String(body.fechaInicio || "").trim();
  const fechaFin = String(body.fechaFin || "").trim();
  const certificacion = String(body.certificacion || "").trim();
  const horasCapacitacion = Number(body.horasCapacitacion);

  if (!voluntarioNombre || !curso || !institucion || !fechaInicio || !certificacion) {
    return { ok: false, error: "Completa voluntario, curso, institucion, fecha y certificacion." };
  }

  if (Number.isNaN(new Date(fechaInicio).getTime())) {
    return { ok: false, error: "Fecha de inicio invalida." };
  }

  if (fechaFin && Number.isNaN(new Date(fechaFin).getTime())) {
    return { ok: false, error: "Fecha de fin invalida." };
  }

  if (fechaFin && fechaFin < fechaInicio) {
    return { ok: false, error: "La fecha de fin no puede ser anterior a la fecha de inicio." };
  }

  if (!Number.isFinite(horasCapacitacion) || horasCapacitacion < 1) {
    return { ok: false, error: "Las horas de capacitacion deben ser un numero mayor o igual a 1." };
  }

  return {
    ok: true,
    voluntarioNombre,
    curso,
    institucion,
    fechaInicio,
    fechaFin,
    certificacion,
    horasCapacitacion
  };
}

function sanitizeMedicalRecord(body) {
  const allowedBloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "Desconocido"];

  const voluntarioNombre = String(body.voluntarioNombre || "").trim();
  const grupoSanguineo = String(body.grupoSanguineo || "Desconocido").trim();
  const alergias = String(body.alergias || "").trim();
  const enfermedades = String(body.enfermedades || "").trim();
  const medicamentos = String(body.medicamentos || "").trim();
  const contactoEmergenciaNombre = String(body.contactoEmergenciaNombre || "").trim();
  const contactoEmergenciaTelefono = String(body.contactoEmergenciaTelefono || "").trim();
  const contactoEmergenciaRelacion = String(body.contactoEmergenciaRelacion || "").trim();

  if (!voluntarioNombre) {
    return { ok: false, error: "El nombre del voluntario es obligatorio." };
  }

  if (!allowedBloodGroups.includes(grupoSanguineo)) {
    return { ok: false, error: "Grupo sanguineo invalido." };
  }

  if (!contactoEmergenciaNombre || !contactoEmergenciaTelefono) {
    return { ok: false, error: "Debes incluir nombre y telefono de contacto de emergencia." };
  }

  return {
    ok: true,
    voluntarioNombre,
    grupoSanguineo,
    alergias,
    enfermedades,
    medicamentos,
    contactoEmergenciaNombre,
    contactoEmergenciaTelefono,
    contactoEmergenciaRelacion
  };
}

function encryptMedicalValue(value) {
  const clean = String(value || "");
  if (!clean) {
    return "";
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", MEDICAL_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(clean, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

function decryptMedicalValue(payload) {
  const encoded = String(payload || "");
  if (!encoded) {
    return "";
  }

  const parts = encoded.split(".");
  if (parts.length !== 3) {
    return encoded;
  }

  try {
    const iv = Buffer.from(parts[0], "base64");
    const tag = Buffer.from(parts[1], "base64");
    const data = Buffer.from(parts[2], "base64");
    const decipher = crypto.createDecipheriv("aes-256-gcm", MEDICAL_KEY, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString("utf8");
  } catch {
    return "";
  }
}

function sanitizeGuardEntry(body) {
  const allowedTurnos = ["Manana", "Tarde", "Noche"];
  const allowedTipos = ["Entrada", "Salida", "Evento", "Observacion"];

  const fechaTurno = String(body.fechaTurno || "").trim();
  const turno = String(body.turno || "").trim();
  const tipo = String(body.tipo || "").trim();
  const descripcion = String(body.descripcion || "").trim();
  const recurso = String(body.recurso || "").trim();

  if (!fechaTurno || !turno || !tipo || !descripcion) {
    return { ok: false, error: "Completa fecha, turno, tipo y descripción." };
  }

  if (!allowedTurnos.includes(turno)) {
    return { ok: false, error: "Turno inválido." };
  }

  if (!allowedTipos.includes(tipo)) {
    return { ok: false, error: "Tipo de novedad inválido." };
  }

  const date = new Date(fechaTurno);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: "Fecha del turno inválida." };
  }

  return {
    ok: true,
    fechaTurno,
    turno,
    tipo,
    descripcion,
    recurso
  };
}

const PDF_BRAND = {
  title: "Cuarta Compañía Federico William Schwager",
  institution: "Cuerpo de Bomberos de Coronel",
  foundation: "10 de Agosto de 1939.",
  contact: "Capitanía Cuarta Coronel – Cuerpo de Bomberos de Coronel | capitancuarta@bomberoscoronel.cl",
  defaultTo: "COMANDANTE CUERPO DE BOMBEROS CORONEL",
  defaultToSecondary: "VOLUNTARIO JAIME SEGUEL ALLEN",
  defaultFromName: "CARLOS SAAVEDRA CELEDON",
  defaultFromTitle: "CAPITAN CUARTA COMPAÑIA",
  signatureLeftName: "Javier Vásquez Espinoza",
  signatureLeftRole: "AYUDANTE",
  signatureRightName: "Carlos Saavedra Celedón",
  signatureRightRole: "CAPITAN",
  borderColor: "#1f2d3d",
  mutedColor: "#5b6776",
  panelFill: "#f7f9fc",
  panelBorder: "#c9d4df"
};

const PDF_LOGO_PATH = path.join(__dirname, "logo.png");

function formatPdfDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
}

function buildPdfOficioCode(reportTitle) {
  const stamp = formatPdfDate().replace(/-/g, "");
  const normalized = String(reportTitle || "RPT")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.slice(0, 3))
    .join("");
  const prefix = normalized || "RPT";
  return `${prefix}-${stamp}`;
}

function createBrandedPdf(res, filenamePrefix) {
  const doc = new PDFDocument({ margin: 40, size: "A4", bufferPages: true });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filenamePrefix}-${Date.now()}.pdf"`);
  doc.pipe(res);
  return doc;
}

function renderPdfHeader(doc, reportTitle, subject, user) {
  const left = doc.page.margins.left;
  const right = doc.page.margins.right;
  const width = doc.page.width - left - right;
  const centeredWidth = width - 54;
  const logoWidth = 42;
  const logoX = left;
  const headerTextX = left + logoWidth + 12;
  const headerTop = 28;

  if (fs.existsSync(PDF_LOGO_PATH)) {
    try {
      doc.image(PDF_LOGO_PATH, logoX, headerTop, { width: logoWidth });
    } catch {
      // Si el logo no se puede dibujar, se continúa sin bloquear el PDF.
    }
  }

  doc.fillColor("#111111");
  doc.font("Helvetica-Bold").fontSize(13).text(PDF_BRAND.title, headerTextX, headerTop, {
    width: centeredWidth,
    align: "center"
  });
  doc.font("Helvetica").fontSize(10).text(PDF_BRAND.institution, {
    width: centeredWidth,
    align: "center"
  });
  doc.fontSize(9).text(PDF_BRAND.foundation, {
    width: centeredWidth,
    align: "center"
  });
  doc.fontSize(9).text(`Fecha: ${formatPdfDate()}`, {
    width: centeredWidth,
    align: "right"
  });
  doc.fontSize(8.5).fillColor(PDF_BRAND.mutedColor).text(PDF_BRAND.contact, {
    width: width,
    align: "center"
  });

  doc.moveDown(0.3);
  doc.moveTo(left, doc.y).lineTo(left + width, doc.y).strokeColor(PDF_BRAND.borderColor).lineWidth(0.9).stroke();
  doc.moveDown(0.45);

  doc.fillColor("#111111");
  doc.font("Helvetica-Bold").fontSize(14).text(reportTitle, { align: "center", width });
  doc.font("Helvetica").fontSize(9).fillColor(PDF_BRAND.mutedColor).text("OFICIO INTERNO", { align: "center", width });
  doc.moveDown(0.3);

  const refsY = doc.y;
  const refsWidth = 160;
  const refsHeight = 54;
  doc.roundedRect(left + width - refsWidth, refsY, refsWidth, refsHeight).fillAndStroke("#ffffff", PDF_BRAND.panelBorder);
  doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#111111");
  doc.text("OFI:", left + width - refsWidth + 8, refsY + 8, { width: 34 });
  doc.text("MAT:", left + width - refsWidth + 8, refsY + 22, { width: 34 });
  doc.text("ANT:", left + width - refsWidth + 8, refsY + 36, { width: 34 });
  doc.font("Helvetica").fontSize(8.5).fillColor(PDF_BRAND.mutedColor);
  doc.text(buildPdfOficioCode(reportTitle), left + width - refsWidth + 42, refsY + 8, { width: 102, ellipsis: true });
  doc.text(subject, left + width - refsWidth + 42, refsY + 22, { width: 102, ellipsis: true });
  doc.text("SIN ANTECEDENTE", left + width - refsWidth + 42, refsY + 36, { width: 102, ellipsis: true });

  doc.y = refsY + refsHeight + 10;

  doc.fillColor("#111111").font("Helvetica-Bold").fontSize(10);
  doc.text("A:", left, doc.y, { continued: true }).font("Helvetica").text(` ${PDF_BRAND.defaultTo}`);
  doc.font("Helvetica").text(`   ${PDF_BRAND.defaultToSecondary}`);
  doc.font("Helvetica-Bold").text("De:", left, doc.y + 2, { continued: true }).font("Helvetica").text(` ${PDF_BRAND.defaultFromName}`);
  doc.font("Helvetica").text(`   ${PDF_BRAND.defaultFromTitle}`);
  doc.font("Helvetica-Bold").text("Asunto:", left, doc.y + 2, { continued: true }).font("Helvetica").text(` ${subject}`);
  doc.moveDown(0.7);
}

function ensurePdfSpace(doc, requiredHeight) {
  const usableBottom = doc.page.height - doc.page.margins.bottom - 38;
  if (doc.y + requiredHeight > usableBottom) {
    doc.addPage();
  }
}

function renderPdfCard(doc, title, lines) {
  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  const innerWidth = width - 24;

  const titleHeight = doc.heightOfString(title, { width: innerWidth });
  const linesHeight = lines.reduce((total, line) => total + doc.heightOfString(line, { width: innerWidth }) + 3, 0);
  const cardHeight = 18 + titleHeight + linesHeight + 12;

  ensurePdfSpace(doc, cardHeight);

  const top = doc.y;
  doc.roundedRect(left, top, width, cardHeight).fillAndStroke("#ffffff", PDF_BRAND.panelBorder);
  doc.fillColor("#111111").font("Helvetica-Bold").fontSize(10).text(title, left + 12, top + 8, {
    width: innerWidth
  });

  let currentY = top + 8 + titleHeight + 4;
  doc.font("Helvetica").fontSize(9).fillColor("#1f2937");
  lines.forEach((line) => {
    doc.text(line, left + 12, currentY, { width: innerWidth });
    currentY += doc.heightOfString(line, { width: innerWidth }) + 2;
  });

  doc.y = top + cardHeight + 10;
}

function renderPdfSignatureBlock(doc, user) {
  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  const blockHeight = 84;

  const preferredBaseY = doc.page.height - doc.page.margins.bottom - 96;
  if (doc.y > preferredBaseY - 20) {
    doc.addPage();
  }
  const baseY = Math.max(doc.y + 18, preferredBaseY);
  const lineWidth = 180;
  const gapBetween = width - lineWidth * 2;
  const leftLineX = left;
  const rightLineX = left + lineWidth + gapBetween;

  doc.strokeColor("#777777").lineWidth(0.8);
  doc.moveTo(leftLineX, baseY).lineTo(leftLineX + lineWidth, baseY).stroke();
  doc.moveTo(rightLineX, baseY).lineTo(rightLineX + lineWidth, baseY).stroke();

  doc.fillColor("#111111").font("Helvetica").fontSize(9);
  doc.text(PDF_BRAND.signatureLeftName, leftLineX, baseY + 5, { width: lineWidth, align: "center" });
  doc.font("Helvetica-Bold").text(PDF_BRAND.signatureLeftRole, leftLineX, baseY + 18, { width: lineWidth, align: "center" });

  doc.font("Helvetica").text(PDF_BRAND.signatureRightName, rightLineX, baseY + 5, { width: lineWidth, align: "center" });
  doc.font("Helvetica-Bold").text(PDF_BRAND.signatureRightRole, rightLineX, baseY + 18, { width: lineWidth, align: "center" });

  doc.y = baseY + 44;
}

function addPdfFooters(doc) {
  const range = doc.bufferedPageRange();
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  for (let index = range.start; index < range.start + range.count; index += 1) {
    doc.switchToPage(index);
    const footerY = doc.page.height - doc.page.margins.bottom + 10;

    doc.fillColor(PDF_BRAND.mutedColor).font("Helvetica").fontSize(8);
    doc.text(PDF_BRAND.contact, doc.page.margins.left, footerY, {
      width: pageWidth,
      align: "center"
    });
    doc.text(`Página ${index - range.start + 1} de ${range.count}`, doc.page.margins.left, footerY + 10, {
      width: pageWidth,
      align: "right"
    });
  }
}

function streamInventoryPdf(res, items, user) {
  const doc = createBrandedPdf(res, "inventario");
  doc.on("pageAdded", () => renderPdfHeader(doc, "Reporte de Inventario", "Inventario actual", user));
  renderPdfHeader(doc, "Reporte de Inventario", "Inventario actual", user);

  const lowStockCount = items.filter((item) => Number(item.cantidad) <= Number(item.minimo)).length;
  doc.font("Helvetica").fontSize(10).fillColor("#1f2937").text(
    `Se registran ${items.length} artículos. Artículos en stock bajo: ${lowStockCount}.`,
    { align: "left" }
  );
  doc.moveDown(0.45);

  if (items.length === 0) {
    doc.fontSize(11).text("No hay artículos en inventario.");
    addPdfFooters(doc);
    doc.end();
    return;
  }

  items.forEach((item, idx) => {
    renderPdfCard(doc, `${idx + 1}. ${item.nombre}`, [
      `Categoría: ${item.categoria}`,
      `Cantidad: ${item.cantidad} | Mínimo: ${item.minimo}`,
      `Estado: ${item.estado}`,
      `Ubicación: ${item.ubicacion}`,
      `Vencimiento: ${item.fechaVencimiento || "-"}`
    ]);
  });

  renderPdfSignatureBlock(doc, user);
  addPdfFooters(doc);
  doc.end();
}

function streamExpiringPdf(res, items, user) {
  const doc = createBrandedPdf(res, "vencimientos");
  doc.on("pageAdded", () => renderPdfHeader(doc, "Reporte de Vencimientos (30 días)", "Vencimientos próximos a 30 días", user));
  renderPdfHeader(doc, "Reporte de Vencimientos (30 días)", "Vencimientos próximos a 30 días", user);

  doc.font("Helvetica").fontSize(10).fillColor("#1f2937").text(
    `Se muestran ${items.length} artículos con vencimiento próximo.`,
    { align: "left" }
  );
  doc.moveDown(0.45);

  if (items.length === 0) {
    doc.fontSize(11).text("No hay artículos con vencimiento en los próximos 30 días.");
    addPdfFooters(doc);
    doc.end();
    return;
  }

  items.forEach((item, idx) => {
    renderPdfCard(doc, `${idx + 1}. ${item.nombre}`, [
      `Categoría: ${item.categoria}`,
      `Cantidad: ${item.cantidad}`,
      `Ubicación: ${item.ubicacion}`,
      `Vence: ${item.fechaVencimiento}`
    ]);
  });

  renderPdfSignatureBlock(doc, user);
  addPdfFooters(doc);
  doc.end();
}

function streamUniformsPdf(res, uniforms, user) {
  const doc = createBrandedPdf(res, "uniformes");
  doc.on("pageAdded", () => renderPdfHeader(doc, "Reporte de Inventario de Uniformes", "Movimientos de uniformes", user));
  renderPdfHeader(doc, "Reporte de Inventario de Uniformes", "Movimientos de uniformes", user);

  doc.font("Helvetica").fontSize(10).fillColor("#1f2937").text(
    `Se registran ${uniforms.length} movimientos de uniformes.`,
    { align: "left" }
  );
  doc.moveDown(0.45);

  if (uniforms.length === 0) {
    doc.fontSize(11).text("No hay movimientos de uniformes registrados.");
    addPdfFooters(doc);
    doc.end();
    return;
  }

  uniforms.forEach((record, idx) => {
    renderPdfCard(doc, `${idx + 1}. ${record.voluntarioNombre}`, [
      `Prenda: ${record.prenda} | Talla: ${record.talla}`,
      `Cantidad: ${record.cantidad}`,
      `Movimiento: ${record.tipoMovimiento} | Estado: ${record.estadoPrenda}`,
      `Fecha: ${record.fechaMovimiento}`,
      `Vence: ${record.fechaVencimiento || "-"}`,
      `Observaciones: ${record.observaciones || "-"}`
    ]);
  });

  renderPdfSignatureBlock(doc, user);
  addPdfFooters(doc);
  doc.end();
}

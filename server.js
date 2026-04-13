const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, "data", "db.json");
const MEDICAL_SECRET = process.env.MEDICAL_SECRET || "inv-cuarta-medical-default-secret-change-me";
const MEDICAL_KEY = crypto.scryptSync(MEDICAL_SECRET, "medical-records-salt", 32);

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
      const haystack = `${vehicle.codigo || ""} ${vehicle.patente || ""} ${vehicle.marcaModelo || ""} ${vehicle.observaciones || ""}`.toLowerCase();
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

  if (!codigo || !patente || !marcaModelo || !Number.isFinite(anio) || !Number.isFinite(kilometraje) || !estadoOperativo) {
    return { ok: false, error: "Completa codigo, patente, marca/modelo, año, kilometraje y estado operativo." };
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

  return {
    ok: true,
    codigo,
    patente,
    marcaModelo,
    anio,
    kilometraje,
    estadoOperativo,
    ultimaMantencion,
    proximaMantencionKm,
    revisionTecnicaVencimiento,
    observaciones
  };
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

function streamInventoryPdf(res, items, user) {
  const doc = new PDFDocument({ margin: 36, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="inventario-${Date.now()}.pdf"`);
  doc.pipe(res);

  doc.fontSize(16).text("Reporte de Inventario", { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(10).text(`Generado por: ${user.nombre} (${user.username})`);
  doc.text(`Fecha: ${new Date().toLocaleString("es-ES")}`);
  doc.moveDown(0.6);

  if (items.length === 0) {
    doc.fontSize(11).text("No hay artículos en inventario.");
    doc.end();
    return;
  }

  items.forEach((item, idx) => {
    doc
      .fontSize(11)
      .text(`${idx + 1}. ${item.nombre} | ${item.categoria} | Cantidad: ${item.cantidad} | Mínimo: ${item.minimo}`)
      .fontSize(10)
      .text(`Estado: ${item.estado} | Ubicación: ${item.ubicacion} | Vencimiento: ${item.fechaVencimiento || "-"}`)
      .moveDown(0.35);
  });

  doc.end();
}

function streamExpiringPdf(res, items, user) {
  const doc = new PDFDocument({ margin: 36, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="vencimientos-${Date.now()}.pdf"`);
  doc.pipe(res);

  doc.fontSize(16).text("Reporte de Vencimientos (30 días)", { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(10).text(`Generado por: ${user.nombre} (${user.username})`);
  doc.text(`Fecha: ${new Date().toLocaleString("es-ES")}`);
  doc.moveDown(0.6);

  if (items.length === 0) {
    doc.fontSize(11).text("No hay artículos con vencimiento en los próximos 30 días.");
    doc.end();
    return;
  }

  items.forEach((item, idx) => {
    doc
      .fontSize(11)
      .text(`${idx + 1}. ${item.nombre} | Vence: ${item.fechaVencimiento}`)
      .fontSize(10)
      .text(`Categoría: ${item.categoria} | Cantidad: ${item.cantidad} | Ubicación: ${item.ubicacion}`)
      .moveDown(0.35);
  });

  doc.end();
}

function streamUniformsPdf(res, uniforms, user) {
  const doc = new PDFDocument({ margin: 36, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="uniformes-${Date.now()}.pdf"`);
  doc.pipe(res);

  doc.fontSize(16).text("Reporte de Inventario de Uniformes", { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(10).text(`Generado por: ${user.nombre} (${user.username})`);
  doc.text(`Fecha: ${new Date().toLocaleString("es-ES")}`);
  doc.moveDown(0.6);

  if (uniforms.length === 0) {
    doc.fontSize(11).text("No hay movimientos de uniformes registrados.");
    doc.end();
    return;
  }

  uniforms.forEach((record, idx) => {
    doc
      .fontSize(11)
      .text(`${idx + 1}. ${record.voluntarioNombre} | ${record.prenda} | Talla: ${record.talla} | Cantidad: ${record.cantidad}`)
      .fontSize(10)
      .text(`Movimiento: ${record.tipoMovimiento} | Estado: ${record.estadoPrenda} | Fecha: ${record.fechaMovimiento} | Vence: ${record.fechaVencimiento || "-"}`)
      .text(`Observaciones: ${record.observaciones || "-"}`)
      .moveDown(0.35);
  });

  doc.end();
}

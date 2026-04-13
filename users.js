const TOKEN_KEY = "inventario_auth_token";

const userForm = document.getElementById("userForm");
const usersTableBody = document.getElementById("usersTableBody");
const usersEmpty = document.getElementById("usersEmpty");
const usersInfo = document.getElementById("usersInfo");
const backBtn = document.getElementById("backBtn");

let token = localStorage.getItem(TOKEN_KEY) || "";
let currentUser = null;

userForm.addEventListener("submit", onCreateUser);
backBtn.addEventListener("click", () => {
  if (window.opener && !window.opener.closed) {
    window.close();
    return;
  }
  window.location.href = "/";
});

bootstrap();

async function bootstrap() {
  if (!token) {
    alert("Sesión no encontrada. Inicia sesión primero.");
    window.location.href = "/";
    return;
  }

  try {
    const me = await api("/api/me");
    currentUser = me.user;

    if (!me.permissions?.canManageUsers) {
      alert("Solo administradores pueden acceder a Gestión de Usuarios.");
      window.location.href = "/";
      return;
    }

    usersInfo.textContent = `${currentUser.nombre} (${currentUser.username}) - Rol: ${currentUser.role}`;
    await refreshUsers();
  } catch (error) {
    alert(error.message || "No se pudo cargar la gestión de usuarios.");
    window.location.href = "/";
  }
}

async function refreshUsers() {
  const response = await api("/api/users");
  renderUsers(response.users || []);
}

async function onCreateUser(event) {
  event.preventDefault();

  const formData = new FormData(userForm);
  const payload = {
    nombre: String(formData.get("nombre") || "").trim(),
    username: String(formData.get("username") || "").trim(),
    password: String(formData.get("password") || ""),
    role: String(formData.get("role") || "").trim()
  };

  if (!payload.nombre || !payload.username || !payload.password || !payload.role) {
    alert("Completa todos los campos.");
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

function renderUsers(users) {
  usersTableBody.innerHTML = "";

  users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(user.nombre)}</td>
      <td>${escapeHtml(user.username)}</td>
      <td>${escapeHtml(user.role)}</td>
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
        alert(error.message || "No se pudo actualizar el estado.");
      }
    });

    const roleBtn = document.createElement("button");
    roleBtn.className = "icon-btn";
    roleBtn.textContent = "Cambiar rol";
    roleBtn.addEventListener("click", async () => {
      const nuevoRol = prompt("Nuevo rol: admin, operador o lectura", user.role);
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

    actions.appendChild(toggleBtn);
    actions.appendChild(roleBtn);
    actions.appendChild(passwordBtn);
    usersTableBody.appendChild(tr);
  });

  usersEmpty.classList.toggle("hidden", users.length > 0);
}

async function api(path, options = {}) {
  const {
    method = "GET",
    body
  } = options;

  const headers = {
    Authorization: `Bearer ${token}`
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const payload = await safeJson(response);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }
    throw new Error(payload?.error || "Error en la solicitud");
  }

  return payload;
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

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

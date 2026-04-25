/* Login
   ===================================================== */
function obtenerIntentos(username) {
  const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.intentos) || "{}");
  return todos[username] || [];
}

function guardarIntento(username) {
  const todos = JSON.parse(localStorage.getItem(STORAGE_KEYS.intentos) || "{}");
  todos[username] = [...(todos[username] || []), Date.now()];
  localStorage.setItem(STORAGE_KEYS.intentos, JSON.stringify(todos));
}

function obtenerIntentosRecientes(username) {
  const ahora = Date.now();
  return obtenerIntentos(username).filter(intento => ahora - intento <= 20 * 60 * 1000);
}

function estaBloqueado(username) {
  const ahora = Date.now();
  const intentosRecientes = obtenerIntentosRecientes(username);
  const ultimoIntento = Math.max(0, ...intentosRecientes);
  return intentosRecientes.length > 5 && ahora - ultimoIntento <= 10 * 60 * 1000;
}

function validarCamposLogin(username, password) {
  if (!username && !password) return "Debe ingresar usuario y contraseña.";
  if (!username) return "Debe ingresar el usuario.";
  if (!password) return "Debe ingresar la contraseña.";
  return null;
}

function initLogin() {
  const form = $("form-login");
  const inputUser = $("username");
  const inputPass = $("password");
  const btnLogin = $("btn-login");
  const mensaje = $("mensaje-login");

  if (obtenerSesion()) location.href = "index.html";

  inputUser.addEventListener("input", () => {
    const username = inputUser.value.trim();
    const bloqueado = username && estaBloqueado(username);
    btnLogin.disabled = bloqueado;

    bloqueado
      ? mostrarMensaje(mensaje, "Demasiados intentos de login, intente de nuevo dentro de 10 minutos.", "error")
      : limpiarMensaje(mensaje);
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const username = inputUser.value.trim();
    const password = inputPass.value.trim();
    const errorCampos = validarCamposLogin(username, password);

    if (errorCampos) {
      mostrarMensaje(mensaje, errorCampos, "error");
      return;
    }

    if (estaBloqueado(username)) {
      registrarBitacora("Login deshabilitado", username);
      mostrarMensaje(mensaje, "Demasiados intentos de login, intente de nuevo dentro de 10 minutos.", "error");
      btnLogin.disabled = true;
      return;
    }

    const usuario = usuarios.find(u => u.username === username);

    if (!usuario) {
      guardarIntento(username);
      registrarBitacora("Login No Exitoso", `Intento ${obtenerIntentosRecientes(username).length}. Código de error: 50001. Usuario no existe: ${username}`);
      mostrarMensaje(mensaje, "Usuario incorrecto o inexistente.", "error");
      return;
    }

    if (usuario.password !== password) {
      guardarIntento(username);
      registrarBitacora("Login No Exitoso", `Intento ${obtenerIntentosRecientes(username).length}. Código de error: 50002. Contraseña incorrecta para: ${username}`);
      mostrarMensaje(mensaje, "Contraseña incorrecta.", "error");
      return;
    }

    guardarSesion(usuario);
    registrarBitacora("Login Exitoso", "Exitoso");
    location.href = "index.html";
  });
}

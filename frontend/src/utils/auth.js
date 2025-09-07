export function saveAuth(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

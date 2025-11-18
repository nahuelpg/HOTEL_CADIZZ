export function validateEmail(email) {
  if (!email) return false;

  // Regex simple, efectiva y estandar
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email.trim());
}

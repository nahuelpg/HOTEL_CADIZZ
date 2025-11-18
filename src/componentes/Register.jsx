import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { api } from "../services/api";
import { useAuth } from "../store/authContext";
import "./Login.css";

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

export default function Register() {
  const nav = useNavigate();
  const { loginWithToken } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    // Validar términos y condiciones
    if (!acceptTerms) {
      setErr("Debes aceptar los Términos y Condiciones y las Políticas de Privacidad.");
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setErr("Las contraseñas no coinciden.");
      return;
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      setErr("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // Si hay SITE_KEY, el captcha es obligatorio
    if (SITE_KEY && !captchaToken) {
      setErr("Confirmá el reCAPTCHA antes de continuar.");
      return;
    }

    try {
      setLoading(true);
      const { token, user } = await api.register(name, email, password, captchaToken);
      loginWithToken(token, user, true);
      nav("/perfil");
    } catch (e) {
      setErr(e.message || "No se pudo registrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper register-wrapper">
        <div className="auth-card">
          <h1 className="auth-title">Crear cuenta</h1>
          <p className="auth-subtitle">
            Completa el formulario para crear tu cuenta en Hotel Cadizz.
          </p>

          {err && <div className="auth-error">{err}</div>}

          <form onSubmit={onSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Nombre completo</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Términos y Condiciones */}
            <label className="checkbox-label terms-checkbox">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={loading}
              />
              <span>
                Acepto los{" "}
                <a href="/terminos" target="_blank" rel="noopener noreferrer">
                  Términos y Condiciones
                </a>{" "}
                y las{" "}
                <a href="/privacidad" target="_blank" rel="noopener noreferrer">
                  Políticas de Privacidad
                </a>{" "}
                de RAPSODIA
              </span>
            </label>

            {/* reCAPTCHA */}
            {SITE_KEY && (
              <div className="recaptcha-wrapper">
                <ReCAPTCHA
                  sitekey={SITE_KEY}
                  onChange={(val) => setCaptchaToken(val || "")}
                  onExpired={() => setCaptchaToken("")}
                  theme="dark"
                />
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className="auth-links">
            <p className="auth-link">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login">Iniciar sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
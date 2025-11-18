import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import "./Login.css"; // Reutilizamos los mismos estilos

export default function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess(false);

    try {
      setLoading(true);
      // Aquí deberías tener un endpoint en tu API para recuperar contraseña
      // await api.recuperarPassword(email);
      
      // Simulación temporal (reemplazar con tu API real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setEmail("");
    } catch (e) {
      setErr(e.message || "No se pudo enviar el correo de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <h1 className="auth-title">Recuperar contraseña</h1>
          <p className="auth-subtitle">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          {err && <div className="auth-error">{err}</div>}
          
          {success && (
            <div className="auth-success">
              ¡Correo enviado! Revisa tu bandeja de entrada para restablecer tu contraseña.
            </div>
          )}

          {!success ? (
            <form onSubmit={onSubmit} className="auth-form">
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

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar enlace de recuperación"}
              </button>
            </form>
          ) : (
            <div style={{ marginTop: "20px" }}>
              <Link to="/login" className="auth-submit" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
                Volver al inicio de sesión
              </Link>
            </div>
          )}

          <div className="auth-links">
            <p className="auth-link">
              ¿Recordaste tu contraseña?{" "}
              <Link to="/login">Iniciar sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
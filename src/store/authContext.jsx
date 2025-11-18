import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext();
const LOCAL_KEY = "cadizz_auth_v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  // 🔧 Función para limpiar el token si viene con "Bearer "
  const cleanToken = (t) => {
    if (!t) return "";
    return t.replace(/^Bearer\s+/i, "").trim();
  };

  // 🔁 Cargar sesión guardada en localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.user && saved?.token) {
          setUser(saved.user);
          setToken(cleanToken(saved.token));
        }
      }
    } catch {}
  }, []);

  // 🔐 Login clásico
  const login = async (email, password, remember = true) => {
    const { token, user } = await api.login(email, password);
    const clean = cleanToken(token);
    setUser(user);
    setToken(clean);
    if (remember) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ user, token: clean }));
    }
    return user;
  };

  // 🔐 Login luego de registrarse
  const loginWithToken = (tok, usr, remember = true) => {
    const clean = cleanToken(tok);
    setUser(usr);
    setToken(clean);
    if (remember) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ user: usr, token: clean }));
    }
  };

  // 🚪 Logout
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem(LOCAL_KEY);
  };

  // Contexto exportado
  const value = useMemo(
    () => ({ user, token, isAuth: !!user, login, loginWithToken, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

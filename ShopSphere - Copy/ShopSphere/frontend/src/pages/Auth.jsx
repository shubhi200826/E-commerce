import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

export default function Auth({ mode = "login" }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      if (isRegister) await register(form);
      else await login({ email: form.email, password: form.password });
      navigate(location.state?.from || "/");
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setBusy(false); }
  };
  return <div className="auth-wrap"><form className="auth-card" onSubmit={submit}>
    <span className="eyebrow">WELCOME TO SHOPSPHERE</span><h1>{isRegister ? "Create your account" : "Welcome back"}</h1>
    <p className="muted">{isRegister ? "A better shopping experience starts here." : "Sign in to continue shopping."}</p>
    {isRegister && <label>Full name<input name="name" value={form.name} onChange={change} required minLength="2" placeholder="Your name"/></label>}
    <label>Email address<input name="email" type="email" value={form.email} onChange={change} required placeholder="you@example.com"/></label>
    <label>Password<input name="password" type="password" value={form.password} onChange={change} required minLength="8" placeholder="At least 8 characters"/></label>
    {error && <p className="error-text">{error}</p>}
    <button className="button button-wide" disabled={busy}>{busy ? "Please wait..." : isRegister ? "Create account" : "Sign in"}</button>
    <p className="auth-switch">{isRegister ? "Already have an account?" : "New to ShopSphere?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create account"}</Link></p>
  </form></div>;
}

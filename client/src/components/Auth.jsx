import { useState } from "react";
import api from "../api";

export default function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = event => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const submit = async event => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        `/auth/${mode}`,
        form
      );

      localStorage.setItem(
        "sweety_token",
        response.data.token
      );

      onAuthenticated(response.data.user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to complete the request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-mark">S</div>
        <h1>Sweety</h1>
        <p className="subtitle">
          Blood Glucose Tracker
        </p>

        <form onSubmit={submit} className="stack">
          {mode === "register" && (
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={update}
                placeholder="Your name"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={update}
              placeholder="Minimum 6 characters"
              required
              minLength={6}
            />
          </label>

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          <button
            className="primary"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Log in"
                : "Create account"}
          </button>
        </form>

        <button
          className="text-button"
          onClick={() => {
            setError("");
            setMode(
              mode === "login"
                ? "register"
                : "login"
            );
          }}
        >
          {mode === "login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </button>
      </section>
    </main>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const palette = {
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  accent: "#22C55E",
  danger: "#EF4444",
  border: "#D0D5DD",
  bg: "radial-gradient(circle at 20% 20%, #E0F2FE 0, #F8FAFC 30%, #F8FAFC 100%)",
  panel: "linear-gradient(145deg, rgba(37,99,235,0.12), rgba(34,197,94,0.10))",
  surface: "rgba(255,255,255,0.92)",
  text: "#0F172A",
  muted: "#475467",
  shadow: "0 24px 60px rgba(15,23,42,0.12)",
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr",
        background: palette.bg,
        alignItems: "center",
        justifyItems: "center",
        padding: "32px",
        fontFamily: 'Inter, "SF Pro Display", "Segoe UI", sans-serif',
        color: palette.text,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1040px",
          background: palette.surface,
          borderRadius: "24px",
          border: `1px solid ${palette.border}`,
          boxShadow: palette.shadow,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0",
        }}
      >
        {/* Left Panel - Branding */}
        <div
          style={{
            padding: "32px",
            background: palette.panel,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.6)",
                color: palette.text,
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "999px",
                  background: palette.accent,
                  boxShadow: "0 0 0 6px rgba(34,197,94,0.22)",
                }}
              />
              Market Insights Platform
            </div>

            <h1 style={{ margin: "18px 0 10px", fontSize: "28px", lineHeight: "1.2" }}>
              Start your journey today.
            </h1>
            <p style={{ margin: 0, color: palette.muted, maxWidth: "380px" }}>
              Join thousands of traders and analysts using our platform to make data-driven decisions and stay ahead of market trends.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginTop: "28px",
            }}
          >
            {[
              { label: "Active users", value: "50K+" },
              { label: "Data points", value: "1M+" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(255,255,255,0.7)",
                  borderRadius: "14px",
                  padding: "12px 14px",
                  border: `1px solid ${palette.border}`,
                  boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
                }}
              >
                <div style={{ color: palette.muted, fontSize: "13px" }}>{item.label}</div>
                <div style={{ fontWeight: 700, fontSize: "18px", marginTop: "6px" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Signup Form */}
        <div
          style={{
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            background: "#FFF",
          }}
        >
          <div>
            <h2 style={{ margin: 0, marginBottom: "6px", fontSize: "24px" }}>Create your account</h2>
            <p style={{ margin: 0, color: palette.muted }}>
              Fill in your details to get started.
            </p>
          </div>

          {error && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#FEF2F2",
                color: palette.danger,
                border: `1px solid ${palette.danger}33`,
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "14px",
                color: palette.muted,
              }}
            >
              Full Name
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                style={{
                  height: "48px",
                  padding: "0 14px",
                  borderRadius: "12px",
                  border: `1px solid ${palette.border}`,
                  background: "#FFF",
                  fontSize: "15px",
                  color: palette.text,
                  outline: "none",
                  transition: "border-color 150ms, box-shadow 150ms, transform 120ms",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = palette.primary;
                  e.target.style.boxShadow = `0 0 0 4px #BFDBFE`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = palette.border;
                  e.target.style.boxShadow = "none";
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "14px",
                color: palette.muted,
              }}
            >
              Email
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                  height: "48px",
                  padding: "0 14px",
                  borderRadius: "12px",
                  border: `1px solid ${palette.border}`,
                  background: "#FFF",
                  fontSize: "15px",
                  color: palette.text,
                  outline: "none",
                  transition: "border-color 150ms, box-shadow 150ms, transform 120ms",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = palette.primary;
                  e.target.style.boxShadow = `0 0 0 4px #BFDBFE`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = palette.border;
                  e.target.style.boxShadow = "none";
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "14px",
                color: palette.muted,
              }}
            >
              Password
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  height: "48px",
                  padding: "0 14px",
                  borderRadius: "12px",
                  border: `1px solid ${palette.border}`,
                  background: "#FFF",
                  fontSize: "15px",
                  color: palette.text,
                  outline: "none",
                  transition: "border-color 150ms, box-shadow 150ms, transform 120ms",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = palette.primary;
                  e.target.style.boxShadow = `0 0 0 4px #BFDBFE`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = palette.border;
                  e.target.style.boxShadow = "none";
                }}
              />
            </label>

            <button
              type="submit"
              style={{
                marginTop: "4px",
                height: "50px",
                borderRadius: "14px",
                border: "none",
                background: palette.primary,
                color: "#FFF",
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "0.01em",
                cursor: "pointer",
                boxShadow: "0 14px 30px rgba(37,99,235,0.25)",
                transition: "background 150ms, transform 120ms, box-shadow 150ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = palette.primaryHover;
                e.currentTarget.style.boxShadow = "0 18px 34px rgba(37,99,235,0.28)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = palette.primary;
                e.currentTarget.style.boxShadow = "0 14px 30px rgba(37,99,235,0.25)";
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(1px) scale(0.995)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
            >
              Create account
            </button>
          </form>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "13px",
              color: palette.muted,
              marginTop: "4px",
            }}
          >
            <span>Already have an account?</span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: palette.primary,
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "13px",
                padding: "0",
                textDecoration: "underline",
              }}
            >
              Sign in
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "13px",
              color: palette.muted,
              marginTop: "4px",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: palette.accent,
                boxShadow: "0 0 0 6px rgba(34,197,94,0.14)",
              }}
            />
            Secure registration • Encrypted transit • Privacy protected
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 900px) {
            div[style*="grid-template-columns: 1fr 1fr"] {
              grid-template-columns: 1fr !important;
            }
          }
          @media (max-width: 640px) {
            div[style*="padding: 40px"] { padding: 28px !important; }
            h1 { font-size: 24px !important; }
            h2 { font-size: 22px !important; }
          }
        `}
      </style>
    </div>
  );
}

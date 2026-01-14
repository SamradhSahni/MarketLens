import { Link } from "react-router-dom";

const palette = {
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  accent: "#22C55E",
  border: "#D0D5DD",
  bg: "radial-gradient(circle at 10% 0, #E0F2FE 0, #F8FAFC 40%, #F9FAFB 100%)",
  surface: "#FFFFFF",
  text: "#0F172A",
  muted: "#475467",
  chipBg: "#EFF6FF",
  shadow: "0 24px 60px rgba(15,23,42,0.12)",
};

export default function Welcome() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: palette.bg,
        fontFamily: 'Inter, "SF Pro Display", "Segoe UI", sans-serif',
        color: palette.text,
      }}
    >
      {/* Top nav */}
      <header
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "20px 24px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 14,
              background: "linear-gradient(135deg, #2563EB, #22C55E)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
              fontSize: 18,
              fontWeight: 700,
              boxShadow: "0 12px 26px rgba(15,23,42,0.25)",
            }}
          >
            N
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>
              Nifty ML Analytics
            </div>
            <div style={{ fontSize: 12, color: palette.muted }}>
              Market insights • ML-powered predictions
            </div>
          </div>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            to="/login"
            style={{
              fontSize: 14,
              color: palette.muted,
              textDecoration: "none",
              padding: "8px 10px",
              borderRadius: 999,
              transition: "background 140ms, color 140ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#EFF6FF";
              e.currentTarget.style.color = palette.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = palette.muted;
            }}
          >
            Log in
          </Link>
          <Link
            to="/signup"
            style={{
              fontSize: 14,
              color: "#FFF",
              background: palette.primary,
              padding: "8px 16px",
              borderRadius: 999,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 10px 24px rgba(37,99,235,0.25)",
              transition: "background 140ms, transform 120ms, box-shadow 140ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = palette.primaryHover;
              e.currentTarget.style.boxShadow =
                "0 12px 26px rgba(37,99,235,0.28)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = palette.primary;
              e.currentTarget.style.boxShadow =
                "0 10px 24px rgba(37,99,235,0.25)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(1px)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero + feature grid */}
      <main
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "40px 24px 48px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
          gap: 36,
          alignItems: "center",
        }}
      >
        {/* Left: copy */}
        <section>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(37,99,235,0.06)",
              border: `1px solid rgba(37,99,235,0.18)`,
              fontSize: 12,
              fontWeight: 500,
              color: palette.primary,
              marginBottom: 14,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: palette.accent,
                boxShadow: "0 0 0 5px rgba(34,197,94,0.2)",
              }}
            />
            ML-driven analytics for the Nifty index & components
          </div>

          <h1
            style={{
              fontSize: 34,
              lineHeight: 1.1,
              margin: 0,
              marginBottom: 12,
            }}
          >
            See the Nifty index like a{" "}
            <span
              style={{
                background:
                  "linear-gradient(120deg, #2563EB 0%, #22C55E 50%, #0EA5E9 100%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              machine
            </span>{" "}
            — act like a pro.
          </h1>

          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: palette.muted,
              maxWidth: 520,
              margin: 0,
              marginBottom: 18,
            }}
          >
            Nifty ML Analytics Platform combines real-time market data with
            machine learning models to help you identify opportunities,
            understand risk, and monitor your portfolio with precision.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 18,
              fontSize: 12,
            }}
          >
            {[
              "Nifty index overview",
              "Stock analysis & screening",
              "Price & trend prediction",
              "Portfolio risk & return",
              "Cross-stock correlation",
            ].map((chip) => (
              <span
                key={chip}
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: palette.chipBg,
                  color: palette.text,
                  border: `1px solid rgba(148,163,184,0.35)`,
                  whiteSpace: "nowrap",
                }}
              >
                {chip}
              </span>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              alignItems: "center",
            }}
          >
            <Link
              to="/signup"
              style={{
                fontSize: 15,
                color: "#FFF",
                background: palette.primary,
                padding: "10px 18px",
                borderRadius: 999,
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 14px 30px rgba(37,99,235,0.28)",
                transition:
                  "background 140ms, transform 120ms, box-shadow 140ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = palette.primaryHover;
                e.currentTarget.style.boxShadow =
                  "0 16px 34px rgba(37,99,235,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = palette.primary;
                e.currentTarget.style.boxShadow =
                  "0 14px 30px rgba(37,99,235,0.28)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(1px)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Create free account
            </Link>

            <Link
              to="/login"
              style={{
                fontSize: 14,
                color: palette.primary,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 8px",
                borderRadius: 999,
                transition: "background 140ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#EFF6FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Already have an account?
              <span style={{ fontSize: 16 }}>→</span>
            </Link>
          </div>

          <div
            style={{
              marginTop: 20,
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              fontSize: 12,
              color: palette.muted,
            }}
          >
            <div>Live Nifty feed • Intraday & positional views</div>
            <div>Backtested ML models • Risk-adjusted metrics</div>
          </div>
        </section>

        {/* Right: feature tiles / pseudo-analytics card */}
        <section
          style={{
            background: palette.surface,
            borderRadius: 24,
            border: `1px solid ${palette.border}`,
            boxShadow: palette.shadow,
            padding: 18,
            display: "grid",
            gridTemplateRows: "auto auto",
            gap: 14,
          }}
        >
          <div
            style={{
              padding: 14,
              borderRadius: 18,
              border: `1px solid rgba(148,163,184,0.4)`,
              background:
                "radial-gradient(circle at 10% 0, rgba(37,99,235,0.06), #FFFFFF 55%)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <div style={{ fontSize: 13, color: palette.muted }}>
                Nifty index overview
              </div>
              <span
                style={{
                  fontSize: 11,
                  padding: "4px 8px",
                  borderRadius: 999,
                  background: "rgba(34,197,94,0.08)",
                  color: palette.accent,
                  fontWeight: 600,
                }}
              >
                Live
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 700 }}>NIFTY 50</span>
              <span style={{ fontSize: 16, color: palette.muted }}>▲ 0.84%</span>
            </div>
            <div
              style={{
                height: 64,
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, rgba(37,99,235,0.08), rgba(34,197,94,0.14))",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Simple fake sparkline */}
              <div
                style={{
                  position: "absolute",
                  inset: "18% 10%",
                  borderRadius: 999,
                  borderBottom: "2px solid #22C55E",
                  borderTop: "2px solid transparent",
                  transform: "skewX(-12deg)",
                  boxShadow: "0 0 0 1px rgba(34,197,94,0.35)",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: 12,
                borderRadius: 16,
                border: `1px solid rgba(148,163,184,0.45)`,
                background: "#F9FAFB",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: palette.muted,
                  marginBottom: 4,
                }}
              >
                Stock analysis
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                120+
              </div>
              <div style={{ fontSize: 12, color: palette.muted }}>
                Filter by sector, volatility, and momentum to spot standouts
                inside the index.
              </div>
            </div>

            <div
              style={{
                padding: 12,
                borderRadius: 16,
                border: `1px solid rgba(148,163,184,0.45)`,
                background: "#F9FAFB",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: palette.muted,
                  marginBottom: 4,
                }}
              >
                Stock prediction
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                1–5D
              </div>
              <div style={{ fontSize: 12, color: palette.muted }}>
                Short-horizon ML models with scenario-based probability bands.
              </div>
            </div>

            <div
              style={{
                padding: 12,
                borderRadius: 16,
                border: `1px solid rgba(148,163,184,0.45)`,
                background: "#F9FAFB",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: palette.muted,
                  marginBottom: 4,
                }}
              >
                Portfolio analysis
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                0.92
              </div>
              <div style={{ fontSize: 12, color: palette.muted }}>
                Track drawdowns, beta, and Sharpe vs. Nifty to understand
                your risk.
              </div>
            </div>

            <div
              style={{
                padding: 12,
                borderRadius: 16,
                border: `1px solid rgba(148,163,184,0.45)`,
                background: "#F9FAFB",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: palette.muted,
                  marginBottom: 4,
                }}
              >
                Correlation analysis
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                250+
              </div>
              <div style={{ fontSize: 12, color: palette.muted }}>
                Visualize how stocks move together to build more resilient
                portfolios.
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Simple responsive tweaks */}
      <style>
        {`
          @media (max-width: 900px) {
            main[style*="grid-template-columns"] {
              grid-template-columns: 1fr !important;
            }
          }
          @media (max-width: 640px) {
            header {
              flex-direction: column !important;
              align-items: flex-start !important;
            }
            h1 {
              font-size: 26px !important;
            }
          }
        `}
      </style>
    </div>
  );
}
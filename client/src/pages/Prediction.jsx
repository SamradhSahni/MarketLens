import { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

export default function Prediction() {
  const [stocks, setStocks] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [days, setDays] = useState(10);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- LOAD STOCK LIST ---------------- */
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const res = await api.get("/stocks/list");
        setStocks(res.data);
        if (res.data.length > 0) {
          setSymbol(res.data[0].symbol);
        }
      } catch {
        setError("Failed to load stock list");
      }
    };
    loadStocks();
  }, []);

  /* ---------------- PREDICTION ---------------- */
  const handlePredict = async () => {
    if (!symbol) return;

    setLoading(true);
    setError("");
    setPredictions(null);

    try {
      const res = await api.post("/predict", { symbol, days });
      setPredictions(res.data.predictions);
    } catch {
      setError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const latestPrice =
    predictions && predictions[predictions.length - 1]?.price;

  return (
    <div style={{ padding: 40, background: "#f8fafc", minHeight: "100vh" }}>
      {/* ================= HEADER ================= */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>
          📉 Stock Price Prediction
        </h1>
        <p style={{ color: "#555", maxWidth: 720 }}>
          LSTM-based time-series forecasting trained on historical Nifty-50 data.
          Prices are forecasted for upcoming trading days only.
        </p>
      </div>

      {/* ================= CONTROL PANEL ================= */}
      <div style={panelStyle}>
        {/* STOCK DROPDOWN */}
        <div>
          <label style={labelStyle}>Stock</label>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            style={inputStyle}
          >
            {stocks.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.company} ({s.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* DAYS */}
        <div>
          <label style={labelStyle}>Forecast Horizon (Days)</label>
          <input
            type="number"
            min="5"
            max="30"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handlePredict}
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "Running Model…" : "Run Prediction"}
        </button>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <p style={{ color: "red", marginTop: 20, fontWeight: 600 }}>
          {error}
        </p>
      )}

      {/* ================= RESULTS ================= */}
      {predictions && (
        <>
          {/* KPI CARDS */}
          <div style={kpiGrid}>
            <KpiCard title="Stock" value={symbol} />
            <KpiCard title="Forecast Days" value={days} />
            <KpiCard
              title="Last Predicted Price"
              value={`₹ ${latestPrice}`}
            />
          </div>

          {/* ================= CHART ================= */}
          <div style={cardStyle}>
            <h2>📈 Predicted Price Trend</h2>
            <p style={{ color: "#64748b", marginBottom: 20 }}>
              Y-axis dynamically scaled to clearly show short-term movement
            </p>

            <ResponsiveContainer width="100%" height={420}>
              <LineChart data={predictions}>
                <defs>
                  <linearGradient
                    id="priceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.4} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />

                {/* 🔥 KEY FIX */}
                <YAxis
                  domain={[
                    (min) => min * 0.97,
                    (max) => max * 1.03,
                  ]}
                  tickFormatter={(v) => `₹${v}`}
                />

                <Tooltip
                  formatter={(v) => [`₹ ${v}`, "Predicted Price"]}
                />

                <ReferenceLine
                  y={predictions[0].price}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{
                    value: "Baseline",
                    position: "insideTopLeft",
                    fill: "#64748b",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="url(#priceGradient)"
                  strokeWidth={4}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ================= TABLE ================= */}
          <div style={cardStyle}>
            <h2>📊 Forecasted Prices</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Predicted Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((row, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{row.date}</td>
                    <td style={tdStyle}>{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const panelStyle = {
  background: "#fff",
  padding: 25,
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  display: "flex",
  gap: 20,
  flexWrap: "wrap",
  alignItems: "flex-end",
};

const cardStyle = {
  marginTop: 40,
  background: "#fff",
  padding: 30,
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
  marginTop: 30,
};

const labelStyle = {
  fontWeight: 600,
};

const inputStyle = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #ccc",
  marginTop: 6,
  minWidth: 220,
};

const buttonStyle = {
  padding: "12px 24px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  fontWeight: 700,
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
};

function KpiCard({ title, value }) {
  return (
    <div style={cardStyle}>
      <p style={{ fontSize: 13, color: "#64748b" }}>{title}</p>
      <h2 style={{ fontSize: 22, fontWeight: 700 }}>{value}</h2>
    </div>
  );
}

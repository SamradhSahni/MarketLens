import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ---------------- PERIOD CONFIG ---------------- */
const PERIODS = {
  "1 Day": 1,
  "1 Week": 5,
  "1 Month": 21,
  "6 Months": 126,
  "1 Year": 252,
  "5 Years": 1260,
  All: Infinity,
};

export default function Index() {
  const [raw, setRaw] = useState(null);
  const [period, setPeriod] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- FETCH INDEX DATA ---------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/index/overview");
        setRaw(res.data);
      } catch {
        setError("Failed to load index overview");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ---------------- FILTER SERIES ---------------- */
  const filteredSeries = useMemo(() => {
    if (!raw?.history) return [];

    if (period === "All") return raw.history;

    const n = PERIODS[period];
    return raw.history.slice(-n);
  }, [raw, period]);

  if (loading) return <p style={{ padding: 40 }}>Loading index data…</p>;
  if (error) return <p style={{ padding: 40, color: "red" }}>{error}</p>;
  if (!raw || !raw.stats) {
    return <p style={{ padding: 40 }}>No index data available</p>;
  }

  const stats = raw.stats;
  const returns = raw.returns || {};

  return (
    <div style={{ padding: 40, background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        📈 Nifty 50 Index Overview
      </h1>

      {/* ---------------- PERIOD SELECTOR ---------------- */}
      <div style={periodBar}>
        {Object.keys(PERIODS).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              ...periodBtn,
              background: p === period ? "#2563eb" : "#fff",
              color: p === period ? "#fff" : "#111",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* ---------------- SUMMARY + CHART ---------------- */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 3fr", gap: 30 }}>
        {/* SUMMARY */}
        <div style={summaryCard}>
          <h3>🧾 Market Summary</h3>

          <SummaryRow label="Last Close" value={`₹${stats.last_close}`} />
          <SummaryRow
            label="Change"
            value={`${stats.change} (${stats.change_pct}%)`}
            highlight
          />

          <hr />

          <SummaryRow label="Open" value={`₹${stats.today_open}`} />
          <SummaryRow label="High" value={`₹${stats.today_high}`} />
          <SummaryRow label="Low" value={`₹${stats.today_low}`} />
          <SummaryRow label="Prev Close" value={`₹${stats.prev_close}`} />

          <hr />

          <SummaryRow label="52W High" value={`₹${stats.week52_high}`} />
          <SummaryRow label="52W Low" value={`₹${stats.week52_low}`} />
        </div>

        {/* CHART */}
        <div style={card}>
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={filteredSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                domain={[
                  (min) => min * 0.97,
                  (max) => max * 1.03,
                ]}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip formatter={(v) => `₹${v}`} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------------- RETURNS ---------------- */}
      <h2 style={{ marginTop: 40 }}>📊 Returns Performance</h2>

      <div style={returnsGrid}>
        {Object.entries(returns).map(([p, v]) => (
          <div
            key={p}
            style={{
              ...returnCard,
              background:
                v === null
                  ? "#9ca3af"
                  : v >= 0
                  ? "linear-gradient(135deg,#16a34a,#22c55e)"
                  : "linear-gradient(135deg,#dc2626,#ef4444)",
            }}
          >
            <div>{p}</div>
            <div>{v !== null ? `${v}%` : "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */
function SummaryRow({ label, value, highlight }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontWeight: highlight ? 700 : 500,
        marginBottom: 6,
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const periodBar = {
  display: "flex",
  gap: 10,
  margin: "20px 0",
  flexWrap: "wrap",
};

const periodBtn = {
  padding: "8px 14px",
  borderRadius: 20,
  border: "1px solid #e5e7eb",
  cursor: "pointer",
  fontWeight: 600,
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const summaryCard = {
  ...card,
  fontSize: 14,
};

const returnsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
  gap: 16,
  marginTop: 20,
};

const returnCard = {
  borderRadius: 12,
  padding: 15,
  color: "#fff",
  fontWeight: 600,
  textAlign: "center",
  boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
};

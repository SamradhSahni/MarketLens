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
} from "recharts";

const PERIODS = [
  { label: "1 Week", value: "1w" },
  { label: "1 Month", value: "1m" },
  { label: "6 Months", value: "6m" },
  { label: "1 Year", value: "1y" },
  { label: "5 Years", value: "5y" },
  { label: "All", value: "all" },
];

export default function StockAnalysis() {
  const [stocks, setStocks] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [period, setPeriod] = useState("1y");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- LOAD STOCK LIST ---------------- */
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const res = await api.get("/stocks/list");
        setStocks(res.data);

        // default first stock
        if (res.data.length > 0) {
          setSymbol(res.data[0].symbol);
        }
      } catch {
        setError("Failed to load stock list");
      }
    };

    loadStocks();
  }, []);

  /* ---------------- LOAD STOCK DATA ---------------- */
  useEffect(() => {
    if (!symbol) return;

    const loadStock = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/stocks/${symbol}`);
        setData(res.data);
      } catch {
        setError("Failed to load stock data");
      } finally {
        setLoading(false);
      }
    };

    loadStock();
  }, [symbol]);

  const filteredHistory = () => {
    if (!data?.history) return [];

    if (period === "all") return data.history;

    const daysMap = {
      "1w": 7,
      "1m": 30,
      "6m": 180,
      "1y": 365,
      "5y": 1825,
    };

    return data.history.slice(-daysMap[period]);
  };

  return (
    <div style={{ padding: 40, background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        🏢 Individual Stock Analysis
      </h1>

      {/* ---------------- CONTROLS ---------------- */}
      <div style={panelStyle}>
        <div>
          <label style={labelStyle}>Select Stock</label>
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

        <div>
          <label style={labelStyle}>Time Period</label>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                style={{
                  ...periodBtn,
                  background:
                    period === p.value ? "#2563eb" : "#e5e7eb",
                  color: period === p.value ? "#fff" : "#000",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <div style={infoBox}>{error}</div>}
      {loading && <p>Loading stock data…</p>}

      {/* ---------------- CHART ---------------- */}
      {data && (
        <div style={cardStyle}>
          <h2>📈 Price Trend</h2>

          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={filteredHistory()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                domain={[
                  (min) => min * 0.97,
                  (max) => max * 1.03,
                ]}
              />
              <Tooltip />
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
      )}

      {/* ---------------- RETURNS ---------------- */}
      {data?.metrics && (
        <div style={cardStyle}>
          <h2>📊 Performance Overview</h2>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {Object.entries(data.metrics).map(([k, v]) => (
              <ReturnCard key={k} label={k} value={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function ReturnCard({ label, value }) {
  const positive = value >= 0;
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 14,
        minWidth: 140,
        textAlign: "center",
        color: "#fff",
        background: positive
          ? "linear-gradient(135deg,#16a34a,#22c55e)"
          : "linear-gradient(135deg,#dc2626,#ef4444)",
      }}
    >
      <div style={{ fontSize: 14 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>
        {value.toFixed(2)}%
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const panelStyle = {
  background: "#fff",
  padding: 25,
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  display: "flex",
  gap: 40,
  flexWrap: "wrap",
  marginTop: 20,
};

const cardStyle = {
  marginTop: 40,
  background: "#fff",
  padding: 30,
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const infoBox = {
  marginTop: 20,
  padding: 15,
  background: "#fef3c7",
  borderRadius: 10,
  fontWeight: 600,
};

const labelStyle = { fontWeight: 600 };

const inputStyle = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #ccc",
  minWidth: 240,
  marginTop: 6,
};

const periodBtn = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
};

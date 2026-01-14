import { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

export default function Portfolio() {
  const [stocks, setStocks] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [targetReturn, setTargetReturn] = useState(12);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------- LOAD STOCK LIST -------- */
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const res = await api.get("/stocks/list");
        setStocks(res.data);
      } catch {
        setError("Failed to load stock universe");
      }
    };
    loadStocks();
  }, []);

  /* -------- TOGGLE STOCK -------- */
  const toggleStock = (symbol) => {
    setSelected((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  /* -------- OPTIMIZE -------- */
  const optimize = async () => {
    if (selected.length < 2) {
      setError("Select at least 2 stocks");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.post("/portfolio/optimize", {
        symbols: selected,
        target_return: targetReturn / 100,
      });
      setResult(res.data);
    } catch {
      setError("Portfolio optimization failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = stocks.filter(
    (s) =>
      s.company.toLowerCase().includes(query.toLowerCase()) ||
      s.symbol.toLowerCase().includes(query.toLowerCase())
  );

  const allocationTable =
    result &&
    Object.entries(result.weights_percent).map(([k, v]) => ({
      symbol: k,
      weight: v,
    }));

  return (
    <div style={{ padding: 40, background: "#f8fafc", minHeight: "100vh" }}>
      {/* HEADER */}
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        💼 Portfolio Optimization
      </h1>
      <p style={{ color: "#555", maxWidth: 800 }}>
        Build an optimal portfolio using mean–variance optimization with
        institutional risk metrics. No short-selling allowed.
      </p>

      {/* ================= STOCK SELECTION ================= */}
      <div style={panelStyle}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Search & Select Stocks</label>
          <input
            placeholder="Search by company or symbol..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ ...inputStyle, width: "100%" }}
          />

          <div style={stockListStyle}>
            {filteredStocks.map((s) => (
              <div key={s.symbol} style={stockRow}>
                <input
                  type="checkbox"
                  checked={selected.includes(s.symbol)}
                  onChange={() => toggleStock(s.symbol)}
                />
                <span>
                  {s.company} <b>({s.symbol})</b>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TARGET RETURN */}
        <div>
          <label style={labelStyle}>
            Target Annual Return: {targetReturn}%
          </label>
          <input
            type="range"
            min="5"
            max="25"
            value={targetReturn}
            onChange={(e) => setTargetReturn(e.target.value)}
            style={{ width: 240 }}
          />
        </div>

        <button onClick={optimize} disabled={loading} style={buttonStyle}>
          {loading ? "Optimizing…" : "Optimize Portfolio"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <p style={{ color: "red", marginTop: 20, fontWeight: 600 }}>
          {error}
        </p>
      )}

      {/* ================= RESULTS ================= */}
      {result && (
        <>
          {/* ================= ALLOCATION ================= */}
          <div style={cardStyle}>
            <h2>📊 Investment Allocation</h2>

            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              {/* PIE */}
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={allocationTable}
                      dataKey="weight"
                      nameKey="symbol"
                      outerRadius={130}
                      label
                    >
                      {allocationTable.map((_, i) => (
                        <Cell
                          key={i}
                          fill={COLORS[i % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* TABLE */}
              <div style={{ flex: 1 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9" }}>
                      <th style={thStyle}>Stock</th>
                      <th style={thStyle}>Allocation (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocationTable.map((row) => (
                      <tr key={row.symbol}>
                        <td style={tdStyle}>{row.symbol}</td>
                        <td style={tdStyle}>{row.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ================= RISK METRICS ================= */}
          <div style={kpiGrid}>
            {Object.entries(result.metrics_percent).map(([k, v]) => (
              <KpiCard key={k} title={formatMetric(k)} value={v} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

const formatMetric = (k) =>
  ({
    expected_return: "Expected Return (%)",
    volatility: "Volatility (%)",
    sharpe: "Sharpe Ratio",
    sortino: "Sortino Ratio",
    max_drawdown: "Max Drawdown (%)",
    VaR: "VaR (95%)",
    CVaR: "CVaR (95%)",
  }[k] || k);

/* ================= STYLES ================= */

const panelStyle = {
  background: "#fff",
  padding: 25,
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  display: "flex",
  gap: 30,
  flexWrap: "wrap",
  alignItems: "flex-end",
  marginTop: 20,
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

const stockListStyle = {
  marginTop: 10,
  maxHeight: 220,
  overflowY: "auto",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: 10,
};

const stockRow = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "6px 0",
};

const labelStyle = {
  fontWeight: 600,
};

const inputStyle = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #ccc",
  marginTop: 6,
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

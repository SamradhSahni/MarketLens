import { useEffect, useState } from "react";
import api from "../services/api";

/* -------- Helper: convert centrality map → sorted array -------- */
const toSortedArray = (obj) =>
  Object.entries(obj || {})
    .map(([k, v]) => ({ symbol: k, value: v }))
    .sort((a, b) => b.value - a.value);

export default function Correlation() {
  const [stocks, setStocks] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [threshold, setThreshold] = useState(0.4);
  const [centrality, setCentrality] = useState(null);
  const [plotUrl, setPlotUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD STOCK LIST ---------------- */
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const res = await api.get("/stocks/list");

        // remove TMPV if present
        const cleaned = res.data.filter((s) => s.symbol !== "TMPV");

        setStocks(cleaned);
        setSelected(cleaned.slice(0, 6).map((s) => s.symbol));
      } catch {
        setError("Failed to load stock universe");
      }
    };
    loadStocks();
  }, []);

  const toggleStock = (symbol) => {
    setSelected((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  /* ---------------- BUILD NETWORK ---------------- */
  const buildNetwork = async () => {
    if (selected.length < 3) {
      setError("Select at least 3 stocks");
      return;
    }

    setLoading(true);
    setError("");
    setCentrality(null);
    setPlotUrl(null);

    try {
      // 1️⃣ Get numerical metrics
      const res = await api.post("/correlation/network", {
        symbols: selected,
        threshold,
      });

      setCentrality(res.data.centrality);

      // 2️⃣ Get Python-rendered graph image
      setPlotUrl(
        `http://localhost:8000/correlation/plot?ts=${Date.now()}`
      );
    } catch {
      setError("Correlation analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = stocks.filter(
    (s) =>
      s.company.toLowerCase().includes(query.toLowerCase()) ||
      s.symbol.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ padding: 40, background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        🔗 Stock Correlation Network
      </h1>
      <p style={{ color: "#555", maxWidth: 900 }}>
        Correlation network built using log returns and weighted graph theory.
        Visualization is rendered in Python (NetworkX) for accuracy.
      </p>

      {/* ---------------- CONTROLS ---------------- */}
      <div style={panelStyle}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Search & Select Stocks</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company or symbol..."
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

        <div>
          <label style={labelStyle}>
            Correlation Threshold: {threshold}
          </label>
          <input
            type="range"
            min="0.3"
            max="0.9"
            step="0.05"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            style={{ width: 240 }}
          />
        </div>

        <button onClick={buildNetwork} style={buttonStyle} disabled={loading}>
          {loading ? "Analyzing…" : "Build Network"}
        </button>
      </div>

      {error && <div style={infoBox}>{error}</div>}

      {/* ---------------- PYTHON GRAPH ---------------- */}
      {plotUrl && (
        <div style={cardStyle}>
          <h2>🌐 Correlation Network (Python)</h2>
          <p style={{ color: "#64748b", marginBottom: 15 }}>
            Node size = Eigenvector Centrality | Green edges = Positive
            correlation | Red edges = Negative correlation
          </p>

          <img
            src={plotUrl}
            alt="Correlation Network"
            style={{
              width: "100%",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
            }}
          />
        </div>
      )}

      {/* ---------------- CENTRALITY TABLES ---------------- */}
      {centrality && (
        <div style={cardStyle}>
          <h2>📊 Centrality Metrics</h2>

          <CentralityTable
            title="Degree Centrality"
            data={toSortedArray(centrality.degree)}
          />
          <CentralityTable
            title="Betweenness Centrality"
            data={toSortedArray(centrality.betweenness)}
          />
          <CentralityTable
            title="Eigenvector Centrality"
            data={toSortedArray(centrality.eigenvector)}
          />
          <CentralityTable
            title="PageRank"
            data={toSortedArray(centrality.pagerank)}
          />
        </div>
      )}
    </div>
  );
}

/* ---------------- TABLE COMPONENT ---------------- */
function CentralityTable({ title, data }) {
  return (
    <>
      <h3 style={{ marginTop: 25 }}>{title}</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f1f5f9" }}>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.symbol}>
              <td style={tdStyle}>{row.symbol}</td>
              <td style={tdStyle}>{row.value.toFixed(6)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/* ---------------- STYLES ---------------- */

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

const infoBox = {
  marginTop: 20,
  padding: 15,
  background: "#fef3c7",
  borderRadius: 10,
  fontWeight: 600,
};

const stockListStyle = {
  marginTop: 10,
  maxHeight: 240,
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

const labelStyle = { fontWeight: 600 };

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

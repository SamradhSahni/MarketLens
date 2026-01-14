import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SectorOverview() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSectors = async () => {
      setLoading(true);
      try {
        const res = await api.get("/sector/overview");

        // 🔥 Convert object → array
        const formatted = Object.entries(res.data).map(
          ([sector, value]) => ({
            sector,
            avg_return: value,
          })
        );

        setSectors(formatted);
      } catch {
        setError("Failed to load sector overview");
      } finally {
        setLoading(false);
      }
    };

    loadSectors();
  }, []);

  return (
    <div style={{ padding: 40, background: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        🏭 Sector Performance Overview
      </h1>
      <p style={{ color: "#555", maxWidth: 900 }}>
        Sector-wise returns aggregated from constituent Nifty-50 stocks.
      </p>

      {loading && <p>Loading sector data…</p>}
      {error && <div style={infoBox}>{error}</div>}

      {sectors.length > 0 && (
        <>
          {/* KPI CARDS */}
          <div style={kpiGrid}>
            {sectors.map((s) => (
              <KpiCard
                key={s.sector}
                title={s.sector}
                value={`${s.avg_return.toFixed(2)} %`}
                positive={s.avg_return >= 0}
              />
            ))}
          </div>

          {/* BAR CHART */}
          <div style={cardStyle}>
            <h2>📊 Average Return by Sector</h2>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={sectors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="sector"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                />
                <YAxis tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => `${v.toFixed(2)} %`} />
                <Bar
                  dataKey="avg_return"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function KpiCard({ title, value, positive }) {
  return (
    <div style={kpiCard}>
      <p style={{ fontSize: 12, color: "#64748b" }}>{title}</p>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: positive ? "#16a34a" : "#dc2626",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 20,
  marginTop: 30,
};

const cardStyle = {
  marginTop: 40,
  background: "#fff",
  padding: 30,
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const kpiCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
};

const infoBox = {
  marginTop: 20,
  padding: 15,
  background: "#fef3c7",
  borderRadius: 10,
  fontWeight: 600,
};

import { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function IndexOverview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/index/overview")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load index data"));
  }, []);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading...</p>;

  const { summary, history } = data;

  return (
    <div style={{ padding: 40 }}>
      <h2>📈 Nifty Index Overview</h2>

      <div style={{ display: "flex", gap: "30px", marginBottom: "30px" }}>
        <div>
          <h3>Last Close</h3>
          <p>{summary.lastClose}</p>
        </div>
        <div>
          <h3>Change</h3>
          <p>
            {summary.change} ({summary.changePct}%)
          </p>
        </div>
      </div>

      <h3>Index Trend (Last 100 Days)</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={history}>
          <XAxis dataKey="Date" hide />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="Close"
            stroke="#2563eb"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

import DashboardCard from "../components/DashboardCard";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.post("/auth/logout");
    logoutUser();
    navigate("/login");
  };

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Welcome, {user.name}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <p style={{ marginBottom: 30 }}>
        Nifty 50 Analytics & Machine Learning Dashboard
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        <DashboardCard
          title="📈 Index Overview"
          description="Market summary, returns, gainers & losers"
          route="/index"
        />

        <DashboardCard
          title="🏢 Stock Analysis"
          description="Individual stock performance and trends"
          route="/stocks"
        />

        <DashboardCard
          title="🏭 Sector Overview"
          description="Sector-wise performance analysis"
          route="/sectors"
        />

        <DashboardCard
          title="📊 Stock Comparison"
          description="Compare two stocks across time"
          route="/compare"
        />

        <DashboardCard
          title="📉 Stock Prediction"
          description="ML-based price prediction using LSTM"
          route="/predict"
        />

        <DashboardCard
          title="💼 Portfolio Optimization"
          description="Risk-return optimized portfolio allocation"
          route="/portfolio"
        />

        <DashboardCard
          title="🔗 Correlation Network"
          description="Market correlation & influence analysis"
          route="/correlation"
        />
      </div>
    </div>
  );
}

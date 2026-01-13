import { useNavigate } from "react-router-dom";

export default function DashboardCard({ title, description, route }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(route)}
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: "14px", color: "#555" }}>{description}</p>
    </div>
  );
}

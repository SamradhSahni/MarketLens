import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

import IndexOverview from "./pages/Index";
import StockAnalysis from "./pages/StockAnalysis";
import SectorOverview from "./pages/SectorOverview";
// import StockComparison from "./pages/StockComparison";
import Prediction from "./pages/Prediction";
import Portfolio from "./pages/Portfolio";
import Correlation from "./pages/Correlation";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Feature Pages */}
        <Route path="/index" element={<ProtectedRoute><IndexOverview /></ProtectedRoute>} />
        <Route path="/stocks" element={<ProtectedRoute><StockAnalysis /></ProtectedRoute>} />
        <Route path="/sectors" element={<ProtectedRoute><SectorOverview /></ProtectedRoute>} />
        {/* <Route path="/compare" element={<ProtectedRoute><StockComparison /></ProtectedRoute>} /> */}
        <Route path="/predict" element={<ProtectedRoute><Prediction /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/correlation" element={<ProtectedRoute><Correlation /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

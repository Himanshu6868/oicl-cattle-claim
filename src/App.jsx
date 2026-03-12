import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CattleReidentification from "./pages/CattleReidentification";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/cattle-reidentification"
          element={<CattleReidentification />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
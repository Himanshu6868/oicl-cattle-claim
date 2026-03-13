import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CattleReidentification from "./pages/CattleReidentification";
import CattleReidentificationUpload from "./pages/CattleReidentificationUpload";
import CattleReidentificationResults from "./pages/CattleReidentificationResults";
import { isAuthenticated } from "./utils/auth";

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={(
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          )}
        />
        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/cattle-reidentification"
          element={(
            <ProtectedRoute>
              <CattleReidentification />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/cattle-reidentification/upload"
          element={(
            <ProtectedRoute>
              <CattleReidentificationUpload />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/cattle-reidentification-results"
          element={(
            <ProtectedRoute>
              <CattleReidentificationResults />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

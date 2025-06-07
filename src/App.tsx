import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import QuoteListPage from "./pages/QuoteListPage";
import AddQuotePage from "./pages/AddQuotePage";
import DashboardPage from "./pages/DashboardPage";
import EditQuotePage from "./pages/EditQuotePage";
import ProfilePage from "./pages/ProfilePage";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<QuoteListPage />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-quote"
        element={
          <ProtectedRoute>
            <AddQuotePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-quote/:id"
        element={
          <ProtectedRoute>
            <EditQuotePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="/quote/list" element={<QuoteListPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;

import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import QuoteListPage from "./pages/QuoteListPage";
import AddQuotePage from "./pages/AddQuotePage";
import DashboardPage from "./pages/DashboardPage";
import EditQuotePage from "./pages/EditQuotePage";
import ProfilePage from "./pages/ProfilePage";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<QuoteListPage />} />
        <Route path="/quote/list" element={<QuoteListPage />} />

        {/* Auth Routes - จะ redirect ถ้า login แล้ว */}
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

        {/* Protected Routes - ต้อง login ก่อน */}
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

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-4">Page not found</p>
                <a
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default App;

// App.jsx
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { CurrencyProvider } from "./components/CurrencyContext";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { TransactionsProvider } from "./components/TransactionContext"; // ✅ Import

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

// Redirect Logged-in Users from Login/Signup
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (user) return <Navigate to="/" replace />;

  return children;
}

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <TransactionsProvider> {/* ✅ Wrap app in TransactionsProvider */}
          <HashRouter>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </TransactionsProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;

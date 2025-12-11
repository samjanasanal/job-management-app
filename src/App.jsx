import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom"
import { ToastProvider } from "./context/ToastContext"
import LoginPage from "./pages/LoginPage"
import DashboardLayout from "./components/layout/DashboardLayout"
import DashboardPage from "./pages/DashboardPage"
import UsersPage from "./pages/UsersPage"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, admin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="loading-state">Loading your account...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }}/>;
  if (admin && user.role !== "admin") return <Navigate to="/" replace/>;
  return children;
}

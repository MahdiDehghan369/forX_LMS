import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Component that checks authentication and role for accessing a route.
 * If the user is not authenticated, redirects to /login.
 * Optionally can restrict based on role (passed via roleRequired prop).
 */
export function ProtectedRoute({ children, roleRequired }) {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a role is required, check if the user has that role
  if (roleRequired && !user?.role?.includes(roleRequired)) {
    // For this example, we simply redirect to a generic unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // If passed all checks, render the child component
  return children;
}
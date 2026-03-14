// components/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../lib/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  redirectTo = ROUTES.LOGIN,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
  // console.log("ProtectedRoute - isLoading:", isLoading);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

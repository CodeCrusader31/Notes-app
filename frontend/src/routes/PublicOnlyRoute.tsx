import { Navigate, Outlet } from "react-router-dom";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";

export function PublicOnlyRoute() {
  const { isAuthenticated, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
}

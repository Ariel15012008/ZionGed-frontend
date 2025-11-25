// src/lib/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import LoadingScreen from "@/components/LoadingScreen";

export function ProtectedRoute() {
  const { user, isLoading } = useUser();
  const isAuthenticated = !!user;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// src/lib/PublicRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import LoadingScreen from "@/components/LoadingScreen";

export function PublicRoute() {
  const { user, isLoading } = useUser();
  const isAuthenticated = !!user;


  if (isLoading) {
    return <LoadingScreen />;
  }

  // se já está logado, mandar pra home privada
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

// src/App.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";

import Home from "@/pages/publicHome/page";       // home pública (não logado)
import HomeSecurity from "@/pages/home/page";     // home protegida (logado)
import Login from "@/pages/login/page";
import Cadastro from "@/pages/register/page";

import { PublicRoute } from "./lib/PublicRoute";
import { ProtectedRoute } from "./lib/ProtectedRoute";
import LoadingScreen from "@/components/LoadingScreen";
import DocumentEditPage from "@/pages/Docs/EditDocument";
import { Toaster } from "sonner"; 

// Decide o que fazer na raiz "/"
function RootRoute() {
  const { user, isLoading } = useUser();
  const isAuthenticated = !!user;

  console.log("[RootRoute] render", { isLoading, isAuthenticated, user });

  if (isLoading) {
    return <LoadingScreen />;
  }

  // ✅ Se estiver logado, REDIRECIONA para /home (rota protegida)
  if (isAuthenticated) {
    console.log("[RootRoute] autenticado → Navigate /home");
    return <Navigate to="/home" replace />;
  }

  // ❌ Não logado → mostra a home pública
  console.log("[RootRoute] não autenticado → Home pública");
  return <Home />;
}

function App() {
  console.log("[App] render");

  return (
    <UserProvider>
      {/* Fragment só pra poder ter Routes + Toaster como filhos */}
      <>
        <Routes>
          {/* 1) Raiz decide: público ou redirect para /home */}
          <Route path="/" element={<RootRoute />} />

          {/* 2) Páginas de autenticação (só acessa se NÃO estiver logado) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Cadastro />} />
          </Route>

          {/* 3) ROTAS PROTEGIDAS (somente autenticado) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomeSecurity />} />
            <Route path="/documents/:uuid/edit" element={<DocumentEditPage />} />
          </Route>

          {/* 4) Qualquer outra rota volta para "/" */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toaster global do sonner */}
        <Toaster richColors />
      </>
    </UserProvider>
  );
}

export default App;

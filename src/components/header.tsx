// src/components/layout/Header.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/axiosInstance";

// shadcn/ui
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ícones
import { FaUserAlt } from "react-icons/fa";

type MeResponse = {
  id: number;
  email: string;
  pessoa?: {
    id: number | null;
    nome?: string | null;
  } | null;
};

export default function Header() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get<MeResponse>("/auth/me"); // envia cookie automaticamente
        if (mounted) setMe(data);
      } catch {
        // se não autenticado, mantém null (pode redirecionar se quiser)
        if (mounted) setMe(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignorar
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const displayName =
    (me?.pessoa?.nome && me.pessoa.nome.trim()) ||
    (me?.email ? me.email.split("@")[0] : "") ||
    "Usuário";

  const initials = (() => {
    const n = (me?.pessoa?.nome || "").trim();
    if (!n) return "US";
    const parts = n.split(/\s+/).slice(0, 2);
    return parts.map(p => p[0]?.toUpperCase()).join("");
  })();

  return (
    <header className="flex h-[65px] w-full items-center bg-linear-to-r from-[#42F51F] via-[#48cf3e] to-[#318844]">
      <div className="flex w-full items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-2xl md:text-3xl">ZionGed</h1>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-6 w-40 animate-pulse rounded bg-white/40" />
          ) : me ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 text-black hover:bg-white/30 cursor-pointer"
                >
                  <span className="hidden text-sm font-medium md:block">{displayName}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-white/80 text-black">
                      {initials || <FaUserAlt size={16} />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="min-w-56">
                <DropdownMenuLabel className="text-sm">
                  {displayName}
                  <div className="text-xs font-normal text-muted-foreground truncate">
                    {me.email}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/me")}>
                  Meu perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="secondary"
              className="bg-white/80 text-black hover:bg-white"
              onClick={() => navigate("/login")}
            >
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

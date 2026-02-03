import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

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
import { FaUserAlt } from "react-icons/fa";

export default function Header() {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useUser();

  const displayName = useMemo(() => {
    const nome = (user?.nome || "").trim();
    if (nome) return nome;

    const email = (user?.email || "").trim();
    if (email) return email.split("@")[0] || "Usuário";

    return "Usuário";
  }, [user?.nome, user?.email]);

  const initials = useMemo(() => {
    const n = (user?.nome || "").trim();
    if (!n) return "US";
    const parts = n.split(/\s+/).slice(0, 2);
    return parts.map((p) => (p[0] || "").toUpperCase()).join("") || "US";
  }, [user?.nome]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="flex h-[65px] w-full items-center bg-linear-to-r from-[#42F51F] via-[#48cf3e] to-[#318844]">
      <div className="flex w-full items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-3">
          <img
            className="max-h-56 pt-2 w-52"
            src="/logo.png"
            alt="logo do site"
            onError={(e) => {
              const img = e.currentTarget;
              img.style.display = "none";
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 text-black hover:bg-white/30 cursor-pointer"
                >
                  <span className="hidden text-sm font-medium md:block">
                    {displayName}
                  </span>
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
                    {user.email}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/me")}
                  className="cursor-pointer"
                >
                  Meu perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                >
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="secondary"
              className="bg-white/80 text-black hover:bg-white cursor-pointer"
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

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Menu,
  Home,
  FileText,
  Search,
  UploadCloud,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { label: "Início", to: "/", icon: <Home className="h-4 w-4" />, exact: true },
  { label: "Documentos", to: "/docs", icon: <FileText className="h-4 w-4" /> },
  {
    label: "Pesquisas salvas",
    to: "/saved-searches",
    icon: <Search className="h-4 w-4" />,
  },
  {
    label: "Uploads",
    to: "/uploads",
    icon: <UploadCloud className="h-4 w-4" />,
  },
  {
    label: "Configurações",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

type SideMenuProps = {
  topClass?: string;
};

export default function SideMenu({ topClass = "top-24" }: SideMenuProps) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen} >
      {/* Botão flutuante com estilo minimalista e elegante */}
      <SheetTrigger asChild>
        <button
          aria-label="Abrir menu"
          className={cn(
            "group fixed left-3 z-60 h-11 w-11 rounded-full overflow-hidden",
            "transition-all duration-300 ease-out",
            "active:scale-95 hover:scale-105 hover:cursor-pointer",
            topClass,
            open
              ? "scale-0 pointer-events-none opacity-0"
              : "scale-100 opacity-100"
          )}
        >
          {/* Sombra suave */}
          <span className="absolute inset-0 rounded-full shadow-lg shadow-slate-400/30" />

          {/* Fundo gradiente sutil */}
          <span className="absolute inset-0 rounded-full bg-linear-to-br from-slate-700 via-slate-800 to-slate-900" />

          {/* Camada de vidro/brilho */}
          <span className="absolute inset-[1.5px] rounded-full bg-[#9b9797] backdrop-blur-sm" />

          {/* Brilho diagonal no hover */}
          <span
            className="
              pointer-events-none absolute -left-1/2 top-0 h-full w-2/3
              translate-x-[-60%] rotate-12
              bg-linear-to-r from-white/0 via-white/20 to-white/0
              transition-transform duration-500 ease-out
              group-hover:translate-x-[180%]
            "
          />

          {/* Ícone */}
          <span
            className="
              relative z-10 flex h-full w-full items-center justify-center
              text-slate-100
              transition-all duration-300 ease-out
              group-hover:text-white
            "
          >
            <Menu className="h-5 w-5 transition-transform group-hover:scale-110 cursor-pointer" />
          </span>
        </button>
      </SheetTrigger>

      {/* Drawer lateral esquerdo */}
      <SheetContent
        side="left"
        className="w-[300px] p-0 transition-transform duration-200 data-[state=closed]:duration-200"
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-left">ZionGed</SheetTitle>
        </SheetHeader>

        <nav className="p-2">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname.startsWith(item.to);
            return (
              <SheetClose asChild key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm ",
                    active
                      ? "bg-green-100 text-green-900"
                      : "hover:bg-slate-100 text-slate-700"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        <div className="mt-auto p-2 border-t">
          <SheetClose asChild>
            <button
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-red-50 text-red-700"
              onClick={() => {
                // logout opcional
              }}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

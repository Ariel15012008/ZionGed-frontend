// src/pages/auth/LoginPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/utils/axiosInstance";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();

  const { refreshUser } = useUser();

  const normalizeUser = (u: string) => {
    const trimmed = u.trim();
    return /^\d[\d.\-\/]*$/.test(trimmed) ? trimmed.replace(/\D+/g, "") : trimmed;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!username || !password) {
      setErro("Informe usuário e senha.");
      return;
    }

    const payload = {
      usuario: normalizeUser(username),
      senha: password,
    };

    setLoading(true);
    try {
      await api.post("/auth/login", payload);

      // atualiza o contexto /auth/me
      await refreshUser();

      // manda direto para a home privada
      navigate("/home", { replace: true });
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Falha no login. Verifique suas credenciais.";
      setErro(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-[#44F01F] via-[#2ECC4A] to-[#2B8B49] flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white/95 shadow-[0_8px_24px_rgba(0,0,0,.18)] ring-1 ring-black/10">
        <div className="px-10 py-12">
          <h1 className="text-center text-3xl md:text-4xl font-bold text-black mb-10">
            Acesso ao sistema
          </h1>

          <form className="space-y-7" onSubmit={handleSubmit}>
            {erro && (
              <div className="rounded-md bg-red-50 text-red-700 px-4 py-3 text-sm">
                {erro}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="font-medium text-slate-700">
                Usuário (CPF ou e-mail)
              </label>
              <input
                id="username"
                type="text"
                placeholder="12545552155 ou user@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md bg-[#D9D9D9] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-500 outline-none ring-1 ring-transparent focus:ring-[#a3a3a3]"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="font-medium text-slate-700">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md bg-[#D9D9D9] px-4 py-3 pr-10 text-sm text-slate-800 placeholder:text-slate-500 outline-none ring-1 ring-transparent focus:ring-[#a3a3a3]"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 hover:text-slate-900 focus:outline-none hover:cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-linear-to-r from-[#4b933d] via-[#48cf3e] to-[#318844] hover:from-[#77b66c] hover:to-[#2a7a3e] text-black font-medium py-3 transition-colors disabled:opacity-70 hover:cursor-pointer"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>

            <p className="text-center text-sm text-slate-600">
              Não tem conta?{" "}
              <Link to="/register" className="text-green-700 underline">
                Registrar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// src/pages/auth/RegisterPage.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/utils/axiosInstance";

// shadcn + date-fns
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const onlyDigits = (v: string) => v.replace(/\D+/g, "");
const onlyLetters = (v: string) => v.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s']/g, "");

const formatCPF = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  const p1 = d.slice(0, 3);
  const p2 = d.slice(3, 6);
  const p3 = d.slice(6, 9);
  const p4 = d.slice(9, 11);
  if (d.length <= 3) return p1;
  if (d.length <= 6) return `${p1}.${p2}`;
  if (d.length <= 9) return `${p1}.${p2}.${p3}`;
  return `${p1}.${p2}.${p3}-${p4}`;
};

const formatPhoneBR = (v: string) => {
  const d = onlyDigits(v).slice(0, 11); // 10 ou 11
  const ddd = d.slice(0, 2);
  const meio = d.length > 10 ? d.slice(2, 7) : d.slice(2, 6);
  const fim = d.length > 10 ? d.slice(7, 11) : d.slice(6, 10);
  if (!d.length) return "";
  if (d.length <= 2) return `(${ddd}`;
  if (d.length <= (d.length > 10 ? 7 : 6)) return `(${ddd}) ${meio}`;
  return `(${ddd}) ${meio}-${fim}`;
};

// helpers para converter entre string ISO (yyyy-MM-dd) e Date
const toISO = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");
const fromISO = (s: string) => (s ? new Date(`${s}T00:00:00`) : null);

// hook simples de media query
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [query]);
  return matches;
}

export default function RegisterPage() {
  // usuario
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // pessoa
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState(""); // YYYY-MM-DD (ISO)
  const [telefone, setTelefone] = useState("");

  // ui
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [openCalendar, setOpenCalendar] = useState(false); // controla o Popover do calendário
  const navigate = useNavigate();

  const selectedDate = fromISO(dataNascimento);
  const isNarrow = useMediaQuery("(max-width: 1024px)"); // < sm

  const blockNonDigitKeys: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (allowed.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setOkMsg(null);

    const cpfDigits = onlyDigits(cpf);
    const telDigits = onlyDigits(telefone);

    if (!email || !senha || !nome || !cpfDigits) {
      setErro("Preencha Email, Senha, Nome e CPF.");
      return;
    }
    if (cpfDigits.length !== 11) {
      setErro("CPF deve conter 11 dígitos.");
      return;
    }
    if (telDigits && telDigits.length < 10) {
      setErro("Telefone deve conter DDD + número (10 ou 11 dígitos).");
      return;
    }

    const payload = {
      pessoa: {
        nome: nome.trim(),
        cpf: cpfDigits,
        data_nascimento: dataNascimento || null,
        telefone: telDigits || null,
      },
      usuario: {
        email: email.trim(),
        senha,
      },
    };

    setLoading(true);
    try {
      await api.post("/auth/register", payload);
      setOkMsg("Cadastro realizado com sucesso!");
      navigate("/login", { replace: true });
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Falha ao registrar. Verifique os dados e tente novamente.";
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
            Registro
          </h1>

          <form className="space-y-7" onSubmit={handleSubmit}>
            {/* feedback */}
            {erro && (
              <div className="rounded-md bg-red-50 text-red-700 px-4 py-3 text-sm">
                {erro}
              </div>
            )}
            {okMsg && (
              <div className="rounded-md bg-green-50 text-green-700 px-4 py-3 text-sm">
                {okMsg}
              </div>
            )}

            {/* Usuário */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold text-slate-900">Dados de acesso</h2>

              <div className="space-y-2">
                <label htmlFor="email" className="font-medium text-slate-700">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md bg-[#D9D9D9] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-500 outline-none ring-1 ring-transparent focus:ring-[#a3a3a3]"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="senha" className="font-medium text-slate-700">Senha</label>
                <input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full rounded-md bg-[#D9D9D9] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-500 outline-none ring-1 ring-transparent focus:ring-[#a3a3a3]"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {/* Pessoa */}
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold text-slate-900">Dados pessoais</h2>

              <div className="space-y-2">
                <label htmlFor="nome" className="font-medium text-slate-700">Nome</label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(onlyLetters(e.target.value))}
                  className="w-full rounded-md bg-[#D9D9D9] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-500 outline-none ring-1 ring-transparent focus:ring-[#a3a3a3]"
                  autoComplete="name"
                  inputMode="text"
                  pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s']+$"
                  title="Use apenas letras"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="cpf" className="font-medium text-slate-700">CPF</label>
                  <input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    onKeyDown={blockNonDigitKeys}
                    className="w-full rounded-md bg-[#D9D9D9] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-500 outline-none ring-1 ring-transparent focus:ring-[#a3a3a3]"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={14} // com máscara
                    required
                  />
                </div>

                {/* Date Picker (shadcn) – RESPONSIVO */}
                <div className="space-y-2">
                  <label htmlFor="data_nascimento" className="font-medium text-slate-700">
                    Data de nascimento
                  </label>

                  <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        id="data_nascimento"
                        className={`w-full rounded-md bg-[#D9D9D9] px-4 py-3 text-sm placeholder:text-slate-500 outline-none ring-1 ring-transparent focus:ring-[#a3a3a3] text-left ${
                          !selectedDate ? "text-slate-500" : "text-slate-800"
                        }`}
                      >
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {selectedDate
                              ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                              : "Selecionar data"}
                          </span>
                        </div>
                      </button>
                    </PopoverTrigger>

                    <PopoverContent
                      className={`z-50 p-0 bg-[#d3d2d2] border shadow-md max-h-[70vh] overflow-auto ${
                        isNarrow ? "w-[calc(100-4rem)]" : "w-auto"
                      }`}
                      align={isNarrow ? "center" : "center"}
                      side={isNarrow ? "top" : "right"}
                      sideOffset={isNarrow ? 4 : 8}
                      avoidCollisions={false}
                      updatePositionStrategy="always"
                    >
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        selected={selectedDate ?? undefined}
                        onSelect={(d) => {
                          setDataNascimento(toISO(d ?? null)); // mantém YYYY-MM-DD
                          setOpenCalendar(false);               // fecha ao selecionar
                        }}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="telefone" className="font-medium text-slate-700">Telefone</label>
                <input
                  id="telefone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(formatPhoneBR(e.target.value))}
                  onKeyDown={blockNonDigitKeys}
                  className="w-full rounded-md bg-[#D9D9D9] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-500 outline-none ring-1 ring-transparent focus:ring-[#a3a3a3]"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={15} // (99) 99999-9999
                />
              </div>
            </div>

            {/* Botão Registrar */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-linear-to-r from-[#4b933d] via-[#48cf3e] to-[#318844] hover:from-[#77b66c] hover:to-[#2a7a3e] hover:cursor-pointer text-black font-medium py-3 transition-colors disabled:opacity-70"
              >
                {loading ? "Registrando..." : "Registrar"}
              </button>
            </div>

            <p className="text-center text-sm text-slate-600">
              Já tem conta?{" "}
              <Link to="/login" className="text-green-700 underline">Entrar</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

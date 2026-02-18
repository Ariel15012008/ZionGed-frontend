// src/pages/document-edit/page.tsx
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SideMenu from "@/components/side-menu";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { DocumentRecord } from "@/components/search-input";
import api from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";

type LocationState = {
  doc?: DocumentRecord;
};

function formatCpf(digits: string): string {
  const onlyDigits = digits.replace(/\D/g, "").slice(0, 11);

  if (onlyDigits.length <= 3) {
    return onlyDigits;
  }
  if (onlyDigits.length <= 6) {
    return `${onlyDigits.slice(0, 3)}.${onlyDigits.slice(3)}`;
  }
  if (onlyDigits.length <= 9) {
    return `${onlyDigits.slice(0, 3)}.${onlyDigits.slice(3, 6)}.${onlyDigits.slice(
      6
    )}`;
  }
  return `${onlyDigits.slice(0, 3)}.${onlyDigits.slice(3, 6)}.${onlyDigits.slice(
    6,
    9
  )}-${onlyDigits.slice(9, 11)}`;
}

function formatCompetencia(digits: string): string {
  const onlyDigits = digits.replace(/\D/g, "").slice(0, 6);

  if (onlyDigits.length <= 4) {
    return onlyDigits;
  }
  return `${onlyDigits.slice(0, 4)}-${onlyDigits.slice(4)}`;
}

export default function DocumentEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { doc } = (location.state as LocationState) || {};

  const [isSaving, setIsSaving] = useState(false);

  const [filename, setFilename] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [cpf, setCpf] = useState("");
  const [competencia, setCompetencia] = useState("");
  const [proprietario, setProprietario] = useState("");

  useEffect(() => {
    if (!doc) {
      toast.error("Nenhum documento selecionado para edição.");
      return;
    }

    setFilename(doc.filename ?? "");

    setTipoDocumento(
      getTagValue(doc, "tipo de documento") || getTagValue(doc, "tipo")
    );

    const cpfValue = getTagValue(doc, "cpf");
    setCpf(formatCpf(cpfValue));

    const compValue = getTagValue(doc, "competencia");
    setCompetencia(formatCompetencia(compValue));

    setProprietario(getTagValue(doc, "proprietario") || getTagValue(doc, "Owner"));
  }, [doc]);

  const handleCpfChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    setCpf(formatCpf(digits));
  };

  const handleCompetenciaChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setCompetencia(formatCompetencia(digits));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!doc) return;

    const cpfRaw = cpf.replace(/\D/g, "");
    const competenciaRaw = competencia.replace(/\D/g, "");

    if (cpfRaw.length !== 11 || competenciaRaw.length !== 6) {
      toast.error("CPF deve ter 11 dígitos e Competência no formato YYYY-MM.");
      return;
    }

    const payload = {
      filename: filename.trim(),
      tags: [
        { chave: "tipo", valor: tipoDocumento.trim() },
        { chave: "cpf", valor: cpfRaw },
        { chave: "competencia", valor: competenciaRaw },
        { chave: "proprietario", valor: proprietario.trim() },
      ].filter((t) => t.valor !== ""),
    };

    try {
      setIsSaving(true);

      await api.put(`/documents/${doc.uuid}/update`, payload);

      toast.success("Documento atualizado com sucesso.");
      navigate(-1);
    } catch (err) {
      console.error("Erro ao atualizar documento", err);
      toast.error("Não foi possível atualizar o documento. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const cpfDigits = cpf.replace(/\D/g, "");
  const competenciaDigits = competencia.replace(/\D/g, "");
  const isFormValid = cpfDigits.length === 11 && competenciaDigits.length === 6;

  if (!doc) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col">
        <Header />

        <div>
          <SideMenu topClass="top-20" />
        </div>

        <main className="flex-1 flex items-center justify-center px-4 bg-slate-50">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-md text-center transition-transform duration-300 hover:-translate-y-1">
            <p className="mb-4 text-sm text-slate-600">
              Nenhum documento foi informado para edição.
            </p>
            <Button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full px-5 py-2.5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer "
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <Header />

      <div>
        <SideMenu topClass="top-20" />
      </div>

      <main className="flex-1 bg-slate-50">
        <section className="w-full max-w-6xl mx-auto px-4 lg:px-6 pt-8 lg:pt-10 pb-12 flex flex-col">
          {/* topo com botão voltar + info do arquivo */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2  border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-sm cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 mt-10"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </div>
          </div>

          {/* card principal, no mesmo estilo do card de resultados da Home */}
          <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden transition-transform duration-300 hover:-translate-y-1">
            <div className="px-6 sm:px-10 pt-6 sm:pt-8 pb-4 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-center sm:text-left text-xl sm:text-2xl font-semibold text-slate-800">
                  Edição de documento
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 text-center sm:text-right">
                  Atualize as informações principais deste arquivo para facilitar a busca e a organização no GED.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="px-6 sm:px-10 py-6 sm:py-8 space-y-5 sm:space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <FormRow label="Nome do arquivo">
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="holerite_786655_202507.pdf"
                  />
                </FormRow>

                <FormRow label="Tipo de documento">
                  <input
                    type="text"
                    value={tipoDocumento}
                    onChange={(e) => setTipoDocumento(e.target.value)}
                    className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Holerite"
                  />
                </FormRow>

                <FormRow label="CPF">
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => handleCpfChange(e.target.value)}
                    className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duração-200"
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </FormRow>

                <FormRow label="Competência (Ano-Mês)">
                  <input
                    type="text"
                    value={competencia}
                    onChange={(e) => handleCompetenciaChange(e.target.value)}
                    className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duração-200"
                    placeholder="2025-07"
                    maxLength={7}
                  />
                </FormRow>

                <FormRow label="Proprietário">
                  <input
                    type="text"
                    value={proprietario}
                    onChange={(e) => setProprietario(e.target.value)}
                    className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duração-200"
                    placeholder="Gustavo Muniz"
                  />
                </FormRow>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  type="submit"
                  disabled={isSaving || !isFormValid}
                  className="w-full sm:w-56 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm sm:text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-70 disabled:cursor-not-allowed shadow-sm transition-transform duração-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>Concluir ✓</>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  variant="outline"
                  className="w-full sm:w-56 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm sm:text-base font-semibold border-red-500 text-red-600 bg-white hover:bg-red-50 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm transition-transform duração-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  Cancelar ✕
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FormRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <span className="text-[11px] sm:text-xs font-medium tracking-wide text-slate-600 uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

function getTagValue(doc: DocumentRecord, chave: string): string {
  return doc.tags.find((t) => t.chave === chave)?.valor ?? "";
}

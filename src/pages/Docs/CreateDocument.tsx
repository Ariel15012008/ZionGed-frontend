// src/pages/docs/CreateDocument.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SideMenu from "@/components/side-menu";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";

export default function CreateDocument() {
  const [tipoDocumento, setTipoDocumento] = useState("Holerite");
  const [clienteId, setClienteId] = useState("5238");
  const [cpf, setCpf] = useState("");
  const [competencia, setCompetencia] = useState(""); // formato: 2025-07
  const [dataPagamento, setDataPagamento] = useState("");
  const [dataCriacao, setDataCriacao] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Selecione um arquivo PDF.");
      return;
    }
    if (!cpf || !competencia) {
      toast.error("Informe pelo menos CPF e Competência.");
      return;
    }

    try {
      setSaving(true);

      const meta: any = {
        cliente_id: Number(clienteId),
        tags: [
          { chave: "tipo", valor: tipoDocumento },
          { chave: "cpf", valor: cpf },
          { chave: "competencia", valor: competencia },
        ],
      };

      // se quiser mandar as datas como tags extras (opcionais)
      if (dataPagamento) {
        meta.tags.push({
          chave: "data_pagamento",
          valor: dataPagamento,
        });
      }
      if (dataCriacao) {
        meta.tags.push({
          chave: "data_criacao",
          valor: dataCriacao,
        });
      }

      const formData = new FormData();
      formData.append("meta", JSON.stringify(meta));
      formData.append("file", file);

      await api.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Documento criado com sucesso.");
      navigate("/home");
    } catch (err) {
      console.error("Erro ao criar documento", err);
      toast.error("Não foi possível criar o documento. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <Header />

      <div className="">
        <SideMenu topClass="top-20" />
      </div>

      <main className="flex-1">
        <section className="w-full max-w-4xl mx-auto px-4 py-10">
          <button
            type="button"
            onClick={handleBack}
            className="mb-4 text-sm text-emerald-700 hover:underline"
          >
            ← Voltar
          </button>

          <form
            onSubmit={handleSubmit}
            className="bg-slate-50 rounded-2xl shadow-md border border-slate-200 px-6 sm:px-8 py-6 sm:py-8"
          >
            <h1 className="text-lg sm:text-xl font-semibold text-center mb-6">
              Criação de documento
            </h1>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de documento
                </label>
                <select
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  className="w-full rounded-md bg-slate-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Holerite">Holerite</option>
                  {/* futuramente outros tipos */}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cliente (ID)
                </label>
                <input
                  type="text"
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full rounded-md bg-slate-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="w-full rounded-md bg-slate-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Apenas números"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Competência (Ano-Mês)
                </label>
                <input
                  type="month"
                  value={competencia}
                  onChange={(e) => setCompetencia(e.target.value)}
                  className="w-full rounded-md bg-slate-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Data de Pagamento (opcional)
                  </label>
                  <input
                    type="date"
                    value={dataPagamento}
                    onChange={(e) => setDataPagamento(e.target.value)}
                    className="w-full rounded-md bg-slate-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Data de Criação (opcional)
                  </label>
                  <input
                    type="date"
                    value={dataCriacao}
                    onChange={(e) => setDataCriacao(e.target.value)}
                    className="w-full rounded-md bg-slate-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Arquivo PDF
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="submit"
                disabled={saving}
                className="min-w-[140px] px-6 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Salvando..." : "Concluir ✓"}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="min-w-[140px] px-6 py-2 rounded-full bg-red-100 text-red-700 text-sm font-semibold hover:bg-red-200 transition-colors"
              >
                Cancelar ✕
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// src/pages/home/page.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import ImagePasta from "@/assets/Rectangle 8.jpg";
import SearchInput, { type DocumentRecord } from "@/components/search-input";
import Footer from "@/components/footer";
import SideMenu from "@/components/side-menu";
import { Download, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/utils/axiosInstance";

export default function Home() {
  const [results, setResults] = useState<DocumentRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | number | null>(
    null
  );

  const navigate = useNavigate();

  const getTagValue = (doc: DocumentRecord, chave: string) =>
    doc.tags.find((t) => t.chave === chave)?.valor ?? "";

  const getOwner = (doc: DocumentRecord) => {
    return (
      getTagValue(doc, "Owner") ||
      getTagValue(doc, "proprietario") ||
      getTagValue(doc, "proprietário") ||
      getTagValue(doc, "dono") ||
      getTagValue(doc, "responsavel") ||
      getTagValue(doc, "responsável") ||
      ""
    );
  };

  const formatDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("pt-BR");
  };

  const handleDownload = async (doc: DocumentRecord) => {
    try {
      setDownloadingId(doc.id);

      const res = await api.get(`/documents/${doc.uuid}/download`, {
        responseType: "blob",
      });

      const blob = res.data as Blob;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.filename ?? "documento.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao baixar documento", err);
      toast.error("Não foi possível baixar o documento. Tente novamente.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleEdit = (doc: DocumentRecord) => {
    navigate(`/documents/${doc.uuid}/edit`, {
      state: { doc },
    });
  };

  const deleteDocument = async (doc: DocumentRecord) => {
    try {
      await api.delete(`/documents/${doc.uuid}/delete`);

      setResults((prev) => prev.filter((d) => d.id !== doc.id));

      toast.success("Documento excluído com sucesso.");
    } catch (err) {
      console.error("Erro ao excluir documento", err);
      toast.error("Não foi possível excluir o documento. Tente novamente.");
    }
  };

  const handleDelete = (doc: DocumentRecord) => {
    const tipo =
      getTagValue(doc, "tipo de documento") ||
      getTagValue(doc, "tipo") ||
      "Documento";

    const owner = getOwner(doc);
    const created = formatDate(doc.criado_em);

    toast(`Deseja realmente excluir este documento?`, {
      description: owner
        ? `${tipo} (Owner: ${owner}) criado em ${created}.`
        : `${tipo} criado em ${created}.`,
      action: {
        label: "Excluir",
        onClick: () => deleteDocument(doc),
      },
      dismissible: true,
      style: {
        backgroundColor: "#dc2626",
        color: "#fff",
        border: "none",
      },
    });
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <Header />

      <div className="">
        <SideMenu topClass="top-20" />
      </div>

      <main className="flex-1">
        <section className="relative w-full pb-16 sm:pb-20 md:pb-24 lg:pb-28">
          <img
            src={ImagePasta}
            alt="imagem de uma pessoa segurando uma pasta"
            className="w-full h-[220px] md:h-[260px] lg:h-[300px] object-cover select-none"
          />

          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] sm:w-[85%] md:w-[70%] max-w-3xl px-3">
            <SearchInput
              onSearchResults={setResults}
              onSearchingChange={setIsSearching}
            />
          </div>
        </section>

        <section className="w-full max-w-5xl mx-auto px-4 pb-12 mt-6 sm:mt-4">
          {isSearching && (
            <p className="mb-4 text-sm text-slate-600">
              Buscando documentos, aguarde...
            </p>
          )}

          {!isSearching && results.length === 0 && (
            <p className="mb-4 text-sm text-slate-500">
              Nenhum documento encontrado. Informe um valor e clique em
              &quot;Pesquisar&quot;.
            </p>
          )}

          {results.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b text-sm text-slate-700">
                {results.length === 1 ? (
                  <>
                    {getTagValue(results[0], "tipo de documento") ||
                      getTagValue(results[0], "tipo") ||
                      "Documento"}{" "}
                    criado em {formatDate(results[0].criado_em)}
                    {getOwner(results[0]) ? ` (Owner: ${getOwner(results[0])})` : ""}{" "}
                    com{" "}
                    {getTagValue(results[0], "cpf")
                      ? `CPF ${getTagValue(results[0], "cpf")}`
                      : "os parâmetros informados"}
                    .
                  </>
                ) : (
                  <>Foram encontrados {results.length} documentos.</>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold text-slate-700">
                        Tipo de documento
                      </th>
                      <th className="text-left px-6 py-3 font-semibold text-slate-700">
                        Competência
                      </th>
                      <th className="text-left px-6 py-3 font-semibold text-slate-700">
                        CPF
                      </th>
                      <th className="text-left px-6 py-3 font-semibold text-slate-700">
                        Owner
                      </th>
                      <th className="text-left px-6 py-3 font-semibold text-slate-700">
                        Data de criação
                      </th>
                      <th className="text-right px-32 py-3 font-semibold text-slate-700">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((doc) => {
                      const isThisDownloading = downloadingId === doc.id;
                      return (
                        <tr
                          key={doc.id}
                          className="border-t hover:bg-slate-50/60"
                        >
                          <td className="px-6 py-3">
                            {getTagValue(doc, "tipo de documento") ||
                              getTagValue(doc, "tipo") ||
                              "—"}
                          </td>
                          <td className="px-6 py-3">
                            {getTagValue(doc, "competencia") || "—"}
                          </td>
                          <td className="px-6 py-3">
                            {getTagValue(doc, "cpf") || "—"}
                          </td>
                          <td className="px-6 py-3">{getOwner(doc) || "—"}</td>
                          <td className="px-6 py-3">
                            {formatDate(doc.criado_em)}
                          </td>
                          <td className="px-6 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleDownload(doc)}
                                disabled={isThisDownloading}
                                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {isThisDownloading ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Baixando...
                                  </>
                                ) : (
                                  <>
                                    <Download className="w-4 h-4" />
                                    Baixar
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleEdit(doc)}
                                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors cursor-pointer"
                              >
                                <Pencil className="w-4 h-4" />
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(doc)}
                                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

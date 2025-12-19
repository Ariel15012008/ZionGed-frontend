// src/components/search-input.tsx
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import api from "@/utils/axiosInstance";

export interface DocumentTag {
  id: number;
  chave: string;
  valor: string;
}

export interface DocumentRecord {
  id: number;
  uuid: string;
  cliente_id: number;
  bucket_key: string;
  filename: string;
  content_type: string;
  tamanho_bytes: number;
  hash_sha256: string;
  criado_em: string;
  tags: DocumentTag[];
}

type SearchInputProps = {
  onSearchResults?: (docs: DocumentRecord[]) => void;
  onSearchingChange?: (isSearching: boolean) => void;
};

// valor interno para a opção "Busca Livre"
const FREE_SEARCH_KEY = "__free_search__";

type InputMode = "free" | "cpf" | "competencia" | "default";

function onlyDigits(v: string) {
  return v.replace(/\D+/g, "");
}

function formatCPF(digits: string) {
  const d = onlyDigits(digits).slice(0, 11);
  // ###.###.###-##
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(
    9,
    11
  )}`;
}

function sanitizeCompetencia(v: string) {
  // mantém apenas dígitos e barra
  let s = v.replace(/[^\d/]+/g, "");

  // remove barras extras (permitir no máximo 1)
  const parts = s.split("/");
  if (parts.length > 2) {
    s = parts[0] + "/" + parts.slice(1).join("");
  }

  // auto-inserir barra após 2 dígitos (MM/AAAA)
  const digits = s.replace(/\D+/g, "");
  if (digits.length >= 3 && !s.includes("/")) {
    s = digits.slice(0, 2) + "/" + digits.slice(2);
  } else {
    if (s.includes("/")) {
      const [mmRaw, yyyyRaw = ""] = s.split("/");
      const mm = onlyDigits(mmRaw).slice(0, 2);
      const yyyy = onlyDigits(yyyyRaw).slice(0, 4);
      s = mm + (mm.length === 2 || yyyy.length > 0 ? "/" : "") + yyyy;
    } else {
      s = digits.slice(0, 2);
    }
  }

  return s.slice(0, 7);
}

function isAllowedKey(e: React.KeyboardEvent<HTMLInputElement>) {
  if (
    e.ctrlKey ||
    e.metaKey ||
    e.altKey ||
    e.key === "Backspace" ||
    e.key === "Delete" ||
    e.key === "Tab" ||
    e.key === "Enter" ||
    e.key === "Escape" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight" ||
    e.key === "Home" ||
    e.key === "End"
  ) {
    return true;
  }
  return false;
}

export default function SearchInput({
  onSearchResults,
  onSearchingChange,
}: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [loadingTags, setLoadingTags] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputMode: InputMode = useMemo(() => {
    if (selectedTag === FREE_SEARCH_KEY) return "free";
    if (selectedTag === "cpf") return "cpf";
    if (selectedTag === "competencia") return "competencia";
    return "default";
  }, [selectedTag]);

  // Carrega as tags disponíveis
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoadingTags(true);

        const res = await api.get("/documents/tags");
        const data = res.data as { tags?: string[] };
        const tags: string[] = data?.tags ?? [];

        setTagOptions(tags);

        if (tags.length > 0) {
          setSelectedTag(tags.includes("cpf") ? "cpf" : tags[0]);
        } else {
          setSelectedTag(FREE_SEARCH_KEY);
        }
      } catch (err) {
        console.error("Erro ao carregar tags", err);
        setError("Não foi possível carregar as opções de pesquisa.");
        setSelectedTag(FREE_SEARCH_KEY);
      } finally {
        setLoadingTags(false);
      }
    };

    fetchTags();
  }, []);

  // Zera o input sempre que trocar a opção de pesquisa
  useEffect(() => {
    setSearchQuery("");
    setError(null);
  }, [selectedTag]);

  // Ao trocar o tipo, sanitiza o conteúdo atual
  useEffect(() => {
    setSearchQuery((prev) => {
      if (!prev) return prev;

      if (inputMode === "cpf") return formatCPF(prev);
      if (inputMode === "competencia") return sanitizeCompetencia(prev);
      return prev;
    });
  }, [inputMode]);

  const handleInputChange = (v: string) => {
    if (inputMode === "cpf") {
      // mantém máscara visual
      const digits = onlyDigits(v).slice(0, 11);
      setSearchQuery(formatCPF(digits));
      return;
    }

    if (inputMode === "competencia") {
      setSearchQuery(sanitizeCompetencia(v));
      return;
    }

    setSearchQuery(v);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isAllowedKey(e)) return;

    if (inputMode === "cpf") {
      // CPF: só dígitos (pontuação a máscara aplica sozinha)
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
      return;
    }

    if (inputMode === "competencia") {
      // competência: dígitos e "/"
      if (/^\d$/.test(e.key)) return;

      if (e.key === "/") {
        if (searchQuery.includes("/")) {
          e.preventDefault();
          return;
        }
        const digits = onlyDigits(searchQuery);
        if (digits.length < 1) e.preventDefault();
        return;
      }

      e.preventDefault();
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const value = searchQuery.trim();
    if (!value || !selectedTag) return;

    // validações mínimas
    if (inputMode === "cpf") {
      const cpfDigits = onlyDigits(value);
      if (cpfDigits.length !== 11) {
        setError("CPF deve conter 11 números.");
        return;
      }
    }

    if (inputMode === "competencia") {
      if (!/^\d{2}\/\d{4}$/.test(value)) {
        setError("Competência deve estar no formato MM/AAAA.");
        return;
      }
    }

    try {
      setSearching(true);
      setError(null);
      onSearchingChange?.(true);

      let params: Record<string, string> = {};

      if (selectedTag === FREE_SEARCH_KEY) {
        params = { q: value };
      } else {
        const tag_valor = inputMode === "cpf" ? onlyDigits(value) : value;

        params = {
          tag_chave: selectedTag,
          tag_valor,
        };
      }

      const res = await api.get<DocumentRecord[]>("/documents/search", {
        params,
      });

      onSearchResults?.(res.data);
    } catch (err) {
      console.error("Erro ao buscar documentos", err);
      setError("Erro ao buscar documentos. Tente novamente.");
      onSearchResults?.([]);
    } finally {
      setSearching(false);
      onSearchingChange?.(false);
    }
  };

  const placeholder = useMemo(() => {
    if (loadingTags) return "Carregando opções de pesquisa...";
    if (inputMode === "cpf") return "Digite o CPF";
    if (inputMode === "competencia") return "Digite a competência (MM/AAAA)";
    return "Digite o valor para pesquisar";
  }, [loadingTags, inputMode]);

  const inputModeAttr = useMemo(() => {
    if (inputMode === "cpf") return "numeric";
    if (inputMode === "competencia") return "numeric";
    return "text";
  }, [inputMode]);

  const maxLength = useMemo(() => {
    // CPF com máscara tem 14 chars
    if (inputMode === "cpf") return 14;
    if (inputMode === "competencia") return 7;
    return undefined;
  }, [inputMode]);

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col sm:flex-row items-stretch bg-white rounded-xl shadow-xl overflow-hidden">
        <Select
          value={selectedTag}
          onValueChange={(value) => setSelectedTag(value)}
          disabled={loadingTags}
        >
          <SelectTrigger
            className="
              w-full sm:w-auto sm:min-w-[140px]
              bg-[#f3f3f3]
              px-4
              py-7 sm:py-13
              text-sm md:text-base
              text-[#000000]
              border-0 shadow-none rounded-none
              focus:ring-0 focus:ring-offset-0 focus:outline-none
              data-placeholder:text-slate-400
              cursor-pointer
            "
          >
            <SelectValue
              placeholder={loadingTags ? "Carregando..." : "Campo de pesquisa"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer" value={FREE_SEARCH_KEY}>
              Busca Livre
            </SelectItem>

            {tagOptions.map((tag) => (
              <SelectItem className="cursor-pointer" key={tag} value={tag}>
                {tag.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex w-full items-stretch">
          <div className="relative flex-1">
            <input
              type="text"
              inputMode={inputModeAttr as any}
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={maxLength}
              placeholder={placeholder}
              className="
                peer w-full
                px-4 py-4 text-sm
                sm:px-6 sm:py-10 md:text-base
                text-[#000000] placeholder:text-[#b1b0b0]
                focus:outline-none bg-transparent
              "
              disabled={loadingTags}
            />

            <span
              className="
                pointer-events-none absolute
                left-4 right-3 bottom-3 h-0.5
                sm:left-6 sm:right-4 sm:bottom-9
                bg-[#D9D9D9] peer-focus:bg-[#b1b0b0] transition-colors
              "
            />
          </div>

          <button
            type="submit"
            disabled={searching || loadingTags}
            className="w-20 sm:w-36 bg-linear-to-r from-[#42F51F] via-[#48cf3e] to-[#318844] hover:to-green-800 hover:from-green-300 hover:via-green-500 text-white flex flex-col items-center justify-center gap-1 hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.4} />
            <span className="text-[10px] md:text-xs tracking-wide">
              {searching ? "Buscando..." : "Pesquisar"}
            </span>
          </button>
        </div>
      </div>

      {error && <p className="mt-2 text-xs sm:text-sm text-red-600">{error}</p>}
    </form>
  );
}

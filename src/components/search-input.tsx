// src/components/search-input.tsx
import { useEffect, useState } from "react";
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

  // Carrega as tags disponíveis: ["competencia","cpf","tipo", ...]
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoadingTags(true);

        const res = await api.get("/documents/tags");
        const data = res.data as { tags?: string[] };
        const tags: string[] = data?.tags ?? [];

        setTagOptions(tags);

        // default: se existir CPF, usa cpf; senão, primeira tag; se nada, usa busca livre
        if (tags.length > 0) {
          setSelectedTag(tags.includes("cpf") ? "cpf" : tags[0]);
        } else {
          setSelectedTag(FREE_SEARCH_KEY);
        }
      } catch (err) {
        console.error("Erro ao carregar tags", err);
        setError("Não foi possível carregar as opções de pesquisa.");
        // se der erro, ainda deixamos pelo menos Busca Livre
        setSelectedTag(FREE_SEARCH_KEY);
      } finally {
        setLoadingTags(false);
      }
    };

    fetchTags();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const value = searchQuery.trim();
    if (!value || !selectedTag) {
      return;
    }

    try {
      setSearching(true);
      setError(null);
      onSearchingChange?.(true);

      let params: Record<string, string> = {};

      if (selectedTag === FREE_SEARCH_KEY) {
        // Busca Livre -> só parâmetro q
        params = { q: value };
      } else {
        // Demais tags -> tag_chave + tag_valor (como antes)
        params = {
          tag_chave: selectedTag,
          tag_valor: value,
        };
      }

      const res = await api.get<DocumentRecord[]>("/documents/search", {
        params,
      });

      const docs = res.data;
      onSearchResults?.(docs);
    } catch (err) {
      console.error("Erro ao buscar documentos", err);
      setError("Erro ao buscar documentos. Tente novamente.");
      onSearchResults?.([]);
    } finally {
      setSearching(false);
      onSearchingChange?.(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      {/* Container: coluna no mobile, linha a partir de sm */}
      <div className="flex flex-col sm:flex-row items-stretch bg-white rounded-xl shadow-xl overflow-hidden">
        {/* SELECT da tag (cpf, competencia, tipo, etc.) usando shadcn */}
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
            {/* Opção manual: Busca Livre */}
            <SelectItem value={FREE_SEARCH_KEY}>Busca Livre</SelectItem>

            {/* Demais tags vindas da API */}
            {tagOptions.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Linha com input + botão (sempre juntos) */}
        <div className="flex w-full items-stretch">
          {/* wrapper relativo: o span ocupa exatamente a largura do INPUT (flex-1) */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                loadingTags
                  ? "Carregando opções de pesquisa..."
                  : "Digite o valor para pesquisar"
              }
              className="
                peer w-full
                px-4 py-4 text-sm            
                sm:px-6 sm:py-10 md:text-base  
                text-[#000000] placeholder:text-[#b1b0b0]
                focus:outline-none bg-transparent
              "
              disabled={loadingTags}
            />
            {/* linha responsiva (acompanha o padding e a altura do input) */}
            <span
              className="
                pointer-events-none absolute
                left-4 right-3 bottom-3 h-0.5   /* mobile */
                sm:left-6 sm:right-4 sm:bottom-9 /* md+ */
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

      {error && (
        <p className="mt-2 text-xs sm:text-sm text-red-600">{error}</p>
      )}
    </form>
  );
}

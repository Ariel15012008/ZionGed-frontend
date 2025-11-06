// src/components/search-input.tsx
import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchInput() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Pesquisando por:", searchQuery);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex items-stretch bg-white rounded-xl shadow-xl overflow-hidden">
        {/* wrapper relativo: o span ocupa exatamente a largura do INPUT (flex-1) */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Digite algo para pesquisar"
            className="
              peer w-full
              px-4 py-4 text-sm            
              sm:px-6 sm:py-10 md:text-base  
              text-[#000000] placeholder:text-[#b1b0b0]
              focus:outline-none bg-transparent
            "
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
          className="w-20 sm:w-36 bg-linear-to-r from-[#42F51F] via-[#48cf3e] to-[#318844] hover:to-green-800 hover:from-green-300 hover:via-green-500 text-white flex flex-col items-center justify-center gap-1 hover:cursor-pointer"
        >
          <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.4} />
          <span className="text-[10px] md:text-xs tracking-wide">Pesquisar</span>
        </button>
      </div>
    </form>
  );
}

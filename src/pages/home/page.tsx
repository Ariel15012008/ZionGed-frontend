// src/pages/home/page.tsx
import Header from "@/components/header";
import ImagePasta from "@/assets/Rectangle 8.jpg";
import SearchInput from "@/components/search-input";
import Footer from "@/components/footer";
import SideMenu from "@/components/side-menu";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <Header />

      {/* espaçamento global abaixo do header */}
      <div className="">
        {/* posiciona o botão do menu um pouco abaixo do header */}
        <SideMenu topClass="top-20" />
      </div>

      <main className="flex-1">
        {/* ↓ padding-bottom cria o espaço em branco sob o input em todos os breakpoints */}
        <section className="relative w-full pb-48 sm:pb-20 md:pb-24 lg:pb-28">
          <img
            src={ImagePasta}
            alt="imagem de uma pessoa segurando uma pasta"
            className="w-full h-[220px] md:h-[260px] lg:h-[300px] object-cover select-none"
          />

          {/* Barra de pesquisa central (inalterada) */}
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] sm:w-[85%] md:w-[70%] max-w-3xl px-3">
            <SearchInput />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

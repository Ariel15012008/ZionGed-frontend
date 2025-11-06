// src/components/footer.tsx

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Painel principal em degradê */}
      <section className="bg-linear-to-b from-emerald-100 to-emerald-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-center ">
          {/* Coluna esquerda */}
          <div className="flex justify-center items-center flex-col ">
            <h3 className="text-2xl font-semibold text-slate-800 mb-3">
              ZionGed
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed ">
              Organização e segurança para seus documentos.
            </p>
          </div>
        </div>
      </section>

      {/* Barra inferior */}
      <div className="bg-linear-to-b from-emerald-100 to-emerald-200/70 border-t border-[#b5aeaeb0] pt-2 ">
        <div className="pb-4 text-xs text-slate-400 flex flex-col items-center justify-center ">
          <div>© 2025 ZionGed — Todos os direitos reservados</div>
        </div>
      </div>
    </footer>
  );
}

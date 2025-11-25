// src/pages/home/PublicHome.tsx
import { Link } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./PublicHome.css"; // CSS específico desta tela

export default function PublicHome() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          {/* fundo com gradiente + “brilho” animado */}
          <div className="absolute inset-0 bg-linear-to-br from-[#44F01F] via-[#2ECC4A] to-[#2B8B49]" />
          <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl public-home-animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-10 w-96 h-96 rounded-full bg-white/5 blur-3xl public-home-animate-pulse-slow" />

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              {/* Texto */}
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-medium text-white tracking-wide border border-white/20 public-home-animate-badge-float">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 public-home-animate-ping-once" />
                  Centralize seus documentos de RH em um só lugar
                </span>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-sm">
                  Gestão de documentos inteligente,
                  <br />
                  focada no seu <span className="text-emerald-200">RH</span>.
                </h1>

                <p className="text-sm sm:text-base text-emerald-50/90 max-w-xl">
                  Organize holerites, benefícios, contratos e registros de ponto em um ambiente
                  seguro, rápido e integrado. Menos papel, menos retrabalho, mais tempo para cuidar de pessoas.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    to="/login"
                    className="inline-flex justify-center items-center px-6 py-3 rounded-xl bg-white text-emerald-800 font-semibold text-sm shadow-[0_10px_40px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 hover:shadow-[0_16px_50px_rgba(0,0,0,0.3)] transition-all duration-300"
                  >
                    Entrar agora
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex justify-center items-center px-6 py-3 rounded-xl border border-white/70 text-white font-semibold text-sm hover:bg-white/10 hover:backdrop-blur-md transition-all duration-300"
                  >
                    Criar minha conta
                  </Link>
                </div>

                {/* mini métricas */}
                <div className="flex flex-wrap gap-6 text-xs sm:text-sm text-emerald-50/90 pt-2">
                  <div className="space-y-0.5">
                    <p className="font-bold text-white text-base">+99%</p>
                    <p>dos documentos acessíveis em segundos</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-white text-base">100%</p>
                    <p>focado em compliance e segurança</p>
                  </div>
                </div>
              </div>

              {/* Bloco visual animado (cards) */}
              <div className="relative">
                <div className="relative bg-white/95 rounded-3xl shadow-[0_16px_60px_rgba(0,0,0,0.25)] border border-emerald-100/80 p-5 sm:p-6 lg:p-7 overflow-hidden public-home-animate-card-float">
                  <div className="absolute -top-16 -right-10 w-40 h-40 bg-linear-to-br from-[#44F01F] via-[#2ECC4A] to-[#2B8B49] opacity-30 blur-3xl" />

                  <h2 className="text-sm font-semibold text-slate-900 mb-4">
                    Visão geral dos seus documentos
                  </h2>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 border border-slate-100 hover:border-emerald-300/80 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Holerites</p>
                        <p className="text-[11px] text-slate-500">Acesso organizado por mês e ano</p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                        pronto
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 border border-slate-100 hover:border-emerald-300/80 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Benefícios</p>
                        <p className="text-[11px] text-slate-500">VT, VR, VA e muito mais em um só lugar</p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                        organizado
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 border border-slate-100 hover:border-emerald-300/80 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Documentos gerais</p>
                        <p className="text-[11px] text-slate-500">Contratos, comunicados e comprovantes</p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                        centralizado
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Portal seguro para seu RH e colaboradores</span>
                    <span className="font-medium text-emerald-700">ZionGED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO DE BENEFÍCIOS (tipo “Por que usar?”) */}
        <section className="bg-white py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Por que usar o <span className="text-emerald-700">ZionGED</span> no seu RH?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600">
                Inspirado nos melhores portais de gestão documental, mas pensado para a realidade
                de empresas que vivem o dia a dia do RH.
              </p>
            </header>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                title="Automação inteligente"
                description="Reduza buscas manuais e ganhe tempo com filtros por CPF, ano, tipo de documento e muito mais."
              />
              <FeatureCard
                title="Segurança e privacidade"
                description="Acesso controlado, trilhas de auditoria e documentos protegidos em ambiente seguro."
              />
              <FeatureCard
                title="Experiência do colaborador"
                description="Portal intuitivo para que cada pessoa encontre seus documentos sem depender do RH."
              />
              <FeatureCard
                title="Pronto para integrar"
                description="Arquitetura preparada para integração com folha, ponto e outros sistemas da sua empresa."
              />
            </div>
          </div>
        </section>

        {/* SEÇÃO “COMO FUNCIONA” */}
        <section className="bg-slate-50 py-12 sm:py-16 border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Do upload ao acesso do colaborador, em poucos passos.
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  O ZionGED foi pensado para ser simples de operar e robusto nos bastidores.
                  Você mantém o controle, o sistema cuida do resto.
                </p>

                <ol className="space-y-3 text-sm text-slate-700">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-semibold">
                      1
                    </span>
                    <div>
                      <p className="font-semibold">Envie seus documentos</p>
                      <p className="text-xs text-slate-600">
                        Holerites, benefícios, informes e outros PDFs em lotes ou integrações.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-semibold">
                      2
                    </span>
                    <div>
                      <p className="font-semibold">Indexação inteligente</p>
                      <p className="text-xs text-slate-600">
                        Organização por CPF, matrícula, competência, unidade, centro de custo, etc.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-semibold">
                      3
                    </span>
                    <div>
                      <p className="font-semibold">Portal do colaborador</p>
                      <p className="text-xs text-slate-600">
                        Cada pessoa acessa apenas seus próprios documentos, com histórico completo.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* mini “vitral” de integrações / confiança */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {["Folha", "Ponto", "Benefícios", "Financeiro", "Jurídico", "Outros"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-emerald-100 bg-white px-4 py-6 text-center text-xs font-semibold text-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="mb-2 mx-auto h-7 w-7 rounded-full bg-linear-to-br from-[#44F01F] via-[#2ECC4A] to-[#2B8B49] opacity-80 public-home-animate-pulse-slow" />
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-white py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Pronto para dizer adeus ao papel e ao caos de pastas?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Dê o próximo passo na jornada de transformação digital do seu RH.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex justify-center items-center px-6 py-3 rounded-xl bg-linear-to-r from-[#4b933d] via-[#48cf3e] to-[#318844] text-black font-semibold text-sm shadow-[0_10px_40px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 hover:shadow-[0_16px_50px_rgba(0,0,0,0.3)] transition-all duration-300"
              >
                Criar conta gratuita
              </Link>
              <Link
                to="/login"
                className="inline-flex justify-center items-center px-6 py-3 rounded-xl border border-emerald-600/80 text-emerald-800 font-semibold text-sm hover:bg-emerald-50/60 transition-all duration-300"
              >
                Já sou cliente
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

type FeatureCardProps = {
  title: string;
  description: string;
};

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
      <div className="absolute inset-0 bg-linear-to-br from-[#44F01F] via-[#2ECC4A] to-[#2B8B49] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <div className="relative z-10 space-y-2">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-600">{description}</p>
      </div>
    </div>
  );
}

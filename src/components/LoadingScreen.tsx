// src/components/LoadingScreen.tsx
export default function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
        <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span>Carregando...</span>
      </div>
    </div>
  );
}

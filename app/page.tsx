import Image from "next/image";
import { WalletConnect } from "@/components/wallet-connect";
import { NoteForm } from "@/components/note-form";
import { NoteList } from "@/components/note-list";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans selection:bg-orange-100 dark:selection:bg-orange-900/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20">
              <span className="text-white font-bold text-xl transform -rotate-12 italic">F</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-zinc-900 dark:text-white leading-none">Forever Notes</span>
              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-500 tracking-widest uppercase">CKB On-chain</span>
            </div>
          </div>
          <WalletConnect />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Preserve your thoughts <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                Forever on the CKB.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A simple educational dApp to learn how CKB Cells work.
              Store text directly in the data field and explore the UTXO-like model.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="w-full px-4 flex flex-col gap-16 pb-32">
          <NoteForm />
          <div className="w-full max-w-2xl mx-auto h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
          <NoteList />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-zinc-500 text-sm">
          <div className="flex items-center gap-4">
            <a href="https://nervos.org" target="_blank" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Documentation</a>
            <a href="https://testnet.explorer.nervos.org/" target="_blank" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Explorer</a>
          </div>
          <p>© 2026 CKB Learning Project</p>
        </div>
      </footer>
    </div>
  );
}

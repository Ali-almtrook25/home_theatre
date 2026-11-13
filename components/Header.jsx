import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  return (
    <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 border-b border-purple-300/10 sticky top-0 z-40">
      <div className="flex-1 max-w-xs md:max-w-xl">
        <form action="/" method="get" className="relative group">
          <button type="submit" aria-label="Search" className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[var(--accent)] transition-colors">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
          <input 
            type="text" 
            name="q"
            placeholder="Search..." 
            aria-label="Search media"
            className="w-full bg-[#1a223c]/85 border border-slate-400/20 text-[var(--foreground)] rounded-full py-1.5 md:py-2.5 pl-9 md:pl-12 pr-4 text-xs md:text-sm focus:outline-none focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20 focus:shadow-[0_0_22px_rgba(82,228,255,0.12)] transition-all duration-300 placeholder:text-[var(--muted)]"
          />
        </form>
      </div>
      
      {/* Profile & Notifications */}
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        <button type="button" aria-label="Notifications" className="p-2 md:p-3 hover:bg-cyan-200/10 rounded-full text-zinc-400 hover:text-cyan-100 focus-visible:bg-cyan-200/10 focus-visible:text-cyan-100 transition-colors relative">
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-400 rounded-full shadow-[0_0_10px_rgba(244,114,182,0.8)] animate-pulse"></span>
          <svg className="w-5 h-5 md:w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </button>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-cyan-300 via-purple-400 to-pink-400 p-[2px] shadow-lg shadow-cyan-500/25 active:scale-95 transition-transform">
          <div className="w-full h-full bg-[#151a31] rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold">
            K
          </div>
        </div>
      </div>
    </header>
  );
}
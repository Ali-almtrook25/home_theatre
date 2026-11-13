import Link from 'next/link';

export default function Sidebar() {
  const navItems = [
    { label: 'Home', href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Movies', href: '/?type=movies', icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z' },
    { label: 'TV Shows', href: '/?type=tv', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="neon-sidebar hidden md:flex w-64 text-zinc-300 flex-col h-full border-r z-50">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 drop-shadow-[0_0_16px_rgba(82,228,255,0.28)]">
            STREAMBOX
          </h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all duration-300 group hover:bg-cyan-300/10 hover:text-cyan-100 focus-visible:bg-cyan-300/10 focus-visible:text-cyan-100"
            >
              <svg className="w-5 h-5 text-zinc-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="neon-mobile-nav md:hidden fixed bottom-0 left-0 right-0 h-16 backdrop-blur-xl border-t flex items-center justify-around px-4 z-50">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 w-20 h-full transition-colors text-zinc-400 hover:text-cyan-200 focus-visible:text-cyan-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
            </svg>
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
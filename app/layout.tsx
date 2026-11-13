import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import './globals.css';

export const metadata = {
  title: 'StreamBox Media',
  description: 'Local Media Streaming Platform',
};

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="text-zinc-100 flex flex-col md:flex-row h-screen overflow-hidden antialiased">
        {/* On desktop it sits on the left, on mobile it transforms into a bottom bar */}
        <Sidebar />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden relative pb-16 md:pb-0">
          <Header />
          <main className="app-main flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
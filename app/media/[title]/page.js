import Link from 'next/link';
import { getMediaLibrary } from '@/lib/media';

export default async function SeasonsPage({ params }) {
  const { title } = await params;
  const library = getMediaLibrary();
  const media = library.find(m => m.title === decodeURIComponent(title));

  return (
    <div className="min-h-screen p-5 text-white md:p-8">
      <h1 className="neon-heading mb-8 text-4xl font-black md:text-5xl">{media.title}</h1>
      <Link href="/" className="neon-button mb-8 inline-flex rounded-full px-5 py-3 text-cyan-50">
        Back to Home
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {media.content.map((season, i) => (
          <Link href={`/media/${title}/${i}`} key={i} className="neon-card group relative block h-80 overflow-hidden rounded-2xl cursor-pointer transition-transform duration-300 hover:scale-[1.02] focus-visible:scale-[1.02] md:h-96">
            <img src={season.poster} alt={season.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10152a] via-[#11172a]/35 to-transparent transition-all group-hover:from-[#10152a]/95 group-hover:via-[#11172a]/20" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 p-6">
              <h2 className="text-3xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">{season.name}</h2>
              <p className="mt-1 text-sm text-cyan-100/80">Explore episodes</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
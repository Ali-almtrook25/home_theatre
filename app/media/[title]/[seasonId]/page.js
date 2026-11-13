import Link from 'next/link';
import { getMediaLibrary } from '@/lib/media';
import EpisodeWatchButton from '@/components/EpisodeWatchButton';
import { getEpisodeWatchKey } from '@/lib/watchHistory';

export default async function EpisodesPage({ params }) {
  const { title, seasonId } = await params;
  const library = getMediaLibrary();
  const media = library.find(m => m.title === decodeURIComponent(title));
  const season = media.content[seasonId];
  const mediaPath = `/media/${encodeURIComponent(title)}/${encodeURIComponent(seasonId)}`;

  return (
    <div className="min-h-screen p-4 text-white md:p-8">
      <div className="glass-surface relative mb-8 h-72 w-full overflow-hidden rounded-3xl md:h-80">
        <img src={season.backdrop} alt={season.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10152a] via-[#10152a]/25 to-[#182044]/10" />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(58,199,255,0.10)]" />
        <div className="absolute bottom-8 left-8">
          <Link href={`/media/${title}`} className="neon-button mb-4 inline-flex rounded-full px-4 py-2 text-sm text-cyan-50">← Back to seasons</Link>
          <h2 className="neon-heading text-4xl font-black md:text-5xl">{season.name}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {season.episodes.map((ep, i) => {
          const episodeLabel = `Episode ${ep.number || i + 1}`;
          return (
            <div key={i} className="neon-card relative rounded-2xl">
              <Link
                href={`${mediaPath}/player/${ep.number || i + 1}`}
                className="block rounded-2xl p-6 pr-14 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
              >
                <p className="font-bold text-zinc-100">{episodeLabel}</p>
              </Link>
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <EpisodeWatchButton
                  episodeKey={getEpisodeWatchKey(mediaPath, ep)}
                  episodeLabel={episodeLabel}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
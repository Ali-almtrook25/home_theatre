import { notFound } from 'next/navigation';
import { getMediaLibrary } from '@/lib/media';
import EpisodePlayer from '@/components/EpisodePlayer';

export default async function PlayerPage({ params }) {
  const { title, seasonId, episodeIndex } = await params;
  const requestedEpisodeNumber = Number(episodeIndex);
  if (!Number.isSafeInteger(requestedEpisodeNumber) || requestedEpisodeNumber < 0) {
    notFound();
  }

  const library = getMediaLibrary();
  const media = library.find(m => m.title === decodeURIComponent(title));
  if (!media) notFound();

  const season = media.content[seasonId];
  if (!season) notFound();

  let currentIndex = season.episodes.findIndex(
    (episode, index) => (episode.number || index + 1) === requestedEpisodeNumber
  );

  // Keep old URLs working when they contain a zero-based episode position.
  if (currentIndex === -1 && requestedEpisodeNumber < season.episodes.length) {
    currentIndex = requestedEpisodeNumber;
  }
  if (currentIndex === -1) notFound();

  const episode = season.episodes[currentIndex];
  const mediaPath = `/media/${encodeURIComponent(title)}/${encodeURIComponent(seasonId)}`;

  return (
    <EpisodePlayer
      episode={episode}
      season={season}
      currentIndex={currentIndex}
      mediaPath={mediaPath}
    />
  );
}
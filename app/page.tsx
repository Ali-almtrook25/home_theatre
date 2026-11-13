// app/page.js
import { getMediaLibrary } from '@/lib/media';
import LibraryUI from '@/components/LibraryUI';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q = '', type } = await searchParams;
  const normalizedQuery = q.trim().toLowerCase();
  const heading = type === 'movies' ? 'Movies' : type === 'tv' ? 'TV Shows' : 'All Media';
  const mediaData = getMediaLibrary().filter((media) => {
    const matchesQuery = media.title.toLowerCase().includes(normalizedQuery);
    const matchesType = type === 'movies'
      ? !media.hasSeasons
      : type === 'tv'
        ? media.hasSeasons
        : true;

    return matchesQuery && matchesType;
  });

  return (
    <main>
      <LibraryUI
        mediaData={mediaData}
        heading={heading}
        emptyMessage={normalizedQuery ? 'No media matches your search.' : 'No media found in library.'}
      />
    </main>
  );
}
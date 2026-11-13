'use client';
import Link from 'next/link';

export default function MediaCard({ media, navIndex, onDirectionalKeyDown }) {
  // Use ?. to prevent reading 'poster' from undefined
  const poster = media?.poster || '/default-poster.jpg';
  const title = media?.title || 'Media';

  return (
    <Link
      href={`/media/${encodeURIComponent(media?.title || '')}`}
      data-tv-nav-item
      onKeyDown={(event) => onDirectionalKeyDown?.(event, navIndex)}
      className="neon-card block rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02] focus-visible:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1020]"
      aria-label={`Open ${title}`}
    >
      <div>
        <img 
          src={poster} 
          className="aspect-[2/3] w-full object-cover" 
          alt={title} 
        />
        <div className="bg-gradient-to-b from-[#202744] to-[#171d32] p-4">
          <h3 className="text-white font-bold truncate">{title}</h3>
        </div>
      </div>
    </Link>
  );
}
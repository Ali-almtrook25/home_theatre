'use client';
import { useRef } from 'react';
import MediaCard from './MediaCard';
import { handleGridDirectionalNavigation } from '@/lib/tvNavigation';

export default function LibraryUI({ mediaData, heading, emptyMessage }) {
  const gridRef = useRef(null);

  const handleCardKeyDown = (event, index) => {
    handleGridDirectionalNavigation({
      event,
      index,
      totalItems: mediaData.length,
      container: gridRef.current
    });
  };

  // Defensive check: if mediaData is undefined or empty, return early
  if (!mediaData || mediaData.length === 0) {
    return (
      <div className="p-4 text-white md:p-8">
        <h1 className="neon-heading mb-6 text-3xl font-bold">{heading || 'All Media'}</h1>
        <p className="glass-surface inline-flex rounded-2xl px-5 py-4 text-zinc-300">
          {emptyMessage || 'No media found in library.'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="neon-heading mb-6 text-3xl font-bold">{heading || 'All Media'}</h1>
      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {mediaData.map((media, index) => (
          <MediaCard
            key={index}
            media={media}
            navIndex={index}
            onDirectionalKeyDown={handleCardKeyDown}
          />
        ))}
      </div>
    </div>
  );
}
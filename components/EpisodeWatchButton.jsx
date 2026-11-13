'use client';

import { useCallback, useSyncExternalStore } from 'react';
import {
  isEpisodeWatched,
  setEpisodeWatched,
  subscribeToEpisodeWatchStatus,
} from '@/lib/watchHistory';

export default function EpisodeWatchButton({ episodeKey, episodeLabel }) {
  const subscribe = useCallback(
    (onStoreChange) => subscribeToEpisodeWatchStatus(episodeKey, onStoreChange),
    [episodeKey]
  );
  const getSnapshot = useCallback(() => isEpisodeWatched(episodeKey), [episodeKey]);
  const watched = useSyncExternalStore(subscribe, getSnapshot, () => false);

  return (
    <button
      type="button"
      aria-label={`Mark ${episodeLabel} as ${watched ? 'unwatched' : 'watched'}`}
      aria-pressed={watched}
      title={watched ? 'Mark as unwatched' : 'Mark as watched'}
      onClick={() => setEpisodeWatched(episodeKey, !watched)}
      className={`rounded-full p-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${
        watched ? 'text-blue-400 hover:text-blue-300' : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      <svg
        className="h-5 w-5"
        fill={watched ? 'currentColor' : 'none'}
        stroke="currentColor"
        style={{ color: watched ? '#3b82f6' : '#71717a' }}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>
  );
}

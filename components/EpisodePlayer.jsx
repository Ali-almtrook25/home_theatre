'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef } from 'react';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';
import EpisodeWatchButton from '@/components/EpisodeWatchButton';
import { getEpisodeWatchKey, setEpisodeWatched } from '@/lib/watchHistory';

export default function EpisodePlayer({ episode, season, currentIndex, mediaPath }) {
  const episodeListRef = useRef(null);
  const selectedEpisodeRef = useRef(null);
  const episodeWatchKey = getEpisodeWatchKey(mediaPath, episode);

  useLayoutEffect(() => {
    const list = episodeListRef.current;
    const selectedEpisode = selectedEpisodeRef.current;
    if (!list || !selectedEpisode) return;

    const selectedTop = selectedEpisode.getBoundingClientRect().top
      - list.getBoundingClientRect().top
      + list.scrollTop;
    list.scrollTo({
      top: selectedTop - (list.clientHeight - selectedEpisode.clientHeight) / 2,
      behavior: 'smooth',
    });
  }, [currentIndex]);

  useEffect(() => {
    setEpisodeWatched(episodeWatchKey, true);
  }, [episodeWatchKey]);

  const playerPath = `${mediaPath}/player`;
  const previousEpisode = currentIndex > 0 ? season.episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < season.episodes.length - 1
    ? season.episodes[currentIndex + 1]
    : null;

  return (
    <div className="player-overlay">
      <div className="player-stage">
        <CustomVideoPlayer
          key={episode.url}
          src={episode.url}
          autoPlay
          onPlay={() => setEpisodeWatched(episodeWatchKey, true)}
        />
        <div className="player-controls">
          {previousEpisode ? (
            <Link
              href={`${playerPath}/${previousEpisode.number || currentIndex}`}
              className="neon-button rounded-full px-8 py-3 text-cyan-50"
            >
              Prev
            </Link>
          ) : (
            <button disabled className="rounded-full border border-slate-400/15 bg-slate-700/20 px-8 py-3 opacity-40">
              Prev
            </button>
          )}
          <Link href={mediaPath} className="rounded-full border border-pink-300/40 bg-pink-500/20 px-8 py-3 text-pink-100 shadow-[0_0_22px_rgba(244,114,182,0.12)] transition hover:bg-pink-500/35 hover:shadow-[0_0_26px_rgba(244,114,182,0.25)]">
            Close
          </Link>
          {nextEpisode ? (
            <Link
              href={`${playerPath}/${nextEpisode.number || currentIndex + 2}`}
              className="neon-button rounded-full px-8 py-3 text-cyan-50"
            >
              Next
            </Link>
          ) : (
            <button disabled className="rounded-full border border-slate-400/15 bg-slate-700/20 px-8 py-3 opacity-40">
              Next
            </button>
          )}
        </div>
      </div>
      <div ref={episodeListRef} className="player-episodes">
        <h3 className="neon-heading mb-6 text-xl font-bold">{season.name}</h3>
        {season.episodes.map((ep, index) => {
          const episodeLabel = `Episode ${ep.number || index + 1}`;
          return (
            <div
              key={index}
              className={`mb-3 flex items-center rounded-xl border transition-colors ${currentIndex === index ? 'border-cyan-200/50 bg-cyan-400/15 shadow-[0_0_20px_rgba(82,228,255,0.12)]' : 'border-slate-300/10 bg-white/[0.04] hover:border-cyan-200/25 hover:bg-cyan-300/[0.07]'}`}
            >
              <Link
                href={`${playerPath}/${ep.number || index + 1}`}
                ref={index === currentIndex ? selectedEpisodeRef : null}
                aria-current={index === currentIndex ? 'page' : undefined}
                className="flex-1 rounded-xl p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
              >
                {episodeLabel}
              </Link>
              <div className="pr-2">
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

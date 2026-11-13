'use client';
import { useState } from 'react';
import SeasonGrid from './SeasonGrid';
import EpisodeList from './EpisodeList';
import VideoPlayer from './VideoPlayer';

export default function MediaDetails({ media }) {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = (delta) => {
    const newIdx = currentIndex + delta;
    if (newIdx >= 0 && newIdx < selectedSeason.episodes.length) {
      setPlayingVideo(selectedSeason.episodes[newIdx]);
      setCurrentIndex(newIdx);
    }
  };

  return (
    <div className="w-full text-white">
      {playingVideo && (
        <VideoPlayer 
          episode={playingVideo} season={selectedSeason} currentIndex={currentIndex} 
          onClose={() => setPlayingVideo(null)} onNavigate={navigate} 
        />
      )}
      
      <h1 className="neon-heading p-8 text-5xl font-black">{media.title}</h1>

      {!selectedSeason ? (
        <SeasonGrid content={media.content} onSelect={setSelectedSeason} />
      ) : (
        <EpisodeList 
          season={selectedSeason} onBack={() => setSelectedSeason(null)} 
          onSelectEpisode={(ep, i) => { setPlayingVideo(ep); setCurrentIndex(i); }} 
        />
      )}
    </div>
  );
}
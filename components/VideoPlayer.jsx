import CustomVideoPlayer from './CustomVideoPlayer';

export default function VideoPlayer({ episode, season, currentIndex, onClose, onNavigate }) {
  const handleEpisodeKey = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onNavigate(index - currentIndex);
    }
  };

  return (
    <div className="video-player-modal fixed inset-0 z-50 flex bg-[radial-gradient(ellipse_at_18%_10%,rgba(100,75,255,0.18),transparent_38%),radial-gradient(ellipse_at_90%_80%,rgba(39,194,255,0.12),transparent_40%),linear-gradient(145deg,#11172b,#090d1c)]">
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <CustomVideoPlayer key={episode.url} src={episode.url} autoPlay />
        <div className="mt-6 flex gap-4">
          <button type="button" disabled={currentIndex === 0} onClick={() => onNavigate(-1)} className="neon-button rounded-full px-8 py-3 text-cyan-50 disabled:opacity-30">Previous</button>
          <button type="button" onClick={onClose} className="rounded-full border border-pink-300/40 bg-pink-500/20 px-8 py-3 text-pink-100 hover:bg-pink-500/35">Close</button>
          <button type="button" disabled={currentIndex === season.episodes.length - 1} onClick={() => onNavigate(1)} className="neon-button rounded-full px-8 py-3 text-cyan-50 disabled:opacity-30">Next</button>
        </div>
      </div>
      <div className="video-player-sidebar w-80 overflow-y-auto border-l border-cyan-200/15 bg-[#11172bea] p-6 backdrop-blur-xl">
        <h3 className="neon-heading mb-6 text-xl font-bold">{season.name}</h3>
        {season.episodes.map((ep, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => onNavigate(i - currentIndex)}
            onKeyDown={(event) => handleEpisodeKey(event, i)}
            className={`mb-3 cursor-pointer rounded-xl border p-4 transition-colors ${currentIndex === i ? 'border-cyan-200/50 bg-cyan-400/15 shadow-[0_0_20px_rgba(82,228,255,0.12)]' : 'border-slate-300/10 bg-white/[0.04] hover:border-cyan-200/25 hover:bg-cyan-300/[0.07]'}`}
            aria-label={`Play Episode ${ep.number || i + 1}`}
          >
            Episode {ep.number || i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
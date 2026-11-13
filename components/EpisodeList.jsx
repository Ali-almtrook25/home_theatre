import { useRef } from 'react';
import { handleGridDirectionalNavigation } from '@/lib/tvNavigation';

export default function EpisodeList({ season, onBack, onSelectEpisode }) {
    const gridRef = useRef(null);

    const handleKeySelect = (event, ep, index) => {
        handleGridDirectionalNavigation({
            event,
            index,
            totalItems: season.episodes.length,
            container: gridRef.current
        });

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelectEpisode(ep, index);
        }
    };

    return (
        <div className="p-8">
            <div className="glass-surface relative mb-8 h-80 w-full overflow-hidden rounded-3xl">
                <img src={season.backdrop} alt={season.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10152a] via-[#10152a]/25 to-transparent" />
                <div className="absolute bottom-8 left-8">
                    <button type="button" onClick={onBack} className="neon-button mb-4 rounded-full px-4 py-2 text-cyan-50">Back to Seasons</button>
                    <h2 className="neon-heading text-5xl font-black">{season.name}</h2>
                </div>
            </div>
            <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {season.episodes.map((ep, i) => (
                    <div
                        key={i}
                        data-tv-nav-item
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelectEpisode(ep, i)}
                        onKeyDown={(event) => handleKeySelect(event, ep, i)}
                        className="neon-card cursor-pointer rounded-2xl p-6 text-center transition"
                        aria-label={`Play Episode ${ep.number || i + 1}`}
                    >
                        <p className="font-bold">Episode {ep.number || i + 1}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
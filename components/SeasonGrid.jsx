import { useRef } from 'react';
import { handleGridDirectionalNavigation } from '@/lib/tvNavigation';

export default function SeasonGrid({ content, onSelect }) {
    const gridRef = useRef(null);

    const handleSelect = (season) => {
        onSelect(season);
    };

    const handleKeySelect = (event, season, index) => {
        handleGridDirectionalNavigation({
            event,
            index,
            totalItems: content.length,
            container: gridRef.current
        });

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect(season);
        }
    };

    return (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
            {content.map((season, i) => (
                <div
                    key={i}
                    data-tv-nav-item
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(season)}
                    onKeyDown={(event) => handleKeySelect(event, season, i)}
                    className="neon-card cursor-pointer group relative h-96 w-72 overflow-hidden rounded-2xl hover:scale-[1.02] focus-visible:scale-[1.02] transition-transform duration-300"
                    aria-label={`Open ${season.name}`}
                >
                    <img src={season.poster} alt={season.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10152a]/95 via-[#11172a]/30 to-transparent transition-all group-hover:from-[#10152a]/75" />
                    <div className="absolute bottom-0 left-0 p-6">
                        <h2 className="text-3xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">{season.name}</h2>
                    </div>
                </div>
            ))}
        </div>
    );
}
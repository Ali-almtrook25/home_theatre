import fs from 'fs';
import path from 'path';

export function getMediaLibrary() {
    // const pathsToRead = ['/home/kali/Videos', '/home/kali/usb2/movies/'];
    const pathsToRead = ['/home/kali/usb2/movies/'];

    let allSeries = [];

    pathsToRead.forEach(baseDir => {
        if (fs.existsSync(baseDir)) {
            const dirs = fs.readdirSync(baseDir)
                .filter(d => fs.statSync(path.join(baseDir, d)).isDirectory());
            
            const processed = dirs.map(series => processDirectory(baseDir, series));
            allSeries = [...allSeries, ...processed];
        }
    });
    return allSeries;
}

function processDirectory(baseDir, series) {
    const seriesPath = path.join(baseDir, series);
    const items = fs.readdirSync(seriesPath);
    const hasSeasons = items.some(item => fs.statSync(path.join(seriesPath, item)).isDirectory());

    return {
        title: series,
        poster: `/api/stream?file=${encodeURIComponent(path.join(seriesPath, 'poster.jpg'))}`,
        backdrop: `/api/stream?file=${encodeURIComponent(path.join(seriesPath, 'backdrop.jpg'))}`,
        hasSeasons,
        content: hasSeasons
            ? items.filter(d => fs.statSync(path.join(seriesPath, d)).isDirectory()).map(s => ({
                id: s,
                name: `Season ${s}`,
                poster: `/api/stream?file=${encodeURIComponent(path.join(seriesPath, s, 'poster.jpg'))}`,
                backdrop: `/api/stream?file=${encodeURIComponent(path.join(seriesPath, s, 'backdrop.jpg'))}`,
                episodes: fs.readdirSync(path.join(seriesPath, s))
                    .filter(f => f.endsWith('.mp4') || f.endsWith('.mkv'))
                    .map(ep => {
                        const epMatch = ep.match(/EP(\d+)/i);
                        const numberMatch = ep.match(/(\d+)(?=\.[^.]+$)/);
                        const episodeNumber = epMatch ? parseInt(epMatch[1], 10) : (numberMatch ? parseInt(numberMatch[0], 10) : 0);
                        return {
                            name: ep.replace(/\.[^/.]+$/, ""),
                            number: episodeNumber,
                            url: `/api/stream?file=${encodeURIComponent(path.join(seriesPath, s, ep))}`
                        };
                    }).sort((a, b) => a.number - b.number)
            }))
            : []
    };
}
import { NextResponse } from 'next/server';
import fs from 'fs';
import { execFile, spawn } from 'child_process';
import { Readable } from 'stream';

const QUALITY_HEIGHTS = new Set([360, 480, 720, 1080]);

function probeVideo(filePath) {
    return new Promise((resolve) => {
        execFile(
            'ffprobe',
            ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=height:format=duration', '-of', 'json', filePath],
            { timeout: 15000 },
            (error, stdout) => {
                if (error) return resolve({ duration: 0, height: 0 });
                try {
                    const data = JSON.parse(stdout);
                    resolve({
                        duration: Number(data.format?.duration) || 0,
                        height: Number(data.streams?.[0]?.height) || 0,
                    });
                } catch {
                    resolve({ duration: 0, height: 0 });
                }
            }
        );
    });
}

function transcodeVideo(request, filePath, height, start) {
    const args = ['-v', 'error'];
    if (start > 0) args.push('-ss', String(start));
    args.push(
        '-i', filePath,
        '-map', '0:v:0', '-map', '0:a:0?',
        '-vf', `scale=-2:${height}`,
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '128k',
        '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
        '-f', 'mp4', 'pipe:1'
    );

    const ffmpeg = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'ignore'] });
    const stop = () => ffmpeg.kill('SIGKILL');
    request.signal.addEventListener('abort', stop);
    ffmpeg.on('close', () => request.signal.removeEventListener('abort', stop));

    return new NextResponse(Readable.toWeb(ffmpeg.stdout), {
        headers: {
            'Content-Type': 'video/mp4',
            'Cache-Control': 'no-store',
        },
    });
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('file');

    if (!filePath || !fs.existsSync(filePath)) {
        return new NextResponse("File not found", { status: 404 });
    }

    if (searchParams.get('info') === '1') {
        return NextResponse.json(await probeVideo(filePath));
    }

    const height = Number(searchParams.get('height'));
    if (QUALITY_HEIGHTS.has(height)) {
        const start = Math.max(0, Number(searchParams.get('start')) || 0);
        return transcodeVideo(request, filePath, height, start);
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });

        return new NextResponse(file, {
            status: 206,
            headers: {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            },
        });
    } else {
        const file = fs.createReadStream(filePath);
        return new NextResponse(file, {
            headers: {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            },
        });
    }
}
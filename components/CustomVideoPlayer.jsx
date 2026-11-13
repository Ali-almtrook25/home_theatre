'use client';

import { useEffect, useRef, useState } from 'react';

const SKIP_BACK_SECONDS = 5;
const SKIP_FORWARD_SECONDS = 10;
const QUALITY_HEIGHTS = [1080, 720, 480, 360];
const CONTROLS_HIDE_DELAY = 3000;

function formatTime(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00';
  const seconds = Math.floor(totalSeconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

function Icon({ children }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export default function CustomVideoPlayer({ src, autoPlay = false, onPlay, className = '' }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hideTimerRef = useRef(null);
  // Applied once the next source finishes loading (seek position + resume state).
  const pendingRef = useRef({ rel: 0, play: autoPlay });

  const [info, setInfo] = useState(null);
  const [quality, setQuality] = useState('original');
  const [offset, setOffset] = useState(0);
  const [time, setTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [scrub, setScrub] = useState(null);
  const [paused, setPaused] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activity, setActivity] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${src}&info=1`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setInfo(data))
      .catch(() => {});
    return () => controller.abort();
  }, [src]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => () => clearTimeout(hideTimerRef.current), []);

  const isOriginal = quality === 'original';
  const mediaSrc = isOriginal ? src : `${src}&height=${quality}&start=${offset}`;
  const duration = info?.duration || (isOriginal ? videoDuration : 0);
  const current = offset + time;
  const shownTime = scrub ?? current;
  const progress = duration > 0 ? Math.min(100, (shownTime / duration) * 100) : 0;
  const controlsVisible = activity || paused || menuOpen;

  const qualityOptions = info?.height
    ? QUALITY_HEIGHTS.filter((height) => height < info.height)
    : [];
  const qualityLabel = isOriginal ? 'Original' : `${quality}p`;

  const showControls = () => {
    setActivity(true);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setActivity(false), CONTROLS_HIDE_DELAY);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const seekTo = (requested) => {
    const video = videoRef.current;
    if (!video) return;
    const target = Math.min(Math.max(requested, 0), duration || Infinity);

    if (isOriginal) {
      video.currentTime = target;
      return;
    }

    // Transcoded streams only contain data from `offset`, so seeking outside the
    // buffered range restarts the stream at the requested time.
    const rel = target - offset;
    const bufferedEnd = video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0;
    if (rel >= 0 && rel <= bufferedEnd - 0.5) {
      video.currentTime = rel;
    } else if (target === offset) {
      video.currentTime = 0;
    } else {
      pendingRef.current = { rel: 0, play: !video.paused };
      setOffset(target);
      setTime(0);
    }
  };

  const skip = (delta) => {
    seekTo(current + delta);
    showControls();
  };

  const changeQuality = (nextQuality) => {
    setMenuOpen(false);
    if (nextQuality === quality) return;
    const video = videoRef.current;
    const resumeAt = current;
    pendingRef.current = {
      rel: nextQuality === 'original' ? resumeAt : 0,
      play: video ? !video.paused : autoPlay,
    };
    setError(false);
    setQuality(nextQuality);
    setOffset(nextQuality === 'original' ? 0 : resumeAt);
    setTime(nextQuality === 'original' ? resumeAt : 0);
  };

  const commitScrub = () => {
    if (scrub === null) return;
    seekTo(scrub);
    setScrub(null);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current?.requestFullscreen?.();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) video.muted = !video.muted;
  };

  const handleVolumeChange = (event) => {
    const video = videoRef.current;
    if (!video) return;
    const next = Number(event.target.value);
    video.volume = next;
    video.muted = next === 0;
  };

  const handleKeyDown = (event) => {
    showControls();
    if (event.target instanceof HTMLInputElement) return;
    const onContainer = event.target === containerRef.current;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      skip(-SKIP_BACK_SECONDS);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      skip(SKIP_FORWARD_SECONDS);
    } else if (onContainer && (event.key === ' ' || event.key === 'k')) {
      event.preventDefault();
      togglePlay();
    } else if (onContainer && event.key === 'f') {
      toggleFullscreen();
    } else if (onContainer && event.key === 'm') {
      toggleMute();
    } else if (event.key === 'Escape' && menuOpen) {
      setMenuOpen(false);
    }
  };

  const handleLoadedMetadata = (event) => {
    const video = event.currentTarget;
    const { rel, play } = pendingRef.current;
    pendingRef.current = { rel: 0, play: false };

    if (Number.isFinite(video.duration)) setVideoDuration(video.duration);
    setError(false);
    setBuffering(false);
    if (rel > 0) video.currentTime = rel;
    if (play) video.play().catch(() => {});
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseMove={showControls}
      onTouchStart={showControls}
      className={`custom-player ${className}`}
    >
      <video
        ref={videoRef}
        src={mediaSrc}
        playsInline
        onClick={togglePlay}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onPlay={() => {
          setPaused(false);
          showControls();
          onPlay?.();
        }}
        onPause={() => setPaused(true)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onError={() => setError(true)}
        onVolumeChange={(event) => {
          setVolume(event.currentTarget.volume);
          setMuted(event.currentTarget.muted);
        }}
      />

      {(buffering || error) && (
        <div className="cp-status" role="status">
          {error ? 'Unable to play this video' : 'Loading…'}
        </div>
      )}

      <div className={`cp-controls ${controlsVisible ? '' : 'cp-hidden'}`}>
        <input
          type="range"
          className="cp-seek"
          aria-label="Seek"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(shownTime, duration || 0)}
          style={{ '--cp-progress': `${progress}%` }}
          onChange={(event) => setScrub(Number(event.target.value))}
          onPointerUp={commitScrub}
          onKeyUp={commitScrub}
          onBlur={commitScrub}
        />

        <div className="cp-row">
          <button type="button" className="cp-btn" onClick={togglePlay} aria-label={paused ? 'Play' : 'Pause'}>
            {paused ? (
              <Icon><path d="M7 4l13 8-13 8z" fill="currentColor" /></Icon>
            ) : (
              <Icon><path d="M8 5v14M16 5v14" /></Icon>
            )}
          </button>

          <button type="button" className="cp-btn cp-skip" onClick={() => skip(-SKIP_BACK_SECONDS)} aria-label={`Back ${SKIP_BACK_SECONDS} seconds`}>
            <Icon><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" /></Icon>
            <span>{SKIP_BACK_SECONDS}s</span>
          </button>

          <button type="button" className="cp-btn cp-skip" onClick={() => skip(SKIP_FORWARD_SECONDS)} aria-label={`Forward ${SKIP_FORWARD_SECONDS} seconds`}>
            <span>{SKIP_FORWARD_SECONDS}s</span>
            <Icon><path d="M13 17l5-5-5-5M6 17l5-5-5-5" /></Icon>
          </button>

          <span className="cp-time">{formatTime(shownTime)} / {formatTime(duration)}</span>

          <span className="cp-spacer" />

          <button type="button" className="cp-btn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
            {muted || volume === 0 ? (
              <Icon><path d="M11 5L6 9H3v6h3l5 4zM22 9l-6 6M16 9l6 6" /></Icon>
            ) : (
              <Icon><path d="M11 5L6 9H3v6h3l5 4zM15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" /></Icon>
            )}
          </button>
          <input
            type="range"
            className="cp-volume"
            aria-label="Volume"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            style={{ '--cp-progress': `${(muted ? 0 : volume) * 100}%` }}
            onChange={handleVolumeChange}
          />

          <div className="cp-quality">
            <button
              type="button"
              className="cp-btn cp-quality-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={`Quality: ${qualityLabel}`}
            >
              {qualityLabel}
            </button>
            {menuOpen && (
              <div className="cp-menu" role="menu">
                {['original', ...qualityOptions].map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="menuitemradio"
                    aria-checked={quality === option}
                    className={`cp-menu-item ${quality === option ? 'cp-menu-item-active' : ''}`}
                    onClick={() => changeQuality(option)}
                  >
                    {option === 'original'
                      ? `Original${info?.height ? ` (${info.height}p)` : ''}`
                      : `${option}p`}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="button" className="cp-btn" onClick={toggleFullscreen} aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            {isFullscreen ? (
              <Icon><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></Icon>
            ) : (
              <Icon><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></Icon>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

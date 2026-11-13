const WATCH_HISTORY_EVENT = 'streambox:watch-history-change';
const WATCHED_EPISODE_PREFIX = 'streambox:watched-episode:';

export function getEpisodeWatchKey(mediaPath, episode) {
  return `${WATCHED_EPISODE_PREFIX}${JSON.stringify([mediaPath, episode.url])}`;
}

export function isEpisodeWatched(key) {
  return window.localStorage.getItem(key) === '1';
}

export function setEpisodeWatched(key, watched) {
  if (watched) {
    window.localStorage.setItem(key, '1');
  } else {
    window.localStorage.removeItem(key);
  }

  window.dispatchEvent(new CustomEvent(WATCH_HISTORY_EVENT, {
    detail: { key, watched },
  }));
}

export function subscribeToEpisodeWatchStatus(key, onChange) {
  const handleChange = (event) => {
    if (event.type === 'storage') {
      if (event.key === key) onChange();
      return;
    }

    if (event.detail.key === key) onChange();
  };

  window.addEventListener(WATCH_HISTORY_EVENT, handleChange);
  window.addEventListener('storage', handleChange);

  return () => {
    window.removeEventListener(WATCH_HISTORY_EVENT, handleChange);
    window.removeEventListener('storage', handleChange);
  };
}

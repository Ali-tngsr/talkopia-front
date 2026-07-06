'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  poster?: string;
  title?: string;
  emoji?: string;
  videoUrl?: string | null;
}

/**
 * Self-hosted styled video player. Uses a mock <video> element that
 * simulates playback with progress bar animation (no real video file).
 */
export function VideoPlayer({ title, emoji = '🦊', videoUrl }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100
  const [duration, setDuration] = useState(524); // seconds
  const [showControls, setShowControls] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setPlaying(false);
            return 100;
          }
          return p + 0.15;
        });
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing]);

  const fmt = (sec: number) => {
    const m = Math.floor((sec / 100) * duration / 60);
    const s = Math.floor(((sec / 100) * duration) % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current && videoUrl) {
      if (videoRef.current.paused) videoRef.current.play();
      else videoRef.current.pause();
    } else {
      setPlaying((p) => !p);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 2500);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, pct)));
  };

  const fullscreen = () => {
    const el = document.getElementById('talkotopia-player');
    if (el) {
      if (document.fullscreenElement) document.exitFullscreen();
      else el.requestFullscreen?.();
    }
  };

  return (
    <div
      id="talkotopia-player"
      className="relative aspect-video w-full overflow-hidden rounded-[2rem] bg-[#5E6646] shadow-2xl ring-1 ring-white/10"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Real video element if URL provided */}
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="absolute inset-0 h-full w-full object-contain"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            setDuration(v.duration || 524);
            setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onClick={togglePlay}
          playsInline
        />
      ) : (
        /* Faux video surface — animated gradient with mascot */
        <div className={`absolute inset-0 bg-gradient-to-br from-[#9EB766] via-[#F1BD79]/40 to-[#5E6646] transition-opacity duration-500 ${progress > 5 ? 'opacity-90' : 'opacity-100'}`}>
          <div className="grid h-full place-items-center">
            <div className={`text-[8rem] transition-transform duration-1000 ${playing ? 'scale-110' : 'scale-100'}`}>{emoji}</div>
          </div>
          {!playing && progress === 0 && title && (
            <div className="absolute bottom-8 start-8 end-8 rounded-2xl bg-black/30 p-4 backdrop-blur-sm">
              <p className="text-sm font-black uppercase tracking-wider text-white/80">Now playing</p>
              <h3 className="text-2xl font-black text-white drop-shadow-md">{title}</h3>
            </div>
          )}
        </div>
      )}

      {/* Big center play button */}
      {!playing && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 grid place-items-center"
          aria-label="Play"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 shadow-2xl transition hover:scale-110 sm:h-20 sm:w-20">
            <Play className="h-7 w-7 fill-[#5E6646] text-[#5E6646] ms-1 sm:h-9 sm:w-9" />
          </span>
        </button>
      )}

      {/* Controls bar */}
      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-3 pb-3 pt-10 transition-opacity duration-300 sm:px-5 sm:pb-4 sm:pt-12 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Progress bar */}
        <div
          className="group mb-2 h-1.5 cursor-pointer rounded-full bg-white/25 sm:mb-3"
          onClick={seek}
        >
          <div
            className="relative h-full rounded-full bg-[#F1BD79] transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          >
            <span className="absolute -end-2 -top-1 h-3.5 w-3.5 rounded-full bg-white opacity-0 shadow-md transition group-hover:opacity-100" />
          </div>
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white hover:bg-white/15 sm:h-9 sm:w-9" aria-label="Back 10s">
              <SkipBack className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/15 text-white hover:bg-white/25 sm:h-10 sm:w-10" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 fill-current sm:h-5 sm:w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white hover:bg-white/15 sm:h-9 sm:w-9" aria-label="Forward 10s">
              <SkipForward className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <span className="ms-1 font-mono text-[10px] font-bold tabular-nums sm:ms-2 sm:text-xs">
              {fmt(progress)} / {fmt(100)}
            </span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white hover:bg-white/15 sm:h-9 sm:w-9" onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Unmute' : 'Mute'}>
              {muted ? <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="hidden h-9 w-9 rounded-full text-white hover:bg-white/15 sm:inline-flex" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white hover:bg-white/15 sm:h-9 sm:w-9" onClick={fullscreen} aria-label="Fullscreen">
              <Maximize className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

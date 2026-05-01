import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  isMine?: boolean;
}

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ src, isMine = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoadedMeta = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(
        audio.duration ? (audio.currentTime / audio.duration) * 100 : 0,
      );
    };
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };
    audio.addEventListener("loadedmetadata", onLoadedMeta);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  const seekToRatio = (clientX: number, rect: DOMRect) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const ratio = (clientX - rect.left) / rect.width;
    audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    seekToRatio(e.clientX, e.currentTarget.getBoundingClientRect());
  };

  const handleSeekKey = (e: React.KeyboardEvent) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (e.key === "ArrowRight")
      audio.currentTime = Math.min(audio.currentTime + 2, audio.duration);
    if (e.key === "ArrowLeft")
      audio.currentTime = Math.max(audio.currentTime - 2, 0);
  };

  // Generate deterministic waveform bars from src string
  const barCount = 28;
  const bars = Array.from({ length: barCount }, (_, i) => {
    const h = 25 + (((i * 7 + src.charCodeAt(i % src.length)) % 10) / 10) * 55;
    return { id: `wbar-${i}`, h };
  });

  const trackColor = isMine ? "bg-primary-foreground/30" : "bg-border";
  const fillColor = isMine ? "bg-primary-foreground/80" : "bg-primary";
  const playBtnClass = isMine
    ? "bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
    : "bg-primary/20 hover:bg-primary/30 text-primary";

  return (
    <div className="flex items-center gap-2.5 min-w-[180px]">
      <audio ref={audioRef} src={src} preload="metadata">
        <track kind="captions" />
      </audio>

      <button
        type="button"
        onClick={togglePlay}
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-smooth ${playBtnClass}`}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
      </button>

      <div className="flex-1 flex flex-col gap-1.5">
        {/* Waveform seek button */}
        <button
          type="button"
          className="flex items-center gap-[2px] h-7 cursor-pointer w-full"
          onClick={handleSeekClick}
          onKeyDown={handleSeekKey}
          aria-label="Seek audio position"
        >
          {bars.map(({ id, h }, i) => {
            const pct = (i / barCount) * 100;
            const active = pct <= progress;
            return (
              <div
                key={id}
                className={`rounded-full w-[3px] shrink-0 transition-colors duration-100 ${active ? fillColor : trackColor}`}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </button>

        {/* Progress track seek */}
        <button
          type="button"
          className={`h-0.5 w-full rounded-full ${trackColor} cursor-pointer relative overflow-hidden`}
          onClick={handleSeekClick}
          onKeyDown={handleSeekKey}
          aria-label="Seek audio"
        >
          <div
            className={`h-full rounded-full transition-all duration-100 ${fillColor}`}
            style={{ width: `${progress}%` }}
          />
        </button>
      </div>

      <span
        className={`text-[10px] font-mono shrink-0 tabular-nums ${isMine ? "text-primary-foreground/65" : "text-muted-foreground"}`}
      >
        {playing || currentTime > 0
          ? formatDuration(currentTime)
          : formatDuration(duration)}
      </span>
    </div>
  );
}

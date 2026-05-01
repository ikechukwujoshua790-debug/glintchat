import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MediaType } from "../backend";
import { useGetMediaDownloadUrl } from "../hooks/useBackend";
import { AudioPlayer } from "./AudioPlayer";

interface MediaMessageProps {
  mediaUrl: string;
  mediaType: MediaType;
  isMine: boolean;
  onImageClick?: (url: string) => void;
}

export function MediaMessage({
  mediaUrl,
  mediaType,
  isMine,
  onImageClick,
}: MediaMessageProps) {
  const getUrl = useGetMediaDownloadUrl();
  const getUrlRef = useRef(getUrl.mutateAsync);
  getUrlRef.current = getUrl.mutateAsync;

  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    getUrlRef
      .current(mediaUrl)
      .then((url) => {
        if (!cancelled) {
          setResolvedUrl(url);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [mediaUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-36 h-20 rounded-xl bg-muted">
        <Loader2 size={18} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !resolvedUrl) {
    return (
      <div className="flex items-center justify-center w-36 h-12 rounded-xl bg-muted">
        <span className="text-[11px] text-muted-foreground">
          Media unavailable
        </span>
      </div>
    );
  }

  if (mediaType === MediaType.audio) {
    return <AudioPlayer src={resolvedUrl} isMine={isMine} />;
  }

  if (mediaType === MediaType.image) {
    return (
      <button
        type="button"
        className="block rounded-xl overflow-hidden max-w-[220px] focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={() => onImageClick?.(resolvedUrl)}
        aria-label="View full-size media"
      >
        <img
          src={resolvedUrl}
          alt="Shared media"
          className="w-full h-auto object-cover"
          style={{ maxHeight: "240px" }}
        />
      </button>
    );
  }

  if (mediaType === MediaType.video) {
    return (
      <div className="relative rounded-xl overflow-hidden max-w-[220px]">
        <video
          src={resolvedUrl}
          controls
          className="w-full rounded-xl"
          style={{ maxHeight: "200px" }}
          aria-label="Shared video"
        >
          <track kind="captions" />
        </video>
      </div>
    );
  }

  return null;
}
